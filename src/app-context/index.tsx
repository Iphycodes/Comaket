'use client';
import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from 'react';
import { useAppDispatch } from '@grc/redux/store';
import { logout } from '@grc/redux/slices/auth';
import { useAuth } from '@grc/hooks/useAuth';
import { AuthDataType } from '@grc/_shared/namespace/auth';
import { AccountNamespace } from '@grc/_shared/namespace/account';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

type AppProviderPropType = {
  children: ReactNode;
};

interface AppContextPropType {
  handleLogOut: () => void;
  authData: AuthDataType | null;
  currentAccount: AccountNamespace.Account | null;
  isLiveMode: boolean;
  accounts: Array<AccountNamespace.Account | null>;
  toggleSider: boolean;
  setToggleSider: Dispatch<SetStateAction<boolean>>;
  payoutDetails: Record<string, any>;
  setPayoutdetails: Dispatch<SetStateAction<Record<string, any>>>;
  selectedDashboardTransaction: Record<string, any>;
  setSelectedDashboardTransaction: Dispatch<SetStateAction<Record<string, any>>>;
}

export const AppContext = createContext<AppContextPropType>({
  handleLogOut: () => {},
  authData: null,
  currentAccount: null,
  isLiveMode: false,
  accounts: [],
  toggleSider: false,
  setToggleSider: () => {},
  payoutDetails: {},
  setPayoutdetails: () => {},
  selectedDashboardTransaction: {},
  setSelectedDashboardTransaction: () => {},
});

export const AppProvider = (props: AppProviderPropType) => {
  const { children } = props;
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { authData, currentAccount, isLiveMode, accounts } = useAuth({});
  const dispatch = useAppDispatch();
  const handleLogOut = () => dispatch(logout());
  const [toggleSider, setToggleSider] = useState(false);
  const [payoutDetails, setPayoutdetails] = useState({});
  const [selectedDashboardTransaction, setSelectedDashboardTransaction] = useState({});

  useEffect(() => {
    isMobile && setToggleSider(true);
  }, [isMobile]);

  const values: any = {
    isLiveMode,
    handleLogOut,
    authData,
    currentAccount,
    accounts,
    setToggleSider,
    toggleSider,
    payoutDetails,
    setPayoutdetails,
    selectedDashboardTransaction,
    setSelectedDashboardTransaction,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
