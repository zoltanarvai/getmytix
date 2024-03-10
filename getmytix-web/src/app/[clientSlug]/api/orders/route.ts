import {z} from "zod";
import {clients, events, orders} from "@/lib/domain";

const requestSchema = z.object({
    eventId: z.string(),
    orders: z.array(z.object({
        ticketTypeId: z.string(),
        fullName: z.string().optional(),
        companyName: z.string(),
        position: z.string().optional(),
        email: z.string(),
    }))
});

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY not set");
}

export async function POST(request: Request) {
    // validate API key
    const xApiKey = request.headers.get("x-api-key");
    if (xApiKey !== apiKey) {
        return Response.json({error: "Unauthorized"}, {status: 401});
    }

    // validate request body
    const body = await request.json();
    console.info("Request body", body);

    const createOrderRequest = requestSchema.parse(body);

    // get ticket id from URL
    const url = new URL(request.url);
    const fragments = url.pathname.split("/").filter(fragment => fragment.length > 0);
    const clientSlug = fragments[0];

    const client = await clients.getClientBySlug(clientSlug);
    if (!client) {
        return Response.json({error: "No client found"}, {status: 400})
    }

    const event = await events.getEventById(createOrderRequest.eventId);
    if (!event) {
        return Response.json({error: "No client found"}, {status: 400})
    }

    // Create a bunch of orders
    const orderIds = await orders.batchCreateOrder(client.id, createOrderRequest.eventId, createOrderRequest.orders);

    // Fulfill them individually
    await orders.batchFulfillOrders(orderIds, client, event);
    
    return Response.json({status: "ok"});
}
