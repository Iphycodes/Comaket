import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { userTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface UserProfile {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatar: string | null;
  phone: string | null;
  role: 'user' | 'creator' | 'admin' | 'super_admin';
  authProvider: 'local' | 'google';
  isEmailVerified: boolean;
  location?: {
    state?: string;
    city?: string;
    address?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface UpdateUserProfilePayload {
  firstName?: string;
  lastName?: string;
  phone?: string;
  avatar?: string;
  location?: {
    state?: string;
    city?: string;
    address?: string;
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const usersApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Get current user profile
    getUserProfile: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/users/me`,
        method: 'GET',
      }),
      providesTags: [userTag],
    }),

    // Update current user profile
    updateUserProfile: builder.mutation<
      Record<string, any>,
      { payload: UpdateUserProfilePayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/users/me`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [userTag],
    }),

    // Delete account (soft delete)
    deleteAccount: builder.mutation<Record<string, any>, { password: string }>({
      query: (payload) => ({
        url: `/users/me`,
        method: 'DELETE',
        body: payload,
      }),
      invalidatesTags: [userTag],
    }),

    // Change password
    changePassword: builder.mutation<
      Record<string, any>,
      { currentPassword: string; newPassword: string }
    >({
      query: (payload) => ({
        url: `/users/me/password`,
        method: 'PATCH',
        body: payload,
      }),
    }),

    // Update notification preferences
    updateNotificationPreferences: builder.mutation<
      Record<string, any>,
      {
        emailNotifications?: boolean;
        pushNotifications?: boolean;
        orderUpdates?: boolean;
        promotions?: boolean;
      }
    >({
      query: (payload) => ({
        url: `/users/me/notifications`,
        method: 'PATCH',
        body: payload,
      }),
      invalidatesTags: [userTag],
    }),
  }),
});

export const {
  useGetUserProfileQuery,
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
  useDeleteAccountMutation,
  useChangePasswordMutation,
  useUpdateNotificationPreferencesMutation,
} = usersApi;
