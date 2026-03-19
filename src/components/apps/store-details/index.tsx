'use client';

import React, { useState, useMemo } from 'react';
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
  Calendar,
  ExternalLink,
  UserPlus,
  UserCheck,
  Send,
  User,
  ChevronRight,
  Loader2,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { formatJoinDate, getRatingLabel, VendorReview } from '@grc/_shared/namespace/vendor';
import { useRouter } from 'next/navigation';
import FollowersModal from '../followers-modal';
import StoreDetailsProductsTab from './lib/store-details-product-tab';

const { TextArea } = Input;

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

const VerifiedBadge: React.FC<{ isSuper?: boolean }> = ({ isSuper = false }) => (
  <i
    className={`ri-verified-badge-fill ${
      isSuper ? 'text-[#E8A800]' : 'text-[#1D9BF0]'
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
          <span className="text-xs font-bold text-neutral-500">{review.buyerName.charAt(0)}</span>
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
  onSubmit: (r: { rating: number; comment: string }) => void;
  isSubmitting?: boolean;
  entityName?: string;
  isSellerView?: boolean;
}> = ({ onSubmit, isSubmitting, entityName = 'this store', isSellerView = false }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const handleSubmit = () => {
    if (!rating) {
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
  const isDisabled = isSubmitting || rating === 0 || !comment.trim();
  return (
    <div
      className={`bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50 ${
        isSellerView && ' pointer-events-none'
      }`}
    >
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
            placeholder={`Share your experience with ${entityName}...`}
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
          {isSubmitting ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
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

const CreatorLinkCard: React.FC<{ creator: any; isMobile: boolean }> = ({ creator }) => {
  const router = useRouter();
  if (!creator) return null;
  const firstName = creator?.userId?.firstName || creator?.firstName || '';
  const lastName = creator?.userId?.lastName || creator?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'Creator';
  const username = creator?.username || '';
  const avatar = creator?.profileImageUrl || creator?.userId?.avatar || creator?.avatar || '';
  const isVerified = creator?.isVerified || false;
  const handleClick = () => {
    if (username) router.push(`/creators/${encodeURIComponent(username)}`);
  };
  return (
    <button
      onClick={handleClick}
      disabled={!username}
      className="flex items-center gap-3 px-4 py-3 bg-white dark:bg-neutral-800/60 border border-neutral-100 dark:border-neutral-700/50 rounded-xl hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors group w-full text-left disabled:cursor-default"
    >
      <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0 shadow-sm">
        {avatar ? (
          <img src={avatar} alt={fullName} className="w-full h-full object-cover" />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: getRandomColorByString(firstName || 'C') }}
          >
            {getFirstCharacter(firstName || 'C')}
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5">
          <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:font-semibold transition-colors">
            {fullName}
          </p>
          {isVerified && <VerifiedBadge />}
        </div>
        {username && (
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">@{username}</p>
        )}
      </div>
      <div className="flex items-center gap-1 text-[11px] font-medium text-blue opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
        <User size={12} />
        <span>View Creator</span>
        <ChevronRight size={12} />
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface StoreDetailsProps {
  store: any;
  creatorProfile?: any;
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
  onBack: () => void;
  // Follow integration
  isFollowing?: boolean;
  followersCount?: number;
  onToggleFollow?: () => void;
  isTogglingFollow?: boolean;
  isSellerView?: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const StoreDetails: React.FC<StoreDetailsProps> = ({
  store,
  creatorProfile,
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
  onBack,
  isFollowing = false,
  followersCount = 0,
  onToggleFollow,
  isTogglingFollow,
  isSellerView = false,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const router = useRouter();
  const [showFollowers, setShowFollowers] = useState(false);

  const storeName = store?.name || 'Store';
  const tagline = store?.tagline || '';
  const description = store?.description || '';
  const logoUrl = store?.logo || '';
  const coverImageUrl = store?.coverImage || '';
  const isVerified = store?.isVerified || false;
  const isSuperVerified = store?.isSuperVerified || false;
  const status = store?.status || 'active';
  const categories = store?.categories || store?.industries || [];
  const tags = store?.tags || [];
  const phoneNumber = store?.phoneNumber || '';
  const whatsappNumber = store?.whatsappNumber || '';
  const email = store?.email || '';
  const website = store?.website || '';
  const socialLinks = store?.socialLinks;
  const totalListings = listingsTotal || 0;
  const _totalSales = store?.totalSales || 0;
  const joinedDate = store?.createdAt || '';
  const locationParts = [
    store?.location?.street,
    store?.location?.city,
    store?.location?.state,
    store?.location?.country,
  ].filter(Boolean);
  const locationStr = locationParts.join(', ');

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
    if (vendorReviews.length === 0) return store?.rating || 0;
    const sum = vendorReviews.reduce((s, r) => s + r.rating, 0);
    return Math.round((sum / vendorReviews.length) * 10) / 10;
  }, [vendorReviews, store?.rating]);

  const handleWhatsApp = () => {
    const num = whatsappNumber || phoneNumber;
    if (!num) {
      antMessage.warning('WhatsApp number not available');
      return;
    }
    window.open(
      `https://wa.me/${num}?text=${encodeURIComponent(
        `Hi,\nI found ${storeName} on Comaket and I'm interested in your products.`
      )}`,
      '_blank'
    );
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

  const statusConfig: Record<string, { dot: string; label: string }> = {
    active: { dot: 'bg-emerald-400', label: 'Open' },
    pending: { dot: 'bg-amber-400', label: 'Pending' },
    suspended: { dot: 'bg-red-400', label: 'Suspended' },
  };
  const _storeStatus = statusConfig[status] || statusConfig.active;

  const tabItems = [
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
        <StoreDetailsProductsTab
          listings={listings}
          listingsTotal={listingsTotal}
          isLoading={isLoadingListings}
          isFetching={isFetchingListings}
          isMobile={isMobile}
          onLoadMore={onLoadMoreListings}
          storeName={storeName}
          storeWhatsApp={whatsappNumber || phoneNumber}
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
            {
              <WriteReviewForm
                onSubmit={handleReviewSubmit}
                isSubmitting={isSubmittingReview}
                entityName={storeName}
                isSellerView={isSellerView}
              />
            }

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
            {creatorProfile && !creatorProfile?.isSystemAccount && (
              <div>
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Store Owner
                </h3>
                <CreatorLinkCard creator={creatorProfile} isMobile={isMobile} />
              </div>
            )}
            <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
              <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                About {storeName}
              </h3>
              {description ? (
                <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">
                  {description}
                </p>
              ) : (
                <p className="text-sm text-neutral-400 italic">No description provided.</p>
              )}
            </div>
            {categories.length > 0 && (
              <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat: string) => (
                    <span
                      key={cat}
                      className="px-2.5 py-1 bg-neutral-50 dark:bg-neutral-700/50 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300"
                    >
                      {getIndustryLabel(cat)}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {tags.length > 0 && (
              <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag: string) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-blue-50 dark:bg-blue-900/20 rounded-full text-xs font-medium text-blue dark:text-indigo-300"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
            {locationStr && (
              <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
                <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
                  Location
                </h3>
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-neutral-700 dark:text-neutral-300">
                    {locationStr}
                  </span>
                </div>
              </div>
            )}
            {(phoneNumber || whatsappNumber || email || website) && (
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
                  {email && (
                    <div className="flex items-center gap-2">
                      <Mail size={14} className="text-neutral-400" />
                      <span className="text-sm text-neutral-700 dark:text-neutral-300">
                        {email}
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
      className={`dark:bg-neutral-900/50 ${isMobile ? 'max-w-[100vw] pt-0 pb-10' : 'min-h-screen'}`}
    >
      <div className={`w-full ${!isMobile ? 'w-full px-4' : ''}`}>
        {/* Cover */}
        <div
          className={`relative ${
            isMobile ? 'h-36' : 'h-44 sm:h-56'
          } bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden sm:rounded-b-2xl`}
        >
          {coverImageUrl ? (
            <img
              src={coverImageUrl}
              alt=""
              className="w-full h-full object-cover opacity-70 dark:opacity-40"
            />
          ) : (
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue/10 to-purple-500/20 dark:from-emerald-900/40 dark:via-blue-900/20 dark:to-purple-900/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
          <button
            onClick={onBack}
            className={`absolute ${
              isMobile ? 'top-12' : 'top-4'
            } left-4 z-10 flex items-center gap-1.5 ${
              isMobile ? 'px-2.5 py-1 text-xs' : 'px-3 py-1.5 text-sm'
            } bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-lg font-medium transition-colors`}
          >
            <ArrowLeft size={isMobile ? 14 : 16} />
            Back
          </button>
          {/* Award tags removed per user request */}
        </div>

        {/* Profile Header */}
        <div className={`${isMobile ? 'px-4 -mt-14' : '-mt-24'} relative z-20`}>
          <div className="flex items-end justify-between gap-4">
            <div
              className={`${
                isMobile ? 'w-24 h-24' : 'w-36 h-36 sm:w-40 sm:h-40'
              } rounded-2xl border-4 border-white dark:border-neutral-900 overflow-hidden shadow-lg bg-neutral-200 dark:bg-neutral-700 flex-shrink-0`}
            >
              {logoUrl ? (
                <img src={logoUrl} alt={storeName} className="w-full h-full object-cover" />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center text-white text-5xl font-bold"
                  style={{ backgroundColor: getRandomColorByString(storeName) }}
                >
                  {getFirstCharacter(storeName)}
                </div>
              )}
            </div>
            <div className={`${isMobile ? '' : 'pb-2'}`}>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={onToggleFollow}
                disabled={isTogglingFollow || isSellerView}
                className={`flex disabled:!cursor-not-allowed items-center ${
                  isMobile
                    ? 'gap-1.5 px-3.5 py-1.5 rounded-lg text-xs'
                    : 'gap-2 px-5 py-2.5 rounded-xl text-sm'
                } font-semibold transition-all ${
                  isFollowing
                    ? 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-red-300 hover:text-red-500 dark:hover:border-red-700 dark:hover:text-red-400 group'
                    : 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
                }`}
              >
                {isTogglingFollow ? (
                  <Loader2 size={isMobile ? 14 : 16} className="animate-spin" />
                ) : isFollowing ? (
                  <>
                    <UserCheck size={isMobile ? 14 : 16} className="group-hover:hidden" />
                    <span className="group-hover:hidden">Following</span>
                    <span className="hidden group-hover:inline text-red-500">Unfollow</span>
                  </>
                ) : (
                  <>
                    <UserPlus size={isMobile ? 14 : 16} />
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
                  {storeName}
                </h1>
                {(isVerified || isSuperVerified) && (
                  <Tooltip title={isSuperVerified ? 'Super Verified Store' : 'Verified Store'}>
                    <VerifiedBadge isSuper={isSuperVerified} />
                  </Tooltip>
                )}
              </div>
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
                {creatorProfile && (
                  <span
                    onClick={() =>
                      router.push(`/creators/${encodeURIComponent(creatorProfile?.username ?? '')}`)
                    }
                    className="font-medium cursor-pointer hover:font-semibold transition-colors"
                  >
                    @{creatorProfile?.username ?? ''}
                  </span>
                )}
                {tagline && (
                  <>
                    <span className="mx-1.5 text-neutral-300 dark:text-neutral-600">·</span>
                    <span className="italic line-clamp-1">{tagline}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Stats — followers clickable */}
          <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
            <button
              onClick={() => setShowFollowers(true)}
              className="hover:font-semibold transition-colors"
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

          {categories.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {categories.map((cat: string) => (
                <span
                  key={cat}
                  className="px-2.5 py-1 bg-neutral-50 dark:bg-neutral-800 rounded-full text-[11px] font-medium text-neutral-500 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-700"
                >
                  {getIndustryLabel(cat)}
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
                Since {formatJoinDate(joinedDate)}
              </span>
            )}
          </div>

          <div className={`flex ${isMobile ? 'gap-2 mt-4' : 'gap-2.5 mt-5'} flex-wrap`}>
            {(whatsappNumber || phoneNumber) && (
              <button
                onClick={handleWhatsApp}
                className={`flex items-center ${
                  isMobile
                    ? 'gap-1.5 px-3.5 py-1.5 text-xs rounded-lg'
                    : 'gap-2 px-5 py-2.5 text-sm rounded-xl'
                } bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all`}
              >
                <MessageCircle size={isMobile ? 14 : 16} />
                WhatsApp
              </button>
            )}
            {phoneNumber && (
              <button
                onClick={handleCall}
                className={`flex items-center ${
                  isMobile
                    ? 'gap-1.5 px-3.5 py-1.5 text-xs rounded-lg'
                    : 'gap-2 px-5 py-2.5 text-sm rounded-xl'
                } bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all`}
              >
                <Phone size={isMobile ? 14 : 16} />
                Call
              </button>
            )}
            {email && (
              <a
                href={`mailto:${email}?subject=${encodeURIComponent(
                  `Inquiry from Comaket - ${storeName}`
                )}&body=${encodeURIComponent(
                  `Hi,\n\nI found your store "${storeName}" on Comaket and I'm interested in your products.\n\nLooking forward to hearing from you.`
                )}`}
                className={`flex items-center ${
                  isMobile
                    ? 'gap-1.5 px-3.5 py-1.5 text-xs rounded-lg'
                    : 'gap-2 px-5 py-2.5 text-sm rounded-xl'
                } bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all`}
              >
                <Mail size={isMobile ? 14 : 16} />
                Email
              </a>
            )}
            {website && (
              <Tooltip title="Visit website">
                <a
                  href={website.startsWith('http') ? website : `https://${website}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center ${
                    isMobile ? 'gap-1.5 px-3 py-1.5 rounded-lg' : 'gap-2 px-4 py-2.5 rounded-xl'
                  } bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all`}
                >
                  <Globe size={isMobile ? 14 : 16} />
                </a>
              </Tooltip>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className={`${isMobile ? 'mt-3 px-0' : 'mt-6'} pb-10`}>
          <Tabs
            defaultActiveKey="products"
            className={`[&_.ant-tabs-nav]:!mb-4 [&_.ant-tabs-tab]:!text-sm [&_.ant-tabs-tab]:!font-medium [&_.ant-tabs-tab-active]:!font-semibold [&_.ant-tabs-ink-bar]:!bg-blue [&_.ant-tabs-nav]:!px-4 [&_.ant-tabs-nav]:!sticky [&_.ant-tabs-nav]:!z-[100] [&_.ant-tabs-nav]:!bg-white [&_.ant-tabs-nav]:dark:!bg-neutral-900 [&_.ant-tabs-tab]:!text-black dark:[&_.ant-tabs-tab]:!text-white [&_.ant-tabs-tab:hover]:!text-black dark:[&_.ant-tabs-tab:hover]:!text-white [&_.ant-tabs-tab-btn]:!text-inherit hover:[&_.ant-tabs-tab-btn]:!text-inherit [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-black dark:[&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-white ${
              isMobile
                ? '[&_.ant-tabs-nav-list]:!flex-nowrap [&_.ant-tabs-nav-list]:!gap-1 [&_.ant-tabs-nav-list]:!justify-between [&_.ant-tabs-nav-list]:!w-full [&_.ant-tabs-nav-wrap]:!overflow-x-auto [&_.ant-tabs-nav-wrap]:!flex-nowrap [&_.ant-tabs-nav-operations]:!hidden [&_.ant-tabs-nav]:!top-[0px] [&_.ant-tabs-tab]:!flex-shrink-0 [&_.ant-tabs-tab]:!px-3'
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
        title={`${storeName}'s Followers`}
        targetType="store"
        targetId={store?._id || ''}
      />
    </div>
  );
};

export default StoreDetails;
