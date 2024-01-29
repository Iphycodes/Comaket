import { selectTransactionAnalyticsData } from '@grc/redux/selectors/transaction-analytics';
import { useAppSelector } from '@grc/redux/store';
import { useLazyGetTransactionAnalyticsQuery } from '@grc/services/transactions';
import { useEffect } from 'react';

interface useTransactionProps {
  key?: string;
  callAllTransaction?: boolean;
  callSecreteKey?: boolean;
  filter?: Record<string, any>;
}

interface useTransactionReturnProps {
  transactionAnalyticsData: Record<any, string> | any;
  getTransactionAnalyticsResponse: Record<string, any>;
}

export const useTransaction = ({
  callAllTransaction,
}: useTransactionProps): useTransactionReturnProps => {
  const [triggerTransactionAnalytics, getTransactionAnalyticsResponse] =
    useLazyGetTransactionAnalyticsQuery();
  const { wallet } = useAppSelector((state) => state.auth);
  const walletId = wallet?.id;

  const params = {
    filter: JSON.stringify({ virtualAccount: walletId }),
  };

  const transactionAnalyticsData = useAppSelector((state) =>
    selectTransactionAnalyticsData(state, params)
  );

  useEffect(() => {
    if (callAllTransaction) triggerTransactionAnalytics(params);
  }, [callAllTransaction]);

  return {
    transactionAnalyticsData,
    getTransactionAnalyticsResponse,
  };
};
