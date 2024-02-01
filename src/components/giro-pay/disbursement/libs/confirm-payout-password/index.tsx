import { Button, Col, Form, Input, Row } from 'antd';
import React from 'react';

interface ConfirmPayoutPasswordProps {
  handleVerifyUser: (values: Record<string, any>) => void;
  loading: {
    isPayoutLoading: boolean;
    isVerifyingUser: boolean;
  };
}

const ConfirmPayoutPassword = ({ handleVerifyUser, loading }: ConfirmPayoutPasswordProps) => {
  const handleSumbit = (values: Record<string, any>) => {
    handleVerifyUser(values);
  };
  return (
    <Form
      name={'single-payout-confirm-password-form'}
      className={'mt-3'}
      data-testid={'dti_form'}
      onFinish={handleSumbit}
      layout="vertical"
      requiredMark={false}
    >
      <Row className="my-0">
        <Col className="my-0" lg={24} xs={24}>
          <Form.Item
            name="password"
            className="mb-3"
            rules={[{ required: true, message: 'Enter your password' }]}
            label={<div className="mb-0 text-muted-foreground">Enter Password</div>}
          >
            <Input.Password visibilityToggle className="w-full" size="large" />
          </Form.Item>
        </Col>
      </Row>
      <div className="text-right">
        <Button
          className="opacity-100  hover:opacity-95 font-normal bg-blue text-white h-12"
          type="primary"
          disabled={loading.isPayoutLoading || loading.isVerifyingUser}
          loading={loading.isPayoutLoading || loading.isVerifyingUser}
          htmlType="submit"
        >
          Confirm Payment
        </Button>
      </div>
    </Form>
  );
};

export default ConfirmPayoutPassword;
