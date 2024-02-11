import { getDB } from "@/lib/mongodb";
import { CustomerRecord } from "./schema";

export async function createCustomer(email: string): Promise<CustomerRecord> {
  try {
    const db = await getDB();

    const customer = {
      email: email,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    };

    const document = await db.collection("customers").insertOne(customer);

    return {
      _id: document.insertedId,
      ...customer,
    };
  } catch (error) {
    console.error("Could not create customer", error);
    throw error;
  }
}
