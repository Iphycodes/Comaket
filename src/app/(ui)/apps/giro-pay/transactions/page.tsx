'use client';

import Transactions from '@grc/components/giro-pay/transactions';
import { useTransaction } from '@grc/hooks/useTransaction';
import React, { useEffect } from 'react';

const TransactionPage = () => {
  const { transactionAnalyticsData } = useTransaction({ callAllTransaction: true });

  useEffect(() => {
    console.log('transactionDataaaaaaaaaaaaaaaa:::', transactionAnalyticsData);
  }, [transactionAnalyticsData]);

  return <Transactions transactionAnalyticsData={transactionAnalyticsData} />;
};

export default TransactionPage;
