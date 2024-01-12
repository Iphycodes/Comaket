'use client';
import { Select, Space } from 'antd';
import { Wallet as WalletIcon } from '@grc/_shared/assets/svgs';
import SendMoney from './libs/send-money';
import TopUp from './libs/top-up';

const Disbursement = () => {
  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex w-full justify-between items-center font-semibold">
        <div className="flex flex-col gap-2">
          <Space size={5}>
            <WalletIcon />
            <span>Giro Balance :</span>
          </Space>
          <div className="text-4xl font-bold">&#x20A6;2,500,000.00</div>
          <div className="font-thin">Total Balance from all accounts</div>
        </div>
        <div className="flex flex-col">
          <Select
            size="large"
            className="w-[400px] font-normal virtual-account-select"
            placeholder="Select a virtual account"
          />
        </div>
      </div>
      <div className="w-full flex justify-center gap-24">
        <SendMoney />
        <TopUp />
      </div>
    </div>
  );
};

export default Disbursement;
