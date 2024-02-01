import { createSelector } from 'reselect';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import { getBankAccounts } from '@grc/services/bank-accounts';

export const selectBankAccount = (state: RootState, params: QueryArgs | string) =>
  getBankAccounts.select(params)(state);

export const selectBankAccountData = createSelector(selectBankAccount, (benficiaryAccount) => {
  return benficiaryAccount.data?.data;
});
