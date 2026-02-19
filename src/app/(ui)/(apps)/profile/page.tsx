'use client';
import React from 'react';
import dynamic from 'next/dynamic';

const Profile = dynamic(() => import('@grc/components/apps/profile'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <p className="text-gray-400">Loading profile...</p>
    </div>
  ),
});
const BasicProfile = dynamic(() => import('@grc/components/apps/basic-profile'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <p className="text-gray-400">Loading profile...</p>
    </div>
  ),
});

const ProfilePage = () => {
  const isCreatorAccount = false;

  if (isCreatorAccount) {
    return <Profile />;
  }

  return <BasicProfile />;
};

export default ProfilePage;
