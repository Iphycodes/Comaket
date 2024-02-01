import { api } from '../api';
import {
  mailTransactionUrl,
  transactionAnalyticsUrl,
  transactionsUrl,
} from '@grc/_shared/constant';
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
    mailTransaction: builder.query({
      query: (params) => ({
        url: `${mailTransactionUrl}`,
        params,
      }),
    }),
  }),
});

export const {
  useLazyGetTransactionAnalyticsQuery,
  useLazyGetAllTransactionsQuery,
  useLazyMailTransactionQuery,
  endpoints: { getTransactionAnalytics, getAllTransactions, mailTransaction },
} = transactionsApi;
