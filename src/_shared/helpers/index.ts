import React from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookie from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@grc/_shared/constant';
import { MenuProps } from 'antd';
import * as _ from 'lodash';

export const numberFormat = (value: number | bigint, currency?: string) => {
  const formatter = new Intl.NumberFormat();
  return currency ? currency + formatter.format(value) : formatter.format(value);
};

export const transactionBal = (transBalances: Record<string, any>) => {
  return Object.values(transBalances)?.reduce((acc, curr) => acc + curr?.availableAmount, 0);
};

export const truncate = (text: string, length = 8) => {
  return text.length <= length ? text : text.slice(0, length).concat('...');
};

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
export const isValidPassword = (password: string) => {
  return passwordRegex.test(password);
};

type AuthTokenReturnProps = {
  isLoggedIn: boolean;
  expiresAt: Date | null;
};

/**decode token**/
export const AuthToken = (token: string | undefined): AuthTokenReturnProps => {
  const defaultState = {
    isLoggedIn: false,
    expiresAt: null,
  };
  if (token) {
    try {
      const decoded: any = jwtDecode(token);
      const sessionTimeExp = decoded.exp;
      return {
        isLoggedIn: sessionTimeExp > new Date().getTime() / 1000,
        expiresAt: new Date(sessionTimeExp * 1000),
      };
    } catch (e) {
      return defaultState;
    }
  }
  return defaultState;
};

type AppCookieProp = {
  cookie?: string | null;
  allowDelete?: boolean;
};

/**handle token inside cookie, so it is available for both client and server rendering**/
export const AppCookie = ({ cookie = null, allowDelete = false }: AppCookieProp) => {
  if (cookie && !allowDelete) {
    Cookie.set(AUTH_TOKEN_KEY, cookie);
  } else {
    Cookie.remove(AUTH_TOKEN_KEY);
  }
  return;
};

export type MenuItem = Required<MenuProps>['items'][number];

export type NavItem = {
  label: string;
  key: string;
  destination: string;
  icon: React.ReactNode;
  items?: NavItem[];
};

export const getItem = (menuItem: NavItem): MenuItem => {
  return {
    key: menuItem.key,
    icon: menuItem.icon,
    items: menuItem.items,
    label: menuItem.label,
  } as MenuItem;
};

export const formatNumber = (num: number, precision: number = 2): string | number => {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'K', threshold: 1e3 },
    { suffix: '', threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);

  if (found) {
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  }

  return num;
};
export const calculateTotal = (data: any) => {
  return data.reduce((total: number, value: number) => total + value, 0);
};

export const getStatusColor = (status: string) => {
  console.log('I called:::', status);
  switch (status.toLowerCase()) {
    case 'successful':
      return 'green-500';
    case 'pending':
      return 'yellow-500';
    case 'processing':
      return 'blue';
    case 'total':
      return 'slate-900';
    case 'failed':
      return 'red-500';
    default:
      return 'slate-900';
  }
};
export enum GET_COLOR {
  successful = 'green-500',
  pending = 'yellow-500',
  processing = 'blue',
  total = 'slate-900',
  failed = 'red-500',
}

export const getRandomColorByString = (name: string) => {
  name = name?.toUpperCase();
  return _.get(COLOR_LIST_ALPHA, getFirstCharacter(name) ?? 'A') ?? '#7B68ED';
};
export const getFirstCharacter = (name: string) => {
  return _.capitalize(name?.charAt(0));
};

export enum COLOR_LIST_ALPHA {
  A = '#3E82FF',
  B = '#C1EAFD',
  C = '#F56A00',
  D = '#7265E6',
  E = '#FFBF00',
  F = '#00A2AE',
  G = '#9C9C9D',
  H = '#F3D19B',
  I = '#CA99BC',
  J = '#BAB8F5',
  K = '#7B68ED',
  L = '#3E83FF',
  M = '#F3D29B',
  N = '#7266E6',
  O = '#CA98BC',
  P = '#F56A01',
  Q = '#CA96BC',
  R = '#F3D28B',
  S = '#F3D27B',
  T = '#9C9C8D',
  U = '#FFBF10',
  V = '#F3D18B',
  W = '#7264E6',
  X = '#01A2AE',
  Y = '#CA97BC',
  Z = '#C2EAFD',
}
