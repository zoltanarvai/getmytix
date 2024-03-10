import {Domain, Maybe} from "@/lib/types";
import * as repository from "./repository";

export type Client = Domain<repository.ClientRecord>;

export async function getClientBySlug(slug: string): Promise<Maybe<Client>> {
    console.info("Getting client by slug", slug);

    const client = await repository.getClientBySlug(slug);

    if (!client) {
        return null;
    }

    const {_id, ...rest} = client;

    return {
        id: _id.toHexString(),
        ...rest,
    };
}

export async function getClientById(clientId: string): Promise<Maybe<Client>> {
    console.info("Getting client by id", clientId);

    const client = await repository.getClientById(clientId);

    if (!client) {
        return null;
    }

    const {_id, ...rest} = client;

    return {
        id: _id.toHexString(),
        ...rest,
    };
}