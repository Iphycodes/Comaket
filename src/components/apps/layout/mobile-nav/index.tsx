'use client';

import React, { useContext } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Store, Tag, User, ShoppingCart, Users } from 'lucide-react';
import { AppContext } from '@grc/app-context';

interface MobileNavProps {
  appNav?: any;
  setSelectedKey?: (key: string) => void;
  setIsCreateStoreModalOpen?: (open: boolean) => void;
  setIsSellItemModalOpen?: (open: boolean) => void;
  setIsChatsModalOpen?: (open: boolean) => void;
}

const MobileNav: React.FC<MobileNavProps> = ({ setSelectedKey }) => {
  const pathname = usePathname();
  const path = pathname?.split('/')[1] || '';
  const { push } = useRouter();
  const { cartItems, setIsSellItemModalOpen } = useContext(AppContext);

  const cartCount = cartItems?.length ?? 0;

  const tabs = [
    { key: 'vendors', label: 'Vendors', href: '/vendors', icon: Users },
    { key: 'sell', label: 'Sell', href: '/sell-item', icon: Tag },
    { key: 'market', label: 'Market', href: '/', icon: Store, isCenter: true },
    { key: 'cart', label: 'Cart', href: '/cart', icon: ShoppingCart, badge: cartCount },
    { key: 'profile', label: 'profile', href: '/profile', icon: User },
  ];

  const isActive = (key: string, href: string) => {
    if (key === 'market') return path === '' || path === 'market';
    return path === key || pathname === href;
  };

  const handleTap = (tab: (typeof tabs)[0]) => {
    setIsSellItemModalOpen(false);
    if (tab.href) push(tab.href);
    setSelectedKey?.(tab.key);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden">
      {/* Frosted glass background */}
      <div className="absolute inset-0 bg-white/90 dark:bg-gray-950/90 backdrop-blur-2xl border-t border-gray-100 dark:border-zinc-800/80" />

      <div className="relative flex items-end justify-around px-2 h-[68px] pb-[env(safe-area-inset-bottom)]">
        {tabs.map((tab) => {
          const active = isActive(tab.key, tab.href);
          const Icon = tab.icon;

          /* ─── Center CTA: Market ─── */
          if (tab.isCenter) {
            return (
              <div
                key={tab.key}
                className="relative flex flex-col items-center justify-center flex-1"
              >
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleTap(tab)}
                  className="relative -mt-7 group"
                  aria-label={tab.label}
                >
                  {/* Pulse ring on active */}
                  {active && (
                    <motion.div
                      className="absolute inset-0 rounded-full bg-blue/20 dark:bg-blue/15"
                      initial={{ scale: 1, opacity: 0.6 }}
                      animate={{ scale: 1.5, opacity: 0 }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: 'easeOut',
                      }}
                    />
                  )}

                  {/* Outer glow */}
                  <div className="absolute inset-0 rounded-full bg-gradient-to-br from-blue/25 to-indigo-500/25 blur-xl scale-125 opacity-80" />

                  {/* Button circle */}
                  <div
                    className={`relative w-[56px] h-[56px] rounded-full flex items-center justify-center ring-[3px] ring-white dark:ring-gray-950 shadow-xl transition-all duration-300 ${
                      active
                        ? 'bg-gradient-to-br from-blue via-blue to-indigo-600 shadow-blue/40 dark:shadow-blue/30'
                        : 'bg-gradient-to-br from-blue to-indigo-600 shadow-blue/25 dark:shadow-blue/15'
                    }`}
                  >
                    <Icon className="w-6 h-6 text-white" strokeWidth={2} />
                  </div>
                </motion.button>

                <span
                  className={`text-[10px] mt-1.5 font-semibold transition-colors ${
                    active ? 'text-blue' : 'text-blue/70 dark:text-blue/60'
                  }`}
                >
                  {tab.label}
                </span>
              </div>
            );
          }

          /* ─── Regular nav items ─── */
          return (
            <button
              key={tab.key}
              onClick={() => handleTap(tab)}
              className="relative flex flex-col items-center justify-center flex-1 py-2 group"
              aria-label={tab.label}
            >
              {/* Active indicator bar */}
              <AnimatePresence>
                {active && (
                  <motion.div
                    layoutId="mobile-nav-indicator"
                    initial={{ scaleX: 0, opacity: 0 }}
                    animate={{ scaleX: 1, opacity: 1 }}
                    exit={{ scaleX: 0, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                    className="absolute -top-[1px] w-8 h-[2.5px] rounded-full bg-gradient-to-r from-blue to-indigo-500"
                  />
                )}
              </AnimatePresence>

              {/* Icon with badge */}
              <motion.div whileTap={{ scale: 0.8 }} className="relative">
                <Icon
                  className={`w-[22px] h-[22px] transition-colors duration-200 ${
                    active
                      ? 'text-blue dark:text-blue'
                      : 'text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
                  }`}
                  strokeWidth={active ? 2.2 : 1.8}
                />

                {/* Badge */}
                {tab.badge !== undefined && tab.badge > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2.5 min-w-[16px] h-[16px] px-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[9px] font-bold flex items-center justify-center shadow-sm shadow-rose-500/30"
                  >
                    {tab.badge > 99 ? '99+' : tab.badge}
                  </motion.span>
                )}
              </motion.div>

              {/* Label */}
              <span
                className={`text-[10px] mt-1 transition-all duration-200 ${
                  active
                    ? 'font-semibold text-blue dark:text-blue'
                    : 'font-medium text-gray-400 dark:text-gray-500 group-hover:text-gray-600 dark:group-hover:text-gray-300'
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
