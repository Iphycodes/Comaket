'use client';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import { appNav } from '@grc/app/nav';
import LeftDrawer from '@grc/components/apps/layout/left-drawer';
import SideNav from '@grc/components/apps/layout/side-nav';
import { Layout } from 'antd';
import React, { ReactElement, useContext, useState } from 'react';
import FindVendorDrawer from '../../../components/apps/find-vendor-drawer';
import NotificationsDrawer from '@grc/components/apps/notification-drawer';
import CreateStoreModal from '@grc/components/apps/create-store-modal';
import ProfileDrawer from '@grc/components/apps/profile-drawer';
import SellItemModal from '@grc/components/apps/sell-item-modal';
import ChatsModal from '@grc/components/apps/chats-modal';

const { Content, Footer } = Layout;

interface AppBaseLayoutProps {
  // Add your prop types here
  children?: ReactElement | ReactElement[];
}

const AppBaseLayout: React.FC<AppBaseLayoutProps> = ({ children }) => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const tabletResponsive = useMediaQuery(mediaSize.tablet);
  const {
    toggleSider,
    setToggleSider,
    toggleNotificationsDrawer,
    setToggleNotificationsDrawer,
    toggleFindVendorDrawer,
    setToggleFindVendorDrawer,
    toggleProfileDrawer,
    setToggleProfileDrawer,
    isCreateStoreModalOpen,
    setIsCreateStoreModalOpen,
    isSellItemModalOpen,
    setIsSellItemModalOpen,
    isChatsModalOpen,
    setIsChatsModalOpen,
  } = useContext(AppContext);
  const [selectedKey, setSelectedKey] = useState('');

  const handleLayoutBodyClick = () => {
    setSelectedKey('');
    setToggleSider(false);
    setToggleFindVendorDrawer(true);
    setToggleNotificationsDrawer(true);
    setToggleProfileDrawer(true);
  };

  return (
    <Layout hasSider={true} className="bg-background">
      <SideNav
        appNav={appNav}
        toggleSider={toggleSider}
        selectedKey={selectedKey}
        setSelectedKey={setSelectedKey}
        setToggleSider={setToggleSider}
        setIsCreateStoreModalOpen={setIsCreateStoreModalOpen}
        setIsSellItemModalOpen={setIsSellItemModalOpen}
        setIsChatsModalOpen={setIsChatsModalOpen}
      />
      <LeftDrawer toggleLeftDrawer={!toggleSider} />
      <FindVendorDrawer toggleFindVendorDrawer={toggleFindVendorDrawer} />
      <NotificationsDrawer toggleNoticationDrawer={toggleNotificationsDrawer} />
      <ProfileDrawer toggleProfileDrawer={toggleProfileDrawer} />
      <CreateStoreModal
        setSelectedKey={setSelectedKey}
        isCreateStoreModalOpen={isCreateStoreModalOpen}
        setIsCreateStoreModalOpen={setIsCreateStoreModalOpen}
      />
      <SellItemModal
        setSelectedKey={setSelectedKey}
        isSellItemModalOpen={isSellItemModalOpen}
        setIsSellItemModalOpen={setIsSellItemModalOpen}
      />
      <ChatsModal
        setSelectedKey={setSelectedKey}
        isChatsModalOpen={isChatsModalOpen}
        setIsChatsModalOpen={setIsChatsModalOpen}
      />
      <Layout
        className="body-layout relative z-0 bg-background"
        style={{
          marginLeft: `${mobileResponsive ? 0 : tabletResponsive ? 0 : '300px'}`,
          transition: 'margin-left 0.3s ease',
        }}
        onClick={handleLayoutBodyClick}
      >
        {/* <AppHeader handleSwitchAccountMode={handleSwitchAccountMode} /> */}
        <Content className="main-content">
          <div
            className={`dark:text-white ${mobileResponsive ? 'p-4' : 'px-[15%]'} py-6`}
            style={{ minHeight: '100vh' }}
          >
            {children}
          </div>
        </Content>
        <Footer className="shadow-sm border-t border-border/100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:text-white">
          Footer
        </Footer>
      </Layout>
    </Layout>
  );
};

export default AppBaseLayout;
