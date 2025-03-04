'use client';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import { appNav } from '@grc/app/nav';
import SideNav from '@grc/components/apps/layout/side-nav';
import { Layout } from 'antd';
import React, { ReactElement, useContext, useState } from 'react';
import NotificationsDrawer from '@grc/components/apps/notification-drawer';
import CreateStoreModal from '@grc/components/apps/create-store-modal';
import ChatsModal from '@grc/components/apps/chats-modal';
import MobileNav from '@grc/components/apps/layout/mobile-nav';

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
    setToggleNotificationsDrawer,
    setToggleFindVendorDrawer,
    setToggleProfileDrawer,
    isCreateStoreModalOpen,
    setIsCreateStoreModalOpen,
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
      {/* Only show SideNav on non-mobile screens */}
      {!mobileResponsive && (
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
      )}
      <NotificationsDrawer />
      <CreateStoreModal
        setSelectedKey={setSelectedKey}
        isCreateStoreModalOpen={isCreateStoreModalOpen}
        setIsCreateStoreModalOpen={setIsCreateStoreModalOpen}
      />
      {/* <SellItemModal
        isSellItemModalOpen={isSellItemModalOpen}
        setIsSellItemModalOpen={setIsSellItemModalOpen}
      /> */}
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
          // Add padding bottom for mobile to account for bottom navigation
          paddingBottom: mobileResponsive ? '64px' : '0',
        }}
        onClick={handleLayoutBodyClick}
      >
        <Content className="main-content">
          <div
            className={`dark:text-white ${mobileResponsive ? 'px-0' : 'px-[12%] py-6'}`}
            style={{ minHeight: '100vh' }}
          >
            {children}
          </div>
          {!mobileResponsive && (
            <Footer className="shadow-sm border-t border-border/100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:text-white">
              Footer
            </Footer>
          )}
        </Content>
      </Layout>

      {/* Show mobile navigation only on mobile screens */}
      {mobileResponsive && (
        <MobileNav
          appNav={appNav}
          setSelectedKey={setSelectedKey}
          setIsCreateStoreModalOpen={setIsCreateStoreModalOpen}
          setIsSellItemModalOpen={setIsSellItemModalOpen}
          setIsChatsModalOpen={setIsChatsModalOpen}
        />
      )}
    </Layout>
  );
};

export default AppBaseLayout;
