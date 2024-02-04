import { base64Decode, generateSignature } from "./utils";

export type PaymentCompleteResponse = {
  r: number;
  e: string; // SUCCESS label
  m: string; // Merchant ID
  o: string; // Order ID
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
): { orderId: string; status: Status } {
  const payload = base64Decode(responseBase64);
  const response = JSON.parse(payload) as PaymentCompleteResponse;

  validatedSignature(payload, signature);

  return {
    orderId: response.o,
    status: response.e as Status,
  };
}
