import { ShoppingCartItem } from "@/components/molecules";

type ShoppingCartProps = {
  event: {
    ticketTypes: {
      id: string;
      type: string;
      price: number;
      quantityInShoppingCart: number;
    }[];
  };
};

export function ShoppingCart({ event: { ticketTypes } }: ShoppingCartProps) {
  return (
    <div className="mt-2 flex flex-1 flex-col gap-2 w-full">
      {ticketTypes
        .filter((ticketType) => ticketType.quantityInShoppingCart > 0)
        .map((ticketType) => (
          <ShoppingCartItem
            key={ticketType.id}
            name={ticketType.type}
            price={ticketType.price}
            currentQuantityInShoppingCart={ticketType.quantityInShoppingCart}
          />
        ))}
    </div>
  );
}
