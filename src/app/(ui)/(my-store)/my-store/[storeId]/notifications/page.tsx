'use client';

import React, { useEffect } from 'react';
import { useParams } from 'next/navigation';
import StoreNotifications from '@grc/components/my-store/notifications';
import { useStoreBadge } from '@grc/components/my-store/context/store-badge-context';

export default function StoreNotificationsPage() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';

  const { clearBadge } = useStoreBadge();
  useEffect(() => {
    clearBadge('notifications');
  }, []); // use the matching key
  return <StoreNotifications storeId={storeId} />;
}
