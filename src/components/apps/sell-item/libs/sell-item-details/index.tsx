'use client';

import React, { useState, useCallback } from 'react';
import { Modal, InputNumber, message } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { usePaystackPayment } from 'react-paystack';
import {
  ArrowLeft,
  MapPin,
  Tag,
  Clock,
  CreditCard,
  Package,
  ThumbsUp,
  ThumbsDown,
  ArrowLeftRight,
  CheckCircle2,
  XCircle,
  Store,
  Handshake,
  BadgeDollarSign,
  Heart,
  MessageCircle,
  Bookmark,
  ExternalLink,
  Edit2,
  Trash2,
  ChevronLeft,
  ChevronRight,
  X,
  Send,
} from 'lucide-react';
import {
  SellItemType,
  SellingModel,
  getStatusLabel,
  getStatusColor,
  getSellingModelLabel,
  LISTING_FEE_PERCENT,
  CONSIGNMENT_COMMISSION_PERCENT,
} from '@grc/_shared/namespace/sell-item';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isVideo = (url: string): boolean => url.startsWith('data:video/') || url.endsWith('.mp4');

// ─── Mobile Full-Screen Wrapper ───────────────────────────────────────────────
// Reusable wrapper that renders children as a fixed full-screen overlay on mobile.

interface MobileFullScreenProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
}

const MobileFullScreen: React.FC<MobileFullScreenProps> = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, y: '100%' }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-0 z-[9999] bg-white dark:bg-gray-900 flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            {title || 'Back'}
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Media Lightbox (Desktop Modal) ───────────────────────────────────────────

interface LightboxProps {
  media: string[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

const MediaLightboxDesktop: React.FC<LightboxProps> = ({ media, initialIndex, open, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  React.useEffect(() => {
    if (open) setCurrentIndex(initialIndex);
  }, [open, initialIndex]);

  const current = media[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < media.length - 1;

  const goPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasPrev) setCurrentIndex((i) => i - 1);
  };

  const goNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasNext) setCurrentIndex((i) => i + 1);
  };

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      closeIcon={null}
      className="[&_.ant-modal-content]:!bg-black/95 [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-body]:!p-0"
      zIndex={1100}
    >
      <div className="relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X size={18} className="text-white" />
        </button>

        <div className="absolute top-3 left-3 z-20 text-xs text-white/60 font-medium bg-black/40 px-2.5 py-1 rounded-full">
          {currentIndex + 1} / {media.length}
        </div>

        <div className="w-full flex items-center justify-center min-h-[300px] max-h-[70vh] p-4">
          {isVideo(current) ? (
            <video
              key={current}
              src={current}
              controls
              autoPlay
              className="max-w-full max-h-[65vh] rounded-lg"
            />
          ) : (
            <img
              key={current}
              src={current}
              alt={`Media ${currentIndex + 1}`}
              className="max-w-full max-h-[65vh] rounded-lg object-contain"
            />
          )}
        </div>

        {media.length > 1 && (
          <>
            <button
              onClick={goPrev}
              disabled={!hasPrev}
              className={`absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                hasPrev
                  ? 'bg-white/10 hover:bg-white/25 text-white'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              onClick={goNext}
              disabled={!hasNext}
              className={`absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full flex items-center justify-center transition-colors ${
                hasNext
                  ? 'bg-white/10 hover:bg-white/25 text-white'
                  : 'bg-white/5 text-white/20 cursor-not-allowed'
              }`}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}

        {media.length > 1 && (
          <div className="flex gap-2 pb-4 px-4 overflow-x-auto">
            {media.map((m, i) => (
              <button
                key={i}
                onClick={() => setCurrentIndex(i)}
                className={`flex-shrink-0 w-12 h-12 rounded-lg overflow-hidden border-2 transition-all ${
                  i === currentIndex
                    ? 'border-white scale-105'
                    : 'border-transparent opacity-50 hover:opacity-80'
                }`}
              >
                {isVideo(m) ? (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                    <video
                      src={m}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <i className="ri-play-fill text-white text-xs"></i>
                    </div>
                  </div>
                ) : (
                  <img src={m} alt="" className="w-full h-full object-cover" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

// ─── Media Lightbox Content (Mobile Full-Screen) ──────────────────────────────

interface MobileLightboxContentProps {
  media: string[];
  initialIndex: number;
}

const MobileLightboxContent: React.FC<MobileLightboxContentProps> = ({ media, initialIndex }) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  React.useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  const current = media[currentIndex];
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < media.length - 1;

  return (
    <div className="flex flex-col h-full bg-black">
      {/* Counter */}
      <div className="text-center py-2 text-xs text-white/60 font-medium">
        {currentIndex + 1} / {media.length}
      </div>

      {/* Main media */}
      <div className="flex-1 flex items-center justify-center px-4 relative">
        {isVideo(current) ? (
          <video
            key={current}
            src={current}
            controls
            autoPlay
            className="max-w-full max-h-full rounded-lg"
          />
        ) : (
          <img
            key={current}
            src={current}
            alt={`Media ${currentIndex + 1}`}
            className="max-w-full max-h-full rounded-lg object-contain"
          />
        )}

        {media.length > 1 && (
          <>
            {hasPrev && (
              <button
                onClick={() => setCurrentIndex((i) => i - 1)}
                className="absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center"
              >
                <ChevronLeft size={20} />
              </button>
            )}
            {hasNext && (
              <button
                onClick={() => setCurrentIndex((i) => i + 1)}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/10 hover:bg-white/25 text-white flex items-center justify-center"
              >
                <ChevronRight size={20} />
              </button>
            )}
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {media.length > 1 && (
        <div className="flex gap-2 py-4 px-4 overflow-x-auto justify-center">
          {media.map((m, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`flex-shrink-0 w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                i === currentIndex
                  ? 'border-white scale-105'
                  : 'border-transparent opacity-50 hover:opacity-80'
              }`}
            >
              {isVideo(m) ? (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                  <video src={m} className="w-full h-full object-cover" muted preload="metadata" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <i className="ri-play-fill text-white text-xs"></i>
                  </div>
                </div>
              ) : (
                <img src={m} alt="" className="w-full h-full object-cover" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── Counter Offer View (Mobile Full-Screen Content) ──────────────────────────

interface CounterOfferViewProps {
  item: SellItemType;
  onSubmit: (amount: number) => void;
}

const CounterOfferView: React.FC<CounterOfferViewProps> = ({ item, onSubmit }) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platformBidNaira = (item.platformBid || 0) / 100;
  const askingPriceNaira = (item.askingPrice?.price || 0) / 100;

  const handleSubmit = () => {
    if (!amount || amount <= 0) {
      message.warning('Please enter a valid counter offer amount');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(amount * 100); // convert to kobo
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="p-5 space-y-6">
      {/* Header info */}
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Counter Offer</h2>
        <p className="text-sm text-gray-500">
          Submit your counter offer for <strong>{item.itemName}</strong>
        </p>
      </div>

      {/* Price comparison */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Your asking price</span>
          <span className="font-semibold">₦{askingPriceNaira.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Their offer</span>
          <span className="font-semibold text-blue">₦{platformBidNaira.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Difference</span>
            <span className="font-semibold text-orange-500">
              ₦{(askingPriceNaira - platformBidNaira).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Counter offer input */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          Your Counter Offer (₦)
        </label>
        <InputNumber
          value={amount}
          onChange={(val) => setAmount(val)}
          placeholder="Enter amount in Naira"
          className="!w-full !h-14 !text-lg !rounded-xl"
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, '') || 0)}
          min={1}
          controls={false}
          prefix={<span className="text-gray-400 text-base mr-1">₦</span>}
        />
        {amount && amount > 0 && (
          <p className="text-xs text-gray-400 mt-1.5">
            {amount > platformBidNaira
              ? `₦${(amount - platformBidNaira).toLocaleString()} above their offer`
              : amount < platformBidNaira
                ? `₦${(platformBidNaira - amount).toLocaleString()} below their offer`
                : 'Same as their offer'}
          </p>
        )}
      </div>

      {/* Submit button */}
      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !amount || amount <= 0}
        className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
          isSubmitting || !amount || amount <= 0
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 hover:shadow-lg'
        }`}
      >
        <Send size={16} />
        {isSubmitting ? 'Submitting...' : 'Send Counter Offer'}
      </button>
    </div>
  );
};

// ─── Paystack Pay Fee Button ──────────────────────────────────────────────────

const PayListingFeeButton: React.FC<{
  item: SellItemType;
  onSuccess: () => void;
}> = ({ item, onSuccess }) => {
  const feeNaira = (item.listingFee || 0) / 100;
  const feeKobo = item.listingFee || 0;

  const config = {
    reference: `CMK-FEE-${item.id}-${Date.now()}`,
    email: 'ifeanyiemmanuel585@gmail.com',
    amount: feeKobo,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    metadata: {
      custom_fields: [
        {
          display_name: 'Payment Type',
          variable_name: 'payment_type',
          value: 'listing_fee',
        },
        {
          display_name: 'Item ID',
          variable_name: 'item_id',
          value: String(item.id),
        },
        {
          display_name: 'Item Name',
          variable_name: 'item_name',
          value: item.itemName,
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const handlePay = () => {
    if (!config.publicKey) {
      message.error('Payment configuration missing. Please try again later.');
      return;
    }

    initializePayment({
      onSuccess: (reference: any) => {
        console.log('Listing fee payment successful:', reference);
        message.success('Payment successful! Your item is now live on the marketplace.');
        onSuccess();
      },
      onClose: () => {
        message.info('Payment cancelled. You can pay anytime to go live.');
      },
    });
  };

  return (
    <button
      onClick={handlePay}
      className="mt-3 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-amber-500/20 hover:shadow-lg transition-all flex items-center gap-2"
    >
      <CreditCard size={15} />
      Pay ₦{feeNaira.toLocaleString()} Listing Fee
    </button>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  item: SellItemType;
  onBack: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onPayFee?: () => void;
  onAcceptOffer?: () => void;
  onRejectOffer?: () => void;
  onCounterOffer?: (counterAmount?: number) => void;
  /** Optional: Pass the edit form/view as a React node for mobile full-screen rendering */
  editView?: React.ReactNode;
}

const modelIcons: Record<SellingModel, React.ElementType> = {
  'self-listing': Store,
  consignment: Handshake,
  'direct-sale': BadgeDollarSign,
};

const SellItemDetail: React.FC<Props> = ({
  item,
  onBack,
  onEdit,
  onDelete,
  onPayFee,
  onAcceptOffer,
  onRejectOffer,
  onCounterOffer,
  editView,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const statusColor = getStatusColor(item.status);
  const ModelIcon = modelIcons[item.sellingModel];
  const priceNaira = (item.askingPrice?.price || 0) / 100;

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  // Mobile full-screen view states
  const [mobileEditOpen, setMobileEditOpen] = useState(false);
  const [mobileCounterOfferOpen, setMobileCounterOfferOpen] = useState(false);

  const allMedia: string[] = item.postImgUrls || [];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  // ── Edit handler: full-screen on mobile, callback on desktop ──
  const handleEdit = useCallback(() => {
    if (isMobile && editView) {
      setMobileEditOpen(true);
    } else {
      onEdit?.();
    }
  }, [isMobile, editView, onEdit]);

  // ── Counter offer handler: full-screen on mobile, callback on desktop ──
  const handleCounterOffer = useCallback(() => {
    if (isMobile) {
      setMobileCounterOfferOpen(true);
    } else {
      onCounterOffer?.();
    }
  }, [isMobile, onCounterOffer]);

  // ── Counter offer submit from mobile view ──
  const handleCounterOfferSubmit = (amount: number) => {
    onCounterOffer?.(amount);
    setMobileCounterOfferOpen(false);
    message.success('Counter offer submitted!');
  };

  return (
    <div className="max-w-3xl mx-auto relative py-0">
      {/* ── Sticky back button ───────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white dark:bg-gray-900 pb-3 pt-1 -mx-1 px-1">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Back to Products
        </button>
      </div>

      {/* ── Media gallery ────────────────────────────────────────────────── */}
      {allMedia.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-6">
          <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 dark:scrollbar-thumb-gray-600">
            {allMedia.map((media, i) => (
              <button
                key={i}
                type="button"
                onClick={() => openLightbox(i)}
                className="relative flex-shrink-0 w-28 h-28 sm:w-32 sm:h-32 rounded-xl overflow-hidden border-2 border-gray-200 dark:border-gray-700 hover:border-blue dark:hover:border-blue transition-colors cursor-pointer group"
              >
                {isVideo(media) ? (
                  <>
                    <video
                      src={media}
                      className="w-full h-full object-cover"
                      muted
                      preload="metadata"
                      onLoadedMetadata={(e) => {
                        e.currentTarget.currentTime = 1;
                      }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-8 h-8 rounded-full bg-black/50 flex items-center justify-center">
                        <i className="ri-play-fill text-white text-sm ml-0.5"></i>
                      </div>
                    </div>
                    <span className="absolute top-1.5 right-1.5 text-[8px] font-bold bg-purple-500 text-white px-1.5 py-0.5 rounded shadow">
                      MP4
                    </span>
                  </>
                ) : (
                  <img
                    src={media}
                    alt={`${item.itemName} ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}

                {i === 0 && !isVideo(media) && (
                  <span className="absolute bottom-1.5 left-1.5 text-[9px] font-bold bg-blue text-white px-1.5 py-0.5 rounded shadow">
                    Cover
                  </span>
                )}
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Status & Model header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="flex flex-wrap items-center gap-2 mb-4"
      >
        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
          <ModelIcon size={14} />
          {getSellingModelLabel(item.sellingModel)}
        </span>

        <span
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            backgroundColor: `${statusColor}15`,
            color: statusColor,
            border: `1px solid ${statusColor}30`,
          }}
        >
          <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: statusColor }} />
          {getStatusLabel(item.status)}
        </span>

        {item.condition && (
          <span
            className={`inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold ${
              item.condition === 'Brand New'
                ? 'bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300'
                : item.condition === 'Uk Used'
                  ? 'bg-indigo-50 text-blue dark:bg-blue/20 dark:text-blue'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300'
            }`}
          >
            <Tag size={12} />
            {item.condition}
          </span>
        )}

        {item.sponsored && (
          <span className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-full text-xs font-semibold bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300">
            <i className="ri-sparkling-fill" /> Sponsored
          </span>
        )}
      </motion.div>

      {/* Title & Price */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="mb-6"
      >
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{item.itemName}</h1>
        <div className="flex items-center gap-3 mt-2">
          <span className="text-3xl font-bold text-gray-900 dark:text-white">
            ₦{priceNaira.toLocaleString()}
          </span>
          {item.askingPrice?.negotiable && (
            <span className="px-2.5 py-0.5 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">
              Negotiable
            </span>
          )}
        </div>
        <div className="flex items-center gap-1.5 mt-2 text-sm text-gray-500">
          <MapPin size={14} />
          <span>{item.location}</span>
        </div>
      </motion.div>

      {/* ─── STATUS-SPECIFIC PANELS ─────────────────────────────────────── */}

      {/* Rejection reason */}
      {item.status === 'rejected' && item.rejectionReason && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4"
        >
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-900/40 flex items-center justify-center flex-shrink-0">
              <XCircle size={18} className="text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-red-800 dark:text-red-200">Rejected</h3>
              <p className="text-sm text-red-700 dark:text-red-300 mt-1 leading-relaxed">
                {item.rejectionReason}
              </p>
              {(onEdit || editView) && (
                <button
                  onClick={handleEdit}
                  className="mt-3 text-xs font-semibold text-red-700 dark:text-red-300 hover:text-red-900 flex items-center gap-1 underline underline-offset-2"
                >
                  <Edit2 size={12} /> Edit & Resubmit
                </button>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* Awaiting fee — self-listing with Paystack */}
      {item.status === 'awaiting-fee' && item.sellingModel === 'self-listing' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-2xl p-4"
        >
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
              <CreditCard size={18} className="text-amber-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-amber-800 dark:text-amber-200">
                Listing Fee Required
              </h3>
              <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                Your item was approved! Pay the {LISTING_FEE_PERCENT}% listing fee of{' '}
                <strong>₦{((item.listingFee || 0) / 100).toLocaleString()}</strong> to go live on
                the marketplace.
              </p>
              {onPayFee && <PayListingFeeButton item={item} onSuccess={onPayFee} />}
            </div>
          </div>
        </motion.div>
      )}

      {/* Awaiting product — consignment */}
      {item.status === 'awaiting-product' && item.sellingModel === 'consignment' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 bg-violet-50 dark:bg-violet-900/20 border border-violet-200 dark:border-violet-800 rounded-2xl p-4"
        >
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-violet-100 dark:bg-violet-900/40 flex items-center justify-center flex-shrink-0">
              <Package size={18} className="text-violet-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-violet-800 dark:text-violet-200">
                Awaiting Product Handover
              </h3>
              <p className="text-sm text-violet-700 dark:text-violet-300 mt-1 leading-relaxed">
                Your item has been approved for consignment! We need to receive the physical product
                before we can list it. Please arrange drop-off or we'll contact you for pickup.
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Price offered — direct-sale */}
      {item.status === 'price-offered' &&
        item.sellingModel === 'direct-sale' &&
        item.platformBid && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-5 bg-indigo-50 dark:bg-blue/20 border border-blue dark:border-blue rounded-2xl p-5"
          >
            <div className="flex gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue dark:bg-blue/40 flex items-center justify-center flex-shrink-0">
                <BadgeDollarSign size={18} className="text-blue" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-sm text-blue dark:text-blue">
                  We've Made You an Offer
                </h3>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-blue dark:text-blue">
                    ₦{(item.platformBid / 100).toLocaleString()}
                  </span>
                  <span className="text-sm text-gray-400 line-through">
                    ₦{priceNaira.toLocaleString()}
                  </span>
                </div>
                <div className="flex gap-2 mt-4 flex-wrap">
                  {onAcceptOffer && (
                    <button
                      onClick={onAcceptOffer}
                      className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                    >
                      <ThumbsUp size={14} /> Accept Offer
                    </button>
                  )}
                  {onCounterOffer && (
                    <button
                      onClick={handleCounterOffer}
                      className="px-5 py-2 bg-white dark:bg-gray-800 border border-orange-300 dark:border-orange-700 text-orange-600 dark:text-orange-400 rounded-xl text-sm font-semibold hover:bg-orange-50 transition-all flex items-center gap-1.5"
                    >
                      <ArrowLeftRight size={14} /> Counter Offer
                    </button>
                  )}
                  {onRejectOffer && (
                    <button
                      onClick={onRejectOffer}
                      className="px-5 py-2 text-gray-500 hover:text-red-500 rounded-xl text-sm font-medium hover:bg-red-50 transition-all flex items-center gap-1.5"
                    >
                      <ThumbsDown size={14} /> Decline
                    </button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

      {/* Counter offer sent */}
      {item.status === 'counter-offer' && item.counterOffer && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-2xl p-4"
        >
          <div className="flex gap-3">
            <div className="w-9 h-9 rounded-xl bg-orange-100 dark:bg-orange-900/40 flex items-center justify-center flex-shrink-0">
              <ArrowLeftRight size={18} className="text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-sm text-orange-800 dark:text-orange-200">
                Counter Offer Sent
              </h3>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                You countered with <strong>₦{(item.counterOffer / 100).toLocaleString()}</strong>{' '}
                (they offered ₦{((item.platformBid || 0) / 100).toLocaleString()}). Waiting for
                response...
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Live status */}
      {item.status === 'live' && (
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-5 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-2xl p-4"
        >
          <div className="flex gap-3 items-center">
            <div className="w-9 h-9 rounded-xl bg-green-100 dark:bg-green-900/40 flex items-center justify-center flex-shrink-0">
              <CheckCircle2 size={18} className="text-green-600" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-sm text-green-800 dark:text-green-200">
                Live on Marketplace
              </h3>
              <p className="text-sm text-green-700 dark:text-green-300 mt-0.5">
                Your item is visible to buyers and accepting enquiries.
              </p>
            </div>
            <button className="text-xs font-semibold text-green-700 dark:text-green-300 flex items-center gap-1 hover:underline">
              View Listing <ExternalLink size={12} />
            </button>
          </div>
        </motion.div>
      )}

      {/* ─── Description ────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="mb-6"
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Description
        </h3>
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
          {item.description}
        </p>
      </motion.div>

      {/* ─── Engagement Stats ───────────────────────────────────────────── */}
      {(item.status === 'live' || item.status === 'sold') && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-6 grid grid-cols-3 gap-3"
        >
          {[
            { icon: Heart, label: 'Likes', count: item.likes?.length || 0, color: 'text-red-500' },
            {
              icon: MessageCircle,
              label: 'Comments',
              count: item.comments?.length || 0,
              color: 'text-blue',
            },
            {
              icon: Bookmark,
              label: 'Saves',
              count: item.bookMarks?.length || 0,
              color: 'text-purple-500',
            },
          ].map(({ icon: Icon, label, count, color }) => (
            <div key={label} className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 text-center">
              <Icon size={18} className={`${color} mx-auto mb-1`} />
              <p className="text-lg font-bold text-gray-900 dark:text-white">{count}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">{label}</p>
            </div>
          ))}
        </motion.div>
      )}

      {/* ─── Pricing Summary ────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mb-6 bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4"
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Pricing Summary
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Your asking price</span>
            <span className="font-semibold">₦{priceNaira.toLocaleString()}</span>
          </div>

          {item.sellingModel === 'self-listing' && item.listingFee && (
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Listing fee ({LISTING_FEE_PERCENT}%)</span>
              <span className="font-semibold text-blue">
                ₦{(item.listingFee / 100).toLocaleString()}
              </span>
            </div>
          )}

          {item.sellingModel === 'consignment' && (
            <>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">
                  Commission ({CONSIGNMENT_COMMISSION_PERCENT}%)
                </span>
                <span className="font-medium">
                  ₦
                  {(
                    ((item.askingPrice?.price || 0) * CONSIGNMENT_COMMISSION_PERCENT) /
                    100 /
                    100
                  ).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-medium text-gray-700 dark:text-gray-300">You receive</span>
                <span className="font-bold text-emerald-600">
                  ₦
                  {(
                    ((item.askingPrice?.price || 0) * (100 - CONSIGNMENT_COMMISSION_PERCENT)) /
                    100 /
                    100
                  ).toLocaleString()}
                </span>
              </div>
            </>
          )}

          {item.sellingModel === 'direct-sale' && item.platformBid && (
            <div className="flex justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="font-medium text-gray-700 dark:text-gray-300">Our offer</span>
              <span className="font-bold text-blue">
                ₦{(item.platformBid / 100).toLocaleString()}
              </span>
            </div>
          )}
        </div>
      </motion.div>

      {/* ─── Timeline ───────────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="mb-8"
      >
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
          Timeline
        </h3>
        <div className="flex items-center gap-1.5 text-xs text-gray-400">
          <Clock size={12} />
          <span>
            Created{' '}
            {new Date(item.createdAt).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
          <span className="text-gray-300">·</span>
          <span>
            Updated{' '}
            {new Date(item.updatedAt).toLocaleDateString('en-NG', {
              year: 'numeric',
              month: 'short',
              day: 'numeric',
            })}
          </span>
        </div>
      </motion.div>

      {/* ─── Bottom actions ─────────────────────────────────────────────── */}
      {(item.status === 'in-review' || item.status === 'rejected') && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.35 }}
          className="flex gap-3 pb-8"
        >
          {(onEdit || editView) && (
            <button
              onClick={handleEdit}
              className="flex-1 py-3 bg-blue dark:bg-gray-800 text-white dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-blue dark:hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
            >
              <Edit2 size={15} /> Edit Product
            </button>
          )}
          {onDelete && (
            <button
              onClick={onDelete}
              className="py-3 px-6 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 rounded-xl text-sm font-semibold hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center justify-center gap-2"
            >
              <Trash2 size={15} /> Delete
            </button>
          )}
        </motion.div>
      )}

      {/* ─── LIGHTBOX: Desktop Modal / Mobile Full-Screen ────────────────── */}
      {isMobile ? (
        <MobileFullScreen open={lightboxOpen} onClose={() => setLightboxOpen(false)} title="Media">
          <MobileLightboxContent media={allMedia} initialIndex={lightboxIndex} />
        </MobileFullScreen>
      ) : (
        <MediaLightboxDesktop
          media={allMedia}
          initialIndex={lightboxIndex}
          open={lightboxOpen}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      {/* ─── COUNTER OFFER: Mobile Full-Screen ──────────────────────────── */}
      {isMobile && (
        <MobileFullScreen
          open={mobileCounterOfferOpen}
          onClose={() => setMobileCounterOfferOpen(false)}
          title="Counter Offer"
        >
          <CounterOfferView item={item} onSubmit={handleCounterOfferSubmit} />
        </MobileFullScreen>
      )}

      {/* ─── EDIT: Mobile Full-Screen (only if editView provided) ────────── */}
      {isMobile && editView && (
        <MobileFullScreen
          open={mobileEditOpen}
          onClose={() => setMobileEditOpen(false)}
          title="Edit Product"
        >
          {editView}
        </MobileFullScreen>
      )}
    </div>
  );
};

export default SellItemDetail;
