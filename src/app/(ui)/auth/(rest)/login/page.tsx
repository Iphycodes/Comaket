'use client';
import { useContext } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import Login from '@grc/components/auth/login';
import { useRouter } from 'next/navigation';

const LoginPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const router = useRouter();

  const onRememberMe = (isRemember: boolean, username: string) => {
    if (typeof window !== 'undefined') {
      if (isRemember) localStorage.setItem('username', username);
      if (!isRemember) localStorage.removeItem('username');
    }
  };

  const handleLogin = (payload: Record<string, any>) => {
    console.log('login values::', payload);
    router.push(`/app`);
  };

  return (
    <Login
      mobileResponsive={mobileResponsive}
      theme={theme}
      onRememberMe={onRememberMe}
      handleLogin={handleLogin}
    />
  );
};

export default LoginPage;
