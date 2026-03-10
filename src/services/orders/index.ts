import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { orderTag, listingTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CreateOrderPayload {
  listingId: string;
  quantity?: number;
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  buyerNote?: string;
}

export interface UpdateOrderStatusPayload {
  status: 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'completed' | 'cancelled' | string;
  adminNote?: string;
  cancellationReason?: string;
  carrier?: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
}

export interface QueryOrdersParams {
  page?: number;
  perPage?: number;
  status?: string;
  paymentStatus?: string;
  storeId?: string;
}

export interface OrderItem {
  listingId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  type: string;
  image?: string;
}

export interface Order {
  _id: string;
  orderNumber: string;
  buyerId: string | Record<string, any>;
  sellerId: string | Record<string, any>;
  storeId: string | Record<string, any>;
  creatorId: string;
  items: OrderItem[];
  subtotal: number;
  shippingFee: number;
  discount: number;
  totalAmount: number;
  currency: string;
  revenueSplit: {
    totalAmount: number;
    platformFee: number;
    sellerPayout: number;
    commissionRate: number;
  };
  status: string;
  paymentStatus: string;
  paymentInfo?: {
    method: string;
    reference: string;
    paystackReference?: string;
    paidAt?: string;
    status: string;
  };
  trackingInfo?: {
    carrier?: string;
    trackingNumber?: string;
    shippedAt?: string;
    deliveredAt?: string;
    estimatedDelivery?: string;
  };
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
    state: string;
    zipCode?: string;
  };
  buyerNote?: string;
  adminNote?: string;
  cancellationReason?: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const ordersApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Place a new order
    createOrder: builder.mutation<
      Record<string, any>,
      { payload: CreateOrderPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/orders`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [orderTag, listingTag],
    }),

    // Get my orders (buyer)
    getMyOrders: builder.query<Record<string, any>, QueryOrdersParams>({
      query: (params = {}) => ({
        url: `/orders/my-orders`,
        method: 'GET',
        params,
      }),
      providesTags: [orderTag],
    }),

    // Get seller orders
    getSellerOrders: builder.query<Record<string, any>, QueryOrdersParams>({
      query: (params = {}) => ({
        url: `/orders/seller-orders`,
        method: 'GET',
        params,
      }),
      providesTags: [orderTag],
    }),

    // Get order by ID
    getOrderById: builder.query<Record<string, any>, string>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: 'GET',
      }),
      providesTags: [orderTag],
    }),

    // Update order status (seller/admin)
    updateOrderStatus: builder.mutation<
      Record<string, any>,
      { id: string; payload: UpdateOrderStatusPayload; options: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/orders/${id}/status`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [orderTag],
    }),
  }),
});

export const {
  useCreateOrderMutation,
  useGetMyOrdersQuery,
  useLazyGetMyOrdersQuery,
  useGetSellerOrdersQuery,
  useLazyGetSellerOrdersQuery,
  useGetOrderByIdQuery,
  useLazyGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
} = ordersApi;
