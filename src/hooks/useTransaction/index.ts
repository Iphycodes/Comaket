import { selectTransactionAnalyticsData } from '@grc/redux/selectors/transaction-analytics';
import { selectAllTransactionsData } from '@grc/redux/selectors/transactions';
import { useAppSelector } from '@grc/redux/store';
import {
  useLazyGetAllTransactionsQuery,
  useLazyGetTransactionAnalyticsQuery,
} from '@grc/services/transactions';
import { useEffect } from 'react';

interface useTransactionProps {
  key?: string;
  callAllTransactions?: boolean;
  callTransactionAnalytics?: boolean;
  callSecreteKey?: boolean;
  filter?: Record<string, any>;
}

interface useTransactionReturnProps {
  transactionAnalyticsData: Record<any, string> | any;
  getTransactionAnalyticsResponse: Record<string, any>;
  transactionsData: Record<any, string> | any;
  getAllTransactionsResponse: Record<string, any>;
}

export const useTransaction = ({
  callTransactionAnalytics,
  callAllTransactions,
}: useTransactionProps): useTransactionReturnProps => {
  const [triggerTransactionAnalytics, getTransactionAnalyticsResponse] =
    useLazyGetTransactionAnalyticsQuery();
  const [triggerAllTransactions, getAllTransactionsResponse] = useLazyGetAllTransactionsQuery();
  const { wallet } = useAppSelector((state) => state.auth);
  const walletId = wallet?.id;

  const params = {
    filter: JSON.stringify({ virtualAccount: walletId }),
  };

  const transactionAnalyticsData = useAppSelector((state) =>
    selectTransactionAnalyticsData(state, params)
  );

  const transactionsData = useAppSelector((state) => selectAllTransactionsData(state, {}));

  useEffect(() => {
    if (callTransactionAnalytics) triggerTransactionAnalytics(params);
  }, [callTransactionAnalytics]);

  useEffect(() => {
    if (callAllTransactions) triggerAllTransactions({});
  }, [callAllTransactions]);

  return {
    transactionAnalyticsData,
    getTransactionAnalyticsResponse,
    transactionsData,
    getAllTransactionsResponse,
  };
};
