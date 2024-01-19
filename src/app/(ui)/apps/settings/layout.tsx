'use client';

import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { appNav } from '@grc/app/nav';
import { SettingsSideNav } from '@grc/components/apps/layout/side-nav';
import { AppHeader } from '@grc/components/giro-pay/layout/app-header';
import { Layout } from 'antd';
import { ReactElement } from 'react';

const { Content } = Layout;

type GiroDebitPageProps = {
  children?: ReactElement | ReactElement[];
};

const AppsBaseLayout = (props: GiroDebitPageProps) => {
  const { children } = props;
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const tabletResponsive = useMediaQuery(mediaSize.tablet);
  const collapse = false;

  return (
    <Layout hasSider={true}>
      <SettingsSideNav items={appNav.settingsMenuItems} />
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
        <Content className="main-content">
          <div className="bg-gray-50" style={{ padding: 40, minHeight: '100vh' }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AppsBaseLayout;
