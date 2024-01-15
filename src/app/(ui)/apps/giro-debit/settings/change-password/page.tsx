'use client';
import { ChangePassword } from '@grc/components/giro-debit/settings/change-password';

const ChangePasswordPage = () => {
  const handleChangePassword = (payload: Record<string, any>) => {
    console.log('handleChangePassword values::', payload);
  };
  const isChangePasswordLoading = false;

  return (
    <ChangePassword
      handleChangePassword={handleChangePassword}
      isChangePasswordLoading={isChangePasswordLoading}
    />
  );
};

export default ChangePasswordPage;
