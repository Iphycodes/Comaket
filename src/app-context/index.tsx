'use client';
import { createContext, ReactNode } from 'react';
import { IUseTheme } from '@grc/hooks/useTheme';
import { useAppDispatch } from '@grc/redux/store';
import { logout } from '@grc/redux/slices/auth';
import { useAuth } from '@grc/hooks/useAuth';
import { AuthDataType } from '@grc/_shared/namespace/auth';

type AppProviderPropType = {
  children: ReactNode;
};

interface AppContextPropType extends IUseTheme {
  handleLogOut: () => void;
  authData: AuthDataType | null;
}

export const AppContext = createContext<AppContextPropType>({
  handleLogOut: () => {},
  onChangeTheme: () => {},
  theme: '',
  authData: null,
});

export const AppProvider = (props: AppProviderPropType) => {
  const { children } = props;
  const { authData } = useAuth({});
  // const {} = useTheme();
  const dispatch = useAppDispatch();
  const handleLogOut = () => dispatch(logout());

  const values: any = {
    // theme,
    // onChangeTheme,
    handleLogOut,
    authData,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
