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

type Step = 'sell-type' | 'basic-info' | 'pricing' | 'review';

interface Props {
  isSellItemModalOpen: boolean;
  setIsSellItemModalOpen: Dispatch<SetStateAction<boolean>>;
  handleTrackStatus: (id: string | number) => void;
}

const steps: { key: Step; label: string }[] = [
  { key: 'sell-type', label: 'Sell Type' },
  { key: 'basic-info', label: 'Product Info' },
  { key: 'pricing', label: 'Pricing' },
  { key: 'review', label: 'Review' },
];

const SellItemModal: React.FC<Props> = ({
  isSellItemModalOpen,
  setIsSellItemModalOpen,
  handleTrackStatus,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [currentStep, setCurrentStep] = useState<Step>('sell-type');
  const [sellingModel, setSellingModel] = useState<SellingModel | undefined>();
  const [basicInfoData, setBasicInfoData] = useState<Record<string, any>>({});
  const [pricingData, setPricingData] = useState<Record<string, any>>({});
  const [isPostRequestSuccessful, setIsPostRequestSuccessful] = useState(false);
  const [basicInfoForm] = useForm();
  const [pricingForm] = useForm();

  const currentStepIndex = steps.findIndex((s) => s.key === currentStep);
  const showFixedCta = currentStep === 'sell-type' && !isPostRequestSuccessful;

  // ── Handlers ────────────────────────────────────────────────────────────

  const handleSelectSellType = (model: SellingModel) => {
    setSellingModel(model);
  };

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

  const handleCompleted = () => {
    const payload = {
      sellingModel,
      ...basicInfoData,
      ...pricingData,
    };
    console.log('Submitting sell item:', payload);
    setIsPostRequestSuccessful(true);
  };

  const handleGoBack = () => {
    const prevStep = steps[currentStepIndex - 1];
    if (prevStep) setCurrentStep(prevStep.key);
  };

  const handleCancel = () => {
    setIsSellItemModalOpen(false);
    setTimeout(() => {
      setCurrentStep('sell-type');
      setSellingModel(undefined);
      setIsPostRequestSuccessful(false);
      basicInfoForm.resetFields();
      pricingForm.resetFields();
      setBasicInfoData({});
      setPricingData({});
    }, 300);
  };

  // ── Step progress indicator ─────────────────────────────────────────────

  const StepIndicator = () => (
    <div className="flex items-center gap-1 w-full">
      {steps.map((step, i) => {
        const isActive = i === currentStepIndex;
        const isComplete = i < currentStepIndex;
        return (
          <div key={step.key} className="flex-1 flex flex-col gap-1.5">
            <div className="relative h-1 rounded-full bg-gray-200 dark:bg-gray-700 overflow-hidden">
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
                  ? 'text-blue dark:text-blue'
                  : isComplete
                    ? 'text-gray-700 dark:text-gray-300'
                    : 'text-gray-400 dark:text-gray-500'
              }`}
            >
              {step.label}
            </span>
          </div>
        );
      })}
    </div>
  );

  // ── Continue CTA button ─────────────────────────────────────────────────

  const ContinueButton: React.FC<{ fullWidth?: boolean }> = ({ fullWidth = false }) => (
    <button
      onClick={handleSellTypeContinue}
      disabled={!sellingModel}
      className={`
        ${
          fullWidth ? 'w-full' : 'px-8'
        } py-3.5 rounded-xl text-sm font-semibold transition-all duration-200
        ${
          sellingModel
            ? 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
            : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
        }
      `}
    >
      Continue
    </button>
  );

  // ── Step content (CTA buttons rendered separately, not here) ────────────

  const renderStepContent = () => {
    if (isPostRequestSuccessful) {
      return (
        <PostRequestSuccessful
          itemName={basicInfoData.itemName}
          itemId="0"
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
            <div className="space-y-2">
              <SellTypeSelector onSelect={handleSelectSellType} selected={sellingModel} />
              {isMobile && (
                <div className="flex items-center justify-end">
                  <ContinueButton />
                </div>
              )}
            </div>
          )}

          {currentStep === 'basic-info' && (
            <SellItemBasicInfo
              form={basicInfoForm}
              initialData={basicInfoData}
              onContinue={handleBasicInfoContinue}
              onBack={handleGoBack}
              sellingModel={sellingModel!}
            />
          )}

          {currentStep === 'pricing' && (
            <SellItemPricing
              form={pricingForm}
              initialData={pricingData}
              onContinue={handlePricingContinue}
              onBack={handleGoBack}
              sellingModel={sellingModel!}
            />
          )}

          {currentStep === 'review' && (
            <SellItemReview
              basicInfoData={basicInfoData}
              pricingData={pricingData}
              sellingModel={sellingModel!}
              onSubmit={handleCompleted}
              onBack={handleGoBack}
            />
          )}
        </motion.div>
      </AnimatePresence>
    );
  };

  // ════════════════════════════════════════════════════════════════════════
  // MOBILE — absolute positioning for header, content, and CTA
  //
  // Layout:
  //   ┌──────────────────────────┐ ← fixed inset-0 (viewport)
  //   │  Header (absolute top)   │
  //   │──────────────────────────│
  //   │                          │
  //   │  Scrollable content      │ ← absolute, top/bottom inset
  //   │  (overflow-y-auto)       │
  //   │                          │
  //   │──────────────────────────│
  //   │  CTA Button (abs bottom) │
  //   └──────────────────────────┘
  //
  // This avoids all flexbox min-height issues entirely.
  // ════════════════════════════════════════════════════════════════════════

  if (isMobile) {
    if (!isSellItemModalOpen) return null;

    // Heights for absolute positioning
    const HEADER_HEIGHT = isPostRequestSuccessful ? 56 : 88;
    const CTA_HEIGHT = showFixedCta ? 72 : 0;

    return (
      <div className="fixed inset-0 z-50 bg-white dark:bg-gray-900">
        {/* ── Header — pinned to top ─────────────────────────────────── */}
        <div
          className="absolute top-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
          style={{ height: HEADER_HEIGHT }}
        >
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              {currentStepIndex > 0 && !isPostRequestSuccessful && (
                <button
                  onClick={handleGoBack}
                  className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  <ArrowLeft size={18} />
                </button>
              )}
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sell Item</h2>
            </div>
            <button
              onClick={handleCancel}
              className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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

        {/* ── Scrollable content — between header and CTA ────────────── */}
        <div
          className="absolute left-0 right-0 overflow-y-auto px-4 py-4"
          style={{ top: HEADER_HEIGHT, bottom: CTA_HEIGHT }}
        >
          {renderStepContent()}
        </div>

        {/* ── CTA — pinned to bottom ────────────────────────────────── */}
        {showFixedCta && (
          <div
            className="absolute bottom-0 left-0 right-0 z-10 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 px-4 py-4"
            style={{ height: CTA_HEIGHT }}
          >
            <ContinueButton fullWidth />
          </div>
        )}
      </div>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // DESKTOP — Ant Design Modal with sticky bottom CTA
  // ════════════════════════════════════════════════════════════════════════

  return (
    <Modal
      width={800}
      className="sell-item-modal !top-20"
      open={isSellItemModalOpen}
      onCancel={handleCancel}
      maskClosable={false}
      footer={null}
      title={
        <div className="space-y-4 pb-2">
          <div className="flex items-center gap-3">
            {currentStepIndex > 0 && !isPostRequestSuccessful && (
              <button
                onClick={handleGoBack}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
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
        {/* Scrollable step content */}
        <div className="flex-1 min-h-0 overflow-y-auto px-1 py-2">{renderStepContent()}</div>

        {/* Sticky CTA at modal bottom */}
        {showFixedCta && (
          <div className="flex-shrink-0 border-t border-gray-200 dark:border-gray-700 px-1 pt-4 pb-2 bg-white dark:bg-gray-900">
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
