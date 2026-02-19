'use client';
import React from 'react';
import { SiderTheme } from 'antd/es/layout/Sider';
import { NavItem, getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { isEmpty } from 'lodash';
import { Avatar } from 'antd';
import { Bookmark, HeartSearch, MoneyChange, ShopRemove, Bag } from 'iconsax-react';
import {
  HandCoins,
  ShoppingBag,
  UserRoundSearch,
  Settings,
  ShieldAlert,
  MoreHorizontal,
  Store,
} from 'lucide-react';
import SideNavAuthButton from '@grc/components/apps/layout/side-nav/lib/side-nav-auth-button';

export type Nav = {
  theme: SiderTheme & string;
  appName: string;
  items: NavItem[];
  mobileMenuItems: NavItem[];
  footerMenuItems: NavItem[];
};

// ─── Mock Vendor Stores tied to the user's account ──────────────────────────

export interface UserVendorStore {
  id: string;
  name: string;
  avatar?: string;
}

export const mockUserVendorStores: UserVendorStore[] = [
  { id: 'vs-001', name: 'EmTech Store' },
  { id: 'vs-002', name: 'Gadget Hub NG' },
  { id: 'vs-003', name: 'PhoneDeals Kaduna' },
];

// ─── Footer Menu Items ──────────────────────────────────────────────────────

const footerMenuItems: NavItem[] = [
  {
    label: 'Profile',
    key: 'profile',
    destination: '/profile',
    icon: (
      <Avatar
        style={{
          backgroundColor: getRandomColorByString('Ifeanyi'),
          verticalAlign: 'middle',
          height: '24px',
          width: '24px',
        }}
      >
        <span className="text-white">{isEmpty('') && getFirstCharacter('Ifeanyi')}</span>
      </Avatar>
    ),
  },
  {
    label: 'My Stores',
    key: 'my-store',
    destination: '/my-store',
    icon: <Store />,
    children: [
      ...mockUserVendorStores.map((store) => ({
        label: <span className="!text-sm">{store.name}</span>,
        key: `my-store-${store.id}`,
        destination: `/my-store/${store.id}`,
      })),
    ],
  },
  {
    label: 'More',
    key: 'more',
    destination: '',
    icon: <MoreHorizontal size={22} color="#64748b" />,
    children: [
      {
        label: 'Settings',
        key: 'settings',
        destination: '/settings',
        icon: <Settings size={18} />,
      },
      {
        label: 'Disputes',
        key: 'disputes',
        destination: '/disputes',
        icon: <ShieldAlert size={18} />,
      },
      {
        label: <SideNavAuthButton />,
        key: 'auth',
        destination: '',
        icon: <></>,
      },
    ],
  },
];

// ─── Main Menu Items ────────────────────────────────────────────────────────

const menuItems: NavItem[] = [
  {
    label: 'Market',
    key: 'market',
    destination: '/',
    icon: <ShopRemove variant="Bulk" color="#6366f1" />,
  },
  {
    label: 'Cart',
    key: 'cart',
    destination: '/cart',
    icon: <Bag variant="Bulk" color="#22c55e" />,
  },
  {
    label: 'Vendors',
    key: 'vendors',
    destination: '/vendors',
    icon: <HeartSearch variant="Bulk" color="#22c55e" />,
  },
  // {
  //   label: 'Notifications',
  //   key: 'notifications',
  //   destination: '',
  //   icon: <Notification variant="Bulk" color="#1e88e5" />,
  // },
  // {
  //   label: 'Saved',
  //   key: 'saved',
  //   destination: '/saved',
  //   icon: <Bookmark variant="Bulk" color="#ec4899" />,
  // },
  {
    label: 'Sell Item',
    key: 'sell-item',
    destination: '/sell-item', // Mobile routes here; desktop opens modal (handled in SideNav)
    icon: <MoneyChange variant="Bulk" color="#f97316" />,
  },
];

// ─── Mobile Menu Items ──────────────────────────────────────────────────────

const mobileMenuItems: NavItem[] = [
  {
    label: 'Market',
    key: 'market',
    destination: '/',
    icon: <ShoppingBag />,
  },
  {
    label: 'Vendors',
    key: 'vendors',
    destination: '/vendors',
    icon: <UserRoundSearch />,
  },
  {
    label: 'Saved',
    key: 'saved',
    destination: '/saved',
    icon: <Bookmark />,
  },
  {
    label: 'Sell Item',
    key: 'sell-item',
    destination: '/sell-item',
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
