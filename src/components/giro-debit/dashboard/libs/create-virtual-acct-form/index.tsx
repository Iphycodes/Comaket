import React, { useContext, useEffect } from 'react';
import { Form, Row, Col, Input, Button } from 'antd';
import { AppContext } from '@grc/app-context';
import { pick } from 'lodash';

interface ICreateVirtualAcct {
  handleCreateVirtualAcct: (payload: Record<string, any>) => void;
  isLoadingCreateVirtualAccount: boolean;
}

const CreateVirtualAcct = (props: ICreateVirtualAcct) => {
  const { handleCreateVirtualAcct, isLoadingCreateVirtualAccount } = props;
  const [form] = Form.useForm();
  const { authData } = useContext(AppContext);
  useEffect(() => form.resetFields(), [authData]);

  return (
    <main>
      <div style={{ fontSize: 24, textAlign: 'left' }}>Create A Virtual Account</div>
      <Form
        name={'create-virtual-acct-form'}
        form={form}
        onFinish={handleCreateVirtualAcct}
        initialValues={{
          ...pick(authData, ['bvn']),
          accountName: `${authData?.firstName} ${authData?.lastName}`,
        }}
      >
        <Row>
          <Col md={24} xs={24}>
            <div>Account Name</div>
            <Form.Item
              name="accountName"
              rules={[{ required: true, message: 'Please enter account name' }]}
              label={<span>Email</span>}
            >
              <Input placeholder="Account name" />
            </Form.Item>
          </Col>
        </Row>
        <Button type="primary" block htmlType={'submit'} loading={isLoadingCreateVirtualAccount}>
          Create Virtual Account
        </Button>
      </Form>
    </main>
  );
};

export default CreateVirtualAcct;
