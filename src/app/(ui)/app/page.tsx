'use client';

import { AppContext } from '@grc/app-context';
import { Button } from 'antd';
import { useRouter } from 'next/navigation';
import { useContext } from 'react';

const AppPage = () => {
  const { handleLogOut, authData } = useContext(AppContext);
  const router = useRouter();
  return (
    <>
      <div>Logged in: {authData?.email}</div>
      <Button
        className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white rounded-lg"
        type="primary"
        disabled={false}
        loading={false}
        onClick={() => {
          handleLogOut();
          router.push('/login');
        }}
      >
        Log out
      </Button>
    </>
  );
};

export default AppPage;
