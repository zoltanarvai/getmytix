"use client";

import { Montserrat } from "next/font/google";
import { tickets } from "@/lib/domain";
import { TicketType as TicketTypeComponent } from "@/components/molecules";
import { addTicketToShoppingCart } from "@/app/server-actions/shopping-cart";

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
      quantityInShoppingCart: number;
    }[];
  };
  sessionId: string;
};

export function TicketSelector({
  event: { id: subdomain, ticketTypes },
  sessionId,
}: TicketSelectorProps) {
  const handleTicketTypeSelected = (
    ticketType: tickets.TicketType,
    quantity: number
  ) => {
    addTicketToShoppingCart({
      subdomain: subdomain,
      sessionId,
      tickets: {
        [ticketType.id]: quantity,
      },
    });
  };

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
            currentQuantityInShoppingCart={ticketType.quantityInShoppingCart}
            onTicketTypeSelected={(quantity) =>
              handleTicketTypeSelected(ticketType, quantity)
            }
          />
        ))}
      </div>
    </div>
  );
}
