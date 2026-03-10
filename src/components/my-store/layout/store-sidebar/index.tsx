'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Star,
  Settings,
  Eye,
  ChevronDown,
  Plus,
  ArrowLeft,
  Check,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Comaket';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface PortalStore {
  id: string;
  name: string;
  avatar?: string | null;
  status: 'active' | 'pending' | 'suspended' | 'live' | 'offline' | 'paused';
}

export interface NavBadgeCounts {
  orders?: number;
  reviews?: number;
  notifications?: number;
  products?: number;
}

interface StoreSidebarProps {
  stores: PortalStore[];
  currentStore: PortalStore;
  badgeCounts?: NavBadgeCounts;
  onSwitchStore: (storeId: string) => void;
  onCreateStore: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/** Map backend store status to display status */
const normalizeStatus = (status: string): 'live' | 'offline' | 'paused' => {
  if (status === 'active' || status === 'live') return 'live';
  if (status === 'pending' || status === 'paused') return 'paused';
  return 'offline';
};

/** Convert a raw backend store object to PortalStore */
export const toPortalStore = (store: any): PortalStore => ({
  id: store._id || store.id || '',
  name: store.name || 'Store',
  avatar: store.logo || store.avatar || null,
  status: store.status || 'active',
});

// ═══════════════════════════════════════════════════════════════════════════
// NAV ITEMS
// ═══════════════════════════════════════════════════════════════════════════

interface NavItemDef {
  key: string;
  label: string;
  icon: React.ElementType;
  path: string;
  badgeKey?: keyof NavBadgeCounts;
}

const navItems: NavItemDef[] = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, path: '' },
  { key: 'products', label: 'Products', icon: Package, path: '/products', badgeKey: 'products' },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders', badgeKey: 'orders' },
  { key: 'reviews', label: 'Reviews', icon: Star, path: '/reviews', badgeKey: 'reviews' },
  // {
  //   key: 'notifications',
  //   label: 'Notifications',
  //   icon: Bell,
  //   path: '/notifications',
  //   badgeKey: 'notifications',
  // },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

const mobileNavItems: NavItemDef[] = [
  { key: 'dashboard', label: 'Home', icon: LayoutDashboard, path: '' },
  { key: 'orders', label: 'Orders', icon: ShoppingCart, path: '/orders', badgeKey: 'orders' },
  // {
  //   key: 'notifications',
  //   label: 'Alerts',
  //   icon: Bell,
  //   path: '/notifications',
  //   badgeKey: 'notifications',
  // },
  { key: 'products', label: 'Products', icon: Package, path: '/products', badgeKey: 'products' },
  { key: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
];

// ═══════════════════════════════════════════════════════════════════════════
// BADGE COUNT
// ═══════════════════════════════════════════════════════════════════════════

const BadgeCount: React.FC<{ count?: number; compact?: boolean }> = ({ count, compact }) => {
  if (!count || count <= 0) return null;
  const display = count > 99 ? '99+' : `${count}`;
  return (
    <motion.span
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      className={`flex items-center justify-center font-bold bg-red-500 text-white rounded-full shadow-sm shadow-red-500/30 ${
        compact ? 'min-w-[16px] h-4 text-[9px] px-1' : 'min-w-[18px] h-[18px] text-[10px] px-1.5'
      }`}
    >
      {display}
    </motion.span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STATUS DOT
// ═══════════════════════════════════════════════════════════════════════════

const StatusDot: React.FC<{ status: string; size?: number }> = ({ status, size = 8 }) => {
  const normalized = normalizeStatus(status);
  const colors = {
    live: 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]',
    offline: 'bg-neutral-400',
    paused: 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]',
  };
  return (
    <div
      className={`rounded-full ${colors[normalized]} ${
        normalized === 'live' ? 'animate-pulse' : ''
      }`}
      style={{ width: size, height: size }}
    />
  );
};

const statusLabel = (status: string) => {
  const normalized = normalizeStatus(status);
  const map = { live: 'Live', offline: 'Offline', paused: 'Pending' };
  return map[normalized];
};

// ═══════════════════════════════════════════════════════════════════════════
// STORE AVATAR
// ═══════════════════════════════════════════════════════════════════════════

const StoreAvatar: React.FC<{ store: PortalStore; size?: string; className?: string }> = ({
  store,
  size = 'w-9 h-9',
  className = '',
}) => {
  if (store.avatar) {
    return (
      <img
        src={store.avatar}
        alt={store.name}
        className={`${size} rounded-lg object-cover ${className}`}
      />
    );
  }
  return (
    <div
      className={`${size} rounded-lg flex items-center justify-center text-white text-sm font-bold ${className}`}
      style={{ backgroundColor: getRandomColorByString(store.name) }}
    >
      {getFirstCharacter(store.name)}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STORE SWITCHER DROPDOWN
// ═══════════════════════════════════════════════════════════════════════════

const StoreSwitcher: React.FC<{
  stores: PortalStore[];
  currentStore: PortalStore;
  onSwitch: (id: string) => void;
  onCreate: () => void;
  compact?: boolean;
}> = ({ stores, currentStore, onSwitch, onCreate, compact }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center gap-3 rounded-xl transition-all ${
          compact
            ? 'p-2 hover:bg-white/10'
            : 'p-3 bg-white/5 hover:bg-white/10 border border-white/10'
        }`}
      >
        <StoreAvatar store={currentStore} className="shadow-md flex-shrink-0" />
        <div className="flex-1 min-w-0 text-left">
          <p className="text-sm font-semibold text-white truncate">{currentStore.name}</p>
          <div className="flex items-center gap-1.5">
            <StatusDot status={currentStore.status} size={6} />
            <span className="text-[11px] text-neutral-400">{statusLabel(currentStore.status)}</span>
          </div>
        </div>
        <ChevronDown
          size={16}
          className={`text-neutral-400 transition-transform flex-shrink-0 ${
            open ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {open && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              transition={{ duration: 0.15 }}
              className="absolute left-0 right-0 mt-2 bg-neutral-800 border border-neutral-700 rounded-xl shadow-2xl z-50 overflow-hidden"
            >
              <div className="p-1.5 max-h-64 overflow-y-auto">
                {stores.map((store) => {
                  const isActive = store.id === currentStore.id;
                  return (
                    <button
                      key={store.id}
                      onClick={() => {
                        onSwitch(store.id);
                        setOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-lg transition-all text-left ${
                        isActive ? 'bg-blue/15 border border-blue/20' : 'hover:bg-white/5'
                      }`}
                    >
                      <StoreAvatar store={store} size="w-8 h-8" className="flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p
                          className={`text-sm font-medium truncate ${
                            isActive ? 'text-white' : 'text-neutral-300'
                          }`}
                        >
                          {store.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <StatusDot status={store.status} size={5} />
                          <span className="text-[10px] text-neutral-500">
                            {statusLabel(store.status)}
                          </span>
                        </div>
                      </div>
                      {isActive && <Check size={14} className="text-blue flex-shrink-0" />}
                    </button>
                  );
                })}
              </div>
              <div className="border-t border-neutral-700 p-1.5">
                <button
                  onClick={() => {
                    onCreate();
                    setOpen(false);
                  }}
                  className="w-full flex items-center gap-2.5 p-2.5 rounded-lg hover:bg-white/5 transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg border-2 border-dashed border-neutral-600 flex items-center justify-center">
                    <Plus size={14} className="text-neutral-500" />
                  </div>
                  <span className="text-sm font-medium text-neutral-400">Add New Store</span>
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// DESKTOP SIDEBAR
// ═══════════════════════════════════════════════════════════════════════════

const DesktopSidebar: React.FC<StoreSidebarProps & { storeId: string }> = ({
  stores,
  currentStore,
  badgeCounts = {},
  onSwitchStore,
  onCreateStore,
  storeId,
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = `/my-store/${storeId}`;

  const getActiveKey = () => {
    const sub = pathname?.replace(basePath, '') || '';
    if (sub === '' || sub === '/') return 'dashboard';
    return sub.replace('/', '');
  };
  const activeKey = getActiveKey();

  console.log('found storessss::::', stores);

  return (
    <div className="fixed left-0 top-0 bottom-0 w-[240px] bg-neutral-900 border-r border-neutral-800 flex flex-col z-30">
      <div className="px-4 pt-4 pb-2">
        <button
          onClick={() => router.push('/')}
          className="flex items-center gap-2 text-xs font-medium text-neutral-500 hover:text-neutral-300 transition-colors"
        >
          <ArrowLeft size={14} />
          Back to Marketplace
        </button>
      </div>

      <div className="px-3 pb-4 pt-1">
        <StoreSwitcher
          stores={stores}
          currentStore={currentStore}
          onSwitch={onSwitchStore}
          onCreate={onCreateStore}
        />
      </div>

      <div className="mx-4 h-px bg-neutral-800" />

      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const isActive = activeKey === item.key;
          const Icon = item.icon;
          const badgeVal = item.badgeKey ? badgeCounts[item.badgeKey] : undefined;
          return (
            <button
              key={item.key}
              onClick={() => router.push(`${basePath}${item.path}`)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 mb-3 rounded-xl text-sm font-medium transition-all ${
                isActive
                  ? 'bg-blue/15 text-white border border-blue/20'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="relative flex-shrink-0">
                <Icon size={18} className={isActive ? 'text-blue' : 'text-neutral-500'} />
              </div>
              <span className="flex-1 text-left">{item.label}</span>
              {badgeVal && badgeVal > 0 ? (
                <BadgeCount count={badgeVal} />
              ) : (
                isActive && <div className="w-1.5 h-1.5 rounded-full bg-blue" />
              )}
            </button>
          );
        })}
      </nav>

      <div className="mx-4 h-px bg-neutral-800" />

      <div className="px-3 py-4 space-y-1">
        <button
          onClick={() => router.push(`${basePath}/preview`)}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
            activeKey === 'preview'
              ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'
              : 'text-neutral-400 hover:text-white hover:bg-white/5'
          }`}
        >
          <Eye
            size={18}
            className={activeKey === 'preview' ? 'text-emerald-400' : 'text-neutral-500'}
          />
          Store Preview
        </button>
      </div>

      <div className="px-4 py-3 border-t border-neutral-800">
        <p className="text-[10px] text-neutral-600 font-medium">{APP_NAME} Store Portal</p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE TOP BAR
// ═══════════════════════════════════════════════════════════════════════════

const MobileTopBar: React.FC<StoreSidebarProps & { storeId: string }> = ({
  stores,
  currentStore,
  onSwitchStore,
  onCreateStore,
  storeId,
}) => {
  const router = useRouter();
  return (
    <div className="sticky top-0 z-30 bg-neutral-900 border-b border-neutral-800 px-4 py-3 pt-12">
      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => router.push('/')}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ArrowLeft size={18} className="text-neutral-400" />
        </button>
        <div className="flex-1">
          <StoreSwitcher
            stores={stores}
            currentStore={currentStore}
            onSwitch={onSwitchStore}
            onCreate={onCreateStore}
            compact
          />
        </div>
        <button
          onClick={() => router.push(`/my-store/${storeId}/preview`)}
          className="p-1.5 rounded-lg hover:bg-white/10 transition-colors"
        >
          <Eye size={18} className="text-neutral-400" />
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE BOTTOM NAV
// ═══════════════════════════════════════════════════════════════════════════

const MobileBottomNav: React.FC<{ storeId: string; badgeCounts?: NavBadgeCounts }> = ({
  storeId,
  badgeCounts = {},
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const basePath = `/my-store/${storeId}`;

  const getActiveKey = () => {
    const sub = pathname?.replace(basePath, '') || '';
    if (sub === '' || sub === '/') return 'dashboard';
    return sub.replace('/', '');
  };
  const activeKey = getActiveKey();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-neutral-900 border-t border-neutral-800 px-2 pb-6 pt-2">
      <div className="flex items-center justify-around">
        {mobileNavItems.map((item) => {
          const isActive = activeKey === item.key;
          const Icon = item.icon;
          const badgeVal = item.badgeKey ? badgeCounts[item.badgeKey] : undefined;
          return (
            <button
              key={item.key}
              onClick={() => router.push(`${basePath}${item.path}`)}
              className="flex flex-col items-center gap-1 py-1 px-3 min-w-0 relative"
            >
              <div
                className={`relative p-1.5 rounded-lg transition-all ${
                  isActive ? 'bg-blue/20' : ''
                }`}
              >
                <Icon size={20} className={isActive ? 'text-blue' : 'text-neutral-500'} />
                {!!badgeVal && badgeVal > 0 && (
                  <span className="absolute -top-1 -right-1.5 flex items-center justify-center min-w-[16px] h-4 px-1 text-[9px] font-bold bg-red-500 text-white rounded-full shadow-sm shadow-red-500/40 ring-2 ring-neutral-900">
                    {badgeVal > 99 ? '99+' : badgeVal}
                  </span>
                )}
              </div>
              <span
                className={`text-[10px] font-medium ${isActive ? 'text-blue' : 'text-neutral-500'}`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// EXPORTS
// ═══════════════════════════════════════════════════════════════════════════

export {
  DesktopSidebar,
  MobileTopBar,
  MobileBottomNav,
  StoreSwitcher,
  StatusDot,
  statusLabel,
  BadgeCount,
  StoreAvatar,
};
