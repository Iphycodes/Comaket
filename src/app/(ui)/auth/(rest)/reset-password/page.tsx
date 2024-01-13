'use client';
import { useContext, useEffect, useState } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import ResetPassword from '@grc/components/auth/reset-password';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@grc/hooks/useAuth';
import { omit, toString } from 'lodash';

const ResetPasswordPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const [email, setEmail] = useState<string | null>('');
  const params = useSearchParams();
  const router = useRouter();
  const { forgotPassword, forgotPasswordResponse, resetPassword, resetPasswordResponse } = useAuth(
    {}
  );
  const { isLoading: isResendingVerificationCode } = forgotPasswordResponse;
  const { isLoading: isResettingPassword, isSuccess } = resetPasswordResponse;

  const handleResetPasswordSubmit = (values: Record<string, any>) => {
    const payload = {
      email,
      ...omit(values, ['confirmPassword']),
      verificationCode: toString(values.verificationCode),
    };
    resetPassword({ payload, options: { successMessage: 'Password changed successfully' } });
  };

  const handleResendPasscode = () => {
    forgotPassword({
      payload: {
        email,
      },
      options: {
        successMessage: 'An email has been sent to your email address!',
        errorMessage: 'This email does not exist in our database',
      },
    });
  };

  useEffect(() => {
    const email = params?.get('email');
    if (email) {
      setEmail(email);
    }
  }, [email]);

  useEffect(() => {
    if (isSuccess) {
      router.push(`/auth/login`);
    }
  }, [resetPasswordResponse]);

  return (
    <ResetPassword
      mobileResponsive={mobileResponsive}
      theme={theme}
      handleResetPasswordSubmit={handleResetPasswordSubmit}
      handleResendPasscode={handleResendPasscode}
      isLoading={{
        isResendingVerificationCode,
        isResettingPassword,
      }}
    />
  );
};

export default ResetPasswordPage;
