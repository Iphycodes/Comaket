import { Select, Space } from 'antd';
import { Wallet as WalletIcon } from '@grc/_shared/assets/svgs';

const BalanceCard = () => {
  return (
    <div className="flex">
      <div className="flex flex-col-reverse border gap-5 p-5 shadow-sm">
        <div className="flex flex-col gap-2">
          <Space size={5}>
            <WalletIcon />
            <span>Giro Balance :</span>
          </Space>
          <div className="text-4xl font-bold">&#x20A6;25,000.00</div>
          <div className="font-thin">Total Balance from all accounts</div>
        </div>
        <div className="flex flex-col">
          <Select
            size="large"
            className="w-[300px] font-normal virtual-account-select"
            placeholder="Select a virtual account"
          />
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
