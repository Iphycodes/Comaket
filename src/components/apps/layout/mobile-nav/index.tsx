import React from 'react';
import { Tooltip } from 'antd';
import { usePathname, useRouter } from 'next/navigation';
import { Nav } from '@grc/app/nav';

interface MobileNavProps {
  appNav: Nav;
  setSelectedKey: (key: string) => void;
  setIsCreateStoreModalOpen: (open: boolean) => void;
  setIsSellItemModalOpen: (open: boolean) => void;
  setIsChatsModalOpen: (open: boolean) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({
  appNav,
  setSelectedKey,
  setIsCreateStoreModalOpen,
}) => {
  const pathname = usePathname();
  const path = pathname?.split('/')[1];
  const { push } = useRouter();

  const handleMenuClick = ({ key }: { key: string }) => {
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
    // if (key === 'notifications') {
    //   setToggleNotificationsDrawer(false);
    // }
    if (key === 'create-store') {
      setIsCreateStoreModalOpen(true);
    }
    if (key === 'sell') {
      push('/sell-item');
    }
    if (key === 'chats') {
      // setIsChatsModalOpen(true);
      push('/chats');
    }
    if (key === 'profile') {
      push('/profile');
    }
    setSelectedKey(key);
  };

  // const handleNavClick = (item: any) => {
  //   if (item.destination) {
  //     push(item.destination);
  //   }

  //   switch (item.key) {
  //     case 'notifications':
  //       setToggleNotificationsDrawer(false);
  //       break;
  //     case 'create-store':
  //       setIsCreateStoreModalOpen(true);
  //       break;
  //     case 'chats':
  //       setIsChatsModalOpen(true);
  //       break;
  //     case 'profile':
  //       setToggleProfileDrawer(false);
  //       break;
  //   }
  //   setSelectedKey(item.key);
  // };

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border/100 shadow-lg z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {appNav.mobileMenuItems.map((item) => (
          <Tooltip key={item.key} title={item.label} placement="top">
            <span
              onClick={() => handleMenuClick(item)}
              className={`p-2 transition-colors h-10 w-10 cursor-pointer hover:bg-neutral-50 ${
                path === item.key ? 'bg-neutral-200' : ''
              } rounded-[50%] ${
                path === item.key
                  ? 'text-primary bg-primary/10'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/10'
              }`}
            >
              {item.icon}
            </span>
          </Tooltip>
        ))}
      </div>
    </div>
  );
};

export default MobileNav;
