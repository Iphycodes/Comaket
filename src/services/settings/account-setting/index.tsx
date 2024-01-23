import { accountSettingUrl, PUT, PATCH, POST } from '@grc/_shared/constant';
import { api } from '@grc/services/api';
import { accountSettingTag, updateUserTag, virtualAccountTag } from '@grc/services/tags';

export const accountSettingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAccountsSetting: builder.query({
      query: (params) => ({
        url: accountSettingUrl,
        params,
      }),
      providesTags: [accountSettingTag],
    }),
    getSecretKey: builder.mutation({
      query: ({ payload, id }) => ({
        url: `${accountSettingUrl}/${id}/secret`,
        method: POST,
        body: payload,
      }),
      invalidatesTags: [accountSettingTag],
    }),
    updateAccountSetting: builder.mutation({
      query: ({ payload, id }) => {
        return {
          url: `${accountSettingUrl}/${id}/settings`,
          method: PUT,
          body: payload,
        };
      },
      invalidatesTags: [accountSettingTag],
    }),

    updateAccount: builder.mutation({
      query: ({ payload, id }) => {
        return {
          url: `${accountSettingUrl}/${id}`,
          method: PATCH,
          body: payload,
        };
      },
      invalidatesTags: [accountSettingTag, updateUserTag, virtualAccountTag],
    }),
  }),
});

export const {
  useUpdateAccountSettingMutation,
  useLazyGetAccountsSettingQuery,
  useUpdateAccountMutation,
  useGetSecretKeyMutation,
  endpoints: { getAccountsSetting, getSecretKey },
} = accountSettingApi;
