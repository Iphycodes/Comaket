'use client';
import { Button, Space } from 'antd';
import { Wallet as WalletIcon } from '@grc/_shared/assets/svgs';
import TransactionStatisticsCard from './libs/transaction-statistics-card';
import PieChartAnaytics from './libs/pie-chart-analytics';
import SendMoney from './libs/send-money';
import DisbursementHistory from './libs/disbursement-records';
import TopUp from './libs/top-up';

const Disbursement = () => {
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="flex w-full justify-between items-center font-semibold pb-2 border-b-2">
        <div className="flex flex-col gap-1">
          <Space size={5}>
            <WalletIcon />
            <span>Account Balance :</span>
          </Space>
          <div className="text-3xl font-bold">&#x20A6;2,500,000.00</div>
          <div className="font-thin">Total Balance from all accounts</div>
        </div>
        <Button
          className="opacity-100 flex items-center hover:opacity-70 bg-blue text-white rounded-[32px] py-5 px-8"
          type="primary"
          disabled={false}
          loading={false}
          htmlType="submit"
        >
          <div className="flex items-center gap-2">
            <span>
              <i className="ri-add-line text-[20px]"></i>
            </span>
            <span>Top Up Balance</span>
          </div>
        </Button>
      </div>
      <div className="w-full flex flex-col gap-6">
        {/* <SendMoney />
        <TopUp /> */}
        <div className="flex w-full gap-6 justify-between">
          <div className="flex gap-5 justify-between flex-wrap" style={{ flex: 6 }}>
            <TransactionStatisticsCard
              style={{ width: '48%' }}
              color="green"
              title="Total Single Payout"
              percentage={40}
              value={'\u20A6200000'}
            />
            <TransactionStatisticsCard
              style={{ width: '48%' }}
              color="rgb(30 136 229)"
              title="Total Batch Payout"
              percentage={20}
              value={'\u20A6350000'}
            />
            <TransactionStatisticsCard
              style={{ width: '48%' }}
              color="#C9DE00"
              title="Total Pending Payout"
              percentage={29.5}
              value={'\u20A655000'}
            />
            <TransactionStatisticsCard
              style={{ width: '48%' }}
              color="#B21F00"
              title="Total Failed Payout"
              percentage={10.5}
              value={'\u20A616000'}
            />
          </div>
          <div className="flex" style={{ flex: 4 }}>
            <PieChartAnaytics />
          </div>
        </div>
        <div className="flex w-full gap-6 justify-between">
          <div className="flex flex-col gap-4" style={{ flex: 6 }}>
            <SendMoney />
            <TopUp />
          </div>
          <div className="recent-disbursement" style={{ flex: 4 }}>
            <DisbursementHistory />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Disbursement;
