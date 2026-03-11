'use client';

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { Tabs, Tooltip, Rate, Input, message as antMessage } from 'antd';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Star,
  Package,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Users,
  Award,
  Calendar,
  Sparkles,
  ExternalLink,
  UserPlus,
  UserCheck,
  Send,
  Store,
  ChevronDown,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { formatJoinDate, getRatingLabel, VendorReview } from '@grc/_shared/namespace/vendor';
import { useRouter } from 'next/navigation';
import FeaturedWorks from '@grc/components/apps/featured-works';
import CreatorDetailsProductsTab from '@grc/components/apps/creator-details/lib/creator-details-products-tab';
import FollowersModal from '@grc/components/apps/followers-modal';

const { TextArea } = Input;

// ═══════════════════════════════════════════════════════════════════════════
// SHARED HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const INDUSTRY_LABELS: Record<string, string> = {
  fashion: 'Fashion & Apparel',
  electronics: 'Electronics & Gadgets',
  art: 'Art & Handmade',
  food: 'Food & Beverages',
  beauty: 'Beauty & Skincare',
  home: 'Home & Living',
  sports: 'Sports & Fitness',
  books: 'Books & Stationery',
  automotive: 'Automotive',
  agriculture: 'Agriculture',
  health: 'Health & Wellness',
  education: 'Education',
  photography: 'Photography',
  crafts: 'Crafts & DIY',
  jewelry: 'Jewelry & Accessories',
  vintage: 'Vintage & Antiques',
  services: 'Services',
  other: 'Other',
};

const getIndustryLabel = (key: string): string =>
  INDUSTRY_LABELS[key] || key.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const PLAN_LABELS: Record<string, { label: string; bg: string; color: string }> = {
  starter: {
    label: 'Starter',
    bg: 'bg-neutral-100 dark:bg-neutral-700',
    color: 'text-neutral-600 dark:text-neutral-300',
  },
  growth: {
    label: 'Growth',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    color: 'text-blue dark:text-indigo-300',
  },
  pro: {
    label: 'Pro',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
    color: 'text-purple-600 dark:text-purple-300',
  },
  enterprise: {
    label: 'Enterprise',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    color: 'text-amber-600 dark:text-amber-300',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// SUB-COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

const VerifiedBadge: React.FC<{ isSuper?: boolean }> = ({ isSuper = false }) => (
  <i
    className={`ri-verified-badge-fill ${
      isSuper ? 'text-[#D4A017]' : 'text-[#1D9BF0]'
    } text-[20px]`}
  />
);

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < fullStars
              ? 'text-amber-400 fill-amber-400'
              : i === fullStars && hasHalf
                ? 'text-amber-400 fill-amber-400/50'
                : 'text-neutral-200 dark:text-neutral-700'
          }
        />
      ))}
    </div>
  );
};

const ReviewCard: React.FC<{ review: VendorReview; index: number }> = ({ review, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white dark:bg-neutral-800/60 rounded-xl p-4 border border-neutral-100 dark:border-neutral-700/50"
  >
    <div className="flex items-start gap-3">
      {review.buyerAvatar ? (
        <img
          src={review.buyerAvatar}
          alt={review.buyerName}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-neutral-500 dark:text-neutral-400">
            {review.buyerName.charAt(0)}
          </span>
        </div>
      )}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            {review.buyerName}
          </span>
          <span className="text-[11px] text-neutral-400 flex-shrink-0">
            {new Date(review.date).toLocaleDateString('en-NG', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
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
      </div>
    </div>
  </motion.div>
);

const RatingBreakdown: React.FC<{ reviews: VendorReview[] }> = ({ reviews }) => {
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

const WriteReviewForm: React.FC<{
  onSubmit: (review: { rating: number; comment: string }) => void;
  isSubmitting?: boolean;
}> = ({ onSubmit, isSubmitting: externalSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const handleSubmit = () => {
    if (rating === 0) {
      antMessage.warning('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      antMessage.warning('Please write a comment');
      return;
    }
    onSubmit({ rating, comment: comment.trim() });
    setRating(0);
    setComment('');
  };
  const isDisabled = externalSubmitting || rating === 0 || !comment.trim();
  return (
    <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
      <h4 className="text-sm font-semibold text-neutral-900 dark:text-white mb-4">
        Write a Review
      </h4>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">
            Your Rating
          </label>
          <Rate
            value={rating}
            onChange={setRating}
            className="text-amber-400 [&_.ant-rate-star]:!mr-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">
            Your Experience
          </label>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this creator..."
            rows={3}
            maxLength={500}
            showCount
            className="!rounded-lg resize-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isDisabled}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isDisabled
              ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
          }`}
        >
          {externalSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {externalSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

// ─── Stores Dropdown ──────────────────────────────────────────────────

interface StoreItem {
  _id: string;
  id?: string;
  name: string;
  slug?: string;
  logo?: string | null;
  status?: string;
  rating?: number;
  totalListings?: number;
  category?: string;
  [key: string]: any;
}

const CreatorStoresDropdown: React.FC<{ stores: StoreItem[]; isMobile: boolean }> = ({
  stores,
  isMobile,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);
  const activeStores = stores.filter((s) => s.status !== 'suspended' && s.status !== 'deleted');
  if (activeStores.length === 0) return null;
  const handleStoreClick = (store: StoreItem) => {
    router.push(`/stores/${store._id || store.id}`);
    setOpen(false);
  };
  const statusDot = (status?: string) =>
    status === 'active'
      ? 'bg-emerald-400'
      : status === 'pending'
        ? 'bg-amber-400'
        : 'bg-neutral-300';

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center rounded-xl text-sm font-semibold bg-gradient-to-r from-blue/5 to-indigo-500/5 dark:from-blue/10 dark:to-indigo-500/10 border border-blue/20 dark:border-blue/30 text-blue hover:bg-blue/10 dark:hover:bg-blue/20 transition-all ${
          isMobile ? 'gap-1 px-3 py-1.5' : 'gap-1.5 px-4 py-2.5'
        }`}
      >
        <Store size={15} />
        <span>Stores ({activeStores.length})</span>
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden ${
            isMobile ? 'right-0 w-64' : 'right-0 w-72'
          }`}
          style={{ animation: 'fadeInDown 0.15s ease-out' }}
        >
          <div className="px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-700/50">
            <p className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              Creator Stores
            </p>
          </div>
          <div className="max-h-64 overflow-y-auto py-1">
            {activeStores.map((store) => (
              <button
                key={store._id}
                onClick={() => handleStoreClick(store)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors group text-left"
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                  {store.logo ? (
                    <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: getRandomColorByString(store.name || 'Store') }}
                    >
                      {getFirstCharacter(store.name || 'S')}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-blue transition-colors">
                      {store.name}
                    </p>
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(
                        store.status
                      )}`}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {store.category && (
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500 truncate">
                        {store.category}
                      </span>
                    )}
                    {store.rating != null && store.rating > 0 && (
                      <span className="flex items-center gap-0.5 text-[11px] text-amber-500">
                        <Star size={10} className="fill-amber-500" />
                        {store.rating}
                      </span>
                    )}
                    {store.totalListings != null && store.totalListings > 0 && (
                      <span className="text-[11px] text-neutral-400">
                        {store.totalListings} items
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  size={15}
                  className="text-neutral-300 dark:text-neutral-600 group-hover:text-blue group-hover:translate-x-0.5 transition-all flex-shrink-0"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const TabLoadingSkeleton: React.FC = () => (
  <div className="space-y-4">
    {Array.from({ length: 3 }).map((_, i) => (
      <div key={i} className="bg-neutral-100 dark:bg-neutral-800 rounded-xl h-24 animate-pulse" />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface CreatorDetailsProps {
  creator: any;
  listings: any[];
  listingsTotal: number;
  isLoadingListings: boolean;
  isFetchingListings?: boolean;
  onLoadMoreListings?: (page: number) => void;
  reviews: any[];
  reviewsTotal: number;
  isLoadingReviews: boolean;
  onSubmitReview?: (data: { rating: number; comment: string }) => void;
  isSubmittingReview?: boolean;
  onLoadMoreReviews?: (page: number) => void;
  creatorStores: StoreItem[];
  isLoadingStores?: boolean;
  onBack: () => void;
  // Follow integration
  isFollowing?: boolean;
  followersCount?: number;
  onToggleFollow?: () => void;
  isTogglingFollow?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const CreatorDetails: React.FC<CreatorDetailsProps> = ({
  creator,
  listings,
  listingsTotal,
  isLoadingListings,
  isFetchingListings,
  onLoadMoreListings,
  reviews,
  reviewsTotal,
  isLoadingReviews,
  onSubmitReview,
  isSubmittingReview,
  onLoadMoreReviews,
  creatorStores,
  isLoadingStores: _isLoadingStores,
  onBack,
  isFollowing = false,
  followersCount = 0,
  onToggleFollow,
  isTogglingFollow,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [showFollowers, setShowFollowers] = useState(false);

  // ── Derived creator data ────────────────────────────────────────────
  const firstName = creator?.userId?.firstName || '';
  const lastName = creator?.userId?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Creator';
  const avatarUrl = creator?.profileImageUrl || creator?.userId?.avatar || '';
  const coverImageUrl = creator?.coverImage || '';
  const username = creator?.username || '';
  const bio = creator?.bio || '';
  const isVerified = creator?.isVerified || false;
  const plan = creator?.plan || 'starter';
  const planConfig = PLAN_LABELS[plan] || PLAN_LABELS.starter;
  const industries = creator?.industries || [];
  const phoneNumber = creator?.phoneNumber || '';
  const whatsappNumber = creator?.whatsappNumber || '';
  const contactEmail = creator?.contactEmail || '';
  const website = creator?.website || '';
  const socialLinks = creator?.socialLinks;
  const totalListings = listingsTotal || 0;
  const totalSales = creator?.totalSales || 0;
  const joinedDate = creator?.createdAt || '';
  const locationStr = [creator?.location?.city, creator?.location?.state]
    .filter(Boolean)
    .join(', ');

  const vendorReviews: VendorReview[] = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    return reviews.map((r: any) => ({
      id: r._id || r.id || '',
      buyerName:
        typeof r.buyer === 'object'
          ? `${r.buyer?.firstName || ''} ${r.buyer?.lastName || ''}`.trim()
          : r.buyerName || 'Anonymous',
      buyerAvatar: typeof r.buyer === 'object' ? r.buyer?.avatar || '' : r.buyerAvatar || '',
      rating: r.rating || 0,
      comment: r.comment || r.review || '',
      date: r.createdAt || r.date || '',
      productName: typeof r.listing === 'object' ? r.listing?.itemName || '' : r.productName || '',
    }));
  }, [reviews]);

  const computedRating = useMemo(() => {
    if (vendorReviews.length === 0) return creator?.rating || 0;
    const sum = vendorReviews.reduce((s, r) => s + r.rating, 0);
    return Math.round((sum / vendorReviews.length) * 10) / 10;
  }, [vendorReviews, creator?.rating]);

  const handleWhatsApp = () => {
    const num = whatsappNumber || phoneNumber;
    if (!num) {
      antMessage.warning('WhatsApp number not available');
      return;
    }
    const message = `Hi ${fullName},\nI found your profile on Comaket and I'm interested in your work.`;
    window.open(`https://wa.me/${num}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleCall = () => {
    if (!phoneNumber) {
      antMessage.warning('Phone number not available');
      return;
    }
    window.open(`tel:+${phoneNumber}`, '_self');
  };

  const handleReviewSubmit = (review: { rating: number; comment: string }) => {
    if (onSubmitReview) onSubmitReview(review);
    else antMessage.success('Review submitted!');
  };

  const tabItems = [
    {
      key: 'featured',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="Featured Works">
              <Sparkles size={20} />
            </Tooltip>
          ) : (
            <>
              <Sparkles size={15} />
              <span>Featured Works</span>
            </>
          )}
        </span>
      ),
      children: (
        <FeaturedWorks ownerType="creator" ownerId={creator?._id ?? ''} isOwnProfile={false} />
      ),
    },
    {
      key: 'products',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="Products">
              <Package size={20} />
            </Tooltip>
          ) : (
            <>
              <Package size={15} />
              <span>Products</span>
            </>
          )}
        </span>
      ),
      children: (
        <CreatorDetailsProductsTab
          listings={listings}
          listingsTotal={listingsTotal}
          isLoading={isLoadingListings}
          isFetching={isFetchingListings}
          isMobile={isMobile}
          onLoadMore={onLoadMoreListings}
          creatorName={fullName}
          creatorWhatsApp={whatsappNumber || phoneNumber}
        />
      ),
    },
    {
      key: 'reviews',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="Reviews">
              <Star size={20} />
            </Tooltip>
          ) : (
            <>
              <Star size={15} />
              <span>Reviews</span>
            </>
          )}
        </span>
      ),
      children: (
        <div className={isMobile ? 'px-4' : ''}>
          <div className="space-y-6">
            <WriteReviewForm onSubmit={handleReviewSubmit} isSubmitting={isSubmittingReview} />
            {isLoadingReviews ? (
              <TabLoadingSkeleton />
            ) : vendorReviews.length > 0 ? (
              <div className={`${isMobile ? '' : 'grid grid-cols-3 gap-6'}`}>
                <div className="col-span-1 mb-6 sm:mb-0">
                  <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50 sticky top-4">
                    <div className="text-center mb-4">
                      <p className="text-4xl font-bold text-neutral-900 dark:text-white">
                        {computedRating}
                      </p>
                      <StarRating rating={computedRating} size={16} />
                      <p className="text-xs text-neutral-400 mt-1.5">
                        {getRatingLabel(computedRating)} · {reviewsTotal} review
                        {reviewsTotal !== 1 ? 's' : ''}
                      </p>
                    </div>
                    <RatingBreakdown reviews={vendorReviews} />
                  </div>
                </div>
                <div className="col-span-2 space-y-3">
                  {vendorReviews.map((review, i) => (
                    <ReviewCard key={review.id} review={review} index={i} />
                  ))}
                  {vendorReviews.length < reviewsTotal && onLoadMoreReviews && (
                    <button
                      onClick={() => onLoadMoreReviews(Math.floor(vendorReviews.length / 20) + 1)}
                      className="w-full py-3 text-sm font-medium text-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-colors"
                    >
                      Load More Reviews
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-12 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl">
                <Star size={36} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-3" />
                <p className="text-sm text-neutral-500 dark:text-neutral-400">
                  No reviews yet — be the first!
                </p>
              </div>
            )}
          </div>
        </div>
      ),
    },
    {
      key: 'about',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="About">
              <Users size={20} />
            </Tooltip>
          ) : (
            <>
              <Users size={15} />
              <span>About</span>
            </>
          )}
        </span>
      ),
      children: (
        <div className={isMobile ? 'px-4' : ''}>
          <div className="space-y-5">
            <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                About @{username}
              </h3>
              {bio ? (
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {bio}
                </p>
              ) : (
                <p className="text-sm text-neutral-400 italic">No bio provided.</p>
              )}
            </div>
            {industries.length > 0 && (
              <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Industries
                </h3>
                <div className="flex flex-wrap gap-2">
                  {industries.map((ind: string) => (
                    <span
                      key={ind}
                      className="px-3 py-1.5 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg text-sm font-medium text-neutral-600 dark:text-neutral-300"
                    >
                      {getIndustryLabel(ind)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                Creator Plan
              </h3>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${planConfig.bg} ${planConfig.color}`}
                >
                  {planConfig.label}
                </span>
                {totalSales > 0 && (
                  <span className="text-sm text-neutral-500">
                    {totalSales} sale{totalSales !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
            </div>
            {(phoneNumber || whatsappNumber || contactEmail || website) && (
              <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Contact Info
                </h3>
                <div className="space-y-2.5">
                  {phoneNumber && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-neutral-400" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {phoneNumber}
                      </span>
                    </div>
                  )}
                  {whatsappNumber && (
                    <div className="flex items-center gap-2">
                      <MessageCircle size={14} className="text-neutral-400" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        WhatsApp: {whatsappNumber}
                      </span>
                    </div>
                  )}
                  {contactEmail && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-neutral-400" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {contactEmail}
                      </span>
                    </div>
                  )}
                  {website && (
                    <div className="flex items-center gap-2">
                      <Globe size={14} className="text-neutral-400" />
                      <a
                        href={website.startsWith('http') ? website : `https://${website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm text-blue hover:underline flex items-center gap-1"
                      >
                        {website.replace(/^https?:\/\//, '')}
                        <ExternalLink size={12} />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            {(socialLinks?.instagram || socialLinks?.twitter || socialLinks?.tiktok) && (
              <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Social Links
                </h3>
                <div className="flex flex-wrap gap-3">
                  {socialLinks?.instagram && (
                    <a
                      href={`https://instagram.com/${socialLinks.instagram}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-sm font-medium text-purple-700 dark:text-purple-300 hover:shadow-sm transition-all"
                    >
                      <i className="ri-instagram-line text-base" />@{socialLinks.instagram}
                    </a>
                  )}
                  {socialLinks?.twitter && (
                    <a
                      href={`https://x.com/${socialLinks.twitter}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:shadow-sm transition-all"
                    >
                      <i className="ri-twitter-x-line text-base" />@{socialLinks.twitter}
                    </a>
                  )}
                  {socialLinks?.tiktok && (
                    <a
                      href={`https://tiktok.com/@${socialLinks.tiktok}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:shadow-sm transition-all"
                    >
                      <i className="ri-tiktok-line text-base" />@{socialLinks.tiktok}
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      ),
    },
  ];

  return (
    <div
      className={`dark:bg-neutral-900/50 min-h-screen ${
        isMobile ? 'max-w-[100vw] mb-14 pt-8' : ''
      }`}
    >
      <div className={`w-full ${!isMobile ? 'w-full mx-auto px-4' : ''}`}>
        {/* Cover */}
        <div className="relative h-44 sm:h-56 bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden sm:rounded-b-2xl">
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt=""
              className="w-full h-full object-cover opacity-70 dark:opacity-40"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-blue/20 via-purple-500/10 to-pink-500/20 dark:from-blue-900/40 dark:via-purple-900/20 dark:to-pink-900/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <button
            onClick={onBack}
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>
          <div className="absolute bottom-4 right-4 flex gap-1.5 flex-wrap justify-end">
            <span
              className={`flex items-center gap-1 px-2.5 py-1 backdrop-blur-sm rounded-full text-[11px] font-semibold shadow-sm ${planConfig.bg} ${planConfig.color}`}
            >
              <Award size={11} />
              {planConfig.label} Plan
            </span>
            {totalSales > 0 && (
              <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm rounded-full text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 shadow-sm">
                <Award size={11} className="text-amber-500" />
                {totalSales} sale{totalSales !== 1 ? 's' : ''}
              </span>
            )}
          </div>
        </div>

        {/* Profile Header */}
        <div className={`${isMobile ? 'px-4' : ''} -mt-24 relative z-10`}>
          <div className="flex items-end justify-between gap-4">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-neutral-900 overflow-hidden shadow-lg bg-neutral-200 dark:bg-neutral-700 flex-shrink-0">
              {avatarUrl ? (
                <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-5xl font-bold"
                  style={{ backgroundColor: getRandomColorByString(firstName || 'U') }}
                >
                  {getFirstCharacter(firstName || 'U')}
                </div>
              )}
            </div>
            <div className="pb-2 flex items-center gap-2">
              {creatorStores?.length > 0 && (
                <CreatorStoresDropdown stores={creatorStores} isMobile={isMobile} />
              )}
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onToggleFollow}
                disabled={isTogglingFollow}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isFollowing
                    ? 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-red-300 hover:text-red-500 dark:hover:border-red-700 dark:hover:text-red-400 group'
                    : 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
                }`}
              >
                {isTogglingFollow ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserCheck size={16} className="group-hover:hidden" />
                    <span className="group-hover:hidden">Following</span>
                    <span className="hidden group-hover:inline text-red-500">Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Follow
                  </>
                )}
              </motion.button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                  {fullName}
                </h1>
                {isVerified && (
                  <Tooltip title="Verified Creator">
                    <VerifiedBadge />
                  </Tooltip>
                )}
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {username && <span className="font-medium">@{username}</span>}
                {bio && (
                  <>
                    <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">·</span>
                    <span className="italic line-clamp-1">{bio}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Stats — followers clickable */}
          <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
            <button
              onClick={() => setShowFollowers(true)}
              className="hover:text-blue transition-colors"
            >
              <strong className="text-neutral-900 dark:text-white">
                {followersCount.toLocaleString()}
              </strong>{' '}
              followers
            </button>
            <span>
              <strong className="text-neutral-900 dark:text-white">{totalListings}</strong> products
            </span>
            <span>
              <strong className="text-neutral-900 dark:text-white">{reviewsTotal}</strong> reviews
            </span>
          </div>

          {industries.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {industries.map((ind: string) => (
                <span
                  key={ind}
                  className="px-2.5 py-1 bg-neutral-50 dark:bg-neutral-800 rounded-full text-[11px] font-medium text-neutral-500 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-700"
                >
                  {getIndustryLabel(ind)}
                </span>
              ))}
            </div>
          )}

          <div className="mt-3">
            {locationStr && (
              <span className="flex items-center gap-1.5 text-sm text-neutral-500">
                <MapPin size={14} className="text-neutral-400" />
                {locationStr}
              </span>
            )}
            {joinedDate && (
              <span className="flex items-center gap-1.5 text-sm text-neutral-500">
                <Calendar size={14} className="text-neutral-400" />
                Joined {formatJoinDate(joinedDate)}
              </span>
            )}
          </div>

          <div className="flex gap-2.5 mt-5 flex-wrap">
            {(whatsappNumber || phoneNumber) && (
              <button
                onClick={handleWhatsApp}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all"
              >
                <MessageCircle size={16} />
                WhatsApp
              </button>
            )}
            {phoneNumber && (
              <button
                onClick={handleCall}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all"
              >
                <Phone size={16} />
                Call
              </button>
            )}
            {contactEmail && (
              <a
                href={`mailto:${contactEmail}?subject=${encodeURIComponent(
                  `Inquiry from Comaket - ${fullName}`
                )}&body=${encodeURIComponent(
                  `Hi ${firstName},\n\nI found your creator profile on Comaket and I'm interested in your work.\n\nLooking forward to hearing from you.`
                )}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all"
              >
                <Mail size={16} />
                Email
              </a>
            )}
            {website && (
              <Tooltip title="Visit website">
                <a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all"
                >
                  <Globe size={16} />
                </a>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className={`mt-6 ${isMobile ? 'px-0' : ''} pb-10`}>
          <Tabs
            defaultActiveKey="featured"
            className={`[&_.ant-tabs-nav]:!mb-4 [&_.ant-tabs-tab]:!text-sm [&_.ant-tabs-tab]:!font-medium [&_.ant-tabs-tab-active]:!font-semibold [&_.ant-tabs-ink-bar]:!bg-blue [&_.ant-tabs-nav]:!px-4 [&_.ant-tabs-nav]:!sticky [&_.ant-tabs-nav]:!z-[100] [&_.ant-tabs-nav]:!bg-white [&_.ant-tabs-nav]:dark:!bg-neutral-900 ${
              isMobile
                ? '[&_.ant-tabs-nav-list]:!w-full [&_.ant-tabs-nav-list]:!justify-around [&_.ant-tabs-nav]:!top-[30px]'
                : '[&_.ant-tabs-nav]:!top-0'
            }`}
            items={tabItems}
          />
        </div>
      </div>

      {/* Followers Modal */}
      <FollowersModal
        open={showFollowers}
        onClose={() => setShowFollowers(false)}
        title={`${fullName}'s Followers`}
        targetType="creator"
        targetId={creator?._id || ''}
      />
    </div>
  );
};

export default CreatorDetails;
