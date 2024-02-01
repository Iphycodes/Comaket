import { useEffect } from 'react';
import { useLazyGetBankAccountsQuery } from '@grc/services/bank-accounts';
import { useAppSelector } from '@grc/redux/store';
import { selectBankAccount } from '@grc/redux/selectors/bank-accounts';
import { WalletNamespace } from '@grc/_shared/namespace/wallet';

interface useBankAccountProps {
  key?: string;
  callAllBankAccount?: boolean;
}

interface useBankAccountReturnProps {
  getBankAccountsResponse: Record<string, any>;
  beneficiaryAccounts: WalletNamespace.Wallet[] | any;
}

export const useBankAccount = ({
  callAllBankAccount,
}: useBankAccountProps): useBankAccountReturnProps => {
  const [triggerBankAccounts, getBankAccountsResponse] = useLazyGetBankAccountsQuery();

  const beneficiaryAccounts = useAppSelector((state) => selectBankAccount(state, {}));

  useEffect(() => {
    if (callAllBankAccount) triggerBankAccounts({});
  }, [callAllBankAccount]);

  return {
    getBankAccountsResponse,
    beneficiaryAccounts: beneficiaryAccounts?.data?.data,
  };
};
