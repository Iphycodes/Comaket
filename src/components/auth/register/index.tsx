'use client';
import { isValidPassword } from '@grc/_shared/helpers';
import { Button, Checkbox, Col, Form, FormInstance, Input, InputNumber, Row } from 'antd';
import { InfoCircleOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import Link from 'next/link';
import PasswordInput from '../lib/password-input';
import CustomToolTip from '@grc/_shared/components/custom-tooltip';

type RegisterProps = {
  mobileResponsive: boolean;
  theme?: string;
  handleRegisterUser: (payload: Record<string, any>) => void;
  isRegisterLoading: boolean;
  form: FormInstance<any>;
  error?: string | undefined;
};

const Register = (props: RegisterProps) => {
  const { handleRegisterUser, isRegisterLoading, form } = props;
  const onFinish = (values: Record<string, any>) => {
    handleRegisterUser(values);
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
      <div className="w-full mb-10">
        <header className="text-left text-3xl font-bold text-blue pb-3">Register</header>
        <span className="text-muted-foreground">Fill out the details below to register</span>
        {/* {
          error as string && <h3 className='my-7'>
            <Alert type="error" message={error} showIcon closable={false}></Alert>
          </h3>
        } */}
        <Form
          form={form}
          layout="vertical"
          requiredMark={false}
          onFinish={(value) => {
            onFinish(value);
          }}
          name="register-form"
          className="register-form mt-3"
        >
          <Row gutter={[16, 16]}>
            <Col md={12} xs={24}>
              <Form.Item
                name="firstName"
                rules={[{ required: true, message: 'Enter first name' }]}
                label={<span>First Name</span>}
              >
                <Input placeholder="First Name" className="h-14" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="lastName"
                rules={[{ required: true, message: 'Enter last name' }]}
                label={<span>Last Name</span>}
              >
                <Input placeholder="Last Name" className="h-14" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={24} xs={24}>
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Enter account name' }]}
                label={
                  <span>
                    AccountName{' '}
                    <CustomToolTip
                      title="This is the name to be associated with your business."
                      placement={'right'}
                    >
                      {' '}
                      <InfoCircleOutlined />
                    </CustomToolTip>
                  </span>
                }
              >
                <Input placeholder="Account Name" className="h-14" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={12} xs={24}>
              <Form.Item
                name="email"
                rules={[{ required: true, type: 'email', message: 'Email is invalid' }]}
                label={<span>Email</span>}
              >
                <Input placeholder="Ex: abcdefg@gmail.com" className="h-14" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="phone"
                label={<span>Phone Number</span>}
                rules={[
                  {
                    pattern: /^\d{10,11}$/,
                    message: 'Enter a valid mobile number',
                    required: true,
                  },
                ]}
              >
                <InputNumber
                  className="h-14"
                  placeholder="Phone Number"
                  addonBefore={<>+234</>}
                  controls={false}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={12} xs={24}>
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
                label={<span>Password</span>}
              >
                <PasswordInput />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
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
                label={<span>Confirm Password</span>}
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
          <Row gutter={[16, 16]} className="mt-2">
            <Col md={24} xs={24}>
              <Form.Item
                valuePropName="checked"
                name="agreement"
                rules={[
                  {
                    validator: (_, value) =>
                      value
                        ? Promise.resolve()
                        : Promise.reject(new Error('Accept agreement to continue')),
                  },
                ]}
              >
                <Checkbox className="dark:text-white">
                  {' '}
                  By clicking <b>Create Account</b> you agree to Giro’s{' '}
                  <Link href="#" className="text-sky-950 underline hover:no-underline">
                    Terms & Conditions
                  </Link>
                  , <br />
                  <Link href="#" className="text-sky-950 underline hover:no-underline">
                    Privacy Policy
                  </Link>{' '}
                  &nbsp; &{' '}
                  <Link href="#" className="text-sky-950 underline hover:no-underline">
                    License agreement
                  </Link>{' '}
                </Checkbox>
              </Form.Item>
            </Col>
          </Row>

          <Button
            className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white h-14 rounded-lg"
            type="primary"
            disabled={isRegisterLoading}
            block
            loading={isRegisterLoading}
            htmlType="submit"
          >
            Create Account
          </Button>
        </Form>
      </div>
    </motion.div>
  );
};

export default Register;
