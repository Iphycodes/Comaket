import { ReciepientsDataType } from '@grc/_shared/constant';
import { Button, Col, Form, Input, InputNumber, Row, Select } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

interface AddReciepientFormProps {
  // Add your prop types here
  setIsAdd: Dispatch<SetStateAction<boolean>>;
  handleAddBatchReciepient: (reciepient: ReciepientsDataType) => void;
}

const AddReciepientForm: React.FC<AddReciepientFormProps> = ({
  setIsAdd,
  handleAddBatchReciepient,
}) => {
  const handleGoBack = () => {
    setIsAdd(false);
  };

  const handleSubmitForm = (values: ReciepientsDataType) => {
    handleAddBatchReciepient(values);

    setIsAdd(false);
  };

  return (
    <div className={'mt-4'}>
      <span
        onClick={() => handleGoBack()}
        className="mb-2 flex gap-1 w-20 cursor-pointer text-blue items-center"
      >
        <i className="ri-arrow-left-line text-[20px]"></i>
        <span>Go Back</span>
      </span>
      <Form
        name={'batch-add-reciepient-form'}
        className={'mt-4'}
        data-testid={'dti_form'}
        onFinish={handleSubmitForm}
      >
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <div className="mb-0 text-gray-500">{`Amount (\u20A6)`}</div>
            <Form.Item
              name="amount"
              className="amount-inp mb-3"
              rules={[{ required: true, message: 'Input amount' }]}
            >
              <InputNumber
                className="w-full"
                size="large"
                controls={false}
                min={100}
                prefix={<span>&#8358; </span>}
                placeholder="Enter Amount"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row>
          <Col lg={24} xs={24}>
            <div className="mb-0 text-gray-500">Bank</div>
            <Form.Item
              name="bank"
              className="mb-3"
              rules={[{ required: true, message: 'Input bank name' }]}
            >
              <Select
                size="large"
                placeholder={'Enter Bank Name'}
                loading={false}
                showSearch={true}
                options={[
                  { value: 'Sterling Bank', label: 'Sterling Bank' },
                  { value: 'Keystone Bank', label: 'Keystone Bank' },
                  { value: 'GT Bank', label: 'GT Bank' },
                ]}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <div className="mb-0 text-gray-500">{`Account Number`}</div>
            <Form.Item
              name="accountNumber"
              className="amount-inp mb-3"
              rules={[{ required: true, message: 'Input Account number' }]}
            >
              <InputNumber
                className="w-full"
                size="large"
                controls={false}
                placeholder="Account Number"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <div className="mb-0 text-gray-500">{`Account Name`}</div>
            <Form.Item name="accountName" className="amount-inp mb-3">
              <Input className="w-full" size="large" />
            </Form.Item>
          </Col>
        </Row>
        <div className="flex items-center justify-end">
          <Button
            className="opacity-100 hover:opacity-95 font-normal bg-blue text-white flex items-center justify-center py-5"
            type="primary"
            disabled={false}
            loading={false}
            htmlType="submit"
          >
            <div className="flex items-center gap-2">
              <span>
                <i className="ri-add-line text-[18px]"></i>
              </span>
              <span>Add</span>
            </div>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default AddReciepientForm;
