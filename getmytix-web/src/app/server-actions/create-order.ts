"use server";

import { CreateOrder } from "@/lib/domain/orders";
import { orders, session, users } from "@/lib/domain";
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
  shoppingCart: z.object({
    sessionId: z.string(),
    subdomain: z.string(),
  }),
});

type CreateOrderProps = z.infer<typeof createOrderSchema>;

export async function createOrder(
  createOrderRequest: CreateOrderProps
): Promise<string> {
  const validRequest = createOrderSchema.parse(createOrderRequest);
  const currentSession = await session.getSession(
    validRequest.shoppingCart.sessionId
  );
  const user = await users.getUserById(currentSession.userId);

  if (!user) {
    throw new Error("User not found");
  }

  const order: CreateOrder = {
    sessionId: validRequest.shoppingCart.sessionId,
    user,
    subdomain: validRequest.shoppingCart.subdomain,
    customerDetails: validRequest.customerDetails,
    shoppingCart: {
      ...validRequest.shoppingCart,
      tickets: {},
    },
    history: [
      {
        timestamp: new Date().toUTCString(),
        event: "created",
      },
    ],
  };

  const orderId = await orders.createOrder(order);

  return orderId;
}
