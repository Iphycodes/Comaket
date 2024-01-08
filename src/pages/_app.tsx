import CreateGlobalStyle from '@grc/styles/global';
import '@grc/styles/globals.css';
import '@grc/styles/_override.scss';
import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <>
      <CreateGlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
