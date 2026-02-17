'use client';

import React, { useState } from 'react';
import { Form, Input, Select, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import TextArea from 'antd/es/input/TextArea';
import { SellingModel } from '@grc/_shared/namespace/sell-item';
import { ImageUploadSection } from '../image-upload-section';

interface Props {
  form: FormInstance;
  initialData: Record<string, any>;
  onContinue: (values: Record<string, any>) => void;
  onBack: () => void;
  sellingModel: SellingModel;
}

const SellItemBasicInfo: React.FC<Props> = ({
  form,
  initialData,
  onContinue,
  onBack,
  sellingModel,
}) => {
  const [images, setImages] = useState<string[]>(initialData.images || []);

  const onFinish = (values: any) => {
    if (images.length === 0) {
      message.error('Please upload at least one image or video');
      return;
    }
    onContinue({ ...values, images });
  };

  const conditionOptions = [
    { label: 'Brand New', value: 'Brand New' },
    { label: 'Uk Used (Foreign Used)', value: 'Uk Used' },
    { label: 'Fairly Used (Nigeria Used)', value: 'Fairly Used' },
  ];

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
        {/* Images & Videos */}
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2 block">
            Product Media <span className="text-red-400">*</span>
          </label>
          <ImageUploadSection images={images} onImagesChange={setImages} maxImages={7} />
          <p className="text-xs text-gray-400 mt-1.5">
            Upload photos or videos of your product. Max 7 files — images up to 5MB, videos (MP4
            only) up to 15MB.
          </p>
        </div>

        {/* Name & Condition */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="itemName"
            rules={[{ required: true, message: 'Enter product name' }]}
            label={<span className="font-semibold text-sm">Product Name</span>}
            className="mb-0"
          >
            <Input placeholder="e.g. iPhone 15 Pro Max 256GB" className="h-12 rounded-xl" />
          </Form.Item>

          <Form.Item
            name="condition"
            rules={[{ required: true, message: 'Select condition' }]}
            label={<span className="font-semibold text-sm">Condition</span>}
            className="mb-0"
          >
            <Select
              options={conditionOptions}
              className="h-12 [&_.ant-select-selector]:!rounded-xl"
              placeholder="Select condition"
            />
          </Form.Item>
        </div>

        {/* Description */}
        <Form.Item
          name="description"
          label={<span className="font-semibold text-sm">Description</span>}
          rules={[{ required: true, message: 'Describe your product' }]}
          className="mb-0"
        >
          <TextArea
            rows={4}
            placeholder={
              sellingModel === 'direct-sale'
                ? 'Describe your item in detail — condition, included accessories, any defects...'
                : "Describe your item in detail — features, condition, what's included..."
            }
            className="resize-none !rounded-xl"
          />
        </Form.Item>
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

export default SellItemBasicInfo;
