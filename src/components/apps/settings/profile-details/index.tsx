'use client';
import React from 'react';
import moment from 'moment';
import CustomToolTip from '@grc/_shared/components/custom-tooltip';
import { countries, gender } from '@grc/_shared/constant';
import { Button, Card, Col, DatePicker, Form, Input, InputNumber, Row, Select } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';

type ProfileDetailsProps = {
  mobileResponsive?: boolean;
  theme?: string;
  handleUpdateProfileDetails: (payload: Record<string, any>) => void;
  isUpdatingProfile: boolean;
};

export const ProfileDetails = (props: ProfileDetailsProps) => {
  const { handleUpdateProfileDetails, isUpdatingProfile } = props;
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    handleUpdateProfileDetails(values);
  };
  return (
    <motion.section
      style={{ backgroundColor: 'transparent' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'ease-in-out', duration: 0.4 }}
    >
      <section className=" w-4/5 mt-10 mx-auto">
        <Card className="shadow-sm hover:border shadow-gray-300">
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={(value) => {
              onFinish(value);
            }}
            name="update-profile-details-form"
            className="mt-5 update-profile-details-form"
          >
            <Row gutter={[16, 16]}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="firstName"
                  rules={[{ required: true, message: 'Enter first name' }]}
                  label={<span>First Name</span>}
                >
                  <Input placeholder="First Name" className="h-14" />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="lastName"
                  rules={[{ required: true, message: 'Enter last name' }]}
                  label={<span>Last Name</span>}
                >
                  <Input placeholder="Last Name" className="h-14" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="email"
                  rules={[{ required: true, type: 'email', message: 'Email is invalid' }]}
                  label={<span>Email</span>}
                >
                  <Input placeholder="Ex: abcdefg@gmail.com" className="h-14" />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="phone"
                  label={<span>Phone Number</span>}
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
                  name="bvn"
                  label={
                    <span>
                      BVN{' '}
                      <CustomToolTip
                        title="BVN is your bank verification number"
                        placement={'right'}
                      >
                        <InfoCircleOutlined />
                      </CustomToolTip>
                    </span>
                  }
                  rules={[
                    {
                      pattern: /^\d{10}$/,
                      message: 'Enter a valid bvn',
                      required: true,
                    },
                  ]}
                >
                  <InputNumber className="h-14" placeholder="BVN" controls={false} />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Row gutter={[16, 16]}>
                  <Col md={12} xs={24}>
                    <Form.Item
                      name="dob"
                      rules={[{ required: true, message: 'Enter date of birth' }]}
                      label={<span>Date of Birth</span>}
                    >
                      <DatePicker
                        className="w-full h-14"
                        disabledDate={(currentDate) => currentDate > moment(new Date(), 'YYYY')}
                        showToday={false}
                      />
                    </Form.Item>
                  </Col>
                  <Col md={12} xs={24}>
                    <Form.Item
                      name="gender"
                      rules={[{ required: true, message: 'Enter your gender' }]}
                      label={<span>Gender</span>}
                    >
                      <Select options={gender} placeholder="Gender" />
                    </Form.Item>
                  </Col>
                </Row>
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
                  name="country"
                  rules={[{ required: true, message: 'Select a country' }]}
                  label={<span>Country</span>}
                >
                  <Select options={countries} placeholder="Select a country" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]}>
              <Col md={12} xs={24}>
                <Form.Item
                  name="city"
                  rules={[{ required: true, message: 'Enter city' }]}
                  label={<span>City</span>}
                >
                  <Input placeholder="City" className="h-14" />
                </Form.Item>
              </Col>
              <Col md={12} xs={24}>
                <Form.Item
                  name="state"
                  rules={[{ required: true, message: 'Enter state' }]}
                  label={<span>State</span>}
                >
                  <Input placeholder="State" className="h-14" />
                </Form.Item>
              </Col>
            </Row>
            <div className="w-full flex items-center my-3">
              <Button
                className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white h-12 rounded-lg px-10 mx-auto"
                type="primary"
                disabled={isUpdatingProfile}
                block={false}
                loading={isUpdatingProfile}
                htmlType="submit"
              >
                Update Profile
              </Button>
            </div>
          </Form>
        </Card>
      </section>
    </motion.section>
  );
};