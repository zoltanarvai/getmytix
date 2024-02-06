import * as service from "./service";

export type CreatePaymentProps = {
  orderId: string;
  customerEmail: string;
  amount: string;
  redirectBaseUrl: string;
  invoiceDetails: {
    name: string;
    company: string;
    country: string;
    state: string;
    city: string;
    zip: string;
    address: string;
  };
};

export async function createPayment({
  orderId,
  customerEmail,
  amount,
  redirectBaseUrl,
  invoiceDetails,
}: CreatePaymentProps): Promise<service.PaymentStartResponse> {
  const paymentResponse = await service.createPayment(
    orderId,
    customerEmail,
    amount,
    redirectBaseUrl,
    invoiceDetails
  );

  return paymentResponse;
}

export function getPaymentResponse(paymentResponse: string, signature: string) {
  return service.getValidatedResponse(paymentResponse, signature);
}

export function generateSignature(message: string) {
  return service.generateSignature(message);
}
