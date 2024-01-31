import { selectTransactionAnalyticsData } from '@grc/redux/selectors/transaction-analytics';
import { selectAllTransactionsData } from '@grc/redux/selectors/transactions';
import { useAppSelector } from '@grc/redux/store';
import {
  useLazyGetAllTransactionsQuery,
  useLazyGetTransactionAnalyticsQuery,
  useLazyMailTransactionQuery,
} from '@grc/services/transactions';
import { message } from 'antd';
import { useEffect } from 'react';
import { useAuth } from '../useAuth';

interface useTransactionProps {
  key?: string;
  callAllTransactions?: boolean;
  callTransactionAnalytics?: boolean;
  callSecreteKey?: boolean;
  filter?: { filterData: Record<string, any> };
  searchValue?: string;
}

interface useTransactionReturnProps {
  transactionAnalyticsData: Record<any, string> | any;
  getTransactionAnalyticsResponse: Record<string, any>;
  transactionsData: Record<any, string> | any;
  getAllTransactionsResponse: Record<string, any>;
  handleSendMail: () => void;
  mailTransactionsResponse: Record<string, any>;
}

export const useTransaction = ({
  callTransactionAnalytics,
  callAllTransactions,
  filter,
  searchValue,
}: useTransactionProps): useTransactionReturnProps => {
  const [triggerTransactionAnalytics, getTransactionAnalyticsResponse] =
    useLazyGetTransactionAnalyticsQuery();
  const [triggerAllTransactions, getAllTransactionsResponse] = useLazyGetAllTransactionsQuery();
  const [triggerMailTransactions, mailTransactionsResponse] = useLazyMailTransactionQuery();
  const { wallet } = useAppSelector((state) => state.auth);
  const walletId = wallet?.id;
  const { authData } = useAuth({ callUser: true });

  message.config({
    duration: 5,
  });

  const params = {
    filter: JSON.stringify({ virtualAccount: walletId }),
  };

  const transParams = {
    ...filter?.filterData,
    amount: filter?.filterData?.amount ? filter?.filterData?.amount * 100 : undefined,
    search: searchValue !== '' ? searchValue : undefined,
  };

  const mailParams = {
    ...filter?.filterData,
    amount: filter?.filterData?.amount ? filter?.filterData?.amount * 100 : undefined,
  };

  const transactionAnalyticsData = useAppSelector((state) =>
    selectTransactionAnalyticsData(state, params)
  );

  const transactionsData = useAppSelector((state) => selectAllTransactionsData(state, transParams));

  useEffect(() => {
    if (callTransactionAnalytics) triggerTransactionAnalytics(params);
  }, [callTransactionAnalytics]);

  useEffect(() => {
    if (callAllTransactions) triggerAllTransactions(transParams);
  }, [callAllTransactions, JSON.stringify(transParams)]);

  const handleSendMail = () => {
    triggerMailTransactions(mailParams).then(() => {
      // {
      //   contextHolder;
      // }
      message.open({
        type: 'success',
        content: `Transaction details sent ${authData?.email} successfully`,
      });
      // message.success('Sent Successfully');
    });
  };

  return {
    transactionAnalyticsData,
    getTransactionAnalyticsResponse,
    transactionsData,
    getAllTransactionsResponse,
    mailTransactionsResponse,
    handleSendMail,
  };
};
