'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import StoreProducts from '@grc/components/my-store/products';
import { useStoreBadge } from '@grc/components/my-store/context/store-badge-context';

export default function StoreProductsPage() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';

  const { clearBadge } = useStoreBadge();
  useEffect(() => {
    clearBadge('products');
  }, []);
  return <StoreProducts storeId={storeId} />;
}
