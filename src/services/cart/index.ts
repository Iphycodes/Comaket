import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { cartTag, orderTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export { cartTag };

export interface AddToCartPayload {
  listingId: string;
  quantity?: number;
}

export interface UpdateCartItemPayload {
  quantity: number;
}

export interface CheckoutCartPayload {
  shippingAddress: {
    fullName: string;
    phoneNumber: string;
    address: string;
    city: string;
    state: string;
    country: string;
    zipCode?: string;
  };
  listingIds?: string[];
  email?: string;
  buyerNote?: string;
  callbackUrl?: string;
  deliveryFee?: number;
  paymentMethod?: 'paystack' | 'opay';
}

// ─── Cart Item (from GET /cart) ──────────────────────────────────────────

export interface CartItemSnapshot {
  itemName: string;
  unitPrice: number;
  image?: string;
  type: string;
}

export interface CartItemListing {
  _id: string;
  itemName: string;
  status: string;
  type: string;
  condition: string;
  quantity: number;
  media: Array<{ url: string; type: string }>;
  askingPrice: { amount: number; currency: string; negotiable?: boolean };
  adminPricing?: {
    sellingPrice?: number;
    purchasePrice?: number;
    commissionRate?: number;
  };
  effectivePrice: number;
}

export interface CartItemStore {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
}

export interface CartItem {
  listingId: string;
  storeId: string;
  quantity: number;
  currency: string;

  // Cart snapshot (values from when item was added)
  snapshot: CartItemSnapshot;

  // Live listing data (current state)
  listing: CartItemListing | null;

  // Populated store
  store?: CartItemStore;

  // Computed flags
  isAvailable: boolean;
  isDeleted: boolean;
  priceChanged: boolean;

  // Convenience (live values, fallback to snapshot)
  itemName: string;
  unitPrice: number;
  totalPrice: number;
}

export interface CartData {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  currency: string;
  hasIssues: boolean;
}

export interface CartValidation {
  valid: boolean;
  validItems: number;
  totalItems: number;
  issues: Array<{
    listingId: string;
    itemName: string;
    issue: string;
  }>;
}

export interface CheckoutResponse {
  sessionId: string;
  payment: {
    authorizationUrl: string;
    accessCode: string;
    reference: string;
    grandTotal: number;
  };
  itemCount: number;
  skippedItems?: Array<{
    listingId: string;
    itemName: string;
    reason: string;
  }>;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const cartApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Add to cart
    addToCart: builder.mutation<
      Record<string, any>,
      { payload: AddToCartPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/cart/add`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [cartTag as any],
    }),

    // Get my cart
    getCart: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/cart`,
        method: 'GET',
      }),
      providesTags: [cartTag as any],
    }),

    // Get cart item count (for header badge)
    getCartCount: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/cart/count`,
        method: 'GET',
      }),
      providesTags: [cartTag as any],
    }),

    // Update item quantity
    updateCartItem: builder.mutation<
      Record<string, any>,
      { listingId: string; payload: UpdateCartItemPayload; options: OptionType }
    >({
      query: ({ listingId, payload }) => ({
        url: `/cart/items/${listingId}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [cartTag as any],
    }),

    // Remove item from cart
    removeCartItem: builder.mutation<
      Record<string, any>,
      { listingId: string; options: OptionType }
    >({
      query: ({ listingId }) => ({
        url: `/cart/items/${listingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [cartTag as any],
    }),

    // Clear entire cart
    clearCart: builder.mutation<Record<string, any>, { options: OptionType }>({
      query: () => ({
        url: `/cart`,
        method: 'DELETE',
      }),
      invalidatesTags: [cartTag as any],
    }),

    // Validate cart before checkout
    validateCart: builder.mutation<Record<string, any>, { options: OptionType }>({
      query: () => ({
        url: `/cart/validate`,
        method: 'POST',
      }),
    }),

    // Checkout cart → create orders + single payment
    checkoutCart: builder.mutation<
      Record<string, any>,
      { payload: CheckoutCartPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/cart/checkout`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [cartTag as any, orderTag as any],
    }),
  }),
});

export const {
  useAddToCartMutation,
  useGetCartQuery,
  useLazyGetCartQuery,
  useGetCartCountQuery,
  useLazyGetCartCountQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useValidateCartMutation,
  useCheckoutCartMutation,
} = cartApi;
