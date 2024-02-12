'use client';
import React, { useContext, useEffect, useState } from 'react';
import { Layout, Menu } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppSettingsSiderHeader } from './libs/siderHeader';
import { MenuItem } from '@grc/_shared/helpers';
import { usePathname, useRouter } from 'next/navigation';
import { AppContext } from '@grc/app-context';
const { Sider } = Layout;

export interface SettingsSideNavProps {
  items: MenuItem[];
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed?: boolean;
}

export const SettingsSideNav = (props: SettingsSideNavProps) => {
  const { items } = props;
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [collapse, setCollapse] = useState<boolean>(false);
  //   const { collapse, setCollapse } = useContext(AppContext);
  //   const isTablet = useMediaQuery(mediaSize.tablet);
  const router = useRouter();
  const pathname = usePathname();
  const urlPath = pathname?.split('/');

  const { toggleSider, setToggleSider } = useContext(AppContext);

  const handleMenuClick = ({ key }: { key: React.Key | string }) => {
    if (key === 'apps') {
      router.push(`/apps`);
    } else {
      router.push(`/apps/settings/${key}`);
    }

    setToggleSider(true);
  };

  useEffect(() => {
    !isMobile && setToggleSider(false);
  }, [isMobile]);

  return (
    <Sider
      collapsed={toggleSider}
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
      <AppSettingsSiderHeader
        setToggleSider={setToggleSider}
        collapsed={collapse}
        setCollapsed={setCollapse}
      />
      <Menu
        className="sider-menu mt-10 text-card-foreground text-base"
        mode="inline"
        items={items}
        defaultSelectedKeys={['1']}
        selectedKeys={[urlPath?.[3] as string]}
        onClick={handleMenuClick}
      />
    </Sider>
  );
};
