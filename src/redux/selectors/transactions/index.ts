import { createSelector } from 'reselect';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import { getAllTransactions } from '@grc/services/transactions';

export const selectAllTransactions = (state: RootState, params: QueryArgs | string) =>
  getAllTransactions.select(params)(state);

export const selectAllTransactionsData = createSelector(
  selectAllTransactions,
  (allTransactions) => {
    // const transactions = omit(allTransactions.data?.data, [
    //   'createdAt',
    //   'updatedAt',
    //   'publicId',
    //   'meta',
    // ]);
    return allTransactions.data?.data;
  }
);
