import React from 'react';
import { Layout } from 'antd';

const { Sider } = Layout;
interface LeftDrawerProps {
  toggleNoticationDrawer: boolean;
}

const NotificationsDrawer: React.FC<LeftDrawerProps> = ({ toggleNoticationDrawer }) => {
  return (
    <Sider
      collapsed={toggleNoticationDrawer}
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
        left: 80,
        top: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <div>Notifications</div>
    </Sider>
  );
};

export default NotificationsDrawer;
