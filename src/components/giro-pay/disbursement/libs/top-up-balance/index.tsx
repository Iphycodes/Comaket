import { Space } from 'antd';
import React from 'react';
import { GrTransaction } from 'react-icons/gr';

const TopUpBalance = () => {
  return (
    <div className="flex flex-col">
      <div className="flex justify-between items-center">
        <Space size={5}>
          <span
            className="text-[16px] flex justify-center items-center h-10 w-10 bg-blue"
            style={{ borderRadius: '50%' }}
          >
            <GrTransaction color="#ffffff" />
          </span>
          <span className="font-semibold text-[16px]">Top Up Balance</span>
        </Space>
      </div>
      <div className="flex items-center gap-5">
        <span className=" text-gray-500 font-semibold">Account Number: </span>
        <span className="text-lg font-bold">0065453363</span>
      </div>
      <div className="flex items-center gap-5">
        <span className=" text-gray-500 font-semibold">Account Name: </span>
        <span className="text-lg font-bold">GIRO-PAY MAIN ACCOUNT</span>
      </div>
      <div className="flex items-center gap-5">
        <span className=" text-gray-500 font-semibold">Bank: </span>
        <span className="text-lg font-bold">STERLING BANK</span>
      </div>
    </div>
  );
};

export default TopUpBalance;
