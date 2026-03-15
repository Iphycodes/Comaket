export interface ShippingFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  buyerNote: string;
}

export interface CheckoutCartItem {
  listingId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
  storeName: string;
}

export interface LocationOption {
  name: string;
  iso2?: string;
}
