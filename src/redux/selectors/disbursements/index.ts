import { createSelector } from 'reselect';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import { getDisbursements } from '@grc/services/disbursements';
import { omit } from 'lodash';

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
    // const disbursmentData = Array.isArray(disbursement.data?.data?.recentDisbursements)
    //   ? disbursement.data?.data?.recentDisbursements?.map((item: any) => omit(item, ['_id']))
    //   : null;

    const disbursementData = disbursement.data?.data?.recentDisbursements?.map((item: any) =>
      omit(item, [
        '_id',
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
        '_v',
        '__v',
        'balance',
        'currency',
      ])
    );
    // return disbursement.data?.data?.recentDisbursements;
    return disbursementData;
  }
);
