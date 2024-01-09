'use client';
import { useContext } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import ForgotPassword from '@grc/components/auth/forgot-password';

const ForgotPasswordPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);

  return <ForgotPassword mobileResponsive={mobileResponsive} theme={theme} />;
};

export default ForgotPasswordPage;
