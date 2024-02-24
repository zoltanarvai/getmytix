import {z} from "zod";
import {SQS} from "@aws-sdk/client-sqs";

const sqs = new SQS({apiVersion: "2012-11-05", region: "eu-central-1"});

const queueURL = process.env.TICKETS_QUEUE_URL;

const ticketGenerationRequestSchema = z.object({
    orderId: z.string(),
    orderUniqueId: z.string(),
    orderCallbackUrl: z.string(),
    tickets: z.array(
        z.object({
            ticketUniqueId: z.string(),
            ticketTypeId: z.string(),
            ticketType: z.string(),
            ticketId: z.string(),
            unitPrice: z.number(),
            ticketCode: z.string(),
            ticketCallbackUrl: z.string(),
            guestName: z.string().optional(),
            companyName: z.string().optional(),
            position: z.string().optional()
        })
    ),
    eventDetails: z.object({
        id: z.string(),
        name: z.string(),
        subdomain: z.string(),
        logo: z.string(),
        description: z.string(),
        notes: z.string(),
        startDate: z.string(),
        endDate: z.string().optional(),
        address: z.object({
            street: z.string(),
            city: z.string(),
            zipCode: z.string(),
        }),
    }),
    customerDetails: z.object({
        name: z.string(),
        email: z.string().email(),
    }),
});

export type TicketGenerationRequest = z.infer<
    typeof ticketGenerationRequestSchema
>;

export async function generateTickets(
    details: TicketGenerationRequest
): Promise<void> {
    const message = ticketGenerationRequestSchema.parse(details);

    // Send the message to the specified queue
    const result = await sqs.sendMessage({
        QueueUrl: queueURL!,
        MessageBody: JSON.stringify(message),
    });

    if (result.MessageId) {
        console.log(
            `Ticket generation message sent successfully: ${result.MessageId}`
        );
    }
}
