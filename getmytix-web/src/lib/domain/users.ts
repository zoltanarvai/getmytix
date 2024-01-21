import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDB } from "../mongodb";

export const userSchema = z.object({
  _id: z.instanceof(ObjectId),
  id: z.string(),
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;

export async function getUser(email: string): Promise<User | null> {
  try {
    const db = await getDB();
    const document = await db.collection("users").findOne({
      email: email,
    });

    if (!document) {
      console.log("No such user found");
      return null;
    }

    const user = userSchema.parse({
      ...document,
      id: document._id.toHexString(),
    });

    return user;
  } catch (error) {
    console.error("Could not retrieve user", error);
    throw error;
  }
}

export async function createUser(email: string): Promise<User> {
  try {
    const db = await getDB();
    const document = await db.collection("users").insertOne({
      email: email,
    });

    const user = userSchema.parse({
      ...document,
      id: document.insertedId.toHexString(),
      email: email,
    });

    return user;
  } catch (error) {
    console.error("Could not create user", error);
    throw error;
  }
}
