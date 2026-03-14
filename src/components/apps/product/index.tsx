'use client';

import React, { useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Currencies } from '@grc/_shared/constant';
import {
  ArrowLeft,
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  MapPin,
  MessageCircle,
  Share2,
  ShoppingBag,
  ShoppingCart,
} from 'lucide-react';
import { MarketItem, MediaItem } from '@grc/_shared/namespace';
import { numberFormat } from '@grc/_shared/helpers';
import { Badge, Tooltip } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import MediaRenderer from '../media-renderer';

interface ProductProps {
  item: Partial<MarketItem> & { media?: MediaItem[] };

  // State from parent
  isInCart?: boolean;
  isSaved?: boolean;
  cartQuantity?: number;
  // Handlers from parent
  onAddToCart?: () => void;
  onBuyNow?: () => void;
  onToggleSave?: () => void;
  onWhatsAppMessage?: () => void;
  onShare?: () => void;
  onGoBack?: () => void;

  // Legacy support — if rendered from Market list view with setSelectedProductId
  setSelectedProductId?: React.Dispatch<React.SetStateAction<string>>;
}

const Product = ({
  item,
  isInCart: itemInCart = false,
  isSaved = false,
  cartQuantity = 0,
  onAddToCart,
  onBuyNow,
  onToggleSave,
  onWhatsAppMessage,
  onShare,
  onGoBack,
  setSelectedProductId,
}: ProductProps) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Media
  const media: MediaItem[] = item.media && item.media.length > 0 ? item.media : [];
  const currentMedia = media[currentMediaIndex];

  // Derived
  const isSoldOut = item.availability === false;
  const quantity = item.quantity ?? 1;
  const isMaxQuantityReached = cartQuantity >= quantity;
  const isBuyable = item.isBuyable ?? false;

  // ─── Handlers ───────────────────────────────────────────────

  const handleGoBack = () => {
    if (setSelectedProductId) {
      setSelectedProductId('');
    } else {
      onGoBack?.();
    }
  };

  // ─── Media navigation ──────────────────────────────────────

  const nextMedia = () => {
    if (currentMediaIndex < media.length - 1) {
      setSlideDirection(1);
      setCurrentMediaIndex((prev) => prev + 1);
    }
  };

  const prevMedia = () => {
    if (currentMediaIndex > 0) {
      setSlideDirection(-1);
      setCurrentMediaIndex((prev) => prev - 1);
    }
  };

  // Touch swipe for mobile
  useEffect(() => {
    const container = imageContainerRef.current;
    if (!container || !isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartXRef.current === null) return;
      const diffX = e.changedTouches[0].clientX - touchStartXRef.current;
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentMediaIndex > 0) prevMedia();
        else if (diffX < 0 && currentMediaIndex < media.length - 1) nextMedia();
      }
      touchStartXRef.current = null;
    };

    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchend', handleTouchEnd);
    return () => {
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, currentMediaIndex, media.length]);

  // ─── Render ─────────────────────────────────────────────────

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-neutral-800 ${
        isMobile ? 'fixed inset-0 z-[100] overflow-y-auto' : 'rounded-lg mt-10'
      }`}
    >
      {/* Back header */}
      <div
        className={`sticky top-0 left-0 w-full z-50 bg-white/90 dark:bg-neutral-800/90 backdrop-blur-md border-b border-neutral-100 dark:border-zinc-800 ${
          isMobile ? 'px-3 pt-8 pb-2' : 'py-3 px-0'
        }`}
      >
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 text-neutral-600 dark:text-neutral-300  transition-colors"
        >
          <div className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
            <ArrowLeft size={16} />
          </div>
          <span className="text-sm font-medium">Back</span>
        </button>
      </div>

      <div className={`${isMobile ? 'pb-20' : 'pb-6'}`}>
        {/* Seller Info */}
        <div className={`flex items-center gap-2.5 my-3 ${isMobile ? 'px-3' : ''}`}>
          <div className="relative w-8 h-8">
            <img
              src={item.postUserProfile?.profilePicUrl ?? ''}
              alt="Seller"
              className="rounded-full object-cover w-full h-full"
              onError={(e) => {
                (e.target as HTMLImageElement).src = '/default-avatar.png';
              }}
            />
            <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-[1.5px] border-white dark:border-neutral-800" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="font-medium text-sm text-neutral-900 dark:text-white truncate">
                {item.postUserProfile?.displayName || item.postUserProfile?.userName}
              </h3>
              {item.postUserProfile?.isVerified && (
                <i className="ri-verified-badge-fill text-[#1D9BF0] text-[13px]" />
              )}
            </div>
            <div className="flex items-center gap-2 text-[11px] text-neutral-500 dark:text-neutral-400">
              <span className="flex items-center gap-0.5">
                <MapPin size={12} />
                {item.postUserProfile?.location || 'Nigeria'}
              </span>
              {item.createdAt && (
                <span className="flex items-center gap-0.5">
                  <Clock size={12} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main content: Image + Details */}
        <div className={`flex ${isMobile ? 'flex-col gap-3' : 'gap-8'}`}>
          {/* Left — Media Carousel */}
          <div
            className={`relative w-full md:w-3/5 overflow-hidden ${
              isMobile ? 'rounded-none' : 'rounded-md'
            }`}
          >
            <div ref={imageContainerRef} className="relative aspect-square">
              <AnimatePresence initial={false} custom={slideDirection}>
                <motion.div
                  key={currentMediaIndex}
                  custom={slideDirection}
                  initial={{ x: slideDirection * 100 + '%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: slideDirection * -100 + '%', opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className="absolute inset-0 rounded-sm"
                >
                  {currentMedia && (
                    <MediaRenderer
                      media={currentMedia}
                      alt={`${item.itemName} - ${currentMediaIndex + 1}`}
                      priority
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Nav arrows */}
              {media.length > 1 && (
                <>
                  {currentMediaIndex > 0 && (
                    <button
                      onClick={prevMedia}
                      className={`absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white ${
                        isMobile ? 'p-1' : 'p-2'
                      } rounded-full backdrop-blur-sm transition-colors z-10`}
                    >
                      <ChevronLeft className={isMobile ? 'w-4 h-4' : 'w-6 h-6'} />
                    </button>
                  )}
                  {currentMediaIndex < media.length - 1 && (
                    <button
                      onClick={nextMedia}
                      className={`absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white ${
                        isMobile ? 'p-1' : 'p-2'
                      } rounded-full backdrop-blur-sm transition-colors z-10`}
                    >
                      <ChevronRight className={isMobile ? 'w-4 h-4' : 'w-6 h-6'} />
                    </button>
                  )}

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5 z-10">
                    {media.map((m, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSlideDirection(index > currentMediaIndex ? 1 : -1);
                          setCurrentMediaIndex(index);
                        }}
                        className={`rounded-full transition-all duration-200 ${
                          currentMediaIndex === index
                            ? 'bg-white w-2.5 h-2.5'
                            : 'bg-white/30 border border-white/60 w-2 h-2'
                        } ${m.type === 'video' ? 'ring-1 ring-white/50' : ''}`}
                        title={m.type === 'video' ? 'Video' : 'Image'}
                      />
                    ))}
                  </div>
                </>
              )}

              {/* Condition badge */}
              <Badge
                className="absolute top-3 right-3 backdrop-blur-2xl !rounded-full shadow-2xl z-10"
                count={
                  <span className="px-2 py-1 !text-[10px] !text-white font-semibold">
                    {item.condition}
                  </span>
                }
                color="white"
              />

              {/* Availability badge */}
              <Badge
                className={`absolute top-3 left-3 backdrop-blur-2xl !rounded-full shadow-2xl z-10 ${
                  !isSoldOut
                    ? 'bg-gradient-to-br from-emerald-400/30 via-green-400/25 to-teal-400/30 border border-emerald-200/50'
                    : 'bg-gradient-to-br from-red-400/25 via-red-400/20 to-red-500/25 border border-red-200/40'
                }`}
                count={
                  <div
                    className={`px-2 py-1 text-[10px] !flex gap-2 items-center font-semibold ${
                      !isSoldOut
                        ? 'text-white drop-shadow-[0_2px_12px_rgba(16,185,129,0.8)]'
                        : 'text-neutral-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                    }`}
                  >
                    <div
                      className={`relative w-2 h-2 rounded-full ${
                        !isSoldOut
                          ? 'bg-emerald-300 shadow-[0_0_16px_rgba(52,211,153,1)] animate-pulse'
                          : 'bg-red-300 shadow-[0_0_8px_rgba(156,163,175,0.6)]'
                      }`}
                    >
                      {!isSoldOut && (
                        <div className="absolute inset-0 rounded-full bg-emerald-200 animate-ping opacity-75" />
                      )}
                    </div>
                    <span className="tracking-wide">{!isSoldOut ? 'Available' : 'Sold Out'}</span>
                  </div>
                }
                color={!isSoldOut ? 'green' : 'default'}
              />

              {/* Low stock */}
              {!isSoldOut && quantity > 0 && quantity <= 5 && (
                <div className="absolute bottom-4 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full z-10">
                  Only {quantity} left
                </div>
              )}
            </div>
          </div>

          {/* Right — Details */}
          <div
            className={`${
              isMobile ? 'w-full px-3' : 'w-1/2 min-h-[100%] overflow-y-auto'
            } relative`}
          >
            <div className="space-y-4">
              {/* Title + Price */}
              <div>
                <h2 className="text-xl font-semibold mb-1 text-neutral-900 dark:text-white">
                  {item.itemName}
                </h2>

                {!isBuyable && (
                  <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full mb-2">
                    Seller Listing — Contact to Purchase
                  </span>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    {numberFormat((item.askingPrice?.price ?? 0) / 100, Currencies.NGN)}
                  </span>
                  {item.askingPrice?.negotiable && (
                    <span className="text-[12px] bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full font-medium">
                      Negotiable
                    </span>
                  )}
                </div>
              </div>

              {/* Condition + Location */}
              <div className="flex flex-wrap items-center gap-2">
                {item.condition && (
                  <span
                    className={`inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-full ${
                      item.condition === 'Brand New'
                        ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
                        : item.condition === 'Fairly Used'
                          ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400'
                          : 'bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400'
                    }`}
                  >
                    {item.condition}
                  </span>
                )}
                {item.postUserProfile?.location && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-medium bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 rounded-full">
                    <MapPin size={11} />
                    {item.postUserProfile.location}
                  </span>
                )}
              </div>

              {/* Tags */}
              {item.productTags && item.productTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.productTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-neutral-100 dark:bg-zinc-800 text-neutral-700 dark:text-neutral-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="bg-neutral-50 dark:bg-zinc-900/50 rounded-lg p-3">
                <h4 className="font-medium mb-2 text-neutral-900 dark:text-white">Description</h4>
                <p
                  className={`text-neutral-600 dark:text-neutral-400 text-sm ${
                    !isDescriptionExpanded && 'line-clamp-3'
                  }`}
                >
                  {item.description}
                </p>
                {(item.description?.length ?? 0) > 150 && (
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-blue text-sm mt-2 font-medium"
                  >
                    Show {isDescriptionExpanded ? 'less' : 'more'}
                  </button>
                )}
              </div>
            </div>

            {/* ─── Bottom actions ─── */}
            <div
              className={`${
                isMobile ? 'pt-4 mt-4 pb-6' : 'sticky bottom-0 pt-4 mt-6'
              } bg-white dark:bg-neutral-800 border-t border-neutral-100 dark:border-zinc-800 z-40`}
            >
              {isBuyable ? (
                <div className="space-y-2">
                  <div className="flex items-center gap-1.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onBuyNow}
                      disabled={isSoldOut}
                      className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-1.5 shadow-sm text-sm transition-all ${
                        isSoldOut
                          ? 'bg-neutral-200 dark:bg-zinc-700 text-neutral-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-blue to-indigo-700 hover:from-blue hover:to-indigo-800 text-white hover:shadow-md'
                      }`}
                    >
                      <ShoppingBag size={16} />
                      Buy Now
                    </motion.button>

                    <Tooltip
                      title={
                        isSoldOut
                          ? 'Sold out'
                          : isMaxQuantityReached
                            ? `Max quantity (${quantity}) reached`
                            : itemInCart
                              ? 'Already in cart'
                              : 'Add to cart'
                      }
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onAddToCart}
                        disabled={isSoldOut || isMaxQuantityReached}
                        className={`p-3 rounded-lg border shadow-sm transition-colors ${
                          isSoldOut || isMaxQuantityReached
                            ? 'bg-neutral-100 dark:bg-zinc-800 border-neutral-200 dark:border-zinc-700 text-neutral-300 cursor-not-allowed'
                            : itemInCart
                              ? 'bg-indigo-50 border-blue text-blue dark:bg-blue/20 dark:border-blue'
                              : 'bg-neutral-100 border-neutral-200 dark:bg-neutral-700 dark:border-neutral-600 text-neutral-600 dark:text-neutral-400 hover:border-blue '
                        }`}
                      >
                        <ShoppingCart size={18} />
                      </motion.button>
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={onWhatsAppMessage}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-1.5 shadow-sm text-sm"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </motion.button>

                    <Tooltip title={isSaved ? 'Remove from saved' : 'Save item'}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onToggleSave}
                        className={`p-3 rounded-lg border shadow-sm transition-colors ${
                          isSaved
                            ? 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800'
                            : 'bg-neutral-100 border-neutral-200 dark:bg-neutral-700 dark:border-neutral-600'
                        }`}
                      >
                        <Bookmark
                          size={18}
                          className={`${
                            isSaved
                              ? 'fill-pink-500 text-pink-500'
                              : 'text-neutral-500 dark:text-neutral-400'
                          } transition-colors`}
                        />
                      </motion.button>
                    </Tooltip>

                    <Tooltip title="Share">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onShare}
                        className="p-3 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-700 shadow-sm"
                      >
                        <Share2 size={18} className="text-neutral-500 dark:text-neutral-400" />
                      </motion.button>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onWhatsAppMessage}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-1.5 shadow-sm text-sm"
                  >
                    <MessageCircle size={16} />
                    Message on WhatsApp
                  </motion.button>

                  <div className="flex items-center gap-1.5">
                    <Tooltip title={isSaved ? 'Remove from saved' : 'Save item'}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onToggleSave}
                        className={`flex-1 p-3 rounded-lg border shadow-sm transition-colors flex items-center justify-center gap-1.5 text-sm ${
                          isSaved
                            ? 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800 text-pink-500'
                            : 'bg-neutral-100 border-neutral-200 dark:bg-neutral-700 dark:border-neutral-600 text-neutral-500'
                        }`}
                      >
                        <Bookmark
                          size={16}
                          className={
                            isSaved
                              ? 'fill-pink-500 text-pink-500'
                              : 'text-neutral-500 dark:text-neutral-400'
                          }
                        />
                        Save
                      </motion.button>
                    </Tooltip>

                    <Tooltip title="Share">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={onShare}
                        className="flex-1 p-3 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-100 dark:bg-neutral-700 shadow-sm flex items-center justify-center gap-1.5 text-sm text-neutral-500"
                      >
                        <Share2 size={16} className="text-neutral-500 dark:text-neutral-400" />
                        Share
                      </motion.button>
                    </Tooltip>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
