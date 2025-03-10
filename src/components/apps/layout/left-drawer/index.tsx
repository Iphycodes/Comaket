import React from 'react';
import { Layout } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

const { Sider } = Layout;
interface LeftDrawerProps {
  toggleLeftDrawer: boolean;
}

const LeftDrawer: React.FC<LeftDrawerProps> = ({}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  return (
    <Sider
      collapsed={true}
      collapsedWidth={0}
      className="dash-sider rounded-r-2xl border-r border-r-gray-200 rounded-br-3xl p-0 text-lg shadow-2xl shadow-gray-400"
      width={400}
      style={{
        overflow: 'auto',
        position: 'fixed',
        padding: '0',
        height: '100vh',
        scrollbarWidth: 'none',
        scrollbarColor: 'red',
        ...(isMobile ? { right: -5 } : { left: 80 }),
        top: 0,
        bottom: 0,
        zIndex: 10,
      }}
    ></Sider>
  );
};

export default LeftDrawer;
