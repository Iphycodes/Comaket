'use client';
import { ChangePassword } from '@grc/components/apps/settings/change-password';
import { useChangePassword } from '@grc/hooks/useChangePassword';
import { Form } from 'antd';
import { omit } from 'lodash';
import { useEffect } from 'react';

const ChangePasswordPage = () => {
  const { updatePassword, updatePasswordResponse } = useChangePassword();
  const [form] = Form.useForm();

  const handleChangePassword = (values: Record<string, any>) => {
    const payload = {
      ...omit(values, ['confirmPassword']),
    };

    updatePassword({
      payload,
      options: {
        successMessage: `Password successfully updated`,
      },
    });
  };

  const { isLoading: isChangePasswordLoading, isSuccess } = updatePasswordResponse;

  useEffect(() => {
    if (isSuccess) {
      form.resetFields();
    }
  }, [isSuccess, form]);

  return (
    <ChangePassword
      handleChangePassword={handleChangePassword}
      isChangePasswordLoading={isChangePasswordLoading}
      form={form}
    />
  );
};

export default ChangePasswordPage;
