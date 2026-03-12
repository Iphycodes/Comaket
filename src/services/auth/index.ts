import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { accountTag, userTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface SignInPayload {
  email: string;
  password: string;
}

export interface SignUpPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface VerifyOtpPayload {
  email: string;
  otp: string;
}

export interface ResendOtpPayload {
  email: string;
}

export interface ForgotPasswordPayload {
  email: string;
}

export interface ResetPasswordPayload {
  token: string;
  newPassword: string;
}

export interface GoogleAuthPayload {
  token: string;
}

export interface AuthResponse {
  meta: {
    success: boolean;
    token?: string;
    error?: {
      message: string;
    };
  };
  data?: Record<string, any>;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const authApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Sign in with email and password
    signIn: builder.mutation<Record<string, any>, { payload: SignInPayload; options: OptionType }>({
      query: ({ payload }) => ({
        url: `/auth/login`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [accountTag, userTag],
    }),

    // Sign up with email and password
    signUp: builder.mutation<Record<string, any>, { payload: SignUpPayload; options: OptionType }>({
      query: ({ payload }) => ({
        url: `/auth/register`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [accountTag],
    }),

    // Verify email with OTP
    verifyOtp: builder.mutation<
      Record<string, any>,
      { payload: VerifyOtpPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/auth/verify-email`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [accountTag, userTag],
    }),

    // Resend verification OTP
    resendOtp: builder.mutation<
      Record<string, any>,
      { payload: ResendOtpPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/auth/resend-verification`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Forgot password
    forgotPassword: builder.mutation<
      Record<string, any>,
      { payload: ForgotPasswordPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/auth/forgot-password`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Reset password with token
    resetPassword: builder.mutation<
      Record<string, any>,
      { payload: ResetPasswordPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/auth/reset-password`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Google authentication
    googleAuth: builder.mutation<
      Record<string, any>,
      { payload: GoogleAuthPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/auth/google`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [accountTag],
    }),

    // Logout
    logout: builder.mutation<Record<string, any>, { options: OptionType }>({
      query: () => ({
        url: `/auth/logout`,
        method: 'POST',
        body: {},
      }),
    }),
  }),
});

export const {
  useSignInMutation,
  useSignUpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGoogleAuthMutation,
  useLogoutMutation,
} = authApi;
