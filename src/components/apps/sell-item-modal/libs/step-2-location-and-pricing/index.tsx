'use client';

import React, { useEffect, useState } from 'react';
import { Form, InputNumber, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Info, Wallet, Percent, HandCoins } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SellingModel,
  LISTING_FEE_PERCENT,
  CONSIGNMENT_COMMISSION_PERCENT,
  calculateListingFee,
  calculateConsignmentCut,
} from '@grc/_shared/namespace/sell-item';

interface Props {
  form: FormInstance;
  initialData: Record<string, any>;
  onContinue: (values: Record<string, any>) => void;
  onBack: () => void;
  sellingModel: SellingModel;
}

const mockLocations = [
  { label: 'Abuja', value: 'Abuja' },
  { label: 'Kaduna', value: 'Kaduna' },
  { label: 'Kano', value: 'Kano' },
  { label: 'Lagos', value: 'Lagos' },
  { label: 'Port Harcourt', value: 'Port Harcourt' },
];

const SellItemPricing: React.FC<Props> = ({
  form,
  initialData,
  onContinue,
  onBack,
  sellingModel,
}) => {
  const [askPrice, setAskPrice] = useState<number>(initialData?.askPrice || 0);

  useEffect(() => {
    form.setFieldsValue(initialData);
    if (initialData?.askPrice) setAskPrice(initialData.askPrice);
  }, [initialData]);

  const priceInKobo = (askPrice || 0) * 100;
  const listingFee = calculateListingFee(priceInKobo);
  const { platformCut, sellerCut } = calculateConsignmentCut(priceInKobo);

  const onFinish = (values: Record<string, any>) => {
    const fee =
      sellingModel === 'self-listing'
        ? listingFee / 100
        : sellingModel === 'consignment'
          ? platformCut / 100
          : 0;
    onContinue({ ...values, fee });
  };

  const getPricingHint = () => {
    switch (sellingModel) {
      case 'self-listing':
        return {
          icon: Wallet,
          color: 'blue',
          bg: 'bg-indigo-50 dark:bg-blue-950/30',
          border: 'border-blue dark:border-blue',
          title: 'Listing Fee',
          description: `A ${LISTING_FEE_PERCENT}% listing fee is required to publish your item on the marketplace. This fee is one-time and non-refundable.`,
        };
      case 'consignment':
        return {
          icon: Percent,
          color: 'violet',
          bg: 'bg-violet-50 dark:bg-violet-950/30',
          border: 'border-violet-200 dark:border-violet-800',
          title: 'Commission Split',
          description: `When your item sells, Comaket takes a ${CONSIGNMENT_COMMISSION_PERCENT}% commission. You receive the remaining ${
            100 - CONSIGNMENT_COMMISSION_PERCENT
          }% directly to your account.`,
        };
      case 'direct-sale':
        return {
          icon: HandCoins,
          color: 'emerald',
          bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          border: 'border-emerald-200 dark:border-emerald-800',
          title: 'Your Asking Price',
          description:
            "Enter how much you want for this item. After review, we'll make you an offer. You can accept, counter, or decline.",
        };
    }
  };

  const hint = getPricingHint();
  const HintIcon = hint.icon;

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      className="space-y-5"
      initialValues={initialData}
    >
      <div className="space-y-5">
        {/* Location */}
        <Form.Item
          name="location"
          rules={[{ required: true, message: 'Select location' }]}
          label={<span className="font-semibold text-sm">Location</span>}
          className="mb-0"
        >
          <Select
            showSearch
            className="h-12 [&_.ant-select-selector]:!rounded-xl"
            placeholder="Where is the item located?"
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
            options={mockLocations}
          />
        </Form.Item>

        {/* Pricing hint card */}
        <div className={`${hint.bg} ${hint.border} border rounded-xl p-4 flex gap-3`}>
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-lg bg-${hint.color}-100 dark:bg-${hint.color}-900/50 flex items-center justify-center`}
          >
            <HintIcon size={16} className={`text-${hint.color}-600 dark:text-${hint.color}-400`} />
          </div>
          <div>
            <h4
              className={`text-sm font-semibold text-${hint.color}-700 dark:text-${hint.color}-300`}
            >
              {hint.title}
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 mt-0.5 leading-relaxed">
              {hint.description}
            </p>
          </div>
        </div>

        {/* Ask Price */}
        <div>
          <Form.Item
            name="askPrice"
            className="tall-number-input mb-0 w-full"
            rules={[{ required: true, message: 'Enter your asking price' }]}
            label={
              <span className="font-semibold text-sm">
                {sellingModel === 'direct-sale' ? 'Your Asking Price (₦)' : 'Ask Price (₦)'}
              </span>
            }
          >
            <InputNumber
              className="w-full h-14 !rounded-xl"
              size="large"
              controls={false}
              prefix={<span className="text-gray-400">₦</span>}
              placeholder="Enter amount"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: any) => value?.replace(/,/g, '')}
              onChange={(value) => setAskPrice(Number(value) || 0)}
            />
          </Form.Item>

          {/* Fee/Commission Breakdown */}
          <AnimatePresence>
            {askPrice > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3 space-y-2">
                  {sellingModel === 'self-listing' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Ask Price</span>
                        <span className="font-medium">₦{askPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Listing Fee ({LISTING_FEE_PERCENT}%)</span>
                        <span className="font-semibold text-blue">
                          ₦{(listingFee / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">Fee to pay after review</span>
                        <span className="font-bold text-blue">
                          ₦{(listingFee / 100).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}

                  {sellingModel === 'consignment' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Selling Price</span>
                        <span className="font-medium">₦{askPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">
                          Platform Commission ({CONSIGNMENT_COMMISSION_PERCENT}%)
                        </span>
                        <span className="font-medium text-violet-600">
                          ₦{(platformCut / 100).toLocaleString()}
                        </span>
                      </div>
                      <div className="border-t border-gray-200 dark:border-gray-700 pt-2 flex justify-between text-sm">
                        <span className="text-gray-600 font-medium">You receive when sold</span>
                        <span className="font-bold text-emerald-600">
                          ₦{(sellerCut / 100).toLocaleString()}
                        </span>
                      </div>
                    </>
                  )}

                  {sellingModel === 'direct-sale' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Your asking price</span>
                        <span className="font-medium">₦{askPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1">
                        <Info size={12} />
                        <span>We'll review and make you an offer after approval</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Negotiable - only for self-listing and consignment */}
        {sellingModel !== 'direct-sale' && (
          <Form.Item
            name="negotiable"
            className="mb-0"
            rules={[{ required: true, message: 'Select an option' }]}
            label={<span className="font-semibold text-sm">Open to Negotiation?</span>}
          >
            <Select
              options={[
                { label: 'Yes — Buyers can negotiate the price', value: true },
                { label: 'No — Price is fixed', value: false },
              ]}
              className="h-12 [&_.ant-select-selector]:!rounded-xl"
              placeholder="Select option"
            />
          </Form.Item>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-gray-100 dark:border-gray-700">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white rounded-xl shadow-md shadow-blue/20 hover:shadow-lg transition-all"
        >
          Continue
        </button>
      </div>
    </Form>
  );
};

export default SellItemPricing;
