import {z} from "zod";

const requestSchema = z.object({
    eventId: z.string(),
    orders: z.array(z.object({
        ticketTypeId: z.string(),
        fullName: z.string().optional(),
        companyName: z.string().optional(),
        position: z.string().optional(),
        email: z.string(),
    }))
});

const apiKey = process.env.API_KEY;
if (!apiKey) {
    throw new Error("API_KEY not set");
}

export async function POST(request: Request) {
    // validate API key
    const xApiKey = request.headers.get("x-api-key");
    if (xApiKey !== apiKey) {
        return Response.json({error: "Unauthorized"}, {status: 401});
    }

    // validate request body
    const body = await request.json();
    console.info("Request body", body);

    const createOrderRequest = requestSchema.parse(body);

    // get ticket id from URL
    const url = new URL(request.url);
    const fragments = url.pathname.split("/");
    const clientSlug = fragments[0];

    console.log(">>>> createOrderRequest", JSON.stringify(createOrderRequest, null, 4))
    console.log(">>>> clientSlug", clientSlug);


    return Response.json({status: "ok"});
}
