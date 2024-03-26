import Image from 'next/image';
import React from 'react';
import { Preloader, TailSpin } from 'react-preloader-icon';

interface Props {
  // Add your prop types here
}

const SplashScreen: React.FC<Props> = ({}) => {
  return (
    <div className="w-full relative h-screen flex items-center justify-center">
      {/* Your component content here */}
      <Image
        src={'/assets/imgs/mandate-logo.png'}
        alt="logo"
        width={60}
        height={60}
        priority
        style={{ width: '50px', height: '50px' }}
      />
      <div className="absolute flex flex-col text-gray-600 gap-0 bottom-8 font-semibold text-center mx-auto">
        <Preloader
          use={TailSpin}
          size={32}
          strokeWidth={12}
          strokeColor="#F0AD4E"
          className="mx-auto"
        />
        <span className="font-bold text-[20px]">Comaket</span>
        <span className="text-[16px]">World's Largest Network of Buyers and Sellers</span>
      </div>
    </div>
  );
};

export default SplashScreen;
