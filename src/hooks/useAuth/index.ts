import { logout } from '@grc/redux/slices/auth';
import { useAppDispatch, useAppSelector } from '@grc/redux/store';
import { api } from '@grc/services/api';
import {
  useSignInMutation,
  useSignUpMutation,
  useVerifyOtpMutation,
  useResendOtpMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useGoogleAuthMutation,
  useLogoutMutation,
  SignInPayload,
  SignUpPayload,
  VerifyOtpPayload,
  ResendOtpPayload,
  ForgotPasswordPayload,
  ResetPasswordPayload,
  GoogleAuthPayload,
} from '@grc/services/auth';

interface UseAuthProps {}

export const useAuth = ({}: UseAuthProps = {}) => {
  // API hooks
  const [signIn, signInResponse] = useSignInMutation();
  const [signUp, signUpResponse] = useSignUpMutation();
  const [verifyOtp, verifyOtpResponse] = useVerifyOtpMutation();
  const [resendOtp, resendOtpResponse] = useResendOtpMutation();
  const [forgotPassword, forgotPasswordResponse] = useForgotPasswordMutation();
  const [resetPassword, resetPasswordResponse] = useResetPasswordMutation();
  const [googleAuth, googleAuthResponse] = useGoogleAuthMutation();
  const [logoutMutation, logoutResponse] = useLogoutMutation();

  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector((state) => state.auth?.isAuthenticated);

  // ── Handler functions ───────────────────────────────────────────────

  const handleSignIn = async (credentials: SignInPayload) => {
    const result = await signIn({
      payload: credentials,
      options: { noSuccessMessage: true },
    }).unwrap();
    return result;
  };

  const handleSignUp = async (userData: SignUpPayload) => {
    const result = await signUp({
      payload: userData,
      options: { noSuccessMessage: true },
    }).unwrap();
    return result;
  };

  const handleVerifyOtp = async (otpData: VerifyOtpPayload) => {
    const result = await verifyOtp({
      payload: otpData,
      options: { successMessage: 'Email verified successfully' },
    }).unwrap();
    return result;
  };

  const handleResendOtp = async (resendData: ResendOtpPayload) => {
    const result = await resendOtp({
      payload: resendData,
      options: { successMessage: 'Verification code sent' },
    }).unwrap();
    return result;
  };

  const handleForgotPassword = async (emailData: ForgotPasswordPayload) => {
    const result = await forgotPassword({
      payload: emailData,
      options: { successMessage: 'Reset link sent to your email' },
    }).unwrap();
    return result;
  };

  const handleResetPassword = async (resetData: ResetPasswordPayload) => {
    const result = await resetPassword({
      payload: resetData,
      options: { successMessage: 'Password reset successfully' },
    }).unwrap();
    return result;
  };

  const handleGoogleAuth = async (googleData: GoogleAuthPayload) => {
    const result = await googleAuth({
      payload: googleData,
      options: { successMessage: 'Logged in successfully' },
    }).unwrap();
    return result;
  };

  const handleLogout = async () => {
    const result = await logoutMutation({
      options: { successMessage: 'Signed out' },
    })
      .unwrap()
      .then(() => {
        dispatch(api.util.resetApiState()); // clears all cached API data

        dispatch(logout());
      });
    return result;
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    signIn: handleSignIn,
    signUp: handleSignUp,
    verifyOtp: handleVerifyOtp,
    resendOtp: handleResendOtp,
    forgotPassword: handleForgotPassword,
    resetPassword: handleResetPassword,
    googleAuth: handleGoogleAuth,
    logout: handleLogout,

    // Loading states
    isSigningIn: signInResponse.isLoading,
    isSigningUp: signUpResponse.isLoading,
    isVerifyingOtp: verifyOtpResponse.isLoading,
    isResendingOtp: resendOtpResponse.isLoading,
    isSendingForgotPassword: forgotPasswordResponse.isLoading,
    isResettingPassword: resetPasswordResponse.isLoading,
    isGoogleAuthing: googleAuthResponse.isLoading,
    isLoggingOut: logoutResponse.isLoading,
    isAuthenticated,

    // Success states
    isSignInSuccess: signInResponse.isSuccess,
    isSignUpSuccess: signUpResponse.isSuccess,
    isVerifyOtpSuccess: verifyOtpResponse.isSuccess,
    isResendOtpSuccess: resendOtpResponse.isSuccess,
    isForgotPasswordSuccess: forgotPasswordResponse.isSuccess,
    isResetPasswordSuccess: resetPasswordResponse.isSuccess,
    isGoogleAuthSuccess: googleAuthResponse.isSuccess,
    isLogoutSuccess: logoutResponse.isSuccess,

    // Error states
    signInError: signInResponse.error,
    signUpError: signUpResponse.error,
    verifyOtpError: verifyOtpResponse.error,
    resendOtpError: resendOtpResponse.error,
    forgotPasswordError: forgotPasswordResponse.error,
    resetPasswordError: resetPasswordResponse.error,
    googleAuthError: googleAuthResponse.error,
    logoutError: logoutResponse.error,

    // Response states
    signInResponse,
    signUpResponse,
    verifyOtpResponse,
    resendOtpResponse,
    forgotPasswordResponse,
    resetPasswordResponse,
    googleAuthResponse,
    logoutResponse,
  };
};
