'use client';
import { AccountSetting } from '@grc/components/giro-pay/settings/account';

const AccountSettingPage = () => {
  const handleUpdateAccountSetting = (payload: Record<string, any>) => {
    console.log('handleUpdateAccountSetting values::', payload);
  };
  const isAccountSettingLoading = false;

  return (
    <AccountSetting
      handleUpdateAccountSetting={handleUpdateAccountSetting}
      isAccountSettingLoading={isAccountSettingLoading}
    />
  );
};

export default AccountSettingPage;
