'use client';
import React from 'react';
import { SiderTheme } from 'antd/es/layout/Sider';
import { NavItem, getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { isEmpty } from 'lodash';
import { Avatar } from 'antd';
import {
  Bookmark,
  HeartSearch,
  MessageNotif,
  MoneyChange,
  Notification,
  ShopRemove,
} from 'iconsax-react';
import { HandCoins, MessageCircleMore, ShoppingBag, UserRoundSearch } from 'lucide-react';

export type Nav = {
  theme: SiderTheme & string;
  appName: string;
  items: NavItem[];
  mobileMenuItems: NavItem[];
  footerMenuItems: NavItem[];
};

const footerMenuItems: NavItem[] = [
  {
    label: 'Create Store',
    key: 'create-store',
    destination: '',
    icon: <i className="ri-store-line" style={{ fontSize: '22px' }}></i>,
  },
  {
    label: 'Profile',
    key: 'profile',
    destination: '',
    icon: (
      <Avatar
        style={{
          backgroundColor: getRandomColorByString('Ifeanyi'),
          verticalAlign: 'middle',
          height: '22px',
          width: '22px',
        }}
      >
        {isEmpty('') && getFirstCharacter('Ifeanyi')}
      </Avatar>
    ),
  },
];

const menuItems: NavItem[] = [
  {
    label: 'Market',
    key: 'market',
    destination: '/',
    // icon: <i className="ri-store-2-line" style={{ fontSize: '22px' }}></i>,
    icon: <ShopRemove variant="Bulk" color="#6366f1" />,
  },
  {
    label: 'Find Vendor',
    key: 'vendors',
    destination: '/vendors',
    // icon: <i className="ri-user-location-line" style={{ fontSize: '22px' }}></i>,
    icon: <HeartSearch variant="Bulk" color="#22c55e" />,
  },
  {
    label: 'Chats',
    key: 'chats',
    destination: '',
    // icon: <i className="ri-question-answer-line" style={{ fontSize: '22px' }}></i>,
    icon: <MessageNotif variant="Bulk" color="#ef4444" />,
  },
  {
    label: 'Notifications',
    key: 'notifications',
    destination: '',
    // icon: <i className="ri-notification-line" style={{ fontSize: '22px' }}></i>,
    icon: <Notification variant="Bulk" color="#1e88e5" />,
  },
  {
    label: 'Saved',
    key: 'saved',
    destination: '/saved',
    // icon: <i className="ri-pushpin-line" style={{ fontSize: '22px' }}></i>,
    icon: <Bookmark variant="Bulk" color="#ec4899" />,
  },
  {
    label: 'Sell Item',
    key: 'sell-item',
    destination: '/sell-item',
    // icon: <i className="ri-arrow-left-right-line" style={{ fontSize: '22px' }}></i>,
    icon: <MoneyChange variant="Bulk" color="#f97316" />,
  },
];

const mobileMenuItems: NavItem[] = [
  {
    label: 'Market',
    key: 'market',
    destination: '/',
    // icon: <i className="ri-store-2-line" style={{ fontSize: '22px' }}></i>,
    // icon: <ShopRemove variant="Bulk" color="#6366f1" />,
    icon: <ShoppingBag />,
  },
  {
    label: 'Find Vendor',
    key: 'vendors',
    destination: '/vendors',
    // icon: <i className="ri-user-location-line" style={{ fontSize: '22px' }}></i>,
    // icon: <HeartSearch variant="Bulk" color="#22c55e" />,
    icon: <UserRoundSearch />,
  },
  {
    label: 'Chats',
    key: 'chats',
    destination: '',
    // icon: <i className="ri-question-answer-line" style={{ fontSize: '22px' }}></i>,
    // icon: <MessageNotif variant="Bulk" color="#ef4444" />,
    icon: <MessageCircleMore />,
  },
  {
    label: 'Saved',
    key: 'saved',
    destination: '/saved',
    // icon: <i className="ri-bookmark-line" style={{ fontSize: '22px' }}></i>,
    // icon: <Bookmark variant="Bulk" color="#ec4899" />,
    icon: <Bookmark />,
  },
  {
    label: 'Sell Item',
    key: 'sell-item',
    destination: '/sell-item',
    // icon: <i className="ri-arrow-left-right-line" style={{ fontSize: '22px' }}></i>,
    // icon: <MoneyChange variant="Bulk" color="#f97316" />,
    icon: <HandCoins />,
  },
];

const appNav: Nav = {
  appName: 'Comaket',
  theme: 'light',
  items: menuItems,
  mobileMenuItems,
  footerMenuItems: footerMenuItems,
};

export { appNav };
