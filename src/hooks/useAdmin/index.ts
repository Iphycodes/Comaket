import { useEffect } from 'react';
import {
  useLazyGetDashboardStatsQuery,
  useLazyAdminListUsersQuery,
  useAdminUpdateUserRoleMutation,
  useLazyAdminListCreatorsQuery,
  useAdminVerifyCreatorMutation,
  useAdminUpdateCreatorStatusMutation,
  AdminListUsersParams,
  AdminListCreatorsParams,
  UpdateUserRolePayload,
  UpdateCreatorStatusPayload,
} from '@grc/services/admin';

interface UseAdminProps {
  fetchDashboard?: boolean;
  fetchUsers?: boolean;
  usersParams?: AdminListUsersParams;
  fetchCreators?: boolean;
  creatorsParams?: AdminListCreatorsParams;
}

export const useAdmin = ({
  fetchDashboard = false,
  fetchUsers = false,
  usersParams = {},
  fetchCreators = false,
  creatorsParams = {},
}: UseAdminProps = {}) => {
  // API hooks
  const [triggerGetDashboard, getDashboardResponse] = useLazyGetDashboardStatsQuery();
  const [triggerListUsers, listUsersResponse] = useLazyAdminListUsersQuery();
  const [updateUserRole, updateUserRoleResponse] = useAdminUpdateUserRoleMutation();
  const [triggerListCreators, listCreatorsResponse] = useLazyAdminListCreatorsQuery();
  const [verifyCreator, verifyCreatorResponse] = useAdminVerifyCreatorMutation();
  const [updateCreatorStatus, updateCreatorStatusResponse] = useAdminUpdateCreatorStatusMutation();

  // Fetch on mount if requested
  useEffect(() => {
    if (fetchDashboard) {
      triggerGetDashboard();
    }
  }, [fetchDashboard]);

  useEffect(() => {
    if (fetchUsers) {
      triggerListUsers(usersParams);
    }
  }, [fetchUsers]);

  useEffect(() => {
    if (fetchCreators) {
      triggerListCreators(creatorsParams);
    }
  }, [fetchCreators]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleGetDashboard = async () => {
    try {
      const result = await triggerGetDashboard().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleListUsers = async (params: AdminListUsersParams = {}) => {
    try {
      const result = await triggerListUsers(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateUserRole = async (userId: string, data: UpdateUserRolePayload) => {
    try {
      const result = await updateUserRole({
        id: userId,
        payload: data,
        options: { successMessage: `User role updated to ${data.role}` },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleListCreators = async (params: AdminListCreatorsParams = {}) => {
    try {
      const result = await triggerListCreators(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyCreator = async (creatorId: string) => {
    try {
      const result = await verifyCreator({
        id: creatorId,
        options: { successMessage: 'Creator verified' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateCreatorStatus = async (creatorId: string, data: UpdateCreatorStatusPayload) => {
    try {
      const action = data.status === 'suspended' ? 'Creator suspended' : 'Creator reactivated';
      const result = await updateCreatorStatus({
        id: creatorId,
        payload: data,
        options: { successMessage: action },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    getDashboard: handleGetDashboard,
    listUsers: handleListUsers,
    updateUserRole: handleUpdateUserRole,
    listCreators: handleListCreators,
    verifyCreator: handleVerifyCreator,
    updateCreatorStatus: handleUpdateCreatorStatus,

    // Data
    dashboardStats: getDashboardResponse?.data?.data,
    users: listUsersResponse?.data?.data?.items || [],
    usersTotal: listUsersResponse?.data?.data?.total || 0,
    usersTotalPages: listUsersResponse?.data?.data?.totalPages || 0,
    creators: listCreatorsResponse?.data?.data?.items || [],
    creatorsTotal: listCreatorsResponse?.data?.data?.total || 0,
    creatorsTotalPages: listCreatorsResponse?.data?.data?.totalPages || 0,

    // Loading states
    isLoadingDashboard: getDashboardResponse.isLoading,
    isFetchingDashboard: getDashboardResponse.isFetching,
    isLoadingUsers: listUsersResponse.isLoading,
    isFetchingUsers: listUsersResponse.isFetching,
    isUpdatingUserRole: updateUserRoleResponse.isLoading,
    isLoadingCreators: listCreatorsResponse.isLoading,
    isFetchingCreators: listCreatorsResponse.isFetching,
    isVerifyingCreator: verifyCreatorResponse.isLoading,
    isUpdatingCreatorStatus: updateCreatorStatusResponse.isLoading,

    // Success states
    isUpdateUserRoleSuccess: updateUserRoleResponse.isSuccess,
    isVerifyCreatorSuccess: verifyCreatorResponse.isSuccess,
    isUpdateCreatorStatusSuccess: updateCreatorStatusResponse.isSuccess,

    // Error states
    dashboardError: getDashboardResponse.error,
    usersError: listUsersResponse.error,
    updateUserRoleError: updateUserRoleResponse.error,
    creatorsError: listCreatorsResponse.error,
    verifyCreatorError: verifyCreatorResponse.error,
    updateCreatorStatusError: updateCreatorStatusResponse.error,

    // Response states
    getDashboardResponse,
    listUsersResponse,
    updateUserRoleResponse,
    listCreatorsResponse,
    verifyCreatorResponse,
    updateCreatorStatusResponse,

    // Actions
    refetchDashboard: () => triggerGetDashboard(),
    refetchUsers: (params?: AdminListUsersParams) => triggerListUsers(params || usersParams),
    refetchCreators: (params?: AdminListCreatorsParams) =>
      triggerListCreators(params || creatorsParams),
  };
};
