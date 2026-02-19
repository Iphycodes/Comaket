'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import StoreOrders from '@grc/components/my-store/orders';
import { useStoreBadge } from '@grc/components/my-store/context/store-badge-context';

export default function StoreOrdersPage() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';

  const { clearBadge } = useStoreBadge();
  useEffect(() => {
    clearBadge('orders');
  }, []); // use the matching key
  return <StoreOrders storeId={storeId} />;
}
