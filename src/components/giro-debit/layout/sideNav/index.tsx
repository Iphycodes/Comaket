'use client';
import React, { ReactElement, useState } from 'react';
import { Layout, Menu } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { siderItems } from './libs/siderItems';
import { SiderHeader } from './libs/siderHeader';
const { Sider } = Layout;

export interface SideNavProps {
  items?: ReactElement[];
  setCollapsed?: React.Dispatch<React.SetStateAction<boolean>>;
  collapsed?: boolean;
}

export const SideNav = (props: SideNavProps) => {
  const {} = props;
  const isMobile = useMediaQuery(mediaSize.mobile);
  //   const isTablet = useMediaQuery(mediaSize.tablet);
  const [collapse, setCollapse] = useState<boolean>(false);
  //   const { collapse, setCollapse } = useContext(AppContext);

  //   const { theme } = useContext(AppContext);

  return (
    <Sider
      collapsed={false}
      collapsedWidth={isMobile ? 0 : 80}
      className="dash-sider"
      width={250}
      //   theme={'light'}
      style={{
        overflow: 'auto',
        //   transform: `translateX(${
        //     (isMobile || isTablet) && collapse ? "-100%" : "0"
        //   })`,
        backgroundColor: '#F3F3F3',
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
      <SiderHeader collapsed={collapse} setCollapsed={setCollapse} />
      <Menu
        className="sider-menu"
        style={{
          fontSize: '16px',
          backgroundColor: '#F3F3F3',
          color: '#666666',
        }}
        mode="inline"
        items={siderItems}
      />
    </Sider>
  );
};
