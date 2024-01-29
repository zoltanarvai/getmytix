import AWS from "aws-sdk";
import { z } from "zod";

const sqs = new AWS.SQS({ apiVersion: "2012-11-05" });

const queueURL = process.env.INVOICING_QUEUE_URL;

const invoicingDetailsSchema = z.object({
  orderId: z.string(),
  customerDetails: z.object({
    name: z.string(),
    street: z.string(),
    streetNumber: z.string(),
    city: z.string(),
    zip: z.string(),
    state: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  tickets: z.array(
    z.object({
      ticketTypeId: z.string(),
      ticketType: z.string(),
      quantity: z.number(),
      unitPrice: z.number(),
    })
  ),
});

export type InvoiceGenerationRequest = z.infer<typeof invoicingDetailsSchema>;

export async function generateInvoice(
  details: InvoiceGenerationRequest
): Promise<void> {
  const message = invoicingDetailsSchema.parse(details);

  // Send the message to the specified queue
  const result = await sqs
    .sendMessage({
      QueueUrl: queueURL!,
      MessageBody: JSON.stringify(message),
    })
    .promise();

  if (result.MessageId) {
    console.log(`Invoice message sent successfully: ${result.MessageId}`);
  }
}
