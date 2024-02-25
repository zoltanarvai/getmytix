import {z} from "zod";
import dayjs from "dayjs";
import {orders, payment} from "@/lib/domain";

const requestSchema = z.object({
    salt: z.string(),
    orderRef: z.string(),
    method: z.string(),
    merchant: z.string(),
    finishDate: z.string(),
    paymentDate: z.string(),
    transactionId: z.number(),
    status: z.union([
        z.literal("FINISHED"),
        z.literal("AUTHORIZED"),
        z.literal("REFUND"),
        z.literal("REVERSED"),
        z.literal("TIMEOUT"),
    ]),
});

export async function POST(request: Request) {
    if (process.env.NODE_ENV !== "development") {
        // validate API key
        const signature = request.headers.get("Signature");
        if (!signature) {
            return Response.json({error: "Request must be signed"}, {status: 400});
        }
    }

    // validate request body
    const body = await request.json();

    console.info("Request headers", request.headers);
    console.info("Request body", body);

    const validatedRequest = requestSchema.parse(body);

    const order = await orders.getOrder(validatedRequest.orderRef);
    if (!order) {
        return Response.json({error: "No such order"}, {status: 400});
    }

    if (validatedRequest.status === "REFUND") {
        await orders.updateOrderStatus(validatedRequest.orderRef, "refunded", {
            transactionId: validatedRequest.transactionId,
            paymentProvider: "simplepay",
        });
    }

    if (validatedRequest.status === "FINISHED") {
        await orders.fulfill(order.id, validatedRequest.transactionId, "simplepay");
    }

    const responseBody = JSON.stringify({
        ...validatedRequest,
        receiveDate: dayjs().format("YYYY-MM-DDTHH:mm:ssZZ"), // "2019-09-09T14:46:20+0200",
    });

    return new Response(responseBody, {
        status: 200,
        headers: {
            "Content-Type": "application/json",
            Signature: payment.generateSignature(responseBody),
        },
    });
}
