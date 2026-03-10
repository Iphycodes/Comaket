import { useEffect } from 'react';
import {
  useLazyGetShippingAddressesQuery,
  useLazyGetDefaultShippingAddressQuery,
  useCreateShippingAddressMutation,
  useUpdateShippingAddressMutation,
  useSetDefaultShippingAddressMutation,
  useDeleteShippingAddressMutation,
  CreateShippingAddressPayload,
  UpdateShippingAddressPayload,
} from '@grc/services/shipping-addresses';

interface UseShippingAddressesProps {
  fetchOnMount?: boolean;
  fetchDefault?: boolean;
}

export const useShippingAddresses = ({
  fetchOnMount = false,
  fetchDefault = false,
}: UseShippingAddressesProps = {}) => {
  // API hooks
  const [triggerGetAll, getAllResponse] = useLazyGetShippingAddressesQuery();
  const [triggerGetDefault, getDefaultResponse] = useLazyGetDefaultShippingAddressQuery();
  const [createAddress, createResponse] = useCreateShippingAddressMutation();
  const [updateAddress, updateResponse] = useUpdateShippingAddressMutation();
  const [setDefaultAddress, setDefaultResponse] = useSetDefaultShippingAddressMutation();
  const [deleteAddress, deleteResponse] = useDeleteShippingAddressMutation();

  // Fetch on mount if requested
  useEffect(() => {
    if (fetchOnMount) {
      triggerGetAll();
    }
  }, [fetchOnMount]);

  useEffect(() => {
    if (fetchDefault) {
      triggerGetDefault();
    }
  }, [fetchDefault]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleGetAll = async () => {
    try {
      const result = await triggerGetAll().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetDefault = async () => {
    try {
      const result = await triggerGetDefault().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleCreate = async (payload: CreateShippingAddressPayload) => {
    try {
      const result = await createAddress({
        payload,
        options: { successMessage: 'Shipping address added' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdate = async (id: string, payload: UpdateShippingAddressPayload) => {
    try {
      const result = await updateAddress({
        id,
        payload,
        options: { successMessage: 'Shipping address updated' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const result = await setDefaultAddress({
        id,
        options: { successMessage: 'Default address updated' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteAddress({
        id,
        options: { successMessage: 'Shipping address deleted' },
      }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    getAll: handleGetAll,
    getDefault: handleGetDefault,
    create: handleCreate,
    update: handleUpdate,
    setDefault: handleSetDefault,
    remove: handleDelete,

    // Data
    addresses: (getAllResponse?.data as any)?.data || getAllResponse?.data || [],
    defaultAddress: (getDefaultResponse?.data as any)?.data || getDefaultResponse?.data || null,

    // Loading states
    isLoading: getAllResponse.isLoading,
    isFetching: getAllResponse.isFetching,
    isLoadingDefault: getDefaultResponse.isLoading,
    isCreating: createResponse.isLoading,
    isUpdating: updateResponse.isLoading,
    isSettingDefault: setDefaultResponse.isLoading,
    isDeleting: deleteResponse.isLoading,

    // Success states
    isCreateSuccess: createResponse.isSuccess,
    isUpdateSuccess: updateResponse.isSuccess,
    isSetDefaultSuccess: setDefaultResponse.isSuccess,
    isDeleteSuccess: deleteResponse.isSuccess,

    // Error states
    error: getAllResponse.error,
    defaultError: getDefaultResponse.error,
    createError: createResponse.error,
    updateError: updateResponse.error,
    setDefaultError: setDefaultResponse.error,
    deleteError: deleteResponse.error,

    // Response objects
    getAllResponse,
    getDefaultResponse,
    createResponse,
    updateResponse,
    setDefaultResponse,
    deleteResponse,

    // Actions
    refetch: () => triggerGetAll(),
    refetchDefault: () => triggerGetDefault(),
  };
};
