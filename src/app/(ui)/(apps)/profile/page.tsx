'use client';
import { AppContext } from '@grc/app-context';
import Profile from '@grc/components/apps/profile';
import { useContext, useEffect } from 'react';

export default function ProfilePage() {
  const { setIsSellItemModalOpen } = useContext(AppContext);
  useEffect(() => {
    setIsSellItemModalOpen(false);
  }, []);
  return <Profile />;
}
