import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import {
  useUpdateAccountSettingMutation,
  useLazyGetAccountsSettingQuery,
  useUpdateAccountMutation,
  useGetSecretKeyMutation,
} from '@grc/services/settings/account-setting';
import { useAppSelector } from '@grc/redux/store';
import { selectAccountSettingData } from '@grc/redux/selectors/account-setting';
import { useEffect } from 'react';

interface useAccountSettingReturnProps {
  updateAccountSetting: MutationTrigger<any>;
  updateAccountSettingResponse: Record<string, any>;
  getBankAccountsSettingResponse: Record<string, any>;
  accountSetting: Record<any, string> | any;
  getSecretKeyResponse: Record<string, any>;
  triggerSecretKey: ({ id }: any) => void;
  updateAccount: MutationTrigger<any>;
  updateAccountResponse: Record<string, any>;
}

interface useBankAccountSettingProps {
  key?: string;
  callAllAccountSetting?: boolean;
  callSecreteKey?: boolean;
}

export const useAccountSetting = ({
  callAllAccountSetting,
}: useBankAccountSettingProps): useAccountSettingReturnProps => {
  const [updateAccountSetting, updateAccountSettingResponse] = useUpdateAccountSettingMutation();
  const [updateAccount, updateAccountResponse] = useUpdateAccountMutation();
  const [triggerAccountSetting, getBankAccountsSettingResponse] = useLazyGetAccountsSettingQuery();
  const [triggerSecretKey, getSecretKeyResponse] = useGetSecretKeyMutation();

  const params = { population: JSON.stringify(['settings']) };

  const accountSetting = useAppSelector((state) => selectAccountSettingData(state, params));

  useEffect(() => {
    if (callAllAccountSetting) triggerAccountSetting(params);
  }, [callAllAccountSetting]);

  return {
    updateAccountSetting,
    triggerSecretKey,
    accountSetting: accountSetting?.[0]?.settings,
    updateAccountSettingResponse,
    getBankAccountsSettingResponse,
    getSecretKeyResponse,
    updateAccount,
    updateAccountResponse,
  };
};
