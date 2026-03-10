import { useAppSelector } from '@grc/redux/store';
import {
  UpdateUserProfilePayload,
  useLazyGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from '@grc/services/users';
import { useEffect } from 'react';

interface UseUsersProps {
  fetchProfile?: boolean;
}

export const useUsers = ({ fetchProfile = false }: UseUsersProps = {}) => {
  // API hooks
  const [triggerGetUserProfile, getUserProfileResponse] = useLazyGetUserProfileQuery();
  const [updateUserProfile, updateUserProfileResponse] = useUpdateUserProfileMutation();

  const isAuthenticated = useAppSelector((state) => state.auth?.isAuthenticated);

  console.log('isAuthenticated oo:::::::', isAuthenticated);

  // Fetch profile on mount if requested
  useEffect(() => {
    if (fetchProfile && isAuthenticated) {
      triggerGetUserProfile();
    }
  }, [fetchProfile, isAuthenticated]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleGetUserProfile = async () => {
    try {
      const result = await triggerGetUserProfile().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateUserProfile = async (profileData: UpdateUserProfilePayload) => {
    try {
      const result = await updateUserProfile({
        payload: profileData,
        options: { successMessage: 'Profile updated successfully' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  console.log('user profffff::::', getUserProfileResponse?.data?.data);

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    getUserProfile: handleGetUserProfile,
    updateUserProfile: handleUpdateUserProfile,

    // Data
    userProfile: getUserProfileResponse?.data?.data,
    userProfileMeta: getUserProfileResponse?.data?.meta || {},

    // Loading states
    isLoadingProfile: getUserProfileResponse.isLoading,
    isFetchingProfile: getUserProfileResponse.isFetching,
    isUpdatingProfile: updateUserProfileResponse.isLoading,

    // Success states
    isUpdateProfileSuccess: updateUserProfileResponse.isSuccess,

    // Error states
    profileError: getUserProfileResponse.error,
    updateProfileError: updateUserProfileResponse.error,

    // Response states
    getUserProfileResponse,
    updateUserProfileResponse,

    // Actions
    refetchProfile: () => triggerGetUserProfile(),
  };
};
