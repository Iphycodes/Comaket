import React, { Dispatch, SetStateAction, useContext } from 'react';
import { Layout, Menu } from 'antd';
import { SideNavHeader } from './lib';
import { usePathname, useRouter } from 'next/navigation';
import { Nav } from '@grc/app/nav';
import { AppContext } from '@grc/app-context';

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
  const { setToggleFindVendorDrawer, setToggleNotificationsDrawer, setToggleProfileDrawer } =
    useContext(AppContext);

  const handleMenuClick = ({ key }: { key: string }) => {
    setToggleSider(false);
    setToggleFindVendorDrawer(true);
    setToggleNotificationsDrawer(true);
    setToggleProfileDrawer(true);
    appNav?.items.map((item) => {
      if (item.key === key) {
        if (item.destination !== '') {
          push(item?.destination);
        }
      }
    });
    appNav?.footerMenuItems.map((item) => {
      if (item.key === key) {
        if (item.destination !== '') {
          push(item?.destination);
        }
      }
    });
    if (key === 'find-vendor') {
      setToggleFindVendorDrawer(false);
      setToggleSider(true);
    }
    if (key === 'notifications') {
      setToggleNotificationsDrawer(false);
      setToggleSider(true);
    }
    if (key === 'create-store') {
      setIsCreateStoreModalOpen(true);
    }
    if (key === 'sell') {
      setIsSellItemModalOpen(true);
    }
    if (key === 'chats') {
      setIsChatsModalOpen(true);
    }
    if (key === 'profile') {
      setToggleProfileDrawer(false);
      setToggleSider(true);
    }
    setSelectedKey(key);
  };

  return (
    <Sider
      collapsed={toggleSider}
      collapsedWidth={80}
      className="dash-sider border-r p-0 text-lg shadow-sm border-border/100"
      width={300}
      style={{
        overflow: 'auto',
        position: 'fixed',
        height: '100vh',
        scrollbarWidth: 'none',
        scrollbarColor: 'red',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
      }}
    >
      <SideNavHeader toggleSider={toggleSider} />{' '}
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
      ></Menu>
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
