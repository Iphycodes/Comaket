'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import StorePreview from '@grc/components/my-store/preview';

export default function StorePreviewPage() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';

  return <StorePreview storeId={storeId} />;
}
