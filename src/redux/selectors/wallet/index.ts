import { createSelector } from 'reselect';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import {
  getWallets,
  getTotalBalance,
  getAccountTransaction,
  getBalance,
  getBanks,
} from '@grc/services/wallet';

export const selectWallet = (state: RootState, params: QueryArgs | string) =>
  getWallets.select(params)(state);

export const selectWalletData = createSelector(selectWallet, (account) => {
  return account.data?.data;
});

export const selectWalletTransaction = (state: RootState, params: QueryArgs | string) =>
  getAccountTransaction.select(params)(state);

export const selectWalletTransactionData = createSelector(
  selectWalletTransaction,
  (transaction) => {
    return transaction.data?.data;
  }
);

export const selectTotalBalance = (state: RootState, params: QueryArgs | string) =>
  getTotalBalance.select(params)(state);

export const selectTotalBalanceData = createSelector(selectTotalBalance, (balance) => {
  return balance.data?.data;
});

export const selectBalance = (state: RootState, params: QueryArgs | string) =>
  getBalance.select(params)(state);

export const selectBalanceData = createSelector(selectBalance, (balance) => {
  return balance.data?.data;
});

export const selectBanks = (state: RootState, params: QueryArgs | string) =>
  getBanks.select(params)(state);

export const selectBanksData = createSelector(selectBanks, (bank) => {
  return bank?.data?.data;
});
