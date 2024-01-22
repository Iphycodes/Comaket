'use client';
import { createContext, ReactNode } from 'react';
import { IUseTheme } from '@grc/hooks/useTheme';
import { useAppDispatch } from '@grc/redux/store';
import { logout } from '@grc/redux/slices/auth';
import { useAuth } from '@grc/hooks/useAuth';
import { AuthDataType } from '@grc/_shared/namespace/auth';
import { AccountNamespace } from '@grc/_shared/namespace/account';

type AppProviderPropType = {
  children: ReactNode;
};

interface AppContextPropType extends IUseTheme {
  handleLogOut: () => void;
  authData: AuthDataType | null;
  currentAccount: AccountNamespace.Account | null;
}

export const AppContext = createContext<AppContextPropType>({
  handleLogOut: () => {},
  onChangeTheme: () => {},
  theme: '',
  authData: null,
  currentAccount: null,
});

export const AppProvider = (props: AppProviderPropType) => {
  const { children } = props;
  const { authData, currentAccount } = useAuth({});
  const dispatch = useAppDispatch();
  const handleLogOut = () => dispatch(logout());

  const values: any = {
    // theme,
    // onChangeTheme,
    handleLogOut,
    authData,
    currentAccount,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
