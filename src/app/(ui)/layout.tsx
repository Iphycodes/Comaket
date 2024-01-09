'use client';
import { AppContext } from '@grc/app-context';
import { Rings } from 'react-preloader-icon';
import { AppLoader } from '@grc/_shared/components/app-loader';
import NetWorkDetector from '@grc/_shared/components/network-detector';
import React, { ReactElement, Suspense, useContext } from 'react';

export interface LayoutProps {
  children: ReactElement | ReactElement[];
}

const BaseLayout = ({ children }: LayoutProps) => {
  const { theme } = useContext(AppContext);

  return (
    <Suspense fallback={<AppLoader use={Rings} theme={theme} />}>
      <NetWorkDetector>
        <>{children}</>
      </NetWorkDetector>
    </Suspense>
  );
};

export default BaseLayout;
