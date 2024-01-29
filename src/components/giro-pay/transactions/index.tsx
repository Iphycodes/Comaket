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

interface transactionProps {
  transactionAnalyticsData: Record<string, any>[];
}

const Transactions = ({ transactionAnalyticsData }: transactionProps) => {
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
    console.log('transaction Dataaaaaaaaaaaaaaaaaaa:::::::', transactionAnalyticsData);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleTransactionDrawerOpen = (toggle: boolean) => {
    setTransactionDrawerOpen(toggle);
  };

  function camelCaseToSentence(camelCaseString: string) {
    const words = camelCaseString.split(/(?=[A-Z])/);
    const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    const sentence = capitalizedWords.join(' ');
    return sentence;
  }

  const getAnalyticColor = (key: string) => {
    let color = '';
    if (key === 'totalDisbursements') {
      color = 'skyblue';
    } else if (key === 'totalSuccessfulDisbursements') {
      color = 'green';
    } else if (key === 'totalPendingDisbursements') {
      color = 'orange';
    } else if (key === 'totalFailedDisbursements') {
      color = 'red';
    } else {
      color = 'green';
    }
    // switch (key) {
    //   case 'totalDisbursements':
    //     color = 'skyblue';
    //     break;
    //   case 'totalSuccessfulDisbursements':
    //     color = 'green';
    //     break;
    //   case 'totalPendingDisbursements':
    //     color = 'orange';
    //     break;
    //   case 'totalFailedDisbursements':
    //     color = 'red';
    //     break;
    //   default:
    //     color = 'green';
    // }

    return color;
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <div className="w-full flex gap-5">
        <div style={{ flex: 3 }}>
          {' '}
          <BalanceCard />
        </div>
        {transactionAnalyticsData?.map((transactionAnalyticsItem, idx) => {
          return (
            <TransactionStatisticsCard
              key={`${idx}`}
              style={{ flex: 2 }}
              color={getAnalyticColor(transactionAnalyticsItem?.label)}
              title={camelCaseToSentence(transactionAnalyticsItem?.label)}
              percentage={transactionAnalyticsItem?.percent}
              value={transactionAnalyticsItem?.value}
            />
          );
        })}
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
