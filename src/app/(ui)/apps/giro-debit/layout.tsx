'use client';

import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { appNav } from '@grc/app/nav';
import { AppHeader } from '@grc/components/giro-debit/layout/app-header';
import { SideNav } from '@grc/components/giro-debit/layout/side-nav';
import { useAuth } from '@grc/hooks/useAuth';
import { Layout } from 'antd';
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

  const {} = useAuth({
    callAccounts: false,
    callCurrentAccount: false,
    callUser: true,
  });
  const formatPathText = (value: string) => value.replace(/\s+/g, '-').toLowerCase();
  const collapse = false;

  return (
    <Layout hasSider={true}>
      <SideNav items={appNav.items} />
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
        <Content className="main-content" style={{ background: '#ffffff' }}>
          <div style={{ padding: 40, minHeight: '100vh' }}>
            {isSettingsPath?.toLowerCase() === 'settings' && (
              <div className="flex border-b border-gray-300 shadow-sm">
                {' '}
                {[
                  'Profile Details',
                  'Business Profile',
                  'API Keys & Webhook URL',
                  'Change Password',
                  'Account Setting',
                ].map((text, index) => (
                  <div
                    onClick={() => push(`/apps/giro-debit/settings/${formatPathText(text)}`)}
                    key={`setting-tab_${index}`}
                    className={`text-base tracking-wide ${
                      formatPathText(text) === currentPage
                        ? 'text-blue border-b-2 font-medium border-blue'
                        : 'text-black'
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
        {/* <AppFooter /> */}
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default AppsBaseLayout;
