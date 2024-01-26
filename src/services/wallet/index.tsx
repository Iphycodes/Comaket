import { bankUrl, POST, virtualAcctUrl, mailTransactionUrl } from '@grc/_shared/constant';
import { virtualAccountTag } from '../tags';
import { api } from '@grc/services/api';

export const virtualAccountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createWallet: builder.mutation<Record<string, any>, Record<string, any>>({
      query: ({ payload }) => {
        return {
          url: virtualAcctUrl,
          method: POST,
          body: payload,
        };
      },
      invalidatesTags: [virtualAccountTag],
    }),
    getWallets: builder.query({
      query: (params) => ({
        url: virtualAcctUrl,
        params,
      }),
      providesTags: [virtualAccountTag],
    }),
    getAccountTransaction: builder.query({
      query: (params) => ({
        url: `/transactions`,
        params,
      }),
      providesTags: [virtualAccountTag],
    }),
    getTotalBalance: builder.query({
      query: (params) => ({
        url: `${virtualAcctUrl}/balance/all`,
        params,
      }),
      providesTags: [virtualAccountTag],
    }),
    getBalance: builder.query({
      query: ({ id }) => ({
        url: `${virtualAcctUrl}/${id}/balance`,
      }),
      providesTags: [virtualAccountTag],
    }),
    getBanks: builder.query({
      query: () => ({
        url: `${bankUrl}/banks`,
      }),
    }),
    mailTransaction: builder.query({
      query: (params) => ({
        url: `${mailTransactionUrl}`,
        params,
      }),
    }),
    getBankDetails: builder.mutation<Record<string, any>, Record<string, any>>({
      query: ({ payload }) => {
        return {
          url: `${bankUrl}/validate`,
          method: POST,
          body: payload,
        };
      },
      invalidatesTags: [virtualAccountTag],
    }),
    singlePayout: builder.mutation<Record<string, any>, Record<string, any>>({
      query: ({ payload }) => {
        return {
          url: `${virtualAcctUrl}/transfer`,
          method: POST,
          body: payload,
        };
      },
      invalidatesTags: [virtualAccountTag],
    }),
    batchPayout: builder.mutation<Record<string, any>, Record<string, any>>({
      query: ({ payload }) => {
        return {
          url: `${virtualAcctUrl}/batch-transfer`,
          method: POST,
          body: payload,
        };
      },
      invalidatesTags: [virtualAccountTag],
    }),
  }),
});

export const {
  useCreateWalletMutation,
  useLazyGetWalletsQuery,
  useLazyGetAccountTransactionQuery,
  useLazyGetBalanceQuery,
  useLazyGetTotalBalanceQuery,
  useGetBankDetailsMutation,
  useLazyGetBanksQuery,
  useSinglePayoutMutation,
  useBatchPayoutMutation,
  useLazyMailTransactionQuery,
  endpoints: { getWallets, getTotalBalance, getAccountTransaction, getBalance, getBanks },
} = virtualAccountApi;
