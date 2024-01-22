import { Button, Col, Form, Input, Row } from 'antd';
import React from 'react';

interface ConfirmPayoutPasswordProps {
  handleSetSteps: (steps: 'step1' | 'step2' | 'step3' | 'step4') => void;
}

const ConfirmPayoutPassword = ({ handleSetSteps }: ConfirmPayoutPasswordProps) => {
  const handleSumbit = () => {
    handleSetSteps('step4');
  };
  return (
    <Form
      name={'single-payout-form'}
      className={''}
      data-testid={'dti_form'}
      initialValues={{ saveBeneficiary: false }}
      onFinish={handleSumbit}
    >
      <Row className="my-0">
        <Col className="my-0" lg={24} xs={24}>
          <div className="mb-0 text-gray-500">{`Enter Password`}</div>
          <Form.Item name="name" className="mb-3">
            <Input type="password" className="w-full" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <div className="text-right">
        <Button
          className="opacity-100  hover:opacity-95 font-normal bg-blue text-white h-12"
          type="primary"
          disabled={false}
          loading={false}
          htmlType="submit"
        >
          <div className="flex items-center gap-2">
            <span>
              <i className="ri-send-plane-fill text-[18px]"></i>
            </span>
            <span>Confirm Payment</span>
          </div>
        </Button>
      </div>
    </Form>
  );
};

export default ConfirmPayoutPassword;
