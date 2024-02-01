import { createSelector } from 'reselect';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import { getAllTransactions } from '@grc/services/transactions';
import { omit } from 'lodash';

export const selectAllTransactions = (state: RootState, params: QueryArgs | string) =>
  getAllTransactions.select(params)(state);

export const selectAllTransactionsData = createSelector(
  selectAllTransactions,
  (allTransactions) => {
    const transactions = Array.isArray(allTransactions.data?.data)
      ? allTransactions.data.data.map((item: any) =>
          omit(item, [
            '_id',
            'createdAt',
            'updatedAt',
            'publicId',
            'meta',
            'user',
            'requestSrc',
            'deprecated',
            'tRef',
            'id',
            'account',
            'live',
            'virtualAccount',
            'parentRef',
            'tags',
          ])
        )
      : null; // or an empty array, depending on your use case

    return transactions;
  }
);
