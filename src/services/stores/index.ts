import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { storeTag, creatorTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface StoreBankDetails {
  bankName?: string;
  bankCode?: string;
  accountNumber?: string;
  accountName?: string;
}

export interface StoreLocation {
  street?: string;
  city?: string;
  state?: string;
  country?: string;
  zipCode?: string;
}

export interface CreateStorePayload {
  name: string;
  description?: string;
  tagline?: string;
  categories?: string[];
  tags?: string[];
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  location?: StoreLocation;
  bankDetails?: StoreBankDetails;
}

export interface UpdateStorePayload {
  name?: string;
  description?: string;
  tagline?: string;
  categories?: string[];
  tags?: string[];
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  location?: StoreLocation;
  bankDetails?: StoreBankDetails;
  logo?: string;
  coverImage?: string;
}

export interface Store {
  _id: string;
  userId: string;
  creatorId: string;
  name: string;
  slug: string;
  description?: string;
  tagline?: string;
  categories?: string[];
  tags?: string[];
  phoneNumber?: string;
  whatsappNumber?: string;
  email?: string;
  logo?: string;
  coverImage?: string;
  location?: StoreLocation;
  bankDetails?: StoreBankDetails;
  featuredWorks?: string[];
  status: 'active' | 'suspended' | 'closed' | 'pending_approval';
  isVisible: boolean;
  rating: number;
  totalListings: number;
  totalSales: number;
  totalReviews: number;
  followers: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrowseStoresParams {
  page?: number;
  perPage?: number;
  category?: string;
  search?: string;
  state?: string;
  city?: string;
  creatorId?: string;
  sort?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const storesApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Create a new store
    createStore: builder.mutation<
      Record<string, any>,
      { payload: CreateStorePayload | Record<string, any>; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/stores`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [storeTag, creatorTag],
    }),

    // Get my stores (creator)
    getMyStores: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/stores/mine`,
        method: 'GET',
      }),
      providesTags: [storeTag],
    }),

    // Browse all stores (public marketplace)
    browseStores: builder.query<Record<string, any>, BrowseStoresParams>({
      query: (params) => ({
        url: `/stores`,
        method: 'GET',
        params,
      }),
      providesTags: [storeTag],
    }),

    // Get store by ID (for editing)
    getStoreById: builder.query<Record<string, any>, string>({
      query: (id) => ({
        url: `/stores/id/${id}`,
        method: 'GET',
      }),
      providesTags: [storeTag],
    }),

    // Update store
    updateStore: builder.mutation<
      Record<string, any>,
      { id: string; payload: UpdateStorePayload; options: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/stores/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [storeTag],
    }),

    // Toggle store visibility
    toggleStoreVisibility: builder.mutation<
      Record<string, any>,
      { payload: { visible: boolean }; id: string; options?: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/stores/${id}/visibility`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [storeTag],
    }),

    // Delete (close) store — permanent
    deleteStore: builder.mutation<Record<string, any>, { id: string; options: OptionType }>({
      query: ({ id }) => ({
        url: `/stores/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [storeTag, creatorTag],
    }),

    // Get store by slug (public)
    getStoreBySlug: builder.query<Record<string, any>, string>({
      query: (slug) => ({
        url: `/stores/${slug}`,
        method: 'GET',
      }),
      providesTags: [storeTag],
    }),
  }),
});

export const {
  useCreateStoreMutation,
  useGetMyStoresQuery,
  useLazyGetMyStoresQuery,
  useBrowseStoresQuery,
  useLazyBrowseStoresQuery,
  useGetStoreByIdQuery,
  useLazyGetStoreByIdQuery,
  useUpdateStoreMutation,
  useToggleStoreVisibilityMutation,
  useDeleteStoreMutation,
  useGetStoreBySlugQuery,
  useLazyGetStoreBySlugQuery,
} = storesApi;
