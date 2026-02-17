import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Alert, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { isEqual } from 'lodash';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, X } from 'lucide-react';
import { PostRequestSuccessful } from '../post-request-successful';
import { ImageUploadSection } from '../sell-item-modal/libs/image-upload-section';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

const { Text } = Typography;
const { TextArea } = Input;

interface UpdateItemModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  initialData: Record<string, any>;
  handleTrackStatus: (id: string | number) => void;
}

// ─── Shared Form Content ────────────────────────────────────────────────────
// Extracted so both mobile full-screen and desktop modal render the same form.

interface FormContentProps {
  form: ReturnType<typeof Form.useForm>[0];
  initialData: Record<string, any>;
  images: string[];
  setImages: React.Dispatch<React.SetStateAction<string[]>>;
  initialImages: string[];
  askPrice: number;
  showPriceInfo: boolean;
  hasChanges: boolean;
  isUpdateItemSuccessful: boolean;
  locationValue: string;
  onClose: () => void;
  handleTrackStatus: (id: string | number) => void;
  handleAskPriceChange: (value: any) => void;
  handleLocationOptionChange: (value: string) => void;
  handleSubmit: () => void;
  checkFormChanges: (values: Record<string, any>) => void;
}

const mockLocations = [
  { label: 'Kaduna', value: 'kaduna' },
  { label: 'Kano', value: 'kano' },
  { label: 'Abuja', value: 'abuja' },
];

const locationOptions = mockLocations.map(({ value, label }) => ({
  label,
  value,
}));

const calculatePlatformFee = (price: any) => {
  return price * 0.01;
};

const FormContent: React.FC<FormContentProps> = ({
  form,
  initialData,
  images,
  setImages,
  initialImages,
  askPrice,
  showPriceInfo,
  hasChanges,
  isUpdateItemSuccessful,
  locationValue,
  onClose,
  handleTrackStatus,
  handleAskPriceChange,
  handleLocationOptionChange,
  handleSubmit,
  checkFormChanges,
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
      {/* ── Product Media ─────────────────────────────────────────────── */}
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

        <p className="text-xs text-gray-400 mt-2">
          {images.length}/7 files · Images up to 5MB, videos (MP4) up to 15MB · First image is the
          cover photo
        </p>

        {images.length === 0 && (
          <div className="mt-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
            <p className="text-xs text-red-600 dark:text-red-400 flex items-center gap-1.5">
              <InfoCircleOutlined />
              At least one product image or video is required
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
          rules={[{ required: true, message: 'Please select item condition' }]}
          label={<span className="font-semibold">Condition</span>}
        >
          <Select
            options={[
              { label: 'Brand New', value: 'Brand New' },
              { label: 'Uk Used (Foreign Used)', value: 'Uk Used' },
              { label: 'Fairly Used (Nigeria Used)', value: 'Fairly Used' },
            ]}
            className="h-12"
            placeholder="Select condition"
          />
        </Form.Item>
      </div>

      <Form.Item
        name="description"
        label={<span className="font-semibold">Description</span>}
        rules={[{ required: true, message: 'Please enter item description' }]}
      >
        <TextArea rows={5} placeholder="Describe your item in detail..." className="resize-none" />
      </Form.Item>

      <Form.Item
        name="location"
        rules={[{ required: true, message: 'Enter Location' }]}
        label={<span className="font-semibold text-muted-foreground mb-0">Location</span>}
      >
        <Select
          showSearch
          className="h-12"
          value={locationValue}
          placeholder={'Location'}
          defaultActiveFirstOption={false}
          filterOption={(input, option) =>
            (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
          }
          onChange={handleLocationOptionChange}
          notFoundContent={null}
          options={locationOptions}
        />
      </Form.Item>

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

      {showPriceInfo && (
        <>
          <Text type="secondary">
            Price Increase: ₦ {(askPrice - initialData?.askPrice).toLocaleString()}
          </Text>
          <br />
          <Text type="secondary">
            Platform Fee (1%): ₦{' '}
            {calculatePlatformFee(askPrice - initialData?.askPrice).toLocaleString()}
          </Text>
          <Alert
            style={{ marginTop: 16 }}
            message="Price Update Notice"
            description="The new price will be updated after the platform fee is processed. All other changes will be applied immediately."
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
          />
        </>
      )}

      <Form.Item
        name="negotiable"
        className="mb-0 w-full"
        rules={[{ required: true, message: 'Select an option' }]}
        label={<div className="mb-0 text-muted-foreground">{`Negotiable`}</div>}
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
          className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!hasChanges || images.length === 0}
          className={`px-10 text-lg font-semibold py-2 !h-14 ${
            hasChanges && images.length > 0
              ? 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600'
              : 'bg-gray-300 cursor-not-allowed'
          } text-white rounded-md transition-colors`}
        >
          Update
        </button>
      </div>
    </Form>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

const UpdateItemModal = ({
  isModalOpen,
  onClose,
  initialData,
  handleTrackStatus,
}: UpdateItemModalProps) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [form] = Form.useForm();
  const [askPrice, setAskPrice] = useState(initialData?.askPrice || 0);
  const [showPriceInfo, setShowPriceInfo] = useState(false);
  const [locationValue, setLocationValue] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isUpdateItemSuccessful, setIsUpdateItemSuccessful] = useState<boolean>(false);

  // ── Image/Video state ───────────────────────────────────────────────
  const [images, setImages] = useState<string[]>(initialData?.images || []);
  const [initialImages, setInitialImages] = useState<string[]>(initialData?.images || []);

  const handleLocationOptionChange = (newValue: string) => {
    setLocationValue(newValue);
    checkFormChanges({ ...form.getFieldsValue(), location: newValue });
  };

  const checkFormChanges = (currentValues: Record<string, any>) => {
    const hasFormChanges = Object.keys(currentValues).some((key) => {
      if (typeof currentValues[key] === 'number' && typeof initialData[key] === 'number') {
        return Math.abs(currentValues[key] - initialData[key]) > 0.000001;
      }
      return !isEqual(currentValues[key], initialData[key]);
    });

    const hasImageChanges = !isEqual(images, initialImages);
    setHasChanges(hasFormChanges || hasImageChanges);
  };

  useEffect(() => {
    if (isModalOpen) {
      checkFormChanges(form.getFieldsValue());
    }
  }, [images]);

  const onSubmit = (data: Record<string, any>) => {
    console.log('update to this:::', { ...data, images });
    setIsUpdateItemSuccessful(true);
  };

  const handleClose = () => {
    form.resetFields();
    setShowPriceInfo(false);
    setAskPrice(0);
    setHasChanges(false);
    setIsUpdateItemSuccessful(false);
    setImages(initialData?.images || []);
    onClose();
  };

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
    setShowPriceInfo(value > initialData?.askPrice);
    checkFormChanges({ ...form.getFieldsValue(), askPrice: value });
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      if (images.length === 0) {
        Modal.warning({
          title: 'Media Required',
          content: 'Please add at least one product image or video.',
          zIndex: 20000,
        });
        return;
      }
      const submitData = {
        ...values,
        images,
        initialAskPrice: initialData?.askPrice,
        newAskPrice: values.askPrice,
        isAskPriceIncreased: values.askPrice > initialData?.askPrice,
      };
      console.log('Form submitted with data:', submitData);
      onSubmit(submitData);
    });
  };

  // Shared props for FormContent
  const formContentProps: FormContentProps = {
    form,
    initialData,
    images,
    setImages,
    initialImages,
    askPrice,
    showPriceInfo,
    hasChanges,
    isUpdateItemSuccessful,
    locationValue,
    onClose: handleClose,
    handleTrackStatus,
    handleAskPriceChange,
    handleLocationOptionChange,
    handleSubmit,
    checkFormChanges,
  };

  // ── Mobile: Full-screen view ──────────────────────────────────────────
  if (isMobile) {
    return (
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[10000] bg-white dark:bg-gray-900 flex flex-col overflow-hidden"
          >
            {/* ── Header ──────────────────────────────────────────────────── */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900">
              <button
                onClick={handleClose}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">Edit Product</span>
              </button>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                <X size={16} className="text-gray-500" />
              </button>
            </div>

            {/* ── Scrollable content ──────────────────────────────────────── */}
            <div className="flex-1 overflow-y-auto pb-10">
              <div className="px-4 py-4">
                {!isUpdateItemSuccessful && (
                  <div className="mb-4">
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                      Edit Product
                    </h2>
                    <p className="text-xs text-gray-400 mt-0.5">ID: {initialData?.productId}</p>
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

  // ── Desktop: Antd Modal (unchanged) ───────────────────────────────────
  return (
    <Modal
      open={isModalOpen}
      width={800}
      className="max-w-[800px]"
      onCancel={handleClose}
      footer={null}
    >
      <div className="max-h-[80vh] !overflow-y-scroll">
        <div className="flex flex-col sticky top-0 !bg-white z-10 pb-5">
          <span className="text-[28px] font-semibold">Edit Product: {initialData?.productId}</span>
        </div>
        <FormContent {...formContentProps} />
      </div>
    </Modal>
  );
};

export default UpdateItemModal;
