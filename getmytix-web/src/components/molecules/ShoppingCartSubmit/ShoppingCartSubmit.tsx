"use client"

import React, {useState} from "react";
import {CheckedState} from "@radix-ui/react-checkbox";
import {Checkbox} from "@/components/ui/checkbox";
import Link from "next/link";
import {Button} from "@/components/ui/button";


type ShoppingCartSubmitProps = {
    enabled: boolean;
    shoppingCartId: string;
}

export function ShoppingCartSubmit(props: ShoppingCartSubmitProps) {
    const [tosAccepted, setTosAccepted] = useState(false);

    const onCheckChanged = (checked: CheckedState) => {
        setTosAccepted(checked === true);
    };


    return (
        <div className="flex flex-col items-center">
            <div>
                <Checkbox id="terms" onCheckedChange={onCheckChanged}/>
                <label htmlFor="terms" className="text-sm font-medium ml-2">
                    Elolvastam és elfogadom az{" "}
                    <span className="underline text-blue-600">
                    <Link href="https://rendezveny.figyelo.hu/2-adatvedelmi-tajekoztato" target="_blank">
                        adatvédelmi tájékoztatót.
                    </Link>
                        </span>
                </label>
            </div>

            <Link className={`mt-8 ${!props.enabled || !tosAccepted ? "pointer-events-none" : ""}`}
                  href={`ticket-details/${props.shoppingCartId}`}>
                <Button
                    className="text-xl font-bold px-6 py-6 mt-4 max-w-64"
                    disabled={!props.enabled || !tosAccepted}
                >
                    Tovább
                </Button>
            </Link>
        </div>
    )
}


