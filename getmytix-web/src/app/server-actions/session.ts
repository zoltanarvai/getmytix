"use server";

import { z } from "zod";
import { session, customers } from "@/lib/domain";

const createSessionPropsSchema = z.object({
  email: z.string().email(),
});

type CreateSessionProps = z.infer<typeof createSessionPropsSchema>;

export async function createSession(
  createSessionProps: CreateSessionProps
): Promise<string> {
  console.info("Creating session", createSessionProps);

  const request = createSessionPropsSchema.parse(createSessionProps);

  const { email } = request;

  const customer = await customers.getCustomerByEmail(email);
  let customerId = customer?.id;

  if (!customerId) {
    const customer = await customers.createCustomer(email);
    customerId = customer.id;
  }

  const { id } = await session.createSession(customerId);

  return id;
}
