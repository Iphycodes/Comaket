'use client';
import { Button, Space } from 'antd';
import { Wallet as WalletIcon } from '@grc/_shared/assets/svgs';

const DashBoard = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex w-full justify-between items-center font-semibold">
        <div className="flex flex-col gap-4">
          <div className="text-3xl">Welcome, Ifeanyi</div>
          <div className="font-thin">Here's an overview of your account today</div>
        </div>
        <div className="flex flex-col">
          <Space size={5}>
            <WalletIcon />
            <span>Giro Balance :</span>
          </Space>
          <div className="text-4xl font-bold">&#x20A6;2,500,000.00</div>
          <Button
            className="opacity-100 hover:opacity-95 mt-1.5 font-bold bg-black text-white h-12"
            type="primary"
            disabled={false}
            block
            loading={false}
            htmlType="submit"
          >
            Add Fund
          </Button>
        </div>
      </div>
      <div className="flex justify-between items-center px-5 py-10 w-full border text-gray-500">
        <div className="flex flex-col gap-1">
          <div className="font-bold text-[16px]">Create a Virtual Account</div>
          <span className="text-[12px]">
            A virtual account allows you to commence funding on Giro
          </span>
        </div>
        <Button
          className="opacity-100 bg-blue hover:opacity-95 px-6 text-white h-10"
          type="primary"
          disabled={false}
          loading={false}
          htmlType="submit"
          style={{ borderRadius: 0 }}
        >
          Verified Profile
        </Button>
      </div>
    </div>
  );
};

export default DashBoard;
