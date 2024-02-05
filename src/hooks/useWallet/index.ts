import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useEffect, useContext } from 'react';
import {
  useCreateWalletMutation,
  useLazyGetBalanceQuery,
  useLazyGetTotalBalanceQuery,
  useLazyGetAccountTransactionQuery,
  useLazyGetWalletsQuery,
  useGetBankDetailsMutation,
  useLazyGetBanksQuery,
  useSinglePayoutMutation,
  useLazyMailTransactionQuery,
  useBatchPayoutMutation,
} from '@grc/services/wallet';
import { message } from 'antd';
import { AppContext } from '@grc/app-context';
import { useAppDispatch, useAppSelector } from '@grc/redux/store';
import {
  selectWalletTransactionData,
  selectBalanceData,
  selectBanksData,
  selectTotalBalanceData,
  selectWalletData,
} from '@grc/redux/selectors/wallet';
import { usePagination } from '@grc/hooks/usePagination/index';
import { Pagination } from '@grc/_shared/namespace';
import { WalletNamespace, IBanks } from '@grc/_shared/namespace/wallet';
import { isEmpty } from 'lodash';
import { setWallet } from '@grc/redux/slices/auth';

interface useWalletProps {
  key?: string;
  callAllWallets?: boolean;
  callAccountTransaction?: boolean;
  callTotalBalance?: boolean;
  callBalance?: boolean;
  callBanks?: boolean;
  filter?: Record<string, any>;
  searchValue?: string;
}

interface useWalletReturnProps {
  createWallet: MutationTrigger<any>;
  validateBankDetails: MutationTrigger<any>;
  createWalletResponse: Record<string, any>;
  walletsResponse: Record<string, any>;
  accountTransactionResponse: Record<string, any>;
  totalBalanceResponse: Record<string, any>;
  balanceResponse: Record<string, any>;
  pagination: Pagination;
  wallets: WalletNamespace.Wallet[];
  transactions: WalletNamespace.Wallet[];
  allTotalBalance: Record<string, any> | undefined;
  balance: { availableAmount: number; withdrawableAmount: number };
  bankDetailsResponse: Record<string, any>;
  banksResponse: Record<string, any>;
  singlePayout: MutationTrigger<any>;
  singlePayoutResponse: Record<string, any>;
  batchPayout: MutationTrigger<any>;
  batchPayoutResponse: Record<string, any>;
  banks: IBanks[];
  handleWallets: (wallet: WalletNamespace.Wallet | null) => void;
  wallet: WalletNamespace.Wallet | null;
  handleSendMail: () => void;
  mailTransactionResponse: Record<string, any>;
  contextHolder: any;
  handleCallBalance: () => void;
}

export const useWallet = ({
  callAllWallets,
  callAccountTransaction,
  callTotalBalance,
  callBalance,
  callBanks,
  filter,
  searchValue,
}: useWalletProps): useWalletReturnProps => {
  const { paginate } = usePagination({ key: 'getWallets' });
  const dispatch = useAppDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const { authData } = useContext(AppContext);
  const { paginate: paginateTransaction, pagination: transactionPagination } = usePagination({
    key: 'getWalletTransaction',
  });
  const [createWallet, createWalletResponse] = useCreateWalletMutation();
  const [triggerGetWallets, walletsResponse] = useLazyGetWalletsQuery();
  const [triggerAccountTransaction, accountTransactionResponse] =
    useLazyGetAccountTransactionQuery();
  const [triggerTotalBalance, totalBalanceResponse] = useLazyGetTotalBalanceQuery();
  const [triggerMailTransaction, mailTransactionResponse] = useLazyMailTransactionQuery();

  const [triggerBalance, balanceResponse] = useLazyGetBalanceQuery();
  const [triggerBanks, banksResponse] = useLazyGetBanksQuery();
  const [validateBankDetails, bankDetailsResponse] = useGetBankDetailsMutation();
  const [singlePayout, singlePayoutResponse] = useSinglePayoutMutation();
  const [batchPayout, batchPayoutResponse] = useBatchPayoutMutation();

  const params = { ...paginate };

  const wallets = useAppSelector((state) => selectWalletData(state, params));
  const allTotalBalance = useAppSelector((state) => selectTotalBalanceData(state, {}));
  const banks = useAppSelector((state) => selectBanksData(state, {}));
  const { wallet } = useAppSelector((state) => state.auth);
  const walletId = wallet?._id;

  const transParams: Record<string, any> = {
    ...paginateTransaction,
    ...filter?.filterData,
    amount: filter?.filterData?.amount ? filter?.filterData?.amount * 100 : undefined,
    virtualAccount: walletId,
    search: searchValue,
  };

  const transactions = useAppSelector((state) => selectWalletTransactionData(state, transParams));
  const balance = useAppSelector((state) => selectBalanceData(state, { id: walletId }));

  const handleWallets = (wallet: WalletNamespace.Wallet | null) => {
    dispatch(setWallet(wallet));
  };
  const mailParams = {
    ...filter?.filterData,
    amount: filter?.filterData?.amount ? filter?.filterData?.amount * 100 : undefined,
    wallet: walletId,
  };

  const handleSendMail = () => {
    triggerMailTransaction(mailParams).then(() => {
      {
        contextHolder;
      }
      messageApi.open({
        type: 'success',
        content: `Sent to ${authData?.email} successfully`,
      });
    });
  };
  useEffect(() => {
    if (callAllWallets) triggerGetWallets(params);
  }, [callAllWallets]);

  useEffect(() => {
    if (!isEmpty(walletId) && callAccountTransaction) triggerAccountTransaction(transParams);
  }, [callAccountTransaction, walletId, JSON.stringify(transParams)]);

  useEffect(() => {
    if (callTotalBalance) triggerTotalBalance({});
  }, [callTotalBalance]);

  useEffect(() => {
    if (callBanks) triggerBanks({});
  }, [callBanks]);

  useEffect(() => {
    if (!isEmpty(walletId) && callBalance) triggerBalance({ id: walletId });
  }, [callBalance, walletId]);

  const handleCallBalance = () => {
    if (!isEmpty(walletId)) {
      triggerBalance({ id: walletId });
    }
  };
  return {
    createWallet,
    createWalletResponse,
    walletsResponse,
    accountTransactionResponse,
    totalBalanceResponse,
    balanceResponse,
    pagination: transactionPagination,
    wallets,
    allTotalBalance,
    transactions,
    balance: balance,
    bankDetailsResponse,
    validateBankDetails,
    banksResponse,
    banks,
    singlePayout,
    singlePayoutResponse,
    handleWallets,
    wallet: wallet,
    handleSendMail,
    mailTransactionResponse,
    contextHolder,
    handleCallBalance,
    batchPayout,
    batchPayoutResponse,
  };
};
