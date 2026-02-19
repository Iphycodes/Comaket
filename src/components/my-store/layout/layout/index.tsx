'use client';

import React, { ReactElement, useState, useMemo, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import {
  DesktopSidebar,
  MobileBottomNav,
  MobileTopBar,
  NavBadgeCounts,
  PortalStore,
} from '../store-sidebar';
import { StoreBadgeContext } from '../../context/store-badge-context';

// ═══════════════════════════════════════════════════════════════════════════
// MOCK STORES — TODO: Replace with real data from context/API
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_STORES: PortalStore[] = [
  { id: 'vs-001', name: 'EmTech Store', status: 'live' },
  { id: 'vs-002', name: 'Gadget Hub NG', status: 'offline' },
  { id: 'vs-003', name: 'PhoneDeals Kaduna', status: 'paused' },
];

// ═══════════════════════════════════════════════════════════════════════════
// MOCK BADGE COUNTS — TODO: Replace with real-time data from API/WS
// ═══════════════════════════════════════════════════════════════════════════

const MOCK_BADGE_COUNTS: NavBadgeCounts = {
  orders: 3,
  reviews: 2,
  notifications: 7,
  products: 1,
};

// ═══════════════════════════════════════════════════════════════════════════
// LAYOUT
// ═══════════════════════════════════════════════════════════════════════════

interface StorePortalLayoutProps {
  children: ReactElement | ReactElement[];
}

const StorePortalLayout: React.FC<StorePortalLayoutProps> = ({ children }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const params = useParams();
  const router = useRouter();
  const storeId = (params?.storeId as string) || '';

  const currentStore = useMemo(
    () => MOCK_STORES.find((s) => s.id === storeId) || MOCK_STORES[0],
    [storeId]
  );

  // TODO: Replace with real badge counts from API / context
  const [badgeCounts, setBadgeCounts] = useState<NavBadgeCounts>(MOCK_BADGE_COUNTS);

  const clearBadge = useCallback((key: keyof NavBadgeCounts) => {
    setBadgeCounts((prev) => ({ ...prev, [key]: 0 }));
  }, []);

  const handleSwitchStore = useCallback(
    (newStoreId: string) => {
      router.push(`/my-store/${newStoreId}`);
    },
    [router]
  );

  const handleCreateStore = useCallback(() => {
    router.push('/creator-setup');
  }, [router]);

  const sidebarProps = {
    stores: MOCK_STORES,
    currentStore,
    badgeCounts,
    onSwitchStore: handleSwitchStore,
    onCreateStore: handleCreateStore,
    storeId,
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      {/* Desktop sidebar */}
      {!isMobile && <DesktopSidebar {...sidebarProps} />}

      {/* Mobile top bar */}
      {isMobile && <MobileTopBar {...sidebarProps} />}

      {/* Main content — wrapped with StoreBadgeContext so pages can clearBadge */}
      <main className={`${isMobile ? 'pb-24' : 'ml-[240px]'} min-h-screen`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'px-6 py-6'}`}>
          <StoreBadgeContext.Provider value={{ badgeCounts, clearBadge }}>
            {children}
          </StoreBadgeContext.Provider>
        </div>
      </main>

      {/* Mobile bottom nav */}
      {isMobile && <MobileBottomNav storeId={storeId} badgeCounts={badgeCounts} />}
    </div>
  );
};

export default StorePortalLayout;
