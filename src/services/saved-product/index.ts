import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export const savedProductTag = 'SavedProduct' as const;

export interface ToggleSavePayload {
  listingId: string;
}

export interface CheckSavedPayload {
  listingIds: string[];
}

export interface QuerySavedProductsParams {
  page?: number;
  perPage?: number;
}

export interface SavedProductItem {
  _id: string;
  savedAt: string;
  listing: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const savedProductsApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Toggle save/unsave a listing
    toggleSaveProduct: builder.mutation<
      Record<string, any>,
      { payload: ToggleSavePayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/saved-products/toggle`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [savedProductTag as any],
    }),

    // Check saved status for multiple listings
    checkSavedStatus: builder.mutation<
      Record<string, any>,
      { payload: CheckSavedPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/saved-products/check`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Get my saved products (paginated)
    getSavedProducts: builder.query<Record<string, any>, QuerySavedProductsParams>({
      query: (params = {}) => ({
        url: `/saved-products`,
        method: 'GET',
        params,
      }),
      providesTags: [savedProductTag as any],
    }),

    // Get saved items count
    getSavedCount: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/saved-products/count`,
        method: 'GET',
      }),
      providesTags: [savedProductTag as any],
    }),

    // Remove a saved listing
    removeSavedProduct: builder.mutation<
      Record<string, any>,
      { listingId: string; options: OptionType }
    >({
      query: ({ listingId }) => ({
        url: `/saved-products/${listingId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [savedProductTag as any],
    }),
  }),
});

export const {
  useToggleSaveProductMutation,
  useCheckSavedStatusMutation,
  useGetSavedProductsQuery,
  useLazyGetSavedProductsQuery,
  useGetSavedCountQuery,
  useLazyGetSavedCountQuery,
  useRemoveSavedProductMutation,
} = savedProductsApi;
