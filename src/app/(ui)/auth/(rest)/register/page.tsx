'use client';
import { useContext } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import Register from '@grc/components/auth/register';
import { useRouter } from 'next/navigation';

const RegisterPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const router = useRouter();

  const handleRegisterUser = (payload: Record<string, any>) => {
    console.log('Register user values::', payload);
    router.push(`/auth/verify-email?email=${payload?.email}`);
  };

  return (
    <Register
      mobileResponsive={mobileResponsive}
      theme={theme}
      handleRegisterUser={handleRegisterUser}
    />
  );
};

export default RegisterPage;
