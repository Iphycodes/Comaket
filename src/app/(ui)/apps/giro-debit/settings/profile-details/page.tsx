'use client';
import { AppContext } from '@grc/app-context';
import { ProfileDetails } from '@grc/components/giro-debit/settings/profile-details';
import React, { useContext } from 'react';

const ProfileDetailsPage = () => {
  const {} = useContext(AppContext);

  const handleUpdateProfileDetails = (payload: Record<string, any>) => {
    console.log('handleUpdateProfileDetails values::', payload);
  };

  const isUpdatingProfile = false;

  return (
    <ProfileDetails
      handleUpdateProfileDetails={handleUpdateProfileDetails}
      isUpdatingProfile={isUpdatingProfile}
    />
  );
};

export default ProfileDetailsPage;
