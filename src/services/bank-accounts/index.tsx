import { bankAccountsUrl } from '@grc/_shared/constant';
import { bankAccountsTag } from '../tags';
import { api } from '@grc/services/api';

export const bankAccountApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getBankAccounts: builder.query({
      query: (params) => ({
        url: bankAccountsUrl,
        params,
      }),
      providesTags: [bankAccountsTag],
    }),
  }),
});

export const {
  useLazyGetBankAccountsQuery,
  endpoints: { getBankAccounts },
} = bankAccountApi;
