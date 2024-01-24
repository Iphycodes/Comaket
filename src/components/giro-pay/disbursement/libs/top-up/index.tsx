'use client';
import SelectWallet from '@grc/components/giro-pay/dashboard/libs/select-wallet';
import { Button, Card } from 'antd';

const TopUp = () => {
  return (
    <Card className="w-full shadow-sm shadow-gray-100">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-4" style={{ flex: 1 }}>
          <SelectWallet
            isLoadingWallets={false}
            wallets={[{ accountName: 'john doe', accountNumber: '00000', bankName: 'demo' } as any]}
            setWallet={() => {}}
          />
          <Button
            className="opacity-100 hover:opacity-95 mt-1.5 font-normal bg-blue text-white h-12"
            type="primary"
            disabled={false}
            loading={false}
            htmlType="submit"
          >
            Top Up Account
          </Button>
        </div>
        <div className="flex flex-col gap-2 text-center">
          <div className="flex flex-col">
            <span className="font-thin">Account Number</span>
            <span className="font-bold relative text-[24px]">
              <span>0065453363</span>
              {/* <GoCopy size={20} className="absolute right-0 top-0" /> */}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-thin">Account Name</span>
            <span className="font-bold text-[16px]">giro-pay Main Funding</span>
          </div>
          <div className="flex flex-col">
            <span className="font-thin">Bank Name</span>
            <span className="font-bold text-lg">MoniePoint</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default TopUp;
