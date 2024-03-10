import {z} from "zod";
import {SQS} from "@aws-sdk/client-sqs";

const sqs = new SQS({apiVersion: "2012-11-05", region: "eu-central-1"});

const queueURL = process.env.INVOICING_QUEUE_URL;

const invoicingDetailsSchema = z.object({
    id: z.string(),
    orderId: z.string(),
    invoiceDate: z.string(),
    invoicePrefix: z.string(),
    comment: z.string().optional(),
    seller: z.object({
        bank: z.string(),
        accountNumber: z.string(),
    }),
    billingDetails: z.object({
        name: z.string(),
        taxNumber: z.string().optional(),
        address: z.string(),
        email: z.string(),
        city: z.string(),
        zip: z.string(),
    }),
    items: z.array(
        z.object({
            itemId: z.string(),
            itemType: z.string(),
            itemTitle: z.string(),
            quantity: z.number(),
            unitPrice: z.number(),
            comment: z.string().optional(),
        })
    ),
    invoiceCallbackUrl: z.string(),
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
