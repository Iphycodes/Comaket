'use client';
import React from 'react';
import { Button, Card, Col, Form, Row, Switch, TimePicker } from 'antd';
import { motion } from 'framer-motion';

type AccountSettingProps = {
  mobileResponsive?: boolean;
  theme?: string;
  handleUpdateAccountSetting: (payload: Record<string, any>) => void;
  isAccountSettingLoading: boolean;
};

export const AccountSetting = (props: AccountSettingProps) => {
  const { handleUpdateAccountSetting, isAccountSettingLoading } = props;
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    handleUpdateAccountSetting(values);
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
            name="account-setting-form"
            className="mt-5 account-setting-form"
          >
            <Row gutter={[16, 16]} className="flex items center justify-center">
              <Col md={14} xs={24}>
                <Form.Item
                  name="reportDeliveryTime"
                  rules={[{ required: true, message: 'Select a time' }]}
                  label={<span>Report Delivery Time</span>}
                >
                  <TimePicker className="w-full h-14" format={'HH:mm:ss'} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="flex items center justify-center">
              <Col md={14} xs={24}>
                <Form.Item
                  name="dailyTransactionReport"
                  valuePropName="checked"
                  label={<span>Dailt Transaction Report</span>}
                >
                  <Switch size={'default'} />
                </Form.Item>
              </Col>
            </Row>
            <div className="w-full flex items-center my-3">
              <Button
                className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white h-12 rounded-lg px-10 mx-auto"
                type="primary"
                disabled={isAccountSettingLoading}
                block={false}
                loading={isAccountSettingLoading}
                htmlType="submit"
              >
                Update
              </Button>
            </div>
          </Form>
        </Card>
      </section>
    </motion.section>
  );
};
