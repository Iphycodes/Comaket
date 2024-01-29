import { createSelector } from 'reselect';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import { getTransactionAnalytics } from '@grc/services/transactions';

export const selectTransactionAnalytics = (state: RootState, params: QueryArgs | string) =>
  getTransactionAnalytics.select(params)(state);

export const selectTransactionAnalyticsData = createSelector(
  selectTransactionAnalytics,
  (transactionAnalytics) => {
    return transactionAnalytics.data?.data;
  }
);
