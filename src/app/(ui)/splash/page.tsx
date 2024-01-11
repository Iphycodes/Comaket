'use client';
import { useContext } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import SplashScreen from '@grc/components/splash';

const SplashScreenPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);

  return (
    <div>
      <header className="flex items-center justify-end px-10 py-2">Sign-out</header>
      <SplashScreen mobileResponsive={mobileResponsive} theme={theme} />
    </div>
  );
};

export default SplashScreenPage;
