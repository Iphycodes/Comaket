import { Col, Form, InputNumber, Row, Select, Space } from 'antd';
import React from 'react';

export interface IBanks {
  bankCode: string;
  name: string;
  nibssBankCode: string;
}

interface SinglePayoutProps {
  banks: IBanks[];
}

const SinglePayout = ({ banks }: SinglePayoutProps) => {
  const banksOptions = banks?.map(({ name, bankCode }) => ({
    Label: (
      <div style={{ background: 'var(--bg-secondary)' }}>
        {name} - ({bankCode})
      </div>
    ),
    value: `${name}-${bankCode}`,
  }));

  return (
    <div>
      <div className="flex items-center border-b-2 pb-3">
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
          <div className="mb-1 text-gray-500">Select Saved Beneficiary</div>
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
            <div className="mb-1 text-gray-500">{`Amount (\u20A6)`}</div>
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
            <div className="mb-1 text-gray-500">Bank</div>
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
      </Form>
    </div>
  );
};

export default SinglePayout;
