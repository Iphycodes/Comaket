'use client';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import { appNav } from '@grc/app/nav';
import SideNav from '@grc/components/apps/layout/side-nav';
import { Layout } from 'antd';
import React, { ReactElement, useContext, useEffect, useState } from 'react';
import NotificationsDrawer from '@grc/components/apps/notification-drawer';
import CreateStoreModal from '@grc/components/apps/create-store-modal';
import ChatsModal from '@grc/components/apps/chats-modal';
import MobileNav from '@grc/components/apps/layout/mobile-nav';
import { usePathname } from 'next/navigation';
import SellItemModal from '@grc/components/apps/sell-item-modal';
import MobileTopBar from '@grc/components/apps/layout/mobile-top-bar';

const { Content } = Layout;

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
    isSellItemModalOpen,
    isChatsModalOpen,
    setIsChatsModalOpen,
  } = useContext(AppContext);
  const [selectedKey, setSelectedKey] = useState('');
  const path = usePathname();

  const handleLayoutBodyClick = () => {
    setSelectedKey('');
    setToggleSider(false);
    setToggleFindVendorDrawer(true);
    setToggleNotificationsDrawer(true);
    setToggleProfileDrawer(true);
  };

  useEffect(() => {
    setIsSellItemModalOpen(false);
  }, [path]);

  const fullRoutes = ['profile', 'sell-item'];

  return (
    <Layout hasSider={true} className="bg-background max-w-[100vw] overflow-x-clip">
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
          // paddingBottom: mobileResponsive ? '0' : '0',
        }}
        onClick={handleLayoutBodyClick}
      >
        <Content className="main-content">
          <div
            className={`dark:text-white ${
              mobileResponsive
                ? 'px-0 !max-w-[100vw] !overflow-x-clip'
                : fullRoutes?.includes(path?.split('/')?.[1] ?? '')
                  ? 'px-[20px]'
                  : 'px-[12%]'
            }`}
            style={{ minHeight: '100vh' }}
          >
            {mobileResponsive && (
              <MobileTopBar setIsCreateStoreModalOpen={setIsCreateStoreModalOpen} />
            )}
            <div className={`${mobileResponsive ? '' : ''}`}>{children}</div>
          </div>
          {/* {!mobileResponsive && (
            <Footer className="shadow-sm border-t border-border/100 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 dark:text-white">
              Footer
            </Footer>
          )} */}
        </Content>
      </Layout>

      <SellItemModal
        isSellItemModalOpen={isSellItemModalOpen}
        setIsSellItemModalOpen={setIsSellItemModalOpen}
        handleTrackStatus={() => {}}
      />

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
