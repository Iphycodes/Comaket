'use client';

import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { appNav } from '@grc/app/nav';
import { AppHeader } from '@grc/components/giro-pay/layout/app-header';
import { SideNav } from '@grc/components/giro-pay/layout/side-nav';
import SwitchWalletHeader from '@grc/components/giro-pay/layout/switch-wallet';
import { useAccountSetting } from '@grc/hooks/useAccountSetting';
import { useAuth } from '@grc/hooks/useAuth';
import { useWallet } from '@grc/hooks/useWallet';
import { Layout } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { usePathname, useRouter } from 'next/navigation';
import { ReactElement, useEffect } from 'react';

const { Content } = Layout;

type GiroPayPageProps = {
  children?: ReactElement | ReactElement[];
};

const AppsBaseLayout = (props: GiroPayPageProps) => {
  const { children } = props;
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const tabletResponsive = useMediaQuery(mediaSize.tablet);
  const { push } = useRouter();
  const pathname = usePathname();
  const pathUrl = pathname?.split('/');
  const isSettingsPath = pathUrl?.[3];
  const currentPage = pathUrl?.[4];

  const { authData, isLiveMode } = useAuth({
    callAccounts: false,
    callCurrentAccount: false,
    callUser: true,
  });
  const { updateAccount, updateAccountResponse } = useAccountSetting({
    callAllAccountSetting: true,
  });

  const { wallets, walletsResponse, handleWallets } = useWallet({
    callAllWallets: true,
    callAccountTransaction: true,
    callTotalBalance: true,
    callBalance: true,
  });

  const { isLoading: isLoadingWallets, isSuccess: isSuccessfulFetchingWallets } = walletsResponse;
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

  const formatPathText = (value: string) => value.replace(/\s+/g, '-').toLowerCase();

  return (
    <Layout hasSider={true}>
      <SideNav authData={authData} items={appNav.items} />
      <Layout
        className="body-layout bg-background"
        style={{
          position: 'relative',
          zIndex: 0,
          marginLeft: `${mobileResponsive ? 0 : tabletResponsive ? 0 : '250px'}`,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <AppHeader isLiveMode={isLiveMode} handleSwitchAccountMode={handleSwitchAccountMode} />
        <SwitchWalletHeader
          setWallet={handleWallets}
          isLoadingWallets={isLoadingWallets}
          wallets={wallets}
        />
        <Content className="main-content">
          <div
            className={`dark:text-white ${mobileResponsive ? 'p-4' : 'p-10'} p-10`}
            style={{ minHeight: '100vh' }}
          >
            {isSettingsPath?.toLowerCase() === 'settings' && (
              <div className="flex shadow-sm border-b border-border/100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                {' '}
                {['Business Profile', 'API Keys & Webhook URL', 'Account'].map((text, index) => (
                  <div
                    onClick={() => push(`/apps/giro-pay/settings/${formatPathText(text)}`)}
                    key={`setting-tab_${index}`}
                    className={`text-base tracking-wide ${
                      formatPathText(text) === currentPage
                        ? 'text-blue border-b-2 font-medium border-blue'
                        : 'text-muted-foreground'
                    } py-4 px-3 cursor-pointer`}
                  >
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            )}
            {children}
          </div>
        </Content>
        <Footer className="shadow-sm border-t border-border/100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:text-white">
          Footer
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppsBaseLayout;
