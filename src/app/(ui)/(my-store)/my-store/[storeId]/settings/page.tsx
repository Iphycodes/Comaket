'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import StoreSettingsPage from '@grc/components/my-store/settings';

export default function StoreSettingsRoute() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';

  return <StoreSettingsPage storeId={storeId} />;
}
