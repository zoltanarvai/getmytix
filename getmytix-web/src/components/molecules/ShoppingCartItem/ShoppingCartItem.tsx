import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type ShoppingCartItemProps = {
  name: string;
  price: number;
  currentQuantityInShoppingCart: number;
  enableRemove?: boolean;
  onRemoveFromShoppingCart?: () => void;
};

export function ShoppingCartItem({
  name,
  price,
  currentQuantityInShoppingCart,
  onRemoveFromShoppingCart,
  enableRemove = false,
}: ShoppingCartItemProps) {
  return (
    <Card className="flex flex-col bg-gray-100 pt-4">
      <CardContent>
        <div className="flex justify-between max-md:flex-col">
          <div className="flex gap-2">
            <h1 className="text-xl">{name} Jegy</h1>
            <h1 className="text-xl">-</h1>
            <h1 className="text-xl">{price} Ft</h1>
          </div>

          <div
            className={`flex justify-between items-start max-md:justify-${
              enableRemove ? "end" : "start"
            } max-md:mt-4`}
          >
            <div className="flex justify-between items-end">
              <div className="flex flex-col mr-4">
                <p className="text-gray-500">Mennyiség</p>
                <p>{currentQuantityInShoppingCart} db</p>
              </div>
              {enableRemove && (
                <Button onClick={() => onRemoveFromShoppingCart!()}>
                  Eltavolitas
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
