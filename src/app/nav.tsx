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
} from '@grc/_shared/assets/svgs';

type Nav = {
  theme: SiderTheme & string;
  appName: string;
  items: NavItem[];
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
    destination: 'logout',
    icon: <LogoutIcon />,
  },
];

const appNav: Nav = {
  appName: 'Giro',
  theme: 'light',
  items: menuItems,
};

export { appNav };
