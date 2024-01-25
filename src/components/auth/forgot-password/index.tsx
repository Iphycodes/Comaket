'use client';
import { Button, Form, Input } from 'antd';
import { motion } from 'framer-motion';

type ForgotPasswordProps = {
  mobileResponsive: boolean;
  theme: string | undefined;
  handleForgotPassword: (payload: Record<string, any>) => void;
  isLoading: boolean;
};

const ForgotPassword = (props: ForgotPasswordProps) => {
  const { handleForgotPassword, isLoading } = props;
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    handleForgotPassword(values);
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
        <header className="text-left text-3xl font-bold text-blue pb-4">Forgot Password?</header>
        <span className="py-4 text-muted-foreground">
          Enter your registered email to recover your account
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
          name="forgot-password-form"
          className="mt-4"
        >
          <Form.Item
            name="email"
            rules={[{ required: true, type: 'email', message: 'Email is invalid' }]}
            label={<span>Email</span>}
          >
            <Input placeholder="Ex: abcdefg@gmail.com" className="h-14" />
          </Form.Item>

          <Button
            className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white h-14 rounded-lg"
            type="primary"
            disabled={isLoading}
            block
            loading={isLoading}
            htmlType="submit"
          >
            Send
          </Button>
        </Form>
      </div>
    </motion.div>
  );
};

export default ForgotPassword;
