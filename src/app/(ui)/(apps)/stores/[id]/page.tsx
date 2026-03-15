'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useStores } from '@grc/hooks/useStores';
import { useReviews } from '@grc/hooks/useReviews';
import { useListings } from '@grc/hooks/useListings';
import { useCreators } from '@grc/hooks/useCreators';
import { useFollows } from '@grc/hooks/useFollows';
import { useAuth } from '@grc/hooks/useAuth';
import StoreDetails from '@grc/components/apps/store-details';

const StoreDetailPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const storeId = pathname?.split('/')?.[2] || '';
  const { isAuthenticated } = useAuth();

  // ── 1. Fetch store by ID ────────────────────────────────────────────
  const { storeDetail: store, isLoadingStoreDetail } = useStores({ storeId: storeId || undefined });

  const creatorId =
    typeof store?.creatorId === 'object' ? store?.creatorId?._id : store?.creatorId || '';
  const creatorSlug = typeof store?.creatorId === 'object' ? store?.creatorId?.slug : creatorId;

  // ── 2. Fetch creator profile ────────────────────────────────────────
  const { creatorBySlug: creatorProfile } = useCreators({
    creatorSlug: creatorSlug || undefined,
  });

  // ── 3. Follow state ─────────────────────────────────────────────────
  const { toggleFollow, checkFollow, isTogglingFollow } = useFollows();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (!storeId || !store) return;
    setFollowersCount(store?.followersCount || store?.totalFollowers || 0);

    if (isAuthenticated && storeId) {
      checkFollow({ targetType: 'store', targetIds: [storeId] })
        .then((result) => {
          if (result?.[storeId]) setIsFollowing(true);
          else setIsFollowing(false);
        })
        .catch(() => {});
    }
  }, [storeId, isAuthenticated, store]);

  const handleToggleFollow = useCallback(async () => {
    if (!storeId) return;
    try {
      const result = await toggleFollow({ targetType: 'store', targetId: storeId });
      if (!result) return; // User wasn't authenticated — auth modal shown, don't update UI
      const followed = result.followed ?? !isFollowing;
      setIsFollowing(followed);
      setFollowersCount(
        result.totalFollowers ?? (followed ? followersCount + 1 : Math.max(0, followersCount - 1))
      );
    } catch {}
  }, [storeId, toggleFollow, isFollowing, followersCount]);

  // ── 4. Fetch store listings ─────────────────────────────────────────
  const { listings, listingsTotal, isLoadingListings, isFetchingListings, refetchListings } =
    useListings({
      fetchListings: !!storeId,
      listingsParams: { storeId },
    });

  // ── 5. Fetch reviews ────────────────────────────────────────────────
  const {
    reviews,
    reviewsTotal,
    isLoadingReviews,
    createReview,
    isCreatingReview,
    refetchReviews,
  } = useReviews({
    fetchReviews: !!storeId,
    reviewsParams: { storeId },
  });

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

  const handleSubmitReview = useCallback(
    async (data: { rating: number; comment: string }) => {
      if (!storeId) return;
      try {
        await createReview?.({ storeId, rating: data.rating, comment: data.comment });
        refetchReviews?.();
      } catch {}
    },
    [createReview, refetchReviews, storeId]
  );

  // ── Loading ─────────────────────────────────────────────────────────
  if (isLoadingStoreDetail) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-400">Loading store...</p>
        </div>
      </div>
    );
  }

  if (!store && !isLoadingStoreDetail) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2">
          <span className="text-2xl">🏪</span>
        </div>
        <p className="text-neutral-500 text-sm">Store not found</p>
        <p className="text-neutral-400 text-xs">
          This store doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => router.push('/creators')}
          className="text-sm text-blue  font-medium mt-2"
        >
          Browse Creators
        </button>
      </div>
    );
  }

  return (
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
      onSubmitReview={handleSubmitReview}
      isSubmittingReview={isCreatingReview}
      onLoadMoreReviews={handleLoadMoreReviews}
      onBack={() => router.back()}
      // Follow integration
      isFollowing={isFollowing}
      followersCount={followersCount}
      onToggleFollow={handleToggleFollow}
      isTogglingFollow={isTogglingFollow}
    />
  );
};

export default StoreDetailPage;
