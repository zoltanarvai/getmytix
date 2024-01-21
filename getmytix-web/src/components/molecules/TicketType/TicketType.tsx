"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

type TicketTypeProps = {
  name: string;
  price: number;
  description: string;
  maxQuantity: number;
  currentQuantityInShoppingCart: number;

  onTicketTypeSelected: (quantity: number) => void;
};

export function TicketType({
  name,
  price,
  description,
  maxQuantity,
  currentQuantityInShoppingCart,
  onTicketTypeSelected,
}: TicketTypeProps) {
  const [quantityToBuy, setQuantityToBuy] = useState(0);

  return (
    <div className="flex flex-col p-4 border border-gray-200 rounded-md">
      <div className="flex justify-between">
        <h1 className="text-xl">{name}</h1>
        <h1 className="text-xl">{price}</h1>
      </div>
      <p className="text-gray-500">{description}</p>
      <div className="flex justify-between">
        <p className="text-gray-500">Quantity</p>
        <input
          type="number"
          className="w-24 border border-gray-200 rounded-md"
          min={0}
          max={maxQuantity}
          defaultValue={currentQuantityInShoppingCart}
          onChange={(e) => {
            setQuantityToBuy(parseInt(e.target.value));
          }}
        />
      </div>
      <Button onClick={() => onTicketTypeSelected(quantityToBuy)}>Buy</Button>
    </div>
  );
}
