import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { creatorTag, storeTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type FeaturedWorkOwnerType = 'creator' | 'store';

export interface FeaturedWork {
  _id: string;
  userId: string;
  ownerType: FeaturedWorkOwnerType;
  ownerId: string;
  images: string[];
  title?: string;
  description?: string;
  position: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeaturedWorkPayload {
  ownerType: FeaturedWorkOwnerType;
  ownerId: string;
  images: string[];
  title?: string;
  description?: string;
}

export interface UpdateFeaturedWorkPayload {
  images?: string[];
  addImages?: string[];
  removeImages?: string[];
  title?: string;
  description?: string;
}

export interface ReorderFeaturedWorksPayload {
  ownerType: FeaturedWorkOwnerType;
  ownerId: string;
  orderedIds: string[];
}

export interface FeaturedWorksQueryParams {
  ownerType: FeaturedWorkOwnerType;
  ownerId: string;
  page?: number;
  perPage?: number;
}

export interface FeaturedWorksCountResponse {
  count: number;
  limit: number;
  plan: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const featuredWorksApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Create a featured work
    createFeaturedWork: builder.mutation<
      Record<string, any>,
      { payload: CreateFeaturedWorkPayload; options?: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/featured-works`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [creatorTag, storeTag],
    }),

    // Update a featured work
    updateFeaturedWork: builder.mutation<
      Record<string, any>,
      { id: string; payload: UpdateFeaturedWorkPayload; options?: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/featured-works/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [creatorTag, storeTag],
    }),

    // Delete a featured work
    deleteFeaturedWork: builder.mutation<Record<string, any>, string>({
      query: (id) => ({
        url: `/featured-works/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [creatorTag, storeTag],
    }),

    // Delete all featured works for an owner
    deleteAllFeaturedWorks: builder.mutation<
      Record<string, any>,
      { ownerType: FeaturedWorkOwnerType; ownerId: string }
    >({
      query: ({ ownerType, ownerId }) => ({
        url: `/featured-works/owner/${ownerType}/${ownerId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [creatorTag, storeTag],
    }),

    // Reorder featured works
    reorderFeaturedWorks: builder.mutation<
      Record<string, any>,
      { payload: ReorderFeaturedWorksPayload; options?: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/featured-works/reorder`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [creatorTag, storeTag],
    }),

    // Get featured works by owner (public)
    getFeaturedWorks: builder.query<Record<string, any>, FeaturedWorksQueryParams>({
      query: (params) => ({
        url: `/featured-works`,
        method: 'GET',
        params,
      }),
      providesTags: [creatorTag, storeTag],
    }),

    // Get count + plan limit
    getFeaturedWorksCount: builder.query<
      Record<string, any>,
      { ownerType: FeaturedWorkOwnerType; ownerId: string }
    >({
      query: ({ ownerType, ownerId }) => ({
        url: `/featured-works/count`,
        method: 'GET',
        params: { ownerType, ownerId },
      }),
    }),

    // Get single featured work
    getFeaturedWorkById: builder.query<Record<string, any>, string>({
      query: (id) => ({
        url: `/featured-works/${id}`,
        method: 'GET',
      }),
    }),
  }),
});

export const {
  useCreateFeaturedWorkMutation,
  useUpdateFeaturedWorkMutation,
  useDeleteFeaturedWorkMutation,
  useDeleteAllFeaturedWorksMutation,
  useReorderFeaturedWorksMutation,
  useGetFeaturedWorksQuery,
  useLazyGetFeaturedWorksQuery,
  useGetFeaturedWorksCountQuery,
  useLazyGetFeaturedWorksCountQuery,
  useGetFeaturedWorkByIdQuery,
  useLazyGetFeaturedWorkByIdQuery,
} = featuredWorksApi;
