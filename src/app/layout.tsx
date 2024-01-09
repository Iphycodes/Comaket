import '../styles/globals.css';
import '../styles/_override.scss';
import React, { ReactElement } from 'react';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
});
export const metadata: Metadata = {
  title: 'Giro',
  description: 'This is a financial app',
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
        {children}
      </body>
    </html>
  );
}
