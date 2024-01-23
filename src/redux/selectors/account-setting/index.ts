import { createSelector } from 'reselect';
import { RootState } from '../../store';
import type { QueryArgs } from '@grc/_shared/namespace';
import { getAccountsSetting } from '@grc/services/settings/account-setting';

export const selectAccountSetting = (state: RootState, params: QueryArgs | string) =>
  getAccountsSetting.select(params)(state);

export const selectAccountSettingData = createSelector(selectAccountSetting, (accountSetting) => {
  return accountSetting.data?.data;
});
