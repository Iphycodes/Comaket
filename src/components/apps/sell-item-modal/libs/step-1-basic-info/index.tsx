// import { Button, Col, Form, FormInstance, Input, Row, Select } from 'antd';
// import TextArea from 'antd/es/input/TextArea';
// import Image from 'next/image';
// import React, { useEffect, useState } from 'react';

// interface SellItemStep1Props {
//   handleSetBasicInfoData: (values: Record<string, any>) => void;
//   handleSetCurrentStep: (step: 'step1' | 'step2' | 'step3') => void;
//   basicInfoData: Record<string, any>;
//   sellItemStep1Form: FormInstance<any>;
// }

// const SellItemStep1 = ({
//   handleSetBasicInfoData,
//   handleSetCurrentStep,
//   basicInfoData,
//   sellItemStep1Form,
// }: SellItemStep1Props) => {
//   const [isImageSet, setIsImageSet] = useState<boolean>(true);

//   const onFinish = (values: Record<string, any>) => {
//     if (isImageSet) {
//       handleSetBasicInfoData(values);
//       handleSetCurrentStep('step2');
//     } else {
//       console.log('Image not set');
//     }
//   };

//   useEffect(() => {
//     console.log('basic info data', basicInfoData);
//     sellItemStep1Form.setFieldsValue(basicInfoData);
//   }, [basicInfoData]);

//   const itemConditionOptions = [
//     {
//       label: 'New',
//       value: 'new',
//     },
//     {
//       label: 'Foreign Used',
//       value: 'foreign used',
//     },
//     {
//       label: 'Fairly Used',
//       value: 'fairly used',
//     },
//   ];

//   return (
//     <Form
//       form={sellItemStep1Form}
//       layout="vertical"
//       requiredMark={false}
//       onFinish={onFinish}
//       className="w-full mt-2"
//     >
//       <div
//         className="min-h-[460px] max-h-[460px] overflow-y-scroll w-full"
//         style={
//           {
//             //   scrollbarWidth: 'thin',
//             //   scrollbarColor: 'black',
//             //   scrollbarGutter: 'auto',
//           }
//         }
//       >
//         <Row className="w-full">
//           <span className="font-semibold text-muted-foreground mb-2">Image</span>
//           <div className="border w-full border-neutral-300 p-2 rounded-lg mb-4">
//             <Row gutter={[10, 10]} className="w-full">
//               {[{}, {}, {}, {}, {}, {}, {}].map(() => {
//                 return (
//                   <Col className="flex justify-center items-center relative" md={4} xl={4}>
//                     <div className="w-full relative">
//                       <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-neutral-900 bg-opacity-60 z-[100] opacity-0 hover:opacity-100 transition-opacity text-white rounded-md">
//                         <i className="ri-delete-bin-6-line text-[20px] cursor-pointer"></i>
//                       </div>
//                       <Image
//                         src={'/assets/imgs/sneakers.jpg'}
//                         alt="upload-image"
//                         width={150}
//                         height={200}
//                         style={{ width: '100%', height: '70px' }}
//                         className="rounded-md"
//                       />
//                     </div>
//                   </Col>
//                 );
//               })}
//               <Col className="flex justify-center items-center" md={4} xl={4}>
//                 <div className="flex justify-center items-center w-[80px] h-[70px] bg-neutral-300 rounded-md hover:bg-neutral-400 cursor-pointer">
//                   <i className="ri-add-circle-fill text-[24px]"></i>
//                 </div>
//               </Col>
//             </Row>
//           </div>
//         </Row>

//         <Row className="w-full" gutter={[10, 0]}>
//           <Col lg={12} md={12}>
//             <Form.Item
//               name="name"
//               rules={[{ required: true, message: 'Enter name' }]}
//               label={<span className="font-semibold text-muted-foreground mb-0">Name</span>}
//             >
//               <Input placeholder="Item Name" className="h-14" size="large" />
//             </Form.Item>
//           </Col>
//           <Col lg={12} md={12}>
//             <Form.Item
//               name="condition"
//               rules={[{ required: true, message: 'Enter name' }]}
//               label={<span className="font-semibold text-muted-foreground mb-0">Condition</span>}
//             >
//               <Select
//                 options={itemConditionOptions}
//                 className="h-14"
//                 placeholder="Item Condition"
//               />
//             </Form.Item>
//           </Col>
//         </Row>

//         <Row className="w-full">
//           <Col md={24} xs={24}>
//             <Form.Item
//               name="description"
//               className="mb-1"
//               label={<div className="font-semibold text-muted-foreground mb-0">Description</div>}
//             >
//               <TextArea
//                 className="w-full max-h-24"
//                 size="large"
//                 rows={4}
//                 placeholder="Add Item Description"
//               />
//             </Form.Item>
//           </Col>
//         </Row>
//       </div>
//       <div className="mt-2 flex justify-end">
//         <Button
//           className="opacity-100 hover:opacity-70 mt-1.5 bg-neutral-900 text-white h-12 rounded-md px-6"
//           type="primary"
//           block={false}
//           htmlType="submit"
//         >
//           Next
//         </Button>
//       </div>
//     </Form>
//   );
// };

// export default SellItemStep1;

// Enhanced SellItemStep1.tsx
import { Form, Input, message, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { FormInstance } from 'antd/lib/form';
import { ImageUploadSection } from '../image-upload-section';
import { useState } from 'react';

interface SellItemStep1Props {
  handleSetBasicInfoData: (values: Record<string, any>) => void;
  handleSetCurrentStep: (step: 'step1' | 'step2' | 'step3') => void;
  basicInfoData: Record<string, any>;
  sellItemStep1Form: FormInstance<any>;
}

const SellItemStep1: React.FC<SellItemStep1Props> = ({
  handleSetBasicInfoData,
  handleSetCurrentStep,
  basicInfoData,
  sellItemStep1Form,
}) => {
  const [images, setImages] = useState<string[]>(basicInfoData.images || []);

  const onFinish = (values: any) => {
    if (images.length > 0) {
      handleSetBasicInfoData({ ...values, images });
      handleSetCurrentStep('step2');
    } else {
      // Show error message
      message.error('Please upload at least one image');
    }
  };

  return (
    <Form
      form={sellItemStep1Form}
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      className="space-y-6"
      initialValues={basicInfoData}
    >
      <div className="max-h-[600px] overflow-y-auto px-4 space-y-6">
        <div>
          <h3 className="text-sm font-semibold text-gray-700 mb-2">Product Images</h3>
          <ImageUploadSection images={images} onImagesChange={setImages} maxImages={7} />
        </div>

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
            rows={4}
            placeholder="Describe your item in detail..."
            className="resize-none"
          />
        </Form.Item>
      </div>

      <div className="flex justify-end px-4 py-3 bg-gray-50 -mx-6 -mb-6">
        <button
          type="submit"
          className="px-10 text-lg font-semibold py-2 !h-14 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-md  transition-colors"
        >
          Next
        </button>
      </div>
    </Form>
  );
};

export default SellItemStep1;
