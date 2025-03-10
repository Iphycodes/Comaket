'use client';

import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Currencies, mockMarketItems } from '@grc/_shared/constant';
import Image from 'next/image';
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Clock,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
  Store,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { mockMarketItemType } from '@grc/_shared/namespace';
import { numberFormat } from '@grc/_shared/helpers';
import { Badge, Button, Tooltip } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import CommentBox from '../comment-box';

interface ProductProps {
  productId: string;
  setSelectedProductId?: React.Dispatch<React.SetStateAction<string>>;
}

const Product = ({ productId, setSelectedProductId }: ProductProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const { push } = useRouter();

  console.log(isLoading);

  useEffect(() => {
    console.log('Vendor ID:', productId);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [productId]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);
  const isMobile = useMediaQuery(mediaSize.mobile);

  // const slideVariants = {
  //   enter: (direction: number) => ({
  //     x: direction > 0 ? '100%' : '-100%',
  //     opacity: 0,
  //   }),
  //   center: {
  //     x: 0,
  //     opacity: 1,
  //   },
  //   exit: (direction: number) => ({
  //     x: direction < 0 ? '100%' : '-100%',
  //     opacity: 0,
  //   }),
  // };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const item: Partial<mockMarketItemType> =
    mockMarketItems[
      Number(productId) === 0 || Number(productId) === 1 || Number(productId) === 2
        ? Number(productId)
        : 0
    ];

  const nextImage = () => {
    setSlideDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % (item?.postImgUrls?.length ?? 0));
  };

  const prevImage = () => {
    setSlideDirection(-1);
    setCurrentImageIndex(
      (prev) => (prev - 1 + (item?.postImgUrls?.length ?? 0)) % (item?.postImgUrls?.length ?? 0)
    );
  };

  const handleGoBack = () => {
    push('/');
    setSelectedProductId?.('');
  };

  return (
    <motion.div
      variants={itemVariants}
      className={`bg-white dark:bg-gray-800 rounded-lg transition-all duration-300 ${
        isMobile ? 'mt-0' : 'mt-10'
      } ${isMobile ? '' : ''}`}
    >
      <div className="sticky top-0 left-0 w-full py-4 !z-50 bg-white border-b mb-5">
        <Button
          type="link"
          onClick={() => handleGoBack()}
          className="text-neutral-500 hover:text-blue font-semibold flex text-base gap-1 items-center"
        >
          <i className="ri-arrow-left-s-line"></i>
          <span>Back</span>
        </Button>
      </div>
      <div className={`${isMobile ? 'px-2' : ''}`}>
        {/* Seller Info */}
        <div className="flex items-center gap-3 mb-6">
          <div className="relative w-12 h-12">
            <Image
              src={item.postUserProfile?.profilePicUrl ?? ''}
              alt="Seller"
              fill
              className="rounded-full object-cover"
            />
            <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white" />
          </div>
          <div>
            <h3 className="font-medium text-lg">
              {item.postUserProfile?.businessName || item.postUserProfile?.userName}
            </h3>
            <div className="flex items-center gap-3 text-sm text-gray-500">
              <span className="flex items-center gap-1">
                <MapPin size={14} />
                Kaduna State, Zaria
              </span>
              <span className="flex items-center gap-1">
                <Clock size={14} />
                2d ago
              </span>
            </div>
          </div>
        </div>
        {/* Close button */}
        <div className={`flex ${isMobile ? 'flex-col gap-4' : ' gap-8'}`}>
          {/* Left Section - Image */}
          <div
            className={`relative w-full md:w-3/5 overflow-hidden ${
              isMobile ? 'rounded-sm' : 'rounded-md'
            }`}
          >
            <div className="relative aspect-square">
              <AnimatePresence initial={false} custom={slideDirection}>
                <motion.div
                  key={currentImageIndex}
                  custom={slideDirection}
                  initial={{ x: slideDirection * 100 + '%', opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: slideDirection * -100 + '%', opacity: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  className={`absolute inset-0 rounded-sm ${!isMobile ? 'cursor-pointer' : ''}`}
                >
                  <Image
                    src={item?.postImgUrls?.[currentImageIndex] ?? ''}
                    alt={item?.itemName ?? ''}
                    fill
                    className="object-cover"
                    priority
                  />
                </motion.div>
              </AnimatePresence>

              {/* Navigation controls */}
              {(item?.postImgUrls?.length ?? 0) > 1 && (
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

                  {currentImageIndex < (item?.postImgUrls?.length ?? 0) - 1 && (
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
                    {item?.postImgUrls?.map((_, index) => (
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
                  <span className="px-2 py-1 text-sm text-white font-semibold">
                    {item?.condition}
                  </span>
                }
                color={item?.condition === 'Brand New' ? 'green' : 'blue'}
              />
            </div>
          </div>

          {/* Right Section - Details */}
          <div
            className={`${isMobile ? 'w-full' : 'w-1/2 !min-h-[100%] overflow-y-auto '} relative`}
          >
            {/* Item Details */}
            <div className="space-y-6">
              {isMobile && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* <Tooltip title={isLiked ? 'Unlike' : 'Like'}> */}
                    <Tooltip title={'Like'}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        // onClick={() => setIsLiked(!isLiked)}
                        className="flex items-center gap-2 group"
                      >
                        {/* <Heart
                      className={`w-6 h-6 ${
                        isLiked
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-gray-400 group-hover:text-gray-600'
                      } transition-colors`}
                    /> */}
                        <Heart
                          className={`w-6 h-6 ${'text-gray-400 group-hover:text-gray-600'} transition-colors`}
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
                        <span className="text-sm text-gray-500">{item?.comments?.length ?? 0}</span>
                      </motion.button>
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* <Tooltip title={isSaved ? 'Remove from saved' : 'Save item'}> */}
                    <Tooltip title={'Save item'}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        // onClick={() => setIsSaved(!isSaved)}
                        className="group"
                      >
                        {/* <Bookmark
                      className={`w-6 h-6 ${
                        isSaved
                          ? 'fill-blue-500 text-blue-500'
                          : 'text-gray-400 group-hover:text-gray-600'
                      } transition-colors`}
                    /> */}
                        <Bookmark
                          className={`w-6 h-6 ${'text-gray-400 group-hover:text-gray-600'} transition-colors`}
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
              )}
              <div>
                <h2 className="text-xl font-semibold mb-1 cursor-pointer">{item?.itemName}</h2>
                <div className="flex items-center gap-3">
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

              {!isMobile && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    {/* <Tooltip title={isLiked ? 'Unlike' : 'Like'}> */}
                    <Tooltip title={'Like'}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        // onClick={() => setIsLiked(!isLiked)}
                        className="flex items-center gap-2 group"
                      >
                        {/* <Heart
                      className={`w-6 h-6 ${
                        isLiked
                          ? 'fill-rose-500 text-rose-500'
                          : 'text-gray-400 group-hover:text-gray-600'
                      } transition-colors`}
                    /> */}
                        <Heart
                          className={`w-6 h-6 ${'text-gray-400 group-hover:text-gray-600'} transition-colors`}
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
                        <span className="text-sm text-gray-500">{10}</span>
                      </motion.button>
                    </Tooltip>
                  </div>

                  <div className="flex items-center gap-4">
                    {/* <Tooltip title={isSaved ? 'Remove from saved' : 'Save item'}> */}
                    <Tooltip title={'Save item'}>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        // onClick={() => setIsSaved(!isSaved)}
                        className="group"
                      >
                        {/* <Bookmark
                      className={`w-6 h-6 ${
                        isSaved
                          ? 'fill-blue-500 text-blue-500'
                          : 'text-gray-400 group-hover:text-gray-600'
                      } transition-colors`}
                    /> */}
                        <Bookmark
                          className={`w-6 h-6 ${'text-gray-400 group-hover:text-gray-600'} transition-colors`}
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
              )}

              <div className={``}>
                {/* Description */}
                <div className="bg-gray-50 rounded-lg p-3 mb-3">
                  <h4 className="font-medium mb-2">Description</h4>
                  <p className={`text-gray-600 ${!isDescriptionExpanded && 'line-clamp-3'}`}>
                    {item.description}
                  </p>
                  <button
                    onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
                    className="text-blue-600 text-sm mt-2"
                  >
                    Show {isDescriptionExpanded ? 'less' : 'more'}
                  </button>
                </div>

                {/* Comments Section */}
                <div className={`${isMobile ? 'mb-[200px]' : ''}`}>
                  <h4 className="font-medium mb-4">Comments ({item?.comments?.length ?? 0})</h4>
                  <div className="space-y-4">
                    {item?.comments?.map((comment) => (
                      <div key={comment?.id} className="flex gap-3 items-start">
                        <Image
                          src={comment?.user?.avatar ?? ''}
                          alt={comment?.user?.name ?? ''}
                          width={32}
                          height={32}
                          className="rounded-full"
                          style={{ width: '32px', height: '32px' }}
                        />
                        <div className="flex-1">
                          <div className="rounded-lg">
                            <span className="font-semibold">{comment?.user?.name ?? ''}</span>
                            <p className="text-gray-600 mt-1">{comment?.text ?? ''} </p>
                          </div>
                          <span className="text-sm text-gray-500 mt-1 block">
                            {comment?.timestamp ?? ''}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            {/* {isMobile && (
            <div className=" w-full  left-0 px-2 bg-white py-4 mt-6 border-t">
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-blue hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Chat with Seller
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 border border-gray-200 hover:border-gray-300 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Store size={20} />
                  Visit Store
                </motion.button>
              </div>
            </div>
          )} */}
            <div
              className={`${
                isMobile
                  ? 'fixed max-w-full bottom-[64px] py-4 left-0 px-2'
                  : 'absolute bottom-0 pt-4'
              } w-full  bg-white mt-6 border-t`}
            >
              <div className="mb-4 w-full">
                <div className="flex gap-3 w-full items-start">
                  <Image
                    src={item?.postUserProfile?.profilePicUrl ?? ''}
                    alt={'user'}
                    width={32}
                    height={32}
                    className="rounded-full"
                    style={{ width: '32px', height: '32px' }}
                  />
                  <div className="flex-1">
                    <CommentBox />
                  </div>
                </div>
              </div>
              <div className="flex gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-blue hover:bg-blue-700 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <MessageCircle size={20} />
                  Chat with Seller
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 border border-gray-200 hover:border-gray-300 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
                >
                  <Store size={20} />
                  Visit Store
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default Product;
