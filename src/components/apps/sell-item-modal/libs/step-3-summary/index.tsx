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
  Loader2,
  PartyPopper,
  Tag,
} from 'lucide-react';
import { SellingModel, getSellingModelLabel } from '@grc/_shared/namespace/sell-item';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

// ═══════════════════════════════════════════════════════════════════════════
// ENV CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const IS_FREE_LISTING = process.env.NEXT_PUBLIC_FREE_LISTING === 'true';
const IS_NO_COMMISSION = process.env.NEXT_PUBLIC_NO_COMMISSION === 'true';
const SELF_LISTING_FEE_PERCENT = Number(process.env.NEXT_PUBLIC_SELF_LISTING_FEE_PERCENT) || 5;
const CONSIGNMENT_COMMISSION_PERCENT =
  Number(process.env.NEXT_PUBLIC_CONSIGNMENT_COMMISSION_PERCENT) || 20;
const LISTING_FEE_CAP_KOBO = Number(process.env.NEXT_PUBLIC_LISTING_FEE_CAP_KOBO) || 0;
const CONSIGNMENT_COMMISSION_CAP_KOBO =
  Number(process.env.NEXT_PUBLIC_CONSIGNMENT_COMMISSION_CAP_KOBO) || 0;

const calculateListingFee = (priceInKobo: number) => {
  const base = LISTING_FEE_CAP_KOBO > 0 ? Math.min(priceInKobo, LISTING_FEE_CAP_KOBO) : priceInKobo;
  return Math.round(base * (SELF_LISTING_FEE_PERCENT / 100));
};

const calculateConsignmentCut = (priceInKobo: number) => {
  const base =
    CONSIGNMENT_COMMISSION_CAP_KOBO > 0
      ? Math.min(priceInKobo, CONSIGNMENT_COMMISSION_CAP_KOBO)
      : priceInKobo;
  const platformCut = Math.round(base * (CONSIGNMENT_COMMISSION_PERCENT / 100));
  return { platformCut, sellerCut: priceInKobo - platformCut };
};

// ═══════════════════════════════════════════════════════════════════════════

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

  const renderMedia = () => (
    <>
      <div className="absolute top-3 left-3 z-20 text-xs text-white/60 font-medium bg-black/40 px-2.5 py-1 rounded-full">
        {currentIndex + 1} / {media.length}
      </div>
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
      {media.length > 1 && (
        <>
          <button
            onClick={(e) => {
              e.stopPropagation();
              if (hasPrev) setCurrentIndex((i) => i - 1);
            }}
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
            onClick={(e) => {
              e.stopPropagation();
              if (hasNext) setCurrentIndex((i) => i + 1);
            }}
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
                <div className="w-full h-full bg-neutral-800 flex items-center justify-center relative">
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
  isSubmitting?: boolean;
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
      IS_FREE_LISTING
        ? 'Once approved, your item will go live immediately — no fee required!'
        : "Once approved, you'll need to pay the listing fee to go live",
      `After ${
        IS_FREE_LISTING ? 'approval' : 'payment'
      }, your item will be visible on the marketplace`,
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
      IS_NO_COMMISSION
        ? 'When sold, you keep 100% of the proceeds — commission is currently waived!'
        : 'When sold, your share will be sent directly to your account',
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
  isSubmitting = false,
}) => {
  const config = modelConfig[sellingModel];
  const ModelIcon = config.icon;
  const quantity = basicInfoData.quantity || 1;
  const unitPriceKobo = (pricingData.askPrice || 0) * 100;
  const totalValueKobo = unitPriceKobo * quantity;
  const listingFee = calculateListingFee(totalValueKobo);
  const { platformCut, sellerCut } = calculateConsignmentCut(totalValueKobo);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const allMedia: string[] = basicInfoData.images || [];
  const tags: string[] = basicInfoData.tags || [];
  const isMobile = useMediaQuery(mediaSize?.mobile);

  const SummaryRow = ({
    label,
    value,
    highlight,
    strikethrough,
  }: {
    label: string;
    value: React.ReactNode;
    highlight?: boolean;
    strikethrough?: boolean;
  }) => (
    <div className="flex justify-between items-start py-2.5 border-b border-neutral-100 dark:border-neutral-700/50 last:border-0">
      <span className="text-sm text-neutral-500 dark:text-neutral-400">{label}</span>
      <span
        className={`text-sm text-right max-w-[60%] ${
          strikethrough
            ? 'line-through text-neutral-400'
            : highlight
              ? `font-bold text-${config.color}-600`
              : 'font-medium text-neutral-900 dark:text-white'
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
          <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2">
            Product Media
          </h4>
          <div className="flex gap-2 overflow-x-auto pb-1">
            {allMedia.map((media: string, i: number) => (
              <button
                key={i}
                type="button"
                onClick={() => {
                  setLightboxIndex(i);
                  setLightboxOpen(true);
                }}
                className="relative w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-200 dark:border-neutral-700 hover:border-blue transition-colors cursor-pointer group"
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
                      <div className="w-6 h-6 rounded-full bg-black/50 flex items-center justify-center">
                        <i className="ri-play-fill text-white text-[10px] ml-px"></i>
                      </div>
                    </div>
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
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
          Product Details
        </h4>
        <SummaryRow label="Product Name" value={basicInfoData.itemName} />
        <SummaryRow label="Condition" value={basicInfoData.condition} />
        {quantity > 1 && <SummaryRow label="Quantity" value={`${quantity} units`} />}
        {basicInfoData.category && <SummaryRow label="Category" value={basicInfoData.category} />}
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

      {/* Tags */}
      {tags.length > 0 && (
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
          <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <Tag size={12} />
            Tags
          </h4>
          <div className="flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-full text-[11px] font-medium text-blue dark:text-blue-300"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Pricing Details */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1">
          Pricing & Location
        </h4>
        <SummaryRow
          label="Location"
          value={
            <span className="flex items-center gap-1">
              <MapPin size={13} className="text-neutral-400" />
              {[pricingData.city, pricingData.state].filter(Boolean).join(', ')}
            </span>
          }
        />
        <SummaryRow
          label={quantity > 1 ? 'Unit Price' : 'Ask Price'}
          value={`₦${(pricingData.askPrice || 0).toLocaleString()}`}
        />
        {quantity > 1 && <SummaryRow label="Quantity" value={`× ${quantity}`} />}
        {quantity > 1 && (
          <SummaryRow
            label="Total Value"
            value={`₦${((pricingData.askPrice || 0) * quantity).toLocaleString()}`}
          />
        )}

        {sellingModel === 'self-listing' && (
          <>
            {IS_FREE_LISTING ? (
              <>
                <div className="flex justify-between items-start py-2.5 border-b border-neutral-100 dark:border-neutral-700/50">
                  <span className="text-sm text-neutral-500">
                    Listing Fee ({SELF_LISTING_FEE_PERCENT}%)
                  </span>
                  <span className="text-sm font-semibold">
                    <span className="line-through text-neutral-400 mr-1.5">
                      ₦{(listingFee / 100).toLocaleString()}
                    </span>
                    <span className="text-emerald-600">₦0 (Free)</span>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium pt-1">
                  <PartyPopper size={12} /> Listing is free for a limited time!
                </div>
              </>
            ) : (
              <SummaryRow
                label={`Listing Fee (${SELF_LISTING_FEE_PERCENT}%)`}
                value={`₦${(listingFee / 100).toLocaleString()}`}
                highlight
              />
            )}
            {pricingData.negotiable !== undefined && (
              <SummaryRow label="Negotiable" value={pricingData.negotiable ? 'Yes' : 'No'} />
            )}
          </>
        )}

        {sellingModel === 'consignment' && (
          <>
            {IS_NO_COMMISSION ? (
              <>
                <div className="flex justify-between items-start py-2.5 border-b border-neutral-100 dark:border-neutral-700/50">
                  <span className="text-sm text-neutral-500">
                    Commission ({CONSIGNMENT_COMMISSION_PERCENT}%)
                  </span>
                  <span className="text-sm font-semibold">
                    <span className="line-through text-neutral-400 mr-1.5">
                      ₦{(platformCut / 100).toLocaleString()}
                    </span>
                    <span className="text-emerald-600">₦0 (Waived)</span>
                  </span>
                </div>
                <SummaryRow
                  label="You receive"
                  value={`₦${((pricingData.askPrice || 0) * quantity).toLocaleString()} (100%)`}
                  highlight
                />
                <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium pt-1">
                  <PartyPopper size={12} /> Commission is currently waived!
                </div>
              </>
            ) : (
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
              </>
            )}
            {pricingData.negotiable !== undefined && (
              <SummaryRow label="Negotiable" value={pricingData.negotiable ? 'Yes' : 'No'} />
            )}
          </>
        )}

        {sellingModel === 'direct-sale' && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-400 pt-2">
            <AlertCircle size={12} />
            <span>We'll review and send you an offer</span>
          </div>
        )}
      </div>

      {/* What happens next */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4">
        <h4 className="text-xs font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
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
              <p className="text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                {step}
              </p>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700">
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-5 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Back
        </button>
        <motion.button
          whileHover={isSubmitting ? {} : { scale: 1.02 }}
          whileTap={isSubmitting ? {} : { scale: 0.98 }}
          onClick={onSubmit}
          disabled={isSubmitting}
          className={`px-8 py-3 text-sm font-semibold bg-gradient-to-r ${config.gradient} text-white rounded-xl shadow-lg shadow-${config.color}-500/20 hover:shadow-xl transition-all flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={16} className="animate-spin" />
              Submitting...
            </>
          ) : (
            <>
              <CheckCircle2 size={16} />
              Submit for Review
            </>
          )}
        </motion.button>
      </div>

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
