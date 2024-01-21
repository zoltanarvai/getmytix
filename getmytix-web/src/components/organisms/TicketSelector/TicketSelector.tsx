"use client";

import { tickets } from "@/lib/domain";
import { TicketType as TicketTypeComponent } from "@/components/molecules";
import { addTicketToShoppingCart } from "@/app/server-actions/shopping-cart";

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
  event: { id: eventId, ticketTypes },
  sessionId,
}: TicketSelectorProps) {
  const handleTicketTypeSelected = (
    ticketType: tickets.TicketType,
    quantity: number
  ) => {
    addTicketToShoppingCart({
      eventId: eventId,
      sessionId,
      tickets: {
        [ticketType.id]: quantity,
      },
    });
  };

  return (
    <div>
      <h2>Ticket Types</h2>
      <div className="grid grid-cols-3 gap-4">
        {ticketTypes.map((ticketType) => (
          <TicketTypeComponent
            key={ticketType.id}
            name={ticketType.type}
            price={ticketType.price}
            description={ticketType.description}
            maxQuantity={ticketType.quantity}
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
