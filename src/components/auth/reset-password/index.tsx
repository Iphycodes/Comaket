'use client';
import { isValidPassword } from '@grc/_shared/helpers';
import { Button, Form, Input, InputNumber } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PasswordInput from '../lib/password-input';

type ResetPasswordProps = {
  mobileResponsive: boolean;
  theme: string;
  handleResetPasswordSubmit: (payload: Record<string, any>) => void;
  handleResendPasscode: () => void;
};

const ResetPassword = (props: ResetPasswordProps) => {
  const { handleResetPasswordSubmit, handleResendPasscode } = props;
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    handleResetPasswordSubmit(values);
  };

  const handlePaste = (event: any) => {
    event.preventDefault();
    return false;
  };

  return (
    <motion.div
      style={{ backgroundColor: 'transparent' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', duration: 1 }}
      className="w-3/4"
    >
      <div className="w-full">
        <header className="text-left text-3xl font-bold text-blue pb-3">Reset Password</header>
        <span className="text-gray-400">
          Enter the OTP sent to your email address and reset your password
        </span>

        {/* <h3>
          {error && <Alert type="error" message={error} showIcon closable></Alert>}
        </h3> */}
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={(value) => {
            onFinish(value);
          }}
          name="reset-password-form"
          className="mt-5 reset-password-form"
        >
          <Form.Item
            name="verificationCode"
            rules={[
              {
                required: true,
                message: 'Verification code cannot be empty',
              },
            ]}
            label={<span>Verification Code</span>}
          >
            <InputNumber placeholder="Ex: 123456" className="h-14" controls={false} />
          </Form.Item>
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

          <Button
            className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white h-14 rounded-lg"
            type="primary"
            disabled={false}
            block
            loading={false}
            htmlType="submit"
          >
            Reset Password
          </Button>

          <div className="flex justify-center mt-5 items-center">
            {"Didn't get the email? "}{' '}
            <Button
              className="font-semibold py-1 px-1.5 text-blue"
              type="text"
              onClick={handleResendPasscode}
            >
              Click to resend
            </Button>
          </div>

          <div className="flex justify-center mt-5">
            <Link href="/auth/login">&larr; Back to log in</Link>
          </div>
        </Form>
      </div>
    </motion.div>
  );
};

export default ResetPassword;
