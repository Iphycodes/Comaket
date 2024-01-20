'use client';
import { Modal, Space } from 'antd';
import { Wallet as WalletIcon } from '@grc/_shared/assets/svgs';
import TransactionStatisticsCard from './libs/transaction-statistics-card';
import PieChartAnaytics from './libs/pie-chart-analytics';
import TopButtons from './libs/top-buttons';
import RecentDisbursements from '@grc/components/giro-pay/disbursement/libs/recent-disbursement-list';
import { useState } from 'react';
import DisbursementDrawer from './libs/disbursement-drawer';
import TopUpBalance from './libs/top-up-balance';
import SinglePayout from './libs/single-payout';
import BatchPayout from './libs/batch-payout';
// import RecentDisbursements from './libs/recent-disbursement-list';

const Disbursement = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<Record<string, any>>({});
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [modalElement, setModalElement] = useState<
    'top-up-balance' | 'single-payout' | 'batch-payout'
  >('top-up-balance');
  const mockPayoutsData = [
    {
      color: 'green',
      title: 'Total Single Payout',
      percentage: 40,
      value: 200000,
    },
    {
      color: 'rgb(30 136 229)',
      title: 'Total Batch Payout',
      percentage: 20,
      value: 350000,
    },
    {
      color: '#C9DE00',
      title: 'Total Pending Payout',
      percentage: 29.5,
      value: 55000,
    },
    {
      color: '#B21F00',
      title: 'Total Failed Payout',
      percentage: 29.5,
      value: 16000,
    },
  ];

  return (
    <>
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
          <TopButtons setModalOpen={setModalOpen} setModalElement={setModalElement} />
        </div>
        <div className="w-full flex flex-col gap-5">
          <div className="flex w-full gap-5 justify-between flex-wrap">
            {mockPayoutsData.map(({ color, title, percentage, value }, idx) => {
              return (
                <TransactionStatisticsCard
                  key={`${idx}`}
                  style={{ flex: 1 }}
                  color={color}
                  title={title}
                  percentage={percentage}
                  value={value}
                />
              );
            }, [])}
          </div>
          <div className="w-full flex gap-5">
            <div className="recent-disbursement" style={{ flex: 6 }}>
              {/* <DisbursementHistory /> */}
              <RecentDisbursements setOpen={setOpen} setSelectedRecord={setSelectedRecord} />
            </div>
            <div className="flex h-96" style={{ flex: 5 }}>
              <PieChartAnaytics />
            </div>
          </div>
        </div>
      </div>
      <DisbursementDrawer open={open} setOpen={setOpen} selectedRecord={selectedRecord} />
      <Modal
        className="disbursement-modal"
        title={``}
        open={modalOpen}
        onCancel={() => setModalOpen(false)}
        footer={null}
      >
        {modalElement === 'top-up-balance' && <TopUpBalance />}
        {modalElement === 'single-payout' && <SinglePayout />}
        {modalElement === 'batch-payout' && <BatchPayout />}
      </Modal>
    </>
  );
};

export default Disbursement;
