import { z } from "zod";
import { ObjectId } from "mongodb";
import { getDB } from "../mongodb";
import { Domain, Optional } from "../types";

export const userSchema = z.object({
  _id: z.instanceof(ObjectId),
  email: z.string().email(),
});

export type User = z.infer<typeof userSchema>;

export async function getUser(email: string): Promise<Optional<Domain<User>>> {
  try {
    const db = await getDB();
    const document = await db.collection("users").findOne({
      email: email,
    });

    if (!document) {
      console.log("No such user found");
      return null;
    }

    const { _id, ...rest } = userSchema.parse(document);

    return {
      id: document._id.toHexString(),
      ...rest,
    };
  } catch (error) {
    console.error("Could not retrieve user", error);
    throw error;
  }
}

export async function getUserById(
  userId: string
): Promise<Optional<Domain<User>>> {
  try {
    const db = await getDB();
    const document = await db.collection("users").findOne({
      _id: ObjectId.createFromHexString(userId),
    });

    if (!document) {
      console.log("No such user found");
      return null;
    }

    const { _id, ...rest } = userSchema.parse(document);

    return {
      id: document._id.toHexString(),
      ...rest,
    };
  } catch (error) {
    console.error("Could not retrieve user", error);
    throw error;
  }
}

export async function createUser(email: string): Promise<string> {
  try {
    const db = await getDB();
    const document = await db.collection("users").insertOne({
      email: email,
    });

    return document.insertedId.toHexString();
  } catch (error) {
    console.error("Could not create user", error);
    throw error;
  }
}
