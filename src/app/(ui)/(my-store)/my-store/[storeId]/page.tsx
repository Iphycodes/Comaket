'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import StoreDashboard from '@grc/components/my-store/dashboard';

// ── TODO: Fetch store name from context/API ───────────────────────────
const storeNames: Record<string, string> = {
  'vs-001': 'EmTech Store',
  'vs-002': 'Gadget Hub NG',
  'vs-003': 'PhoneDeals Kaduna',
};

export default function StoreHomePage() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';
  const storeName = storeNames[storeId] || 'My Store';

  return <StoreDashboard storeId={storeId} storeName={storeName} />;
}
