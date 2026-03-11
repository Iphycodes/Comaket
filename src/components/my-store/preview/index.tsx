'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { Eye, ExternalLink, Loader2 } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useRouter } from 'next/navigation';
import { useStores } from '@grc/hooks/useStores';
import { useReviews } from '@grc/hooks/useReviews';
import { useListings } from '@grc/hooks/useListings';
import { useCreators } from '@grc/hooks/useCreators';
import StoreDetails from '@grc/components/apps/store-details';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Comaket';

interface StorePreviewProps {
  storeId: string;
}

const StorePreview: React.FC<StorePreviewProps> = ({ storeId }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const router = useRouter();

  // ── 1. Fetch store detail ───────────────────────────────────────────
  const { storeDetail: store, isLoadingStoreDetail } = useStores({
    storeId: storeId || undefined,
  });

  // ── 2. Derive creator slug ─────────────────────────────────────────
  const creatorSlug =
    typeof store?.creatorId === 'object'
      ? store?.creatorId?.slug || store?.creatorId?.username
      : '';

  // ── 3. Fetch creator profile ────────────────────────────────────────
  const { creatorBySlug: creatorProfile } = useCreators({
    creatorSlug: creatorSlug || undefined,
  });

  // ── 4. Fetch store listings ─────────────────────────────────────────
  const { listings, listingsTotal, isLoadingListings, isFetchingListings, refetchListings } =
    useListings({
      fetchListings: !!storeId,
      listingsParams: { storeId },
    });

  // ── 5. Fetch reviews ────────────────────────────────────────────────
  const { reviews, reviewsTotal, isLoadingReviews, refetchReviews } = useReviews({
    fetchReviews: !!storeId,
    reviewsParams: { storeId },
  });

  // ── Followers count from store data ─────────────────────────────────
  const followersCount = store?.followersCount || store?.totalFollowers || 0;

  // ── Handlers ────────────────────────────────────────────────────────
  const handleLoadMoreListings = useCallback(
    (page: number) => {
      refetchListings?.({ storeId, page, perPage: 10 });
    },
    [refetchListings, storeId]
  );

  const handleLoadMoreReviews = useCallback(
    (page: number) => {
      refetchReviews?.({ storeId, page, perPage: 10 });
    },
    [refetchReviews, storeId]
  );

  // ── Loading ─────────────────────────────────────────────────────────
  if (isLoadingStoreDetail) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 size={24} className="animate-spin text-neutral-400 mx-auto" />
          <p className="text-sm text-neutral-400">Loading preview...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Preview Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-4 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
          <Eye size={16} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Store Preview
          </p>
          <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/60">
            This is how your store appears to buyers on {APP_NAME}
          </p>
        </div>
        {!isMobile && (
          <button
            onClick={() => window.open(`/store/${storeId}`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <ExternalLink size={12} />
            Open Live
          </button>
        )}
      </motion.div>

      {/* StoreDetails — the same component buyers see */}
      <div
        className={`${
          isMobile ? '-mx-4' : ''
        } bg-white dark:bg-neutral-900 rounded-2xl overflow-hidden ${
          isMobile ? '' : 'border border-neutral-100 dark:border-neutral-700/50'
        }`}
      >
        <StoreDetails
          store={store}
          creatorProfile={
            creatorProfile || (typeof store?.creatorId === 'object' ? store.creatorId : null)
          }
          listings={listings || []}
          listingsTotal={listingsTotal || 0}
          isLoadingListings={isLoadingListings || false}
          isFetchingListings={isFetchingListings}
          onLoadMoreListings={handleLoadMoreListings}
          reviews={reviews || []}
          reviewsTotal={reviewsTotal || 0}
          isLoadingReviews={isLoadingReviews || false}
          onLoadMoreReviews={handleLoadMoreReviews}
          onBack={() => router.push(`/my-store/${storeId}`)}
          // No follow toggle in preview — it's the owner viewing their own store
          isFollowing={false}
          followersCount={followersCount}
          isSellerView={true}
          // No review submission in preview
        />
      </div>
    </div>
  );
};

export default StorePreview;
