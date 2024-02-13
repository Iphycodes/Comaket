import { Button, Col, Form, Input, Row } from 'antd';
import TextArea from 'antd/lib/input/TextArea';
import React from 'react';

interface Props {
  // Add your prop types here
  handleSetCurrentBatch: (values: Record<string, any>) => void;
  handleSetSteps: (steps: 'step1' | 'step2' | 'step3' | 'step4') => void;
}

const CreateBatchForm: React.FC<Props> = ({ handleSetCurrentBatch, handleSetSteps }) => {
  const handleSubmitForm = (values: Record<string, any>) => {
    const newBatchData = {
      ...values,
      reciepients: [],
    };
    handleSetCurrentBatch(newBatchData);
    handleSetSteps('step3');
  };

  return (
    <div className={'mt-4'}>
      <span
        onClick={() => handleSetSteps('step1')}
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
            <div className="mb-0 text-muted-foreground">{`Batch Name`}</div>
            <Form.Item
              name="batchName"
              className="mb-3"
              rules={[{ required: true, message: 'Enter Batch Name' }]}
            >
              <Input className="w-full" size="large" />
            </Form.Item>
          </Col>
        </Row>
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <div className="mb-0 text-muted-foreground">{`Description`}</div>
            <Form.Item name="description" className="mb-3">
              <TextArea className="w-full max-h-24" size="large" rows={3} />
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
              <span>Create Batch</span>
            </div>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default CreateBatchForm;
