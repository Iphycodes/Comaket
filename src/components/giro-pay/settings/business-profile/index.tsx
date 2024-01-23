'use client';
import React, { useEffect } from 'react';
import { categories, status } from '@grc/_shared/constant';
import { Button, Card, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import { motion } from 'framer-motion';
import { AuthDataType } from '@grc/_shared/namespace/auth';

type BusinessProfileProps = {
  mobileResponsive?: boolean;
  theme?: string;
  profile: AuthDataType | any;
  handleUpdateBusinessProfile: (payload: Record<string, any>) => void;
  isUpdatingBusinessProfile: boolean;
};

export const BusinessProfile = (props: BusinessProfileProps) => {
  const { handleUpdateBusinessProfile, isUpdatingBusinessProfile } = props;
  const [form] = Form.useForm();

  const initialValues = {};

  const onFinish = (values: Record<string, any>) => {
    handleUpdateBusinessProfile(values);
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <motion.div
      style={{ backgroundColor: 'transparent' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'ease-in-out', duration: 0.4 }}
    >
      <section className=" w-4/5 mt-10 mx-auto">
        <Card className="dark:bg-zinc-800 text-card-foreground border dark:border-gray-500 shadow-md">
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={(value) => {
              onFinish(value);
            }}
            name="update-business-profile-form"
            className="mt-5 update-business-profile-form"
          >
            <Row gutter={[16, 16]}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Enter name' }]}
                  label={<span>Name</span>}
                >
                  <Input placeholder="Name" className="h-14" />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, type: 'email', message: 'Email is invalid' }]}
                  label={<span>Email</span>}
                >
                  <Input placeholder="Ex: abcdefg@gmail.com" className="h-14" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="addressLine_1"
                  rules={[{ required: true, message: 'Enter address' }]}
                  label={<span>Address</span>}
                >
                  <Input placeholder="Address" className="h-14" />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="phone"
                  label={<span>Mobile</span>}
                  rules={[
                    {
                      pattern: /^\d{10,11}$/,
                      message: 'Enter a valid mobile number',
                      required: true,
                    },
                  ]}
                >
                  <InputNumber
                    className="h-14"
                    placeholder="Phone Number"
                    addonBefore={<>+234</>}
                    controls={false}
                  />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="category"
                  rules={[{ required: true, message: 'Enter your business category' }]}
                  label={<span>Category</span>}
                >
                  <Select options={categories} placeholder="Category" />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="status"
                  rules={[{ required: true, message: 'Enter your business status' }]}
                  label={<span>Status</span>}
                >
                  <Select options={status} placeholder="Status" />
                </Form.Item>
              </Col>
            </Row>

            <div className="w-full flex items-center my-3">
              <Button
                className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white h-12 rounded-lg px-10 mx-auto"
                type="primary"
                disabled={isUpdatingBusinessProfile}
                block={false}
                loading={isUpdatingBusinessProfile}
                htmlType="submit"
              >
                Update Profile
              </Button>
            </div>
          </Form>
        </Card>
      </section>
    </motion.div>
  );
};
