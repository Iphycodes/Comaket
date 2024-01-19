'use client';

import { Button } from 'antd';

const SendMoney = () => {
  return (
    <div className="w-[40%] flex flex-col min-h-[400px] shadow-sm border rounded-lg">
      <div className="w-full py-3 px-2 font-bold text-md border-y">Send Money</div>
      <div className="flex flex-col flex-grow items-center gap-10 px-10 py-6">
        <div className="flex flex-col items-center text-center">
          <div className="text-[32px] font-bold">Send Money</div>
          <span className="font-thin">
            Disburse funds to anyone instantly, or to a batch of people
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <Button
            className="opacity-100 hover:opacity-95 mt-1.5 font-normal bg-blue text-white h-12"
            type="primary"
            disabled={false}
            block
            loading={false}
            htmlType="submit"
          >
            Initate Single Payout
          </Button>
          <Button
            className="opacity-100 hover:opacity-95 mt-1.5 font-normal bg-black text-white h-12"
            type="primary"
            disabled={false}
            block
            loading={false}
            htmlType="submit"
          >
            Initate Batch Payout
          </Button>
          <div className="text-center">
            <span className="underline underline-offset-2 cursor-pointer">View Saved Batches</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendMoney;
