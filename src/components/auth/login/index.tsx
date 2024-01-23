'use client';
import { Button, Form, Input, Switch } from 'antd';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { useState } from 'react';

type LoginProps = {
  mobileResponsive: boolean;
  onRememberMe: (value: any, email: string) => void;
  handleLogin: (payload: Record<string, any>) => void;
  isLoading: boolean;
  error?: string | undefined;
};

const Login = (props: LoginProps) => {
  const { onRememberMe, handleLogin, isLoading } = props;
  const [username, setUsername] = useState('');
  const [switchValue, setSwitchValue] = useState(false);
  const initialUsername = (typeof window !== 'undefined' && localStorage.getItem('username')) || '';

  const initialValues = {
    username: initialUsername,
    rememberMe: !!initialUsername,
  };

  const [form] = Form.useForm();

  const onSwitchChange = (checked: boolean) => {
    setSwitchValue(checked);
  };

  const onFinish = (values: Record<string, any>) => {
    handleLogin(values);
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
        <header className="text-left text-3xl font-bold text-blue pb-7">Welcome Back</header>

        {/* {
          error as string && <h3 className='mb-7'>
            <Alert type="error" message={error} showIcon closable={false}></Alert>
          </h3>
        } */}
        <Form
          form={form}
          initialValues={initialValues}
          layout="vertical"
          requiredMark={false}
          onFinish={(value) => {
            onRememberMe(switchValue, username);
            onFinish(value);
          }}
          name="signin-form"
        >
          <Form.Item
            name="username"
            rules={[{ required: true, type: 'email', message: 'Email is invalid' }]}
            label={<span>Email</span>}
          >
            <Input
              placeholder="Ex: abcdefg@gmail.com"
              className="h-14"
              onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Item>
          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password' }]}
            label={<span>Password</span>}
          >
            <Input.Password placeholder="Enter Password" className="h-14" visibilityToggle />
          </Form.Item>
          <div className="flex items-center justify-between">
            <Form.Item valuePropName="checked" name="rememberMe">
              <Switch onChange={onSwitchChange} size="small" /> Remember me
            </Form.Item>{' '}
            <Link href={'/auth/forgot-password'} className="text-blue underline">
              Forgot password
            </Link>
          </div>

          <Button
            className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white h-14 rounded-lg"
            type="primary"
            disabled={isLoading}
            block
            loading={isLoading}
            htmlType="submit"
          >
            Sign in
          </Button>
        </Form>
      </div>
    </motion.div>
  );
};

export default Login;
