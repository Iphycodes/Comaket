import Head from 'next/head';
// import LoginContainer from '@grc/container/auth/login'

export default function Home() {
  return (
    <>
      <Head>
        <title>Giro</title>
        <meta name="description" content="this is a lenders app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      {/* <LoginContainer /> */}
      <div>Giro Landing page</div>
    </>
  );
}
