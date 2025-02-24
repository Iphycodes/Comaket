import React, { useState } from 'react';
import { Modal, Tabs, Form, Input, Button, Divider } from 'antd';
import { GoogleOutlined, UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [activeTab, setActiveTab] = useState('login');
  const [loginForm] = Form.useForm();
  const [signupForm] = Form.useForm();
  const isMobile = useMediaQuery(mediaSize.mobile);

  const handleGoogleAuth = async () => {
    try {
      // Implement Google Auth logic here
      console.log('Google auth initiated');
    } catch (error) {
      console.error('Google auth error:', error);
    }
  };

  const handleLogin = async (values: any) => {
    try {
      // Implement login logic here
      console.log('Login values:', values);
    } catch (error) {
      console.error('Login error:', error);
    }
  };

  const handleSignup = async (values: any) => {
    try {
      // Implement signup logic here
      console.log('Signup values:', values);
    } catch (error) {
      console.error('Signup error:', error);
    }
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={isMobile ? '90%' : 400}
      className={`auth-modal`}
      title={null}
      centered
    >
      <div className={`p-4 ${isMobile ? 'px-1' : ''}`}>
        <h2 className="text-2xl font-bold text-center mb-6">
          {activeTab === 'login' ? 'Welcome Back' : 'Create Account'}
        </h2>

        <Button
          icon={<GoogleOutlined />}
          block
          size="large"
          onClick={handleGoogleAuth}
          className="mb-6 !h-12 flex items-center justify-center"
        >
          Continue with Google
        </Button>

        <Divider className="mb-6">or</Divider>

        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          className="auth-tabs"
          items={[
            {
              key: 'login',
              label: 'Login',
              children: <LoginForm form={loginForm} onFinish={handleLogin} />,
            },
            {
              key: 'signup',
              label: 'Sign Up',
              children: <SignupForm form={signupForm} onFinish={handleSignup} />,
            },
          ]}
        />
      </div>
    </Modal>
  );
};

// LoginForm component
interface LoginFormProps {
  form: any;
  onFinish: (values: any) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ form, onFinish }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className="login-form"
    >
      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input
          prefix={<MailOutlined className="text-gray-400" />}
          placeholder="Email"
          size="large"
          className="h-12"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please enter your password' }]}
      >
        <Input.Password
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="Password"
          size="large"
          className="h-12"
        />
      </Form.Item>

      <Form.Item className="mb-2">
        <Button
          type="primary"
          htmlType="submit"
          block
          //   size="large"
          className="!h-12 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-1 shadow-sm"
        >
          Log In
        </Button>
      </Form.Item>

      <div className="text-right">
        <a href="#" className="text-sm text-gray-600 hover:text-black">
          Forgot password?
        </a>
      </div>
    </Form>
  );
};

// SignupForm component
interface SignupFormProps {
  form: any;
  onFinish: (values: any) => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ form, onFinish }) => {
  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={onFinish}
      requiredMark={false}
      className="signup-form"
    >
      <Form.Item
        name="username"
        rules={[
          { required: true, message: 'Please enter a username' },
          { min: 3, message: 'Username must be at least 3 characters' },
        ]}
      >
        <Input
          prefix={<UserOutlined className="text-gray-400" />}
          placeholder="Username"
          size="large"
          className="h-12"
        />
      </Form.Item>

      <Form.Item
        name="email"
        rules={[
          { required: true, message: 'Please enter your email' },
          { type: 'email', message: 'Please enter a valid email' },
        ]}
      >
        <Input
          prefix={<MailOutlined className="text-gray-400" />}
          placeholder="Email"
          size="large"
          className="h-12"
        />
      </Form.Item>

      <Form.Item
        name="password"
        rules={[
          { required: true, message: 'Please enter a password' },
          { min: 8, message: 'Password must be at least 8 characters' },
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="Password"
          size="large"
          className="h-12"
        />
      </Form.Item>

      <Form.Item
        name="confirmPassword"
        dependencies={['password']}
        rules={[
          { required: true, message: 'Please confirm your password' },
          ({ getFieldValue }) => ({
            validator(_, value) {
              if (!value || getFieldValue('password') === value) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Passwords do not match'));
            },
          }),
        ]}
      >
        <Input.Password
          prefix={<LockOutlined className="text-gray-400" />}
          placeholder="Confirm Password"
          size="large"
          className="h-12"
        />
      </Form.Item>

      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          block
          //   size="large"
          className="!h-12 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 rounded-lg flex items-center justify-center gap-1 shadow-sm"
        >
          Create Account
        </Button>
      </Form.Item>
    </Form>
  );
};
