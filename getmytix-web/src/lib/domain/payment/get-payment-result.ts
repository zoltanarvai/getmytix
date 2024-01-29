import { base64Decode, generateSignature } from "./utils";

type PaymentCompleteResponse = {
  r: number;
  e: string; // SUCCESS label
  m: string; // Merchant ID
  o: string; // Order ID
};

function validatedSignature(message: string, signature: string) {
  const validatedSignature = generateSignature(message);

  if (validatedSignature !== signature) {
    throw new Error("Invalid signature");
  }
}

export function getValidatedResponse(
  responseBase64: string,
  signature: string
): { orderId: string; status: "SUCCESS" } {
  const payload = base64Decode(responseBase64);
  const response = JSON.parse(payload) as PaymentCompleteResponse;

  validatedSignature(payload, signature);

  return {
    orderId: response.o,
    status: response.e as "SUCCESS",
  };
}
