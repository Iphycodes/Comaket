'use client';

import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { appNav } from '@grc/app/nav';
import { AppHeader } from '@grc/components/giro-debit/layout/app-header';
import { SideNav } from '@grc/components/giro-debit/layout/side-nav';
import { useAuth } from '@grc/hooks/useAuth';
import { Layout } from 'antd';
import { Footer } from 'antd/es/layout/layout';
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
  const {} = useAuth({
    callAccounts: false,
    callCurrentAccount: false,
    callUser: true,
  });
  //   const { theme } = useContext(AppContext);
  // const [collapse, setCollapse] = useState<boolean>(false);

  const collapse = false;

  return (
    <Layout hasSider={true}>
      {/* <SideNav setCollapsed={setCollapsed} collapsed={collapsed} /> */}
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
          <div style={{ padding: 40, minHeight: '100vh' }}>{children}</div>
        </Content>
        {/* <AppFooter /> */}
        <Footer>Footer</Footer>
      </Layout>
    </Layout>
  );
};

export default AppsBaseLayout;