'use client';
import TransactionsTable from './libs/transactions-table';
import BalanceCard from './libs/balance-card';
import { useState } from 'react';
import { TransactionsDataType } from './libs/transactions-table/libs/transactions-data';
import TransactionModal from './libs/transactionModal';
import TopBar from './libs/top-bar';
import FilterDrawer from './libs/filter-drawer';
import AdvancedTransactionDrawer from './libs/advanced-transaction-drawer';
import TransactionStatisticsCard from '../disbursement/libs/transaction-statistics-card';

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<TransactionsDataType>({});
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [transactionDrawerOpen, setTransactionDrawerOpen] = useState<boolean>(false);

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

  const handleTransactionDrawerOpen = (toggle: boolean) => {
    setTransactionDrawerOpen(toggle);
  };
  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex gap-5">
        <div style={{ flex: 3 }}>
          {' '}
          <BalanceCard />
        </div>
        <TransactionStatisticsCard
          style={{ flex: 2 }}
          color={'green'}
          title={'Total Successful Disbursements'}
          percentage={50}
          value={'\u20A650000'}
        />
        <TransactionStatisticsCard
          style={{ flex: 2 }}
          color={'yellow'}
          title={'Total Pending Disbursements'}
          percentage={30}
          value={'\u20A620000'}
        />
        <TransactionStatisticsCard
          style={{ flex: 2 }}
          color={'red'}
          title={'Total Failed Disbursements'}
          percentage={20}
          value={'\u20A65000'}
        />{' '}
      </div>
      <div className="w-full flex gap-3 items-center justify-end">
        <TopBar handleDrawerToggle={() => handleDrawerToggle(true)} />
      </div>
      <TransactionsTable
        handleRowClick={handleRowClick}
        setTransactionDrawerOpen={() => handleTransactionDrawerOpen(true)}
        setSelectedRecord={setSelectedRecord}
      />
      <TransactionModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        transactionItem={selectedRecord}
      />
      <FilterDrawer open={drawerOpen} onClose={() => handleDrawerToggle(false)} />
      <AdvancedTransactionDrawer
        selectedRecord={selectedRecord}
        open={transactionDrawerOpen}
        onClose={() => handleTransactionDrawerOpen(false)}
      />
    </div>
  );
};

export default Transactions;
