import { api } from '../api';
import { transactionAnalyticsUrl, transactionsUrl } from '@grc/_shared/constant';
import { transactionsTag } from '../tags';

export const transactionsApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    getTransactionAnalytics: builder.query({
      query: (params) => ({
        url: `${transactionAnalyticsUrl}`,
        params,
      }),
    }),
    getAllTransactions: builder.query({
      query: (params) => ({
        url: `${transactionsUrl}`,
        params,
      }),
      providesTags: [transactionsTag],
    }),
  }),
});

export const {
  useLazyGetTransactionAnalyticsQuery,
  useLazyGetAllTransactionsQuery,
  endpoints: { getTransactionAnalytics, getAllTransactions },
} = transactionsApi;
