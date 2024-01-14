// 'use client';

// import { AppContext } from '@grc/app-context';
// import { Button } from 'antd';
// import { useRouter } from 'next/navigation';
// import { useContext } from 'react';

// const AppPage = () => {
//   const { handleLogOut, authData } = useContext(AppContext);
//   const router = useRouter();
//   return (
//     <>
//       <div>Logged in: {authData?.email}</div>
//       <Button
//         className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white rounded-lg"
//         type="primary"
//         disabled={false}
//         loading={false}
//         onClick={() => {
//           handleLogOut();
//           router.push('/login');
//         }}
//       >
//         Log out
//       </Button>
//     </>
//   );
// };

// export default AppPage;

'use client';
import { useContext } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import AppsWrapper from '@grc/components/apps';
import { AppHeader } from '@grc/components/giro-debit/layout/app-header';

const AppsPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);

  return (
    <main className="h-screen flex flex-col items-center bg-white px-4">
      <header className="w-full max-w-full px-6">
        <AppHeader />
      </header>
      <div className="mt-24 flex items-center justify-center justify-items-center justify-self-center content-center text-black">
        <AppsWrapper mobileResponsive={mobileResponsive} theme={theme} />
      </div>
    </main>
  );
};

export default AppsPage;
