import React, { useState } from 'react';
import { Modal, Tag, Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
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
import { Currencies, mockComments } from '@grc/_shared/constant';
import { capitalize, startCase } from 'lodash';

interface ItemDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: {
    description: string;
    sponsored: boolean;
    postUserProfile: Record<string, any>;
    postImgurls: string[];
    askingPrice: Record<string, any>;
    condition: string;
    comments: Record<string, any>[];
    itemName: string;
    status: 'pending' | 'approved' | 'rejected';
    feePaymentStatus?:
      | 'pending'
      | 'processed'
      | 'awaiting payment'
      | 'awaiting approval'
      | undefined;
    platformFee: number;
    live: boolean;
  };
  isSellerView?: boolean;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ open, onClose, item, isSellerView }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);
  const [slideDirection, setSlideDirection] = useState(0);

  const nextImage = () => {
    setSlideDirection(1);
    setCurrentImageIndex((prev) => (prev + 1) % item.postImgurls.length);
  };

  const prevImage = () => {
    setSlideDirection(-1);
    setCurrentImageIndex((prev) => (prev - 1 + item.postImgurls.length) % item.postImgurls.length);
  };

  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? '100%' : '-100%',
      opacity: 0,
    }),
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

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      className="item-detail-modal relative"
      closeIcon={null}
    >
      {/* Seller Info */}
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
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
      >
        ×
      </button>
      <div className="flex gap-8">
        {/* Left Section - Image */}
        <div className="w-[60%] relative">
          <div className="sticky top-0 h-full">
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <AnimatePresence initial={false} custom={slideDirection} mode="popLayout">
                <motion.div
                  key={currentImageIndex}
                  custom={slideDirection}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: 'tween', duration: 0.25 },
                    position: { delay: 0 },
                  }}
                  className="w-full h-full"
                >
                  <Image
                    src={item.postImgurls[currentImageIndex]}
                    alt={item.itemName}
                    fill
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {item.postImgurls.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full backdrop-blur-sm"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Right Section - Details */}
        <div className="w-1/2 overflow-y-auto !min-h-[100%] relative">
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
                    </Tag>{' '}
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-1 cursor-pointer">{item.itemName}</h2>
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
                    Platform Fee: {numberFormat(item?.platformFee / 100, Currencies.NGN)}{' '}
                  </span>
                  <div>
                    <Tag
                      className="rounded-3xl"
                      color={getPaymentStatusColor(item?.feePaymentStatus?.toLowerCase() ?? '')}
                    >
                      {startCase(capitalize(item?.feePaymentStatus)) ?? ''}
                    </Tag>{' '}
                    <span>
                      <Tooltip
                        title={
                          item?.feePaymentStatus === 'awaiting payment'
                            ? 'Proceed to Payment'
                            : 'View'
                        }
                      >
                        <i className="ri-arrow-right" />
                      </Tooltip>{' '}
                    </span>
                  </div>
                </div>
              )}
            </div>

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

            <div className="!max-h-[470px] overflow-y-scroll">
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
              <div>
                <h4 className="font-medium mb-4">Comments ({mockComments.length})</h4>
                <div className="space-y-4">
                  {mockComments.map((comment) => (
                    <div key={comment.id} className="flex gap-3 items-start">
                      <Image
                        src={comment.user.avatar}
                        alt={comment.user.name}
                        width={32}
                        height={32}
                        className="rounded-full"
                        style={{ width: '32px', height: '32px' }}
                      />
                      <div className="flex-1">
                        <div className="rounded-lg">
                          <span className="font-semibold">{comment.user.name}</span>
                          <p className="text-gray-600 mt-1">{comment.text}</p>
                        </div>
                        <span className="text-sm text-gray-500 mt-1 block">
                          {comment.timestamp}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          {!isSellerView && (
            <div className="absolute w-full bottom-0 bg-white pt-4 mt-6 border-t">
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
          )}
        </div>
      </div>
    </Modal>
  );
};

export default ItemDetailModal;
