'use client';
import { useContext, useEffect, useState } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import { useRouter, useSearchParams } from 'next/navigation';
import VerifyEmail from '@grc/components/auth/verify-email';

const VerifyEmailPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const [email, setEmail] = useState<string | null>('');
  const params = useSearchParams();
  const router = useRouter();
  const verifyEmailLoading = false;

  const handleVerifyEmail = (code: string) => {
    const payload = {
      email: email,
      verificationCode: code,
    };
    console.log('VerifyEmail values::', payload);
    router.push(`/auth/business/register`);
  };
  const handleResendPasscode = () => {
    console.log('otp resent to::', email);
  };
  console.log('email', email);
  useEffect(() => {
    const email = params?.get('email');
    if (email) {
      setEmail(email);
    }
  }, [email]);

  return (
    <VerifyEmail
      email={email}
      mobileResponsive={mobileResponsive}
      theme={theme}
      handleVerifyEmail={handleVerifyEmail}
      verifyEmailLoading={verifyEmailLoading}
      handleResendPasscode={handleResendPasscode}
    />
  );
};

export default VerifyEmailPage;
