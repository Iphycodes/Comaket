import StorePortalLayout from '@grc/components/my-store/layout/layout';
import React from 'react';

export default function MyStoreLayout({ children }: { children: React.ReactNode | any }) {
  return <StorePortalLayout>{children}</StorePortalLayout>;
}
