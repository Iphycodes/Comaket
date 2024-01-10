'use client';
import { useContext } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import { useRouter } from 'next/navigation';
import BusinessRegister from '@grc/components/auth/business-register';

const BusinessRegisterPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const router = useRouter();
  const categoriesLoading = false;

  const handleBusinessRegister = (payload: Record<string, any>) => {
    console.log('Register user values::', payload);
    router.push(`/app`);
  };

  return (
    <BusinessRegister
      mobileResponsive={mobileResponsive}
      theme={theme}
      handleBusinessRegister={handleBusinessRegister}
      categoriesLoading={categoriesLoading}
    />
  );
};

export default BusinessRegisterPage;
