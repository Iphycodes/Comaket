'use client';
import { createContext, ReactNode } from 'react';
import { useAppDispatch } from '@grc/redux/store';
import { logout } from '@grc/redux/slices/auth';
import { useAuth } from '@grc/hooks/useAuth';
import { AuthDataType } from '@grc/_shared/namespace/auth';
import { AccountNamespace } from '@grc/_shared/namespace/account';

type AppProviderPropType = {
  children: ReactNode;
};

interface AppContextPropType {
  handleLogOut: () => void;
  authData: AuthDataType | null;
  currentAccount: AccountNamespace.Account | null;
  isLiveMode: boolean;
  accounts: Array<AccountNamespace.Account | null>;
}

export const AppContext = createContext<AppContextPropType>({
  handleLogOut: () => {},
  authData: null,
  currentAccount: null,
  isLiveMode: false,
  accounts: [],
});

export const AppProvider = (props: AppProviderPropType) => {
  const { children } = props;
  const { authData, currentAccount, isLiveMode, accounts } = useAuth({});
  const dispatch = useAppDispatch();
  const handleLogOut = () => dispatch(logout());

  const values: any = {
    isLiveMode,
    handleLogOut,
    authData,
    currentAccount,
    accounts,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
