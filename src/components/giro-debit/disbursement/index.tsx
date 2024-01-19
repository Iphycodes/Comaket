'use client';
import { Space } from 'antd';
import { Wallet as WalletIcon } from '@grc/_shared/assets/svgs';
import TransactionStatisticsCard from './libs/transaction-statistics-card';
import PieChartAnaytics from './libs/pie-chart-analytics';
import SendMoney from './libs/send-money';
import DisbursementHistory from './libs/disbursement-records';
import TopUp from './libs/top-up';
import TopButtons from './libs/top-buttons';

const Disbursement = () => {
  const mockPayoutsData = [
    {
      color: 'green',
      title: 'Total Single Payout',
      percentage: 40,
      value: '\u20A6200000',
    },
    {
      color: 'rgb(30 136 229)',
      title: 'Total Batch Payout',
      percentage: 20,
      value: '\u20A6350000',
    },
    {
      color: '#C9DE00',
      title: 'Total Pending Payout',
      percentage: 29.5,
      value: '\u20A655000',
    },
    {
      color: '#B21F00',
      title: 'Total Failed Payout',
      percentage: 29.5,
      value: '\u20A616000',
    },
  ];

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
        <TopButtons />
      </div>
      <div className="w-full flex flex-col gap-6">
        {/* <SendMoney />
        <TopUp /> */}
        <div className="flex w-full gap-6 justify-between">
          <div className="flex fle gap-5 justify-between flex-wrap" style={{ flex: 6 }}>
            {mockPayoutsData.map(({ color, title, percentage, value }, idx) => {
              return (
                <TransactionStatisticsCard
                  key={`${idx}`}
                  style={{ width: '48%' }}
                  color={color}
                  title={title}
                  percentage={percentage}
                  value={value}
                />
              );
            }, [])}
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
