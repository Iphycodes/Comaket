'use client';
import { BusinessProfile } from '@grc/components/giro-pay/settings/business-profile';
import { useBusinessProfile } from '@grc/hooks/useBusinessProfile';
// import { omit } from 'lodash';
import React from 'react';

const BusinessProfilePage = () => {
  const { businessProfile, updateBusinessProfileResponse } = useBusinessProfile({
    callAllBusinessProfile: true,
  });

  const { isLoading: isUpdatingBusinessProfile } = updateBusinessProfileResponse;

  console.log('businessProfile:::', businessProfile);

  const handleUpdateBusinessProfile = (payload: Record<string, any>) => {
    console.log('handleUpdateBusinessProfile values::', payload);
    // updateBusinessProfile({
    //   payload: {
    //     ...omit(payload, ['mobile', 'addressLine_1', 'name', 'status', 'category', 'email']),
    //     name: String(payload?.name),
    //     email: String(payload?.email),
    //     mobile: {
    //       phoneNumber: `234${payload.mobile}`,
    //       isoCode: 'NG',
    //     },
    //     address: payload?.adress?.addressLine_1,
    //     category: String(payload?.category),
    //     status: String(payload?.status),
    //   },
    //   id: businessProfile?._id,
    //   options: { successMessage: `Profile update successful` },
    // });
  };

  return (
    <BusinessProfile
      profile={businessProfile}
      handleUpdateBusinessProfile={handleUpdateBusinessProfile}
      isUpdatingBusinessProfile={isUpdatingBusinessProfile}
    />
  );
};

export default BusinessProfilePage;
