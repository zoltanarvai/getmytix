import AWS from "aws-sdk";
import { z } from "zod";

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const queueURL = process.env.TICKETS_QUEUE_URL;

const ticketGenerationRequestSchema = z.object({
  orderId: z.string(),
  tickets: z.array(
    z.object({
      ticketTypeId: z.string(),
      ticketType: z.string(),
      ticketId: z.string(),
    })
  ),
  eventDetails: z.object({
    name: z.string(),
    logo: z.string(),
    description: z.string(),
    notes: z.string(),
    startDate: z.string(),
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
  const result = await sqs
    .sendMessage({
      QueueUrl: queueURL!,
      MessageBody: JSON.stringify(message),
    })
    .promise();

  if (result.MessageId) {
    console.log(
      `Ticket generation message sent successfully: ${result.MessageId}`
    );
  }
}
