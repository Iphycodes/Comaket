import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { reviewTag, storeTag, creatorTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CreateReviewPayload {
  orderId?: string;
  storeId?: string;
  listingId?: string;
  creatorId?: string;
  rating: number;
  comment?: string;
}

export interface SellerReplyPayload {
  sellerReply: string;
}

export interface QueryReviewsParams {
  page?: number;
  perPage?: number;
  listingId?: string;
  storeId?: string;
  creatorId?: string;
}

export interface Review {
  _id: string;
  reviewerId: string | Record<string, any>;
  listingId: string;
  storeId: string;
  creatorId: string;
  orderId: string;
  rating: number;
  comment?: string;
  isVisible: boolean;
  sellerReply?: string;
  sellerReplyAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const reviewsApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Leave a review (buyer, after delivery)
    createReview: builder.mutation<
      Record<string, any>,
      { payload: CreateReviewPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/reviews`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [reviewTag, storeTag, creatorTag],
    }),

    // Seller reply to a review
    sellerReply: builder.mutation<
      Record<string, any>,
      { id: string; payload: SellerReplyPayload; options: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/reviews/${id}/reply`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [reviewTag],
    }),

    // Browse reviews (public — filter by listing, store, or creator)
    getReviews: builder.query<Record<string, any>, QueryReviewsParams>({
      query: (params = {}) => ({
        url: `/reviews`,
        method: 'GET',
        params,
      }),
      providesTags: [reviewTag],
    }),
  }),
});

export const {
  useCreateReviewMutation,
  useSellerReplyMutation,
  useGetReviewsQuery,
  useLazyGetReviewsQuery,
} = reviewsApi;
