import React, { useContext, useEffect } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import { AppContext } from '@grc/app-context';
import { pick } from 'lodash';

interface ICreateWalletProps {
  handleCreateWallet: (payload: Record<string, any>) => void;
  isLoadingCreateWallet: boolean;
}

const CreateWalletForm = (props: ICreateWalletProps) => {
  const { handleCreateWallet, isLoadingCreateWallet } = props;
  const [form] = Form.useForm();
  const { authData } = useContext(AppContext);
  useEffect(() => form.resetFields(), [authData, form]);

  return (
    <main>
      <div className="text-left text-2xl">Create A Wallet</div>
      <Form
        name={'create-virtual-acct-form'}
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleCreateWallet}
        initialValues={{
          ...pick(authData, ['bvn']),
          accountName: `${authData?.firstName} ${authData?.lastName}`,
        }}
        className="mt-7 text-left"
      >
        <Row>
          <Col md={24} xs={24}>
            <Form.Item
              name="accountName"
              rules={[{ required: true, message: 'Please enter wallet name' }]}
              label={<span>Wallet Name</span>}
            >
              <Input placeholder="Enter wallet name" className="h-14" />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type="primary"
          className="opacity-100 hover:opacity-70 mt-1 bg-blue text-white h-12 rounded-lg font-bold px-8"
          block
          htmlType={'submit'}
          loading={isLoadingCreateWallet}
        >
          Create Wallet
        </Button>
      </Form>
    </main>
  );
};

export default CreateWalletForm;
