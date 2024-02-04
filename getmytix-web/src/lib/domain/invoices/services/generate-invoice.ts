import { z } from "zod";
import { SQS } from "@aws-sdk/client-sqs";

const sqs = new SQS({ apiVersion: "2012-11-05", region: "eu-central-1" });

const queueURL = process.env.INVOICING_QUEUE_URL;

const invoicingDetailsSchema = z.object({
  orderId: z.string(),
  billingDetails: z.object({
    name: z.string(),
    street: z.string(),
    streetNumber: z.string(),
    city: z.string(),
    zip: z.string(),
    state: z.string(),
    country: z.string(),
    phone: z.string().optional(),
  }),
  items: z.array(
    z.object({
      itemId: z.string(),
      itemType: z.string(),
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
  const result = await sqs.sendMessage({
    QueueUrl: queueURL!,
    MessageBody: JSON.stringify(message),
  });

  if (result.MessageId) {
    console.log(`Invoice message sent successfully: ${result.MessageId}`);
  }
}
