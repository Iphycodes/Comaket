'use client';
import { BusinessProfile } from '@grc/components/giro-pay/settings/business-profile';
import React from 'react';

const BusinessProfilePage = () => {
  const handleUpdateBusinessProfile = (payload: Record<string, any>) => {
    console.log('handleUpdateBusinessProfile values::', payload);
  };

  const isUpdatingBusinessProfile = false;

  return (
    <BusinessProfile
      handleUpdateBusinessProfile={handleUpdateBusinessProfile}
      isUpdatingBusinessProfile={isUpdatingBusinessProfile}
    />
  );
};

export default BusinessProfilePage;
