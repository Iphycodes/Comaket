'use client';
import React from 'react';
import { Button, Card, Col, DatePicker, Form, FormInstance, Row, Switch, TimePicker } from 'antd';
import { motion } from 'framer-motion';
import dayjs, { Dayjs } from 'dayjs';

type AccountSettingProps = {
  mobileResponsive?: boolean;
  theme?: string;
  handleUpdateAccountSetting: (payload: Record<string, any>) => void;
  isUpdatingAccountSetting: boolean;
  form: FormInstance<any>;
};

export const AccountSetting = (props: AccountSettingProps) => {
  const { handleUpdateAccountSetting, isUpdatingAccountSetting, form } = props;

  const onFinish = (values: Record<string, any>) => {
    handleUpdateAccountSetting(values);
  };

  const disabledDate = (currentDate: Dayjs | null) => {
    if (!currentDate) {
      return false;
    }

    const today = dayjs();
    const selectedDate = dayjs(currentDate);
    return (
      selectedDate.isBefore(today.startOf('day')) ||
      selectedDate.isBefore(today.startOf('month')) ||
      selectedDate.date() > 28
    );
  };

  return (
    <motion.section
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
            name="account-setting-form"
            className="mt-5 account-setting-form"
          >
            <Row gutter={[16, 16]} className="flex items center justify-center">
              <Col md={14} xs={24}>
                <Form.Item
                  name="serviceFeeDeductionDate"
                  rules={[
                    { required: true, message: 'Enter accrued service charge deduction date' },
                  ]}
                  label={<span>Accrued Service Charge Deduction Date</span>}
                >
                  <DatePicker
                    className="w-full h-14"
                    disabledDate={disabledDate}
                    showToday={false}
                  />
                </Form.Item>
              </Col>
            </Row>
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
                disabled={isUpdatingAccountSetting}
                block={false}
                loading={isUpdatingAccountSetting}
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
