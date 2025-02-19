import { Col, Form, FormInstance, InputNumber, Row, Select } from 'antd';
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

        <div className="mt-2 flex justify-between items-center">
          <button
            type="button"
            onClick={() => handleSetCurrentStep('step1')}
            className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
          >
            Back
          </button>
          <button
            type="submit"
            className="px-10 text-lg font-semibold py-2 !h-14 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md  transition-colors"
          >
            Next
          </button>
        </div>
      </Form>
    </div>
  );
};

export default SellItemStep2;

// Enhanced SellItemStep2.tsx
// import { Form, InputNumber, Select, Tooltip } from 'antd';
// import { FormInstance } from 'antd/lib/form';
// import { useState, useEffect } from 'react';

// interface SellItemStep2Props {
//   handleSetLocationAndPricingData: (values: Record<string, any>) => void;
//   handleSetCurrentStep: (step: 'step1' | 'step2' | 'step3') => void;
//   locationAndPricingData: Record<string, any>;
//   sellItemStep2Form: FormInstance<any>;
//   fee: number;
//   setFee: React.Dispatch<React.SetStateAction<number>>;
// }

// export const SellItemStep2: React.FC<SellItemStep2Props> = ({
//   handleSetLocationAndPricingData,
//   handleSetCurrentStep,
//   locationAndPricingData,
//   sellItemStep2Form,
//   fee,
//   setFee,
// }) => {
//   const [price, setPrice] = useState<number>(locationAndPricingData?.askPrice || 0);

//   useEffect(() => {
//     sellItemStep2Form.setFieldsValue(locationAndPricingData);
//   }, [locationAndPricingData]);

//   const handleCalculateFee = (value: number | null) => {
//     if (value) {
//       const calculatedFee = value * 0.01; // 1% fee
//       setFee(calculatedFee);
//       setPrice(value);
//     } else {
//       setFee(0);
//       setPrice(0);
//     }
//   };

//   const onFinish = (values: any) => {
//     handleSetLocationAndPricingData({ ...values, fee });
//     handleSetCurrentStep('step3');
//   };

//   const mockLocations = [
//     { label: 'Lagos', value: 'lagos' },
//     { label: 'Abuja', value: 'abuja' },
//     { label: 'Port Harcourt', value: 'port_harcourt' },
//     { label: 'Kaduna', value: 'kaduna' },
//     { label: 'Kano', value: 'kano' },
//     // Add more locations as needed
//   ];

//   return (
//     <Form
//       form={sellItemStep2Form}
//       layout="vertical"
//       requiredMark={false}
//       onFinish={onFinish}
//       className="space-y-6"
//       initialValues={locationAndPricingData}
//     >
//       <div className="max-h-[600px] overflow-y-auto px-4 space-y-6">
//         <Form.Item
//           name="location"
//           label="Location"
//           rules={[{ required: true, message: 'Please select a location' }]}
//         >
//           <Select
//             showSearch
//             options={mockLocations}
//             placeholder="Select location"
//             className="h-12"
//             filterOption={(input, option) =>
//               (option?.label ?? '').toLowerCase().includes(input.toLowerCase())
//             }
//           />
//         </Form.Item>

//         <div className="space-y-2">
//           <Form.Item
//             name="askPrice"
//             label={
//               <div className="flex items-center gap-2">
//                 Price
//                 <Tooltip title="Set your asking price. A 1% fee will be calculated.">
//                   <i className="ri-information-line text-gray-400" />
//                 </Tooltip>
//               </div>
//             }
//             rules={[{ required: true, message: 'Please enter asking price' }]}
//           >
//             <InputNumber
//               className="w-full h-12"
//               formatter={(value) => `₦ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
//               // parser={value =>  value!.replace(/₦\s?|(,*)/g, '')}
//               parser={(value) => 0}
//               onChange={handleCalculateFee}
//               min={0}
//               placeholder="Enter amount"
//             />
//           </Form.Item>

//           <div className="flex justify-between text-sm">
//             <span className="text-gray-500">Platform Fee (1%)</span>
//             <span className="font-medium">₦ {fee.toLocaleString()}</span>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-gray-500">You'll Receive</span>
//             <span className="font-medium">₦ {(price - fee).toLocaleString()}</span>
//           </div>
//         </div>

//         <Form.Item
//           name="negotiable"
//           label="Price Negotiation"
//           rules={[{ required: true, message: 'Please select an option' }]}
//         >
//           <Select
//             options={[
//               { label: 'Price is Negotiable', value: true },
//               { label: 'Fixed Price (Non-negotiable)', value: false },
//             ]}
//             className="h-12"
//           />
//         </Form.Item>
//       </div>

//       <div className="flex justify-between px-4 py-3 bg-gray-50 -mx-6 -mb-6">
//         <button
//           type="button"
//           onClick={() => handleSetCurrentStep('step1')}
//           className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
//         >
//           Back
//         </button>
//         <button
//           type="submit"
//           className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
//         >
//           Next
//         </button>
//       </div>
//     </Form>
//   );
// };
