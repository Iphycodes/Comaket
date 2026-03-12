'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { getRatingLabel } from '@grc/_shared/namespace/vendor';
import { StarRating, RatingBreakdown, ReviewCard, TabLoadingSkeleton } from './profile-helpers';
import type { VendorReview } from '@grc/_shared/namespace/vendor';

interface ProfileReviewsTabProps {
  reviews: VendorReview[];
  reviewsTotal: number;
  computedRating: number;
  isLoading: boolean;
  isMobile: boolean;
  onLoadMore?: (page: number) => void;
}

const ProfileReviewsTab: React.FC<ProfileReviewsTabProps> = ({
  reviews,
  reviewsTotal,
  computedRating,
  isLoading,
  isMobile,
  onLoadMore,
}) => {
  if (isLoading) return <TabLoadingSkeleton />;

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl">
        <Star size={36} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-3" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No reviews yet</p>
        <p className="text-xs text-neutral-400 mt-1">
          Reviews from buyers will appear here once you start selling.
        </p>
      </div>
    );
  }

  return (
    <div className={`${isMobile ? '' : 'grid grid-cols-3 gap-6'}`}>
      <div className="col-span-1 mb-6 sm:mb-0">
        <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50 sticky top-4">
          <div className="text-center mb-4">
            <p className="text-4xl font-bold text-neutral-900 dark:text-white">{computedRating}</p>
            <StarRating rating={computedRating} size={16} />
            <p className="text-xs text-neutral-400 mt-1.5">
              {getRatingLabel(computedRating)} · {reviewsTotal} review
              {reviewsTotal !== 1 ? 's' : ''}
            </p>
          </div>
          <RatingBreakdown reviews={reviews} />
        </div>
      </div>
      <div className="col-span-2 space-y-3">
        {reviews.map((review, i) => (
          <ReviewCard key={review.id} review={review} index={i} />
        ))}

        {reviews.length < reviewsTotal && onLoadMore && (
          <button
            onClick={() => onLoadMore(Math.floor(reviews.length / 20) + 1)}
            className="w-full py-3 text-sm font-medium text-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-colors"
          >
            Load More Reviews
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileReviewsTab;
