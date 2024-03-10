import * as uuid from "uuid";
import {Domain} from "@/lib/types";
import * as clients from "../clients";
import * as events from "../events";
import * as invoices from "../invoices";
import * as shoppingCarts from "../shopping-cart";
import * as tickets from "../tickets";
import * as repository from "./repository";

export type Order = Domain<repository.OrderRecord>;
export type CustomerOrderDetails = repository.CustomerDetailsRecord;

export function isPaid(order: Order): boolean {
    return order.history.some((event) => event.event === "paid");
}

export function isCancelled(order: Order): boolean {
    return order.history.some((event) => event.event === "cancelled");
}

export async function getOrder(orderId: string): Promise<Order> {
    console.info("Getting order", orderId);

    const order = await repository.getOrder(orderId);
    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    return {
        id: order._id.toHexString(),
        ...order,
    };
}

export async function getOrderByUniqueId(uniqueId: string): Promise<Order> {
    console.info("Getting order by uniqueId", uniqueId);

    const order = await repository.getOrderByUniqueId(uniqueId);
    if (!order) {
        throw new Error(`Order with uniqueId ${uniqueId} not found`);
    }

    return {
        id: order._id.toHexString(),
        ...order,
    };
}

export async function batchCreateOrder(
    clientId: string,
    eventId: string,
    orderDetails: {
        ticketTypeId: string;
        fullName?: string;
        companyName: string;
        position?: string;
        email: string;
    }[]
): Promise<string[]> {
    console.info(`Creating orders for client ${clientId} and event ${eventId}`, clientId, orderDetails);

    const orders: repository.CreateOrder[] = orderDetails.map(order => ({
        customerDetails: {
            id: "n/a",
            email: order.email,
            name: order.companyName,
            street: "n/a",
            streetNumber: "n/a",
            city: "n/a",
            zip: "n/a",
            state: "n/a",
            country: "n/a",
        },
        orderUniqueId: uuid.v4(),
        eventId,
        items: [{
            itemId: order.ticketTypeId,
            unitPrice: 0,
            guestName: order.fullName,
            companyName: order.companyName,
            position: order.position,
        }],
        shoppingCartId: "n/a",
        clientId,
        history: [
            {
                timestamp: new Date().toUTCString(),
                event: "created",
            },
        ],
    }));

    const createdOrderIds = await repository.batchCreateOrders(orders)
    return createdOrderIds;
}

export async function createOrder(
    shoppingCartId: string,
    clientId: string,
    customerDetails: CustomerOrderDetails
): Promise<string> {
    console.info("Creating order", shoppingCartId, customerDetails);

    const shoppingCart = await shoppingCarts.getShoppingCart(shoppingCartId);

    const order: repository.CreateOrder = {
        customerDetails,
        orderUniqueId: uuid.v4(),
        eventId: shoppingCart.eventId,
        items: shoppingCart.items,
        shoppingCartId,
        clientId,
        history: [
            {
                timestamp: new Date().toUTCString(),
                event: "created",
            },
        ],
    };

    const orderId = await repository.createOrder(order);

    console.info("Order created", orderId);

    return orderId;
}

export async function calculateTotalOrderValue(
    orderId: string
): Promise<number> {
    console.info("Calculating total order value", orderId);

    const order = await repository.getOrder(orderId);
    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    const total = order.items.reduce((acc, ticket) => {
        return acc + ticket.unitPrice;
    }, 0);

    return total;
}

export async function cancel(
    orderId: string,
    transactionId: number,
    paymentProvider: "simplepay"
): Promise<void> {
    console.info("cancelling order", orderId);

    const order = await getOrder(orderId);
    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    if (isCancelled(order)) {
        console.warn("Order already cancelled", orderId);
        return;
    }

    if (isPaid(order)) {
        console.warn("Cannot cancel Order as it's already paid", orderId);
        return;
    }

    const historyItem: repository.HistoryItem = {
        timestamp: new Date().toISOString(),
        event: "cancelled",
        metadata: {
            transactionId,
            paymentProvider,
        },
    };

    await repository.addHistoryItem(orderId, historyItem);
    await shoppingCarts.deleteCart(order.shoppingCartId);

    console.info("Order cancelled", orderId);
}

export async function fulfill(
    orderId: string,
    transactionId: number,
    paymentProvider: "simplepay" | "none"
): Promise<void> {
    console.info("fullfilling order", orderId);

    const order = await getOrder(orderId);
    if (!order) {
        throw new Error(`Order ${orderId} not found`);
    }

    if (isCancelled(order)) {
        console.warn("Cannot fulfill cancelled order", orderId);
        return;
    }

    if (isPaid(order)) {
        console.warn("Order already paid", orderId);
        return;
    }

    const historyItem: repository.HistoryItem = {
        timestamp: new Date().toISOString(),
        event: "paid",
        metadata: {
            transactionId,
            paymentProvider,
        },
    };

    await repository.addHistoryItem(orderId, historyItem);

    const event = await events.getEventById(order.eventId);
    if (!event) {
        throw new Error(`Event ${order.eventId} not found`);
    }

    const client = await clients.getClientById(order.clientId);
    if (!client) {
        throw new Error(`Client ${order.clientId} cannot be found`);
    }

    await tickets.generateTickets(order, event, client);
    await invoices.generateInvoice(order, event, client);
    await shoppingCarts.deleteCart(order.shoppingCartId);

    console.info("Order fulfilled", orderId);
}

export async function batchFulfillOrders(orderIds: string[], client: clients.Client, event: events.Event) {
    console.info("batch fulfilling orders", orderIds);

    for (let orderId of orderIds) {
        const order = await getOrder(orderId);
        if (!order) {
            throw new Error(`Order ${orderId} not found`);
        }

        if (isPaid(order)) {
            console.warn("Order already paid", orderId);
            continue;
        }

        const historyItem: repository.HistoryItem = {
            timestamp: new Date().toISOString(),
            event: "paid"
        };

        await repository.addHistoryItem(orderId, historyItem);
        await tickets.generateTickets(order, event, client);

        console.info("Order fulfilled", orderId);
    }

    console.info("orders fulfilled");
}

export async function updateOrderStatus(
    orderId: string,
    status: repository.OrderStatus,
    metadata?: Record<string, any>
): Promise<void> {
    console.info("updating order status", orderId, status);

    await repository.addHistoryItem(orderId, {
        timestamp: new Date().toUTCString(),
        event: status,
        metadata,
    });

    console.info("Order status updated", orderId, status);
}
