'use client';
import { useContext, useEffect } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import Login from '@grc/components/auth/login';
import { useRouter } from 'next/navigation';
import { useAuth } from '@grc/hooks/useAuth';

const LoginPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const router = useRouter();
  const { login, loginResponse, sendVerification } = useAuth({});
  const { isLoading } = loginResponse;

  const handleLogin = (payload: Record<string, any>) => {
    login({
      payload,
      options: { successMessage: 'Login successful, you are welcome.' },
    });
  };

  const onRememberMe = (isRemember: boolean, username: string) => {
    if (typeof window !== 'undefined') {
      if (isRemember) localStorage.setItem('username', username);
      if (!isRemember) localStorage.removeItem('username');
    }
  };

  useEffect(() => {
    if (loginResponse) {
      if (loginResponse.data) {
        const { verifications, email } = loginResponse.data.data;
        if (!verifications?.email) {
          const payload = {
            email,
            type: 'email',
          };
          sendVerification({ payload })
            .unwrap()
            .then(() => {
              router.push(`/auth/verify-email?email=${loginResponse.data.data.email}`);
            });
        } else {
          router.push('/app');
        }
      }
    }
  }, [loginResponse]);

  return (
    <Login
      mobileResponsive={mobileResponsive}
      theme={theme}
      onRememberMe={onRememberMe}
      handleLogin={handleLogin}
      isLoading={isLoading}
    />
  );
};

export default LoginPage;
