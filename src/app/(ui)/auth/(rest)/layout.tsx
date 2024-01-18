'use client';
import React, { ReactElement, useMemo } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Button } from 'antd';
import { Giro as GiroLogo } from '@grc/_shared/assets/svgs';

export interface LayoutProps {
  children?: ReactElement | ReactElement[];
}

const AppsBaseLayout = (props: LayoutProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const { children } = props;

  const onHeaderButtonClicked = (destination: string) => {
    router.push(`/auth/${destination}`);
  };

  const isSignUpPage = useMemo(() => {
    return pathname && pathname === '/auth/register';
  }, [pathname]);

  return (
    <main className="h-screen flex flex-col items-center p-2.5 bg-white px-4">
      <header className="w-[54rem] max-w-full flex bg-white items-center justify-between justify-items-center py-4 px-6 md:flex-wrap">
        <GiroLogo />
        {/* <h3 className="text-3xl font-extrabold text-blue"> Giro Financial</h3> */}
        {isSignUpPage ? (
          <div className="flex items-center justify-center">
            <div>{`Already have an account?`}</div>
            <Button
              type="primary"
              className="ml-5"
              ghost
              onClick={() => onHeaderButtonClicked('login')}
            >
              Sign in
            </Button>
          </div>
        ) : (
          <div className="flex items-center justify-center">
            <div>{`Don't have an account?`}</div>
            <Button
              type="primary"
              className="ml-5 border-blue text-blue"
              ghost
              onClick={() => onHeaderButtonClicked('register')}
            >
              Register here
            </Button>
          </div>
        )}
      </header>
      <div
        className={`${
          !isSignUpPage ? 'w-[40.625rem] mt-24' : 'w-[46.875rem] mt-[68px]'
        } flex items-center justify-center justify-items-center justify-self-center content-center text-black`}
      >
        {children}
      </div>
    </main>
  );
};

export default AppsBaseLayout;
