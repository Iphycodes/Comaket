import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { adminTag, userTag, creatorTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface DashboardStats {
  users: { total: number };
  creators: { total: number };
  stores: { total: number };
  listings: { total: number; pending: number; live: number };
  orders: { total: number; pending: number };
  revenue: {
    totalRevenue: number;
    platformRevenue: number;
    sellerPayouts: number;
  };
}

export interface AdminListUsersParams {
  page?: number;
  perPage?: number;
  role?: string;
  search?: string;
}

export interface AdminListCreatorsParams {
  page?: number;
  perPage?: number;
  status?: string;
  search?: string;
}

export interface UpdateUserRolePayload {
  role: 'user' | 'creator' | 'admin' | 'super_admin';
}

export interface UpdateCreatorStatusPayload {
  status: 'active' | 'suspended';
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const adminApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Get dashboard stats
    getDashboardStats: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/admin/dashboard`,
        method: 'GET',
      }),
      providesTags: [adminTag],
    }),

    // List all users
    adminListUsers: builder.query<Record<string, any>, AdminListUsersParams>({
      query: (params = {}) => ({
        url: `/admin/users`,
        method: 'GET',
        params,
      }),
      providesTags: [adminTag, userTag],
    }),

    // Update user role
    adminUpdateUserRole: builder.mutation<
      Record<string, any>,
      { id: string; payload: UpdateUserRolePayload; options: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/admin/users/${id}/role`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [adminTag, userTag],
    }),

    // List all creators
    adminListCreators: builder.query<Record<string, any>, AdminListCreatorsParams>({
      query: (params = {}) => ({
        url: `/admin/creators`,
        method: 'GET',
        params,
      }),
      providesTags: [adminTag, creatorTag],
    }),

    // Verify a creator (add verified badge)
    adminVerifyCreator: builder.mutation<Record<string, any>, { id: string; options: OptionType }>({
      query: ({ id }) => ({
        url: `/admin/creators/${id}/verify`,
        method: 'PATCH',
      }),
      invalidatesTags: [adminTag, creatorTag],
    }),

    // Update creator status (suspend/reactivate)
    adminUpdateCreatorStatus: builder.mutation<
      Record<string, any>,
      { id: string; payload: UpdateCreatorStatusPayload; options: OptionType }
    >({
      query: ({ id, payload }) => ({
        url: `/admin/creators/${id}/status`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [adminTag, creatorTag],
    }),
  }),
});

export const {
  useGetDashboardStatsQuery,
  useLazyGetDashboardStatsQuery,
  useAdminListUsersQuery,
  useLazyAdminListUsersQuery,
  useAdminUpdateUserRoleMutation,
  useAdminListCreatorsQuery,
  useLazyAdminListCreatorsQuery,
  useAdminVerifyCreatorMutation,
  useAdminUpdateCreatorStatusMutation,
} = adminApi;
