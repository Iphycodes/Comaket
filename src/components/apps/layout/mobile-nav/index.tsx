'use client';

import React, { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Tag, User, ShoppingCart, Users, MessageCircle } from 'lucide-react';
import { Shop } from 'iconsax-react';
import { AppContext } from '@grc/app-context';
import { useSocket } from '@grc/providers/socket-provider';
import { useSelector } from 'react-redux';

interface MobileNavProps {
  appNav?: any;
  setSelectedKey?: (key: string) => void;
  setIsCreateStoreModalOpen?: (open: boolean) => void;
  setIsSellItemModalOpen?: (open: boolean) => void;
  setIsChatsModalOpen?: (open: boolean) => void;
  isCreatorAccount?: boolean;
}

const MobileNav: React.FC<MobileNavProps> = ({ setSelectedKey, isCreatorAccount = false }) => {
  const pathname = usePathname();
  const path = pathname?.split('/')[1] || '';
  const { push } = useRouter();
  const { cartCount, setIsSellItemModalOpen } = useContext(AppContext);
  const { totalUnread } = useSocket();

  const allTabs = [
    { key: 'market', label: 'Market', href: '/market', icon: null as any },
    {
      key: 'chats',
      label: 'Chats',
      href: '/chats',
      icon: MessageCircle,
      badge: totalUnread || undefined,
    },
    { key: 'creators', label: 'Creators', href: '/creators', icon: Users },
    { key: 'sell', label: 'Sell', href: '/sell-item', icon: Tag, creatorOnly: true },
    { key: 'cart', label: 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
    { key: 'profile', label: 'Profile', href: '/profile', icon: User },
  ];

  const isAuthenticated = useSelector((state: any) => state.auth?.isAuthenticated);

  // Filter out sell-item if not a creator, and chats if not authenticated
  const tabs = allTabs.filter((tab) => {
    if (tab.creatorOnly && !isCreatorAccount) return false;
    if (tab.key === 'chats' && !isAuthenticated) return false;
    return true;
  });

  const isActive = (key: string, href: string) => {
    if (key === 'market') return path === '' || path === 'market';
    return path === key || pathname === href;
  };

  const handleTap = (tab: (typeof tabs)[0]) => {
    setIsSellItemModalOpen(false);

    if (tab.key === 'sell') {
      setIsSellItemModalOpen(true);
      setSelectedKey?.(tab.key);
      return;
    }

    if (tab.href) push(tab.href);
    setSelectedKey?.(tab.key);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-white/95 dark:bg-neutral-950/95 backdrop-blur-xl border-t border-neutral-200/60 dark:border-zinc-800/60" />

      <div className="relative flex items-center justify-around px-1 h-[48px] pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const active = isActive(tab.key, tab.href);
          const Icon = tab.icon;

          return (
            <button
              key={tab.key}
              onClick={() => handleTap(tab)}
              className="relative flex flex-col items-center justify-center flex-1 py-1 group"
              aria-label={tab.label}
            >
              {/* Icon + Badge */}
              <div className="relative z-10">
                {tab.key === 'market' ? (
                  <Shop
                    size={20}
                    variant={active ? 'Bold' : 'Linear'}
                    className={`transition-colors duration-150 ${
                      active
                        ? 'text-black dark:text-white'
                        : 'text-neutral-400 dark:text-neutral-500 group-active:text-neutral-600'
                    }`}
                  />
                ) : (
                  <Icon
                    className={`w-[20px] h-[20px] transition-colors duration-150 ${
                      active
                        ? 'text-black dark:text-white'
                        : 'text-neutral-400 dark:text-neutral-500 group-active:text-neutral-600'
                    }`}
                    strokeWidth={active ? 2.5 : 1.8}
                    fill={active ? 'currentColor' : 'none'}
                  />
                )}

                {/* Cart badge */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                    className="absolute -top-1.5 -right-2.5 min-w-[14px] h-[14px] px-[3px] rounded-full bg-rose-500 text-white text-[8px] font-bold flex items-center justify-center shadow-sm"
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </motion.span>
                )}
              </div>

              {/* Label */}
              <span
                className={`text-[9px] mt-0.5 relative z-10 transition-colors duration-150 ${
                  active
                    ? 'font-bold text-black dark:text-white'
                    : 'font-medium text-neutral-400 dark:text-neutral-500'
                }`}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default MobileNav;
