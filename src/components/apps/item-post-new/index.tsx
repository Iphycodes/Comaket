import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge, Tooltip } from 'antd';
import {
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Store,
  Clock,
} from 'lucide-react';
import Image from 'next/image';
import { numberFormat } from '@grc/_shared/helpers';
import TruncatedDescription from '@grc/_shared/components/truncated-description';
import ItemDetailModal from '../item-detail-modal';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { Currencies } from '@grc/_shared/constant';

interface ItemPostProps {
  description: string;
  sponsored: boolean;
  postUserProfile: Record<string, any>;
  postImgurls: string[];
  askingPrice: Record<string, any>;
  condition: 'Brand New' | 'Fairly Used';
  comments: Record<string, any>[];
  itemName: string;
  id: string | number;
  setSelectedProductId?: React.Dispatch<React.SetStateAction<string>>;
}

const ModernItemPost: React.FC<ItemPostProps> = ({
  description,
  sponsored,
  postUserProfile,
  postImgurls,
  askingPrice,
  condition,
  comments,
  itemName,
  setSelectedProductId,
  id,
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useMediaQuery(mediaSize.mobile);

  // Ref for touch swiping on mobile
  const imageContainerRef = useRef<HTMLDivElement>(null);
  const touchStartXRef = useRef<number | null>(null);

  const nextImage = () => {
    if (currentImageIndex < postImgurls.length - 1) {
      setSlideDirection(1);
      setCurrentImageIndex((prev) => prev + 1);
    }
  };

  const prevImage = () => {
    if (currentImageIndex > 0) {
      setSlideDirection(-1);
      setCurrentImageIndex((prev) => prev - 1);
    }
  };

  const handleViewItem = () => {
    if (!isMobile) {
      setIsModalOpen(true);
    } else {
      setSelectedProductId?.(id?.toString());
    }
  };

  // Touch event handlers for swiping on mobile
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

      // Swipe threshold - only register swipes that move more than 50px
      if (Math.abs(diffX) > 50) {
        if (diffX > 0 && currentImageIndex > 0) {
          // Swipe right -> previous image
          prevImage();
        } else if (diffX < 0 && currentImageIndex < postImgurls.length - 1) {
          // Swipe left -> next image
          nextImage();
        }
      }

      touchStartXRef.current = null;
    };

    imageContainer.addEventListener('touchstart', handleTouchStart);
    imageContainer.addEventListener('touchend', handleTouchEnd);

    return () => {
      imageContainer.removeEventListener('touchstart', handleTouchStart);
      imageContainer.removeEventListener('touchend', handleTouchEnd);
    };
  }, [isMobile, currentImageIndex, postImgurls.length]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full border-b border-gray-100 dark:border-zinc-800 py-8 first:pt-0"
    >
      {/* Seller info */}
      <div className={`flex items-center gap-3 mb-4 ${isMobile ? 'px-2' : ''}`}>
        <div className="relative w-10 h-10">
          <Image
            src={postUserProfile?.profilePicUrl}
            alt="Seller"
            fill
            className="rounded-full object-cover"
          />
          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              {postUserProfile?.businessName || postUserProfile?.userName}
            </h3>
            {sponsored && (
              <span className="text-xs bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-full font-medium">
                Sponsored
              </span>
            )}
          </div>
          <div className="flex items-center gap-3 text-[12px] text-gray-500 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <MapPin size={14} />
              <span>Kaduna State, Zaria</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>2d ago</span>
            </div>
          </div>
        </div>
      </div>
      <div className={`flex flex-col md:flex-row w-full ${isMobile ? 'gap-4' : 'gap-8'}`}>
        {/* Left section - Product Images */}
        <div
          className={`relative w-full md:w-3/5 overflow-hidden ${
            isMobile ? 'rounded-sm' : 'rounded-md'
          }`}
        >
          <div ref={imageContainerRef} className="relative aspect-square">
            <AnimatePresence initial={false} custom={slideDirection}>
              <motion.div
                key={currentImageIndex}
                custom={slideDirection}
                initial={{ x: slideDirection * 100 + '%', opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: slideDirection * -100 + '%', opacity: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                className={`absolute inset-0 rounded-sm ${!isMobile ? 'cursor-pointer' : ''}`}
                onClick={() => {
                  if (!isMobile) {
                    handleViewItem();
                  }
                }}
              >
                <Image
                  src={postImgurls[currentImageIndex]}
                  alt={`Product image ${currentImageIndex + 1}`}
                  fill
                  className="object-cover"
                  priority
                />
              </motion.div>
            </AnimatePresence>

            {/* Navigation controls */}
            {postImgurls.length > 1 && (
              <>
                {currentImageIndex > 0 && (
                  <button
                    onClick={prevImage}
                    className={`absolute left-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white ${
                      isMobile ? 'p-1' : 'p-2'
                    } rounded-full backdrop-blur-sm transition-colors`}
                  >
                    <ChevronLeft className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                  </button>
                )}

                {currentImageIndex < postImgurls.length - 1 && (
                  <button
                    onClick={nextImage}
                    className={`absolute right-1 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white ${
                      isMobile ? 'p-1' : 'p-2'
                    } rounded-full backdrop-blur-sm transition-colors`}
                  >
                    <ChevronRight className={`${isMobile ? 'w-4 h-4' : 'w-6 h-6'}`} />
                  </button>
                )}

                {/* Dots indicator */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-1.5">
                  {postImgurls.map((_, index) => (
                    <div
                      key={index}
                      className={`w-2 h-2 rounded-full ${
                        currentImageIndex === index
                          ? 'bg-white'
                          : 'bg-white/30 border border-white/60'
                      } transition-all duration-200`}
                    />
                  ))}
                </div>
              </>
            )}

            <Badge
              className="absolute top-3 right-3 backdrop-blur-lg !rounded-md"
              count={
                <span className="px-2 py-1 text-sm text-white font-semibold">{condition}</span>
              }
              color={condition === 'Brand New' ? 'green' : 'blue'}
            />
          </div>
        </div>

        {/* Right section - Product Details */}
        <div className={`w-full md:w-1/2 ${isMobile ? 'px-2' : ''} flex flex-col`}>
          {/* Product info */}
          {isMobile && (
            <div className="mt-auto space-y-6 mb-5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsLiked(!isLiked)}
                      className="flex items-center gap-2 group"
                    >
                      <Heart
                        className={`w-7 h-7 ${
                          isLiked
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-neutral-900 group-hover:text-black'
                        } transition-colors`}
                      />
                      <span className="text-sm text-neutral-900">125</span>
                    </motion.button>
                  </Tooltip>

                  <Tooltip title="Comments">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 group"
                    >
                      <MessageCircle className="w-7 h-7 text-neutral-900 group-hover:text-black transition-colors" />
                      <span className="text-sm text-neutral-900" onClick={() => handleViewItem()}>
                        {comments.length}
                      </span>
                    </motion.button>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-4">
                  <Tooltip title={isSaved ? 'Remove from saved' : 'Save item'}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsSaved(!isSaved)}
                      className="group"
                    >
                      <Bookmark
                        className={`w-7 h-7 ${
                          isSaved
                            ? 'fill-blue-500 text-blue-500'
                            : 'text-black group-hover:text-black'
                        } transition-colors`}
                      />
                    </motion.button>
                  </Tooltip>

                  <Tooltip title="Share">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="group"
                    >
                      <Share2 className="w-7 h-7 text-black group-hover:text-black transition-colors" />
                    </motion.button>
                  </Tooltip>
                </div>
              </div>
            </div>
          )}
          <div className="space-y-2 mb-1">
            <div>
              <h2 className="text-xl font-semibold mb-1 cursor-pointer" onClick={handleViewItem}>
                {itemName}
              </h2>
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

            <div className="py-1">
              <button
                onClick={() => handleViewItem()}
                className="text-neutral-500 hover:text-blue text-sm font-medium transition-colors"
              >
                View all comments ({comments.length})
              </button>
            </div>
          </div>

          {/* Comment input */}
          {/* <div className="mt-auto mb-4 relative">
            <button
              id="post-comment-button"
              className="ml-auto mb-1 text-[10px] bottom-2 bg-blue text-white px-3 py-[2px] text-sm rounded-full font-medium hidden hover:bg-blue-600 transition-colors"
            >
              Post
            </button>
            <textarea
              placeholder="Add a comment..."
              rows={2}
              className="w-full max-h-12 focus:!max-h-15 px-3 !py-2 border-b !outline-none focus:!outline-none focus:bg-neutral-100 border-gray-300 focus:!border-none dark:border-gray-700 dark:focus:border-blue-400 bg-transparent transition-colors resize-none"
              onChange={(e) => {
                const hasContent = e.target.value.trim().length > 0;
                // You can use state to control the button visibility
                // This is a simple inline approach
                const postButton = document.getElementById('post-comment-button');
                if (postButton) {
                  postButton.style.display = hasContent ? 'block' : 'none';
                }
              }}
            />
          </div> */}

          {/* Stats and actions */}
          {!isMobile && (
            <div className="mt-auto space-y-6 mb-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-6">
                  <Tooltip title={isLiked ? 'Unlike' : 'Like'}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsLiked(!isLiked)}
                      className="flex items-center gap-2 group"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          isLiked
                            ? 'fill-rose-500 text-rose-500'
                            : 'text-gray-400 group-hover:text-gray-600'
                        } transition-colors`}
                      />
                      <span className="text-sm text-gray-500">125</span>
                    </motion.button>
                  </Tooltip>

                  <Tooltip title="Comments">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex items-center gap-2 group"
                    >
                      <MessageCircle className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                      <span className="text-sm text-gray-500" onClick={() => handleViewItem()}>
                        {comments.length}
                      </span>
                    </motion.button>
                  </Tooltip>
                </div>

                <div className="flex items-center gap-4">
                  <Tooltip title={isSaved ? 'Remove from saved' : 'Save item'}>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setIsSaved(!isSaved)}
                      className="group"
                    >
                      <Bookmark
                        className={`w-6 h-6 ${
                          isSaved
                            ? 'fill-blue-500 text-blue-500'
                            : 'text-gray-400 group-hover:text-gray-600'
                        } transition-colors`}
                      />
                    </motion.button>
                  </Tooltip>

                  <Tooltip title="Share">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="group"
                    >
                      <Share2 className="w-6 h-6 text-gray-400 group-hover:text-gray-600 transition-colors" />
                    </motion.button>
                  </Tooltip>
                </div>
              </div>
            </div>
          )}
          {/* Primary actions */}
          <div className="flex gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-1 shadow-sm"
            >
              <MessageCircle size={20} />
              Chat Seller
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex-1 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-zinc-800 dark:to-zinc-900 border border-gray-200 dark:border-zinc-700 hover:border-gray-300 dark:hover:border-zinc-600 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
            >
              <Store size={20} />
              Visit Store
            </motion.button>
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
          postImgurls,
          askingPrice,
          condition,
          comments,
          itemName,
        }}
      />
    </motion.div>
  );
};

export default ModernItemPost;

interface ItemPostProps {
  description: string;
  sponsored: boolean;
  postUserProfile: Record<string, any>;
  postImgurls: string[];
  askingPrice: Record<string, any>;
  condition: 'Brand New' | 'Fairly Used';
  comments: Record<string, any>[];
  itemName: string;
}
