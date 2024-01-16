'use client';
import TransactionsTable from './libs/transactions-table';
import BalanceCard from './libs/balance-card';
import { useState } from 'react';
import { TransactionsDataType } from './libs/transactions-table/libs/transactions-data';
import TransactionModal from './libs/transactionModal';
import TopBar from './libs/top-bar';
import { Card } from 'antd';
import FilterDrawer from './libs/filter-drawer';

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<TransactionsDataType>({});
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);

  const handleDrawerToggle = (toggle: boolean) => {
    setDrawerOpen(toggle);
  };

  const handleRowClick = (record: any) => {
    setIsModalOpen(true);
    setSelectedRecord(record);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex gap-5">
        <div style={{ flex: 2 }}>
          {' '}
          <BalanceCard />
        </div>
        <Card className="shadow-md" style={{ flex: 1 }}></Card>
        <Card className="flex shadow-md" style={{ flex: 1 }}></Card>
        <Card className="flex shadow-md" style={{ flex: 1 }}></Card>
      </div>
      <div className="w-full flex gap-3 items-center justify-between">
        <div className="border-2 p-3 px-6 font-bold border-blue bg-cyan-50 rounded-3xl shadow-sm">
          Ifeanyi Emmanuel | 0065453363 | Demo
        </div>
        <TopBar handleDrawerToggle={() => handleDrawerToggle(true)} />
      </div>
      <TransactionsTable handleRowClick={handleRowClick} />
      <TransactionModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        transactionItem={selectedRecord}
      />
      <FilterDrawer open={drawerOpen} onClose={() => handleDrawerToggle(false)} />
    </div>
  );
};

export default Transactions;
