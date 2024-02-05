import { z } from "zod";
import { orders } from "@/lib/domain";

const requestSchema = z.object({
  status: z.literal("delivered"),
});

const apiKey = process.env.API_KEY;
if (!apiKey) {
  throw new Error("API_KEY not set");
}

export async function POST(request: Request) {
  // validate API key
  const xApiKey = request.headers.get("x-api-key");
  if (xApiKey !== apiKey) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  // validate request body
  const body = await request.json();
  const updateRequest = requestSchema.parse(body);

  // get ticket id from URL
  const url = new URL(request.url);
  const fragments = url.pathname.split("/");
  const orderId = fragments[fragments.length - 1];

  await orders.updateOrderStatus(orderId, updateRequest.status);

  return Response.json({ status: "ok" });
}
