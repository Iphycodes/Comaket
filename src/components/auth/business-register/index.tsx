'use client';
import { Button, Col, Form, Input, Row, Select } from 'antd';
import { motion } from 'framer-motion';
import { categories, countries } from '@grc/_shared/constant';

type BuisnessRegisterProps = {
  mobileResponsive: boolean;
  theme: string;
  handleBusinessRegister: (payload: Record<string, any>) => void;
  categoriesLoading: boolean;
};

const BusinessRegister = (props: BuisnessRegisterProps) => {
  const { handleBusinessRegister, categoriesLoading } = props;
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    handleBusinessRegister(values);
  };

  return (
    <motion.div
      style={{ backgroundColor: 'transparent' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'spring', duration: 1 }}
      className="w-2/3"
    >
      <div className="w-full">
        <header className="text-left text-3xl font-bold text-blue pb-3">
          Set Up Your Account On Giro
        </header>
        <span className="text-gray-400">
          Fill in the details below to set up your business on Giro.
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
          name="business-register-form"
          className="mt-5 business-register-form"
        >
          <Row gutter={[16, 16]}>
            <Col md={24} xs={24}>
              <Form.Item
                name="accountName"
                rules={[{ required: true, message: 'Enter account name' }]}
                label={<span>Account</span>}
              >
                <Input placeholder="Account Name" className="h-14" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={12} xs={24}>
              <Form.Item
                name="name"
                rules={[{ required: true, message: 'Enter business name' }]}
                label={<span>Business Name</span>}
              >
                <Input placeholder="John Doe" className="h-14" />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="email"
                rules={[{ required: true, type: 'email', message: 'Email is invalid' }]}
                label={<span>Email</span>}
              >
                <Input placeholder="Ex: abcdefg@gmail.com" className="h-14" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={12} xs={24}>
              <Form.Item
                name="country"
                rules={[{ required: true, message: 'Select a country' }]}
                label={<span>Country</span>}
              >
                <Select
                  loading={categoriesLoading}
                  options={countries}
                  placeholder="Select a country"
                />
              </Form.Item>
            </Col>
            <Col md={12} xs={24}>
              <Form.Item
                name="state"
                rules={[{ required: true, message: 'Enter state' }]}
                label={<span>State</span>}
              >
                <Input placeholder="" className="h-14" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={24} xs={24}>
              <Form.Item
                name="addressLine_1"
                rules={[{ required: true, message: 'Enter business address' }]}
                label={<span>Business Address</span>}
              >
                <Input placeholder="" className="h-14" />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col md={24} xs={24}>
              <Form.Item
                name="category"
                rules={[{ required: true, message: 'Select a business category' }]}
                label={<span>Business Category</span>}
              >
                <Select
                  loading={categoriesLoading}
                  options={categories}
                  placeholder="Select a business category"
                />
              </Form.Item>
            </Col>
          </Row>
          <Button
            className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white h-14 rounded-lg"
            type="primary"
            disabled={false}
            block
            loading={false}
            htmlType="submit"
          >
            Create Your Giro Account
          </Button>
        </Form>
      </div>
    </motion.div>
  );
};

export default BusinessRegister;
