import { MutationTrigger } from '@reduxjs/toolkit/dist/query/react/buildHooks';
import { useUpdatePasswordMutation } from '@grc/services/settings/change-password';

interface useChangePasswordReturnProps {
  updatePassword: MutationTrigger<any>;
  updatePasswordResponse: Record<string, any>;
}

export const useChangePassword = (): useChangePasswordReturnProps => {
  const [updatePassword, updatePasswordResponse] = useUpdatePasswordMutation();

  return {
    updatePassword,
    updatePasswordResponse,
  };
};
