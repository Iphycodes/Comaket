import { businessProfileUrl, PATCH } from '@grc/_shared/constant';
import { api } from '@grc/services/api';
import { businessProfileTag } from '@grc/services/tags';

export const businessProfileApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBusinessProfile: builder.query({
      query: (params) => ({
        url: businessProfileUrl,
        params,
      }),
      providesTags: [businessProfileTag],
    }),
    updateBusinessProfile: builder.mutation({
      query: ({ payload, id }) => {
        return {
          url: `${businessProfileUrl}/${id}`,
          method: PATCH,
          body: payload,
        };
      },
      invalidatesTags: [businessProfileTag],
    }),
  }),
});

export const {
  useUpdateBusinessProfileMutation,
  useLazyGetBusinessProfileQuery,
  endpoints: { getBusinessProfile },
} = businessProfileApi;
