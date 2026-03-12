'use client';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import { appNav } from '@grc/app/nav';
import SideNav from '@grc/components/apps/layout/side-nav';
import { Layout, Modal } from 'antd';
import React, { ReactElement, useCallback, useContext, useEffect, useState } from 'react';
import NotificationsDrawer from '@grc/components/apps/notification-drawer';
import CreateStoreModal from '@grc/components/apps/create-store-modal';
import ChatsModal from '@grc/components/apps/chats-modal';
import MobileNav from '@grc/components/apps/layout/mobile-nav';
import { usePathname } from 'next/navigation';
import SellItemModal from '@grc/components/apps/sell-item-modal';
import MobileTopBar from '@grc/components/apps/layout/mobile-top-bar';
import AuthModal from '@grc/components/apps/auth-modal';
import { useAuth } from '@grc/hooks/useAuth';
import { useUsers } from '@grc/hooks/useUser';
import { useStores } from '@grc/hooks/useStores';
import { LogOut } from 'lucide-react';

const { Content } = Layout;

interface AppBaseLayoutProps {
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
    // Auth modal (UI state only)
    isAuthModalOpen,
    setIsAuthModalOpen,
  } = useContext(AppContext);

  useEffect(() => {
    if (mobileResponsive) {
      setToggleSider(true);
    } else {
      setToggleSider(false);
    }
  }, [mobileResponsive]);

  // ── Auth hook (only needed for logout now) ──────────────────────────
  const { logout, isAuthenticated } = useAuth();

  // ── Users hook ──────────────────────────────────────────────────────
  const { userProfile, isLoadingProfile } = useUsers({
    fetchProfile: isAuthenticated ?? false,
  });

  const isCreatorAccount = userProfile?.role === 'creator';

  // ── Stores hook — only fetch if creator ─────────────────────────────
  const { myStores } = useStores({
    fetchMyStores: isCreatorAccount,
  });

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

  // ── Auth success: refetch profile ───────────────────────────────────
  // const handleAuthSuccess = useCallback(() => {
  //   refetchProfile();
  // }, [refetchProfile]);

  // ── Logout ──────────────────────────────────────────────────────────
  const handleLogout = useCallback(() => {
    Modal.confirm({
      title: null,
      icon: null,
      centered: true,
      width: 380,
      className:
        '[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-6 [&_.ant-modal-confirm-btns]:!flex [&_.ant-modal-confirm-btns]:!justify-center [&_.ant-modal-confirm-btns]:!mt-4',
      content: (
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <LogOut size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white">Sign out?</h3>
          <p className="text-sm text-neutral-500 mt-1.5">
            You&apos;ll need to sign in again to access your account.
          </p>
        </div>
      ),
      okText: 'Sign out',
      cancelText: 'Cancel',
      okButtonProps: {
        danger: true,
        className: '!rounded-xl !h-10 !font-semibold !text-sm',
      },
      cancelButtonProps: {
        className: '!rounded-xl !h-10 !font-semibold !text-sm',
      },
      async onOk() {
        await logout();
      },
    });
  }, [logout]);

  const fullRoutes = ['profile', 'sell-item', 'vendors', 'creators', 'stores'];

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
          userProfile={userProfile}
          isLoadingProfile={isLoadingProfile}
          onLogout={handleLogout}
          stores={isCreatorAccount ? myStores : []}
          isCreatorAccount={isCreatorAccount}
        />
      )}
      <NotificationsDrawer />
      <CreateStoreModal
        setSelectedKey={setSelectedKey}
        isCreateStoreModalOpen={isCreateStoreModalOpen}
        setIsCreateStoreModalOpen={setIsCreateStoreModalOpen}
      />
      <ChatsModal
        setSelectedKey={setSelectedKey}
        isChatsModalOpen={isChatsModalOpen}
        setIsChatsModalOpen={setIsChatsModalOpen}
      />

      {/* Auth Modal — handles all auth flows internally */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        // onAuthSuccess={handleAuthSuccess}
      />

      <Layout
        className="body-layout relative z-0 bg-background"
        style={{
          marginLeft: `${mobileResponsive ? 0 : tabletResponsive ? 0 : '300px'}`,
          transition: 'margin-left 0.3s ease',
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
              <MobileTopBar
                setIsCreateStoreModalOpen={setIsCreateStoreModalOpen}
                userProfile={userProfile}
                onLogout={handleLogout}
              />
            )}
            <div>{children}</div>
          </div>
        </Content>
      </Layout>

      <SellItemModal
        isSellItemModalOpen={isSellItemModalOpen}
        setIsSellItemModalOpen={setIsSellItemModalOpen}
        handleTrackStatus={() => {}}
        storeId=""
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
