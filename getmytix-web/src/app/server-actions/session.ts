"use server";

import {session} from "@/lib/domain";

export async function createSession(): Promise<string> {
    console.info("Creating session");

    const {id} = await session.createSession();
    
    return id;
}
