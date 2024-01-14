import React from 'react';
import { jwtDecode } from 'jwt-decode';
import Cookie from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@grc/_shared/constant';
import { MenuProps } from 'antd';

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

export default function formatNumber(num: number, precision: number = 2): string | number {
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
}
