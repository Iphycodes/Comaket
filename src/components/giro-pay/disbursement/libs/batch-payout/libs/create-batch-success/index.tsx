import { Button } from 'antd';
import React from 'react';

interface Props {
  batchName: string;
  handleSetSteps: (steps: 'step1' | 'step2' | 'step3' | 'step4' | 'step5') => void;
}

const CreateBatchSuccess: React.FC<Props> = ({ batchName, handleSetSteps }) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      <i
        className="ri-checkbox-circle-fill text-[100px] p-0 m-0  text-green-500"
        style={{ lineHeight: '160px' }}
      ></i>
      <div className="font-bold text-gray-600 mb-4">{`${batchName} Batch Created successfully, Would you like to proceed to adding Recipients?`}</div>
      <Button
        className="opacity-100 flex justify-center text-center items-center hover:opacity-95 font-normal bg-gray-700 text-white py-7 px-7"
        type="primary"
        disabled={false}
        loading={false}
        onClick={() => handleSetSteps('step4')}
      >
        <div className="flex items-center gap-2">
          <span>
            <i className="ri-send-plane-fill text-[18px]"></i>
          </span>
          <span>Proceed to Add Reciepients</span>
        </div>
      </Button>
    </div>
  );
};

export default CreateBatchSuccess;
