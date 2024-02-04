import { Domain, Maybe } from "@/lib/types";
import * as repository from "./repository";

export type Customer = Domain<repository.CustomerRecord>;

export async function getCustomerByEmail(
  email: string
): Promise<Maybe<Customer>> {
  const customer = await repository.getCustomerByEmail(email);

  if (!customer) {
    return null;
  }

  const { _id, ...rest } = customer;

  return {
    id: _id.toHexString(),
    ...rest,
  };
}

export async function getCustomerById(
  customerId: string
): Promise<Maybe<Customer>> {
  const customer = await repository.getCustomerById(customerId);

  if (!customer) {
    return null;
  }

  const { _id, ...rest } = customer;

  return {
    id: _id.toHexString(),
    ...rest,
  };
}

export async function createCustomer(email: string): Promise<string> {
  const id = await repository.createCustomer(email);

  return id;
}
