import { useEffect } from 'react';
import {
  useCreateStoreMutation,
  useLazyGetMyStoresQuery,
  useLazyGetStoreByIdQuery,
  useUpdateStoreMutation,
  useToggleStoreVisibilityMutation,
  useDeleteStoreMutation,
  useLazyGetStoreBySlugQuery,
  useLazyBrowseStoresQuery,
  CreateStorePayload,
  UpdateStorePayload,
  BrowseStoresParams,
} from '@grc/services/stores';
import { usePagination } from '../usePagination';
import { useAuth } from '../useAuth';

interface UseStoresProps {
  fetchMyStores?: boolean;
  storeId?: string;
  storeSlug?: string;
  // Browse (public)
  fetchStores?: boolean;
  storesParams?: BrowseStoresParams;
  customPaginate?: { page: number; perPage: number };
  search?: string;
}

export const useStores = ({
  fetchMyStores = false,
  storeId,
  storeSlug,
  fetchStores = false,
  storesParams = {},
  customPaginate,
  search = '',
}: UseStoresProps = {}) => {
  // ── Pagination ──────────────────────────────────────────────────────
  const {
    paginate,
    pagination: storesPagination,
    setPaginate,
  } = usePagination({
    key: 'browseStores',
    perPage: 12,
  });

  const cusPaginate = customPaginate ? customPaginate : paginate;

  // ── API hooks ───────────────────────────────────────────────────────
  const [createStore, createStoreResponse] = useCreateStoreMutation();
  const [triggerGetMyStores, getMyStoresResponse] = useLazyGetMyStoresQuery();
  const [triggerGetStoreById, getStoreByIdResponse] = useLazyGetStoreByIdQuery();
  const [updateStore, updateStoreResponse] = useUpdateStoreMutation();
  const [toggleVisibility, toggleVisibilityResponse] = useToggleStoreVisibilityMutation();
  const [deleteStore, deleteStoreResponse] = useDeleteStoreMutation();
  const [triggerGetStoreBySlug, getStoreBySlugResponse] = useLazyGetStoreBySlugQuery();
  const [triggerBrowseStores, browseStoresResponse] = useLazyBrowseStoresQuery();
  const { isAuthenticated } = useAuth({});

  // ── Build browse params ─────────────────────────────────────────────
  const browseParams: BrowseStoresParams = {
    search,
    ...storesParams,
    ...cusPaginate,
  };

  // ── Auto-fetch on mount / param changes ─────────────────────────────
  useEffect(() => {
    if (fetchMyStores && isAuthenticated) {
      triggerGetMyStores();
    }
  }, [fetchMyStores, isAuthenticated]);

  useEffect(() => {
    if (storeId) {
      triggerGetStoreById(storeId);
    }
  }, [storeId]);

  useEffect(() => {
    if (storeSlug) {
      triggerGetStoreBySlug(storeSlug);
    }
  }, [storeSlug]);

  useEffect(() => {
    if (fetchStores) {
      triggerBrowseStores(browseParams);
    }
  }, [fetchStores, JSON.stringify(browseParams)]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleCreateStore = async (data: CreateStorePayload | Record<string, any>) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await createStore({
        payload: data,
        options: { successMessage: 'Store created successfully' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetMyStores = async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await triggerGetMyStores().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetStoreById = async (id: string) => {
    try {
      const result = await triggerGetStoreById(id).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateStore = async (id: string, data: UpdateStorePayload) => {
    try {
      const result = await updateStore({
        id,
        payload: data,
        options: { successMessage: 'Store updated successfully' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleToggleVisibility = async (id: string, visible: boolean) => {
    try {
      const result = await toggleVisibility({
        payload: { visible },
        id,
        options: { successMessage: 'Store visibility updated' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteStore = async (id: string) => {
    try {
      const result = await deleteStore({
        id,
        options: { successMessage: 'Store closed permanently' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetStoreBySlug = async (slug: string) => {
    try {
      const result = await triggerGetStoreBySlug(slug).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleBrowseStores = async (params: BrowseStoresParams = {}) => {
    try {
      const result = await triggerBrowseStores(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    createStore: handleCreateStore,
    getMyStores: handleGetMyStores,
    getStoreById: handleGetStoreById,
    updateStore: handleUpdateStore,
    toggleVisibility: handleToggleVisibility,
    deleteStore: handleDeleteStore,
    getStoreBySlug: handleGetStoreBySlug,
    browseStores: handleBrowseStores,

    // Data
    myStores: getMyStoresResponse?.data?.data || [],
    storeDetail: getStoreByIdResponse?.data?.data,
    storeBySlug: getStoreBySlugResponse?.data?.data,
    storesList: browseStoresResponse?.data?.data || [],
    storesTotal: browseStoresResponse?.data?.meta?.pagination?.total || 0,
    storesTotalPages: browseStoresResponse?.data?.data?.totalPages || 0,

    // Pagination
    storesPagination,
    setPaginate,

    // Loading states
    isCreatingStore: createStoreResponse.isLoading,
    isLoadingMyStores: getMyStoresResponse.isLoading,
    isFetchingMyStores: getMyStoresResponse.isFetching,
    isLoadingStoreDetail: getStoreByIdResponse.isLoading,
    isUpdatingStore: updateStoreResponse.isLoading,
    isTogglingVisibility: toggleVisibilityResponse.isLoading,
    isDeletingStore: deleteStoreResponse.isLoading,
    isLoadingStoreBySlug: getStoreBySlugResponse.isLoading,
    isLoadingStores: browseStoresResponse.isLoading,
    isFetchingStores: browseStoresResponse.isFetching,

    // Success states
    isCreateStoreSuccess: createStoreResponse.isSuccess,
    isUpdateStoreSuccess: updateStoreResponse.isSuccess,
    isToggleVisibilitySuccess: toggleVisibilityResponse.isSuccess,
    isDeleteStoreSuccess: deleteStoreResponse.isSuccess,

    // Error states
    createStoreError: createStoreResponse.error,
    myStoresError: getMyStoresResponse.error,
    storeDetailError: getStoreByIdResponse.error,
    updateStoreError: updateStoreResponse.error,
    toggleVisibilityError: toggleVisibilityResponse.error,
    deleteStoreError: deleteStoreResponse.error,
    storeBySlugError: getStoreBySlugResponse.error,
    storesError: browseStoresResponse.error,

    // Response states
    createStoreResponse,
    getMyStoresResponse,
    getStoreByIdResponse,
    updateStoreResponse,
    toggleVisibilityResponse,
    deleteStoreResponse,
    getStoreBySlugResponse,
    browseStoresResponse,

    // Actions
    refetchMyStores: () => triggerGetMyStores(),
    refetchStoreDetail: (id: string) => triggerGetStoreById(id),
    refetchStores: (params?: BrowseStoresParams) => triggerBrowseStores(params || browseParams),
  };
};
