'use client';
import { useContext, useEffect, useState } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import { useRouter, useSearchParams } from 'next/navigation';
import VerifyEmail from '@grc/components/auth/verify-email';
import { useAuth } from '@grc/hooks/useAuth';

const VerifyEmailPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const [email, setEmail] = useState<string | null>('');
  const params = useSearchParams();
  const router = useRouter();
  const { verifyEmail, verifyEmailResponse, sendVerification, sendVerificationResponse } = useAuth(
    {}
  );
  const { isLoading: verifyEmailLoading, isSuccess } = verifyEmailResponse;
  const { isLoading: isSendVerificationCodeLoading } = sendVerificationResponse;

  const handleVerifyEmail = (code: string) => {
    const payload = {
      email: email,
      verificationCode: code,
    };
    verifyEmail({
      payload,
      options: {
        successMessage: "Your account's email has been successfully verified",
      },
    });
  };
  const handleResendPasscode = () => {
    sendVerification({
      payload: {
        email: email,
        type: 'email',
      },
      options: {
        successMessage: `A new verification code has been sent to ${email}`,
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
      router.push(`/app`);
    }
  }, [verifyEmailResponse]);

  return (
    <VerifyEmail
      email={email}
      mobileResponsive={mobileResponsive}
      theme={theme}
      handleVerifyEmail={handleVerifyEmail}
      isLoading={{ verifyEmailLoading, isSendVerificationCodeLoading }}
      handleResendPasscode={handleResendPasscode}
    />
  );
};

export default VerifyEmailPage;
