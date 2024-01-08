import CreateGlobalStyle from '@grc/styles/global';
import '@grc/styles/globals.css';
import '@grc/styles/_override.scss';
import type { AppProps } from 'next/app';
import AppLayout from '@grc/app/app-layout';
import { Nunito } from '@next/font/google';
// import NetWorkDetector from '@grc/components/_shared/network-detector';

const nunito = Nunito({
  subsets: ['latin'],
  display: 'swap',
});

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CreateGlobalStyle />
      {/* <NetWorkDetector> */}
      <AppLayout className={nunito.className}>
        <Component {...pageProps} />
      </AppLayout>
      {/* </NetWorkDetector> */}
    </>
  );
}
