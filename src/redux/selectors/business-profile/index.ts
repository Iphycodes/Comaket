import { createSelector } from 'reselect';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import { getBusinessProfile } from '@grc/services/settings/business-profile';

export const selectBusinessAccount = (state: RootState, params: QueryArgs | string) => {
  const businessProfile = getBusinessProfile.select(params)(state);
  return businessProfile || {};
};

export const selectBusinessAccountData = createSelector(
  selectBusinessAccount,
  (businessProfile) => {
    return businessProfile?.data?.data?.[0];
  }
);
