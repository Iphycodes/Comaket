import React from 'react';
import { Layout } from 'antd';

const { Sider } = Layout;

interface ProfileDrawerProps {
  // Add your prop types here
  toggleProfileDrawer: boolean;
}

const ProfileDrawer: React.FC<ProfileDrawerProps> = ({ toggleProfileDrawer }) => {
  return (
    <Sider
      collapsed={toggleProfileDrawer}
      collapsedWidth={0}
      className="dash-sider rounded-r-2xl border-r border-r-gray-200 rounded-br-3xl p-0 text-lg shadow-xl shadow-gray-400"
      width={350}
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
      <div>Profile Drawer</div>
    </Sider>
  );
};

export default ProfileDrawer;
