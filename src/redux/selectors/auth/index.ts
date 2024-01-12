import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import { getBusinesses, getApp, getConstants } from '@grc/services/auth';

export const selectBusiness = (state: RootState, params: QueryArgs | string) =>
  getBusinesses.select(params)(state);

export const selectBusinessData = createSelector(selectBusiness, (business) => {
  return business.data?.data;
});

export const selectApp = (state: RootState, params: QueryArgs | string) =>
  getApp.select(params)(state);

export const selectAppData = createSelector(selectApp, (app) => {
  return app.data?.data;
});

export const selectConst = (state: RootState, params: QueryArgs | string) =>
  getConstants.select(params)(state);

export const selectConstants = createSelector(selectConst, (app) => {
  return app.data;
});
