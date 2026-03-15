'use client';
import React from 'react';
import { SiderTheme } from 'antd/es/layout/Sider';
import { NavItem } from '@grc/_shared/helpers';
import { Bookmark, Shop, BagHappy, People, Tag2 } from 'iconsax-react';
import {
  Crown,
  HandCoins,
  ShoppingBag,
  UserRoundSearch,
  Settings,
  ShieldAlert,
  MoreHorizontal,
} from 'lucide-react';

export type Nav = {
  theme: SiderTheme & string;
  appName: string;
  items: NavItem[];
  mobileMenuItems: NavItem[];
  footerMenuItems: NavItem[];
};

// ─── Footer Menu Items (static — My Stores is injected dynamically in SideNav) ─

const footerMenuItems: NavItem[] = [
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
        label: 'Subscription',
        key: 'subscription',
        destination: '/creator-account/subscription',
        icon: <Crown size={18} />,
      },
      {
        label: 'Disputes',
        key: 'disputes',
        destination: '/disputes',
        icon: <ShieldAlert size={18} />,
      },
    ],
  },
];

// ─── Main Menu Items ────────────────────────────────────────────────────────

// {
//   label: 'Market',
//   key: 'market',
//   destination: '/',
//   icon: <ShopRemove variant="Bulk" color="#6366f1" />,
// },
// {
//   label: 'Cart',
//   key: 'cart',
//   destination: '/cart',
//   icon: <Bag variant="Bulk" color="#22c55e" />,
// },
// {
//   label: 'Find Creators',
//   key: 'Creators',
//   destination: '/creators',
//   icon: <HeartSearch variant="Bulk" color="#22c55e" />,
// },
// {
//   label: 'Sell Item',
//   key: 'sell-item',
//   destination: '/sell-item',
//   icon: <MoneyChange variant="Bulk" color="#f97316" />,
// },

const menuItems: NavItem[] = [
  {
    label: 'Market',
    key: 'market',
    destination: '/market',
    icon: <Shop variant="Bulk" color="#6366f1" size={22} />,
  },
  {
    label: 'Cart',
    key: 'cart',
    destination: '/cart',
    icon: <BagHappy variant="Bulk" color="#22c55e" size={22} />,
  },
  {
    label: 'Find Creators',
    key: 'Creators',
    destination: '/creators',
    icon: <People variant="Bulk" color="#0ea5e9" size={22} />,
  },
  {
    label: 'Sell Item',
    key: 'sell-item',
    destination: '/sell-item',
    icon: <Tag2 variant="Bulk" color="#f97316" size={22} />,
  },
];

// ─── Mobile Menu Items ──────────────────────────────────────────────────────

const mobileMenuItems: NavItem[] = [
  {
    label: 'Market',
    key: 'market',
    destination: '/market',
    icon: <ShoppingBag />,
  },
  {
    label: 'Find Creators',
    key: 'creators',
    destination: '/creators',
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
  footerMenuItems,
};

export { appNav };
