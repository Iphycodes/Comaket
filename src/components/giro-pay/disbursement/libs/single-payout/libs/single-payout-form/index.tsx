import { Button, Col, Form, Input, InputNumber, Row, Select, Space } from 'antd';
import React from 'react';

export interface IBanks {
  bankCode: string;
  name: string;
  nibssBankCode: string;
}

interface SinglePayoutFormProps {
  banks?: IBanks[];
  handleSetPaymentDetails?: () => void;
}

const SinglePayoutForm = ({ banks }: SinglePayoutFormProps) => {
  const banksOptions = banks?.map(({ name, bankCode }) => ({
    Label: (
      <div style={{ background: 'var(--bg-secondary)' }}>
        {name} - ({bankCode})
      </div>
    ),
    value: `${name}-${bankCode}`,
  }));

  return (
    <div className="max-h-[450px] overflow-y-scroll">
      <div className="flex sticky top-0 bg-white z-10 items-center border-b-2 pb-2">
        <Space className="" size={10}>
          <span
            className="text-[16px] flex justify-center items-center h-12 w-12 bg-blue"
            style={{ borderRadius: '50%' }}
          >
            <i className="ri-send-plane-fill text-white text-[18px]"></i>{' '}
          </span>
          <span className="font-bold text-[20px]">Single Payout</span>
        </Space>
      </div>

      <Row className="py-5" style={{}}>
        <Col span={24} className="beneficiary-form">
          <div className="mb-0 text-gray-500">Select Saved Beneficiary</div>
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
      >
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <div className="mb-0 text-gray-500">{`Amount (\u20A6)`}</div>
            <Form.Item
              name="amount"
              className="amount-inp mb-3"
              rules={[{ required: true, message: 'Input amount' }]}
            >
              <InputNumber
                className="w-full"
                size="large"
                controls={false}
                min={100}
                prefix={<span>&#8358; </span>}
                placeholder="Enter Amount"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col lg={24} xs={24}>
            <div className="mb-0 text-gray-500">Bank</div>
            <Form.Item
              name="bankName"
              className="mb-3"
              rules={[{ required: true, message: 'Input bank name' }]}
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
            <div className="mb-0 text-gray-500">{`Account Number`}</div>
            <Form.Item
              name="acct-number"
              className="amount-inp mb-3"
              rules={[{ required: true, message: 'Input Account number' }]}
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
            <div className="mb-0 text-gray-500">{`Account Name`}</div>
            <Form.Item name="acct-number" className="amount-inp mb-3">
              <Input className="w-full" size="large" disabled />
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
