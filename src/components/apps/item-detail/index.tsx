import React, { useState, useEffect, useContext } from 'react';
import { Tag, Tooltip, message as antMessage } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Clock,
  MessageCircle,
  ShoppingCart,
  ShoppingBag,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import { capitalize, startCase } from 'lodash';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import { CartItem } from '@grc/_shared/namespace/cart';
import { setBuyNowItem } from '@grc/_shared/namespace/buy';
import { ListingType, MediaItem } from '@grc/_shared/namespace';
import MediaRenderer, { getFirstImageUrl } from '../media-renderer';

interface ItemDetailProps {
  item: {
    description: string;
    sponsored: boolean;
    postUserProfile: Record<string, any>;
    media: MediaItem[];
    askingPrice: Record<string, any>;
    condition: string;
    comments: Record<string, any>[];
    itemName: string;
    productTags?: string[];
    id: string | number;
    quantity?: number;
    isBuyable: boolean;
    listingType: ListingType;
    status?: 'pending' | 'approved' | 'rejected';
    feePaymentStatus?:
      | 'pending'
      | 'processed'
      | 'awaiting payment'
      | 'awaiting approval'
      | undefined;
    platformFee?: number;
    live?: boolean;
  };
  isSellerView?: boolean;
  onClose?: () => void;
}

const ItemDetail: React.FC<ItemDetailProps> = ({ item, isSellerView }) => {
  const router = useRouter();
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { addToCart, isInCart, cartItems } = useContext(AppContext);

  const itemInCart = isInCart(item?.id);
  const maxQuantity = item?.quantity ?? 1;
  const cartItem = cartItems?.find((i: CartItem) => i.id === item?.id);
  const cartQuantity = cartItem?.quantity || 0;
  const isMaxQuantityReached = cartQuantity >= maxQuantity;

  const currentMedia = item.media[currentMediaIndex];

  const buildCartItem = (): CartItem => ({
    id: item.id,
    itemName: item.itemName,
    description: item.description,
    price: item.askingPrice?.price || 0,
    quantity: 1,
    maxQuantity,
    image: getFirstImageUrl(item.media),
    condition: item.condition,
    negotiable: item.askingPrice?.negotiable || false,
    sellerName: item.postUserProfile?.businessName || item.postUserProfile?.userName || '',
  });

  const handleAddToCart = () => {
    if (isMaxQuantityReached) {
      antMessage.warning(`Maximum quantity (${maxQuantity}) reached for this item`);
      return;
    }
    if (isInCart(item?.id)) {
      antMessage.info('Item is already in your cart');
      return;
    }
    addToCart(item?.id);
    antMessage.success('Added to cart!');
  };

  const handleBuyNow = () => {
    setBuyNowItem(buildCartItem());
    router.push('/checkout?mode=buynow');
  };

  const handleWhatsAppMessage = () => {
    const phoneNumber = item.postUserProfile?.phoneNumber || '';
    if (!phoneNumber) {
      antMessage.error('Seller phone number not available');
      return;
    }
    const formattedPrice = numberFormat(item?.askingPrice?.price / 100, Currencies.NGN);
    const sellerName =
      item.postUserProfile?.businessName || item.postUserProfile?.userName || 'Seller';

    const message = `Hi, ${sellerName},
I am interested in this item on Comaket.

Item Id: ${item?.id}
Name: ${item?.itemName}
Description: ${item?.description}
Price: ${formattedPrice}`;

    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    window.open(whatsappUrl, '_blank');
  };

  const nextMedia = () => {
    setSlideDirection(1);
    setCurrentMediaIndex((prev) => (prev + 1) % item.media.length);
  };

  const prevMedia = () => {
    setSlideDirection(-1);
    setCurrentMediaIndex((prev) => (prev - 1 + item.media.length) % item.media.length);
  };

  const handleBookmark = () => {
    try {
      const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
      if (isSaved) {
        const updatedItems = savedItems.filter((itemId: string | number) => itemId !== item.id);
        localStorage.setItem('savedItems', JSON.stringify(updatedItems));
        setIsSaved(false);
      } else {
        if (!savedItems.includes(item.id)) {
          savedItems.push(item.id);
          localStorage.setItem('savedItems', JSON.stringify(savedItems));
        }
        setIsSaved(true);
      }
      window.dispatchEvent(new Event('savedItemsChanged'));
    } catch (error) {
      console.error('Error managing bookmarks:', error);
    }
  };

  useEffect(() => {
    try {
      const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
      setIsSaved(savedItems.includes(item?.id));
    } catch (error) {
      console.error('Error loading bookmarks:', error);
    }
  }, [item?.id]);

  const handleShare = async () => {
    const shareData = {
      title: item.itemName,
      text: `Check out this item: ${item.itemName} - ${numberFormat(
        item.askingPrice?.price / 100,
        Currencies.NGN
      )}`,
      url: `${window.location.origin}/product/${item?.id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/product/${item?.id}`);
        alert('Link copied to clipboard!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const slideVariants = {
    enter: (direction: number) => ({ x: direction > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (direction: number) => ({ x: direction < 0 ? '100%' : '-100%', opacity: 0 }),
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'awaiting payment':
        return 'processing';
      default:
        return 'default';
    }
  };

  const getListingTypeLabel = (type: ListingType) => {
    switch (type) {
      case 'consignment':
        return 'Consignment';
      case 'direct-purchase':
        return 'Comaket Verified';
      case 'self-listing':
        return 'Seller Listing';
      default:
        return '';
    }
  };

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 ${
        isMobile ? 'px-3' : ''
      }`}
    >
      {/* Seller Info - Mobile */}
      {isMobile && (
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-12 h-12">
            <Image
              src={item.postUserProfile?.profilePicUrl}
              alt="Seller"
              fill
              className="rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-medium text-lg">
                {item.postUserProfile?.businessName || item.postUserProfile?.userName}
              </h3>
              {item.postUserProfile?.isVerified && <span className="text-blue text-xs">✓</span>}
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                {item.postUserProfile?.location || 'Nigeria'}
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                2d ago
              </span>
            </div>
          </div>
        </div>
      )}

      <div className={`flex ${isMobile ? 'flex-col' : ''}`}>
        {/* Left Section — Media */}
        <div className={`${isMobile ? 'w-full' : 'w-2/3'} relative`}>
          <div className="sticky top-0 h-full">
            <div className="relative aspect-square overflow-hidden">
              <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                <motion.div
                  key={currentMediaIndex}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ x: { type: 'tween', duration: 0.25 }, position: { delay: 0 } }}
                  className="w-full h-full"
                >
                  {currentMedia && <MediaRenderer media={currentMedia} alt={item.itemName} />}
                </motion.div>
              </AnimatePresence>

              {/* Low stock badge */}
              {maxQuantity > 0 && maxQuantity <= 5 && (
                <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs font-semibold px-2.5 py-1 rounded-full z-10">
                  Only {maxQuantity} left
                </div>
              )}
            </div>

            {item.media.length > 1 && (
              <>
                <button
                  onClick={prevMedia}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm z-10"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextMedia}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm z-10"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Thumbnail strip */}
                {/* <div className="flex gap-2 mt-3 px-1 overflow-x-auto">
                  {item.media.map((m, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setSlideDirection(index > currentMediaIndex ? 1 : -1);
                        setCurrentMediaIndex(index);
                      }}
                      className={`relative w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                        currentMediaIndex === index
                          ? 'border-blue opacity-100'
                          : 'border-transparent opacity-60 hover:opacity-80'
                      }`}
                    >
                      {m.type === 'image' ? (
                        <Image
                          src={m.url}
                          alt={`Thumb ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="relative w-full h-full bg-gray-900">
                          {m.thumbnail ? (
                            <Image
                              src={m.thumbnail}
                              alt={`Video ${index + 1}`}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <video
                              src={m.url}
                              className="w-full h-full object-cover"
                              muted
                              preload="metadata"
                            />
                          )}
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <div className="w-5 h-5 rounded-full bg-white/80 flex items-center justify-center">
                              <div className="w-0 h-0 border-l-[5px] border-l-gray-800 border-y-[3px] border-y-transparent ml-0.5" />
                            </div>
                          </div>
                        </div>
                      )}
                    </button>
                  ))}
                </div> */}
              </>
            )}
          </div>
        </div>

        {/* Right Section — Details */}
        <div
          className={`${isMobile ? 'w-full' : 'w-1/3 !min-h-[100%] overflow-y-auto p-5'} relative`}
        >
          {/* Seller Details - Desktop */}
          {!isMobile && (
            <div className="flex items-center gap-3 mb-6">
              <div className="relative w-12 h-12">
                <Image
                  src={item.postUserProfile?.profilePicUrl}
                  alt="Seller"
                  fill
                  className="rounded-full object-cover"
                />
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-medium text-lg">
                    {item.postUserProfile?.businessName || item.postUserProfile?.userName}
                  </h3>
                  {item.postUserProfile?.isVerified && <span className="text-blue text-xs">✓</span>}
                </div>
                <div className="flex items-center gap-3 text-sm text-gray-500">
                  <span className="flex items-center gap-1">
                    <MapPin size={14} />
                    {item.postUserProfile?.location || 'Nigeria'}
                  </span>
                  <span className="flex items-center gap-1">
                    <Clock size={14} />
                    2d ago
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Item Details */}
          <div className="space-y-6">
            <div className="flex justify-between">
              <div>
                {isSellerView && (
                  <div className="flex gap-1 items-center">
                    <span className="text-muted-foreground text-sm">PRD-01</span>
                    <Tag
                      className="rounded-3xl"
                      color={getStatusColor(item?.status?.toLowerCase() ?? '')}
                    >
                      {startCase(capitalize(item?.status)) ?? ''}
                    </Tag>
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-1 cursor-pointer">{item.itemName}</h2>

                <div className="mb-2">
                  <span
                    className={`inline-flex items-center px-2 py-0.5 text-[11px] font-medium rounded-full ${
                      item.listingType === 'direct-purchase'
                        ? 'bg-blue-50 dark:bg-blue/20 text-blue dark:text-blue'
                        : item.listingType === 'consignment'
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                          : 'bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400'
                    }`}
                  >
                    {getListingTypeLabel(item.listingType)}
                  </span>
                </div>

                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    {numberFormat(item.askingPrice?.price / 100, Currencies?.NGN)}
                  </span>
                  {item.askingPrice?.negotiable && (
                    <span className="text-[12px] bg-gradient-to-r from-orange-50 to-rose-50 dark:from-orange-900/20 dark:to-rose-900/20 text-orange-600 dark:text-orange-400 px-2 py-1 rounded-full font-medium">
                      Negotiable
                    </span>
                  )}
                </div>
              </div>
              {isSellerView && (
                <div className="flex flex-col gap-1">
                  <span className="text-muted-foreground text-sm">
                    Platform Fee: {numberFormat((item?.platformFee ?? 0) / 100, Currencies.NGN)}
                  </span>
                  <div>
                    <Tag
                      className="rounded-3xl"
                      color={getPaymentStatusColor(item?.feePaymentStatus?.toLowerCase() ?? '')}
                    >
                      {startCase(capitalize(item?.feePaymentStatus)) ?? ''}
                    </Tag>
                    <span>
                      <Tooltip
                        title={
                          item?.feePaymentStatus === 'awaiting payment'
                            ? 'Proceed to Payment'
                            : 'View'
                        }
                      >
                        <i className="ri-arrow-right" />
                      </Tooltip>
                    </span>
                  </div>
                </div>
              )}
            </div>

            {item.productTags && item.productTags.length > 0 && (
              <div className="flex flex-wrap gap-2 py-2">
                {item.productTags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 text-xs font-medium bg-gray-100 dark:bg-zinc-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors cursor-pointer"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            <div className="flex items-center justify-end">
              <div className="flex items-center gap-3">
                <Tooltip title={isSaved ? 'Remove from saved' : 'Save item'}>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleBookmark}
                    className="group"
                  >
                    <Bookmark
                      className={`w-6 h-6 ${
                        isSaved
                          ? 'fill-pink-500 text-pink-500'
                          : 'text-gray-400 group-hover:text-gray-600'
                      } transition-colors`}
                    />
                  </motion.button>
                </Tooltip>
                <Tooltip title="Share">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={handleShare}
                    className="group"
                  >
                    <Share2 className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                  </motion.button>
                </Tooltip>
              </div>
            </div>

            <div
              className={`${
                !isMobile ? 'max-h-[500px] overflow-y-scroll' : 'max-h-[500px] overflow-y-scroll'
              }`}
            >
              <div className="bg-gray-50 rounded-lg p-3 mb-3">
                <h4 className="font-medium mb-2">Description</h4>
                <p className={`text-gray-600 ${!isDescriptionExpanded && 'line-clamp-3'}`}>
                  {item.description}
                </p>
                <button
                  onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                  className="text-blue text-sm mt-2"
                >
                  Show {isDescriptionExpanded ? 'less' : 'more'}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons — conditional on isBuyable */}
          {!isSellerView && (
            <div className="absolute w-[90%] flex flex-col gap-2 bottom-0 bg-white dark:bg-gray-800 py-4 mt-6 border-t">
              {item.isBuyable ? (
                <>
                  {/* BUYABLE: Buy Now + Add to Cart */}
                  <div className="flex items-center gap-1.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleBuyNow}
                      className="flex-1 py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-all bg-gradient-to-r from-blue to-indigo-700 hover:from-blue hover:to-indigo-800 text-white hover:shadow-md"
                    >
                      <ShoppingBag size={20} />
                      Buy Now
                    </motion.button>

                    <Tooltip
                      title={
                        isMaxQuantityReached
                          ? `Max quantity (${maxQuantity}) reached`
                          : itemInCart
                            ? 'Already in cart'
                            : 'Add to cart'
                      }
                    >
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleAddToCart}
                        disabled={isMaxQuantityReached}
                        className={`p-3 rounded-lg border shadow-sm transition-colors ${
                          isMaxQuantityReached
                            ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                            : itemInCart
                              ? 'bg-blue-50 border-blue text-blue'
                              : 'bg-neutral-100 border-neutral-200 text-gray-600 hover:border-blue hover:text-blue'
                        }`}
                      >
                        <ShoppingCart size={20} />
                      </motion.button>
                    </Tooltip>
                  </div>

                  {/* BUYABLE: WhatsApp + Save + Share */}
                  <div className="flex items-center gap-1.5">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleWhatsAppMessage}
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm"
                    >
                      <MessageCircle size={20} />
                      WhatsApp
                    </motion.button>

                    <Tooltip title={isSaved ? 'Remove from saved' : 'Save item'}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleBookmark}
                        className={`p-3 rounded-lg border shadow-sm transition-colors ${
                          isSaved
                            ? 'bg-pink-50 border-pink-200'
                            : 'bg-neutral-100 border-neutral-200'
                        }`}
                      >
                        <Bookmark
                          size={20}
                          className={`${
                            isSaved ? 'fill-pink-500 text-pink-500' : 'text-gray-500'
                          } transition-colors`}
                        />
                      </motion.button>
                    </Tooltip>

                    <Tooltip title="Share">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleShare}
                        className="p-3 rounded-lg border border-neutral-200 bg-neutral-100 shadow-sm"
                      >
                        <Share2 size={20} className="text-gray-500" />
                      </motion.button>
                    </Tooltip>
                  </div>
                </>
              ) : (
                <>
                  {/* NOT BUYABLE: WhatsApp only */}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleWhatsAppMessage}
                    className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm"
                  >
                    <MessageCircle size={20} />
                    Message on WhatsApp
                  </motion.button>

                  <div className="flex items-center gap-1.5">
                    <Tooltip title={isSaved ? 'Remove from saved' : 'Save item'}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={handleBookmark}
                        className={`flex-1 p-3 rounded-lg border shadow-sm transition-colors flex items-center justify-center gap-1.5 ${
                          isSaved
                            ? 'bg-pink-50 border-pink-200 text-pink-500'
                            : 'bg-neutral-100 border-neutral-200 text-gray-500'
                        }`}
                      >
                        <Bookmark
                          size={18}
                          className={`${
                            isSaved ? 'fill-pink-500 text-pink-500' : 'text-gray-500'
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
                        className="flex-1 p-3 rounded-lg border border-neutral-200 bg-neutral-100 shadow-sm flex items-center justify-center gap-1.5 text-gray-500"
                      >
                        <Share2 size={18} className="text-gray-500" />
                        Share
                      </motion.button>
                    </Tooltip>
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ItemDetail;
