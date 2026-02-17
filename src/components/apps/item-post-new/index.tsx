import React, { useState, useRef, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Tooltip, message } from 'antd';
import {
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  MessageCircle,
  ShoppingCart,
  ShoppingBag,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { numberFormat } from '@grc/_shared/helpers';
import TruncatedDescription from '@grc/_shared/components/truncated-description';
import ItemDetailModal from '../item-detail-modal';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { Currencies } from '@grc/_shared/constant';
import { AppContext } from '@grc/app-context';
import { CartItem } from '@grc/_shared/namespace/cart';
import { setBuyNowItem } from '@grc/_shared/namespace/buy';
import { ListingType, MediaItem } from '@grc/_shared/namespace';
import MediaRenderer, { getFirstImageUrl } from '../media-renderer';

interface ItemPostProps {
  description: string;
  sponsored: boolean;
  postUserProfile: Record<string, any>;
  media: MediaItem[];
  askingPrice: Record<string, any>;
  condition: 'Brand New' | 'Fairly Used' | 'Uk Used';
  availability?: boolean;
  quantity?: number;
  comments: Record<string, any>[];
  itemName: string;
  id: string | number;
  productTags?: string[];
  setSelectedProductId?: React.Dispatch<React.SetStateAction<string>>;
  isBuyable: boolean;
  listingType: ListingType;
}

const ModernItemPost: React.FC<ItemPostProps> = ({
  description,
  sponsored,
  postUserProfile,
  media,
  askingPrice,
  condition,
  availability = true,
  quantity = 1,
  comments,
  itemName,
  setSelectedProductId,
  id,
  productTags = [],
  isBuyable,
  listingType,
}) => {
  const router = useRouter();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { addToCart, isInCart, cartItems } = useContext(AppContext);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const itemInCart = isInCart(id);
  const cartItem = cartItems?.find((i: CartItem) => i.id === id);
  const cartQuantity = cartItem?.quantity || 0;
  const isSoldOut = !availability;
  const isMaxQuantityReached = cartQuantity >= quantity;

  const currentMedia = media?.[currentMediaIndex];

  const handleBookmark = () => {
    try {
      const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');

      if (isSaved) {
        const updatedItems = savedItems.filter((itemId: string | number) => itemId !== id);
        localStorage.setItem('savedItems', JSON.stringify(updatedItems));
        setIsSaved(false);
      } else {
        if (!savedItems.includes(id)) {
          savedItems.push(id);
          localStorage.setItem('savedItems', JSON.stringify(savedItems));
        }
        setIsSaved(true);
      }

      window.dispatchEvent(new Event('savedItemsChanged'));
    } catch (error) {
      console.error('Error managing bookmarks:', error);
    }
  };

  const buildCartItem = (): CartItem => ({
    id,
    itemName,
    description,
    price: askingPrice?.price || 0,
    quantity: 1,
    maxQuantity: quantity,
    image: getFirstImageUrl(media),
    condition,
    negotiable: askingPrice?.negotiable || false,
    sellerName: postUserProfile?.businessName || postUserProfile?.userName || '',
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
    const phoneNumber = postUserProfile?.phoneNumber || '';
    if (!phoneNumber) {
      message.error('Seller phone number not available');
      return;
    }
    const formattedPrice = numberFormat(askingPrice?.price / 100, Currencies.NGN);
    const sellerName = postUserProfile?.businessName || postUserProfile?.userName || 'Seller';

    const msg = `Hi, ${sellerName},
I am interested in this item on Comaket.

Item Id: ${id}
Name: ${itemName}
Description: ${description}
Price: ${formattedPrice}`;

    const encodedMessage = encodeURIComponent(msg);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    try {
      const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
      setIsSaved(savedItems.includes(id));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  }, [id, isModalOpen]);

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

  const handleViewItem = () => {
    if (!isMobile) {
      setIsModalOpen(true);
    } else {
      setSelectedProductId?.(id?.toString());
    }
  };

  /** Navigate to vendor profile page */
  const handleVendorClick = () => {
    const vendorId = postUserProfile?.id || postUserProfile?.userName;
    if (vendorId) {
      router.push(`/vendors/${encodeURIComponent(vendorId)}`);
    }
  };

  const handleShare = async () => {
    const shareData = {
      title: itemName,
      text: `Check out this item: ${itemName} - ${numberFormat(
        askingPrice?.price / 100,
        Currencies.NGN
      )}`,
      url: `${window.location.origin}/product/${id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/product/${id}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Touch swipe handlers
  useEffect(() => {
    const imageContainer = imageContainerRef.current;
    if (!imageContainer || !isMobile) return;

    const handleTouchStart = (e: TouchEvent) => {
      touchStartXRef.current = e.touches[0].clientX;
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (touchStartXRef.current === null) return;
      const touchEndX = e.changedTouches[0].clientX;
      const diffX = touchEndX - touchStartXRef.current;

      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentMediaIndex > 0) prevMedia();
        else if (diffX < 0 && currentMediaIndex < media.length - 1) nextMedia();
      }
      touchStartXRef.current = null;
    };

    imageContainer.addEventListener('touchstart', handleTouchStart);
    imageContainer.addEventListener('touchend', handleTouchEnd);
    return () => {
      imageContainer.removeEventListener('touchstart', handleTouchStart);
      imageContainer.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, currentMediaIndex, media.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b border-gray-100 dark:border-zinc-800 py-8 first:pt-0"
    >
      {/* Seller info */}
      <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'px-2' : ''}`}>
        <div className="relative w-10 h-10 cursor-pointer" onClick={handleVendorClick}>
          <img
            src={postUserProfile?.profilePicUrl}
            alt="Seller"
            className="rounded-full object-cover w-full h-full"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3
              className="font-medium cursor-pointer hover:text-blue transition-colors"
              onClick={handleVendorClick}
            >
              {postUserProfile?.businessName || postUserProfile?.userName}
            </h3>
            {postUserProfile?.isVerified && (
              <i
                className={`ri-verified-badge-fill ${
                  postUserProfile?.isSuperVerified ? 'text-[#D4A017]' : 'text-[#1D9BF0]'
                } text-[18px]`}
              />
            )}
          </div>
          <div className="flex items-center gap-3 text-[12px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>{postUserProfile?.location || 'Nigeria'}</span>
            </div>
          </div>
        </div>
      </div>

      <div className={`flex flex-col md:flex-row w-full ${isMobile ? 'gap-2' : 'gap-8'}`}>
        {/* Left section — Media Carousel */}
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
                className="absolute inset-0 rounded-sm cursor-pointer"
              >
                {currentMedia && (
                  <MediaRenderer
                    media={currentMedia}
                    alt={`${itemName} - ${currentMediaIndex + 1}`}
                    priority
                    onClick={handleViewItem}
                  />
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            {media.length > 1 && (
              <>
                {currentMediaIndex > 0 && (
                  <button
                    onClick={prevMedia}
                    className={`absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white ${
                      isMobile ? 'p-1' : 'p-2'
                    } rounded-full backdrop-blur-sm transition-colors z-10`}
                  >
                    <ChevronLeft className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                  </button>
                )}
                {currentMediaIndex < media.length - 1 && (
                  <button
                    onClick={nextMedia}
                    className={`absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white ${
                      isMobile ? 'p-1' : 'p-2'
                    } rounded-full backdrop-blur-sm transition-colors z-10`}
                  >
                    <ChevronRight className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
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

            <Badge
              className="absolute top-3 right-3 backdrop-blur-2xl !rounded-full shadow-2xl z-10"
              count={
                <span className="px-2 py-1 !text-[10px] !text-white font-semibold">
                  {condition}
                </span>
              }
              color={'white'}
            />

            <Badge
              className={`absolute top-3 left-3 backdrop-blur-2xl !rounded-full shadow-2xl z-10 ${
                availability
                  ? 'bg-gradient-to-br from-emerald-400/30 via-green-400/25 to-teal-400/30 border border-emerald-200/50'
                  : 'bg-gradient-to-br from-red-400/25 via-red-400/20 to-red-500/25 border border-red-200/40'
              }`}
              count={
                <div
                  className={`px-2 py-1 text-[10px] !flex gap-2 items-center font-semibold ${
                    availability
                      ? 'text-white drop-shadow-[0_2px_12px_rgba(16,185,129,0.8)]'
                      : 'text-gray-200 drop-shadow-[0_2px_8px_rgba(0,0,0,0.3)]'
                  }`}
                >
                  <div
                    className={`relative w-2 h-2 rounded-full ${
                      availability
                        ? 'bg-emerald-300 shadow-[0_0_16px_rgba(52,211,153,1)] animate-pulse'
                        : 'bg-red-300 shadow-[0_0_8px_rgba(156,163,175,0.6)]'
                    }`}
                  >
                    {availability && (
                      <div className="absolute inset-0 rounded-full bg-emerald-200 animate-ping opacity-75" />
                    )}
                  </div>
                  <span className="tracking-wide">{availability ? 'Available' : 'Sold Out'}</span>
                </div>
              }
              color={availability ? 'green' : 'default'}
            />

            {availability && quantity > 0 && quantity <= 5 && (
              <div className="absolute bottom-4 right-3 bg-black/60 backdrop-blur-sm text-white text-[10px] font-semibold px-2 py-1 rounded-full z-10">
                Only {quantity} left
              </div>
            )}
          </div>
        </div>

        {/* Right section — Product Details */}
        <div className={`w-full md:w-1/2 ${isMobile ? 'px-2' : ''} flex flex-col`}>
          <div className="space-y-3 mb-4">
            <div>
              <h2 className="text-xl font-semibold mb-1 cursor-pointer" onClick={handleViewItem}>
                {itemName}
              </h2>

              {!isBuyable && (
                <span className="inline-flex items-center px-2 py-0.5 text-[11px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full mb-2">
                  Seller Listing — Contact to Purchase
                </span>
              )}

              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                  {numberFormat(askingPrice?.price / 100, Currencies.NGN)}
                </span>
                {askingPrice?.negotiable && (
                  <span className="text-[12px] bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full font-medium">
                    Negotiable
                  </span>
                )}
              </div>
            </div>

            <TruncatedDescription description={description} max={100} />

            {productTags && productTags.length > 0 && (
              <div className="flex flex-wrap gap-2 py-2">
                {productTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="mt-auto" />

          {/* Action buttons — conditional on isBuyable */}
          <div className="space-y-2">
            {isBuyable ? (
              <>
                {/* BUYABLE: Buy Now + Add to Cart */}
                <div className="flex items-center gap-1.5">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleBuyNow}
                    disabled={isSoldOut}
                    className={`flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-1.5 shadow-sm text-sm transition-all ${
                      isSoldOut
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
                          ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                          : itemInCart
                            ? 'bg-indigo-50 border-blue text-blue dark:bg-blue/20 dark:border-blue'
                            : 'bg-neutral-100 border-neutral-200 dark:bg-gray-700 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:border-blue hover:text-blue'
                      }`}
                    >
                      <ShoppingCart size={18} />
                    </motion.button>
                  </Tooltip>
                </div>

                {/* BUYABLE: WhatsApp + Save + Share */}
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
              </>
            ) : (
              <>
                {/* NOT BUYABLE: WhatsApp + Save + Share */}
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
                        className={`${
                          isSaved
                            ? 'fill-pink-500 text-pink-500'
                            : 'text-gray-500 dark:text-gray-400'
                        } transition-colors`}
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
              </>
            )}
          </div>
        </div>
      </div>

      <ItemDetailModal
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        item={{
          description,
          sponsored,
          postUserProfile,
          media,
          askingPrice,
          condition,
          comments,
          itemName,
          id,
          productTags,
          quantity,
          isBuyable,
          listingType,
        }}
      />
    </motion.div>
  );
};

export default ModernItemPost;
