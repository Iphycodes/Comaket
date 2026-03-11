'use client';

import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useStoreBadge } from '@grc/components/my-store/context/store-badge-context';
import { useOrders } from '@grc/hooks/useOrders';
import StoreOrders from '@grc/components/my-store/orders';

export default function StoreOrdersPage() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';
  const { clearBadge } = useStoreBadge();

  useEffect(() => {
    clearBadge('orders');
  }, []);

  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // ── Use the seller orders from the hook ─────────────────────────────
  const {
    sellerOrders,
    sellerOrdersTotal,
    isLoadingSellerOrders,
    isFetchingSellerOrders,
    sellerOrdersPagination,
    updateOrderStatus,
    isUpdatingOrderStatus,
    getOrderById,
    orderDetail,
    isLoadingOrderDetail,
    refetchSellerOrders,
  } = useOrders({
    fetchSellerOrders: !!storeId,
    sellerOrdersParams: {
      storeId,
      ...(filterStatus ? { status: filterStatus } : {}),
      ...(searchQuery ? { search: searchQuery } : {}),
    },
  });

  const handleFilterChange = useCallback((status: string | null) => {
    setFilterStatus(status);
  }, []);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  const handleUpdateStatus = useCallback(
    async (orderId: string, newStatus: string) => {
      try {
        await updateOrderStatus(orderId, { status: newStatus });
        refetchSellerOrders();
      } catch {}
    },
    [updateOrderStatus, refetchSellerOrders]
  );

  const handleFetchDetail = useCallback(
    async (orderId: string) => {
      await getOrderById(orderId);
    },
    [getOrderById]
  );

  return (
    <StoreOrders
      storeId={storeId}
      orders={sellerOrders}
      ordersTotal={sellerOrdersTotal}
      isLoading={isLoadingSellerOrders}
      isFetching={isFetchingSellerOrders}
      pagination={sellerOrdersPagination}
      filterStatus={filterStatus}
      searchQuery={searchQuery}
      onFilterChange={handleFilterChange}
      onSearchChange={handleSearchChange}
      onUpdateStatus={handleUpdateStatus}
      isUpdatingStatus={isUpdatingOrderStatus}
      onFetchDetail={handleFetchDetail}
      orderDetail={orderDetail}
      isLoadingDetail={isLoadingOrderDetail}
      onRefresh={() => refetchSellerOrders()}
    />
  );
}
