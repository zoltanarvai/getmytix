"use client";
import {useState} from "react";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {useToast} from "@/components/ui/use-toast";
import {Card, CardContent} from "@/components/ui/card";

type TicketTypeProps = {
    name: string;
    price: number;
    description: string;
    availableQuantity: number;

    onTicketTypeSelected: (
        quantity: number
    ) => Promise<"added" | "not-enough-tickets">;
};

export function TicketType({
                               name,
                               price,
                               description,
                               availableQuantity,
                               onTicketTypeSelected,
                           }: TicketTypeProps) {
    const [quantityToBuy, setQuantityToBuy] = useState(0);
    const {toast} = useToast();

    const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const desiredQuantity = parseInt(e.target.value);

        if (desiredQuantity > availableQuantity) {
            toast({
                title: "Nincs elég jegy!",
                description: `Ebből a jegytípusból csak ${availableQuantity} db van!`,
                variant: "destructive",
            });
        }

        setQuantityToBuy(desiredQuantity);
    };

    const onAddToCartClick = async () => {
        if (quantityToBuy) {
            const result = await onTicketTypeSelected(quantityToBuy);

            if (result === "not-enough-tickets") {
                toast({
                    title: "Nincs elég jegy!",
                    description: "Ebből a jegytípusból nincs ennyi!",
                    variant: "destructive",
                });
            }

            if (result === "added") {
                toast({
                    title: "Sikeresen hozzáadva a kosárhoz!",
                    description: (
                        <p className="text-md">
                            <span className="text-bold">{`${quantityToBuy} db ${name} jegyet`}</span>{" "}
                            {"adtál a kosaradhoz."}
                        </p>
                    ),
                    variant: "success",
                });
            }
        }
    };

    const soldOut = availableQuantity === 0;
    const buyingMoreThanAvailable = quantityToBuy > availableQuantity;

    return (
        <Card className="flex flex-col bg-gray-100 pt-4">
            <CardContent>
                <div className="flex justify-between max-md:flex-col">
                    <div>
                        <div className="flex gap-2">
                            <h1 className="text-xl">{name} Jegy</h1>
                            <h1 className="text-xl">-</h1>
                            <h1 className="text-xl">{price} Ft</h1>
                        </div>
                        <p className="text-gray-500 mr-8">
                            {description}
                        </p>
                    </div>

                    <div className="flex justify-between items-start">
                        <div className="flex items-end justify-between max-md:justify-end max-md:mt-4 flex-1">
                            <div className="flex flex-col mr-4">
                                <p className="text-gray-500">Mennyiség</p>
                                <Input
                                    disabled={soldOut}
                                    type="number"
                                    className="w-24 border border-gray-200 rounded-md"
                                    min={0}
                                    defaultValue={0}
                                    onChange={onQuantityChange}
                                />
                            </div>
                            <Button
                                disabled={soldOut || buyingMoreThanAvailable}
                                onClick={onAddToCartClick}
                            >
                                Hozzáadás
                            </Button>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
