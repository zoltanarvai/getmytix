"use client";

import { Montserrat } from "next/font/google";
import * as R from "remeda";
import { events } from "@/lib/domain";
import {
  ShoppingCartItem,
  TicketType as TicketTypeComponent,
} from "@/components/molecules";
import {
  addItemToShoppingCart,
  removeItemFromShoppingCart,
} from "@/app/server-actions/shopping-cart";

const fontMontserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

type TicketSelectorProps = {
  event: {
    id: string;
    ticketTypes: {
      id: string;
      type: string;
      price: number;
      description: string;
      quantity: number;
    }[];
  };
  shoppingCartId: string;
  shoppingCartItems: {
    itemId: string;
  }[];
};

export function TicketSelector({
  event: { ticketTypes },
  shoppingCartId,
  shoppingCartItems,
}: TicketSelectorProps) {
  const handleAddToBasket = async (
    ticketType: events.TicketType,
    quantity: number
  ) => {
    await addItemToShoppingCart({
      shoppingCartId,
      tickets: {
        ticketId: ticketType.id,
        quantity,
      },
    });
  };

  const handleRemoveFromBasket = async (itemId: string) => {
    await removeItemFromShoppingCart({ shoppingCartId, itemId });
  };

  const ticketsInShoppingCart = R.pipe(
    shoppingCartItems,
    R.map(({ itemId }) => ticketTypes.find(({ id }) => id === itemId)),
    R.filter((ticketType) => !!ticketType),
    R.groupBy((ticketType) => ticketType!.id)
  );

  return (
    <div className="flex flex-col justify-start w-full">
      <h2
        className={`uppercase font-bold text-xl antialiased ${fontMontserrat.className}`}
      >
        Jegytípusok
      </h2>
      <div className="mt-2 flex flex-1 flex-col gap-2">
        {ticketTypes.map((ticketType) => (
          <TicketTypeComponent
            key={ticketType.id}
            name={ticketType.type}
            price={ticketType.price}
            description={ticketType.description}
            availableQuantity={ticketType.quantity}
            onTicketTypeSelected={(quantity) =>
              handleAddToBasket(ticketType, quantity)
            }
          />
        ))}
      </div>
      <h2
        className={`uppercase font-bold text-xl antialiased ${fontMontserrat.className}`}
      >
        Shopping carts
      </h2>
      <div className="mt-2 flex flex-1 flex-col gap-2">
        {Object.entries(ticketsInShoppingCart).map(([itemId, ticket]) => (
          <ShoppingCartItem
            key={itemId}
            name={ticket[0]!.type}
            price={ticket[0]!.price}
            currentQuantityInShoppingCart={ticket.length}
            enableRemove
            onRemoveFromShoppingCart={() => handleRemoveFromBasket(itemId)}
          />
        ))}
      </div>
    </div>
  );
}
