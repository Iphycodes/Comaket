'use client';
import React from 'react';
import { SiderTheme } from 'antd/es/layout/Sider';
import { NavItem, getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { isEmpty } from 'lodash';
import { Avatar } from 'antd';

export type Nav = {
  theme: SiderTheme & string;
  appName: string;
  items: NavItem[];
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
    icon: <i className="ri-store-2-line" style={{ fontSize: '22px' }}></i>,
  },
  // {
  //   label: 'Explore',
  //   key: 'explore',
  //   destination: '/explore',
  //   icon: <i className="ri-search-line" style={{ fontSize: '22px' }}></i>,
  // },
  {
    label: 'Find Vendor',
    key: 'find-vendor',
    destination: '',
    icon: <i className="ri-user-location-line" style={{ fontSize: '22px' }}></i>,
  },
  {
    label: 'Chats',
    key: 'chats',
    destination: '',
    icon: <i className="ri-question-answer-line" style={{ fontSize: '22px' }}></i>,
  },
  {
    label: 'Notifications',
    key: 'notifications',
    destination: '',
    icon: <i className="ri-notification-line" style={{ fontSize: '22px' }}></i>,
  },
  {
    label: 'Saved',
    key: 'saved',
    destination: '/saved',
    icon: <i className="ri-pushpin-line" style={{ fontSize: '22px' }}></i>,
  },
  {
    label: 'Sell An Item',
    key: 'sell',
    destination: '',
    icon: <i className="ri-arrow-left-right-line" style={{ fontSize: '22px' }}></i>,
  },
];

const appNav: Nav = {
  appName: 'Comaket',
  theme: 'light',
  items: menuItems,
  footerMenuItems: footerMenuItems,
};

export { appNav };
