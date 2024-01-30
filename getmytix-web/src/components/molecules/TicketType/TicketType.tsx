"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent } from "@/components/ui/card";

type TicketTypeProps = {
  name: string;
  price: number;
  description: string;
  availableQuantity: number;

  onTicketTypeSelected: (quantity: number) => void;
};

export function TicketType({
  name,
  price,
  description,
  availableQuantity,
  onTicketTypeSelected,
}: TicketTypeProps) {
  const [quantityToBuy, setQuantityToBuy] = useState(0);
  const { toast } = useToast();

  const onQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // TODO consider available quantity
    if (parseInt(e.target.value) > availableQuantity) {
      toast({
        title: "Nincs elég jegy!",
        description: `Ebből a jegytípusból csak ${availableQuantity} db van!`,
        variant: "destructive",
      });

      return;
    }

    setQuantityToBuy(parseInt(e.target.value));
  };

  const onAddToCartClick = () => {
    if (quantityToBuy) {
      onTicketTypeSelected(quantityToBuy);

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
  };

  return (
    <Card className="flex flex-col bg-gray-100 pt-4">
      <CardContent>
        <div className="flex justify-between">
          <div>
            <div className="flex gap-2">
              <h1 className="text-xl">{name} Jegy</h1>
              <h1 className="text-xl">-</h1>
              <h1 className="text-xl">{price} Ft</h1>
            </div>
            <p className="text-gray-500 mr-8">
              {description} sadfhlaskjh lkjsadhf lkajsdhf lksjad laksdjfh
              ljksdfh l skdljfh lksjdhf lskdjhf lskdjfh lskdjfh lskdjhf lksjdhf
            </p>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex justify-between items-end">
              <div className="flex flex-col mr-4">
                <p className="text-gray-500">Mennyiség</p>
                <Input
                  type="number"
                  className="w-24 border border-gray-200 rounded-md"
                  min={0}
                  max={availableQuantity}
                  defaultValue={0}
                  onChange={onQuantityChange}
                />
              </div>
              <Button onClick={onAddToCartClick}>Hozzáadás</Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
