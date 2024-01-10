'use client';
import { useContext } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import ForgotPassword from '@grc/components/auth/forgot-password';
import { useRouter } from 'next/navigation';

const ForgotPasswordPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const router = useRouter();

  const handleForgotPassword = (payload: Record<string, any>) => {
    console.log('user email:::', payload);
    router.push(`/auth/reset-password?email=${payload.email}`);
  };

  return (
    <ForgotPassword
      mobileResponsive={mobileResponsive}
      theme={theme}
      handleForgotPassword={handleForgotPassword}
    />
  );
};

export default ForgotPasswordPage;
