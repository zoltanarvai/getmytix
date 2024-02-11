import { Domain, Maybe } from "@/lib/types";
import * as repository from "./repository";

export type Customer = Domain<repository.CustomerRecord>;

export async function getCustomerByEmail(
  email: string
): Promise<Maybe<Customer>> {
  console.info("Getting customer by email", email);

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
  console.info("Getting customer by id", customerId);

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

export async function createCustomer(email: string): Promise<Customer> {
  console.info("Creating customer", email);

  const { _id, ...rest } = await repository.createCustomer(email);

  console.info("Customer created", _id.toHexString());

  return {
    id: _id.toHexString(),
    ...rest,
  };
}
