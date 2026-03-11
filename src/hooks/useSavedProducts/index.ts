import { useContext, useEffect } from 'react';
import {
  useToggleSaveProductMutation,
  useCheckSavedStatusMutation,
  useLazyGetSavedProductsQuery,
  useLazyGetSavedCountQuery,
  useRemoveSavedProductMutation,
  QuerySavedProductsParams,
} from '@grc/services/saved-product';
import { useAuth } from '../useAuth';
import { AppContext } from '@grc/app-context';

interface UseSavedProductsProps {
  fetchSaved?: boolean;
  savedParams?: QuerySavedProductsParams;
  fetchCount?: boolean;
}

export const useSavedProducts = ({
  fetchSaved = false,
  savedParams = {},
  fetchCount = false,
}: UseSavedProductsProps = {}) => {
  // API hooks
  const [toggleSave, toggleSaveResponse] = useToggleSaveProductMutation();
  const [checkSavedStatus, checkSavedStatusResponse] = useCheckSavedStatusMutation();
  const [triggerGetSaved, getSavedResponse] = useLazyGetSavedProductsQuery();
  const [triggerGetCount, getCountResponse] = useLazyGetSavedCountQuery();
  const [removeSaved, removeSavedResponse] = useRemoveSavedProductMutation();
  const { isAuthenticated } = useAuth();
  const { setIsAuthModalOpen } = useContext(AppContext);

  // Fetch on mount if requested
  useEffect(() => {
    if (fetchSaved && isAuthenticated) {
      triggerGetSaved(savedParams);
    }
  }, [fetchSaved]);

  useEffect(() => {
    if (fetchCount && isAuthenticated) {
      triggerGetCount();
    }
  }, [fetchCount]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleToggleSave = async (listingId: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const result = await toggleSave({
        payload: { listingId },
        options: { noSuccessMessage: true },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleCheckSavedStatus = async (listingIds: string[]) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await checkSavedStatus({
        payload: { listingIds },
        options: { noSuccessMessage: true },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetSaved = async (params: QuerySavedProductsParams = {}) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await triggerGetSaved(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetCount = async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await triggerGetCount().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveSaved = async (listingId: string) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await removeSaved({
        listingId,
        options: { successMessage: 'Removed from saved items' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    toggleSave: handleToggleSave,
    checkSavedStatus: handleCheckSavedStatus,
    getSavedProducts: handleGetSaved,
    getSavedCount: handleGetCount,
    removeSavedProduct: handleRemoveSaved,

    // Data
    savedProducts: getSavedResponse?.data?.data || [],
    savedTotal: getSavedResponse?.data?.meta?.pagination?.total || 0,
    savedTotalPages: getSavedResponse?.data?.meta?.pagination?.totalPages || 0,
    savedCount: getCountResponse?.data?.data?.count || 0,
    savedStatusMap: checkSavedStatusResponse?.data?.data || {},
    lastToggleResult: toggleSaveResponse?.data?.data,

    // Loading states
    isToggling: toggleSaveResponse.isLoading,
    isCheckingStatus: checkSavedStatusResponse.isLoading,
    isLoadingSaved: getSavedResponse.isLoading,
    isFetchingSaved: getSavedResponse.isFetching,
    isLoadingCount: getCountResponse.isLoading,
    isRemoving: removeSavedResponse.isLoading,

    // Success states
    isToggleSuccess: toggleSaveResponse.isSuccess,
    isRemoveSuccess: removeSavedResponse.isSuccess,

    // Error states
    toggleError: toggleSaveResponse.error,
    checkStatusError: checkSavedStatusResponse.error,
    savedError: getSavedResponse.error,
    countError: getCountResponse.error,
    removeError: removeSavedResponse.error,

    // Response states
    toggleSaveResponse,
    checkSavedStatusResponse,
    getSavedResponse,
    getCountResponse,
    removeSavedResponse,

    // Actions
    refetchSaved: (params?: QuerySavedProductsParams) => triggerGetSaved(params || savedParams),
    refetchCount: () => triggerGetCount(),
  };
};
