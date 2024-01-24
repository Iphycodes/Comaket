import { Space } from 'antd';
import { Wallet as WalletIcon } from '@grc/_shared/assets/svgs';

const BalanceCard = () => {
  return (
    <div className="border shadow-sm dark:bg-zinc-800 rounded-xl dark:border-gray-500 p-5 w-full">
      <div className="flex flex-col-reverse gap-5">
        <div className="border p-2 px-2 text-blue font-semibold border-blue dark:text-gray-100 bg-cyan-50 dark:bg-gray-800 rounded-lg shadow-sm">
          Ifeanyi Emmanuel | 0065453363 | Demo
        </div>
        <div className="flex flex-col gap-2">
          <Space size={5}>
            <WalletIcon />
            <span>Account Balance :</span>
          </Space>
          <div className="text-4xl font-bold">&#x20A6;25,000.00</div>
          <div className="font-thin">Total Balance from all accounts</div>
        </div>
      </div>
    </div>
  );
};

export default BalanceCard;
