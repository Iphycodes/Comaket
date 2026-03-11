'use client';

import React, { useCallback, useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import dynamic from 'next/dynamic';
import { useCreators } from '@grc/hooks/useCreators';
import { useReviews } from '@grc/hooks/useReviews';
import { useListings } from '@grc/hooks/useListings';
import { useStores } from '@grc/hooks/useStores';
import { useFollows } from '@grc/hooks/useFollows';
import { useAuth } from '@grc/hooks/useAuth';

const CreatorDetails = dynamic(() => import('@grc/components/apps/creator-details'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="w-10 h-10 border-2 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-sm text-neutral-400">Loading creator...</p>
      </div>
    </div>
  ),
});

const CreatorDetailPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const username = decodeURIComponent(pathname?.split('/')?.[2] || '');
  const { isAuthenticated } = useAuth();

  // ── 1. Fetch creator by slug ────────────────────────────────────────
  const { creatorBySlug: creator, isLoadingCreatorBySlug } = useCreators({
    creatorSlug: username || undefined,
  });

  const creatorId = creator?._id || '';

  // ── 2. Follow state ─────────────────────────────────────────────────
  const { toggleFollow, checkFollow, isTogglingFollow } = useFollows();
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  useEffect(() => {
    if (!creatorId) return;
    setFollowersCount(creator?.followersCount || creator?.totalFollowers || 0);

    if (isAuthenticated && creatorId) {
      checkFollow({ targetType: 'creator', targetIds: [creatorId] })
        .then((result) => {
          if (result?.[creatorId]) setIsFollowing(true);
          else setIsFollowing(false);
        })
        .catch(() => {});
    }
  }, [creatorId, isAuthenticated]);

  const handleToggleFollow = useCallback(async () => {
    if (!creatorId) return;
    try {
      const result = await toggleFollow({ targetType: 'creator', targetId: creatorId });
      const followed = result?.followed ?? !isFollowing;
      setIsFollowing(followed);
      setFollowersCount(
        result?.totalFollowers ?? (followed ? followersCount + 1 : Math.max(0, followersCount - 1))
      );
    } catch {}
  }, [creatorId, toggleFollow, isFollowing, followersCount]);

  // ── 3. Fetch creator's listings ─────────────────────────────────────
  const { listings, listingsTotal, isLoadingListings, isFetchingListings, refetchListings } =
    useListings({
      fetchListings: !!creatorId,
      listingsParams: { creatorId },
    });

  // ── 4. Fetch reviews ────────────────────────────────────────────────
  const {
    reviews,
    reviewsTotal,
    isLoadingReviews,
    createReview,
    isCreatingReview,
    refetchReviews,
  } = useReviews({
    fetchReviews: !!creatorId,
    reviewsParams: { creatorId },
  });

  // ── 5. Fetch stores ─────────────────────────────────────────────────
  const { storesList: creatorStores, isLoadingStores: isLoadingCreatorStores } = useStores({
    fetchStores: !!creatorId,
    storesParams: { creatorId },
  });

  // ── Handlers ────────────────────────────────────────────────────────
  const handleLoadMoreListings = useCallback(
    (page: number) => {
      refetchListings?.({ creatorId, page, perPage: 10 });
    },
    [refetchListings, creatorId]
  );

  const handleLoadMoreReviews = useCallback(
    (page: number) => {
      refetchReviews?.({ creatorId, page, perPage: 10 });
    },
    [refetchReviews, creatorId]
  );

  const handleSubmitReview = useCallback(
    async (data: { rating: number; comment: string }) => {
      if (!creatorId) return;
      try {
        await createReview?.({ creatorId, rating: data.rating, comment: data.comment });
        refetchReviews?.();
      } catch {}
    },
    [createReview, refetchReviews, creatorId]
  );

  // ── Loading ─────────────────────────────────────────────────────────
  if (isLoadingCreatorBySlug) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-400">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  if (!creator && !isLoadingCreatorBySlug) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-2">
          <span className="text-2xl">🔍</span>
        </div>
        <p className="text-neutral-500 text-sm">Creator not found</p>
        <p className="text-neutral-400 text-xs">
          The creator @{username} doesn't exist or may have been removed.
        </p>
        <button
          onClick={() => router.push('/creators')}
          className="text-sm text-blue hover:text-blue font-medium mt-2"
        >
          Browse Creators
        </button>
      </div>
    );
  }

  return (
    <CreatorDetails
      creator={creator}
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
      creatorStores={creatorStores || []}
      isLoadingStores={isLoadingCreatorStores}
      onBack={() => router.back()}
      // Follow integration
      isFollowing={isFollowing}
      followersCount={followersCount}
      onToggleFollow={handleToggleFollow}
      isTogglingFollow={isTogglingFollow}
    />
  );
};

export default CreatorDetailPage;
