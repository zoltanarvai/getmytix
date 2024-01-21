import { Card, CardContent } from "@/components/ui/card";

type ShoppingCartItemProps = {
  name: string;
  price: number;
  currentQuantityInShoppingCart: number;
};

export function ShoppingCartItem({
  name,
  price,
  currentQuantityInShoppingCart,
}: ShoppingCartItemProps) {
  return (
    <Card className="flex flex-col bg-gray-100 pt-4">
      <CardContent>
        <div className="flex justify-between">
          <div className="flex gap-2">
            <h1 className="text-xl">{name} Jegy</h1>
            <h1 className="text-xl">-</h1>
            <h1 className="text-xl">{price} Ft</h1>
          </div>

          <div className="flex justify-between items-start">
            <div className="flex justify-between items-end">
              <div className="flex flex-col mr-4">
                <p className="text-gray-500">Mennyiség</p>
                <p>{currentQuantityInShoppingCart} db</p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
