import { Button, Col, Form, Row, Select, Space } from 'antd';
import React from 'react';

interface Props {
  handleSetSteps: (steps: 'step1' | 'step2' | 'step3' | 'step4') => void;
}

const BatchPayoutStarter: React.FC<Props> = ({ handleSetSteps }) => {
  return (
    <div>
      <Row className="py-2 items-center">
        <Form name={'batch-add-reciepient-form'} className={'mt-4 w-full'} data-testid={'dti_form'}>
          <Row className="py-4 w-full border-b px-0 m-0" gutter={[10, 10]}>
            <Col lg={18}>
              <Form.Item
                name="batchName"
                className="mb-3"
                rules={[{ required: true, message: 'Select a Batch' }]}
              >
                <Select
                  bordered={true}
                  showSearch
                  size="large"
                  placeholder={'Select a Batch'}
                  options={[]}
                  className={'w-full'}
                />
              </Form.Item>
            </Col>
            <Col lg={6}>
              <Button
                className="opacity-100 w-full flex items-center justify-center text-center hover:opacity-95 font-normal bg-blue text-white h-10"
                type="primary"
                disabled={false}
                loading={false}
                htmlType="submit"
              >
                <span>Proceed</span>
              </Button>
            </Col>
          </Row>
        </Form>
        {/* <div className="mb-0 text-gray-500">Batch Name</div> */}
      </Row>
      <div className="w-full text-gray-500 text-center flex flex-col gap-1 py-2 justify-center items-center">
        <div>Don't have a batch yet?</div>
        <span
          onClick={() => handleSetSteps('step2')}
          className="cursor-pointer text-center text-blue font-semibold"
        >
          <Space size={3}>
            <i className="ri-add-line"></i>
            <span className="hover:underline">Create a New Batch</span>
          </Space>
        </span>
      </div>
    </div>
  );
};

export default BatchPayoutStarter;
