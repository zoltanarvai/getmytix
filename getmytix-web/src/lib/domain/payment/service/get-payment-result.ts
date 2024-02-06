import { base64Decode, generateSignature } from "./utils";

type PaymentCompleteResponse = {
  r: number; // response code
  t: number; // Transaction ID
  e: "SUCCESS" | "FAIL" | "CANCEL" | "TIMEOUT"; // event
  m: string; // Merchant ID
  o: string; // Order ID
};

export type PaymentResult = {
  orderId: string;
  status: "SUCCESS" | "FAIL" | "CANCEL" | "TIMEOUT";
  transactionId: number;
  merchantId: string;
  responseCode: number;
};

export type Status = "SUCCESS";

function validatedSignature(message: string, signature: string) {
  const validatedSignature = generateSignature(message);

  if (validatedSignature !== signature) {
    throw new Error("Invalid signature");
  }
}

export function getValidatedResponse(
  responseBase64: string,
  signature: string
): PaymentResult {
  const payload = base64Decode(responseBase64);
  const response = JSON.parse(payload) as PaymentCompleteResponse;

  validatedSignature(payload, signature);

  return {
    orderId: response.o,
    status: response.e,
    transactionId: response.t,
    merchantId: response.m,
    responseCode: response.r,
  };
}
