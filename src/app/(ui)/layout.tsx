'use client';
import React, { ReactElement, Suspense } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Rings } from 'react-preloader-icon';
import { AppLoader } from '@grc/_shared/components/app-loader';
import NetWorkDetector from '@grc/_shared/components/network-detector';
import { persistor, store } from '@grc/redux/store';
import { AppProvider } from '@grc/app-context';
import { ConfigProvider, theme as AntDTheme, App } from 'antd';
import { useTheme } from 'next-themes';

export interface LayoutProps {
  children: ReactElement | ReactElement[];
}

const BaseLayout = ({ children }: LayoutProps) => {
  const { defaultAlgorithm, darkAlgorithm } = AntDTheme;
  const { theme } = useTheme();

  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<AppLoader use={Rings} theme={''} />}>
          <ConfigProvider
            theme={{
              algorithm: theme === 'dark' ? darkAlgorithm : defaultAlgorithm,
              components: {
                Button: {
                  colorPrimary: 'rgba(30, 136, 229, 1)',
                  algorithm: true,
                },
                Input: {
                  colorBgContainerDisabled: 'transparent',
                  algorithm: true,
                },
              },
            }}
          >
            <AppProvider>
              <App>
                <NetWorkDetector>{children}</NetWorkDetector>
              </App>
            </AppProvider>
          </ConfigProvider>
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

export default BaseLayout;
