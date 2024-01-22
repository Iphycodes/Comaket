import { Button } from 'antd';
import React from 'react';

interface PayoutSuccessProps {
  // Add your prop types here
}

const PayoutSuccess: React.FC<PayoutSuccessProps> = ({}) => {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Your component content here */}
      <i
        className="ri-checkbox-circle-fill text-[200px] p-0 m-0  text-green-500"
        style={{ lineHeight: '200px' }}
      ></i>
      <div className="text-lg font-bold text-gray-600 mb-4">Payment Successful</div>
      <Button
        className="opacity-100 flex justify-center text-center items-center hover:opacity-95 font-normal bg-gray-700 text-white py-6 px-6"
        type="primary"
        disabled={false}
        loading={false}
      >
        <div className="flex items-center gap-2">
          <span>
            <i className="ri-download-fill text-[18px]"></i>
          </span>
          <span>Print Reciept</span>
        </div>
      </Button>
    </div>
  );
};

export default PayoutSuccess;
