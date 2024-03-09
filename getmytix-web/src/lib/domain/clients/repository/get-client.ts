import {ObjectId} from "mongodb";
import {getDB} from "@/lib/mongodb";
import {Maybe} from "@/lib/types";
import {ClientRecord, clientSchema} from "./schema";

export async function getClientBySlug(
    slug: string
): Promise<Maybe<ClientRecord>> {
    try {
        const db = await getDB();
        const document = await db.collection("clients").findOne({
            slug: slug,
        });

        if (!document) {
            console.log("No such client found");
            return null;
        }

        return clientSchema.parse(document);
    } catch (error) {
        console.error("Could not retrieve client", error);
        throw error;
    }
}

export async function getClientById(
    clientId: string
): Promise<Maybe<ClientRecord>> {
    try {
        const db = await getDB();
        const document = await db.collection("clients").findOne({
            _id: ObjectId.createFromHexString(clientId),
        });

        if (!document) {
            console.log("No such client found");
            return null;
        }

        return clientSchema.parse(document);
    } catch (error) {
        console.error("Could not retrieve client", error);
        throw error;
    }
}
