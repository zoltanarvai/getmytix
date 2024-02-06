import { z } from "zod";
import {
  calculateTimeout,
  generateRandomSalt,
  generateSignature,
} from "./utils";

const merchantKey: string = process.env.MERCHANT_KEY!;
const merchant: string = process.env.MERCHANT_ID!;

const paymentResponseSchema = z.object({
  salt: z.string(),
  merchant: z.string(),
  orderRef: z.string(),
  currency: z.string(),
  transactionId: z.number(),
  timeout: z.string(),
  total: z.number(),
  paymentUrl: z.string(),
});

export type PaymentStartResponse = z.infer<typeof paymentResponseSchema>;

if (!merchantKey) {
  throw new Error("Merchant key not found");
}

async function sendRequest(message: any, url: string) {
  const payload = JSON.stringify(message);
  const signature = generateSignature(payload);

  const headers = {
    "Content-Type": "application/json",
    Signature: signature,
  };

  const response = await fetch(url, {
    method: "POST",
    headers: headers,
    body: payload,
  });

  return response;
}

export async function createPayment(
  orderId: string,
  customerEmail: string,
  amount: string,
  redirectUrl: string,
  invoiceDetails: {
    name: string;
    company: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    address: string;
  }
): Promise<PaymentStartResponse> {
  const message = {
    salt: generateRandomSalt(16),
    merchant: merchant,
    orderRef: orderId,
    currency: "HUF",
    customerEmail,
    language: "HU",
    sdkVersion:
      "SimplePayV2.1_Payment_PHP_SDK_2.0.7_190701:dd236896400d7463677a82a47f53e36e",
    methods: ["CARD"],
    total: amount,
    timeout: calculateTimeout(5),
    urls: {
      success: `${redirectUrl}/simplepay/success`,
      fail: `${redirectUrl}/simplepay/fail`,
      cancel: `${redirectUrl}/simplepay/cancel`,
      timeout: `${redirectUrl}/simplepay/timeout`,
    },
    invoice: invoiceDetails,
    threeDSReqAuthMethod: "01",
  };

  const response = await sendRequest(
    message,
    "https://sandbox.simplepay.hu/payment/v2/start"
  );

  if (response.ok) {
    const responseBody = await response.json();
    console.info("Payment response", responseBody);

    return paymentResponseSchema.parse(responseBody);
  } else {
    throw new Error("Failed to create payment - " + (await response.text()));
  }
}
