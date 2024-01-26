import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React from 'react';

export interface IBanks {
  bankCode: string;
  name: string;
  nibssBankCode: string;
}

interface SinglePayoutFormProps {
  banks?: IBanks[];
  handleSetPaymentDetails: (details: Record<string, any>) => void;
  handleSetSinglePayoutSteps: (steps: 'step1' | 'step2' | 'step3' | 'step4') => void;
}

const SinglePayoutForm = ({
  handleSetPaymentDetails,
  handleSetSinglePayoutSteps,
}: SinglePayoutFormProps) => {
  // const banksOptions = banks?.map(({ name, bankCode }) => ({
  //   Label: (
  //     <div style={{ background: 'var(--bg-secondary)' }}>
  //       {name} - ({bankCode})
  //     </div>
  //   ),
  //   value: `${name}-${bankCode}`,
  // }));

  const banksOptions = [
    { value: 'Sterling Bank', label: 'Sterling Bank' },
    { value: 'Keystone Bank', label: 'Keystone Bank' },
    { value: 'GT Bank', label: 'GT Bank' },
  ];

  const handleSubmit = (details: Record<string, any>) => {
    handleSetPaymentDetails(details);
    handleSetSinglePayoutSteps('step2');
  };

  return (
    <div className="max-h-[550px] overflow-y-scroll">
      <Row className="py-5" style={{}}>
        <Col span={24} className="beneficiary-form">
          <div className="mb-0 text-muted-foreground">Select Saved Beneficiary</div>
          <Select
            bordered={true}
            showSearch
            size="large"
            // disabled={true}
            placeholder={'Select Saved Beneficiary'}
            options={[]}
            className={'w-full'}
          />
        </Col>
      </Row>
      <Form
        name={'single-payout-form'}
        className={''}
        data-testid={'dti_form'}
        initialValues={{ saveBeneficiary: false }}
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
      >
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <Form.Item
              name="amount"
              className="amount-inp mb-3"
              rules={[{ required: true, message: 'Input amount' }]}
              label={<div className="mb-0 text-muted-foreground">{`Amount (\u20A6)`}</div>}
            >
              <InputNumber
                className="w-full"
                size="large"
                controls={false}
                min={100}
                prefix={<span className="text-muted-foreground">&#8358; </span>}
                placeholder="Enter Amount"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col lg={24} xs={24}>
            <Form.Item
              name="reciepient-bank"
              className="mb-3"
              rules={[{ required: true, message: 'Input bank name' }]}
              label={<div className="mb-0 text-muted-foreground">Bank</div>}
            >
              <Select
                size="large"
                placeholder={'Enter Bank Name'}
                loading={false}
                showSearch={true}
                options={banksOptions}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <Form.Item
              name="account-number"
              className="amount-inp mb-3"
              rules={[{ required: true, message: 'Input Account number' }]}
              label={<div className="mb-0 text-muted-foreground">{`Account Number`}</div>}
            >
              <InputNumber
                className="w-full"
                size="large"
                controls={false}
                placeholder="Account Number"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <Form.Item
              name="name"
              className="amount-inp mb-3"
              label={<div className="mb-0 text-muted-foreground">{`Account Name`}</div>}
            >
              <Input className="w-full" size="large" />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex items-center justify-end">
          <Button
            className="opacity-100 hover:opacity-95 font-normal bg-blue text-white h-12"
            type="primary"
            disabled={false}
            loading={false}
            htmlType="submit"
          >
            <div className="flex items-center gap-2">
              <span>
                <i className="ri-add-line text-[18px]"></i>
              </span>
              <span>Proceed to Payment</span>
            </div>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default SinglePayoutForm;