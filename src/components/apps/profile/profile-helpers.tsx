'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Star,
  X,
  Timer,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { VendorReview } from '@grc/_shared/namespace/vendor';
import { Pagination } from '@grc/_shared/namespace';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'returned'
  | 'completed';

export interface CreatorProfileData {
  _id: string;
  userId: {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    id: string;
  };
  username: string;
  slug: string;
  bio: string;
  profileImageUrl: string;
  coverImage: string | null;
  contactEmail: string;
  phoneNumber: string;
  whatsappNumber: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  website: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    tiktok: string;
  };
  industries: string[];
  featuredWorks: any[];
  plan: string;
  paystackSubscriptionCode: string | null;
  paystackCustomerCode: string | null;
  planExpiresAt: string | null;
  status: string;
  isVerified: boolean;
  bankDetails: any;
  totalStores: number;
  totalListings: number;
  totalSales: number;
  rating: number;
  totalReviews: number;
  followersCount: number;
  totalFollowers: number;
  createdAt: string;
  updatedAt: string;
}

interface StoreItem {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  status?: string;
  totalListings?: number;
  rating?: number;
  logo?: string | null;
  [key: string]: any;
}

export interface ProfileProps {
  userProfile?: any;
  updateUserProfile?: (data: any) => Promise<any>;
  isUpdatingProfile?: boolean;
  // Creator profile
  creatorProfile?: CreatorProfileData;
  isLoadingCreatorProfile?: boolean;
  updateCreatorProfile?: (data: any) => Promise<any>;
  isUpdatingCreatorProfile?: boolean;
  onCreatorProfileUpdated?: () => void;
  // Listings
  creatorListings?: any[];
  creatorListingsTotal?: number;
  isLoadingCreatorListings?: boolean;
  onLoadMoreListings?: (page: number) => void;
  // Seller Orders
  sellerOrders?: any[];
  sellerOrdersTotal?: number;
  isLoadingSellerOrders?: boolean;
  isFetchingSellerOrders?: boolean;
  onLoadMoreSellerOrders?: (page: number) => void;
  onFetchOrderDetail?: (orderId: string) => Promise<any>;
  orderDetail?: any;
  isLoadingOrderDetail?: boolean;
  onUpdateOrderStatus?: (id: string, data: any) => Promise<any>;
  isUpdatingOrderStatus?: boolean;
  // Reviews
  reviews?: VendorReview[];
  reviewsTotal?: number;
  isLoadingReviews?: boolean;
  onSellerReply?: (reviewId: string, data: any) => Promise<any>;
  isReplyingToReview?: boolean;
  onLoadMoreReviews?: (page: number) => void;
  // Saved products
  savedItems?: any[];
  savedTotal?: number;
  isLoadingSaved?: boolean;
  isFetchingSaved?: boolean;
  onRemoveSaved?: (listingId: string) => void;
  isRemovingSaved?: boolean;
  onLoadMoreSaved?: (page: number) => void;
  // Location
  states?: any[];
  cities?: any[];
  loadingStates?: boolean;
  loadingCities?: boolean;
  onStateChange?: (stateName: string) => void;
  // Buyer orders (purchases) — new props
  buyerOrders?: any[];
  buyerOrdersTotal?: number;
  isLoadingBuyerOrders?: boolean;
  isFetchingBuyerOrders?: boolean;
  onLoadMoreBuyerOrders?: (page: number) => void;
  onFetchBuyerOrderDetail?: (orderId: string) => Promise<any>;
  buyerOrderDetail?: any;
  isLoadingBuyerOrderDetail?: boolean;
  buyerOrdersPagination?: Pagination;
  sellerOrdersPagination?: Pagination;
  onRefetchSellerOrders: (params: {
    search?: string;
    status?: string;
    page?: number;
    perPage?: number;
  }) => void;
  onRefetchBuyerOrders?: (params: {
    search?: string;
    status?: string;
    page?: number;
    perPage?: number;
  }) => void;
  myStores: StoreItem[];
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

export const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => {
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

export const VerifiedBadge: React.FC<{ isSuper?: boolean }> = ({ isSuper = false }) => (
  <i
    className={`ri-verified-badge-fill ${
      isSuper ? 'text-[#D4A017]' : 'text-[#1D9BF0]'
    } text-[20px]`}
  />
);

export const RatingBreakdown: React.FC<{ reviews: VendorReview[] }> = ({ reviews }) => {
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

export const ReviewCard: React.FC<{ review: VendorReview; index: number }> = ({
  review,
  index,
}) => (
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

export const orderStatusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: <Timer size={14} />,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: <CheckCircle size={14} />,
  },
  processing: {
    label: 'Processing',
    color: 'text-blue dark:text-blue',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: <Package size={14} />,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    icon: <Truck size={14} />,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: <CheckCircle size={14} />,
  },
  completed: {
    label: 'Completed',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    icon: <CheckCircle size={14} />,
  },

  cancelled: {
    label: 'Cancelled',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: <XCircle size={14} />,
  },
  returned: {
    label: 'Returned',
    color: 'text-neutral-600 dark:text-neutral-400',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    icon: <RotateCcw size={14} />,
  },
};

// ─── Mobile Full-Screen Overlay ───────────────────────────────────────────

interface MobileOverlayProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  zIndex?: number;
  children: React.ReactNode;
}

export const MobileOverlay: React.FC<MobileOverlayProps> = ({
  open,
  onClose,
  title,
  zIndex = 200,
  children,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`fixed inset-0 bg-white dark:bg-neutral-900 flex flex-col overflow-hidden ${
            isMobile ? 'pt-10' : ''
          }`}
          style={{ zIndex }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0 bg-white dark:bg-neutral-900">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">{title || 'Back'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
            >
              <X size={16} className="text-neutral-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto pb-20">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Industry label helper ────────────────────────────────────────────────

export const INDUSTRY_LABELS: Record<string, string> = {
  fashion: 'Fashion & Apparel',
  jewelry: 'Jewelry & Accessories',
  art: 'Art & Prints',
  fragrance: 'Fragrance & Perfumery',
  skincare: 'Skincare & Beauty',
  haircare: 'Haircare & Wigs',
  leather: 'Leather Goods',
  woodwork: 'Woodwork & Carpentry',
  ceramics: 'Ceramics & Pottery',
  textiles: 'Textiles & Fabrics',
  food: 'Food & Beverages',
  candles: 'Candles & Scents',
  'home-decor': 'Home Decor',
  stationery: 'Stationery & Paper',
  toys: 'Toys & Games',
  metalwork: 'Metalwork & Smithing',
  beadwork: 'Beadwork & Craft',
  photography: 'Photography & Prints',
  fitness: 'Fitness & Wellness',
  'tech-accessories': 'Tech Accessories',
  'pet-products': 'Pet Products',
  automotive: 'Automotive & Parts',
  musical: 'Musical Instruments',
  other: 'Other',
};

export const getIndustryLabel = (id: string): string =>
  INDUSTRY_LABELS[id] || id.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

// ─── Plan label helper ────────────────────────────────────────────────────

export const PLAN_LABELS: Record<string, { label: string; color: string; bg: string }> = {
  starter: {
    label: 'Starter',
    color: 'text-neutral-600 dark:text-neutral-400',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
  },
  pro: {
    label: 'Pro',
    color: 'text-blue dark:text-blue',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  business: {
    label: 'Business',
    color: 'text-purple-600 dark:text-purple-400',
    bg: 'bg-purple-50 dark:bg-purple-900/20',
  },
};

// ─── Loading Skeleton ────────────────────────────────────────────────────

export const TabLoadingSkeleton: React.FC = () => (
  <div className="space-y-3">
    {[1, 2, 3].map((i) => (
      <div
        key={i}
        className="h-24 bg-neutral-100 dark:bg-neutral-800/50 rounded-xl animate-pulse"
      />
    ))}
  </div>
);
