'use client';
import { useEffect } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import ForgotPassword from '@grc/components/auth/forgot-password';
import { useRouter } from 'next/navigation';
import { useAuth } from '@grc/hooks/useAuth';
import { useTheme } from 'next-themes';

const ForgotPasswordPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useTheme();
  const router = useRouter();
  const { forgotPassword, forgotPasswordResponse } = useAuth({});
  const { isSuccess, isLoading } = forgotPasswordResponse;

  const handleForgotPassword = (payload: Record<string, any>) => {
    forgotPassword({
      payload: {
        email: payload.email,
      },
      options: {
        successMessage: 'An email has been sent to your email address!',
        errorMessage: 'This email does not exist in our database',
      },
    });
  };

  useEffect(() => {
    if (isSuccess) {
      const { data } = forgotPasswordResponse;
      router.push(`/auth/reset-password?email=${data?.data?.email}`);
    }
  }, [forgotPasswordResponse]);

  return (
    <ForgotPassword
      mobileResponsive={mobileResponsive}
      theme={theme}
      handleForgotPassword={handleForgotPassword}
      isLoading={isLoading}
    />
  );
};

export default ForgotPasswordPage;
