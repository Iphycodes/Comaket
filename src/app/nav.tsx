'use client';
import React from 'react';
import { SiderTheme } from 'antd/es/layout/Sider';
import { NavItem } from '@grc/_shared/helpers';
import {
  DashboardIcon,
  DisbursementIcon,
  LogoutIcon,
  SettingsIcon,
  TransactionIcon,
  ProfileIcon,
  PasswordIcon,
  AppIcon,
} from '@grc/_shared/assets/svgs';

type Nav = {
  theme: SiderTheme & string;
  appName: string;
  items: NavItem[];
  settingsMenuItems: NavItem[];
};

const menuItems: NavItem[] = [
  {
    label: 'Dashboard',
    key: 'dashboard',
    destination: 'dashboard',
    icon: <DashboardIcon />,
  },
  {
    label: 'Transactions',
    key: 'transactions',
    destination: 'transactions',
    icon: <TransactionIcon />,
  },
  {
    label: 'Disbursements',
    key: 'disbursements',
    destination: 'disbursements',
    icon: <DisbursementIcon />,
  },
  {
    label: 'Settings',
    key: 'settings',
    destination: '/settings',
    icon: <SettingsIcon />,
  },
  {
    label: 'Logout',
    key: 'logout',
    destination: '/auth/logout',
    icon: <LogoutIcon />,
  },
];

const settingsMenuItems: NavItem[] = [
  {
    label: 'Profile Details',
    key: 'profile-details',
    destination: 'profile-details',
    icon: <ProfileIcon />,
  },
  {
    label: 'Change Password',
    key: 'change-password',
    destination: 'change-password',
    icon: <PasswordIcon />,
  },
  {
    label: 'Apps',
    key: 'apps',
    destination: '/apps',
    icon: <AppIcon />,
  },
];

const appNav: Nav = {
  appName: 'Giro',
  theme: 'light',
  items: menuItems,
  settingsMenuItems,
};

export { appNav };
