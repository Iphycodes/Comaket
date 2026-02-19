'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import StoreReviews from '@grc/components/my-store/reviews';
import { useStoreBadge } from '@grc/components/my-store/context/store-badge-context';

export default function StoreReviewsPage() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';

  const { clearBadge } = useStoreBadge();
  useEffect(() => {
    clearBadge('reviews');
  }, []);
  return <StoreReviews storeId={storeId} />;
}
