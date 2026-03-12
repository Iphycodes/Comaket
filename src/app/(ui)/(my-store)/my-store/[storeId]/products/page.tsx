'use client';

import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { useStoreBadge } from '@grc/components/my-store/context/store-badge-context';
import { useStores } from '@grc/hooks/useStores';
import { CREATOR_INDUSTRIES } from '@grc/_shared/constant';
import SellItem from '@grc/components/apps/sell-item';
import SellItemModal from '@grc/components/apps/sell-item-modal';

export default function StoreProductsPage() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';
  const { clearBadge } = useStoreBadge();

  useEffect(() => {
    clearBadge('products');
  }, []);

  const [sellModalOpen, setSellModalOpen] = useState(false);

  // ── Fetch store detail for industries + location ──────────────────
  const { storeDetail: store } = useStores({ storeId: storeId || undefined });

  const storeIndustries = (store?.industries || store?.categories || [])
    .map((id: string) => {
      const found = CREATOR_INDUSTRIES.find((ind) => ind.id === id);
      return found ? { id: found.id, label: found.label } : null;
    })
    .filter(Boolean) as { id: string; label: string }[];

  const defaultLocation = {
    state: store?.location?.state || '',
    city: store?.location?.city || '',
  };

  return (
    <div className="space-y-5">
      {/* SellItem component — pass storeId to fetch store listings instead of creator listings */}
      <div className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 overflow-hidden">
        <SellItem storeId={storeId} />
      </div>

      {/* Sell Item Modal — uses store industries + location */}
      <SellItemModal
        isSellItemModalOpen={sellModalOpen}
        setIsSellItemModalOpen={setSellModalOpen}
        handleTrackStatus={() => {}}
        storeId={storeId}
        categoryOptions={storeIndustries}
        defaultLocation={defaultLocation}
      />
    </div>
  );
}
