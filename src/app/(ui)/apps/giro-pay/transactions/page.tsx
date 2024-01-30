'use client';

import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { WithLoaderRender } from '@grc/_shared/components/with-app-loder';
import Transactions from '@grc/components/giro-pay/transactions';
import { useTransaction } from '@grc/hooks/useTransaction';
import { useWallet } from '@grc/hooks/useWallet';
import React, { useEffect } from 'react';

const TransactionPage = () => {
  const {
    transactionAnalyticsData,
    transactionsData,
    getTransactionAnalyticsResponse,
    getAllTransactionsResponse,
  } = useTransaction({
    callTransactionAnalytics: true,
    callAllTransactions: true,
  });
  const { balance, wallet } = useWallet({ callBalance: true });
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const isTransactionAnalyticsLoading = getTransactionAnalyticsResponse?.isLoading;
  const isTransactionsLoading = getAllTransactionsResponse?.isLoading;

  useEffect(() => {
    console.log('transactionDataaaaaaaaaaaaaaaa:::', transactionsData);
  }, [transactionAnalyticsData, transactionsData]);

  return (
    <WithLoaderRender
      loading={isTransactionAnalyticsLoading || isTransactionsLoading}
      mobileResponsive={mobileResponsive}
    >
      <Transactions
        transactionAnalyticsData={transactionAnalyticsData}
        balance={balance}
        wallet={wallet}
        transactionsData={transactionsData}
      />
    </WithLoaderRender>
  );
};

export default TransactionPage;
