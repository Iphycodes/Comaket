// import LoginContainer from '@grc/container/auth/login'
'use client';

import { useTheme } from 'next-themes';

const Home = () => {
  const { setTheme } = useTheme();
  return (
    <>
      {/* <LoginContainer /> */}
      <div>Sample Project Landing page</div>
      <button onClick={() => setTheme('light')}>Change</button>
    </>
  );
};

export default Home;
