'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Input, Select, Modal, message as antMessage } from 'antd';
import { motion } from 'framer-motion';
import {
  Star,
  Flag,
  MessageCircle,
  Search,
  Send,
  TrendingUp,
  Award,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

const { TextArea } = Input;

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Comaket';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface TransformedReview {
  id: string;
  buyerName: string;
  buyerAvatar: string;
  rating: number;
  comment: string;
  productName: string;
  date: string;
  sellerReply: string | null;
  repliedAt: string | null;
  deletionRequested?: boolean;
  deletionReason?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const transformReview = (r: any): TransformedReview => {
  const buyer = typeof r.buyer === 'object' ? r.buyer : null;
  const listing = typeof r.listing === 'object' ? r.listing : null;
  return {
    id: r._id || r.id || '',
    buyerName: buyer
      ? `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim()
      : r.buyerName || 'Anonymous',
    buyerAvatar: buyer?.avatar || r.buyerAvatar || '',
    rating: r.rating || 0,
    comment: r.comment || r.review || '',
    productName: listing?.itemName || r.productName || '',
    date: r.createdAt || r.date || '',
    sellerReply: r.sellerReply?.comment || r.sellerReply || null,
    repliedAt: r.sellerReply?.createdAt || r.repliedAt || null,
    deletionRequested: r.deletionRequested || r.flagged || false,
    deletionReason: r.deletionReason || r.flagReason || '',
  };
};

const getRatingLabel = (rating: number): string => {
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 3.5) return 'Very Good';
  if (rating >= 2.5) return 'Good';
  if (rating >= 1.5) return 'Fair';
  return 'Poor';
};

// ═══════════════════════════════════════════════════════════════════════════
// STAR RATING
// ═══════════════════════════════════════════════════════════════════════════

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => {
  const full = Math.floor(rating);
  const hasHalf = rating - full >= 0.3;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < full
              ? 'text-amber-400 fill-amber-400'
              : i === full && hasHalf
                ? 'text-amber-400 fill-amber-400/50'
                : 'text-neutral-200 dark:text-neutral-700'
          }
        />
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// RATING BREAKDOWN
// ═══════════════════════════════════════════════════════════════════════════

const RatingBreakdown: React.FC<{ reviews: TransformedReview[] }> = ({ reviews }) => {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.floor(r.rating) === star).length,
  }));
  const total = reviews.length;
  return (
    <div className="space-y-1.5">
      {counts.map(({ star, count }) => (
        <div key={star} className="flex items-center gap-2.5">
          <span className="text-xs text-neutral-500 w-3 text-right">{star}</span>
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <div className="flex-1 h-2 bg-neutral-100 dark:bg-neutral-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-[11px] text-neutral-400 w-6 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// REVIEW CARD
// ═══════════════════════════════════════════════════════════════════════════

const ReviewCard: React.FC<{
  review: TransformedReview;
  onReply: (review: TransformedReview) => void;
  onRequestRemoval: (review: TransformedReview) => void;
  index: number;
}> = ({ review, onReply, onRequestRemoval, index }) => {
  const formatDate = (d: string) =>
    d
      ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' })
      : '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50"
    >
      {/* Deletion flag */}
      {review.deletionRequested && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg mb-3 border border-amber-100 dark:border-amber-900/20">
          <Flag size={12} className="text-amber-500" />
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Removal requested — under review
          </span>
        </div>
      )}

      <div className="flex items-start gap-3">
        {review.buyerAvatar ? (
          <img
            src={review.buyerAvatar}
            alt=""
            className="w-9 h-9 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-neutral-500">{review.buyerName.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {review.buyerName}
            </span>
            <span className="text-[11px] text-neutral-400 flex-shrink-0">
              {formatDate(review.date)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} size={12} />
            {review.productName && (
              <>
                <span className="text-neutral-300 dark:text-neutral-600">·</span>
                <span className="text-[11px] text-neutral-400 truncate">{review.productName}</span>
              </>
            )}
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
            {review.comment}
          </p>

          {/* Seller Reply */}
          {review.sellerReply && (
            <div className="mt-3 pl-3 border-l-2 border-indigo-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue dark:text-blue mb-0.5">Your reply</p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">{review.sellerReply}</p>
              {review.repliedAt && (
                <p className="text-[10px] text-neutral-400 mt-1">{formatDate(review.repliedAt)}</p>
              )}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {!review.sellerReply && (
              <button
                onClick={() => onReply(review)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue dark:text-blue bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <MessageCircle size={12} /> Reply
              </button>
            )}
            {!review.deletionRequested && (
              <button
                onClick={() => onRequestRemoval(review)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-neutral-500 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
              >
                <Flag size={12} /> Request Removal
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON
// ═══════════════════════════════════════════════════════════════════════════

const ReviewSkeleton: React.FC = () => (
  <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50 animate-pulse">
    <div className="flex items-start gap-3">
      <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <div className="h-3.5 bg-neutral-200 dark:bg-neutral-700 rounded w-28" />
          <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-16" />
        </div>
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-24" />
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-full" />
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
      </div>
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface StoreReviewsProps {
  storeId: string;
  reviews: any[];
  reviewsTotal: number;
  isLoading: boolean;
  onSellerReply: (reviewId: string, data: { comment: string }) => Promise<void>;
  isReplying: boolean;
  onLoadMore: (page: number) => void;
  onRefresh: () => void;
}

const StoreReviews: React.FC<StoreReviewsProps> = ({
  reviews: rawReviews,
  reviewsTotal,
  isLoading,
  onSellerReply,
  isReplying,
  onLoadMore,
  onRefresh,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  // ── Transform reviews ───────────────────────────────────────────────
  const reviews = useMemo(() => rawReviews.map(transformReview), [rawReviews]);

  // ── Local filter state (client-side on loaded data) ─────────────────
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  // ── Reply state ─────────────────────────────────────────────────────
  const [replyTarget, setReplyTarget] = useState<TransformedReview | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  // ── Removal request state ───────────────────────────────────────────
  const [removeTarget, setRemoveTarget] = useState<TransformedReview | null>(null);
  const [removeReason, setRemoveReason] = useState('');
  const [isRemoveOpen, setIsRemoveOpen] = useState(false);
  const [isSubmittingRemoval, setIsSubmittingRemoval] = useState(false);

  // ── Computed metrics ────────────────────────────────────────────────
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  }, [reviews]);

  const repliedCount = useMemo(() => reviews.filter((r) => r.sellerReply).length, [reviews]);
  const responseRate = reviews.length > 0 ? Math.round((repliedCount / reviews.length) * 100) : 0;

  // ── Filter ──────────────────────────────────────────────────────────
  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !r.buyerName.toLowerCase().includes(q) &&
          !r.comment.toLowerCase().includes(q) &&
          !r.productName.toLowerCase().includes(q)
        )
          return false;
      }
      if (filterRating && Math.floor(r.rating) !== filterRating) return false;
      if (filterType === 'replied' && !r.sellerReply) return false;
      if (filterType === 'unreplied' && r.sellerReply) return false;
      if (filterType === 'flagged' && !r.deletionRequested) return false;
      return true;
    });
  }, [reviews, searchQuery, filterRating, filterType]);

  // ── Handlers ────────────────────────────────────────────────────────

  const handleOpenReply = useCallback((review: TransformedReview) => {
    setReplyTarget(review);
    setReplyText('');
    setIsReplyOpen(true);
  }, []);

  const handleSubmitReply = useCallback(async () => {
    if (!replyTarget || !replyText.trim()) return;
    try {
      await onSellerReply(replyTarget.id, { comment: replyText.trim() });
      setIsReplyOpen(false);
      antMessage.success('Reply posted!');
    } catch {
      antMessage.error('Failed to post reply');
    }
  }, [replyTarget, replyText, onSellerReply]);

  const handleOpenRemoval = useCallback((review: TransformedReview) => {
    setRemoveTarget(review);
    setRemoveReason('');
    setIsRemoveOpen(true);
  }, []);

  const handleSubmitRemoval = useCallback(async () => {
    if (!removeTarget || !removeReason.trim()) {
      antMessage.warning('Please provide a reason for the removal request');
      return;
    }
    setIsSubmittingRemoval(true);
    try {
      // TODO: Wire to backend endpoint when available
      // await requestReviewRemoval(removeTarget.id, { reason: removeReason.trim() });
      antMessage.success('Removal request submitted. Our team will review it within 48 hours.');
      setIsRemoveOpen(false);
      onRefresh();
    } catch {
      antMessage.error('Failed to submit removal request');
    } finally {
      setIsSubmittingRemoval(false);
    }
  }, [removeTarget, removeReason, onRefresh]);

  // ── Metrics ─────────────────────────────────────────────────────────
  const metricCards = [
    {
      label: 'Average Rating',
      value: avgRating > 0 ? `${avgRating}` : '—',
      icon: Star,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Total Reviews',
      value: `${reviewsTotal}`,
      icon: MessageCircle,
      iconColor: 'text-blue',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Response Rate',
      value: `${responseRate}%`,
      icon: TrendingUp,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      label: '5-Star Reviews',
      value: `${reviews.filter((r) => r.rating === 5).length}`,
      icon: Award,
      iconColor: 'text-violet-600',
      iconBg: 'bg-violet-50 dark:bg-violet-900/20',
    },
  ];

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {metricCards.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-neutral-800/60 rounded-xl p-4 border border-neutral-100 dark:border-neutral-700/50 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg ${m.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <m.icon size={16} className={m.iconColor} />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{m.value}</p>
              <p className="text-[11px] text-neutral-500">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
        {/* Rating Breakdown — sidebar */}
        <div className={`${isMobile ? '' : 'col-span-1'}`}>
          <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50 sticky top-4">
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-neutral-900 dark:text-white">
                {avgRating > 0 ? avgRating : '—'}
              </p>
              {avgRating > 0 && <StarRating rating={avgRating} size={16} />}
              <p className="text-xs text-neutral-400 mt-1.5">
                {getRatingLabel(avgRating)} · {reviewsTotal} review{reviewsTotal !== 1 ? 's' : ''}
              </p>
            </div>
            {reviews.length > 0 && <RatingBreakdown reviews={reviews} />}
          </div>
        </div>

        {/* Reviews List */}
        <div className={`${isMobile ? '' : 'col-span-3'} space-y-4`}>
          {/* Filters */}
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'items-center'}`}>
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
              />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${
                  isMobile ? 'h-10' : 'h-11'
                } pl-10 pr-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all`}
              />
            </div>
            <div className="flex gap-2">
              <Select
                allowClear
                placeholder="Rating"
                value={filterRating}
                onChange={(v) => setFilterRating(v || null)}
                options={[5, 4, 3, 2, 1].map((r) => ({ label: `${r} Star`, value: r }))}
                className={`${
                  isMobile ? 'flex-1' : 'w-[120px]'
                } h-10 [&_.ant-select-selector]:!rounded-lg`}
              />
              <Select
                allowClear
                placeholder="Type"
                value={filterType}
                onChange={(v) => setFilterType(v || null)}
                options={[
                  { label: 'Replied', value: 'replied' },
                  { label: 'Unreplied', value: 'unreplied' },
                  { label: 'Flagged', value: 'flagged' },
                ]}
                className={`${
                  isMobile ? 'flex-1' : 'w-[130px]'
                } h-10 [&_.ant-select-selector]:!rounded-lg`}
              />
            </div>
          </div>

          {/* Review Cards */}
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <ReviewSkeleton key={i} />
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <div className="text-center py-16 bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50">
              <Star size={32} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-3" />
              <p className="text-sm text-neutral-500">
                {searchQuery || filterRating || filterType
                  ? 'No reviews match your filters'
                  : 'No reviews yet'}
              </p>
              {(searchQuery || filterRating || filterType) && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setFilterRating(null);
                    setFilterType(null);
                  }}
                  className="text-xs text-blue hover:underline mt-1"
                >
                  Clear filters
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((review, i) => (
                <ReviewCard
                  key={review.id}
                  review={review}
                  index={i}
                  onReply={handleOpenReply}
                  onRequestRemoval={handleOpenRemoval}
                />
              ))}

              {/* Load more */}
              {reviews.length < reviewsTotal && (
                <button
                  onClick={() => onLoadMore(Math.floor(reviews.length / 20) + 1)}
                  className="w-full py-3 text-sm font-medium text-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-colors"
                >
                  Load More Reviews
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Reply Modal ── */}
      <Modal
        open={isReplyOpen}
        onCancel={() => setIsReplyOpen(false)}
        title={<span className="text-base font-bold">Reply to {replyTarget?.buyerName}</span>}
        footer={null}
        width={isMobile ? '95%' : 480}
        rootClassName="modal-with-backdrop"
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <div className="space-y-4 pt-2">
          {replyTarget && (
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
              <div className="flex items-center gap-1 mb-1">
                <StarRating rating={replyTarget.rating} size={12} />
              </div>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                &quot;{replyTarget.comment}&quot;
              </p>
            </div>
          )}
          <TextArea
            value={replyText}
            onChange={(e) => setReplyText(e.target.value)}
            placeholder="Write your reply..."
            rows={3}
            maxLength={500}
            showCount
            className="!rounded-xl resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setIsReplyOpen(false)}
              className="flex-1 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReply}
              disabled={!replyText.trim() || isReplying}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                replyText.trim() && !isReplying
                  ? 'bg-gradient-to-r from-blue to-indigo-500 text-white shadow-md'
                  : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {isReplying ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
              {isReplying ? 'Posting...' : 'Post Reply'}
            </button>
          </div>
        </div>
      </Modal>

      {/* ── Request Removal Modal ── */}
      <Modal
        open={isRemoveOpen}
        onCancel={() => setIsRemoveOpen(false)}
        title={
          <div className="flex items-center gap-2 text-base font-bold">
            <AlertTriangle size={18} className="text-amber-500" /> Request Review Removal
          </div>
        }
        footer={null}
        width={isMobile ? '95%' : 480}
        rootClassName="modal-with-backdrop"
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-neutral-500">
            Explain why this review should be removed. The {APP_NAME} team will review your request
            within 48 hours.
          </p>
          {removeTarget && (
            <div className="bg-neutral-50 dark:bg-neutral-800 rounded-xl p-3">
              <p className="text-xs font-semibold text-neutral-500 mb-1">
                {removeTarget.buyerName} · {removeTarget.rating}★
              </p>
              <p className="text-xs text-neutral-600 dark:text-neutral-400">
                &quot;{removeTarget.comment}&quot;
              </p>
            </div>
          )}
          <TextArea
            value={removeReason}
            onChange={(e) => setRemoveReason(e.target.value)}
            placeholder="Reason for removal request..."
            rows={3}
            maxLength={500}
            showCount
            className="!rounded-xl resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setIsRemoveOpen(false)}
              className="flex-1 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitRemoval}
              disabled={!removeReason.trim() || isSubmittingRemoval}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                removeReason.trim() && !isSubmittingRemoval
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {isSubmittingRemoval ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Flag size={14} />
              )}
              {isSubmittingRemoval ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoreReviews;
