import {getDB} from "@/lib/mongodb";
import {CreateInvoice, createInvoiceSchema, InvoiceRecord} from "./schema"

export async function createInvoice(createInvoice: CreateInvoice): Promise<InvoiceRecord> {
    try {
        const entry = createInvoiceSchema.parse(createInvoice);

        const newInvoice = {
            ...entry,
            createdAt: new Date().toUTCString(),
            updatedAt: new Date().toUTCString(),
        }

        const db = await getDB();
        const result = await db.collection("invoices").insertOne(newInvoice);

        return {
            _id: result.insertedId,
            ...newInvoice
        };
    } catch (error) {
        console.error("Could not create order", error);
        throw error;
    }
}
