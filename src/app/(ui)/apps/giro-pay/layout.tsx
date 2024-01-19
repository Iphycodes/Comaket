'use client';

import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { appNav } from '@grc/app/nav';
import SelectVirtualAcct from '@grc/components/giro-pay/dashboard/libs/select-virtual-acct';
import { AppHeader } from '@grc/components/giro-pay/layout/app-header';
import { SideNav } from '@grc/components/giro-pay/layout/side-nav';
import { useAuth } from '@grc/hooks/useAuth';
import { Layout, Space } from 'antd';
import { Footer } from 'antd/es/layout/layout';
import { usePathname, useRouter } from 'next/navigation';
import { ReactElement } from 'react';

const { Content } = Layout;

// import { useContext } from 'react';
// import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
// import { AppContext } from '@grc/app-context';

type GiroDebitPageProps = {
  children?: ReactElement | ReactElement[];
};

const AppsBaseLayout = (props: GiroDebitPageProps) => {
  const { children } = props;
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const tabletResponsive = useMediaQuery(mediaSize.tablet);
  const { push } = useRouter();
  const pathname = usePathname();
  const pathUrl = pathname?.split('/');
  const isSettingsPath = pathUrl?.[3];
  const currentPage = pathUrl?.[4];

  const { authData } = useAuth({
    callAccounts: false,
    callCurrentAccount: false,
    callUser: true,
  });
  const formatPathText = (value: string) => value.replace(/\s+/g, '-').toLowerCase();
  const collapse = false;

  return (
    <Layout hasSider={true}>
      <SideNav authData={authData} items={appNav.items} />
      <Layout
        className="body-layout"
        style={{
          position: 'relative',
          zIndex: 0,
          marginLeft: `${
            mobileResponsive ? 0 : tabletResponsive ? 0 : collapse ? '80px' : '250px'
          }`,
          transition: 'margin-left 0.3s ease',
        }}
      >
        <AppHeader />
        <div
          className="flex w-full items-center justify-end px-10 border-b h-8 bg-cyan-50"
          style={{ position: 'sticky', minHeight: '32px', top: 64, zIndex: 10 }}
        >
          <Space size={10}>
            <span className="font-thin text-[14px] text-blue">Switch Virtual Account: </span>
            <SelectVirtualAcct
              isLoadingAccounts={false}
              vAccount={{} as any}
              accounts={[
                { accountName: 'John doe', accountNumber: '00000', bankName: 'demo' } as any,
              ]}
              setVAccount={() => {}}
              className="virtual-select"
            />
            {/* <Select
              placeholder={'Virtual Account'}
              size="small"
              className="w-[240px] virtual-select"
            /> */}
          </Space>
        </div>
        <Content className="main-content">
          <div className="bg-gray-50" style={{ padding: 40, minHeight: '100vh' }}>
            {isSettingsPath?.toLowerCase() === 'settings' && (
              <div className="flex border-b border-gray-300 shadow-sm">
                {' '}
                {['Business Profile', 'API Keys & Webhook URL', 'Account Setting'].map(
                  (text, index) => (
                    <div
                      onClick={() => push(`/apps/giro-pay/settings/${formatPathText(text)}`)}
                      key={`setting-tab_${index}`}
                      className={`text-base tracking-wide ${
                        formatPathText(text) === currentPage
                          ? 'text-blue border-b-2 font-medium border-blue'
                          : 'text-black'
                      } py-4 px-3 cursor-pointer`}
                    >
                      <span>{text}</span>
                    </div>
                  )
                )}
              </div>
            )}
            {children}
          </div>
        </Content>
        {/* <AppFooter /> */}
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default AppsBaseLayout;
