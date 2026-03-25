'use client';

import React, { Dispatch, SetStateAction, useContext } from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  Store,
  ChevronDown,
  Crown,
  Settings,
  ShieldAlert,
  Plus,
  LogOut,
  LogIn,
  Sun,
  Moon,
  User,
  Bell,
} from 'lucide-react';
import { AppContext } from '@grc/app-context';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { useTheme } from 'next-themes';
import { useGetUnreadAlertCountQuery } from '@grc/services/alerts';

interface MobileTopBarProps {
  setIsCreateStoreModalOpen: Dispatch<SetStateAction<boolean>>;
  userProfile?: any;
  onLogout?: () => void;
  stores?: Record<string, any>[];
  isCreatorAccount?: boolean;
}

const MobileTopBar: React.FC<MobileTopBarProps> = ({
  setIsCreateStoreModalOpen,
  userProfile,
  onLogout,
  stores = [],
  isCreatorAccount = false,
}) => {
  const router = useRouter();
  const { setIsAuthModalOpen } = useContext(AppContext);
  const { theme, setTheme } = useTheme();
  const { data: unreadData } = useGetUnreadAlertCountQuery(undefined, {
    skip: !userProfile,
    pollingInterval: 30000,
  });
  const unreadCount = unreadData?.data?.count || 0;

  const firstName = userProfile?.firstName || '';
  const avatarUrl = userProfile?.avatarUrl;
  const email = userProfile?.email || '';
  const fullName = `${userProfile?.firstName || ''} ${userProfile?.lastName || ''}`.trim();

  // Only show stores section if user is a creator with at least one store
  const hasStores = isCreatorAccount && stores.length > 0;

  // ── My Stores dropdown items ────────────────────────────────────────

  const storeMenuItems: MenuProps['items'] = [
    ...stores.map((store: any) => ({
      key: `my-store-${store.id}`,
      label: <span className="text-sm text-neutral-700 dark:text-neutral-200">{store.name}</span>,
      onClick: () => router.push(`/my-store/${store.id}`),
    })),
    { type: 'divider' as const },
    {
      key: 'create-store',
      label: (
        <span className="flex items-center gap-2 text-sm font-semibold text-blue">
          <Plus size={14} />
          Create New Store
        </span>
      ),
      onClick: () => setIsCreateStoreModalOpen(true),
    },
  ];

  // ── User/More dropdown items ────────────────────────────────────────

  const userMenuItems: MenuProps['items'] = [
    ...(userProfile
      ? [
          {
            key: 'user-info',
            label: (
              <div className="flex items-center gap-3 py-1">
                <div className="relative flex-shrink-0">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={fullName}
                      className="w-9 h-9 rounded-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold"
                      style={{ backgroundColor: getRandomColorByString(firstName || 'U') }}
                    >
                      {getFirstCharacter(firstName || 'U')}
                    </div>
                  )}
                  <div className="absolute -bottom-px -right-px w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-neutral-800" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                    {fullName}
                  </p>
                  <p className="text-[11px] text-neutral-500 truncate">{email}</p>
                </div>
              </div>
            ),
            onClick: () => router.push('/profile'),
          },
          { type: 'divider' as const },
        ]
      : []),
    {
      key: 'settings',
      label: <span className="text-sm">Settings</span>,
      icon: <Settings size={16} className="text-neutral-500" />,
      onClick: () => router.push('/settings'),
    },
    ...(isCreatorAccount
      ? [
          {
            key: 'subscription',
            label: <span className="text-sm">Subscription</span>,
            icon: <Crown size={16} className="text-neutral-500" />,
            onClick: () => router.push('/creator-account/subscription'),
          },
        ]
      : []),
    {
      key: 'disputes',
      label: <span className="text-sm">Disputes</span>,
      icon: <ShieldAlert size={16} className="text-neutral-500" />,
      onClick: () => router.push('/disputes'),
    },
    { type: 'divider' as const },
    userProfile
      ? {
          key: 'logout',
          label: (
            <span className="flex items-center gap-2 text-sm font-medium text-red-500">
              <LogOut size={15} />
              Sign out
            </span>
          ),
          onClick: () => onLogout?.(),
        }
      : {
          key: 'signin',
          label: (
            <span className="flex items-center justify-center gap-2 text-sm font-semibold text-white bg-blue rounded-md px-3 py-1.5 -mx-1">
              <LogIn size={15} />
              Sign in
            </span>
          ),
          onClick: () => setIsAuthModalOpen(true),
        },
  ];

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="fixed top-0 left-0 right-0 z-[1000] bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700/60">
      <div className="flex items-center justify-between gap-1 px-3 h-10">
        {/* Left: Logo */}
        <span
          className="cursor-pointer flex-shrink-0"
          onClick={() => router.push(userProfile ? '/market' : '/')}
        >
          <Image
            priority
            src={
              theme === 'dark'
                ? '/assets/imgs/logos/kraft-logo-splash.png'
                : '/assets/imgs/logos/kraft-logo-splash.png'
            }
            alt="Kraft logo"
            width={60}
            height={36}
            style={{ width: '60px', height: 'auto' }}
          />
        </span>

        <div className="flex items-center gap-2">
          {/* My Stores dropdown — only if user is a creator WITH stores */}
          {hasStores && (
            <Dropdown menu={{ items: storeMenuItems }} trigger={['click']} placement="bottomLeft">
              <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-neutral-800 dark:text-neutral-100 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors">
                <Store size={16} className="text-purple-500" />
                <span>My Stores</span>
                <ChevronDown size={14} className="text-neutral-400" />
              </button>
            </Dropdown>
          )}

          {/* Theme toggle */}
          <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-neutral-500" />
            )}
          </button>

          {/* Bell icon — alerts */}
          {userProfile && (
            <button
              onClick={() => router.push('/alerts')}
              className="relative w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              aria-label="Notifications"
            >
              <Bell size={16} className="text-neutral-600 dark:text-neutral-400" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[16px] h-4 flex items-center justify-center rounded-full bg-red-500 text-white text-[9px] font-bold px-1">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </button>
          )}

          {/* Right: User avatar / emoji dropdown */}
          <Dropdown menu={{ items: userMenuItems }} trigger={['click']} placement="bottomRight">
            <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors overflow-hidden">
              {userProfile ? (
                avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-7 h-7 rounded-full object-cover ring-1 ring-neutral-200 dark:ring-neutral-700"
                  />
                ) : (
                  <div
                    className="w-7 h-7 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                    style={{ backgroundColor: getRandomColorByString(firstName || 'U') }}
                  >
                    {getFirstCharacter(firstName || 'U')}
                  </div>
                )
              ) : (
                <User size={18} className="text-neutral-500 dark:text-neutral-400" />
              )}
            </button>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};

export default MobileTopBar;
