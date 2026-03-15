'use client';
import React, { ReactElement, Suspense, useEffect } from 'react';
import { Provider, useSelector } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { Rings } from 'react-preloader-icon';
import { AppLoader } from '@grc/_shared/components/app-loader';
import NetWorkDetector from '@grc/_shared/components/network-detector';
import { persistor, store, RootState } from '@grc/redux/store';
import { AppProvider } from '@grc/app-context';
import { ConfigProvider, theme as AntDTheme, App } from 'antd';
import { useTheme } from 'next-themes';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { AppCookie } from '@grc/_shared/helpers';

export interface LayoutProps {
  children: ReactElement | ReactElement[];
}

/**
 * Keeps the auth cookie in sync with redux-persist.
 * The Next.js middleware reads this cookie to redirect "/" → "/market".
 */
const CookieSync = () => {
  const token = useSelector((s: RootState) => s.auth.sessionToken);
  useEffect(() => {
    if (token) {
      AppCookie({ cookie: token });
    }
  }, [token]);
  return null;
};

const BaseLayout = ({ children }: LayoutProps) => {
  const { defaultAlgorithm, darkAlgorithm } = AntDTheme;
  const { theme } = useTheme();

  return (
    <Provider store={store}>
      <CookieSync />
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
            {/* <AuthProvider> */}
            <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? ''}>
              <AppProvider>
                <App>
                  <NetWorkDetector>{children}</NetWorkDetector>
                </App>
              </AppProvider>
            </GoogleOAuthProvider>
            {/* </AuthProvider> */}
          </ConfigProvider>
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

export default BaseLayout;
