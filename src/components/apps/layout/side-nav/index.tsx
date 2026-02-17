import React, { Dispatch, SetStateAction, useContext } from 'react';
import { Layout, Menu } from 'antd';
import { SideNavHeader } from './lib';
import { usePathname, useRouter } from 'next/navigation';
import { Nav } from '@grc/app/nav';
import { AppContext } from '@grc/app-context';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

const { Sider } = Layout;

interface SideNavProps {
  toggleSider: boolean;
  appNav: Nav;
  selectedKey: string;
  setSelectedKey: Dispatch<SetStateAction<string>>;
  setToggleSider: Dispatch<SetStateAction<boolean>>;
  setIsCreateStoreModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsSellItemModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsChatsModalOpen: Dispatch<SetStateAction<boolean>>;
}

const SideNav: React.FC<SideNavProps> = (props) => {
  const {
    selectedKey,
    toggleSider,
    appNav,
    setSelectedKey,
    setToggleSider,
    setIsCreateStoreModalOpen,
    setIsSellItemModalOpen,
    setIsChatsModalOpen,
  } = props;

  const pathname = usePathname();
  const urlPath = pathname?.split('/');
  const { push } = useRouter();
  const { setToggleFindVendorDrawer, setToggleNotificationsDrawer } = useContext(AppContext);
  const isMobile = useMediaQuery(mediaSize.mobile);

  // ── Build a flat lookup of ALL nav items (including children) → destination ──
  const getDestinationForKey = (key: string): string => {
    // Check top-level items
    for (const item of appNav?.items || []) {
      if (item.key === key && item.destination) return item.destination;
      // Check children
      if (item?.children) {
        for (const child of item.children) {
          if (child.key === key && child.destination) return child.destination;
        }
      }
    }
    // Check footer items
    for (const item of appNav?.footerMenuItems || []) {
      if (item.key === key && item.destination) return item.destination;
    }
    return '';
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setToggleSider(false);
    setToggleFindVendorDrawer(true);
    setToggleNotificationsDrawer(true);
    setIsSellItemModalOpen(false);

    // ── Special intercepts ────────────────────────────────────────────

    // Sell Item: desktop → open modal, mobile → route to /sell-item
    if (key === 'sell-item') {
      // if (isMobile) {
      //   push('/sell-item');
      // } else {
      //   setIsSellItemModalOpen(true);
      // }
      setIsSellItemModalOpen(true);
      setSelectedKey(key);
      return;
    }

    // Notifications: open drawer
    if (key === 'notifications') {
      setToggleNotificationsDrawer(false);
      setToggleSider(true);
      setSelectedKey(key);
      return;
    }

    // Create store modal
    if (key === 'create-store') {
      setIsCreateStoreModalOpen(true);
      setSelectedKey(key);
      return;
    }

    // Chats modal
    if (key === 'chats') {
      setIsChatsModalOpen(true);
      setSelectedKey(key);
      return;
    }

    // ── Default: route to destination ─────────────────────────────────
    const destination = getDestinationForKey(key);
    if (destination) {
      push(destination);
    }

    setSelectedKey(key);
  };

  return (
    <Sider
      collapsed={toggleSider}
      collapsedWidth={isMobile ? 0 : 80}
      className="dash-sider border-r p-0 text-lg shadow-sm border-border/100"
      width={300}
      style={{
        overflow: 'auto',
        position: 'fixed',
        height: '100vh',
        scrollbarWidth: 'none',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <SideNavHeader toggleSider={toggleSider} />

      <Menu
        className="sider-menu mt-10 mb-48 text-card-foreground text-[16px]"
        mode="inline"
        items={appNav?.items}
        defaultSelectedKeys={[]}
        selectedKeys={
          urlPath?.[1] === '' && selectedKey === ''
            ? ['market']
            : selectedKey !== ''
              ? [selectedKey]
              : [urlPath?.[1] ?? '']
        }
        onClick={handleMenuClick}
      />

      <Menu
        className="bottom-5 text-card-foreground text-[16px]"
        mode="inline"
        items={appNav?.footerMenuItems}
        defaultSelectedKeys={[]}
        selectedKeys={
          urlPath?.[1] === '' && selectedKey === ''
            ? []
            : selectedKey !== ''
              ? [selectedKey]
              : [urlPath?.[1] ?? '']
        }
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default SideNav;
