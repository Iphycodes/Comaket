import { api } from '@grc/services/api';
import {
  appUrl,
  constantUrl,
  accountUrl,
  forgotPasswordUrl,
  loginUrl,
  POST,
  registerUrl,
  sendVerificationUrl,
  userUrl,
  verifyEmailUrl,
  resetPasswordUrl,
  verifyUserUrl,
} from '@grc/_shared/constant';
import type {
  authResponseType,
  forgotPasswordRequestType,
  loginRequestType,
  registerRequestType,
  sendVerificationRequestType,
  verifyRequestType,
} from '@grc/_shared/namespace/auth';
import { accountResponseType } from '@grc/_shared/namespace/auth';
import { updateUserTag } from '@grc/services/tags';

export const authApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<authResponseType, loginRequestType>({
      query: ({ payload }) => {
        return {
          url: loginUrl,
          method: POST,
          body: payload,
        };
      },
    }),
    register: builder.mutation<authResponseType, registerRequestType>({
      query: ({ payload }) => {
        return {
          url: registerUrl,
          method: POST,
          body: payload,
        };
      },
    }),
    account: builder.mutation<accountResponseType, registerRequestType>({
      query: ({ payload }) => {
        return {
          url: accountUrl,
          method: POST,
          body: payload,
        };
      },
    }),
    getAccounts: builder.query({
      query: () => ({
        url: `${accountUrl}`,
      }),
    }),
    verifyEmail: builder.mutation<authResponseType, verifyRequestType>({
      query: ({ payload }) => {
        return {
          url: verifyEmailUrl,
          method: POST,
          body: payload,
        };
      },
    }),
    sendVerification: builder.mutation<authResponseType, sendVerificationRequestType>({
      query: ({ payload }) => {
        return {
          url: sendVerificationUrl,
          method: POST,
          body: payload,
        };
      },
    }),
    forgotPassword: builder.mutation<authResponseType, forgotPasswordRequestType>({
      query: ({ payload }) => {
        return {
          url: forgotPasswordUrl,
          method: POST,
          body: payload,
        };
      },
    }),
    resetPassword: builder.mutation<authResponseType, forgotPasswordRequestType>({
      query: ({ payload }) => {
        return {
          url: resetPasswordUrl,
          method: POST,
          body: payload,
        };
      },
    }),
    getApp: builder.query({
      query: () => ({
        url: `${appUrl}`,
      }),
    }),
    getLoggedInUser: builder.query({
      query: (params) => ({
        url: `${userUrl}`,
        params,
      }),
      providesTags: [updateUserTag],
    }),
    updateLoggedInUser: builder.mutation({
      query: ({ payload }) => {
        return {
          url: userUrl,
          method: POST,
          body: payload,
        };
      },
      invalidatesTags: [updateUserTag],
    }),
    getConstants: builder.query({
      query: () => ({
        url: constantUrl,
      }),
    }),

    verifyUser: builder.mutation({
      query: ({ payload }) => {
        return {
          url: verifyUserUrl,
          method: POST,
          body: payload,
        };
      },
      invalidatesTags: [updateUserTag],
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLazyGetAccountsQuery,
  useSendVerificationMutation,
  useAccountMutation,
  useLazyGetAppQuery,
  useLazyGetConstantsQuery,
  useLazyGetLoggedInUserQuery,
  useUpdateLoggedInUserMutation,
  useVerifyUserMutation,
  endpoints: { login, getAccounts, getApp, getConstants },
} = authApi;
