import { api } from '../api';
import { disbursementAnalyticsUrl } from '@grc/_shared/constant';

export const disbursementsApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    getDisbursements: builder.query({
      query: (params) => ({
        url: `${disbursementAnalyticsUrl}`,
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetDisbursementsQuery,

  endpoints: { getDisbursements },
} = disbursementsApi;
