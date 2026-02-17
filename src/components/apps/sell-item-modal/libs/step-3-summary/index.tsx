'use client';

import React, { useState } from 'react';
import { Modal } from 'antd';
import { motion } from 'framer-motion';
import {
  Store,
  Handshake,
  BadgeDollarSign,
  MapPin,
  CheckCircle2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  X,
} from 'lucide-react';
import {
  SellingModel,
  getSellingModelLabel,
  LISTING_FEE_PERCENT,
  CONSIGNMENT_COMMISSION_PERCENT,
  calculateListingFee,
  calculateConsignmentCut,
} from '@grc/_shared/namespace/sell-item';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

// ─── Helpers ──────────────────────────────────────────────────────────────────

const isVideo = (url: string): boolean => url.startsWith('data:video/') || url.endsWith('.mp4');

// ─── Media Lightbox ───────────────────────────────────────────────────────────

interface LightboxProps {
  media: string[];
  initialIndex: number;
  open: boolean;
  onClose: () => void;
}

const MediaLightbox: React.FC<LightboxProps> = ({ media, initialIndex, open, onClose }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
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

  // ── Shared content ──────────────────────────────────────────────────
  const renderMedia = () => (
    <>
      {/* Counter */}
      <div className="absolute top-3 left-3 z-20 text-xs text-white/60 font-medium bg-black/40 px-2.5 py-1 rounded-full">
        {currentIndex + 1} / {media.length}
      </div>

      {/* Main media */}
      <div
        className={`w-full flex items-center justify-center p-4 ${
          isMobile ? 'flex-1 min-h-0' : 'min-h-[300px] max-h-[70vh]'
        }`}
      >
        {isVideo(current) ? (
          <video
            key={current}
            src={current}
            controls
            autoPlay
            className={`max-w-full rounded-lg ${isMobile ? 'max-h-[70vh]' : 'max-h-[65vh]'}`}
          />
        ) : (
          <img
            key={current}
            src={current}
            alt={`Media ${currentIndex + 1}`}
            className={`max-w-full rounded-lg object-contain ${
              isMobile ? 'max-h-[70vh]' : 'max-h-[65vh]'
            }`}
          />
        )}
      </div>

      {/* Navigation arrows */}
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

      {/* Thumbnail strip */}
      {media.length > 1 && (
        <div className="flex gap-2 pb-4 px-4 overflow-x-auto flex-shrink-0">
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
    </>
  );

  if (!open) return null;

  // ── Mobile: full-screen ─────────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="fixed inset-0 z-[10000] bg-black flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X size={18} className="text-white" />
        </button>
        {renderMedia()}
      </div>
    );
  }

  // ── Desktop: modal ──────────────────────────────────────────────────
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      closeIcon={null}
      className="[&_.ant-modal-content]:!bg-black/95 [&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!p-0 [&_.ant-modal-body]:!p-0"
    >
      <div className="relative flex flex-col items-center">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors"
        >
          <X size={18} className="text-white" />
        </button>
        {renderMedia()}
      </div>
    </Modal>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

interface Props {
  basicInfoData: Record<string, any>;
  pricingData: Record<string, any>;
  sellingModel: SellingModel;
  onSubmit: () => void;
  onBack: () => void;
}

const modelConfig: Record<
  SellingModel,
  { icon: React.ElementType; color: string; gradient: string; whatHappensNext: string[] }
> = {
  'self-listing': {
    icon: Store,
    color: 'blue',
    gradient: 'from-blue to-indigo-500',
    whatHappensNext: [
      'Your item will be reviewed by our team (usually within 24 hours)',
      "Once approved, you'll need to pay the listing fee to go live",
      'After payment, your item will be visible on the marketplace',
      'Buyers will contact you directly to purchase',
    ],
  },
  consignment: {
    icon: Handshake,
    color: 'violet',
    gradient: 'from-violet-500 to-purple-500',
    whatHappensNext: [
      'Your item will be reviewed by our team (usually within 24 hours)',
      "Once approved, we'll arrange pickup or drop-off of your item",
      "We'll photograph and list your item professionally",
      'When sold, your share will be sent directly to your account',
    ],
  },
  'direct-sale': {
    icon: BadgeDollarSign,
    color: 'emerald',
    gradient: 'from-emerald-500 to-teal-500',
    whatHappensNext: [
      'Your item will be reviewed by our team (usually within 24 hours)',
      "We'll send you a price offer based on market value",
      'You can accept, counter-offer, or decline',
      "If accepted, we'll arrange payment and pickup",
    ],
  },
};

const SellItemReview: React.FC<Props> = ({
  basicInfoData,
  pricingData,
  sellingModel,
  onSubmit,
  onBack,
}) => {
  const config = modelConfig[sellingModel];
  const ModelIcon = config.icon;
  const askPriceKobo = (pricingData.askPrice || 0) * 100;
  const listingFee = calculateListingFee(askPriceKobo);
  const { platformCut, sellerCut } = calculateConsignmentCut(askPriceKobo);

  // Lightbox state
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const allMedia: string[] = basicInfoData.images || [];

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const isMobile = useMediaQuery(mediaSize?.mobile);

  const SummaryRow = ({
    label,
    value,
    highlight,
  }: {
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
  }) => (
    <div className="flex justify-between items-start py-2.5 border-b border-gray-100 dark:border-gray-700/50 last:border-0">
      <span className="text-sm text-gray-500 dark:text-gray-400">{label}</span>
      <span
        className={`text-sm text-right max-w-[60%] ${
          highlight
            ? `font-bold text-${config.color}-600`
            : 'font-medium text-gray-900 dark:text-white'
        }`}
      >
        {value}
      </span>
    </div>
  );

  return (
    <div className={`space-y-5 ${isMobile ? 'mb-16' : ''}`}>
      {/* Sell type badge */}
      <div
        className={`bg-gradient-to-r ${config.gradient} rounded-xl p-4 flex items-center gap-3 text-white`}
      >
        <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
          <ModelIcon size={20} />
        </div>
        <div>
          <p className="text-xs font-medium text-white/70">Selling Method</p>
          <p className="font-bold text-base">{getSellingModelLabel(sellingModel)}</p>
        </div>
      </div>

      {/* Product Media */}
      {allMedia.length > 0 && (
        <div>
          <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">
            Product Media
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allMedia.map((media: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => openLightbox(i)}
                className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200 dark:border-gray-700 hover:border-blue dark:hover:border-blue transition-colors cursor-pointer group"
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
                    {/* Play overlay */}
                    <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/30 transition-colors">
                      <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                        <i className="ri-play-fill text-white text-[10px] ml-px"></i>
                      </div>
                    </div>
                    {/* MP4 badge */}
                    <span className="absolute top-0.5 right-0.5 text-[7px] font-bold bg-purple-500 text-white px-1 rounded">
                      MP4
                    </span>
                  </>
                ) : (
                  <img
                    src={media}
                    alt={`Product ${i + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Product Details */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
          Product Details
        </h4>
        <SummaryRow label="Product Name" value={basicInfoData.itemName} />
        <SummaryRow label="Condition" value={basicInfoData.condition} />
        <SummaryRow
          label="Description"
          value={
            <span className="text-xs leading-relaxed">
              {(basicInfoData.description || '').length > 120
                ? basicInfoData.description.substring(0, 120) + '...'
                : basicInfoData.description}
            </span>
          }
        />
      </div>

      {/* Pricing Details */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-1">
          Pricing & Location
        </h4>
        <SummaryRow
          label="Location"
          value={
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-gray-400" />
              {pricingData.location}
            </span>
          }
        />
        <SummaryRow label="Ask Price" value={`₦${(pricingData.askPrice || 0).toLocaleString()}`} />

        {sellingModel === 'self-listing' && (
          <>
            <SummaryRow
              label={`Listing Fee (${LISTING_FEE_PERCENT}%)`}
              value={`₦${(listingFee / 100).toLocaleString()}`}
              highlight
            />
            {pricingData.negotiable !== undefined && (
              <SummaryRow label="Negotiable" value={pricingData.negotiable ? 'Yes' : 'No'} />
            )}
          </>
        )}

        {sellingModel === 'consignment' && (
          <>
            <SummaryRow
              label={`Commission (${CONSIGNMENT_COMMISSION_PERCENT}%)`}
              value={`₦${(platformCut / 100).toLocaleString()}`}
            />
            <SummaryRow
              label="You receive"
              value={`₦${(sellerCut / 100).toLocaleString()}`}
              highlight
            />
            {pricingData.negotiable !== undefined && (
              <SummaryRow label="Negotiable" value={pricingData.negotiable ? 'Yes' : 'No'} />
            )}
          </>
        )}

        {sellingModel === 'direct-sale' && (
          <div className="flex items-center gap-1.5 text-xs text-gray-400 pt-2">
            <AlertCircle size={12} />
            <span>We'll review and send you an offer</span>
          </div>
        )}
      </div>

      {/* What happens next */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          What happens next?
        </h4>
        <div className="space-y-2.5">
          {config.whatHappensNext.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex gap-2.5"
            >
              <div
                className={`w-5 h-5 rounded-full bg-${config.color}-100 dark:bg-${config.color}-900/30 flex items-center justify-center flex-shrink-0 mt-0.5`}
              >
                <span
                  className={`text-[10px] font-bold text-${config.color}-600 dark:text-${config.color}-400`}
                >
                  {i + 1}
                </span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{step}</p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
        >
          Back
        </button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onSubmit}
          className={`px-8 py-3 text-sm font-semibold bg-gradient-to-r ${config.gradient} text-white rounded-xl shadow-lg shadow-${config.color}-500/20 hover:shadow-xl transition-all flex items-center gap-2`}
        >
          <CheckCircle2 size={16} />
          Submit for Review
        </motion.button>
      </div>

      {/* Lightbox */}
      <MediaLightbox
        media={allMedia}
        initialIndex={lightboxIndex}
        open={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </div>
  );
};

export default SellItemReview;
