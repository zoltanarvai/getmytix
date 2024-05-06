"use client";

import React from "react";
import {useRouter} from "next/navigation";
import {Button} from "@/components/ui/button";
import {createSession} from "@/app/server-actions/session";

type StartBuyingSessionProps = {
    hideTitle?: boolean;
};

export function StartBuyingSession({hideTitle}: StartBuyingSessionProps) {
    const router = useRouter();


    const onClick = async () => {
        await createSession();

        router.push(`tickets`);
    };

    return (
        <div className="flex flex-col items-center gap-4 w-full">
            {!hideTitle && <h1 className="text-2xl font-bold">Csatlakozom!</h1>}

            <Button
                onClick={onClick}
                className="text-xl font-bold px-6 py-6"
            >
                Jegyvásárlás
            </Button>

        </div>
    );
}
