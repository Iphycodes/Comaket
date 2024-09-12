import { Button, Col, Form, FormInstance, Input, Row, Select } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface SellItemStep1Props {
  handleSetBasicInfoData: (values: Record<string, any>) => void;
  handleSetCurrentStep: (step: 'step1' | 'step2' | 'step3') => void;
  basicInfoData: Record<string, any>;
  sellItemStep1Form: FormInstance<any>;
}

const SellItemStep1 = ({
  handleSetBasicInfoData,
  handleSetCurrentStep,
  basicInfoData,
  sellItemStep1Form
}: SellItemStep1Props) => {
  const [isImageSet, setIsImageSet] = useState<boolean>(true);

  const onFinish = (values: Record<string, any>) => {
    if (isImageSet) {
      handleSetBasicInfoData(values);
      handleSetCurrentStep('step2');
    } else {
      console.log('Image not set');
    }
  };

  useEffect(() => {
    console.log('basic info data', basicInfoData);
    sellItemStep1Form.setFieldsValue(basicInfoData);
  }, [basicInfoData]);

  const itemConditionOptions = [
    {
      label: 'New',
      value: 'new',
    },
    {
      label: 'Foreign Used',
      value: 'foreign used',
    },
    {
      label: 'Fairly Used',
      value: 'fairly used',
    },
  ];

  return (
    <Form
      form={sellItemStep1Form}
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      className="w-full mt-2"
    >
      <div
        className="min-h-[460px] max-h-[460px] overflow-y-scroll w-full"
        style={
          {
            //   scrollbarWidth: 'thin',
            //   scrollbarColor: 'black',
            //   scrollbarGutter: 'auto',
          }
        }
      >
        <Row className="w-full">
          <span className="font-semibold text-muted-foreground mb-2">Image</span>
          <div className="border w-full border-neutral-300 p-2 rounded-lg mb-4">
            <Row gutter={[10, 10]} className="w-full">
              {[{}, {}, {}, {}, {}, {}, {}].map(() => {
                return (
                  <Col className="flex justify-center items-center relative" md={4} xl={4}>
                    <div className="w-full relative">
                      <div className="w-full h-full flex items-center justify-center absolute inset-0 bg-neutral-900 bg-opacity-60 z-[100] opacity-0 hover:opacity-100 transition-opacity text-white rounded-md">
                        <i className="ri-delete-bin-6-line text-[20px] cursor-pointer"></i>
                      </div>
                      <Image
                        src={'/assets/imgs/sneakers.jpg'}
                        alt="upload-image"
                        width={150}
                        height={200}
                        style={{ width: '100%', height: '70px' }}
                        className="rounded-md"
                      />
                    </div>
                  </Col>
                );
              })}
              <Col className="flex justify-center items-center" md={4} xl={4}>
                <div className="flex justify-center items-center w-[80px] h-[70px] bg-neutral-300 rounded-md hover:bg-neutral-400 cursor-pointer">
                  <i className="ri-add-circle-fill text-[24px]"></i>
                </div>
              </Col>
            </Row>
          </div>
        </Row>

        <Row className="w-full" gutter={[10, 0]}>
          <Col lg={12} md={12}>
            <Form.Item
              name="name"
              rules={[{ required: true, message: 'Enter name' }]}
              label={<span className="font-semibold text-muted-foreground mb-0">Name</span>}
            >
              <Input placeholder="Item Name" className="h-14" size="large" />
            </Form.Item>
          </Col>
          <Col lg={12} md={12}>
            <Form.Item
              name="condition"
              rules={[{ required: true, message: 'Enter name' }]}
              label={<span className="font-semibold text-muted-foreground mb-0">Condition</span>}
            >
              <Select
                options={itemConditionOptions}
                className="h-14"
                placeholder="Item Condition"
              />
            </Form.Item>
          </Col>
        </Row>

        <Row className="w-full">
          <Col md={24} xs={24}>
            <Form.Item
              name="description"
              className="mb-1"
              label={<div className="font-semibold text-muted-foreground mb-0">Description</div>}
            >
              <TextArea
                className="w-full max-h-24"
                size="large"
                rows={4}
                placeholder="Add Item Description"
              />
            </Form.Item>
          </Col>
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
  );
};

export default SellItemStep1;
