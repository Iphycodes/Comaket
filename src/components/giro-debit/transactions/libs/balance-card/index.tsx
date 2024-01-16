import { Card, Space } from 'antd';
import { Wallet as WalletIcon } from '@grc/_shared/assets/svgs';
import SelectVirtualAcct from '@grc/components/giro-debit/dashboard/libs/select-virtual-acct';

const BalanceCard = () => {
  return (
    <Card className="flex flex-col border gap-5 shadow-md w-full">
      <div>
        <SelectVirtualAcct
          isLoadingAccounts={false}
          vAccount={{} as any}
          accounts={[{ accountName: 'john doe', accountNumber: '00000', bankName: 'demo' } as any]}
          setVAccount={() => {}}
          className="font-bold"
        />
      </div>
      <div className="flex flex-col gap-2">
        <Space size={5}>
          <WalletIcon />
          <span>Giro Balance :</span>
        </Space>
        <div className="text-4xl font-bold">&#x20A6;25,000.00</div>
        <div className="font-thin">Total Balance from all accounts</div>
      </div>
    </Card>
  );
};

export default BalanceCard;
