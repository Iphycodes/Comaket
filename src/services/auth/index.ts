import { api } from '@grc/services/api';
import {
  appUrl,
  constantUrl,
  businessUrl,
  forgotPasswordUrl,
  loginUrl,
  POST,
  registerUrl,
  sendVerificationUrl,
  userUrl,
  verifyEmailUrl,
  resetPasswordUrl,
} from '@grc/_shared/constant';
import type {
  authResponseType,
  forgotPasswordRequestType,
  loginRequestType,
  registerRequestType,
  sendVerificationRequestType,
  verifyRequestType,
} from '@grc/_shared/namespace/auth';
import { businessResponseType } from '@grc/_shared/namespace/auth';
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
    business: builder.mutation<businessResponseType, registerRequestType>({
      query: ({ payload }) => {
        return {
          url: businessUrl,
          method: POST,
          body: payload,
        };
      },
    }),
    getBusinesses: builder.query({
      query: () => ({
        url: `${businessUrl}`,
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
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useVerifyEmailMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLazyGetBusinessesQuery,
  useSendVerificationMutation,
  useBusinessMutation,
  useLazyGetAppQuery,
  useLazyGetConstantsQuery,
  useLazyGetLoggedInUserQuery,
  useUpdateLoggedInUserMutation,
  endpoints: { login, getBusinesses, getApp, getConstants },
} = authApi;
