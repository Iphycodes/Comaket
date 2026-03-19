import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { listingTag, storeTag, creatorTag, savedProductTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type ListingType = 'self_listing' | 'consignment' | 'direct_purchase' | 'admin';

export type ListingStatus =
  | 'draft'
  | 'in_review'
  | 'approved'
  | 'rejected'
  | 'awaiting_fee' // Self-listing: approved, waiting for listing fee payment
  | 'awaiting_product' // Consignment/Direct: waiting for physical product
  | 'price_offered' // Direct purchase: platform made a bid
  | 'counter_offer' // Direct purchase: seller sent a counter-offer
  | 'live'
  | 'sold'
  | 'suspended'
  | 'expired'
  | 'delisted';

export type ItemCondition = 'brand_new' | 'fairly_used' | 'used' | 'refurbished';

export interface CreateListingPayload {
  storeId?: string; // Optional — omit for creator-level listings
  itemName: string;
  description: string;
  condition: ItemCondition;
  category?: string;
  tags?: string[];
  type: ListingType;
  askingPrice: {
    amount: number;
    currency?: string;
    negotiable?: boolean;
  };
  quantity?: number;
  whatsappNumber?: string;
  media?: Array<{ url: string; type: 'image' | 'video'; thumbnail?: string }>;
  location?: { country?: string; state?: string; city?: string };
}

export interface UpdateListingPayload {
  itemName?: string;
  description?: string;
  condition?: string;
  category?: string;
  tags?: string[];
  askingPrice?: {
    amount?: number;
    currency?: string;
    negotiable?: boolean;
  };
  quantity?: number;
  whatsappNumber?: string;
  media?: Array<{ url: string; type: 'image' | 'video'; thumbnail?: string }>;
  location?: { country?: string; state?: string; city?: string };
}

export interface AdminReviewListingPayload {
  action:
    | 'approve'
    | 'reject'
    | 'suspend'
    | 'reinstate'
    | 'delist'
    | 'make_offer'
    | 'accept_counter'
    | 'reject_counter'
    | 'mark_awaiting_fee'
    | 'mark_awaiting_product'
    | 'mark_live';
  sellingPrice?: number;
  purchasePrice?: number;
  commissionRate?: number;
  platformBid?: number;
  rejectionReason?: string;
  adminNotes?: string;
}

export interface QueryListingsParams {
  page?: number;
  perPage?: number;
  category?: string;
  type?: ListingType;
  condition?: string;
  search?: string;
  minPrice?: number;
  maxPrice?: number;
  storeId?: string;
  creatorId?: string;
  status?: ListingStatus;
  buyableOnly?: boolean;
  sort?: string;
}

export interface PopulatedStore {
  _id: string;
  name: string;
  slug: string;
  logo?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
  };
  category?: string;
}

export interface PopulatedCreator {
  _id: string;
  username: string;
  slug: string;
  profileImageUrl?: string;
  bio?: string;
  isVerified: boolean;
  phoneNumber?: string;
  whatsappNumber?: string;
  website?: string;
  industries?: string[];
  socialLinks?: Record<string, string>;
  plan?: string;
  rating?: number;
  totalReviews?: number;
  totalFollowers?: number;
}

export interface PopulatedUser {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  email?: string;
}

export interface Listing {
  _id: string;
  storeId: string | PopulatedStore | null; // null for creator-level listings
  creatorId: string | PopulatedCreator;
  userId: string | PopulatedUser;
  itemName: string;
  description: string;
  condition: string;
  category?: string;
  tags?: string[];
  type: ListingType;
  askingPrice: {
    amount: number;
    currency: string;
    negotiable: boolean;
  };
  adminPricing?: {
    sellingPrice?: number;
    purchasePrice?: number;
    commissionRate?: number;
  };
  effectivePrice?: {
    amount: number;
    currency: string;
  };
  media: Array<{ url: string; type: string; thumbnail?: string }>;
  whatsappNumber?: string;
  location?: { country?: string; state?: string; city?: string };
  quantity: number;
  status: ListingStatus;
  isBuyable: boolean;

  // Self-listing fee fields
  listingFee?: number;
  listingFeeStatus?: 'pending' | 'paid' | 'waived';

  // Direct purchase negotiation fields
  platformBid?: number;
  counterOffer?: number;

  // Stats
  views: number;
  likes: number;
  totalSales: number;

  // Review
  reviewInfo?: {
    reviewedBy?: string;
    reviewedAt?: string;
    rejectionReason?: string;
    adminNotes?: string;
  };

  expiresAt?: string;
  createdAt: string;
  updatedAt: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const listingsApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Seller Endpoints ────────────────────────────────────

    // Create a new listing
    createListing: builder.mutation<
      Record<string, any>,
      { payload: CreateListingPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/listings`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [listingTag, storeTag, creatorTag],
    }),

    // Get my listings (creator dashboard — all statuses)
    getMyListings: builder.query<Record<string, any>, QueryListingsParams>({
      query: (params = {}) => ({
        url: `/listings/mine`,
        method: 'GET',
        params,
      }),
      providesTags: [listingTag],
    }),

    // Update listing
    updateListing: builder.mutation<
      Record<string, any>,
      { id: string; payload: UpdateListingPayload; options: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/listings/${id}`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [listingTag],
    }),

    // Delete listing
    deleteListing: builder.mutation<Record<string, any>, { id: string; options: OptionType }>({
      query: ({ id }) => ({
        url: `/listings/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: [listingTag, storeTag, creatorTag],
    }),

    // Seller: Submit counter-offer (direct purchase — status: price_offered → counter_offer)
    submitCounterOffer: builder.mutation<
      Record<string, any>,
      { id: string; counterOffer: number; options: OptionType }
    >({
      query: ({ id, counterOffer }) => ({
        url: `/listings/${id}/counter-offer`,
        method: 'POST',
        body: { counterOffer },
      }),
      invalidatesTags: [listingTag],
    }),

    // Seller: Accept platform offer (direct purchase — status: price_offered → awaiting_product)
    acceptOffer: builder.mutation<Record<string, any>, { id: string; options: OptionType }>({
      query: ({ id }) => ({
        url: `/listings/${id}/accept-offer`,
        method: 'POST',
      }),
      invalidatesTags: [listingTag],
    }),

    // Seller: Reject platform offer (direct purchase — status: price_offered → rejected)
    rejectOffer: builder.mutation<Record<string, any>, { id: string; options: OptionType }>({
      query: ({ id }) => ({
        url: `/listings/${id}/reject-offer`,
        method: 'POST',
      }),
      invalidatesTags: [listingTag],
    }),

    // Seller: Delist own listing (status: live → delisted)
    delistListing: builder.mutation<Record<string, any>, { id: string; options: OptionType }>({
      query: ({ id }) => ({
        url: `/listings/${id}/delist`,
        method: 'POST',
      }),
      invalidatesTags: [listingTag],
    }),

    // ─── Public Endpoints ────────────────────────────────────

    // Get marketplace feed (public — only live listings by default)
    getListings: builder.query<Record<string, any>, QueryListingsParams>({
      query: (params = {}) => ({
        url: `/listings`,
        method: 'GET',
        params,
      }),
      providesTags: [listingTag, savedProductTag],
    }),

    // Get single listing by ID (with populated store, creator, user)
    getListingById: builder.query<Record<string, any>, string>({
      query: (id) => ({
        url: `/listings/${id}`,
        method: 'GET',
      }),
      providesTags: [listingTag],
    }),

    // Get listings by store (public store page)
    getListingsByStore: builder.query<
      Record<string, any>,
      { storeId: string } & QueryListingsParams
    >({
      query: ({ storeId, ...params }) => ({
        url: `/listings/stores/${storeId}`,
        method: 'GET',
        params,
      }),
      providesTags: [listingTag],
    }),

    // Get listings by creator (public creator page — aggregated across all stores)
    getListingsByCreator: builder.query<
      Record<string, any>,
      { creatorId: string } & QueryListingsParams
    >({
      query: ({ creatorId, ...params }) => ({
        url: `/listings/creator/${creatorId}`,
        method: 'GET',
        params,
      }),
      providesTags: [listingTag],
    }),

    // ─── Admin Endpoints ─────────────────────────────────────

    // [Admin] Get pending listings (in_review status)
    getPendingListings: builder.query<Record<string, any>, QueryListingsParams>({
      query: (params = {}) => ({
        url: `/listings/admin/pending`,
        method: 'GET',
        params,
      }),
      providesTags: [listingTag],
    }),

    // [Admin] Review listing (full lifecycle management)
    adminReviewListing: builder.mutation<
      Record<string, any>,
      { id: string; payload: AdminReviewListingPayload; options: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/listings/admin/${id}/review`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [listingTag],
    }),

    // [Admin] Confirm listing fee payment (self-listing: awaiting_fee → live)
    adminConfirmFee: builder.mutation<Record<string, any>, { id: string; options: OptionType }>({
      query: ({ id }) => ({
        url: `/listings/admin/${id}/confirm-fee`,
        method: 'POST',
      }),
      invalidatesTags: [listingTag],
    }),
  }),
});

export const {
  // Seller
  useCreateListingMutation,
  useGetMyListingsQuery,
  useLazyGetMyListingsQuery,
  useUpdateListingMutation,
  useDeleteListingMutation,
  useSubmitCounterOfferMutation,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useDelistListingMutation,
  // Public
  useGetListingsQuery,
  useLazyGetListingsQuery,
  useGetListingByIdQuery,
  useLazyGetListingByIdQuery,
  useGetListingsByStoreQuery,
  useLazyGetListingsByStoreQuery,
  useGetListingsByCreatorQuery,
  useLazyGetListingsByCreatorQuery,
  // Admin
  useGetPendingListingsQuery,
  useLazyGetPendingListingsQuery,
  useAdminReviewListingMutation,
  useAdminConfirmFeeMutation,
} = listingsApi;
