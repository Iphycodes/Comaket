import { ReactElement, ReactNode, useContext } from 'react';
import { useRouter } from 'next/router';
import AuthLayout from '@grc/components/auth/lib/auth-layout';
import PageNotFound from '@grc/pages/_error.page';
import { AppContext } from '@grc/app-context';

export interface LayoutProps {
  children: ReactElement | ReactElement[] | ReactNode;
  className: string;
}

const AppLayout = (props: LayoutProps) => {
  const { children, className } = props;
  const { pathname } = useRouter();
  const { theme } = useContext(AppContext);

  const urlPath = pathname?.split('/');

  const layoutRoute = [
    {
      basePath: '/',
      entryPath: pathname,
      component: <AuthLayout theme={theme}>{children}</AuthLayout>,
    },
    {
      basePath: 'auth',
      entryPath: urlPath?.[1],
      component: <AuthLayout theme={theme}>{children}</AuthLayout>,
    },
    {
      basePath: '_error',
      entryPath: urlPath?.[1],
      component: <PageNotFound />,
    },
  ];
  return (
    <>
      {layoutRoute.map(({ basePath, entryPath, component }, index) => {
        if (basePath === entryPath)
          return (
            <div key={`${basePath}__${index}`} className={`${className}`}>
              {component}
            </div>
          );
      })}
    </>
  );
};

export default AppLayout;
