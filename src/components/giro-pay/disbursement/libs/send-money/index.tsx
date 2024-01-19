'use client';

import { Button, Card } from 'antd';

const SendMoney = () => {
  return (
    <Card className="w-full h-52 send-money-card shadow-sm shadow-gray-100">
      <div className="flex flex-col flex-grow gap-5 h-52 justify-center">
        <div className="flex flex-col">
          <div className="text-[18px] font-bold">Send Money</div>
          <span className="font-thin">
            Disburse funds to anyone instantly, or to a batch of people
          </span>
        </div>
        <div className="flex flex-col gap-5">
          <div className="flex gap-5">
            <Button
              className="opacity-100 hover:opacity-95 mt-1.5 font-normal bg-blue text-white h-12"
              type="primary"
              disabled={false}
              loading={false}
              htmlType="submit"
            >
              Initate Single Payout
            </Button>
            <Button
              className="opacity-100 mt-1.5 font-normal bg-black text-white h-12"
              type="primary"
              disabled={false}
              loading={false}
              htmlType="submit"
            >
              Initate Batch Payout
            </Button>
          </div>
          <span className="underline underline-offset-2 cursor-pointer">View Saved Batches</span>
        </div>
      </div>
    </Card>
  );
};

export default SendMoney;
