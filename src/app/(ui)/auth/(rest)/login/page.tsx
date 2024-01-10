'use client';
import { useContext } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import Login from '@grc/components/auth/login';

const LoginPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);

  const onRememberMe = (isRemember: boolean, username: string) => {
    if (typeof window !== 'undefined') {
      if (isRemember) localStorage.setItem('username', username);
      if (!isRemember) localStorage.removeItem('username');
    }
  };

  return <Login mobileResponsive={mobileResponsive} theme={theme} onRememberMe={onRememberMe} />;
};

export default LoginPage;
