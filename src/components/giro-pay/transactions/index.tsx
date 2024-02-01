'use client';
import TransactionsTable from './libs/transactions-table';
import BalanceCard from './libs/balance-card';
import { Dispatch, SetStateAction, useState } from 'react';
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
  filter: { filterData: Record<string, any> };
  setFilter: Dispatch<SetStateAction<{ filterData: Record<string, any> }>> | any;
  setSearchValue: Dispatch<SetStateAction<string>>;
  isLoadingTransactions: boolean;
  handleSendMail: () => void;
}

const Transactions = ({
  transactionAnalyticsData,
  balance,
  wallet,
  transactionsData,
  filter,
  setFilter,
  setSearchValue,
  isLoadingTransactions,
  handleSendMail,
}: transactionProps) => {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<Record<string, any>>({});
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const [transactionDrawerOpen, setTransactionDrawerOpen] = useState<boolean>(false);

  const walletDetails = `${wallet?.accountName} | ${wallet?.accountNumber} | ${wallet?.bankName}`;

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
        <Col md={9} lg={9} xs={24}>
          {' '}
          <BalanceCard
            availableBalance={balance?.availableAmount ?? 0}
            walletDetails={walletDetails}
          />
        </Col>
        {(transactionAnalyticsData ?? []).map((transactionAnalyticsItem, idx) => {
          return (
            <>
              {transactionAnalyticsItem?.label !== 'totalDisbursements' &&
                transactionAnalyticsItem?.label !== 'totalTransactions' && (
                  <Col key={idx} md={5} lg={5} xs={12}>
                    <TransactionStatisticsCard
                      key={`${idx}`}
                      style={{ flex: 2 }}
                      color={getAnalyticColor(transactionAnalyticsItem?.label)}
                      title={camelCaseToSentence(transactionAnalyticsItem?.label)}
                      percentage={transactionAnalyticsItem?.percent}
                      value={transactionAnalyticsItem?.value}
                    />
                  </Col>
                )}
            </>
          );
        })}
      </Row>
      <div className="w-full flex gap-3 items-center justify-end">
        <TopBar
          setSearchValue={setSearchValue}
          handleDrawerToggle={() => handleDrawerToggle(true)}
        />
      </div>
      <TransactionsTable
        handleSendMail={handleSendMail}
        isLoadingTransactions={isLoadingTransactions}
        handleRowClick={handleRowClick}
        setTransactionDrawerOpen={() => handleTransactionDrawerOpen(true)}
        setSelectedRecord={setSelectedRecord}
        transactionsData={transactionsData}
        filter={filter}
      />
      <TransactionModal
        isModalOpen={isModalOpen}
        handleCancel={handleCancel}
        transactionItem={selectedRecord}
      />
      <FilterDrawer
        advancedFilter={filter}
        setAdvancedFilter={setFilter}
        open={drawerOpen}
        onClose={() => handleDrawerToggle(false)}
      />
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
