import { Montserrat } from "next/font/google";
import { ShoppingCartItem } from "@/components/molecules";

const fontMontserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
});

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
    <div className="flex flex-col justify-start w-full">
      <h2
        className={`uppercase font-bold text-xl antialiased ${fontMontserrat.className}`}
      >
        Kosaram
      </h2>

      <div className="mt-2 flex flex-1 flex-col gap-2">
        {ticketTypes.map((ticketType) => (
          <ShoppingCartItem
            key={ticketType.id}
            name={ticketType.type}
            price={ticketType.price}
            currentQuantityInShoppingCart={ticketType.quantityInShoppingCart}
          />
        ))}
      </div>
    </div>
  );
}
