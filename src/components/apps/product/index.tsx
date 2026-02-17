'use client';

import React, { useState, useRef, useEffect, useContext } from 'react';
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
import { useRouter } from 'next/navigation';
import { MarketItem, MediaItem } from '@grc/_shared/namespace';
import { numberFormat } from '@grc/_shared/helpers';
import { Badge, Tooltip, message } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import MediaRenderer, { getFirstImageUrl } from '../media-renderer';
import { AppContext } from '@grc/app-context';
import { CartItem } from '@grc/_shared/namespace/cart';
import { setBuyNowItem } from '@grc/_shared/namespace/buy';

interface ProductProps {
  /** The full product item data — passed from parent */
  item: Partial<MarketItem> & {
    media?: MediaItem[];
  };
  setSelectedProductId?: React.Dispatch<React.SetStateAction<string>>;
}

const Product = ({ item, setSelectedProductId }: ProductProps) => {
  const router = useRouter();
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { addToCart, isInCart, cartItems } = useContext(AppContext);

  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  // Media array from item
  const media: MediaItem[] = item.media && item.media.length > 0 ? item.media : [];
  const currentMedia = media[currentMediaIndex];

  // Cart state
  const itemId = item.id ?? '';
  const itemInCart = isInCart(itemId);
  const cartItem = cartItems?.find((i: CartItem) => i.id === itemId);
  const cartQuantity = cartItem?.quantity || 0;
  const isSoldOut = item.availability === false;
  const quantity = item.quantity ?? 1;
  const isMaxQuantityReached = cartQuantity >= quantity;
  const isBuyable = item.isBuyable ?? false;

  // ─── Handlers ───────────────────────────────────────────────

  const buildCartItem = (): CartItem => ({
    id: itemId,
    itemName: item.itemName || '',
    description: item.description || '',
    price: item.askingPrice?.price || 0,
    quantity: 1,
    maxQuantity: quantity,
    image: getFirstImageUrl(media),
    condition: item.condition || 'Brand New',
    negotiable: item.askingPrice?.negotiable || false,
    sellerName: item.postUserProfile?.businessName || item.postUserProfile?.userName || '',
  });

  const handleAddToCart = () => {
    if (isSoldOut) return;
    if (isMaxQuantityReached) {
      message.warning(`Maximum quantity (${quantity}) reached for this item`);
      return;
    }
    if (itemInCart) {
      message.info('Item is already in your cart');
      return;
    }
    addToCart(buildCartItem()?.id);
    message.success('Added to cart!');
  };

  const handleBuyNow = () => {
    if (isSoldOut) return;
    setBuyNowItem(buildCartItem());
    router.push('/checkout?mode=buynow');
  };

  const handleWhatsAppMessage = () => {
    const phoneNumber = item.postUserProfile?.phoneNumber || '';
    if (!phoneNumber) {
      message.error('Seller phone number not available');
      return;
    }
    const formattedPrice = numberFormat((item.askingPrice?.price ?? 0) / 100, Currencies.NGN);
    const sellerName =
      item.postUserProfile?.businessName || item.postUserProfile?.userName || 'Seller';

    const msg = `Hi, ${sellerName},
I am interested in this item on Comaket.

Item Id: ${itemId}
Name: ${item.itemName}
Description: ${item.description}
Price: ${formattedPrice}`;

    const encodedMessage = encodeURIComponent(msg);
    window.open(`https://wa.me/${phoneNumber}?text=${encodedMessage}`, '_blank');
  };

  const handleBookmark = () => {
    try {
      const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
      if (isSaved) {
        const updated = savedItems.filter((id: string | number) => id !== itemId);
        localStorage.setItem('savedItems', JSON.stringify(updated));
        setIsSaved(false);
      } else {
        if (!savedItems.includes(itemId)) savedItems.push(itemId);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        setIsSaved(true);
      }
      window.dispatchEvent(new Event('savedItemsChanged'));
    } catch (err) {
      console.error('Error managing bookmarks:', err);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: item.itemName || '',
      text: `Check out this item: ${item.itemName} - ${numberFormat(
        (item.askingPrice?.price ?? 0) / 100,
        Currencies.NGN
      )}`,
      url: `${window.location.origin}/product/${itemId}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        message.success('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const handleGoBack = () => {
    setSelectedProductId?.('');
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

  // ─── Effects ────────────────────────────────────────────────

  // Load saved state
  useEffect(() => {
    try {
      const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
      setIsSaved(savedItems.includes(itemId));
    } catch (err) {
      console.error('Error loading bookmarks:', err);
    }
  }, [itemId]);

  // Touch swipe for mobile media carousel
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
      className={`bg-white dark:bg-gray-800 ${
        isMobile ? 'fixed inset-0 z-[100] overflow-y-auto' : 'rounded-lg mt-10'
      }`}
    >
      {/* ─── Sticky back header ─── */}
      <div
        className={`sticky top-0 left-0 w-full py-3 z-50 bg-white dark:bg-gray-800 border-b border-gray-100 dark:border-zinc-800 ${
          isMobile ? 'px-3 pt-9' : 'px-0'
        }`}
      >
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={handleGoBack}
          className="text-neutral-500 dark:text-gray-400 hover:text-blue font-semibold flex text-base gap-1.5 items-center"
        >
          <ArrowLeft size={20} />
          <span>Back</span>
        </motion.button>
      </div>

      <div className={`${isMobile ? 'px-3 mb-48' : 'pb-6'}`}>
        {/* ─── Seller Info ─── */}
        <div className="flex items-center gap-3 my-4">
          <div className="relative w-11 h-11">
            <img
              src={item.postUserProfile?.profilePicUrl ?? ''}
              alt="Seller"
              className="rounded-full object-cover w-full h-full"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-gray-900 dark:text-white">
                {item.postUserProfile?.businessName || item.postUserProfile?.userName}
              </h3>
              {item.postUserProfile?.isVerified && <span className="text-blue text-xs">✓</span>}
            </div>
            <div className="flex items-center gap-3 text-[12px] text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {item.postUserProfile?.location || 'Nigeria'}
              </span>
              {item.createdAt && (
                <span className="flex items-center gap-1">
                  <Clock size={14} />
                  {new Date(item.createdAt).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ─── Main content: Image + Details ─── */}
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'gap-8'}`}>
          {/* Left — Media Carousel */}
          <div
            className={`relative w-full md:w-3/5 overflow-hidden ${
              isMobile ? 'rounded-sm' : 'rounded-md'
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

                  {/* Dots indicator */}
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
                        : 'text-gray-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
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

              {/* Low stock warning */}
              {!isSoldOut && quantity > 0 && quantity <= 5 && (
                <div className="absolute bottom-4 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full z-10">
                  Only {quantity} left
                </div>
              )}
            </div>
          </div>

          {/* Right — Details */}
          <div className={`${isMobile ? 'w-full' : 'w-1/2 min-h-[100%] overflow-y-auto'} relative`}>
            <div className="space-y-4">
              {/* Title + Price */}
              <div>
                <h2 className="text-xl font-semibold mb-1 text-gray-900 dark:text-white">
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

              {/* Tags */}
              {item.productTags && item.productTags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {item.productTags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-full"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Description */}
              <div className="bg-gray-50 dark:bg-zinc-900/50 rounded-lg p-3">
                <h4 className="font-medium mb-2 text-gray-900 dark:text-white">Description</h4>
                <p
                  className={`text-gray-600 dark:text-gray-400 text-sm ${
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

            {/* ─── Fixed bottom actions ─── */}
            <div
              className={`${
                isMobile
                  ? 'fixed bottom-0 left-0 right-0 px-3 py-3 pb-20'
                  : 'sticky bottom-0 pt-4 mt-6'
              } bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-zinc-800 z-40`}
            >
              {/* Comment input */}
              {/* <div className="mb-3 w-full">
                <div className="flex gap-3 w-full items-start">
                  <img
                    src={item.postUserProfile?.profilePicUrl ?? ''}
                    alt="user"
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <CommentBox />
                  </div>
                </div>
              </div> */}

              {/* CTA buttons — conditional on isBuyable */}
              {isBuyable ? (
                <div className="space-y-2">
                  {/* Buy Now + Add to Cart */}
                  <div className="flex items-center gap-1.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      disabled={isSoldOut}
                      className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-1.5 shadow-sm text-sm transition-all ${
                        isSoldOut
                          ? 'bg-gray-200 dark:bg-zinc-700 text-gray-400 cursor-not-allowed'
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
                        onClick={handleAddToCart}
                        disabled={isSoldOut || isMaxQuantityReached}
                        className={`p-3 rounded-lg border shadow-sm transition-colors ${
                          isSoldOut || isMaxQuantityReached
                            ? 'bg-gray-100 dark:bg-zinc-800 border-gray-200 dark:border-zinc-700 text-gray-300 cursor-not-allowed'
                            : itemInCart
                              ? 'bg-indigo-50 border-blue text-blue dark:bg-blue/20 dark:border-blue'
                              : 'bg-neutral-100 border-neutral-200 dark:bg-gray-700 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue hover:text-blue'
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
                      onClick={handleWhatsAppMessage}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-1.5 shadow-sm text-sm"
                    >
                      <MessageCircle size={16} />
                      WhatsApp
                    </motion.button>

                    <Tooltip title={isSaved ? 'Remove from saved' : 'Save item'}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleBookmark}
                        className={`p-3 rounded-lg border shadow-sm transition-colors ${
                          isSaved
                            ? 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800'
                            : 'bg-neutral-100 border-neutral-200 dark:bg-gray-700 dark:border-gray-600'
                        }`}
                      >
                        <Bookmark
                          size={18}
                          className={`${
                            isSaved
                              ? 'fill-pink-500 text-pink-500'
                              : 'text-gray-500 dark:text-gray-400'
                          } transition-colors`}
                        />
                      </motion.button>
                    </Tooltip>

                    <Tooltip title="Share">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                        className="p-3 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-100 dark:bg-gray-700 shadow-sm"
                      >
                        <Share2 size={18} className="text-gray-500 dark:text-gray-400" />
                      </motion.button>
                    </Tooltip>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  {/* NOT BUYABLE: WhatsApp as primary */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsAppMessage}
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
                        onClick={handleBookmark}
                        className={`flex-1 p-3 rounded-lg border shadow-sm transition-colors flex items-center justify-center gap-1.5 text-sm ${
                          isSaved
                            ? 'bg-pink-50 border-pink-200 dark:bg-pink-900/20 dark:border-pink-800 text-pink-500'
                            : 'bg-neutral-100 border-neutral-200 dark:bg-gray-700 dark:border-gray-600 text-gray-500'
                        }`}
                      >
                        <Bookmark
                          size={16}
                          className={
                            isSaved
                              ? 'fill-pink-500 text-pink-500'
                              : 'text-gray-500 dark:text-gray-400'
                          }
                        />
                        Save
                      </motion.button>
                    </Tooltip>

                    <Tooltip title="Share">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                        className="flex-1 p-3 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-100 dark:bg-gray-700 shadow-sm flex items-center justify-center gap-1.5 text-sm text-gray-500"
                      >
                        <Share2 size={16} className="text-gray-500 dark:text-gray-400" />
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
