'use client';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import AppsWrapper from '@grc/components/apps';
import { AppHeader } from '@grc/components/giro-pay/layout/app-header';
import { useAccountSetting } from '@grc/hooks/useAccountSetting';
import { useAuth } from '@grc/hooks/useAuth';
import { useWallet } from '@grc/hooks/useWallet';
import { useTheme } from 'next-themes';
import { useEffect } from 'react';

const AppsPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useTheme();
  const { isLiveMode, authData } = useAuth({ callUser: true });
  const { updateAccount, updateAccountResponse } = useAccountSetting({
    callAllAccountSetting: true,
  });

  const { handleWallets, walletsResponse } = useWallet({
    callAllWallets: true,
    callAccountTransaction: true,
    callTotalBalance: true,
    callBalance: true,
  });

  const { isSuccess: isSuccessfulFetchingWallets } = walletsResponse;
  const { isSuccess: isSuccessfulupdatingAccount } = updateAccountResponse;

  const handleSwitchAccountMode = (value: boolean) => {
    updateAccount({
      payload: { live: value },
      id: authData?.currentAccount?.id,
      options: {
        successMessage: `Account successfully updated`,
      },
    });
  };

  useEffect(() => {
    if (isSuccessfulupdatingAccount && isSuccessfulFetchingWallets) {
      handleWallets(walletsResponse?.data?.data[0]);
    }
  }, [
    isSuccessfulupdatingAccount,
    isSuccessfulFetchingWallets,
    walletsResponse?.fulfilledTimeStamp,
  ]);
  const isMobile = useMediaQuery(mediaSize.mobile);

  return (
    <main
      className={`h-screen flex flex-col items-center bg-background ${isMobile ? 'px-0' : 'px-4'}`}
    >
      <header className={`w-full max-w-full ${isMobile ? 'px-2' : 'px-6'}`}>
        <AppHeader isLiveMode={isLiveMode} handleSwitchAccountMode={handleSwitchAccountMode} />
      </header>
      <div className="mt-24 flex items-center justify-center justify-items-center justify-self-center content-center text-black dark:text-white">
        <AppsWrapper mobileResponsive={mobileResponsive} theme={theme} />
      </div>
    </main>
  );
};

export default AppsPage;
