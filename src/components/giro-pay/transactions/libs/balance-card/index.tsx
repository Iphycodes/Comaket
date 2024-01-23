import { Card, Space } from 'antd';
import { Wallet as WalletIcon } from '@grc/_shared/assets/svgs';

const BalanceCard = () => {
  return (
    <Card className="border shadow-sm shadow-gray-200 w-full">
      <div className="flex flex-col gap-5">
        {/* <SelectVirtualAcct
          isLoadingAccounts={false}
          vAccount={{} as any}
          accounts={[{ accountName: 'john doe', accountNumber: '00000', bankName: 'demo' } as any]}
          setVAccount={() => {}}
          className="font-bold"
        /> */}
        <div className="border p-3 px-2 text-blue font-semibold border-blue dark:text-gray-100 bg-cyan-50 dark:bg-gray-800 rounded-lg shadow-sm">
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
    </Card>
  );
};

export default BalanceCard;
