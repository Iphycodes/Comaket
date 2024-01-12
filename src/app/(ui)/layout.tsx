'use client';
import React, { ReactElement, Suspense, useContext } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { AppContext } from '@grc/app-context';
import { Rings } from 'react-preloader-icon';
import { AppLoader } from '@grc/_shared/components/app-loader';
import NetWorkDetector from '@grc/_shared/components/network-detector';
import { persistor, store } from '@grc/redux/store';
import { AppProvider } from '@grc/app-context';

export interface LayoutProps {
  children: ReactElement | ReactElement[];
}

const BaseLayout = ({ children }: LayoutProps) => {
  const {} = useContext(AppContext);

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<AppLoader use={Rings} theme={''} />}>
          <NetWorkDetector>
            <AppProvider>{children}</AppProvider>
          </NetWorkDetector>
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

export default BaseLayout;
