import React, { Dispatch, SetStateAction, useContext, useMemo, useState } from 'react';
import { Layout, Menu } from 'antd';
import { SideNavHeader } from './lib';
import { usePathname, useRouter } from 'next/navigation';
import { Nav } from '@grc/app/nav';
import { AppContext } from '@grc/app-context';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { LogIn, LogOut, ChevronRight, Sparkles, Store, Plus, Sun, Moon } from 'lucide-react';
import StoreConfirmModal from './lib/store-confirm-modal';
import { useTheme } from 'next-themes';

const { Sider } = Layout;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface StoreData {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  category?: string;
  status?: string;
  totalListings?: number;
  rating?: number;
  logo?: string | null;
  [key: string]: any;
}

interface SideNavProps {
  toggleSider: boolean;
  appNav: Nav;
  selectedKey: string;
  setSelectedKey: Dispatch<SetStateAction<string>>;
  setToggleSider: Dispatch<SetStateAction<boolean>>;
  setIsCreateStoreModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsSellItemModalOpen: Dispatch<SetStateAction<boolean>>;
  setIsChatsModalOpen: Dispatch<SetStateAction<boolean>>;
  userProfile?: any;
  isLoadingProfile?: boolean;
  onLogout?: () => void;
  stores?: StoreData[];
  isCreatorAccount?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// STORE MENU ITEM LABEL
// ═══════════════════════════════════════════════════════════════════════════

const StoreMenuLabel: React.FC<{ store: StoreData }> = ({ store }) => {
  const initial = getFirstCharacter(store.name || 'S');
  const bgColor = getRandomColorByString(store.name || 'Store');

  return (
    <div className="flex items-center gap-2.5 py-0.5 w-full group">
      <div className="w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
        {store.logo ? (
          <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white text-xs font-bold"
            style={{ backgroundColor: bgColor }}
          >
            {initial}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:font-semibold transition-colors">
            {store.name}
          </span>
        </div>
      </div>
      <ChevronRight
        size={14}
        className="text-neutral-300 dark:text-neutral-600 group-hover:font-semibold group-hover:translate-x-0.5 transition-all flex-shrink-0"
      />
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SIDENAV USER SECTION
// ═══════════════════════════════════════════════════════════════════════════

const SideNavUserSection: React.FC<{
  userProfile?: any;
  isLoading?: boolean;
  isCollapsed: boolean;
  onSignIn: () => void;
  onLogout: () => void;
  onProfileClick: () => void;
}> = ({ userProfile, isLoading, isCollapsed, onSignIn, onLogout, onProfileClick }) => {
  if (isLoading) {
    return (
      <div className={`mx-3 mb-4 ${isCollapsed ? 'mx-2' : ''} absolute bottom-0 left-0`}>
        <div className="flex items-center gap-3 p-3 rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 animate-pulse">
          <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
          {!isCollapsed && (
            <div className="flex-1 space-y-2">
              <div className="h-3 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
              <div className="h-2.5 w-32 bg-neutral-200 dark:bg-neutral-700 rounded" />
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!userProfile) {
    if (isCollapsed) {
      return (
        <div className="mx-2 mb-4 flex justify-center absolute bottom-0 left-0">
          <button
            onClick={onSignIn}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-blue to-indigo-600 flex items-center justify-center shadow-lg shadow-blue/25 hover:shadow-blue/40 hover:scale-105 transition-all"
          >
            <LogIn size={16} className="text-white" />
          </button>
        </div>
      );
    }

    return (
      <div className="mx-3 mb-4 absolute bottom-0 left-0">
        <button
          onClick={onSignIn}
          className="w-full group relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue to-indigo-600 p-[1px] shadow-lg shadow-blue/20 hover:shadow-blue/30 transition-all"
        >
          <div className="relative flex items-center gap-2 rounded-[15px] bg-white dark:bg-neutral-900 px-4 py-3.5 group-hover:bg-blue-50/50 dark:group-hover:bg-blue-950/30 transition-colors">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue to-indigo-600 flex items-center justify-center flex-shrink-0">
              <Sparkles size={18} className="text-white" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-sm font-bold text-neutral-900 dark:text-white mb-[-5px]">
                Login to KRaft
              </p>
              <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                Sign in to start buying/selling
              </p>
            </div>
            <ChevronRight
              size={16}
              className="text-blue group-hover:translate-x-0.5 transition-transform"
            />
          </div>
        </button>
      </div>
    );
  }

  const firstName = userProfile?.firstName || '';
  const lastName = userProfile?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';
  const email = userProfile?.email || '';
  const avatarUrl = userProfile?.avatar;

  if (isCollapsed) {
    return (
      <div className="mx-2 mb-4 flex w-full justify-center absolute bottom-0 left-0">
        <button onClick={onProfileClick} className="relative group" title={fullName}>
          {avatarUrl ? (
            <img
              src={avatarUrl}
              alt={fullName}
              className="w-10 h-10 rounded-full object-cover ring-2 ring-neutral-200 dark:ring-neutral-700 group-hover:ring-blue transition-all"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ring-2 ring-neutral-200 dark:ring-neutral-700 group-hover:ring-blue transition-all"
              style={{ backgroundColor: getRandomColorByString(firstName || 'U') }}
            >
              {getFirstCharacter(firstName || 'U')}
            </div>
          )}
          <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-white dark:border-neutral-900" />
        </button>
      </div>
    );
  }

  return (
    <div className="mx-3 mb-4 absolute bottom-0 left-0 w-full">
      <div className="rounded-2xl w-full border border-neutral-100 dark:border-neutral-800 bg-neutral-50/80 dark:bg-neutral-800/40 overflow-hidden">
        <button
          onClick={onProfileClick}
          className="w-full flex items-center gap-3 px-4 py-3 hover:bg-neutral-100/80 dark:hover:bg-neutral-700/30 transition-colors text-left"
        >
          <div className="relative flex-shrink-0">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={fullName}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-white dark:ring-neutral-700"
              />
            ) : (
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold ring-2 ring-white dark:ring-neutral-700"
                style={{ backgroundColor: getRandomColorByString(firstName || 'U') }}
              >
                {getFirstCharacter(firstName || 'U')}
              </div>
            )}
            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-neutral-50 dark:border-neutral-800" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate mb-[-5px]">
              {fullName}
            </p>
            <p className="text-[11px] text-neutral-500 dark:text-neutral-400 truncate">{email}</p>
          </div>
          <ChevronRight size={14} className="text-neutral-400 flex-shrink-0" />
        </button>
        <div className="border-t border-neutral-100 dark:border-neutral-700/50">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors"
          >
            <LogOut size={15} />
            <span className="text-xs font-medium">Sign out</span>
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// THEME TOGGLE
// ═══════════════════════════════════════════════════════════════════════════

const ThemeToggle: React.FC<{ isCollapsed: boolean }> = ({ isCollapsed }) => {
  const { theme, setTheme } = useTheme();
  const isDark = theme === 'dark';

  if (isCollapsed) {
    return (
      <div className="flex justify-center mb-3">
        <button
          onClick={() => setTheme(isDark ? 'light' : 'dark')}
          className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {isDark ? (
            <Sun size={18} className="text-amber-400" />
          ) : (
            <Moon size={18} className="text-neutral-500" />
          )}
        </button>
      </div>
    );
  }

  return (
    <div className="mx-3 mb-3">
      <button
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
      >
        {isDark ? (
          <Sun size={18} className="text-amber-400" />
        ) : (
          <Moon size={18} className="text-neutral-500" />
        )}
        <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
          {isDark ? 'Light Mode' : 'Dark Mode'}
        </span>
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SIDENAV COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const SideNav: React.FC<SideNavProps> = (props) => {
  const {
    selectedKey,
    toggleSider,
    appNav,
    setSelectedKey,
    setToggleSider,
    setIsCreateStoreModalOpen,
    setIsSellItemModalOpen,
    setIsChatsModalOpen,
    userProfile,
    isLoadingProfile,
    onLogout,
    stores = [],
    isCreatorAccount = false,
  } = props;

  const pathname = usePathname();
  const urlPath = pathname?.split('/');
  const { push } = useRouter();
  const { setToggleFindVendorDrawer, setToggleNotificationsDrawer, setIsAuthModalOpen, cartCount } =
    useContext(AppContext);
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [showStoreConfirmModal, setShowStoreConfirmModal] = useState<boolean>(false);

  // ── Filter menu items based on user role ────────────────────────────
  const filteredMenuItems = useMemo(() => {
    let items = [...(appNav?.items || [])];

    // Hide sell-item if user is not a creator
    if (!isCreatorAccount) {
      items = items.filter((item) => item.key !== 'sell-item');
    }

    // Add cart count badge to cart item
    return items.map((item) => {
      if (item.key === 'cart' && cartCount > 0) {
        return {
          ...item,
          label: (
            <span className="flex items-center gap-2">
              Cart
              <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 text-white text-[10px] font-bold flex items-center justify-center leading-none">
                {cartCount > 99 ? '99+' : cartCount}
              </span>
            </span>
          ),
        };
      }
      return item;
    });
  }, [appNav?.items, isCreatorAccount, cartCount]);

  // ── Build dynamic footer menu items with real stores ────────────────
  const footerMenuItems = useMemo(() => {
    let baseItems = [...(appNav?.footerMenuItems || [])];

    // Hide "Subscription" link for non-creators
    if (!isCreatorAccount) {
      baseItems = baseItems.map((item) => {
        if (item.children) {
          return {
            ...item,
            children: item.children.filter((child: any) => child.key !== 'subscription'),
          };
        }
        return item;
      });
      return baseItems;
    }

    const activeStores = stores.filter((s) => s.status !== 'suspended' && s.status !== 'deleted');

    if (activeStores.length > 0) {
      const createStoreChild = {
        label: (
          <div className="flex items-center gap-2.5 py-0.5 w-full group">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue/10 to-indigo-500/10 dark:from-blue/20 dark:to-indigo-500/20 border border-dashed border-blue/30 flex items-center justify-center flex-shrink-0">
              <Plus size={16} className="text-blue" />
            </div>
            <span className="text-xs font-semibold text-blue">Create New Store</span>
          </div>
        ),
        key: 'create-new-store',
      };

      const myStoresItem = {
        label: 'My Stores',
        key: 'my-store',
        destination: '/my-store',
        icon: <Store size={20} />,
        children: [
          ...activeStores.map((store) => ({
            label: <StoreMenuLabel store={store} />,
            key: `my-store-${store._id}`,
            destination: `/my-store/${store._id}`,
          })),
          createStoreChild,
        ],
      };

      baseItems.unshift(myStoresItem);
    }
    return baseItems;
  }, [appNav?.footerMenuItems, stores, isCreatorAccount]);

  // ── Resolve destination for any menu key ────────────────────────────

  const getDestinationForKey = (key: string): string => {
    for (const item of appNav?.items || []) {
      if (item.key === key && item.destination) return item.destination;
      if (item?.children) {
        for (const child of item.children) {
          if (child.key === key && child.destination) return child.destination;
        }
      }
    }
    for (const item of footerMenuItems) {
      if (item.key === key && item.destination) return item.destination;
      if (item?.children) {
        for (const child of item.children) {
          if (child.key === key && child.destination) return child.destination;
        }
      }
    }
    return '';
  };

  const handleMenuClick = ({ key }: { key: string }) => {
    setToggleSider(false);
    setToggleFindVendorDrawer(true);
    setToggleNotificationsDrawer(true);
    setIsSellItemModalOpen(false);

    if (key === 'sell-item') {
      setIsSellItemModalOpen(true);
      setSelectedKey(key);
      return;
    }

    if (key === 'create-new-store') {
      setShowStoreConfirmModal(true);
      setSelectedKey(key);
      return;
    }

    if (key === 'notifications') {
      setToggleNotificationsDrawer(false);
      setToggleSider(true);
      setSelectedKey(key);
      return;
    }

    if (key === 'create-store') {
      setIsCreateStoreModalOpen(true);
      setSelectedKey(key);
      return;
    }

    if (key === 'chats') {
      setIsChatsModalOpen(true);
      setSelectedKey(key);
      return;
    }

    const destination = getDestinationForKey(key);
    if (destination) {
      push(destination);
    }

    setSelectedKey(key);
  };

  return (
    <Sider
      collapsed={toggleSider}
      collapsedWidth={isMobile ? 0 : 80}
      className="dash-sider border-r p-0 text-lg shadow-sm border-border/100 relative"
      width={300}
      style={{
        overflow: 'auto',
        position: 'fixed',
        height: '100vh',
        scrollbarWidth: 'none',
        left: 0,
        top: 0,
        bottom: 0,
        zIndex: 100,
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <SideNavHeader toggleSider={toggleSider} />

      <Menu
        className="sider-menu mt-10 mb-16 text-card-foreground text-[16px]"
        mode="inline"
        items={filteredMenuItems}
        defaultSelectedKeys={[]}
        selectedKeys={
          urlPath?.[1] === '' && selectedKey === ''
            ? ['market']
            : selectedKey !== ''
              ? [selectedKey]
              : [urlPath?.[1] ?? '']
        }
        onClick={handleMenuClick}
      />

      <Menu
        className="text-card-foreground text-[16px]"
        mode="inline"
        items={footerMenuItems}
        defaultSelectedKeys={[]}
        selectedKeys={
          urlPath?.[1] === '' && selectedKey === ''
            ? []
            : selectedKey !== ''
              ? [selectedKey]
              : [urlPath?.[1] ?? '']
        }
        onClick={handleMenuClick}
      />

      <div className="flex-1" />

      <ThemeToggle isCollapsed={toggleSider} />

      <SideNavUserSection
        userProfile={userProfile}
        isLoading={isLoadingProfile}
        isCollapsed={toggleSider}
        onSignIn={() => setIsAuthModalOpen(true)}
        onLogout={() => onLogout?.()}
        onProfileClick={() => push('/profile')}
      />

      <StoreConfirmModal
        showConfirm={showStoreConfirmModal}
        setShowConfirm={setShowStoreConfirmModal}
      />
    </Sider>
  );
};

export default SideNav;
