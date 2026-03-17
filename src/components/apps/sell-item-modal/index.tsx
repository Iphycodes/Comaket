'use client';

import React, { Dispatch, SetStateAction, useState } from 'react';
import { Modal, message } from 'antd';
import { useForm } from 'antd/lib/form/Form';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { PostRequestSuccessful } from '../post-request-successful';
import { SellingModel } from '@grc/_shared/namespace/sell-item';
import SellTypeSelector from '../sell-item-selector';
import SellItemBasicInfo from './libs/step-1-basic-info';
import SellItemPricing from './libs/step-2-location-and-pricing';
import SellItemReview from './libs/step-3-summary';
import { useListings } from '@grc/hooks/useListings';
import { useMedia } from '@grc/hooks/useMedia';
import type { CreateListingPayload, ListingType, ItemCondition } from '@grc/services/listings';
import { useCreators } from '@grc/hooks/useCreators';
import { useAuth } from '@grc/hooks/useAuth';
import { useUsers } from '@grc/hooks/useUser';
import { CREATOR_INDUSTRIES } from '@grc/_shared/constant';

// ═══════════════════════════════════════════════════════════════════════════
// MAPPINGS
// ═══════════════════════════════════════════════════════════════════════════

const MODEL_TO_TYPE: Record<SellingModel, ListingType> = {
  'self-listing': 'self_listing',
  consignment: 'consignment',
  'direct-sale': 'direct_purchase',
};

const CONDITION_TO_BE: Record<string, ItemCondition> = {
  'Brand New': 'brand_new',
  Refurbished: 'refurbished',
  'Fairly Used': 'fairly_used',
};

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
};

const isVideo = (url: string): boolean => url.startsWith('data:video/') || url.endsWith('.mp4');

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type Step = 'sell-type' | 'basic-info' | 'pricing' | 'review';

interface Props {
  isSellItemModalOpen: boolean;
  setIsSellItemModalOpen: Dispatch<SetStateAction<boolean>>;
  handleTrackStatus: (id: string | number) => void;
  storeId: string;
  /** Override category options (store industries). Falls back to creator industries if not provided. */
  categoryOptions?: { id: string; label: string }[];
  /** Default state/city for pricing step location. */
  defaultLocation?: { state: string; city: string };
}

const steps: { key: Step; label: string }[] = [
  { key: 'sell-type', label: 'Sell Type' },
  { key: 'basic-info', label: 'Product Info' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'review', label: 'Review' },
];

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const SellItemModal: React.FC<Props> = ({
  isSellItemModalOpen,
  setIsSellItemModalOpen,
  handleTrackStatus,
  storeId,
  categoryOptions,
  defaultLocation,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [currentStep, setCurrentStep] = useState<Step>('sell-type');
  const [sellingModel, setSellingModel] = useState<SellingModel | undefined>();
  const [basicInfoData, setBasicInfoData] = useState<Record<string, any>>({});
  const [pricingData, setPricingData] = useState<Record<string, any>>({});
  const [isPostRequestSuccessful, setIsPostRequestSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [createdListingId, setCreatedListingId] = useState<string>('');
  const [basicInfoForm] = useForm();
  const [pricingForm] = useForm();
  const { isAuthenticated } = useAuth();

  const { userProfile } = useUsers({ fetchProfile: isAuthenticated ?? false });
  const isCreatorAccount = userProfile?.role === 'creator';

  const { creatorProfile } = useCreators({
    fetchProfile: isAuthenticated ? isCreatorAccount : false,
  });

  // ── Build category options: use prop override or fall back to creator's industries ──
  const resolvedCategoryOptions =
    categoryOptions ||
    ((creatorProfile?.industries || [])
      .map((id: string) => {
        const found = CREATOR_INDUSTRIES.find((ind) => ind.id === id);
        return found ? { id: found.id, label: found.label } : null;
      })
      .filter(Boolean) as { id: string; label: string }[]);

  // ── Default location: use prop override or fall back to creator's location ──
  const resolvedDefaultLocation = defaultLocation || {
    state: creatorProfile?.location?.state || '',
    city: creatorProfile?.location?.city || '',
  };

  // ── Hooks ─────────────────────────────────────────────────────────────
  const { createListing } = useListings();
  const { uploadImage, uploadImages } = useMedia();

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
  const showFixedCta = currentStep === 'sell-type' && !isPostRequestSuccessful;

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleSelectSellType = (model: SellingModel) => setSellingModel(model);

  const handleSellTypeContinue = () => {
    if (!sellingModel) {
      message.warning('Please select how you want to sell');
      return;
    }
    setCurrentStep('basic-info');
  };

  const handleBasicInfoContinue = (values: Record<string, any>) => {
    setBasicInfoData(values);
    setCurrentStep('pricing');
  };

  const handlePricingContinue = (values: Record<string, any>) => {
    setPricingData(values);
    setCurrentStep('review');
  };

  // ══════════════════════════════════════════════════════════════════════
  // SUBMIT
  // ══════════════════════════════════════════════════════════════════════

  const handleCompleted = async () => {
    if (!sellingModel) {
      message.error('Please select a selling model.');
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload media
      const rawMedia: string[] = basicInfoData.images || [];
      const mediaPayload: Array<{ url: string; type: 'image' | 'video' }> = [];

      if (rawMedia.length > 0) {
        const imageItems: { index: number; dataUrl: string }[] = [];
        const videoItems: { index: number; dataUrl: string }[] = [];

        rawMedia.forEach((item, i) => {
          if (isVideo(item)) videoItems.push({ index: i, dataUrl: item });
          else imageItems.push({ index: i, dataUrl: item });
        });

        if (imageItems.length > 0) {
          const imageFiles = await Promise.all(
            imageItems.map(({ dataUrl }, i) =>
              dataUrlToFile(dataUrl, `product-${Date.now()}-img-${i}.jpg`)
            )
          );
          const imageUrls = await uploadImages(imageFiles, true);
          imageUrls.forEach((url) => {
            if (url) mediaPayload.push({ url, type: 'image' });
          });
        }

        for (const { dataUrl } of videoItems) {
          const file = await dataUrlToFile(dataUrl, `product-${Date.now()}-vid.mp4`);
          const url = await uploadImage(file, true);
          if (url) mediaPayload.push({ url, type: 'video' });
        }
      }

      // 2. Build payload
      const payload: CreateListingPayload = {
        storeId,
        itemName: basicInfoData.itemName,
        description: basicInfoData.description,
        condition:
          CONDITION_TO_BE[basicInfoData.condition] || (basicInfoData.condition as ItemCondition),
        category: basicInfoData.category,
        tags: basicInfoData.tags || [],
        type: MODEL_TO_TYPE[sellingModel],
        askingPrice: {
          amount: Math.round((pricingData.askPrice || 0) * 100),
          currency: 'NGN',
          negotiable: sellingModel === 'direct-sale' ? false : pricingData.negotiable ?? false,
        },
        media: mediaPayload.length > 0 ? mediaPayload : undefined,
        location: {
          country: 'Nigeria',
          state: pricingData?.state,
          city: pricingData?.city,
        },
        quantity: basicInfoData.quantity || 1,
        whatsappNumber: creatorProfile?.whatsappNumber,
      };

      // 3. Create listing
      const result = await createListing(payload);
      const listingId = result?.data?._id || result?._id;

      if (!listingId) throw new Error('Listing created but no ID returned');

      // 4. Success
      setCreatedListingId(listingId);
      setIsPostRequestSuccessful(true);
    } catch (error: any) {
      console.error('Failed to create listing:', error);
      if (!error?.data?.message) message.error('Failed to submit listing. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoBack = () => {
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) setCurrentStep(prevStep.key);
  };

  const handleCancel = () => {
    setIsSellItemModalOpen(false);
    // Reset immediately so state is clean if modal reopens
    setCurrentStep('sell-type');
    setSellingModel(undefined);
    setIsPostRequestSuccessful(false);
    setIsSubmitting(false);
    setCreatedListingId('');
    basicInfoForm.resetFields();
    pricingForm.resetFields();
    setBasicInfoData({});
    setPricingData({});
  };

  // ── Step progress indicator ─────────────────────────────────────────────

  const StepIndicator = () => (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => {
        const isActive = i === currentStepIndex;
        const isComplete = i < currentStepIndex;
        return (
          <div key={step.key} className="flex-1 flex flex-col gap-1.5">
            <div className="relative h-1 rounded-full bg-neutral-200 dark:bg-neutral-700 overflow-hidden">
              <motion.div
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-blue to-indigo-500"
                initial={false}
                animate={{ width: isComplete ? '100%' : isActive ? '50%' : '0%' }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              />
            </div>
            <span
              className={`text-[10px] font-medium tracking-wide uppercase ${
                isActive
                  ? 'text-blue'
                  : isComplete
                    ? 'text-neutral-700 dark:text-neutral-300'
                    : 'text-neutral-400 dark:text-neutral-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  const ContinueButton: React.FC<{ fullWidth?: boolean }> = ({ fullWidth = false }) => (
    <button
      onClick={handleSellTypeContinue}
      disabled={!sellingModel}
      className={`${
        fullWidth ? 'w-full' : 'px-8'
      } py-3.5 rounded-xl text-sm font-semibold transition-all duration-200 ${
        sellingModel
          ? 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
          : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
      }`}
    >
      Continue
    </button>
  );

  // ── Step content ────────────────────────────────────────────────────────

  const renderStepContent = () => {
    if (isPostRequestSuccessful) {
      return (
        <PostRequestSuccessful
          itemName={basicInfoData.itemName}
          itemId={createdListingId || '0'}
          onClose={handleCancel}
          onTrackStatus={handleTrackStatus}
          type="new"
          sellingModel={sellingModel}
        />
      );
    }

    return (
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {currentStep === 'sell-type' && (
            <SellTypeSelector onSelect={handleSelectSellType} selected={sellingModel} />
          )}

          {currentStep === 'basic-info' && (
            <SellItemBasicInfo
              form={basicInfoForm}
              initialData={basicInfoData}
              onContinue={handleBasicInfoContinue}
              onBack={handleGoBack}
              sellingModel={sellingModel!}
              creatorIndustries={resolvedCategoryOptions}
            />
          )}

          {currentStep === 'pricing' && (
            <SellItemPricing
              form={pricingForm}
              initialData={{
                ...pricingData,
                ...(pricingData.state ? {} : resolvedDefaultLocation),
              }}
              onContinue={handlePricingContinue}
              onBack={handleGoBack}
              sellingModel={sellingModel!}
              quantity={basicInfoData.quantity || 1}
            />
          )}

          {currentStep === 'review' && (
            <SellItemReview
              basicInfoData={basicInfoData}
              pricingData={pricingData}
              sellingModel={sellingModel!}
              onSubmit={handleCompleted}
              onBack={handleGoBack}
              isSubmitting={isSubmitting}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  // ════════════════════════════════════════════════════════════════════════
  // MOBILE LAYOUT
  // ════════════════════════════════════════════════════════════════════════

  if (isMobile) {
    if (!isSellItemModalOpen) return null;

    const HEADER_HEIGHT = isPostRequestSuccessful ? 56 : 88;
    const CTA_HEIGHT = showFixedCta ? 72 : 0;

    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-neutral-900">
        <div
          className="absolute top-0 left-0 right-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700"
          style={{ height: HEADER_HEIGHT }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {currentStepIndex > 0 && !isPostRequestSuccessful && (
                <button
                  onClick={handleGoBack}
                  disabled={isSubmitting}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Sell Item</h2>
            </div>
            <button
              onClick={handleCancel}
              disabled={isSubmitting}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
            >
              <X size={18} />
            </button>
          </div>
          {!isPostRequestSuccessful && (
            <div className="px-4 pb-2">
              <StepIndicator />
            </div>
          )}
        </div>

        <div
          className="absolute left-0 right-0 overflow-y-auto px-4 py-4"
          style={{ top: HEADER_HEIGHT, bottom: CTA_HEIGHT }}
        >
          {renderStepContent()}
        </div>

        {showFixedCta && (
          <div
            className="absolute bottom-0 left-0 right-0 z-10 bg-white dark:bg-neutral-900 border-t border-neutral-200 dark:border-neutral-700 px-4 py-4"
            style={{ height: CTA_HEIGHT }}
          >
            <ContinueButton fullWidth />
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // DESKTOP LAYOUT
  // ════════════════════════════════════════════════════════════════════════

  return (
    <Modal
      width={800}
      className="sell-item-modal !top-20"
      open={isSellItemModalOpen}
      onCancel={handleCancel}
      maskClosable={false}
      footer={null}
      closable={!isSubmitting}
      title={
        <div className="space-y-4 pb-2">
          <div className="flex items-center gap-3">
            {currentStepIndex > 0 && !isPostRequestSuccessful && (
              <button
                onClick={handleGoBack}
                disabled={isSubmitting}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors disabled:opacity-50"
              >
                <ArrowLeft size={18} />
              </button>
            )}
            <h2 className="text-2xl font-bold">Sell Item</h2>
          </div>
          {!isPostRequestSuccessful && (
            <div className="pt-2">
              <StepIndicator />
            </div>
          )}
        </div>
      }
    >
      <div className="flex flex-col h-[70vh]">
        <div className="flex-1 min-h-0 overflow-y-auto px-1 py-2">{renderStepContent()}</div>
        {showFixedCta && (
          <div className="flex-shrink-0 border-t border-neutral-200 dark:border-neutral-700 px-1 pt-4 pb-2 bg-white dark:bg-neutral-900">
            <div className="flex justify-end">
              <ContinueButton />
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default SellItemModal;
