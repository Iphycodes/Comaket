import React, { ReactElement, ReactNode } from 'react';

type AuthLayoutProps = {
  children: ReactElement | ReactElement[] | ReactNode;
  theme: string;
};

const AuthLayout = ({ children }: AuthLayoutProps) => {
  return <div>{children}</div>;
};

export default AuthLayout;
