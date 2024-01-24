'use client';
import React, { useContext, useState } from 'react';
import { Layout, Menu } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { SiderHeader } from './libs/siderHeader';
import { MenuItem } from '@grc/_shared/helpers';
import { AppContext } from '@grc/app-context';
import { usePathname, useRouter } from 'next/navigation';
import { AuthDataType } from '@grc/_shared/namespace/auth';
const { Sider } = Layout;

export interface SideNavProps {
  items: MenuItem[];
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed?: boolean;
  authData: AuthDataType | null;
}

export const SideNav = (props: SideNavProps) => {
  const { items, authData } = props;
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [collapse, setCollapse] = useState<boolean>(false);
  //   const { collapse, setCollapse } = useContext(AppContext);
  //   const isTablet = useMediaQuery(mediaSize.tablet);
  const { handleLogOut } = useContext(AppContext);
  const router = useRouter();
  const pathname = usePathname();
  const urlPath = pathname?.split('/');

  const handleMenuClick = ({ key }: { key: React.Key | string }) => {
    if (key === 'logout') {
      handleLogOut();
      router.push('/auth/login');
    } else {
      router.push(`/apps/giro-pay/${key}`);
    }
  };

  return (
    <Sider
      collapsed={false}
      collapsedWidth={isMobile ? 0 : 80}
      className="dash-sider text-lg shadow-sm border-r border-border/100"
      width={250}
      style={{
        overflow: 'auto',
        position: 'fixed',
        padding: '0',
        height: '100vh',
        scrollbarWidth: 'none',
        scrollbarColor: 'red',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <SiderHeader
        accounts={authData?.accounts ?? []}
        currentAccount={authData?.currentAccount}
        collapsed={collapse}
        setCollapsed={setCollapse}
      />
      <Menu
        className="sider-menu text-card-foreground text-base"
        mode="inline"
        items={items}
        defaultSelectedKeys={['1']}
        selectedKeys={[urlPath?.[3] as string]}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};
