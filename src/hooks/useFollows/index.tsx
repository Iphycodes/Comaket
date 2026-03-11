import { useContext, useEffect } from 'react';
import {
  useToggleFollowMutation,
  useCheckFollowMutation,
  useLazyGetMyFollowsQuery,
  useLazyGetFollowCountQuery,
  useLazyGetFollowersQuery,
  FollowTargetType,
  ToggleFollowPayload,
  CheckFollowPayload,
  FollowsParams,
  FollowersParams,
} from '@grc/services/follows';
import { useAuth } from '../useAuth';
import { AppContext } from '@grc/app-context';

interface UseFollowsProps {
  fetchMyFollows?: boolean;
  followsParams?: FollowsParams;
  fetchFollowCount?: boolean;
  followCountTargetType?: FollowTargetType;
}

export const useFollows = ({
  fetchMyFollows = false,
  followsParams = {},
  fetchFollowCount = false,
  followCountTargetType,
}: UseFollowsProps = {}) => {
  // API hooks
  const [toggleFollow, toggleFollowResponse] = useToggleFollowMutation();
  const [checkFollow, checkFollowResponse] = useCheckFollowMutation();
  const [triggerGetMyFollows, getMyFollowsResponse] = useLazyGetMyFollowsQuery();
  const [triggerGetFollowCount, getFollowCountResponse] = useLazyGetFollowCountQuery();
  const [triggerGetFollowers, getFollowersResponse] = useLazyGetFollowersQuery();
  const { isAuthenticated } = useAuth();
  const { setIsAuthModalOpen } = useContext(AppContext);

  // Fetch on mount if requested
  useEffect(() => {
    if (fetchMyFollows && isAuthenticated) {
      triggerGetMyFollows(followsParams);
    }
  }, [fetchMyFollows]);

  useEffect(() => {
    if (fetchFollowCount) {
      triggerGetFollowCount(followCountTargetType);
    }
  }, [fetchFollowCount]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleToggleFollow = async (data: ToggleFollowPayload) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const result = await toggleFollow({
        payload: data,
        options: {},
      }).unwrap();
      return result?.data as { followed: boolean; totalFollowers: number };
    } catch (error) {
      throw error;
    }
  };

  const handleCheckFollow = async (data: CheckFollowPayload) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await checkFollow({
        payload: data,
        options: {
          noSuccessMessage: true,
        },
      }).unwrap();
      return result?.data as Record<string, boolean>;
    } catch (error) {
      throw error;
    }
  };

  const handleGetMyFollows = async (params: FollowsParams = {}) => {
    try {
      const result = await triggerGetMyFollows(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetFollowers = async (
    targetType: FollowTargetType,
    targetId: string,
    params: FollowersParams = {}
  ) => {
    try {
      const result = await triggerGetFollowers({
        targetType,
        targetId,
        params,
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    toggleFollow: handleToggleFollow,
    checkFollow: handleCheckFollow,
    getMyFollows: handleGetMyFollows,
    getFollowers: handleGetFollowers,

    // Data
    myFollows: getMyFollowsResponse?.data?.data || [],
    myFollowsTotal: getMyFollowsResponse?.data?.meta?.pagination?.total || 0,
    myFollowsTotalPages: getMyFollowsResponse?.data?.meta?.pagination?.totalPages || 0,
    followCount: getFollowCountResponse?.data?.data?.count || 0,
    followers: getFollowersResponse?.data?.data || [],
    followersTotal: getFollowersResponse?.data?.meta?.pagination?.total || 0,

    // Loading states
    isTogglingFollow: toggleFollowResponse.isLoading,
    isCheckingFollow: checkFollowResponse.isLoading,
    isLoadingMyFollows: getMyFollowsResponse.isLoading,
    isFetchingMyFollows: getMyFollowsResponse.isFetching,
    isLoadingFollowCount: getFollowCountResponse.isLoading,
    isLoadingFollowers: getFollowersResponse.isLoading,
    isFetchingFollowers: getFollowersResponse.isFetching,

    // Success states
    isToggleFollowSuccess: toggleFollowResponse.isSuccess,

    // Error states
    toggleFollowError: toggleFollowResponse.error,
    checkFollowError: checkFollowResponse.error,
    myFollowsError: getMyFollowsResponse.error,
    followCountError: getFollowCountResponse.error,
    followersError: getFollowersResponse.error,

    // Response states
    toggleFollowResponse,
    checkFollowResponse,
    getMyFollowsResponse,
    getFollowCountResponse,
    getFollowersResponse,

    // Actions
    refetchMyFollows: (params?: FollowsParams) => triggerGetMyFollows(params || followsParams),
    refetchFollowCount: () => triggerGetFollowCount(followCountTargetType),
  };
};
