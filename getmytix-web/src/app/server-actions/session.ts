"use server";
import { z } from "zod";
import { session, users } from "@/lib/domain";

const createSessionPropsSchema = z.object({
  email: z.string().email(),
});

type CreateSessionProps = z.infer<typeof createSessionPropsSchema>;

export async function createSession(
  createSessionProps: CreateSessionProps
): Promise<string> {
  const request = createSessionPropsSchema.parse(createSessionProps);

  const { email } = request;

  // Make sure the user exists
  // TODO do something with the session
  let user = await users.getUser(email);
  if (!user) {
    await users.createUser(email);
  }

  const sessionId = await session.createSessionId();

  return sessionId;
}
