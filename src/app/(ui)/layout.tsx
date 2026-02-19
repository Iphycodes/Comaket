'use client';
import React, { ReactElement, Suspense, useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Rings } from 'react-preloader-icon';
import { AppLoader } from '@grc/_shared/components/app-loader';
import NetWorkDetector from '@grc/_shared/components/network-detector';
import { persistor, store } from '@grc/redux/store';
import { AppProvider } from '@grc/app-context';
import { ConfigProvider, theme as AntDTheme, App } from 'antd';
import { useTheme } from 'next-themes';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import { usePathname } from 'next/navigation';

export interface LayoutProps {
  children: ReactElement | ReactElement[];
}

const BaseLayout = ({ children }: LayoutProps) => {
  const { defaultAlgorithm, darkAlgorithm } = AntDTheme;
  const { theme } = useTheme();
  const [isConfetti, setIsConfetti] = useState<boolean>(false);
  const pathName = usePathname();
  const urlPath = pathName?.split('/');

  const { width, height } = useWindowSize();

  // Auto-trigger confetti once on load
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsConfetti(true);
    }, 100);

    return () => {
      clearTimeout(timer); // Clean up timer
    };
  }, []);

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
                <NetWorkDetector>
                  {children}
                  {(urlPath?.[1] === 'payment-confirmation' ||
                    urlPath?.[1] === 'congratulations') && (
                    <div className="fixed inset-0 bottom-0 flex items-center justify-center pointer-events-none z-50">
                      {isConfetti && (
                        <Confetti
                          width={width}
                          height={height}
                          recycle={false}
                          numberOfPieces={500}
                          gravity={0.9}
                          tweenDuration={3000}
                        />
                      )}
                    </div>
                  )}
                </NetWorkDetector>
              </App>
            </AppProvider>
          </ConfigProvider>
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

export default BaseLayout;
