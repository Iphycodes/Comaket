import { createSelector } from 'reselect';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import { getDashboardAnalytics } from '@grc/services/dashboard';

export const selectDashboardAnalytics = (state: RootState, params: QueryArgs | string) =>
  getDashboardAnalytics.select(params)(state);

export const selectDashboardAnalyticsData = createSelector(
  selectDashboardAnalytics,
  (transactionAnalytics) => {
    return transactionAnalytics.data?.data;
  }
);
