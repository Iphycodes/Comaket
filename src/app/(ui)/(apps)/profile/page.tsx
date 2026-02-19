'use client';

import React from 'react';
import Profile from '@grc/components/apps/profile';
import BasicProfile from '@grc/components/apps/basic-profile';

const ProfilePage = () => {
  // Toggle this to switch between creator and basic user profiles
  const isCreatorAccount = false;

  if (isCreatorAccount) {
    return <Profile />;
  }

  return <BasicProfile />;
};

export default ProfilePage;
