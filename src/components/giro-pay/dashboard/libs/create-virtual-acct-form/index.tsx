import React, { useContext, useEffect } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import { AppContext } from '@grc/app-context';
import { pick } from 'lodash';

interface ICreateVirtualAcct {
  handleCreateVirtualAcct: (payload: Record<string, any>) => void;
  isLoadingCreateVirtualAccount: boolean;
}

const CreateVirtualAcctForm = (props: ICreateVirtualAcct) => {
  const { handleCreateVirtualAcct, isLoadingCreateVirtualAccount } = props;
  const [form] = Form.useForm();
  const { authData } = useContext(AppContext);
  useEffect(() => form.resetFields(), [authData, form]);

  return (
    <main>
      <div className="text-left text-2xl">Create A Virtual Account</div>
      <Form
        name={'create-virtual-acct-form'}
        form={form}
        layout="vertical"
        requiredMark={false}
        onFinish={handleCreateVirtualAcct}
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
              rules={[{ required: true, message: 'Please enter account name' }]}
              label={<span>Account Name</span>}
            >
              <Input placeholder="Enter account name" className="h-14" />
            </Form.Item>
          </Col>
        </Row>
        <Button
          type="primary"
          className="opacity-100 hover:opacity-70 mt-1 bg-blue text-white h-12 rounded-lg font-bold px-8"
          block
          htmlType={'submit'}
          loading={isLoadingCreateVirtualAccount}
        >
          Create Virtual Account
        </Button>
      </Form>
    </main>
  );
};

export default CreateVirtualAcctForm;
