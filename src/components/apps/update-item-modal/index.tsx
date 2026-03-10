import React, { useState, useEffect, useCallback } from 'react';
import { Modal, Form, Input, Select, InputNumber, Alert, message } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { isEqual } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X, Loader2 } from 'lucide-react';
import { PostRequestSuccessful } from '../post-request-successful';
import { ImageUploadSection } from '../sell-item-modal/libs/image-upload-section';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useListings } from '@grc/hooks/useListings';
import { useMedia } from '@grc/hooks/useMedia';
import { fetchData } from '@grc/_shared/helpers';
import {
  LISTING_FEE_PERCENT,
  CONSIGNMENT_COMMISSION_PERCENT,
  calculateListingFee,
  calculateConsignmentCut,
  SellItemStatus,
} from '@grc/_shared/namespace/sell-item';

const { TextArea } = Input;
const NIGERIA_ISO2 = 'NG';

interface LocationOption {
  name: string;
  iso2?: string;
}
const isLocalMedia = (url: string): boolean => url.startsWith('data:') || url.startsWith('blob:');
const isVideo = (url: string): boolean => url.startsWith('data:video/') || url.endsWith('.mp4');
const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
};
const PRE_LIVE_STATUSES: SellItemStatus[] = [
  'in-review',
  'approved',
  'awaiting-fee',
  'awaiting-product',
  'price-offered',
  'counter-offer',
];
const conditionOptions = [
  { label: 'Brand New', value: 'brand_new' },
  { label: 'Uk Used (Foreign Used)', value: 'used' },
  { label: 'Fairly Used (Nigeria Used)', value: 'fairly_used' },
];

interface UpdateItemModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  initialData: Record<string, any>;
  handleTrackStatus: (id: string | number) => void;
}

interface FormContentProps {
  form: ReturnType<typeof Form.useForm>[0];
  initialData: Record<string, any>;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  initialImages: string[];
  askPrice: number;
  hasChanges: boolean;
  isSubmitting: boolean;
  isUpdateItemSuccessful: boolean;
  onClose: () => void;
  handleTrackStatus: (id: string | number) => void;
  handleAskPriceChange: (value: any) => void;
  handleSubmit: () => void;
  checkFormChanges: (values: Record<string, any>) => void;
  stateOptions: { label: string; value: string }[];
  cityOptions: { label: string; value: string }[];
  loadingStates: boolean;
  loadingCities: boolean;
  selectedStateIso2: string;
  handleStateChange: (stateName: string) => void;
}

const FormContent: React.FC<FormContentProps> = ({
  form,
  initialData,
  images,
  setImages,
  initialImages,
  askPrice,
  hasChanges,
  isSubmitting,
  isUpdateItemSuccessful,
  onClose,
  handleTrackStatus,
  handleAskPriceChange,
  handleSubmit,
  checkFormChanges,
  stateOptions,
  cityOptions,
  loadingStates,
  loadingCities,
  selectedStateIso2,
  handleStateChange,
}) => {
  if (isUpdateItemSuccessful) {
    return (
      <PostRequestSuccessful
        itemId={initialData?.productId ?? ''}
        onClose={onClose}
        onTrackStatus={handleTrackStatus}
        type="update"
      />
    );
  }
  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={handleSubmit}
      className="space-y-6"
      initialValues={initialData}
      onValuesChange={(_, allValues: any) => checkFormChanges(allValues)}
    >
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="font-semibold text-sm">
            Product Media <span className="text-red-400">*</span>
          </label>
          {images.length > 0 && !isEqual(images, initialImages) && (
            <button
              type="button"
              onClick={() => setImages(initialImages)}
              className="text-xs text-blue hover:text-blue font-medium"
            >
              Reset to original
            </button>
          )}
        </div>
        <ImageUploadSection images={images} onImagesChange={setImages} maxImages={7} />
        <p className="text-xs text-neutral-400 mt-2">{images.length}/7 files</p>
        {images.length === 0 && (
          <div className="mt-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <InfoCircleOutlined /> At least one product image or video is required
            </p>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Form.Item
          name="itemName"
          rules={[{ required: true, message: 'Please enter item name' }]}
          label={<span className="font-semibold">Item Name</span>}
        >
          <Input placeholder="Item Name" className="h-12" />
        </Form.Item>
        <Form.Item
          name="condition"
          rules={[{ required: true, message: 'Please select condition' }]}
          label={<span className="font-semibold">Condition</span>}
        >
          <Select options={conditionOptions} className="h-12" placeholder="Select condition" />
        </Form.Item>
      </div>
      <Form.Item
        name="description"
        label={<span className="font-semibold">Description</span>}
        rules={[{ required: true, message: 'Please enter description' }]}
      >
        <TextArea rows={5} placeholder="Describe your item in detail..." className="resize-none" />
      </Form.Item>

      {/* State & City */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Form.Item
          name="state"
          rules={[{ required: true, message: 'Select state' }]}
          label={<span className="font-semibold">State</span>}
        >
          <Select
            showSearch
            className="h-12"
            placeholder="Select state"
            loading={loadingStates}
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
            onChange={handleStateChange}
            options={stateOptions}
          />
        </Form.Item>
        <Form.Item
          name="city"
          rules={[{ required: true, message: 'Select city' }]}
          label={<span className="font-semibold">City</span>}
        >
          <Select
            showSearch
            className="h-12"
            placeholder={selectedStateIso2 ? 'Select city' : 'Select state first'}
            loading={loadingCities}
            disabled={!selectedStateIso2}
            filterOption={(input, option) =>
              (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
            }
            options={cityOptions}
            notFoundContent={
              loadingCities
                ? 'Loading...'
                : selectedStateIso2
                  ? 'No cities found'
                  : 'Select a state first'
            }
          />
        </Form.Item>
      </div>

      <Form.Item
        name="askPrice"
        label="Ask Price"
        rules={[{ required: true, message: 'Please enter ask price' }]}
      >
        <InputNumber
          className="w-full h-14"
          size="large"
          formatter={(value) => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => value?.replace(/₦\s?|(,*)/g, '')}
          onChange={handleAskPriceChange}
        />
      </Form.Item>

      {/* Fee Breakdown (self-listing) */}
      {initialData?.sellingModel === 'self-listing' &&
        askPrice > 0 &&
        (() => {
          const status: SellItemStatus = initialData?.status;
          const isPreLive = PRE_LIVE_STATUSES.includes(status);
          const wasLive = status === 'live' || status === 'sold';
          const newPriceKobo = Math.round((askPrice || 0) * 100);
          const originalPriceKobo = Math.round((initialData?.askPrice || 0) * 100);
          const priceIncreaseKobo = newPriceKobo - originalPriceKobo;
          if (isPreLive) {
            const fee = calculateListingFee(newPriceKobo);
            return (
              <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">New Ask Price</span>
                  <span className="font-medium">₦{askPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Listing Fee ({LISTING_FEE_PERCENT}%)</span>
                  <span className="font-semibold text-blue">₦{(fee / 100).toLocaleString()}</span>
                </div>
                <p className="text-xs text-neutral-400 pt-1 border-t border-blue-100 dark:border-blue-900">
                  This fee will be required after your listing is approved.
                </p>
              </div>
            );
          }
          if (wasLive && priceIncreaseKobo > 0) {
            const incrementFee = calculateListingFee(priceIncreaseKobo);
            return (
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Previous Price</span>
                  <span className="font-medium">₦{initialData?.askPrice?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">New Price</span>
                  <span className="font-medium">₦{askPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-500">Price Increase</span>
                  <span className="font-semibold text-amber-600">
                    +₦{(priceIncreaseKobo / 100).toLocaleString()}
                  </span>
                </div>
                <div className="flex justify-between text-sm pt-2 border-t border-amber-200 dark:border-amber-800">
                  <span className="text-neutral-600 font-medium">
                    Additional Fee ({LISTING_FEE_PERCENT}% of increase)
                  </span>
                  <span className="font-bold text-amber-600">
                    ₦{(incrementFee / 100).toLocaleString()}
                  </span>
                </div>
                <Alert
                  className="!mt-2"
                  message="Your product will go back under review. The additional fee for the price increase will be required after re-approval."
                  type="info"
                  showIcon
                  icon={<InfoCircleOutlined />}
                />
              </div>
            );
          }
          if (wasLive && priceIncreaseKobo <= 0) {
            return (
              <div className="bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-neutral-500">New Ask Price</span>
                  <span className="font-medium">₦{askPrice.toLocaleString()}</span>
                </div>
                <p className="text-xs text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                  <InfoCircleOutlined /> No additional fee required
                  {priceIncreaseKobo < 0 ? ' — price was reduced' : ''}. Your product will go back
                  under review.
                </p>
              </div>
            );
          }
          return null;
        })()}

      {/* Commission (consignment) */}
      {initialData?.sellingModel === 'consignment' &&
        askPrice > 0 &&
        (() => {
          const { platformCut, sellerCut } = calculateConsignmentCut(
            Math.round((askPrice || 0) * 100)
          );
          return (
            <div className="bg-violet-50 dark:bg-violet-950/30 border border-violet-200 dark:border-violet-800 rounded-xl p-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">New Selling Price</span>
                <span className="font-medium">₦{askPrice.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">
                  Commission ({CONSIGNMENT_COMMISSION_PERCENT}%)
                </span>
                <span className="font-medium text-violet-600">
                  ₦{(platformCut / 100).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between text-sm pt-2 border-t border-violet-200 dark:border-violet-800">
                <span className="text-neutral-600 font-medium">You receive when sold</span>
                <span className="font-bold text-emerald-600">
                  ₦{(sellerCut / 100).toLocaleString()}
                </span>
              </div>
            </div>
          );
        })()}

      <Form.Item
        name="negotiable"
        className="mb-0 w-full"
        rules={[{ required: true, message: 'Select an option' }]}
        label={<div className="mb-0 text-muted-foreground">Negotiable</div>}
      >
        <Select
          options={[
            { label: 'Yes (Negotiable)', value: true },
            { label: 'No (Not Negotiable)', value: false },
          ]}
          className="h-14"
          placeholder="Negotiable"
        />
      </Form.Item>
      <div className="mt-2 flex justify-between items-center pb-6">
        <button
          type="button"
          onClick={onClose}
          disabled={isSubmitting}
          className="px-6 py-2 text-neutral-600 hover:bg-neutral-100 rounded-md transition-colors disabled:opacity-50"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!hasChanges || images.length === 0 || isSubmitting}
          className={`px-10 text-lg font-semibold py-2 !h-14 flex items-center gap-2 ${
            hasChanges && images.length > 0 && !isSubmitting
              ? 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600'
              : 'bg-neutral-300 cursor-not-allowed'
          } text-white rounded-md transition-colors`}
        >
          {isSubmitting ? (
            <>
              <Loader2 size={18} className="animate-spin" /> Updating...
            </>
          ) : (
            'Update'
          )}
        </button>
      </div>
    </Form>
  );
};

const UpdateItemModal = ({
  isModalOpen,
  onClose,
  initialData,
  handleTrackStatus,
}: UpdateItemModalProps) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [form] = Form.useForm();
  const [askPrice, setAskPrice] = useState(initialData?.askPrice || 0);
  const [hasChanges, setHasChanges] = useState(false);
  const [isUpdateItemSuccessful, setIsUpdateItemSuccessful] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [initialImages, setInitialImages] = useState<string[]>(initialData?.images || []);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedStateIso2, setSelectedStateIso2] = useState('');
  const { updateListing } = useListings();
  const { uploadImage, uploadImages } = useMedia();

  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${NIGERIA_ISO2}/states`
        );
        setStates((data || []).map((s: any) => ({ name: s.name, iso2: s.iso2 })));
      } catch (e) {
        console.error('Error fetching states:', e);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    if (initialData?.state && states.length > 0) {
      const match = states.find((s) => s.name.toLowerCase() === initialData.state.toLowerCase());
      if (match?.iso2) setSelectedStateIso2(match.iso2);
    }
  }, [initialData?.state, states]);

  useEffect(() => {
    if (!selectedStateIso2) {
      setCities([]);
      return;
    }
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${NIGERIA_ISO2}/states/${selectedStateIso2}/cities`
        );
        setCities((data || []).map((c: any) => ({ name: c.name })));
      } catch (e) {
        console.error('Error fetching cities:', e);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedStateIso2]);

  const handleStateChange = useCallback(
    (stateName: string) => {
      const match = states.find((s) => s.name === stateName);
      setSelectedStateIso2(match?.iso2 || '');
      form.setFieldValue('city', undefined);
      checkFormChanges({ ...form.getFieldsValue(), state: stateName, city: undefined });
    },
    [states, form]
  );

  const stateOptions = states.map((s) => ({ label: s.name, value: s.name }));
  const cityOptions = cities.map((c) => ({ label: c.name, value: c.name }));

  const checkFormChanges = (currentValues: Record<string, any>) => {
    const hasFormChanges = Object.keys(currentValues).some((key) => {
      if (typeof currentValues[key] === 'number' && typeof initialData[key] === 'number')
        return Math.abs(currentValues[key] - initialData[key]) > 0.000001;
      return !isEqual(currentValues[key], initialData[key]);
    });
    setHasChanges(hasFormChanges || !isEqual(images, initialImages));
  };

  useEffect(() => {
    if (isModalOpen) checkFormChanges(form.getFieldsValue());
  }, [images]);
  useEffect(() => {
    if (isModalOpen && initialData) {
      form.setFieldsValue(initialData);
      setAskPrice(initialData.askPrice);
      setImages(initialData.images || []);
      setInitialImages(initialData.images || []);
      setHasChanges(false);
    }
  }, [isModalOpen, initialData, form]);

  const handleAskPriceChange = (value: any) => {
    setAskPrice(value);
    checkFormChanges({ ...form.getFieldsValue(), askPrice: value });
  };
  const handleClose = () => {
    form.resetFields();
    setAskPrice(0);
    setHasChanges(false);
    setIsUpdateItemSuccessful(false);
    setIsSubmitting(false);
    setImages(initialData?.images || []);
    onClose();
  };

  const handleSubmit = () => {
    form.validateFields().then(async (values) => {
      if (images.length === 0) {
        Modal.warning({
          title: 'Media Required',
          content: 'Please add at least one product image or video.',
          zIndex: 20000,
        });
        return;
      }
      const listingId = initialData?.productId;
      if (!listingId) {
        message.error('Missing listing ID');
        return;
      }
      setIsSubmitting(true);
      try {
        const existingUrls: string[] = [],
          newImgs: string[] = [],
          newVids: string[] = [];
        images.forEach((img) => {
          if (isLocalMedia(img)) {
            isVideo(img) ? newVids.push(img) : newImgs.push(img);
          } else {
            existingUrls.push(img);
          }
        });
        const uploadedMedia: Array<{ url: string; type: 'image' | 'video' }> = [];
        if (newImgs.length > 0) {
          const files = await Promise.all(
            newImgs.map((d, i) => dataUrlToFile(d, `update-${Date.now()}-img-${i}.jpg`))
          );
          (await uploadImages(files)).forEach((url) => {
            if (url) uploadedMedia.push({ url, type: 'image' });
          });
        }
        for (const d of newVids) {
          const url = await uploadImage(await dataUrlToFile(d, `update-${Date.now()}-vid.mp4`));
          if (url) uploadedMedia.push({ url, type: 'video' });
        }
        const allMedia = [
          ...existingUrls.map((url) => ({
            url,
            type: (isVideo(url) ? 'video' : 'image') as 'image' | 'video',
          })),
          ...uploadedMedia,
        ];
        await updateListing(listingId, {
          itemName: values.itemName,
          description: values.description,
          condition: values.condition,
          location: { country: 'Nigeria', state: values.state, city: values.city },
          askingPrice: {
            amount: Math.round((values.askPrice || 0) * 100),
            currency: 'NGN',
            negotiable: values.negotiable ?? false,
          },
          media: allMedia,
        });
        setIsUpdateItemSuccessful(true);
      } catch (error: any) {
        console.error('Failed to update listing:', error);
        if (!error?.data?.message) message.error('Failed to update listing. Please try again.');
      } finally {
        setIsSubmitting(false);
      }
    });
  };

  const formContentProps: FormContentProps = {
    form,
    initialData,
    images,
    setImages,
    initialImages,
    askPrice,
    hasChanges,
    isSubmitting,
    isUpdateItemSuccessful,
    onClose: handleClose,
    handleTrackStatus,
    handleAskPriceChange,
    handleSubmit,
    checkFormChanges,
    stateOptions,
    cityOptions,
    loadingStates,
    loadingCities,
    selectedStateIso2,
    handleStateChange,
  };

  if (isMobile) {
    return (
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[10000] bg-white dark:bg-neutral-900 flex flex-col overflow-hidden"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white disabled:opacity-50"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Edit Product</span>
              </button>
              <button
                onClick={handleClose}
                disabled={isSubmitting}
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center disabled:opacity-50"
              >
                <X size={16} className="text-neutral-500" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto pb-10">
              <div className="px-4 py-4">
                {!isUpdateItemSuccessful && (
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
                      Edit Product
                    </h2>
                    <p className="text-xs text-neutral-400 mt-0.5">ID: {initialData?.productId}</p>
                  </div>
                )}
                <FormContent {...formContentProps} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <Modal
      open={isModalOpen}
      width={800}
      className="max-w-[800px]"
      onCancel={handleClose}
      footer={null}
      closable={!isSubmitting}
    >
      <div className="max-h-[80vh] !overflow-y-scroll">
        <div className="flex flex-col sticky top-0 !bg-white z-10 pb-5">
          <span className="text-[28px] font-semibold">Edit Product</span>
        </div>
        <FormContent {...formContentProps} />
      </div>
    </Modal>
  );
};

export default UpdateItemModal;
