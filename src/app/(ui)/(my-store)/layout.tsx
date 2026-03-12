'use client';

import React, { useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useAuth } from '@grc/hooks/useAuth';
import { useUsers } from '@grc/hooks/useUser';
import { useStores } from '@grc/hooks/useStores';
import { useCreators } from '@grc/hooks/useCreators';
import { useStoreBadge } from '@grc/components/my-store/context/store-badge-context';
import StoreConfirmModal from '@grc/components/apps/layout/side-nav/lib/store-confirm-modal';
import {
  DesktopSidebar,
  MobileTopBar,
  MobileBottomNav,
  toPortalStore,
} from '@grc/components/my-store/layout/store-sidebar';

const MyStoreLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const params = useParams();
  const router = useRouter();
  const isMobile = useMediaQuery(mediaSize.mobile);
  const storeId = (params?.storeId as string) || '';

  const { isAuthenticated } = useAuth();
  const { userProfile } = useUsers({ fetchProfile: isAuthenticated ?? false });
  const isCreatorAccount = userProfile?.role === 'creator';

  // ── Fetch creator profile to get their stores ───────────────────────
  const { creatorProfile } = useCreators({
    fetchProfile: isAuthenticated ? isCreatorAccount : false,
  });

  // ── Fetch all creator's stores ──────────────────────────────────────
  const { myStores: storesList, isLoadingStores } = useStores({
    fetchStores: isAuthenticated ? isCreatorAccount : false,
    storesParams: creatorProfile?._id ? { creatorId: creatorProfile._id } : undefined,
    fetchMyStores: isAuthenticated,
  });

  console.log('store list:::::::', storesList);

  // ── Badge context ───────────────────────────────────────────────────
  const { badgeCounts } = useStoreBadge();

  // ── Create store modal ──────────────────────────────────────────────
  const [showStoreConfirm, setShowStoreConfirm] = React.useState(false);

  // ── Derive PortalStore[] from backend stores ────────────────────────
  const portalStores = useMemo(() => {
    if (!storesList || storesList.length === 0) return [];
    return storesList.filter((s: any) => s.status !== 'deleted').map(toPortalStore);
  }, [storesList]);

  // ── Current store from URL ──────────────────────────────────────────
  const currentStore = useMemo(() => {
    if (portalStores.length === 0) {
      return { id: storeId, name: 'My Store', avatar: null, status: 'active' as const };
    }
    return portalStores.find((s: any) => s.id === storeId) || portalStores[0];
  }, [portalStores, storeId]);

  // ── Handlers ────────────────────────────────────────────────────────
  const handleSwitchStore = (newStoreId: string) => {
    if (newStoreId !== storeId) {
      router.push(`/my-store/${newStoreId}`);
    }
  };

  const handleCreateStore = () => {
    setShowStoreConfirm(true);
  };

  // ── Loading ─────────────────────────────────────────────────────────
  if (isLoadingStores && portalStores.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-neutral-900">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-400">Loading your stores...</p>
        </div>
      </div>
    );
  }

  // ── Sidebar props ───────────────────────────────────────────────────
  const sidebarProps = {
    stores: portalStores,
    currentStore,
    badgeCounts,
    onSwitchStore: handleSwitchStore,
    onCreateStore: handleCreateStore,
    storeId,
  };

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <div className={`min-h-screen ${isMobile ? '' : 'flex'}`}>
      {/* Desktop Sidebar */}
      {!isMobile && <DesktopSidebar {...sidebarProps} />}

      {/* Mobile Top Bar */}
      {isMobile && <MobileTopBar {...sidebarProps} />}

      {/* Main Content */}
      <main className={`flex-1 ${isMobile ? 'pb-20' : 'ml-[240px]'}`}>
        <div className={`${isMobile ? 'px-4 py-4' : 'p-6 w-full'}`}>{children}</div>
      </main>

      {/* Mobile Bottom Nav */}
      {isMobile && <MobileBottomNav storeId={storeId} badgeCounts={badgeCounts} />}

      {/* Create Store Modal */}
      <StoreConfirmModal showConfirm={showStoreConfirm} setShowConfirm={setShowStoreConfirm} />
    </div>
  );
};

export default MyStoreLayout;
