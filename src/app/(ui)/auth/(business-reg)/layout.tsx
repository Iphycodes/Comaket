'use client';
import React, { ReactElement } from 'react';
import { Giro as GiroLogo, HappyPeople } from '@grc/_shared/assets/svgs';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

export interface LayoutProps {
  children?: ReactElement | ReactElement[];
}

const BusinessLayout = (props: LayoutProps) => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { children } = props;

  return (
    <main className="h-screen flex items-center bg-white">
      <div
        className={` ${
          mobileResponsive ? 'hidden' : 'flex-[2_1_0%]'
        } bg-sky border-r-2 border-solid h-screen flex flex-col items-center justify-center justify-items-center justify-self-center content-center text-black py-7 px-12 text-center`}
      >
        <GiroLogo />
        <div className="mt-7 flex flex-col items-center">
          <HappyPeople />
          <div className="mt-10 text-2xl font-bold">Welcome To Giro 🎉</div>
          <div className="font-semibold">- One last step -</div>
          <div className="mt-3 text-justify">
            Congratulations! You have successfully created and verified your Giro User Account. To
            get access to all the amazing features Giro has for you and access your dashboard area,
            please give us brief info about your business. Cheers!
          </div>
        </div>
      </div>
      <div
        className={`flex-[3_1_0%] mt-20 flex items-center justify-center justify-items-center justify-self-center content-center text-black pb-10`}
      >
        {children}
      </div>
    </main>
  );
};

export default BusinessLayout;
