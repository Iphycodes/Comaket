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
import { WalletNamespace } from '@grc/_shared/namespace/wallet';
import { Col, Row } from 'antd';

interface balanceProps {
  availableAmount: number;
  withdrawableAmount: number;
}

interface transactionProps {
  transactionAnalyticsData: Record<string, any>[];
  balance: balanceProps;
  wallet: WalletNamespace.Wallet | null;
  transactionsData: Record<string, any>[];
}

const Transactions = ({
  transactionAnalyticsData,
  balance,
  wallet,
  transactionsData,
}: transactionProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<TransactionsDataType>({});
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [transactionDrawerOpen, setTransactionDrawerOpen] = useState<boolean>(false);

  const walletDetails = `${wallet?.accountName} | ${wallet?.accountNumber} | ${wallet?.bankName}`;

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
    if (key === 'totalTransactions') {
      color = 'skyblue';
    } else if (key === 'totalSuccessfulTransactions') {
      color = 'green';
    } else if (key === 'totalPendingTransactions') {
      color = 'orange';
    } else if (key === 'totalFailedTransactions') {
      color = 'red';
    } else {
      color = 'green';
    }

    return color;
  };

  return (
    <div className="w-full flex flex-col gap-5">
      <Row gutter={[10, 10]}>
        <Col md={8} lg={8} xs={24}>
          {' '}
          <BalanceCard
            availableBalance={balance?.availableAmount ?? 0}
            walletDetails={walletDetails}
          />
        </Col>
        {(transactionAnalyticsData ?? []).map((transactionAnalyticsItem, idx) => {
          return (
            <Col key={idx} md={4} lg={4} xs={12}>
              <TransactionStatisticsCard
                key={`${idx}`}
                style={{ flex: 2 }}
                color={getAnalyticColor(transactionAnalyticsItem?.label)}
                title={camelCaseToSentence(transactionAnalyticsItem?.label)}
                percentage={transactionAnalyticsItem?.percent}
                value={transactionAnalyticsItem?.value}
              />
            </Col>
          );
        })}
      </Row>
      <div className="w-full flex gap-3 items-center justify-end">
        <TopBar handleDrawerToggle={() => handleDrawerToggle(true)} />
      </div>
      <TransactionsTable
        handleRowClick={handleRowClick}
        setTransactionDrawerOpen={() => handleTransactionDrawerOpen(true)}
        setSelectedRecord={setSelectedRecord}
        transactionsData={transactionsData}
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
      {/* {JSON.stringify(transactionsData)} */}
    </div>
  );
};

export default Transactions;
