'use client';
import TransactionsTable from './libs/transactions-table';
import BalanceCard from './libs/balance-card';
import { useState } from 'react';
import { TransactionsDataType } from './libs/transactions-table/libs/transactions-data';
import TransactionModal from './libs/transactionModal';
import TopBar from './libs/top-bar';

const Transactions = () => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<TransactionsDataType>({});

  const handleRowClick = (record: any) => {
    setIsModalOpen(true);
    setSelectedRecord(record);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="w-full flex flex-col gap-5">
      <BalanceCard />
      <div className="w-full flex items-center justify-end">
        <div className="">
          <TopBar />
        </div>
      </div>
      <TransactionsTable handleRowClick={handleRowClick} />
      <TransactionModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        transactionItem={selectedRecord}
      />
    </div>
  );
};

export default Transactions;
