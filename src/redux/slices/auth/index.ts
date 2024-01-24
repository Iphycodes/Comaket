import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '@grc/services/auth';
import { AppCookie } from '@grc/_shared/helpers';
import { AuthDataType } from '@grc/_shared/namespace/auth';
import { persistor } from '@grc/redux/store';
import { WalletNamespace } from '@grc/_shared/namespace/wallet';
import { AccountNamespace } from '@grc/_shared/namespace/account';

export const initialState = {
  authData: null,
  sessionToken: null,
  currentAccount: null,
  wallet: null,
  isLiveMode: false,
} as {
  authData: AuthDataType | null;
  sessionToken: string | null;
  currentAccount: AccountNamespace.Account | null;
  wallet: WalletNamespace.Wallet | null;
  isLiveMode: boolean;
};

const AUTH_KEY = 'auth';

export const authSlice = createSlice({
  name: AUTH_KEY,
  initialState,
  reducers: {
    logout: () => {
      return initialState;
    },
    setCurrentAccount: (state, { payload }) => {
      return {
        ...state,
        currentAccount: payload,
      };
    },

    setWallet: (state, { payload }) => {
      return {
        ...state,
        wallet: payload,
      };
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.login.matchFulfilled, (state, action) => {
      state.authData = action.payload.data;
      state.sessionToken = action.payload.meta?.token;
    });
    builder.addMatcher(authApi.endpoints.register.matchFulfilled, (state, action) => {
      state.authData = action.payload.data;
      state.sessionToken = action.payload.meta?.token;
    });
    builder.addMatcher(authApi.endpoints.getLoggedInUser.matchFulfilled, (state, action) => {
      state.authData = action.payload.data;
      state.isLiveMode = action.payload.data?.currentAccount?.live;
    });
  },
});

export const logoutMiddleware = (store: any) => (next: any) => async (action: any) => {
  if (authSlice.actions.logout.match(action)) {
    console.log('store::', store);
    AppCookie({});
    await persistor.purge();
    window.location.reload();
  }
  return next(action);
};

export const { logout, setCurrentAccount, setWallet } = authSlice.actions;

export default authSlice.reducer;
