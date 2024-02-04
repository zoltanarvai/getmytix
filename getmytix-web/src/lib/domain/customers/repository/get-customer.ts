import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDB } from "@/lib/mongodb";
import { Maybe } from "@/lib/types";

export const customerSchema = z.object({
  _id: z.instanceof(ObjectId),
  email: z.string().email(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type CustomerRecord = z.infer<typeof customerSchema>;

export async function getCustomerByEmail(
  email: string
): Promise<Maybe<CustomerRecord>> {
  try {
    const db = await getDB();
    const document = await db.collection("customers").findOne({
      email: email,
    });

    if (!document) {
      console.log("No such customer found");
      return null;
    }

    return customerSchema.parse(document);
  } catch (error) {
    console.error("Could not retrieve customer", error);
    throw error;
  }
}

export async function getCustomerById(
  customerId: string
): Promise<Maybe<CustomerRecord>> {
  try {
    const db = await getDB();
    const document = await db.collection("customers").findOne({
      _id: ObjectId.createFromHexString(customerId),
    });

    if (!document) {
      console.log("No such customer found");
      return null;
    }

    return customerSchema.parse(document);
  } catch (error) {
    console.error("Could not retrieve customer", error);
    throw error;
  }
}
