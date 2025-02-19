'use client';

import { Modal } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';

import { useForm } from 'antd/lib/form/Form';
import SellItemStep1 from './libs/step-1-basic-info';
// import  SellItemStep2  from './libs/step-2-location-and-pricing';
import { SellItemStep3 } from './libs/step-3-summary';
import SellItemStep2 from './libs/step-2-location-and-pricing';
import { PostRequestSuccessful } from '../post-request-successful';

interface Props {
  // Add your prop types here
  isSellItemModalOpen: boolean;
  setIsSellItemModalOpen: Dispatch<SetStateAction<boolean>>;
  handleTrackStatus: (id: string | number) => void;
}

const SellItemModal: React.FC<Props> = (props) => {
  const { isSellItemModalOpen, setIsSellItemModalOpen, handleTrackStatus } = props;
  const [currentStep, setCurrentStep] = useState<'step1' | 'step2' | 'step3'>('step1');
  const [basicInfoData, setBasicInfoData] = useState<Record<string, any>>({});
  const [locationAndPricingData, setLocationAndPricingData] = useState<Record<string, any>>({});
  const [isPostRequestSuccessful, setIsPostRequestSuccessful] = useState<boolean>(false);
  const [fee, setFee] = useState<number>(0);
  const [sellItemStep1Form] = useForm();
  const [sellItemStep2Form] = useForm();

  const handleCompleted = () => {
    console.log('finish');
    const payload = {
      ...basicInfoData,
      ...locationAndPricingData,
    };
    console.log('sell this item', payload);
    setIsPostRequestSuccessful(true);
  };

  const handleCancel = () => {
    setIsSellItemModalOpen(false);
    setCurrentStep('step1');
    setIsPostRequestSuccessful(false);
    sellItemStep1Form.resetFields();
    sellItemStep2Form.resetFields();
    setBasicInfoData({});
    setLocationAndPricingData({});
  };

  const handleSetBasicInfoData = (values: Record<string, any>) => {
    setBasicInfoData(values);
  };

  const handleSetLocationAndPricingData = (values: Record<string, any>) => {
    setLocationAndPricingData(values);
  };

  const handleSetCurrentStep = (step: 'step1' | 'step2' | 'step3') => {
    setCurrentStep(step);
  };

  // const handleGoBack = () => {
  //   if (currentStep === 'step2') {
  //     const newLocationAndPricingData = sellItemStep2Form.getFieldsValue;
  //     handleSetLocationAndPricingData({ ...newLocationAndPricingData, fee: fee });
  //   }
  //   handleSetCurrentStep(
  //     `${currentStep === 'step2' ? 'step1' : currentStep === 'step3' ? 'step2' : 'step1'}`
  //   );
  // };

  return (
    <Modal
      width={900}
      className="sell-item-modal"
      title={
        <div className="space-y-2 pb-10">
          <h2 className="text-3xl font-semibold">Sell Item</h2>
          {!isPostRequestSuccessful && (
            <div className="flex items-center gap-2">
              <div className="flex gap-2">
                {['step1', 'step2', 'step3'].map((step) => (
                  <div
                    key={step}
                    className={`w-2.5 h-2.5 rounded-full ${
                      currentStep === step ? 'bg-black' : 'bg-gray-300'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600">
                {currentStep === 'step1' && 'Basic Information'}
                {currentStep === 'step2' && 'Location and Pricing'}
                {currentStep === 'step3' && 'Review and Submit'}
              </span>
            </div>
          )}
        </div>
      }
      open={isSellItemModalOpen}
      onCancel={handleCancel}
      maskClosable={false}
      footer={null}
    >
      <div className="w-full">
        {isPostRequestSuccessful ? (
          <PostRequestSuccessful
            itemName={basicInfoData.itemName}
            itemId="0"
            onClose={handleCancel}
            onTrackStatus={handleTrackStatus}
            type="new"
          />
        ) : (
          <>
            {currentStep === 'step1' && (
              <SellItemStep1
                handleSetBasicInfoData={handleSetBasicInfoData}
                handleSetCurrentStep={handleSetCurrentStep}
                basicInfoData={basicInfoData}
                sellItemStep1Form={sellItemStep1Form}
              />
            )}
            {currentStep === 'step2' && (
              <SellItemStep2
                handleSetLocationAndPricingData={handleSetLocationAndPricingData}
                handleSetCurrentStep={handleSetCurrentStep}
                locationAndPricingData={locationAndPricingData}
                sellItemStep2Form={sellItemStep2Form}
                fee={fee}
                setFee={setFee}
              />
            )}
            {currentStep === 'step3' && (
              <SellItemStep3
                basicInfoData={basicInfoData}
                locationAndPricingData={locationAndPricingData}
                handleCompleted={handleCompleted}
                handleSetCurrentStep={handleSetCurrentStep}
              />
            )}
          </>
        )}
      </div>
    </Modal>
  );
};

export default SellItemModal;
