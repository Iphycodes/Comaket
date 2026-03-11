'use client';

import React, { useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useStores } from '@grc/hooks/useStores';
import { useMedia } from '@grc/hooks/useMedia';
import StoreSettingsPage from '@grc/components/my-store/settings';
import { usePayments } from '@grc/hooks/usePayments';

export default function StoreSettingsRoute() {
  const params = useParams();
  const router = useRouter();
  const storeId = (params?.storeId as string) || '';

  const {
    storeDetail: store,
    isLoadingStoreDetail,
    updateStore,
    isUpdatingStore,
    toggleVisibility,
    isTogglingVisibility,
    deleteStore,
    isDeletingStore,
    refetchStoreDetail,
  } = useStores({ storeId: storeId || undefined });

  const { uploadImage, isUploadingGeneral } = useMedia();

  const { banks, isLoadingBanks, verifyBankAccount, bankAccountInfo, isVerifyingBankAccount } =
    usePayments({ fetchBanks: true });

  const handleUpdateStore = useCallback(
    async (data: Record<string, any>) => {
      try {
        await updateStore(storeId, data);
        refetchStoreDetail?.(storeId);
      } catch {}
    },
    [updateStore, storeId, refetchStoreDetail]
  );

  const handleToggleVisibility = useCallback(
    async (visible: boolean) => {
      try {
        await toggleVisibility(storeId, visible);
        refetchStoreDetail?.(storeId);
      } catch {}
    },
    [toggleVisibility, storeId, refetchStoreDetail]
  );

  const handleDeleteStore = useCallback(async () => {
    try {
      await deleteStore?.(storeId);
      router.push('/');
    } catch {}
  }, [deleteStore, storeId, router]);

  const handleUploadImage = useCallback(
    async (file: File): Promise<string | null> => {
      try {
        const url = await uploadImage(file, true);
        return url || null;
      } catch {
        return null;
      }
    },
    [uploadImage]
  );

  if (isLoadingStoreDetail) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-400">Loading settings...</p>
        </div>
      </div>
    );
  }

  return (
    <StoreSettingsPage
      storeId={storeId}
      store={store}
      onUpdateStore={handleUpdateStore}
      isSaving={isUpdatingStore}
      onToggleVisibility={handleToggleVisibility}
      isTogglingVisibility={isTogglingVisibility}
      onDeleteStore={handleDeleteStore}
      isDeleting={isDeletingStore}
      onUploadImage={handleUploadImage}
      isUploadingImage={isUploadingGeneral}
      banks={banks}
      isLoadingBanks={isLoadingBanks}
      onVerifyBankAccount={verifyBankAccount}
      bankAccountInfo={bankAccountInfo}
      isVerifyingBankAccount={isVerifyingBankAccount}
    />
  );
}
