import { Button, Col, Form, FormInstance, InputNumber, Row, Select } from 'antd';
import React, { useEffect, useState } from 'react';

interface SellItemStep2Props {
  handleSetLocationAndPricingData: (values: Record<string, any>) => void;
  handleSetCurrentStep: (step: 'step1' | 'step2' | 'step3') => void;
  locationAndPricingData: Record<string, any>;
  sellItemStep2Form: FormInstance<any>;
  fee: number;
  setFee: React.Dispatch<React.SetStateAction<number>>;
}

const SellItemStep2 = ({
  handleSetLocationAndPricingData,
  handleSetCurrentStep,
  locationAndPricingData,
  sellItemStep2Form,
  fee,
  setFee,
}: SellItemStep2Props) => {
  const [locationValue, setLocationValue] = useState<string>('');

  useEffect(() => {
    sellItemStep2Form.setFieldsValue(locationAndPricingData);
  }, [locationAndPricingData]);

  const handleCalculateFee = (price: number) => {
    const itemFee = price / 100;
    setFee(itemFee);
  };

  const onFinish = (values: Record<string, any>) => {
    handleSetLocationAndPricingData({ ...values, fee: fee });
    handleSetCurrentStep('step3');
  };

  const handleLocationOptionChange = (newValue: string) => {
    setLocationValue(newValue);
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

  const locationOptions = mockLocations.map(({ value, label }) => {
    return {
      label: label,
      value: value,
    };
  });

  return (
    <div className="w-full">
      <Form
        form={sellItemStep2Form}
        layout="vertical"
        requiredMark={false}
        onFinish={onFinish}
        className="w-full mt-4"
      >
        <div
          className="min-h-[460px] max-h-[460px] overflow-y-scroll w-full"
          style={
            {
              // scrollbarWidth: 'thin',
              // scrollbarColor: 'black',
              // scrollbarGutter: 'auto',
            }
          }
        >
          {/* <div className="mb-3">
            <span
              onClick={() => handleSetCurrentStep('step1')}
              className="py-1 sticky top-0 flex gap-1 w-20 cursor-pointer text-blue items-center"
            >
              <i className="ri-arrow-left-line text-[20px]"></i>
              <span>Go Back</span>
            </span>
          </div> */}
          <Row>
            <Col md={24} xs={24}>
              <Form.Item
                name="location"
                rules={[{ required: true, message: 'Enter Location' }]}
                label={<span className="font-semibold text-muted-foreground mb-0">Location</span>}
              >
                <Select
                  showSearch
                  className="h-14"
                  value={locationValue}
                  placeholder={'Location'}
                  //   size="large"
                  defaultActiveFirstOption={false}
                  //   suffixIcon={null}
                  filterOption={(input, option) =>
                    (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                  }
                  //   onSearch={handleSearch}
                  onChange={handleLocationOptionChange}
                  notFoundContent={null}
                  options={locationOptions}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row className="mb-3">
            <Form.Item
              name="askPrice"
              className="tall-number-input mb-0 w-full"
              rules={[{ required: true, message: 'Input price' }]}
              label={<div className="mb-0 text-muted-foreground">{`Ask Price (\u20A6)`}</div>}
            >
              <InputNumber
                className="w-full h-14"
                size="large"
                controls={false}
                prefix={<span>&#8358; </span>}
                placeholder="Enter Amount"
                onChange={(value) => handleCalculateFee(Number(value) ?? 0)}
              />
            </Form.Item>
            {<div className="w-full text-right">{`Fee: \u20A6${fee}`}</div>}
          </Row>

          <Row>
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
          </Row>
        </div>

        <div className="mt-2 flex justify-end">
          <Button
            className="opacity-100 hover:opacity-70 mt-1.5 bg-neutral-900 text-white h-12 rounded-md px-6"
            type="primary"
            block={false}
            htmlType="submit"
          >
            Next
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SellItemStep2;
