'use client';
import { AppContext } from '@grc/app-context';
import { ProfileDetails } from '@grc/components/apps/settings/profile-details';
import { useAuth } from '@grc/hooks/useAuth';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { isEmpty, omit } from 'lodash';
import React, { useContext, useEffect } from 'react';

const ProfileDetailsPage = () => {
  const { authData } = useContext(AppContext);
  const { updateUserResponse, updateUser } = useAuth({ callUser: true });
  const [form] = Form.useForm();
  const { isLoading: isUpdatingProfile } = updateUserResponse;

  const initialValues = {
    firstName: authData?.firstName,
    lastName: authData?.lastName,
    email: authData?.email,
    phone: authData?.mobile?.phoneNumber,
    bvn: authData?.bvn,
    gender: authData?.gender,
    addressLine_1: authData?.address?.addressLine_1,
    city: authData?.address?.city,
    state: authData?.address?.state,
    country: authData?.address?.country,
    dob: !isEmpty(authData?.dob) ? dayjs(authData?.dob) : undefined,
  };

  const handleUpdateProfileDetails = (payload: Record<string, any>) => {
    updateUser({
      payload: {
        ...omit(payload, ['mobile', 'addressLine_1', 'city', 'state', 'country', 'bvn', 'dob']),
        bvn: String(payload?.bvn),
        dob: dayjs(payload.dob).format('YYYY-MM-DD'),
        address: {
          addressLine_1: payload.addressLine_1,
          city: payload.city,
          state: payload.state,
          country: payload.country,
        },
        mobile: {
          phoneNumber: `${payload.phone}`,
          isoCode: 'NG',
        },
      },
      options: { successMessage: `Profile successfully updated` },
    });
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <ProfileDetails
      handleUpdateProfileDetails={handleUpdateProfileDetails}
      isUpdatingProfile={isUpdatingProfile}
      form={form}
    />
  );
};

export default ProfileDetailsPage;
