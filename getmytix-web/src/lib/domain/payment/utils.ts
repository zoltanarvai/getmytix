import crypto from "crypto";

const merchantKey: string = process.env.MERCHANT_KEY!;

if (!merchantKey) {
  throw new Error("Merchant key not found");
}

export function generateSignature(message: string) {
  const hmac = crypto.createHmac("sha384", merchantKey);
  hmac.update(message);
  return hmac.digest("base64");
}

export function generateRandomSalt(length: number): string {
  return crypto.randomBytes(length).toString("hex");
}

export function calculateTimeout(minutesToAdd: number) {
  const now = new Date();
  now.setMinutes(now.getMinutes() + minutesToAdd);

  // Convert to ISO string and remove milliseconds
  return now.toISOString().replace(/\.\d{3}/, "");
}

export function base64Decode(encodedString: string) {
  const buffer = Buffer.from(encodedString, "base64");
  return buffer.toString("utf-8");
}
