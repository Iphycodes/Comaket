'use client';

import React, { useState } from 'react';
import { Form, Input, InputNumber, Select, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import TextArea from 'antd/es/input/TextArea';
import { Plus, X, Tag } from 'lucide-react';
import { SellingModel } from '@grc/_shared/namespace/sell-item';
import { ImageUploadSection } from '../image-upload-section';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Comaket';

interface CreatorIndustryOption {
  id: string;
  label: string;
}

interface Props {
  form: FormInstance;
  initialData: Record<string, any>;
  onContinue: (values: Record<string, any>) => void;
  onBack: () => void;
  sellingModel: SellingModel;
  /** Creator's industries — used as category options */
  creatorIndustries?: CreatorIndustryOption[];
}

const SellItemBasicInfo: React.FC<Props> = ({
  form,
  initialData,
  onContinue,
  onBack,
  sellingModel,
  creatorIndustries = [],
}) => {
  const [images, setImages] = useState<string[]>(initialData.images || []);
  const [tags, setTags] = useState<string[]>(initialData.tags || []);
  const [tagInput, setTagInput] = useState('');

  const MAX_TAGS = 10;

  const onFinish = (values: any) => {
    if (images.length === 0) {
      message.error('Please upload at least one image or video');
      return;
    }
    onContinue({ ...values, images, tags });
  };

  const conditionOptions = [
    { label: 'Brand New', value: 'Brand New' },
    { label: 'Refurbished', value: 'Refurbished' },
    { label: 'Fairly Used (Nigeria Used)', value: 'Fairly Used' },
  ];

  // Build category options from creator's industries
  const categoryOptions = creatorIndustries.map((ind) => ({
    label: ind.label,
    value: ind.id,
  }));

  // ── Tag handlers ────────────────────────────────────────────────────

  const sanitizeTag = (raw: string): string =>
    raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const addTag = () => {
    const tag = sanitizeTag(tagInput);
    if (!tag) return;
    if (tags.includes(tag)) {
      message.info('Tag already added');
      setTagInput('');
      return;
    }
    if (tags.length >= MAX_TAGS) {
      message.warning(`Maximum ${MAX_TAGS} tags`);
      return;
    }
    setTags([...tags, tag]);
    setTagInput('');
  };

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

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
          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-2 block">
            Product Media <span className="text-red-400">*</span>
          </label>
          <ImageUploadSection images={images} onImagesChange={setImages} maxImages={7} />
          <p className="text-xs text-neutral-400 mt-1.5">
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

        {/* Quantity */}
        <Form.Item
          name="quantity"
          rules={[{ required: true, message: 'Enter quantity' }]}
          label={<span className="font-semibold text-sm">Available Quantity</span>}
          className="mb-0"
          initialValue={initialData.quantity || 1}
        >
          <InputNumber
            min={1}
            max={10000}
            className="!w-full h-12 !rounded-xl"
            placeholder="How many do you have?"
            controls
          />
        </Form.Item>

        {/* Category */}
        <Form.Item
          name="category"
          rules={[{ required: true, message: 'Select a category' }]}
          label={<span className="font-semibold text-sm">Category</span>}
          className="mb-0"
        >
          <Select
            options={categoryOptions}
            className="h-12 [&_.ant-select-selector]:!rounded-xl"
            placeholder={categoryOptions.length > 0 ? 'Select category' : 'No categories available'}
            showSearch
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
            notFoundContent={
              categoryOptions.length === 0
                ? 'Your creator profile has no industries set up'
                : 'No matching category'
            }
          />
        </Form.Item>

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

        {/* Tags — optional */}
        <div>
          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Tags <span className="text-neutral-400 font-normal text-xs">(optional)</span>
          </label>
          <p className="text-[11px] text-neutral-400 mb-2">
            Add keywords to help buyers find your product on {APP_NAME}
          </p>

          {/* Selected tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue text-blue dark:text-blue-300 rounded-full text-xs font-medium"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={11} />
                  </button>
                </span>
              ))}
            </div>
          )}

          {/* Tag input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Tag
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
              />
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={handleTagKeyDown}
                placeholder="Type a tag and press Enter"
                className="w-full h-10 pl-9 pr-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
              />
            </div>
            <button
              type="button"
              onClick={addTag}
              disabled={!tagInput.trim() || tags.length >= MAX_TAGS}
              className="flex items-center gap-1 px-3 h-10 rounded-xl text-xs font-semibold bg-blue text-white hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Plus size={14} />
              Add
            </button>
          </div>
          {tags.length > 0 && (
            <p className="text-[10px] text-neutral-400 mt-1">
              {tags.length} of {MAX_TAGS} tags
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors font-medium"
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
