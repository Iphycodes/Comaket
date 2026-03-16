import { createSlice } from '@reduxjs/toolkit';
import { authApi } from '@grc/services/auth';
import { AppCookie } from '@grc/_shared/helpers';
// import { AuthDataType } from '@grc/_shared/namespace/auth';
import { persistor } from '@grc/redux/store';
import { usersApi } from '@grc/services/users';

export const initialState = {
  authData: null,
  sessionToken: null,
  isAuthenticated: false,
} as {
  authData: Record<string, any> | null;
  sessionToken: string | null;
  isAuthenticated: boolean;
};

const AUTH_KEY = 'auth';

export const authSlice = createSlice({
  name: AUTH_KEY,
  initialState,
  reducers: {
    logout: () => {
      console.log('logged out 1::::');
      return initialState;
    },
    setAuthData: (state, { payload }) => {
      return {
        ...state,
        currentAccount: payload,
      };
    },
  },

  extraReducers: (builder) => {
    builder.addMatcher(authApi.endpoints.signIn.matchFulfilled, (state, action) => {
      state.authData = action.payload.meta?.token ? action.payload.data : null;
      state.sessionToken = action.payload.meta?.token ?? null;
      state.isAuthenticated = action.payload.meta?.token ? true : false;
    });
    builder.addMatcher(authApi.endpoints.googleAuth.matchFulfilled, (state, action) => {
      state.authData = action.payload.meta?.token ? action.payload.data : null;
      state.sessionToken = action.payload.meta?.token ?? null;
      state.isAuthenticated = action.payload.meta?.token ? true : false;
    });
    builder.addMatcher(authApi.endpoints.signUp.matchFulfilled, (state) => {
      // Signup does NOT authenticate — user must verify email first
      state.authData = null;
      state.sessionToken = null;
      state.isAuthenticated = false;
    });
    builder.addMatcher(authApi.endpoints.verifyOtp.matchFulfilled, (state, action) => {
      state.authData = action.payload.meta?.token ? action.payload.data : null;
      state.sessionToken = action.payload.meta?.token ?? null;
      state.isAuthenticated = action.payload.meta?.token ? true : false;
    });
    builder.addMatcher(usersApi.endpoints.getUserProfile.matchFulfilled, (state, action) => {
      state.authData = action.payload.data;
    });
    builder.addMatcher(authApi.endpoints.logout.matchFulfilled, () => {
      console.log('logged out 2::::');

      return initialState;
    });
  },
});

export const logoutMiddleware = (store: any) => (next: any) => async (action: any) => {
  if (authSlice.actions.logout.match(action)) {
    console.log('store::', store);
    console.log('logged out 3::::');
    AppCookie({});
    await persistor.purge();
    window.location.reload();
  }
  return next(action);
};

export const { logout, setAuthData } = authSlice.actions;

export default authSlice.reducer;
