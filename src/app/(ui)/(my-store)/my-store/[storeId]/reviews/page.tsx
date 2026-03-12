'use client';

import React, { useEffect, useCallback } from 'react';
import { useParams } from 'next/navigation';
import { useStoreBadge } from '@grc/components/my-store/context/store-badge-context';
import { useReviews } from '@grc/hooks/useReviews';
import StoreReviews from '@grc/components/my-store/reviews';

export default function StoreReviewsPage() {
  const params = useParams();
  const storeId = (params?.storeId as string) || '';

  const { clearBadge } = useStoreBadge();
  useEffect(() => {
    clearBadge('reviews');
  }, []);

  const {
    reviews,
    reviewsTotal,
    isLoadingReviews,
    sellerReply,
    isReplyingToReview,
    refetchReviews,
  } = useReviews({
    fetchReviews: !!storeId,
    reviewsParams: { storeId },
  });

  const handleSellerReply = useCallback(
    async (reviewId: string, data: { comment: string }) => {
      try {
        await sellerReply(reviewId, { sellerReply: data?.comment });
        refetchReviews?.({ storeId });
      } catch {}
    },
    [sellerReply, refetchReviews, storeId]
  );

  const handleLoadMoreReviews = useCallback(
    (page: number) => {
      refetchReviews?.({ storeId, page, perPage: 20 });
    },
    [refetchReviews, storeId]
  );

  return (
    <StoreReviews
      storeId={storeId}
      reviews={reviews || []}
      reviewsTotal={reviewsTotal || 0}
      isLoading={isLoadingReviews}
      onSellerReply={handleSellerReply}
      isReplying={isReplyingToReview}
      onLoadMore={handleLoadMoreReviews}
      onRefresh={() => refetchReviews?.({ storeId })}
    />
  );
}
