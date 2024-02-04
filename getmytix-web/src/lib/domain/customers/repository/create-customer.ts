import { getDB } from "@/lib/mongodb";

export async function createCustomer(email: string): Promise<string> {
  try {
    const db = await getDB();
    const document = await db.collection("customers").insertOne({
      email: email,
      createdAt: new Date().toUTCString(),
      updatedAt: new Date().toUTCString(),
    });

    return document.insertedId.toHexString();
  } catch (error) {
    console.error("Could not create customer", error);
    throw error;
  }
}
