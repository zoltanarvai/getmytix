import {
  calculateTimeout,
  generateRandomSalt,
  generateSignature,
} from "./utils";

const merchantKey: string = process.env.MERCHANT_KEY!;
const merchant: string = process.env.MERCHANT_ID!;

type PaymentStartResponse = {
  salt: string;
  merchant: string;
  orderRef: string;
  currency: string;
  transactionId: number;
  timeout: string;
  total: number;
  paymentUrl: string;
};

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
  redirectUrl: string
) {
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
    url: redirectUrl,
  };

  const response = await sendRequest(
    message,
    "https://sandbox.simplepay.hu/payment/v2/start"
  );

  if (response.ok) {
    const paymentResponse = (await response.json()) as PaymentStartResponse;
    return paymentResponse;
  } else {
    throw new Error("Failed to create payment - " + (await response.text()));
  }
}
