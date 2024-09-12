import React from 'react';
import { Layout } from 'antd';
import NotificationComponent from './lib/vendorAccount';

const { Sider } = Layout;
interface LeftDrawerProps {
  toggleNoticationDrawer: boolean;
}

const NotificationsDrawer: React.FC<LeftDrawerProps> = ({ toggleNoticationDrawer }) => {
  const mockNotificationsData = [
    {
      profilePicUrl: '/assets/imgs/mandate-logo.png',
      userName: 'perfume_plug',
      date: '23-07-2024',
      label: 'Started following your business',
    },
    {
      profilePicUrl: '/assets/imgs/debit-logo.png',
      businessName: 'Odogwu laptops',
      userName: 'Odg_nigeria',
      date: '23-07-2024',
      label: 'commented on product-#id1249332003',
    },
    {
      profilePicUrl: '/assets/imgs/mandate-logo.png',
      businessName: 'SNEAKER HEAD',
      userName: 'queenie_ng',
      date: '23-07-2024',
      label: 'posted a new product you may be interested in',
    },
    {
      profilePicUrl: '/assets/imgs/debit-logo.png',
      businessName: 'COMAKET',
      userName: 'queenie_ng',
      date: '23-07-2024',
      label: 'will run a server maintenance on monday 23/12/2025',
    },
    {
      profilePicUrl: '/assets/imgs/mandate-logo.png',
      businessName: 'SNEAKER HEAD',
      userName: 'queenie_ng',
      date: '23-07-2024',
      label: 'is a store you may be interested in checking out',
    },
  ];
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
      <div className="pb-2 sticky top-0 bg-white z-50">
        <div className="px-5 py-3 border-b border-b-gray-300">
          <div className="my-6 mb-10">
            <h1 className="text-[24px] font-semibold">Notifications</h1>
          </div>
        </div>
      </div>
      <div className="overflow-y-scroll">
        <div className="px-5 py-3 flex items-center justify-between">
          <span className="font-semibold text-[14px]">Recent</span>
          <span className="font-semibold text-[14px] text-blue cursor-pointer">Clear All</span>
        </div>
        <div className="px-5">
          {mockNotificationsData.map((mockNotification, idx) => {
            return <NotificationComponent key={idx} notificationData={mockNotification} />;
          })}
        </div>
      </div>
    </Sider>
  );
};

export default NotificationsDrawer;
