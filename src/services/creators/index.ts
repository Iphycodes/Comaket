import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { creatorTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface BecomeCreatorPayload {
  username: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  contactEmail?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
  };
  profileImageUrl?: string | null;
  industries?: string[];
  location?: { country?: string; state?: string; city?: string };
  tags?: string[];
  planId?: string;
}

export interface UpdateCreatorPayload {
  username?: string;
  firstName?: string;
  lastName?: string;
  bio?: string;
  contactEmail?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    tiktok?: string;
    facebook?: string;
    youtube?: string;
  };
  profileImageUrl?: string | null;
  coverImage?: string | null;
  industries?: string[];
  featuredWorks?: string[];
  location?: { country?: string; state?: string; city?: string };
  tags?: string[];
  planId?: string;
}

export interface UpdateBankDetailsPayload {
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
}

export interface CreatorProfile {
  _id: string;
  userId:
    | string
    | {
        _id: string;
        firstName: string;
        lastName: string;
        email: string;
        avatar?: string;
      };
  username: string;
  slug: string;
  bio?: string;
  profileImageUrl?: string;
  coverImage?: string;
  contactEmail?: string;
  phoneNumber?: string;
  whatsappNumber?: string;
  website?: string;
  socialLinks?: {
    instagram?: string;
    twitter?: string;
    facebook?: string;
    tiktok?: string;
    youtube?: string;
  };
  industries?: string[];
  featuredWorks?: string[];
  location?: { country?: string; state?: string; city?: string };
  tags?: string[];
  plan: 'starter' | 'pro' | 'business';
  planExpiresAt?: string;
  bankDetails?: {
    bankName: string;
    bankCode: string;
    accountNumber: string;
    accountName: string;
  };
  status: string;
  isVerified: boolean;
  rating: number;
  totalStores: number;
  totalListings: number;
  totalSales: number;
  totalReviews: number;
  totalFollowers: number;
  createdAt: string;
  updatedAt: string;
}

export interface BrowseCreatorsParams {
  page?: number;
  perPage?: number;
  industry?: string;
  search?: string;
  state?: string;
  city?: string;
  isVerified?: boolean;
  plan?: string;
  sort?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const creatorsApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Check username availability (public, no auth needed)
    checkUsername: builder.mutation<
      Record<string, any>,
      { payload: { username: string }; options: OptionType }
    >({
      query: ({ payload: { username } }) => ({
        url: `/creators/check-username`,
        method: 'POST',
        body: { username },
      }),
    }),

    // Become a creator
    becomeCreator: builder.mutation<
      Record<string, any>,
      { payload: BecomeCreatorPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/creators/become`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [creatorTag],
    }),

    // Get my creator profile
    getMyCreatorProfile: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/creators/me`,
        method: 'GET',
      }),
      providesTags: [creatorTag],
    }),

    // Update my creator profile
    updateCreatorProfile: builder.mutation<
      Record<string, any>,
      { payload: UpdateCreatorPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/creators/me`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [creatorTag],
    }),

    // Update bank details
    updateBankDetails: builder.mutation<
      Record<string, any>,
      { payload: UpdateBankDetailsPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/creators/bank-details`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [creatorTag],
    }),

    // Browse creators (public)
    browseCreators: builder.query<Record<string, any>, BrowseCreatorsParams>({
      query: (params = {}) => ({
        url: `/creators`,
        method: 'GET',
        params,
      }),
      providesTags: [creatorTag],
    }),

    // Get creator by slug (public)
    getCreatorBySlug: builder.query<Record<string, any>, string>({
      query: (slug) => ({
        url: `/creators/${encodeURIComponent(slug)}`,
        method: 'GET',
      }),
      providesTags: [creatorTag],
    }),
  }),
});

export const {
  useCheckUsernameMutation,
  useBecomeCreatorMutation,
  useGetMyCreatorProfileQuery,
  useLazyGetMyCreatorProfileQuery,
  useUpdateCreatorProfileMutation,
  useUpdateBankDetailsMutation,
  useBrowseCreatorsQuery,
  useLazyBrowseCreatorsQuery,
  useGetCreatorBySlugQuery,
  useLazyGetCreatorBySlugQuery,
} = creatorsApi;
