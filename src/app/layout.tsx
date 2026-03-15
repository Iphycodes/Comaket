// 'use client';

import '../styles/globals.css';
import '../styles/_override.scss';
import 'remixicon/fonts/remixicon.css';
import React, { ReactElement } from 'react';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { ThemeProvider } from '@grc/_shared/components/theme-provider';
import SplashScreen from '@grc/components/splash-screen';
// import Script from 'next/script';
// import Script from 'next/script';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'Kraft',
  description: "Nigeria's Creators Marketplace - Strictly Nigerian Brands",
  viewport: { width: 'device-width', initialScale: 1, maximumScale: 1, userScalable: false },
  icons: { icon: '/kraft-logo-icon.ico' },
};

export interface LayoutProps {
  children: ReactElement | ReactElement[];
}

export default function RootLayout({ children }: LayoutProps) {
  // const [loading, setLoading] = useState<boolean>(true);

  // setTimeout(() => {
  //   setLoading(false);
  // }, 1000);
  const loading = false;
  return (
    <html lang="en">
      <body
        className={`${nunito.className} max-w-[100vw] !overflow-x-hidden`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          storageKey="sample-key"
          disableTransitionOnChange
        >
          {loading ? <SplashScreen /> : children}
        </ThemeProvider>

        {/* <Script
          src="http://localhost:4002/widget/widget.js"
          data-client-id="e415273c-989d-47f5-98bb-bf0d827fe53d"
          strategy="afterInteractive"
        /> */}
      </body>
    </html>
  );
}
