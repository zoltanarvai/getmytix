"use server";

import { orders, payment, session, users, events } from "@/lib/domain";
import { z } from "zod";

const createOrderSchema = z.object({
  customerDetails: z.object({
    name: z.string(),
    street: z.string(),
    streetNumber: z.string(),
    city: z.string(),
    zip: z.string(),
    state: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  sessionId: z.string(),
  subdomain: z.string(),
  shoppingCartId: z.string(),
});

type CreateOrderProps = z.infer<typeof createOrderSchema>;

export async function createOrder(
  createOrderRequest: CreateOrderProps
): Promise<string> {
  const validRequest = createOrderSchema.parse(createOrderRequest);

  const currentSession = await session.getSession(validRequest.sessionId);
  const user = await users.getUserById(currentSession.userId);
  const event = await events.getEvent(validRequest.subdomain);

  if (!user) {
    throw new Error("User not found");
  }

  if (!event) {
    throw new Error("Event not found");
  }

  // At this point the shopping cart is already created explaining which ticket type the user wants to buy
  // and how many. Tickets are not reserved yet.
  const orderId = await orders.Order.createOrder(
    validRequest.shoppingCartId,
    validRequest.customerDetails,
    user,
    event
  );

  // We know the total amount based on the basket value and what's being ordered
  const totalAmount = await orders.Order.calculateTotal(orderId);

  // Kick off Payment
  const paymentResponse = await payment.createPayment(
    orderId,
    user.email,
    totalAmount.toString(),
    `http://${event.subdomain}.localhost:3000/checkout-complete`
  );

  return paymentResponse.paymentUrl;
}
