'use client';
import { useContext } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import SplashScreen from '@grc/components/splash';
import { Space } from 'antd';
import Image from 'next/image';

const SplashScreenPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);

  return (
    <main className="h-screen flex flex-col items-center p-2.5 bg-white px-4">
      <header className="w-full max-w-full flex bg-white items-center justify-between justify-items-center py-7 px-6">
        <Space>Logo</Space>
        <div>
          <Image
            src={'/assets/imgs/avatar.jpg'}
            alt="avatar"
            width={30}
            height={30}
            style={{ borderRadius: '50%' }}
          />
        </div>
      </header>
      <div className="mt-24 flex items-center justify-center justify-items-center justify-self-center content-center text-black">
        <SplashScreen mobileResponsive={mobileResponsive} theme={theme} />
      </div>
    </main>
  );
};

export default SplashScreenPage;
