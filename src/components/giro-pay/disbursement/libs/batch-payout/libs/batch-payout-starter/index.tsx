import { Button, Row, Select, Space } from 'antd';
import React from 'react';

interface Props {
  handleSetSteps: (steps: 'step1' | 'step2' | 'step3' | 'step4') => void;
}

const BatchPayoutStarter: React.FC<Props> = ({ handleSetSteps }) => {
  return (
    <div>
      <Row className="py-2 items-center" style={{}}>
        <div className="py-4 w-full flex justify-between items-center gap-2 border-b">
          <Select
            bordered={true}
            style={{ flex: 1 }}
            showSearch
            size="large"
            placeholder={'Enter Batch Name'}
            options={[]}
            className={'w-full'}
          />
          <Button
            className="opacity-100 w-[140px] flex items-center justify-center text-center hover:opacity-95 font-normal bg-blue text-white h-10"
            type="primary"
            disabled={false}
            loading={false}
            htmlType="submit"
          >
            <span>Proceed</span>
          </Button>
        </div>
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
