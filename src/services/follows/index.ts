import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { creatorTag, storeTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type FollowTargetType = 'creator' | 'store';

export interface ToggleFollowPayload {
  targetType: FollowTargetType;
  targetId: string;
}

export interface CheckFollowPayload {
  targetType: FollowTargetType;
  targetIds: string[];
}

export interface ToggleFollowResponse {
  followed: boolean;
  totalFollowers: number;
}

export interface FollowsParams {
  page?: number;
  perPage?: number;
  targetType?: FollowTargetType;
}

export interface FollowersParams {
  page?: number;
  perPage?: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const followsApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Toggle follow/unfollow
    toggleFollow: builder.mutation<
      Record<string, any>,
      { payload: ToggleFollowPayload; options?: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/follows/toggle`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [creatorTag, storeTag],
    }),

    // Check follow status for multiple targets
    checkFollow: builder.mutation<
      Record<string, any>,
      { payload: CheckFollowPayload; options?: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/follows/check`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Get my follows
    getMyFollows: builder.query<Record<string, any>, FollowsParams>({
      query: (params = {}) => ({
        url: `/follows`,
        method: 'GET',
        params,
      }),
    }),

    // Get my follow count
    getFollowCount: builder.query<Record<string, any>, FollowTargetType | void>({
      query: (targetType) => ({
        url: `/follows/count`,
        method: 'GET',
        params: targetType ? { targetType } : {},
      }),
    }),

    // Get followers of a creator/store (public)
    getFollowers: builder.query<
      Record<string, any>,
      { targetType: FollowTargetType; targetId: string; params?: FollowersParams }
    >({
      query: ({ targetType, targetId, params = {} }) => ({
        url: `/follows/${targetType}/${targetId}/followers`,
        method: 'GET',
        params,
      }),
    }),
  }),
});

export const {
  useToggleFollowMutation,
  useCheckFollowMutation,
  useGetMyFollowsQuery,
  useLazyGetMyFollowsQuery,
  useGetFollowCountQuery,
  useLazyGetFollowCountQuery,
  useGetFollowersQuery,
  useLazyGetFollowersQuery,
} = followsApi;
