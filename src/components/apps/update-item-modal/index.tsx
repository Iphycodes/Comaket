import React, { useState, useEffect } from 'react';
import { Modal, Form, Input, Select, InputNumber, Alert, Typography } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { isEqual } from 'lodash';
import { PostRequestSuccessful } from '../post-request-successful';

const { Text } = Typography;
const { TextArea } = Input;

interface UpdateItemModalProps {
  isModalOpen: boolean;
  onClose: () => void;
  initialData: Record<string, any>;
  handleTrackStatus: (id: string | number) => void;
}

//but in real sense the track status for update will pick the data from the update response wch is holding info of the update values and have a status of pending.

const UpdateItemModal = ({
  isModalOpen,
  onClose,
  initialData,
  handleTrackStatus,
}: UpdateItemModalProps) => {
  const [form] = Form.useForm();
  const [askPrice, setAskPrice] = useState(initialData?.askPrice || 0);
  const [showPriceInfo, setShowPriceInfo] = useState(false);
  const [locationValue, setLocationValue] = useState<string>('');
  const [hasChanges, setHasChanges] = useState(false);
  const [isUpdateItemSuccessful, setIsUpdateItemSuccessful] = useState<boolean>(false);

  const handleLocationOptionChange = (newValue: string) => {
    setLocationValue(newValue);
    checkFormChanges({ ...form.getFieldsValue(), location: newValue });
  };

  const mockLocations = [
    {
      label: 'Kaduna',
      value: 'kaduna',
    },
    {
      label: 'Kano',
      value: 'kano',
    },
    {
      label: 'Abuja',
      value: 'abuja',
    },
  ];

  const locationOptions = mockLocations.map(({ value, label }) => ({
    label,
    value,
  }));

  const checkFormChanges = (currentValues: Record<string, any>) => {
    // Compare current form values with initial data
    const hasFormChanges = Object.keys(currentValues).some((key) => {
      // Handle special case for numbers (like askPrice)
      if (typeof currentValues[key] === 'number' && typeof initialData[key] === 'number') {
        return Math.abs(currentValues[key] - initialData[key]) > 0.000001; // Use small epsilon for floating point comparison
      }
      return !isEqual(currentValues[key], initialData[key]);
    });

    setHasChanges(hasFormChanges);
  };

  const onSubmit = (data: Record<string, any>) => {
    console.log('update to this:::', data);
    setIsUpdateItemSuccessful(true);
    // onClose();
  };

  const handleClose = () => {
    form.resetFields();
    setShowPriceInfo(false);
    setAskPrice(0);
    setHasChanges(false);
    setIsUpdateItemSuccessful(false);
    onClose();
  };

  useEffect(() => {
    if (isModalOpen && initialData) {
      form.setFieldsValue(initialData);
      setAskPrice(initialData.askPrice);
      setHasChanges(false);
    }
  }, [isModalOpen, initialData, form]);

  const handleAskPriceChange = (value: any) => {
    setAskPrice(value);
    setShowPriceInfo(value > initialData?.askPrice);
    checkFormChanges({ ...form.getFieldsValue(), askPrice: value });
  };

  const calculatePlatformFee = (price: any) => {
    return price * 0.01;
  };

  const handleSubmit = () => {
    form.validateFields().then((values) => {
      const submitData = {
        ...values,
        initialAskPrice: initialData?.askPrice,
        newAskPrice: values.askPrice,
        isAskPriceIncreased: values.askPrice > initialData?.askPrice,
      };
      console.log('Form submitted with data:', submitData);
      onSubmit(submitData);
    });
  };

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
        {isUpdateItemSuccessful ? (
          <PostRequestSuccessful
            itemId={initialData?.productId ?? ''}
            onClose={handleClose}
            onTrackStatus={handleTrackStatus}
            type="update"
          />
        ) : (
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={handleSubmit}
            className="space-y-6"
            initialValues={initialData}
            onValuesChange={(_, allValues) => checkFormChanges(allValues)}
          >
            <div className="grid grid-cols-2 gap-4">
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
                    { label: 'New', value: 'new' },
                    { label: 'Foreign Used', value: 'foreign used' },
                    { label: 'Fairly Used', value: 'fairly used' },
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
              <TextArea
                rows={5}
                placeholder="Describe your item in detail..."
                className="resize-none"
              />
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
            <div className="mt-2 flex justify-between items-center">
              <button
                type="button"
                onClick={() => handleClose()}
                className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!hasChanges}
                className={`px-10 text-lg font-semibold py-2 !h-14 ${
                  hasChanges
                    ? 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue-600 hover:to-indigo-600'
                    : 'bg-gray-300 cursor-not-allowed'
                } text-white rounded-md transition-colors`}
              >
                Update
              </button>
            </div>
          </Form>
        )}
      </div>
    </Modal>
  );
};

export default UpdateItemModal;
