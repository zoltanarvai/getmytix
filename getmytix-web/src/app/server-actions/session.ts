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
  const request = createSessionPropsSchema.parse(createSessionProps);

  const { email } = request;

  const customer = await customers.getCustomerByEmail(email);
  let customerId = customer?.id;

  if (!customerId) {
    customerId = await customers.createCustomer(email);
  }

  const { id } = await session.createSession(customerId);

  return id;
}
