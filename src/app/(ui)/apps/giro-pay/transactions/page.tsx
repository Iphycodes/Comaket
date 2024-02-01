'use client';

import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { WithLoaderRender } from '@grc/_shared/components/with-app-loder';
import Transactions from '@grc/components/giro-pay/transactions';
import { useTransaction } from '@grc/hooks/useTransaction';
import { useWallet } from '@grc/hooks/useWallet';
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react';

const TransactionPage = () => {
  const [filter, setFilter] = useState<{ filterData: Record<string, any> }>({ filterData: {} });
  const [searchValue, setSearchValue] = useState<string>('');

  const {
    transactionAnalyticsData,
    transactionsData,
    getTransactionAnalyticsResponse,
    getAllTransactionsResponse,
    handleSendMail,
  } = useTransaction({
    callTransactionAnalytics: true,
    callAllTransactions: true,
    searchValue,
    filter: filter,
  });
  const { balance, wallet } = useWallet({ callBalance: true });
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const isTransactionAnalyticsLoading = getTransactionAnalyticsResponse?.isLoading;
  const isTransactionsLoading = getAllTransactionsResponse?.isLoading;
  const { theme } = useTheme();

  useEffect(() => {
    console.log('transactionDataaaaaaaaaaaaaaaa:::', transactionsData);
  }, [transactionAnalyticsData, transactionsData]);

  useEffect(() => {
    console.log('isLoadinggggggggggggg', isTransactionsLoading);
  }, [isTransactionsLoading]);

  return (
    <WithLoaderRender
      loading={isTransactionAnalyticsLoading || isTransactionsLoading}
      mobileResponsive={mobileResponsive}
      theme={theme}
    >
      <Transactions
        handleSendMail={handleSendMail}
        isLoadingTransactions={isTransactionsLoading}
        setFilter={setFilter}
        filter={filter}
        transactionAnalyticsData={transactionAnalyticsData}
        balance={balance}
        wallet={wallet}
        transactionsData={transactionsData}
        setSearchValue={setSearchValue}
      />
    </WithLoaderRender>
  );
};

export default TransactionPage;
