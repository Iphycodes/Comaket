import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { shippingAddressTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export { shippingAddressTag };

export interface ShippingAddress {
  _id: string;
  userId: string;
  fullName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  country: string;
  zipCode?: string;
  label?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateShippingAddressPayload {
  fullName: string;
  phoneNumber: string;
  email?: string;
  address: string;
  city: string;
  state: string;
  country?: string;
  zipCode?: string;
  label?: string;
  isDefault?: boolean;
}

export interface UpdateShippingAddressPayload extends Partial<CreateShippingAddressPayload> {}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const shippingAddressesApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Get all shipping addresses
    getShippingAddresses: builder.query<ShippingAddress[], void>({
      query: () => ({
        url: `/shipping-addresses`,
        method: 'GET',
      }),
      providesTags: [shippingAddressTag as any],
    }),

    // Get default shipping address
    getDefaultShippingAddress: builder.query<ShippingAddress | null, void>({
      query: () => ({
        url: `/shipping-addresses/default`,
        method: 'GET',
      }),
      providesTags: [shippingAddressTag as any],
    }),

    // Get a specific shipping address
    getShippingAddress: builder.query<ShippingAddress, { id: string }>({
      query: ({ id }) => ({
        url: `/shipping-addresses/${id}`,
        method: 'GET',
      }),
      providesTags: [shippingAddressTag as any],
    }),

    // Create a new shipping address
    createShippingAddress: builder.mutation<
      ShippingAddress,
      { payload: CreateShippingAddressPayload; options?: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/shipping-addresses`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [shippingAddressTag as any],
    }),

    // Update a shipping address
    updateShippingAddress: builder.mutation<
      ShippingAddress,
      { id: string; payload: UpdateShippingAddressPayload; options?: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/shipping-addresses/${id}`,
        method: 'PUT',
        body: payload,
      }),
      invalidatesTags: [shippingAddressTag as any],
    }),

    // Set a shipping address as default
    setDefaultShippingAddress: builder.mutation<
      ShippingAddress,
      { id: string; options?: OptionType }
    >({
      query: ({ id }) => ({
        url: `/shipping-addresses/${id}/default`,
        method: 'PATCH',
      }),
      invalidatesTags: [shippingAddressTag as any],
    }),

    // Delete a shipping address
    deleteShippingAddress: builder.mutation<void, { id: string; options?: OptionType }>({
      query: ({ id }) => ({
        url: `/shipping-addresses/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [shippingAddressTag as any],
    }),
  }),
});

export const {
  useGetShippingAddressesQuery,
  useLazyGetShippingAddressesQuery,
  useGetDefaultShippingAddressQuery,
  useLazyGetDefaultShippingAddressQuery,
  useGetShippingAddressQuery,
  useLazyGetShippingAddressQuery,
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useSetDefaultShippingAddressMutation,
  useDeleteShippingAddressMutation,
} = shippingAddressesApi;
