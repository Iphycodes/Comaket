'use client';
import { formatNumber } from '@grc/_shared/helpers';
import SelectVirtualAcct from '@grc/components/giro-debit/dashboard/libs/select-virtual-acct';
import { Button, Card } from 'antd';
import { Fragment } from 'react';

const TopUp = () => {
  return (
    <Card className="w-full shadow-sm shadow-gray-100">
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-4" style={{ flex: 1 }}>
          <SelectVirtualAcct
            isLoadingAccounts={false}
            vAccount={{} as any}
            accounts={[
              { accountName: 'john doe', accountNumber: '00000', bankName: 'demo' } as any,
            ]}
            setVAccount={() => {}}
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
        <div style={{ flex: 1 }} className="flex items-center justify-center">
          <Fragment>
            <div className="h-48 w-48 rounded-lg shadow-sm hover:border shadow-gray-300 relative px-3 text-center flex justify-center items-center">
              <div className="flex flex-col justify-center items-center font-semibold gap-4">
                <span
                  className={`w-[70px] h-[70px] p-4 rounded-full border-4 flex items-center justify-center`}
                >
                  {formatNumber(100000, 0)}
                </span>
                <span>Overall Deposit this month</span>
              </div>
            </div>
          </Fragment>
        </div>
      </div>
    </Card>
  );
};

export default TopUp;
