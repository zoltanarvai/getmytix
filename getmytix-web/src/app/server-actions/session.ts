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

  const user = await users.getUser(email);
  let userId = user?.id;

  if (!user) {
    userId = await users.createUser(email);
  }

  const sessionId = await session.createSessionId(userId!);

  return sessionId;
}
