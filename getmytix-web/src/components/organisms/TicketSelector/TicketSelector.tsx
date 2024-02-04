"use client";

import * as R from "remeda";
import {
  PageSection,
  ShoppingCartItem,
  TicketType as TicketTypeComponent,
} from "@/components/molecules";
import {
  addItemToShoppingCart,
  removeItemFromShoppingCart,
} from "@/app/server-actions/shopping-cart";

type AvailableTicketType = {
  id: string;
  type: string;
  price: number;
  description: string;
  availableQuantity: number;
  totalQuantity: number;
};

type TicketSelectorProps = {
  event: {
    id: string;
    availabeTicketTypes: AvailableTicketType[];
  };
  shoppingCartId: string;
  shoppingCartItems: {
    itemId: string;
  }[];
};

export function TicketSelector({
  event: { availabeTicketTypes },
  shoppingCartId,
  shoppingCartItems,
}: TicketSelectorProps) {
  const handleAddToBasket = async (
    ticketType: AvailableTicketType,
    quantity: number
  ) => {
    const response = await addItemToShoppingCart({
      shoppingCartId,
      items: {
        itemId: ticketType.id,
        quantity,
      },
    });

    return response.result;
  };

  const handleRemoveFromBasket = async (itemId: string) => {
    await removeItemFromShoppingCart({ shoppingCartId, itemId });
  };

  const ticketsInShoppingCart = R.pipe(
    shoppingCartItems,
    R.map(({ itemId }) => availabeTicketTypes.find(({ id }) => id === itemId)),
    R.filter((ticketType) => !!ticketType),
    R.groupBy((ticketType) => ticketType!.id)
  );

  return (
    <div className="flex flex-col justify-start w-full">
      <PageSection title="Jegytípusok">
        {availabeTicketTypes.map((ticketType) => (
          <TicketTypeComponent
            key={ticketType.id}
            name={ticketType.type}
            price={ticketType.price}
            description={ticketType.description}
            availableQuantity={ticketType.availableQuantity}
            onTicketTypeSelected={(quantity) =>
              handleAddToBasket(ticketType, quantity)
            }
          />
        ))}
      </PageSection>

      <PageSection title="Kosaram tartalma" classNames="mt-8">
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
      </PageSection>
    </div>
  );
}
