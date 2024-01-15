'use client';
import React from 'react';
import { Button, Card, Col, Form, Input, Row } from 'antd';
import { isValidPassword } from '@grc/_shared/helpers';
import PasswordInput from '@grc/components/auth/lib/password-input';

type ChangePasswordProps = {
  mobileResponsive?: boolean;
  theme?: string;
  handleChangePassword: (payload: Record<string, any>) => void;
  isChangePasswordLoading: boolean;
};

export const ChangePassword = (props: ChangePasswordProps) => {
  const { handleChangePassword, isChangePasswordLoading } = props;
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    handleChangePassword(values);
  };

  const handlePaste = (event: any) => {
    event.preventDefault();
    return false;
  };

  return (
    <section className=" w-4/5 mt-10 mx-auto">
      <Card className="shadow-sm hover:border shadow-gray-300">
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={(value) => {
            onFinish(value);
          }}
          name="change-password-form"
          className="mt-5 change-password-form"
        >
          <Row gutter={[16, 16]} className="flex items center justify-center">
            <Col md={14} xs={24}>
              <Form.Item
                name="currentPassword"
                rules={[{ required: true, message: 'Enter your password' }]}
                label={<span>Old Password</span>}
              >
                <Input.Password
                  placeholder="Enter Password"
                  className="h-14"
                  visibilityToggle={false}
                  onPaste={handlePaste}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="flex items center justify-center">
            <Col md={14} xs={24}>
              <Form.Item
                name="password"
                rules={[
                  () => ({
                    validator(_, value) {
                      if (value && isValidPassword(value)) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error(
                          `
                              Password must be [8 to 15 characters with atleast one
                              lowercase letter, one uppercase letter, one numeric digit, and one
                              special character]
                            `
                        )
                      );
                    },
                  }),
                ]}
                label={<span>New Password</span>}
              >
                <PasswordInput />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={[16, 16]} className="flex items center justify-center">
            <Col md={14} xs={24}>
              <Form.Item
                name="confirmPassword"
                dependencies={['password']}
                rules={[
                  { required: true, message: 'Enter your password' },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      if (!value || getFieldValue('password') === value) {
                        return Promise.resolve();
                      }
                      return Promise.reject(
                        new Error('Your confirmation password does match with your password')
                      );
                    },
                  }),
                ]}
                label={<span>Confirm New Password</span>}
              >
                <Input.Password
                  placeholder="Enter Password"
                  className="h-14"
                  visibilityToggle={false}
                  onPaste={handlePaste}
                />
              </Form.Item>
            </Col>
          </Row>

          <div className="w-full flex items-center my-3">
            <Button
              className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white h-12 rounded-lg px-10 mx-auto"
              type="primary"
              disabled={isChangePasswordLoading}
              block={false}
              loading={isChangePasswordLoading}
              htmlType="submit"
            >
              Change Password
            </Button>
          </div>
        </Form>
      </Card>
    </section>
  );
};