'use client';
import { BusinessProfile } from '@grc/components/giro-pay/settings/business-profile';
import { useBusinessProfile } from '@grc/hooks/useBusinessProfile';
import { Form } from 'antd';
import { omit } from 'lodash';
// import { omit } from 'lodash';
import React, { useEffect } from 'react';

const BusinessProfilePage = () => {
  const [form] = Form.useForm();
  const { businessProfile, updateBusinessProfileResponse, updateBusinessProfile } =
    useBusinessProfile({
      callAllBusinessProfile: true,
    });
  const { isLoading: isUpdatingBusinessProfile } = updateBusinessProfileResponse;

  const handleUpdateBusinessProfile = (payload: Record<string, any>) => {
    updateBusinessProfile({
      payload: {
        ...omit(payload, ['phone', 'addressLine_1']),
        mobile: {
          phoneNumber: payload.phone,
          isoCode: 'NG',
        },
        address: {
          addressLine_1: payload?.addressLine_1,
        },
      },
      id: businessProfile?._id,
      options: { successMessage: `Profile successfully updated` },
    });
  };

  const initialValues = {
    name: businessProfile?.name,
    email: businessProfile?.email,
    phone: businessProfile?.mobile?.phoneNumber,
    addressLine_1: businessProfile?.address?.addressLine_1,
    category: businessProfile?.category,
    status: businessProfile?.status,
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <BusinessProfile
      profile={businessProfile}
      handleUpdateBusinessProfile={handleUpdateBusinessProfile}
      isUpdatingBusinessProfile={isUpdatingBusinessProfile}
      form={form}
    />
  );
};

export default BusinessProfilePage;
