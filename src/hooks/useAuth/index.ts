import { useAppDispatch, useAppSelector } from '@grc/redux/store';
import { logout, setCurrentAccount } from '@grc/redux/slices/auth';
import {
  useForgotPasswordMutation,
  useLazyGetAccountsQuery,
  useLazyGetAppQuery,
  useLazyGetConstantsQuery,
  useLazyGetLoggedInUserQuery,
  useLoginMutation,
  useRegisterMutation,
  useResetPasswordMutation,
  useSendVerificationMutation,
  useUpdateLoggedInUserMutation,
  useVerifyEmailMutation,
} from '@grc/services/auth';
import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import Cookies from 'js-cookie';
import { AUTH_TOKEN_KEY } from '@grc/_shared/constant';
import type { AuthDataType } from '@grc/_shared/namespace/auth';
import { useEffect } from 'react';
import { selectAppData, selectAccountData, selectConstants } from '@grc/redux/selectors/auth';
import { AppDataType } from '@grc/_shared/namespace/auth';
import { AccountNamespace } from '@grc/_shared/namespace/account';

type Account = AccountNamespace.Account;

interface useAuthProps {
  key?: string;
  callAccounts?: boolean;
  callApp?: boolean;
  callConstants?: boolean;
  callCurrentAccount?: boolean;
  callUser?: boolean;
}

interface UseAuthReturnType {
  register: MutationTrigger<any>;
  login: MutationTrigger<any>;
  verifyEmail: MutationTrigger<any>;
  forgotPassword: MutationTrigger<any>;
  sendVerification: MutationTrigger<any>;
  resetPassword: MutationTrigger<any>;
  updateUser: MutationTrigger<any>;
  loginResponse: Record<string, any>;
  updateUserResponse: Record<string, any>;
  registerResponse: Record<string, any>;
  verifyEmailResponse: Record<string, any>;
  forgotPasswordResponse: Record<string, any>;
  sendVerificationResponse: Record<string, any>;
  resetPasswordResponse: Record<string, any>;
  sessionToken: string | undefined;
  handleLogOut: () => void;
  authData: AuthDataType | null;
  appData: AppDataType;
  categories: Record<string, any>[];
  constantsResponse: Record<string, any>;
  isLiveMode: boolean;
  handleCurrentAccount: (currentAccount: string) => void;
  currentAccount: Account | any;
  triggerAcccountsResponse: Record<string, any>;
  accounts: Array<Account | null>;
}

export const useAuth = ({
  callAccounts = false,
  callApp = false,
  callConstants = false,
  callUser = false,
}: useAuthProps): UseAuthReturnType => {
  const dispatch = useAppDispatch();

  const params = {
    population: JSON.stringify(['auth', 'settings', 'accounts', 'currentAccount', 'userRole']),
  };
  const [register, registerResponse] = useRegisterMutation();
  const [login, loginResponse] = useLoginMutation();
  const [triggerUser] = useLazyGetLoggedInUserQuery();
  const [updateUser, updateUserResponse] = useUpdateLoggedInUserMutation();
  const [verifyEmail, verifyEmailResponse] = useVerifyEmailMutation();
  const [sendVerification, sendVerificationResponse] = useSendVerificationMutation();
  const [forgotPassword, forgotPasswordResponse] = useForgotPasswordMutation();
  const [resetPassword, resetPasswordResponse] = useResetPasswordMutation();
  const [triggerAccounts, triggerAcccountsResponse] = useLazyGetAccountsQuery();
  const [triggerApp] = useLazyGetAppQuery();
  const [triggerConstants, constantsResponse] = useLazyGetConstantsQuery();
  const { authData, isLiveMode, currentAccount } = useAppSelector((state) => state.auth);
  const accounts = useAppSelector((state) => selectAccountData(state, {}));
  const appData = useAppSelector((state) => selectAppData(state, {}));
  const constants = useAppSelector((state) => selectConstants(state, {}));

  const handleLogOut = () => {
    dispatch(logout());
  };

  const handleCurrentAccount = (currentAccount: Account | string) => {
    const account = currentAccount === 'string' ? JSON.parse(currentAccount) : currentAccount;
    dispatch(setCurrentAccount(account));
  };
  useEffect(() => {
    if (callAccounts) triggerAccounts({});
  }, [callAccounts]);

  useEffect(() => {
    if (callApp) triggerApp({});
  }, [callApp]);

  useEffect(() => {
    if (callConstants) triggerConstants({});
  }, [callConstants]);

  useEffect(() => {
    if (callUser) triggerUser(params);
  }, [callUser]);

  useEffect(() => {
    if (authData?.currentAccount) {
      handleCurrentAccount(authData?.currentAccount);
    }
  }, [authData]);

  const sessionToken: string | undefined = Cookies.get(AUTH_TOKEN_KEY);

  return {
    register,
    login,
    verifyEmail,
    sendVerification,
    resetPassword,
    forgotPassword,
    registerResponse,
    loginResponse,
    verifyEmailResponse,
    sendVerificationResponse,
    resetPasswordResponse,
    forgotPasswordResponse,
    sessionToken,
    handleLogOut,
    authData,
    appData,
    categories: constants?.['businessCategories'],
    constantsResponse,
    updateUser,
    updateUserResponse,
    isLiveMode,
    handleCurrentAccount,
    currentAccount,
    accounts,
    triggerAcccountsResponse,
  };
};
