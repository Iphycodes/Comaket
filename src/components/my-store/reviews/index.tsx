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
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

const { TextArea } = Input;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface StoreReview {
  id: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number;
  comment: string;
  productName?: string;
  date: string;
  reply?: string;
  repliedAt?: string;
  deletionRequested?: boolean;
  deletionReason?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const mockReviews: StoreReview[] = [
  {
    id: 'r1',
    buyerName: 'Chidera Nwosu',
    rating: 5,
    comment:
      'Amazing product! The iPhone arrived in perfect condition. Delivery was fast and the seller was very responsive.',
    productName: 'iPhone 14 Pro Max',
    date: '2025-02-18T10:30:00Z',
    reply: 'Thank you so much, Chidera! We appreciate your kind words 🙏',
    repliedAt: '2025-02-18T12:00:00Z',
  },
  {
    id: 'r2',
    buyerName: 'Amaka Eze',
    rating: 4,
    comment:
      'Good quality product. Packaging could be a bit better but overall satisfied with my purchase.',
    productName: 'Samsung Galaxy S24',
    date: '2025-02-17T15:20:00Z',
  },
  {
    id: 'r3',
    buyerName: 'Tunde Bakare',
    rating: 5,
    comment: 'Best seller on Comaket! Always reliable and honest about product conditions.',
    date: '2025-02-16T09:00:00Z',
  },
  {
    id: 'r4',
    buyerName: 'Ngozi Okafor',
    rating: 3,
    comment:
      'Product was okay but took longer than expected to arrive. Communication could improve.',
    productName: 'AirPods Pro 2',
    date: '2025-02-15T18:45:00Z',
  },
  {
    id: 'r5',
    buyerName: 'Ibrahim Musa',
    rating: 1,
    comment: 'Terrible experience. Product was not as described. Complete waste of money.',
    productName: 'PS5 Console',
    date: '2025-02-14T11:30:00Z',
    deletionRequested: true,
    deletionReason: 'This review contains false claims. The buyer never purchased from our store.',
  },
  {
    id: 'r6',
    buyerName: 'Blessing Adeyemi',
    rating: 5,
    comment: 'Outstanding service! Will definitely buy again.',
    productName: 'MacBook Air M2',
    date: '2025-02-13T14:00:00Z',
    reply: 'Thank you Blessing! Looking forward to serving you again ❤️',
    repliedAt: '2025-02-13T15:30:00Z',
  },
  {
    id: 'r7',
    buyerName: 'Emeka Johnson',
    rating: 4,
    comment: 'Solid product, fair price. Seller was helpful when I had questions.',
    productName: 'iPhone 15 Pro',
    date: '2025-02-12T16:15:00Z',
  },
  {
    id: 'r8',
    buyerName: 'Fatima Hassan',
    rating: 2,
    comment: "Item arrived with minor scratches that weren't mentioned in the listing.",
    productName: 'iPad Air',
    date: '2025-02-11T10:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// STAR RATING COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star
        key={i}
        size={size}
        className={
          i < Math.floor(rating)
            ? 'text-amber-400 fill-amber-400'
            : 'text-gray-200 dark:text-gray-700'
        }
      />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// REVIEW CARD
// ═══════════════════════════════════════════════════════════════════════════

const ReviewCard: React.FC<{
  review: StoreReview;
  onReply: (review: StoreReview) => void;
  onRequestDelete: (review: StoreReview) => void;
}> = ({ review, onReply, onRequestDelete }) => {
  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50"
    >
      {/* Deletion flag */}
      {review.deletionRequested && (
        <div className="flex items-center gap-2 px-3 py-2 bg-amber-50 dark:bg-amber-900/10 rounded-lg mb-3 border border-amber-100 dark:border-amber-900/20">
          <Flag size={12} className="text-amber-500" />
          <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
            Deletion requested — under review
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
          <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
            <span className="text-xs font-bold text-gray-500">{review.buyerName.charAt(0)}</span>
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {review.buyerName}
            </span>
            <span className="text-[11px] text-gray-400 flex-shrink-0">
              {formatDate(review.date)}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <StarRating rating={review.rating} size={12} />
            {review.productName && (
              <>
                <span className="text-gray-300 dark:text-gray-600">·</span>
                <span className="text-[11px] text-gray-400 truncate">{review.productName}</span>
              </>
            )}
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
            {review.comment}
          </p>

          {/* Reply */}
          {review.reply && (
            <div className="mt-3 pl-3 border-l-2 border-indigo-200 dark:border-blue-800">
              <p className="text-xs font-semibold text-blue dark:text-blue mb-0.5">Your reply</p>
              <p className="text-xs text-gray-600 dark:text-gray-400">{review.reply}</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-2 mt-3">
            {!review.reply && (
              <button
                onClick={() => onReply(review)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-blue dark:text-blue bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-indigo-100 dark:hover:bg-blue-900/30 transition-colors"
              >
                <MessageCircle size={12} /> Reply
              </button>
            )}
            {!review.deletionRequested && (
              <button
                onClick={() => onRequestDelete(review)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-500 bg-gray-50 dark:bg-gray-700/50 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
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
// RATING BREAKDOWN
// ═══════════════════════════════════════════════════════════════════════════

const RatingBreakdown: React.FC<{ reviews: StoreReview[] }> = ({ reviews }) => {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.floor(r.rating) === star).length,
  }));
  const total = reviews.length;
  return (
    <div className="space-y-1.5">
      {counts.map(({ star, count }) => (
        <div key={star} className="flex items-center gap-2.5">
          <span className="text-xs text-gray-500 w-3 text-right">{star}</span>
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-[11px] text-gray-400 w-6 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface StoreReviewsProps {
  storeId: string;
}

const StoreReviews: React.FC<StoreReviewsProps> = ({}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [reviews, setReviews] = useState<StoreReview[]>(mockReviews);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);

  // Reply state
  const [replyTarget, setReplyTarget] = useState<StoreReview | null>(null);
  const [replyText, setReplyText] = useState('');
  const [isReplyOpen, setIsReplyOpen] = useState(false);

  // Delete request state
  const [deleteTarget, setDeleteTarget] = useState<StoreReview | null>(null);
  const [deleteReason, setDeleteReason] = useState('');
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // Computed
  const avgRating = useMemo(() => {
    if (reviews.length === 0) return 0;
    return Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10;
  }, [reviews]);

  const repliedCount = useMemo(() => reviews.filter((r) => r.reply).length, [reviews]);
  const responseRate = reviews.length > 0 ? Math.round((repliedCount / reviews.length) * 100) : 0;

  const filteredReviews = useMemo(() => {
    return reviews.filter((r) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !r.buyerName.toLowerCase().includes(q) &&
          !r.comment.toLowerCase().includes(q) &&
          !(r.productName || '').toLowerCase().includes(q)
        )
          return false;
      }
      if (filterRating && Math.floor(r.rating) !== filterRating) return false;
      if (filterType === 'replied' && !r.reply) return false;
      if (filterType === 'unreplied' && r.reply) return false;
      if (filterType === 'flagged' && !r.deletionRequested) return false;
      return true;
    });
  }, [reviews, searchQuery, filterRating, filterType]);

  // Handlers
  const handleReply = useCallback((review: StoreReview) => {
    setReplyTarget(review);
    setReplyText('');
    setIsReplyOpen(true);
  }, []);

  const handleSubmitReply = useCallback(() => {
    if (!replyTarget || !replyText.trim()) return;
    setReviews((prev) =>
      prev.map((r) =>
        r.id === replyTarget.id
          ? { ...r, reply: replyText.trim(), repliedAt: new Date().toISOString() }
          : r
      )
    );
    setIsReplyOpen(false);
    antMessage.success('Reply posted!');
  }, [replyTarget, replyText]);

  const handleRequestDelete = useCallback((review: StoreReview) => {
    setDeleteTarget(review);
    setDeleteReason('');
    setIsDeleteOpen(true);
  }, []);

  const handleSubmitDeleteRequest = useCallback(() => {
    if (!deleteTarget || !deleteReason.trim()) {
      antMessage.warning('Please provide a reason for the removal request');
      return;
    }
    setReviews((prev) =>
      prev.map((r) =>
        r.id === deleteTarget.id
          ? { ...r, deletionRequested: true, deletionReason: deleteReason.trim() }
          : r
      )
    );
    setIsDeleteOpen(false);
    antMessage.success('Removal request submitted. Our team will review it.');
  }, [deleteTarget, deleteReason]);

  // Metrics
  const metricCards = [
    {
      label: 'Average Rating',
      value: `${avgRating}`,
      icon: Star,
      iconColor: 'text-amber-500',
      iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Total Reviews',
      value: `${reviews.length}`,
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
            className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg ${m.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <m.icon size={16} className={m.iconColor} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{m.value}</p>
              <p className="text-[11px] text-gray-500">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-4'}`}>
        {/* Rating Breakdown */}
        <div className={`${isMobile ? '' : 'col-span-1'}`}>
          <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50 sticky top-4">
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{avgRating}</p>
              <StarRating rating={avgRating} size={16} />
              <p className="text-xs text-gray-400 mt-1">
                {reviews.length} review{reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
            <RatingBreakdown reviews={reviews} />
          </div>
        </div>

        {/* Reviews List */}
        <div className={`${isMobile ? '' : 'col-span-3'} space-y-4`}>
          {/* Filters */}
          <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'items-center'}`}>
            <div className="relative flex-1">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search reviews..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full ${
                  isMobile ? 'h-10' : 'h-11'
                } pl-10 pr-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all`}
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
          <div className="space-y-3">
            {filteredReviews.map((review) => (
              <ReviewCard
                key={review.id}
                review={review}
                onReply={handleReply}
                onRequestDelete={handleRequestDelete}
              />
            ))}
            {filteredReviews.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50">
                <Star size={32} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
                <p className="text-sm text-gray-400">No reviews match your filters</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Reply Modal */}
      <Modal
        open={isReplyOpen}
        onCancel={() => setIsReplyOpen(false)}
        title={<span className="text-base font-bold">Reply to {replyTarget?.buyerName}</span>}
        footer={null}
        width={isMobile ? '95%' : 480}
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <div className="space-y-4 pt-2">
          {replyTarget && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <div className="flex items-center gap-1 mb-1">
                <StarRating rating={replyTarget.rating} size={12} />
              </div>
              <p className="text-xs text-gray-600 dark:text-gray-400">
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
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitReply}
              disabled={!replyText.trim()}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                replyText.trim()
                  ? 'bg-gradient-to-r from-blue to-indigo-500 text-white shadow-md'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send size={14} /> Post Reply
            </button>
          </div>
        </div>
      </Modal>

      {/* Request Delete Modal */}
      <Modal
        open={isDeleteOpen}
        onCancel={() => setIsDeleteOpen(false)}
        title={
          <div className="flex items-center gap-2 text-base font-bold">
            <AlertTriangle size={18} className="text-amber-500" /> Request Review Removal
          </div>
        }
        footer={null}
        width={isMobile ? '95%' : 480}
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-500">
            Explain why this review should be removed. Our team will review your request within 48
            hours.
          </p>
          {deleteTarget && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
              <p className="text-xs font-semibold text-gray-500 mb-1">
                {deleteTarget.buyerName} · {deleteTarget.rating}★
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400">
                &quot;{deleteTarget.comment}&quot;
              </p>
            </div>
          )}
          <TextArea
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            placeholder="Reason for removal request..."
            rows={3}
            maxLength={500}
            showCount
            className="!rounded-xl resize-none"
          />
          <div className="flex gap-3">
            <button
              onClick={() => setIsDeleteOpen(false)}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitDeleteRequest}
              disabled={!deleteReason.trim()}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                deleteReason.trim()
                  ? 'bg-gradient-to-r from-red-500 to-rose-500 text-white shadow-md'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Flag size={14} /> Submit Request
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoreReviews;
