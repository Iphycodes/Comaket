'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import { useStores } from '@grc/hooks/useStores';
import { useListings } from '@grc/hooks/useListings';
import { useOrders } from '@grc/hooks/useOrders';
import StoreDashboard from '@grc/components/my-store/dashboard';

export default function StoreHomePage() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';

  // ── Store detail ────────────────────────────────────────────────────
  const { storeDetail: store, isLoadingStoreDetail } = useStores({
    storeId: storeId || undefined,
  });

  // ── Store listings (for product counts) ─────────────────────────────
  const { listingsTotal, isLoadingListings } = useListings({
    fetchListings: !!storeId,
    listingsParams: { storeId },
    customPaginate: { page: 1, perPage: 1 }, // just need total count
  });

  // ── Store orders (seller view — recent) ──────────────────────────────
  const {
    sellerOrders: recentOrders,
    sellerOrdersTotal: ordersTotal,
    isLoadingSellerOrders: isLoadingOrders,
  } = useOrders({
    fetchSellerOrders: !!storeId,
    sellerOrdersParams: { storeId },
  });

  const storeName = store?.name || 'My Store';

  if (isLoadingStoreDetail) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-400">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <StoreDashboard
      storeId={storeId}
      storeName={storeName}
      store={store}
      totalProducts={listingsTotal || 0}
      isLoadingProducts={isLoadingListings}
      recentOrders={recentOrders || []}
      totalOrders={ordersTotal || 0}
      isLoadingOrders={isLoadingOrders}
    />
  );
}
