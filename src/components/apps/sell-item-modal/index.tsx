'use client';

import { Button, Modal, Space } from 'antd';
import React, { Dispatch, SetStateAction, useState } from 'react';
import SellItemStep1 from './libs/step-1-basic-info';
import SellItemStep2 from './libs/step-2-location-and-pricing';
import SellItemStep3 from './libs/step-3-summary';
import { useForm } from 'antd/lib/form/Form';
import PostRequestSuccessful from './libs/post-request-sucessful';

interface Props {
  // Add your prop types here
  isSellItemModalOpen: boolean;
  setIsSellItemModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedKey: Dispatch<SetStateAction<string>>;
}

const SellItemModal: React.FC<Props> = (props) => {
  const { isSellItemModalOpen, setIsSellItemModalOpen, setSelectedKey } = props;
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
    setSelectedKey('');
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

  const handleGoBack = () => {
    if (currentStep === 'step2') {
      const newLocationAndPricingData = sellItemStep2Form.getFieldsValue;
      handleSetLocationAndPricingData({ ...newLocationAndPricingData, fee: fee });
    }
    handleSetCurrentStep(
      `${currentStep === 'step2' ? 'step1' : currentStep === 'step3' ? 'step2' : 'step1'}`
    );
  };

  return (
    <Modal
      width={'600px'}
      className=""
      title={
        <div>
          <div className="mb-1 text-[22px]">SELL ITEM</div>
          <div className="flex flex-col">
            <Space size={5}>
              <i
                className={`ri-circle-${currentStep === 'step1' ? 'fill' : 'line'} text-[12px]`}
              ></i>
              <i
                className={`ri-circle-${currentStep === 'step2' ? 'fill' : 'line'} text-[12px]`}
              ></i>
              <i
                className={`ri-circle-${currentStep === 'step3' ? 'fill' : 'line'} text-[12px]`}
              ></i>
            </Space>
            <span>
              {currentStep === 'step1' && 'Basic Information'}
              {currentStep === 'step2' && 'Location and Pricing'}
              {currentStep === 'step3' && 'Summary'}
            </span>
          </div>
          <div
            className={`w-full font-normal ${
              (isPostRequestSuccessful === true || currentStep === 'step1') && 'invisible'
            }`}
          >
            <span
              onClick={handleGoBack}
              className="py-1 sticky top-0 inline-flex gap-1 cursor-pointer text-blue items-center"
            >
              <i className="ri-arrow-left-line text-[20px]"></i>
              <span>Go Back</span>
            </span>
          </div>
        </div>
      }
      open={isSellItemModalOpen}
      onCancel={handleCancel}
      maskClosable={false}
      style={{}}
      footer={null}
    >
      <div className="w-full">
        {isPostRequestSuccessful ? (
          <PostRequestSuccessful />
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
