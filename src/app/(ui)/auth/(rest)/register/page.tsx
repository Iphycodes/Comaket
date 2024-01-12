'use client';
import { useContext, useEffect } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import Register from '@grc/components/auth/register';
import { useRouter } from 'next/navigation';
import { omit } from 'lodash';
import { useAuth } from '@grc/hooks/useAuth';
import { Form } from 'antd';

const RegisterPage = () => {
  const mobileResponsive = useMediaQuery(mediaSize.mobile);
  const { theme } = useContext(AppContext);
  const router = useRouter();
  const [form] = Form.useForm();
  const { register, registerResponse } = useAuth({});
  const { isLoading, isSuccess } = registerResponse;

  const handleRegisterUser = (values: Record<string, any>) => {
    const payload = {
      ...omit(values, ['confirm-password', 'phone']),
      mobile: {
        phoneNumber: values?.phone,
        isoCode: 'NG',
      },
    };
    register({
      payload,
      options: {
        successMessage: `A 6 digit code has been sent to ${values?.email} Please enter the verification code below`,
      },
    });
  };
  useEffect(() => {
    if (isSuccess) {
      const { data } = registerResponse;
      router.push(`/auth/verify-email?email=${data?.data?.email}`);
    }
  }, [registerResponse]);

  return (
    <Register
      mobileResponsive={mobileResponsive}
      theme={theme}
      handleRegisterUser={handleRegisterUser}
      isRegisterLoading={isLoading}
      form={form}
    />
  );
};

export default RegisterPage;
