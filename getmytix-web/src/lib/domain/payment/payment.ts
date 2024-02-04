import * as service from "./service";

export type CreatePaymentProps = {
  orderId: string;
  customerEmail: string;
  amount: string;
  redirectUrl: string;
};

export async function createPayment({
  orderId,
  customerEmail,
  amount,
  redirectUrl,
}: CreatePaymentProps): Promise<service.PaymentStartResponse> {
  const paymentResponse = await service.createPayment(
    orderId,
    customerEmail,
    amount,
    redirectUrl
  );

  return paymentResponse;
}

export function validatePaymentResponse(
  paymentResponse: string,
  signature: string
) {
  return service.getValidatedResponse(paymentResponse, signature);
}
