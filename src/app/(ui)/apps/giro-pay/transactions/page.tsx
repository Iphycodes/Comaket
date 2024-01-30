'use client';

import Transactions from '@grc/components/giro-pay/transactions';
import { useTransaction } from '@grc/hooks/useTransaction';
import { useWallet } from '@grc/hooks/useWallet';
import React, { useEffect } from 'react';

const TransactionPage = () => {
  const { transactionAnalyticsData, transactionsData } = useTransaction({
    callTransactionAnalytics: true,
    callAllTransactions: true,
  });
  const { balance, wallet } = useWallet({ callBalance: true });

  useEffect(() => {
    console.log('transactionDataaaaaaaaaaaaaaaa:::', transactionsData);
  }, [transactionAnalyticsData, transactionsData]);

  return (
    <Transactions
      transactionAnalyticsData={transactionAnalyticsData}
      balance={balance}
      wallet={wallet}
      transactionsData={transactionsData}
    />
  );
};

export default TransactionPage;
