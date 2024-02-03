import { createSelector } from 'reselect';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import { getDisbursements } from '@grc/services/disbursements';

export const selectDisbursementAnalytics = (state: RootState, params: QueryArgs | string) =>
  getDisbursements.select(params)(state);

export const selectRecentDisbursements = (state: RootState, params: QueryArgs | string) =>
  getDisbursements.select(params)(state);

export const selectDisbursementAnalyticsData = createSelector(
  selectDisbursementAnalytics,
  (disbursmentAnalytics) => {
    return disbursmentAnalytics.data?.data?.disbursementAnalytics;
  }
);

export const selectRecentDisbursementData = createSelector(
  selectRecentDisbursements,
  (disbursement) => {
    return disbursement.data?.data?.recentDisbursements;
  }
);
