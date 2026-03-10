import { useEffect } from 'react';
import {
  useCreateFeaturedWorkMutation,
  useUpdateFeaturedWorkMutation,
  useDeleteFeaturedWorkMutation,
  useDeleteAllFeaturedWorksMutation,
  useReorderFeaturedWorksMutation,
  useLazyGetFeaturedWorksQuery,
  useLazyGetFeaturedWorksCountQuery,
  FeaturedWorkOwnerType,
  CreateFeaturedWorkPayload,
  UpdateFeaturedWorkPayload,
  ReorderFeaturedWorksPayload,
  FeaturedWorksQueryParams,
  FeaturedWork,
} from '@grc/services/featured-works';

interface UseFeaturedWorksProps {
  /** Auto-fetch works on mount */
  fetchWorks?: boolean;
  /** Auto-fetch count on mount */
  fetchCount?: boolean;
  /** Required if fetchWorks or fetchCount is true */
  ownerType?: FeaturedWorkOwnerType;
  /** Required if fetchWorks or fetchCount is true */
  ownerId?: string;
  /** Pagination params for auto-fetch */
  page?: number;
  perPage?: number;
}

export const useFeaturedWorks = ({
  fetchWorks = false,
  fetchCount = false,
  ownerType,
  ownerId,
  page = 1,
  perPage = 20,
}: UseFeaturedWorksProps = {}) => {
  // API hooks
  const [createWork, createWorkResponse] = useCreateFeaturedWorkMutation();
  const [updateWork, updateWorkResponse] = useUpdateFeaturedWorkMutation();
  const [deleteWork, deleteWorkResponse] = useDeleteFeaturedWorkMutation();
  const [deleteAllWorks, deleteAllWorksResponse] = useDeleteAllFeaturedWorksMutation();
  const [reorderWorks, reorderWorksResponse] = useReorderFeaturedWorksMutation();
  const [triggerGetWorks, getWorksResponse] = useLazyGetFeaturedWorksQuery();
  const [triggerGetCount, getCountResponse] = useLazyGetFeaturedWorksCountQuery();

  // Auto-fetch on mount
  useEffect(() => {
    if (fetchWorks && ownerType && ownerId) {
      triggerGetWorks({ ownerType, ownerId, page, perPage });
    }
  }, [fetchWorks, ownerType, ownerId, page, perPage]);

  useEffect(() => {
    if (fetchCount && ownerType && ownerId) {
      triggerGetCount({ ownerType, ownerId });
    }
  }, [fetchCount, ownerType, ownerId]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleCreate = async (data: CreateFeaturedWorkPayload) => {
    try {
      const result = await createWork({
        payload: data,
        options: { successMessage: 'Featured work added' },
      }).unwrap();
      return result?.data as FeaturedWork;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (id: string, data: UpdateFeaturedWorkPayload) => {
    try {
      const result = await updateWork({
        id,
        payload: data,
        options: { successMessage: 'Featured work updated' },
      }).unwrap();
      return result?.data as FeaturedWork;
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const result = await deleteWork(id).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteAll = async (targetOwnerType: FeaturedWorkOwnerType, targetOwnerId: string) => {
    try {
      const result = await deleteAllWorks({
        ownerType: targetOwnerType,
        ownerId: targetOwnerId,
      }).unwrap();
      return result?.data as { deletedCount: number };
    } catch (error) {
      throw error;
    }
  };

  const handleReorder = async (data: ReorderFeaturedWorksPayload) => {
    try {
      const result = await reorderWorks({
        payload: data,
        options: { successMessage: 'Featured works reordered' },
      }).unwrap();
      return result?.data as FeaturedWork[];
    } catch (error) {
      throw error;
    }
  };

  const handleGetWorks = async (params: FeaturedWorksQueryParams) => {
    try {
      const result = await triggerGetWorks(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    createFeaturedWork: handleCreate,
    updateFeaturedWork: handleUpdate,
    deleteFeaturedWork: handleDelete,
    deleteAllFeaturedWorks: handleDeleteAll,
    reorderFeaturedWorks: handleReorder,
    getFeaturedWorks: handleGetWorks,

    // Data
    featuredWorks: (getWorksResponse?.data?.data || []) as FeaturedWork[],
    featuredWorksTotal: getWorksResponse?.data?.meta?.pagination?.total || 0,
    featuredWorksTotalPages: getWorksResponse?.data?.meta?.pagination?.totalPages || 0,
    featuredWorksCount: getCountResponse?.data?.data?.count || 0,
    featuredWorksLimit: getCountResponse?.data?.data?.limit || 0,
    featuredWorksPlan: getCountResponse?.data?.data?.plan || 'starter',

    // Loading states
    isCreatingWork: createWorkResponse.isLoading,
    isUpdatingWork: updateWorkResponse.isLoading,
    isDeletingWork: deleteWorkResponse.isLoading,
    isDeletingAllWorks: deleteAllWorksResponse.isLoading,
    isReorderingWorks: reorderWorksResponse.isLoading,
    isLoadingWorks: getWorksResponse.isLoading,
    isFetchingWorks: getWorksResponse.isFetching,
    isLoadingCount: getCountResponse.isLoading,

    // Success states
    isCreateSuccess: createWorkResponse.isSuccess,
    isUpdateSuccess: updateWorkResponse.isSuccess,
    isDeleteSuccess: deleteWorkResponse.isSuccess,
    isDeleteAllSuccess: deleteAllWorksResponse.isSuccess,
    isReorderSuccess: reorderWorksResponse.isSuccess,

    // Error states
    createError: createWorkResponse.error,
    updateError: updateWorkResponse.error,
    deleteError: deleteWorkResponse.error,
    deleteAllError: deleteAllWorksResponse.error,
    reorderError: reorderWorksResponse.error,
    worksError: getWorksResponse.error,
    countError: getCountResponse.error,

    // Response states
    createWorkResponse,
    updateWorkResponse,
    deleteWorkResponse,
    deleteAllWorksResponse,
    reorderWorksResponse,
    getWorksResponse,
    getCountResponse,

    // Actions
    refetchWorks: (params?: FeaturedWorksQueryParams) =>
      triggerGetWorks(params || { ownerType: ownerType!, ownerId: ownerId!, page, perPage }),
    refetchCount: () => triggerGetCount({ ownerType: ownerType!, ownerId: ownerId! }),
  };
};
