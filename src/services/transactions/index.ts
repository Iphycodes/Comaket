import { api } from '../api';
import { transactionAnalyticsUrl } from '@grc/_shared/constant';

export const transactionsApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionAnalytics: builder.query({
      query: (params) => ({
        url: `${transactionAnalyticsUrl}`,
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetTransactionAnalyticsQuery,
  endpoints: { getTransactionAnalytics },
} = transactionsApi;
