import { useEffect } from 'react';
import {
  useCheckUsernameMutation,
  useBecomeCreatorMutation,
  useLazyGetMyCreatorProfileQuery,
  useUpdateCreatorProfileMutation,
  useUpdateBankDetailsMutation,
  useLazyBrowseCreatorsQuery,
  useLazyGetCreatorBySlugQuery,
  BecomeCreatorPayload,
  UpdateCreatorPayload,
  UpdateBankDetailsPayload,
  BrowseCreatorsParams,
} from '@grc/services/creators';
import { usePagination } from '../usePagination';

interface UseCreatorsProps {
  fetchProfile?: boolean;
  fetchCreators?: boolean;
  creatorsParams?: BrowseCreatorsParams;
  creatorSlug?: string;
  customPaginate?: { page: number; perPage: number };
  search?: string;
}

export const useCreators = ({
  fetchProfile = false,
  fetchCreators = false,
  creatorsParams = {},
  creatorSlug,
  customPaginate,
  search = '',
}: UseCreatorsProps = {}) => {
  // ── Pagination ──────────────────────────────────────────────────────
  const {
    paginate,
    pagination: creatorsPagination,
    setPaginate,
  } = usePagination({
    key: 'browseCreators',
    perPage: 12,
  });

  const cusPaginate = customPaginate ? customPaginate : paginate;

  // ── API hooks ───────────────────────────────────────────────────────
  const [checkUsername, checkUsernameResponse] = useCheckUsernameMutation();
  const [becomeCreator, becomeCreatorResponse] = useBecomeCreatorMutation();
  const [triggerGetProfile, getProfileResponse] = useLazyGetMyCreatorProfileQuery();
  const [updateProfile, updateProfileResponse] = useUpdateCreatorProfileMutation();
  const [updateBankDetails, updateBankDetailsResponse] = useUpdateBankDetailsMutation();
  const [triggerBrowseCreators, browseCreatorsResponse] = useLazyBrowseCreatorsQuery();
  const [triggerGetBySlug, getBySlugResponse] = useLazyGetCreatorBySlugQuery();

  // ── Build browse params ─────────────────────────────────────────────
  const browseParams: BrowseCreatorsParams = {
    search,
    ...creatorsParams,
    ...cusPaginate,
  };

  // ── Auto-fetch on mount / param changes ─────────────────────────────
  useEffect(() => {
    if (fetchProfile) {
      triggerGetProfile();
    }
  }, [fetchProfile]);

  useEffect(() => {
    if (fetchCreators) {
      triggerBrowseCreators(browseParams);
    }
  }, [fetchCreators, JSON.stringify(browseParams)]);

  useEffect(() => {
    if (creatorSlug) {
      triggerGetBySlug(creatorSlug);
    }
  }, [creatorSlug]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleCheckUsername = async (username: string): Promise<boolean> => {
    try {
      const result = await checkUsername({
        payload: { username },
        options: { noSuccessMessage: true },
      }).unwrap();
      return result?.data?.available ?? false;
    } catch (error) {
      throw error;
    }
  };

  const handleBecomeCreator = async (data: BecomeCreatorPayload) => {
    try {
      const result = await becomeCreator({
        payload: data,
        options: { successMessage: 'Creator profile created successfully' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetProfile = async () => {
    try {
      const result = await triggerGetProfile().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateProfile = async (data: UpdateCreatorPayload) => {
    try {
      const result = await updateProfile({
        payload: data,
        options: { successMessage: 'Creator profile updated' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateBankDetails = async (data: UpdateBankDetailsPayload) => {
    try {
      const result = await updateBankDetails({
        payload: data,
        options: { successMessage: 'Bank details updated' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleBrowseCreators = async (params: BrowseCreatorsParams = {}) => {
    try {
      const result = await triggerBrowseCreators(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetCreatorBySlug = async (slug: string) => {
    try {
      const result = await triggerGetBySlug(slug).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    checkUsername: handleCheckUsername,
    becomeCreator: handleBecomeCreator,
    getCreatorProfile: handleGetProfile,
    updateCreatorProfile: handleUpdateProfile,
    updateBankDetails: handleUpdateBankDetails,
    browseCreators: handleBrowseCreators,
    getCreatorBySlug: handleGetCreatorBySlug,

    // Data
    creatorProfile: getProfileResponse?.data?.data,
    creatorProfileMeta: getProfileResponse?.data?.meta || {},
    creatorsList: browseCreatorsResponse?.data?.data || [],
    creatorsTotal: browseCreatorsResponse?.data?.meta?.pagination?.total || 0,
    creatorsTotalPages: browseCreatorsResponse?.data?.data?.totalPages || 0,
    creatorBySlug: getBySlugResponse?.data?.data,

    // Pagination
    creatorsPagination,
    setPaginate,

    // Loading states
    isCheckingUsername: checkUsernameResponse.isLoading,
    isBecomingCreator: becomeCreatorResponse.isLoading,
    isLoadingProfile: getProfileResponse.isLoading,
    isFetchingProfile: getProfileResponse.isFetching,
    isUpdatingProfile: updateProfileResponse.isLoading,
    isUpdatingBankDetails: updateBankDetailsResponse.isLoading,
    isLoadingCreators: browseCreatorsResponse.isLoading,
    isFetchingCreators: browseCreatorsResponse.isFetching,
    isLoadingCreatorBySlug: getBySlugResponse.isLoading,

    // Success states
    isBecomeCreatorSuccess: becomeCreatorResponse.isSuccess,
    isUpdateProfileSuccess: updateProfileResponse.isSuccess,
    isUpdateBankDetailsSuccess: updateBankDetailsResponse.isSuccess,

    // Error states
    checkUsernameError: checkUsernameResponse.error,
    becomeCreatorError: becomeCreatorResponse.error,
    profileError: getProfileResponse.error,
    updateProfileError: updateProfileResponse.error,
    updateBankDetailsError: updateBankDetailsResponse.error,
    creatorsError: browseCreatorsResponse.error,
    creatorBySlugError: getBySlugResponse.error,

    // Response states
    checkUsernameResponse,
    becomeCreatorResponse,
    getProfileResponse,
    updateProfileResponse,
    updateBankDetailsResponse,
    browseCreatorsResponse,
    getBySlugResponse,

    // Actions
    refetchProfile: () => triggerGetProfile(),
    refetchCreators: (params?: BrowseCreatorsParams) =>
      triggerBrowseCreators(params || browseParams),
  };
};
