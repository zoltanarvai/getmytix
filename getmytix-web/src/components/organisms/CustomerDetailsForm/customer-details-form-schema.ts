import {z} from "zod";

export const formSchema = z.object({
    name: z.string().min(3, {
        message: "A nevednek legalább 3 karakternek kell lennie",
    }),
    email: z.string().email({
        message: "Helytelen e-mail cím formátum",
    }),
    street: z.string().min(3, {
        message: "A címednek legalább 3 karakternek kell lennie",
    }),
    streetNumber: z.string().min(1, {
        message: "A házszámodnak legalább 1 karakternek kell lennie",
    }),
    city: z.string().min(3, {
        message: "A városodnak legalább 3 karakternek kell lennie",
    }),
    zip: z.string().min(4, {
        message: "Az irányítószámodnak legalább 4 karakternek kell lennie",
    }),
    state: z.string().min(2, {
        message: "Az államodnak legalább 2 karakternek kell lennie",
    }),
    country: z.string().min(2, {
        message: "Az országodnak legalább 2 karakternek kell lennie",
    }),
    taxNumber: z.union([
        z.string().regex(/^\d{8}-\d{1}-\d{2}$/, {
            message: "Hibás adószám. A várt formátum: XXXXXXXX-Y-ZZ",
        }),
        z.literal("")
    ]).optional(),
    phone: z.string().optional(),
});

export type CustomerData = z.infer<typeof formSchema>;
