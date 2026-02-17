'use client';

import React, { useState, useMemo, useContext } from 'react';
import { Tabs, Tooltip, Rate, Input, Badge, message as antMessage } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Star,
  Package,
  Clock,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Users,
  Award,
  Calendar,
  CreditCard,
  ExternalLink,
  UserPlus,
  UserCheck,
  Send,
  ShoppingBag,
  ShoppingCart,
  Bookmark,
  Grid,
  List,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { mockMarketItems, Currencies } from '@grc/_shared/constant';
import { MarketItem } from '@grc/_shared/namespace';
import { numberFormat } from '@grc/_shared/helpers';
import MediaRenderer, { getFirstImageUrl } from '../media-renderer';
import { AppContext } from '@grc/app-context';
import { CartItem } from '@grc/_shared/namespace/cart';
import { setBuyNowItem } from '@grc/_shared/namespace/buy';
import { useRouter } from 'next/navigation';
import ItemDetailModal from '../item-detail-modal';
import ModernItemPost from '../item-post-new';
import Product from '../product';
import {
  formatJoinDate,
  getRatingLabel,
  Vendor,
  VendorReview,
} from '@grc/_shared/namespace/vendor';
import Image from 'next/image';

const { TextArea } = Input;

// ─── Star Rating ──────────────────────────────────────────────────────────────

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
                : 'text-gray-200 dark:text-gray-700'
          }
        />
      ))}
    </div>
  );
};

// ─── Verified Badge ───────────────────────────────────────────────────────────

const VerifiedBadge: React.FC<{ isSuper?: boolean }> = ({ isSuper = false }) => (
  <i
    className={`ri-verified-badge-fill ${
      isSuper ? 'text-[#D4A017]' : 'text-[#1D9BF0]'
    } text-[20px]`}
  />
);

// ─── Review Card ──────────────────────────────────────────────────────────────

const ReviewCard: React.FC<{ review: VendorReview; index: number }> = ({ review, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50"
  >
    <div className="flex items-start gap-3">
      {review.buyerAvatar ? (
        <img
          src={review.buyerAvatar}
          alt={review.buyerName}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
            {review.buyerName.charAt(0)}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {review.buyerName}
          </span>
          <span className="text-[11px] text-gray-400 flex-shrink-0">
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
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-[11px] text-gray-400 truncate">{review.productName}</span>
            </>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
          {review.comment}
        </p>
      </div>
    </div>
  </motion.div>
);

// ─── Rating Breakdown ─────────────────────────────────────────────────────────

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

// ─── Write Review Form ────────────────────────────────────────────────────────

const WriteReviewForm: React.FC<{
  onSubmit: (review: { rating: number; comment: string }) => void;
}> = ({ onSubmit }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (rating === 0) {
      antMessage.warning('Please select a rating');
      return;
    }
    if (!comment.trim()) {
      antMessage.warning('Please write a comment');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit({ rating, comment: comment.trim() });
      setRating(0);
      setComment('');
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
      <h4 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Write a Review</h4>
      <div className="space-y-4">
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
            Your Rating
          </label>
          <Rate
            value={rating}
            onChange={setRating}
            className="text-amber-400 [&_.ant-rate-star]:!mr-1"
          />
        </div>
        <div>
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1.5 block">
            Your Experience
          </label>
          <TextArea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share your experience with this vendor..."
            rows={3}
            maxLength={500}
            showCount
            className="!rounded-lg resize-none"
          />
        </div>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || rating === 0 || !comment.trim()}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
            isSubmitting || rating === 0 || !comment.trim()
              ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
          }`}
        >
          <Send size={14} />
          {isSubmitting ? 'Submitting...' : 'Submit Review'}
        </button>
      </div>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  vendor: Vendor;
  onBack: () => void;
}

const VendorDetail: React.FC<Props> = ({ vendor, onBack }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const router = useRouter();
  const { addToCart, isInCart, cartItems } = useContext(AppContext);

  // View toggle for products tab
  const [productsViewType, setProductsViewType] = useState<'grid' | 'list'>('grid');

  // Follow state
  const [isFollowing, setIsFollowing] = useState(false);
  const [localFollowersCount, setLocalFollowersCount] = useState(vendor.followerCount || 0);

  // Reviews state
  const [localReviews, setLocalReviews] = useState<VendorReview[]>(vendor.reviews || []);

  // Bookmark state
  const [savedItems, setSavedItems] = useState<(string | number)[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('savedItems') || '[]');
    } catch {
      return [];
    }
  });

  // Mobile full-screen product state
  const [selectedProductId, setSelectedProductId] = useState<string>('');

  // Desktop item detail modal state
  const [gridModalOpen, setGridModalOpen] = useState(false);
  const [gridModalItem, setGridModalItem] = useState<MarketItem | null>(null);

  // Vendor products
  const vendorProducts = useMemo(() => {
    return mockMarketItems.filter(
      (item) =>
        item.postUserProfile.businessName === vendor.businessName ||
        (item.postUserProfile.userName ?? '')
          .toLowerCase()
          .includes(vendor.name.split(' ')[0].toLowerCase())
    );
  }, [vendor]);

  // Resolve selected product for mobile full-screen
  const selectedProduct = useMemo(
    () => vendorProducts?.find((item) => item.id?.toString() === selectedProductId),
    [selectedProductId, vendorProducts]
  );

  // Computed rating
  const computedRating =
    localReviews.length > 0
      ? Math.round((localReviews.reduce((s, r) => s + r.rating, 0) / localReviews.length) * 10) / 10
      : vendor.rating;

  // ── Grid/List item click ────────────────────────────────────────────
  const handleGridItemClick = (item: MarketItem) => {
    if (isMobile) {
      setSelectedProductId(item?.id?.toString());
    } else {
      setGridModalItem(item);
      setGridModalOpen(true);
    }
  };

  // ── Follow toggle ───────────────────────────────────────────────────
  const toggleFollow = () => {
    if (isFollowing) {
      setIsFollowing(false);
      setLocalFollowersCount((c) => Math.max(0, c - 1));
      antMessage.info(`Unfollowed ${vendor.businessName}`);
    } else {
      setIsFollowing(true);
      setLocalFollowersCount((c) => c + 1);
      antMessage.success(`Following ${vendor.businessName}`);
    }
  };

  // ── Review submit ───────────────────────────────────────────────────
  const handleReviewSubmit = (review: { rating: number; comment: string }) => {
    const newReview: VendorReview = {
      id: `review-${Date.now()}`,
      buyerName: 'You',
      rating: review.rating,
      comment: review.comment,
      date: new Date().toISOString(),
    };
    setLocalReviews((prev) => [newReview, ...prev]);
    antMessage.success('Review submitted!');
  };

  // ── Product action handlers ─────────────────────────────────────────
  const handleWhatsAppMessage = (item: MarketItem) => {
    const phoneNumber = item.postUserProfile?.phoneNumber || '';
    if (!phoneNumber) {
      antMessage.error('Seller phone number not available');
      return;
    }
    const formattedPrice = numberFormat(item.askingPrice?.price / 100, Currencies.NGN);
    const sellerName =
      item.postUserProfile?.businessName || item.postUserProfile?.userName || 'Seller';
    const message = `Hi, ${sellerName},\nI am interested in this item on Comaket.\n\n${item.itemName}\n${item.description}\nPrice: ${formattedPrice}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = (item: MarketItem) => {
    const maxQty = item?.quantity ?? 1;
    const existing = cartItems?.find((i: CartItem) => i.id === item?.id);
    const currentQty = existing?.quantity || 0;
    if (currentQty >= maxQty) {
      antMessage.warning(`Maximum quantity (${maxQty}) reached for this item`);
      return;
    }
    if (isInCart(item?.id)) {
      antMessage.info('Item is already in your cart');
      return;
    }
    const cartItem: CartItem = {
      id: item?.id,
      itemName: item?.itemName || '',
      description: item?.description || '',
      price: item?.askingPrice?.price || 0,
      quantity: 1,
      maxQuantity: maxQty,
      image: getFirstImageUrl(item?.media || []),
      condition: item?.condition || '',
      negotiable: item?.askingPrice?.negotiable || false,
      sellerName: item?.postUserProfile?.businessName || item?.postUserProfile?.userName || '',
    };
    addToCart(cartItem?.id);
    antMessage.success('Added to cart!');
  };

  const handleBuyNow = (item: MarketItem) => {
    const buyItem: CartItem = {
      id: item?.id,
      itemName: item?.itemName || '',
      description: item?.description || '',
      price: item?.askingPrice?.price || 0,
      quantity: 1,
      maxQuantity: item?.quantity ?? 1,
      image: getFirstImageUrl(item?.media || []),
      condition: item?.condition || '',
      negotiable: item?.askingPrice?.negotiable || false,
      sellerName: item?.postUserProfile?.businessName || item?.postUserProfile?.userName || '',
    };
    setBuyNowItem(buyItem);
    router.push('/checkout?mode=buynow');
  };

  const handleBookmark = (item: MarketItem) => {
    try {
      const current = JSON.parse(localStorage.getItem('savedItems') || '[]');
      const isSaved = current.includes(item?.id);
      if (isSaved) {
        const updated = current.filter((id: string | number) => id !== item?.id);
        localStorage.setItem('savedItems', JSON.stringify(updated));
        setSavedItems(updated);
      } else {
        current.push(item?.id);
        localStorage.setItem('savedItems', JSON.stringify(current));
        setSavedItems(current);
      }
      window.dispatchEvent(new Event('savedItemsChanged'));
    } catch (error) {
      console.error('Error managing bookmarks:', error);
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/${vendor.phoneNumber}`, '_blank');
  };

  const handleCall = () => {
    window.open(`tel:+${vendor.phoneNumber}`, '_self');
  };

  // ─── Mobile full-screen Product view ────────────────────────────────
  // Back from product returns to vendor detail (not market)
  if (selectedProductId !== '' && selectedProduct && isMobile) {
    return (
      <AnimatePresence mode="wait">
        <Product
          key={selectedProductId}
          item={selectedProduct}
          setSelectedProductId={setSelectedProductId}
        />
      </AnimatePresence>
    );
  }

  // ─── Product Grid (identical to Market grid) ───────────────────────
  const renderProductGrid = () => (
    <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-3'}`}>
      {vendorProducts.map((item) => {
        const isSaved = savedItems.includes(item?.id);
        const itemInCart = isInCart(item?.id ?? '');
        const isSoldOut = !item?.availability;
        const maxQty = item?.quantity ?? 1;
        const existing = cartItems?.find((i: CartItem) => i.id === item?.id);
        const currentQty = existing?.quantity || 0;
        const isMaxQty = currentQty >= maxQty;
        const firstMedia = item?.media?.[0];

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
          >
            {/* Image / Video Container */}
            <div
              className="relative aspect-square cursor-pointer group overflow-hidden"
              onClick={() => handleGridItemClick(item)}
            >
              {firstMedia && (
                <MediaRenderer
                  media={firstMedia}
                  alt={item?.itemName ?? ''}
                  thumbnailMode={firstMedia.type === 'video'}
                  className="group-hover:scale-110 transition-transform duration-300"
                />
              )}

              <Badge
                className={`absolute top-2 left-2 backdrop-blur-md !rounded-lg shadow-lg z-[5] ${
                  item?.availability
                    ? 'bg-white/10 border border-emerald-300/30'
                    : 'bg-white/10 border border-gray-300/30'
                }`}
                count={
                  <div
                    className={`px-1 py-1 text-[10px] !flex gap-1 items-center font-semibold ${
                      item?.availability ? 'text-emerald-100' : 'text-gray-200'
                    }`}
                  >
                    <div
                      className={`w-1 h-1 rounded-full ${
                        item?.availability
                          ? 'bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                          : 'bg-gray-300'
                      }`}
                    />
                    <span>{item?.availability ? 'Available' : 'Sold Out'}</span>
                  </div>
                }
              />

              <div className="absolute top-2 right-2 z-[5]">
                <span
                  className={`px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm ${
                    item?.condition === 'Brand New'
                      ? 'bg-green-500/90 text-white'
                      : item?.condition === 'Uk Used'
                        ? 'bg-blue/90 text-white'
                        : 'bg-yellow-500/90 text-white'
                  }`}
                >
                  {item?.condition}
                </span>
              </div>

              {item?.sponsored && (
                <div className="absolute bottom-2 left-2 z-[5]">
                  <span className="bg-gradient-to-r from-blue to-indigo-500 text-white px-2 py-1 rounded-full text-[10px] font-semibold shadow-lg">
                    Sponsored
                  </span>
                </div>
              )}

              {item?.availability && maxQty > 0 && maxQty <= 5 && (
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full z-[5]">
                  {maxQty} left
                </div>
              )}

              {item?.media?.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-[5]">
                  {item.media.slice(0, 5).map((m, idx) => (
                    <div
                      key={idx}
                      className={`w-1.5 h-1.5 rounded-full ${
                        idx === 0 ? 'bg-white' : 'bg-white/40'
                      }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="p-3 flex flex-col flex-grow">
              <h3
                className="font-semibold text-sm dark:text-white mb-1 line-clamp-2 cursor-pointer hover:text-blue transition-colors"
                onClick={() => handleGridItemClick(item)}
              >
                {item?.itemName}
              </h3>

              {!item?.isBuyable && (
                <span className="inline-flex items-center self-start px-1.5 py-0.5 text-[9px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full mb-1">
                  Seller Listing
                </span>
              )}

              <div className="flex items-center gap-2 mb-2">
                <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                  {numberFormat((item?.askingPrice?.price ?? 0) / 100, Currencies.NGN)}
                </span>
                {item?.askingPrice?.negotiable && (
                  <span className="text-[9px] bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-full font-medium">
                    Negotiable
                  </span>
                )}
              </div>

              <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-grow">
                {item?.description}
              </p>

              {item?.productTags && item.productTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                  {item.productTags.slice(0, 2).map((tag: string, idx: number) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 text-[9px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {item.productTags.length > 2 && (
                    <span className="px-2 py-0.5 text-[9px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-full">
                      +{item.productTags.length - 2}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-1.5">
                {item?.isBuyable ? (
                  <>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBuyNow(item);
                        }}
                        disabled={isSoldOut}
                        className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                          isSoldOut
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-gradient-to-r from-blue to-indigo-700 hover:from-blue hover:to-indigo-800 text-white hover:shadow-md'
                        }`}
                      >
                        <ShoppingBag size={14} />
                        Buy Now
                      </button>
                      <Tooltip
                        title={
                          isSoldOut
                            ? 'Sold out'
                            : isMaxQty
                              ? `Max qty (${maxQty})`
                              : itemInCart
                                ? 'In cart'
                                : 'Add to cart'
                        }
                      >
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(item);
                          }}
                          disabled={isSoldOut || isMaxQty}
                          className={`p-2 rounded-lg border shadow-sm transition-colors ${
                            isSoldOut || isMaxQty
                              ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                              : itemInCart
                                ? 'bg-blue-50 border-blue text-blue'
                                : 'bg-neutral-50 border-neutral-200 dark:bg-gray-700 dark:border-gray-600 text-gray-500 hover:border-blue hover:text-blue'
                          }`}
                        >
                          <ShoppingCart size={14} />
                        </button>
                      </Tooltip>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppMessage(item);
                        }}
                        className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                      >
                        <MessageCircle size={14} />
                        WhatsApp
                      </button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(item);
                        }}
                        className="p-2 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 shadow-sm"
                      >
                        <Bookmark
                          size={16}
                          className={`${
                            isSaved ? 'fill-pink-500 text-pink-500' : 'text-gray-400'
                          } transition-colors`}
                        />
                      </motion.button>
                    </div>
                  </>
                ) : (
                  <>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleWhatsAppMessage(item);
                      }}
                      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                    >
                      <MessageCircle size={14} />
                      Message on WhatsApp
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(item);
                      }}
                      className="w-full p-2 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 shadow-sm flex items-center justify-center gap-1.5 text-xs text-gray-500"
                    >
                      <Bookmark
                        size={14}
                        className={`${
                          isSaved ? 'fill-pink-500 text-pink-500' : 'text-gray-400'
                        } transition-colors`}
                      />
                      Save
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  // ─── Product List view ──────────────────────────────────────────────
  const renderProductList = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      {vendorProducts.map((item, idx) => (
        <div key={idx}>
          <ModernItemPost
            postUserProfile={item?.postUserProfile ?? {}}
            sponsored={item?.sponsored ?? false}
            description={item?.description ?? ''}
            media={item?.media ?? []}
            askingPrice={item?.askingPrice ?? {}}
            condition={item?.condition ?? 'Brand New'}
            itemName={item?.itemName ?? ''}
            comments={item?.comments ?? []}
            productTags={item?.productTags ?? []}
            id={item?.id ?? ''}
            quantity={item?.quantity ?? 1}
            setSelectedProductId={setSelectedProductId}
            availability={item?.availability ?? true}
            isBuyable={item?.isBuyable ?? false}
            listingType={item?.listingType ?? 'self-listing'}
          />
        </div>
      ))}
    </div>
  );

  return (
    <div className={`dark:bg-gray-900/50 min-h-screen ${isMobile ? 'max-w-[100vw] mb-14' : ''}`}>
      <div className={`w-full ${!isMobile ? 'max-w-4xl mx-auto px-4' : ''}`}>
        {/* ── Cover Image ──────────────────────────────────────────────── */}
        <div className="relative h-44 sm:h-56 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden sm:rounded-b-2xl">
          {vendor.coverImageUrl && (
            <img
              src={vendor.coverImageUrl}
              alt=""
              className="w-full h-full object-cover opacity-70 dark:opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          <button
            onClick={onBack}
            className="absolute top-4 left-4 z-10 flex items-center gap-1.5 px-3 py-1.5 bg-black/30 hover:bg-black/50 backdrop-blur-sm text-white rounded-lg text-sm font-medium transition-colors"
          >
            <ArrowLeft size={16} />
            Back
          </button>

          {vendor.badges && vendor.badges.length > 0 && (
            <div className="absolute bottom-4 right-4 flex gap-1.5 flex-wrap justify-end">
              {vendor.badges.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-full text-[11px] font-semibold text-gray-700 dark:text-gray-300 shadow-sm"
                >
                  <Award size={11} className="text-amber-500" />
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Profile Header ───────────────────────────────────────────── */}
        <div className={`${isMobile ? 'px-4' : ''} -mt-24 relative z-10`}>
          <div className="flex items-end justify-between gap-4">
            <div className="w-40 h-40 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <Image
                src={vendor.profilePicUrl}
                alt={vendor.businessName}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="pb-2">
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={toggleFollow}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isFollowing
                    ? 'bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:border-red-300 hover:text-red-500 dark:hover:border-red-700 dark:hover:text-red-400 group'
                    : 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
                }`}
              >
                {isFollowing ? (
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
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {vendor.businessName}
                </h1>
                {vendor.isVerified && (
                  <Tooltip title={vendor.isSuperVerified ? 'Super Verified' : 'Verified Vendor'}>
                    <VerifiedBadge isSuper={vendor?.isSuperVerified} />
                  </Tooltip>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {vendor.name}
                {vendor.tagline && (
                  <>
                    <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
                    <span className="italic">{vendor.tagline}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span>
              <strong className="text-gray-900 dark:text-white">
                {localFollowersCount.toLocaleString()}
              </strong>{' '}
              followers
            </span>
            <span>
              <strong className="text-gray-900 dark:text-white">{vendor.productCount}</strong>{' '}
              products
            </span>
            <span>
              <strong className="text-gray-900 dark:text-white">{localReviews.length}</strong>{' '}
              reviews
            </span>
          </div>

          <div className="mt-3">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin size={14} className="text-gray-400" />
              {vendor.location}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar size={14} className="text-gray-400" />
              Joined {formatJoinDate(vendor.joinedDate)}
            </span>
            {vendor.operatingHours && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock size={14} className="text-gray-400" />
                {vendor.operatingHours}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full">
              <Star size={15} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                {computedRating}
              </span>
              <span className="text-xs text-amber-600/70 dark:text-amber-400/60">
                {getRatingLabel(computedRating)}
              </span>
            </div>
          </div>

          <div className="flex gap-2.5 mt-5 flex-wrap">
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-emerald-500/20 hover:shadow-lg transition-all"
            >
              <MessageCircle size={16} />
              WhatsApp
            </button>
            <button
              onClick={handleCall}
              className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
            >
              <Phone size={16} />
              Call
            </button>
            {vendor.email && (
              <a
                href={`mailto:${vendor.email}?subject=${encodeURIComponent(
                  `Inquiry from Comaket - ${vendor.businessName}`
                )}&body=${encodeURIComponent(
                  `Hi ${vendor.name},\n\nI found your store on Comaket and I'm interested in your products.\n\nLooking forward to hearing from you.`
                )}`}
                className="flex items-center gap-2 px-5 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
              >
                <Mail size={16} />
                Email
              </a>
            )}
            {vendor.socialLinks?.website && (
              <Tooltip title="Visit website">
                <a
                  href={vendor.socialLinks.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
                >
                  <Globe size={16} />
                </a>
              </Tooltip>
            )}
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div className={`mt-6 ${isMobile ? 'px-4' : ''} pb-10`}>
          <Tabs
            defaultActiveKey="products"
            className="[&_.ant-tabs-nav]:!mb-4 [&_.ant-tabs-tab]:!text-sm [&_.ant-tabs-tab]:!font-medium [&_.ant-tabs-tab-active]:!font-semibold [&_.ant-tabs-ink-bar]:!bg-blue"
            items={[
              // ─── Products Tab ──────────────────────────────────────
              {
                key: 'products',
                label: (
                  <span className="flex items-center gap-1.5">
                    <Package size={15} />
                    Products ({vendorProducts.length})
                  </span>
                ),
                children: (
                  <div>
                    {/* View toggle */}
                    <div className="flex items-center justify-end gap-2 mb-4">
                      <button
                        onClick={() => setProductsViewType('grid')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                          productsViewType === 'grid'
                            ? 'bg-blue-50 text-blue dark:bg-blue/30 dark:text-blue'
                            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      >
                        <Grid size={16} />
                        {!isMobile && <span className="font-medium">Grid</span>}
                      </button>
                      <button
                        onClick={() => setProductsViewType('list')}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                          productsViewType === 'list'
                            ? 'bg-blue-50 text-blue dark:bg-blue/30 dark:text-blue'
                            : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      >
                        <List size={16} />
                        {!isMobile && <span className="font-medium">List</span>}
                      </button>
                    </div>

                    {vendorProducts.length > 0 ? (
                      productsViewType === 'grid' ? (
                        renderProductGrid()
                      ) : (
                        renderProductList()
                      )
                    ) : (
                      <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                        <Package
                          size={36}
                          className="mx-auto text-gray-200 dark:text-gray-700 mb-3"
                        />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No products listed yet
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          Check back soon — this vendor may add new items.
                        </p>
                      </div>
                    )}
                  </div>
                ),
              },

              // ─── Reviews Tab ───────────────────────────────────────
              {
                key: 'reviews',
                label: (
                  <span className="flex items-center gap-1.5">
                    <Star size={15} />
                    Reviews ({localReviews.length})
                  </span>
                ),
                children: (
                  <div className="space-y-6">
                    <WriteReviewForm onSubmit={handleReviewSubmit} />
                    {localReviews.length > 0 ? (
                      <div className={`${isMobile ? '' : 'grid grid-cols-3 gap-6'}`}>
                        <div className="col-span-1 mb-6 sm:mb-0">
                          <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50 sticky top-4">
                            <div className="text-center mb-4">
                              <p className="text-4xl font-bold text-gray-900 dark:text-white">
                                {computedRating}
                              </p>
                              <StarRating rating={computedRating} size={16} />
                              <p className="text-xs text-gray-400 mt-1.5">
                                {getRatingLabel(computedRating)} · {localReviews.length} review
                                {localReviews.length !== 1 ? 's' : ''}
                              </p>
                            </div>
                            <RatingBreakdown reviews={localReviews} />
                          </div>
                        </div>
                        <div className="col-span-2 space-y-3">
                          {localReviews.map((review, i) => (
                            <ReviewCard key={review.id} review={review} index={i} />
                          ))}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
                        <Star size={36} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          No reviews yet — be the first!
                        </p>
                      </div>
                    )}
                  </div>
                ),
              },

              // ─── About Tab ─────────────────────────────────────────
              {
                key: 'about',
                label: (
                  <span className="flex items-center gap-1.5">
                    <Users size={15} />
                    About
                  </span>
                ),
                children: (
                  <div className="space-y-5">
                    <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        About {vendor.businessName}
                      </h3>
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {vendor.description}
                      </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
                      <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                        Categories
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {vendor.categories.map((cat) => (
                          <span
                            key={cat}
                            className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300"
                          >
                            {cat}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {vendor.operatingHours && (
                        <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            Operating Hours
                          </h3>
                          <div className="flex items-center gap-2">
                            <Clock size={16} className="text-gray-400" />
                            <span className="text-sm text-gray-700 dark:text-gray-300">
                              {vendor.operatingHours}
                            </span>
                          </div>
                        </div>
                      )}

                      {vendor.acceptedPayments && vendor.acceptedPayments.length > 0 && (
                        <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
                          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                            Accepted Payments
                          </h3>
                          <div className="flex flex-wrap gap-2">
                            {vendor.acceptedPayments.map((pm) => (
                              <span
                                key={pm}
                                className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300"
                              >
                                <CreditCard size={12} className="text-gray-400" />
                                {pm}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {vendor.socialLinks && Object.keys(vendor.socialLinks).length > 0 && (
                      <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
                        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
                          Social & Links
                        </h3>
                        <div className="flex flex-wrap gap-3">
                          {vendor.socialLinks.instagram && (
                            <a
                              href={`https://instagram.com/${vendor.socialLinks.instagram}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-sm font-medium text-purple-700 dark:text-purple-300 hover:shadow-sm transition-all"
                            >
                              <i className="ri-instagram-line text-base" />@
                              {vendor.socialLinks.instagram}
                            </a>
                          )}
                          {vendor.socialLinks.twitter && (
                            <a
                              href={`https://x.com/${vendor.socialLinks.twitter}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:shadow-sm transition-all"
                            >
                              <i className="ri-twitter-x-line text-base" />@
                              {vendor.socialLinks.twitter}
                            </a>
                          )}
                          {vendor.socialLinks.website && (
                            <a
                              href={vendor.socialLinks.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-blue-900/20 rounded-lg text-sm font-medium text-blue dark:text-blue hover:shadow-sm transition-all"
                            >
                              <Globe size={14} />
                              {vendor.socialLinks.website.replace('https://', '')}
                              <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* Desktop Item Detail Modal */}
      {gridModalItem && (
        <ItemDetailModal
          open={gridModalOpen}
          onClose={() => {
            setGridModalOpen(false);
            setGridModalItem(null);
          }}
          item={{
            description: gridModalItem?.description ?? '',
            sponsored: gridModalItem?.sponsored ?? false,
            postUserProfile: gridModalItem?.postUserProfile ?? {},
            media: gridModalItem?.media ?? [],
            askingPrice: gridModalItem?.askingPrice ?? {},
            condition: gridModalItem?.condition ?? 'Brand New',
            comments: gridModalItem?.comments ?? [],
            itemName: gridModalItem?.itemName ?? '',
            id: gridModalItem?.id ?? '',
            productTags: gridModalItem?.productTags ?? [],
            quantity: gridModalItem?.quantity ?? 1,
            isBuyable: gridModalItem?.isBuyable ?? false,
            listingType: gridModalItem?.listingType ?? 'self-listing',
          }}
        />
      )}
    </div>
  );
};

export default VendorDetail;
