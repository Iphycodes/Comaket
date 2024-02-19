import '../styles/globals.css';
import '../styles/_override.scss';
import 'remixicon/fonts/remixicon.css';
import React, { ReactElement } from 'react';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import { ThemeProvider } from '@grc/_shared/components/theme-provider';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'Comaket',
  description: 'Biggest Network of Buyers and Sellers',
  // viewport: { width: 'device-width', initialScale: 1 },
  icons: { icon: '/favicon.ico' },
};

export interface LayoutProps {
  children: ReactElement | ReactElement[];
}

export default function RootLayout({ children }: LayoutProps) {
  return (
    <html lang="en">
      <body className={nunito.className} suppressHydrationWarning={true}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
