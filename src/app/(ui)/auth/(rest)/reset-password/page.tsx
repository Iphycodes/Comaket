'use client';
import { useContext, useEffect, useState } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import ResetPassword from '@grc/components/auth/reset-password';
import { useRouter, useSearchParams } from 'next/navigation';

const ResetPasswordPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const [email, setEmail] = useState<string | null>('');
  const params = useSearchParams();
  const router = useRouter();

  const handleResetPasswordSubmit = (payload: any) => {
    console.log('ResetPassword values::', payload);
    router.push(`/auth/login`);
  };
  const handleResendPasscode = () => {
    console.log('otp resent to::', email);
  };

  useEffect(() => {
    const email = params?.get('email');
    if (email) {
      setEmail(email);
    }
  }, [email]);

  return (
    <ResetPassword
      mobileResponsive={mobileResponsive}
      theme={theme}
      handleResetPasswordSubmit={handleResetPasswordSubmit}
      handleResendPasscode={handleResendPasscode}
    />
  );
};

export default ResetPasswordPage;
