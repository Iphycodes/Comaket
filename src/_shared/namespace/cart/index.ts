export interface CartItem {
  id: string | number;
  itemName: string;
  description: string;
  price: number;
  quantity: number;
  maxQuantity: number;
  image: string;
  condition: string;
  negotiable: boolean;
  sellerName: string;
}
