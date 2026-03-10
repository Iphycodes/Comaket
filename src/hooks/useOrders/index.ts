import { useEffect } from 'react';
import {
  useCreateOrderMutation,
  useLazyGetMyOrdersQuery,
  useLazyGetSellerOrdersQuery,
  useLazyGetOrderByIdQuery,
  useUpdateOrderStatusMutation,
  CreateOrderPayload,
  UpdateOrderStatusPayload,
  QueryOrdersParams,
} from '@grc/services/orders';
import { usePagination } from '../usePagination';
import { useAuth } from '../useAuth';

interface UseOrdersProps {
  fetchMyOrders?: boolean;
  myOrdersParams?: QueryOrdersParams;
  fetchSellerOrders?: boolean;
  sellerOrdersParams?: QueryOrdersParams;
  orderId?: string;
}

export const useOrders = ({
  fetchMyOrders = false,
  myOrdersParams = {},
  fetchSellerOrders = false,
  sellerOrdersParams = {},
  orderId,
}: UseOrdersProps = {}) => {
  // API hooks
  const [createOrder, createOrderResponse] = useCreateOrderMutation();
  const [triggerGetMyOrders, getMyOrdersResponse] = useLazyGetMyOrdersQuery();
  const [triggerGetSellerOrders, getSellerOrdersResponse] = useLazyGetSellerOrdersQuery();
  const [triggerGetOrderById, getOrderByIdResponse] = useLazyGetOrderByIdQuery();
  const [updateOrderStatus, updateOrderStatusResponse] = useUpdateOrderStatusMutation();
  const { paginate: sellerOrdersPaginate, pagination: sellerOrdersPagination } = usePagination({
    key: 'getSellerOrders',
    perPage: 7,
  });
  const { paginate: myOrdersPaginate, pagination: myOrdersPagination } = usePagination({
    key: 'getMyOrders',
    perPage: 7,
  });

  const { isAuthenticated } = useAuth();

  const cusSellerOrdersParams = {
    ...sellerOrdersPaginate,
    ...sellerOrdersParams,
  };

  const customMyOrdersParams = {
    ...myOrdersParams,
    ...myOrdersPaginate,
  };

  // Fetch on mount if requested
  useEffect(() => {
    if (fetchMyOrders && isAuthenticated) {
      triggerGetMyOrders(customMyOrdersParams);
    }
  }, [fetchMyOrders, JSON.stringify(customMyOrdersParams)]);

  useEffect(() => {
    if (fetchSellerOrders && isAuthenticated) {
      triggerGetSellerOrders(cusSellerOrdersParams);
    }
  }, [fetchSellerOrders, JSON.stringify(cusSellerOrdersParams)]);

  useEffect(() => {
    if (orderId) {
      triggerGetOrderById(orderId);
    }
  }, [orderId]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleCreateOrder = async (data: CreateOrderPayload) => {
    try {
      const result = await createOrder({
        payload: data,
        options: { successMessage: 'Order placed successfully' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetMyOrders = async (params: QueryOrdersParams = {}) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await triggerGetMyOrders(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetSellerOrders = async (params: QueryOrdersParams = {}) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await triggerGetSellerOrders(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetOrderById = async (id: string) => {
    try {
      const result = await triggerGetOrderById(id).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateOrderStatus = async (id: string, data: UpdateOrderStatusPayload) => {
    try {
      const result = await updateOrderStatus({
        id,
        payload: data,
        options: { successMessage: `Order ${data.status}` },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    createOrder: handleCreateOrder,
    getMyOrders: handleGetMyOrders,
    getSellerOrders: handleGetSellerOrders,
    getOrderById: handleGetOrderById,
    updateOrderStatus: handleUpdateOrderStatus,

    // Data
    myOrders: getMyOrdersResponse?.data?.data || [],
    myOrdersTotal: getMyOrdersResponse?.data?.meta?.pagination?.total || 0,
    myOrdersTotalPages: getMyOrdersResponse?.data?.meta?.pagination?.totalPages || 0,
    sellerOrders: getSellerOrdersResponse?.data?.data || [],
    sellerOrdersTotal: getSellerOrdersResponse?.data?.meta?.pagination?.total || 0,
    sellerOrdersTotalPages: getSellerOrdersResponse?.data?.meta?.pagination?.totalPages || 0,
    orderDetail: getOrderByIdResponse?.data?.data,

    sellerOrdersPagination,
    myOrdersPagination,

    // Loading states
    isCreatingOrder: createOrderResponse.isLoading,
    isLoadingMyOrders: getMyOrdersResponse.isLoading,
    isFetchingMyOrders: getMyOrdersResponse.isFetching,
    isLoadingSellerOrders: getSellerOrdersResponse.isLoading,
    isFetchingSellerOrders: getSellerOrdersResponse.isFetching,
    isLoadingOrderDetail: getOrderByIdResponse.isLoading,
    isFetchingOrderDetail: getOrderByIdResponse.isFetching,
    isUpdatingOrderStatus: updateOrderStatusResponse.isLoading,

    // Success states
    isCreateOrderSuccess: createOrderResponse.isSuccess,
    isUpdateStatusSuccess: updateOrderStatusResponse.isSuccess,

    // Error states
    createOrderError: createOrderResponse.error,
    myOrdersError: getMyOrdersResponse.error,
    sellerOrdersError: getSellerOrdersResponse.error,
    orderDetailError: getOrderByIdResponse.error,
    updateStatusError: updateOrderStatusResponse.error,

    // Response states
    createOrderResponse,
    getMyOrdersResponse,
    getSellerOrdersResponse,
    getOrderByIdResponse,
    updateOrderStatusResponse,

    // Actions
    refetchMyOrders: (params?: QueryOrdersParams) =>
      isAuthenticated && triggerGetMyOrders(params || myOrdersParams),
    refetchSellerOrders: (params?: QueryOrdersParams) =>
      isAuthenticated && triggerGetSellerOrders(params || sellerOrdersParams),
    refetchOrderDetail: (id: string) => triggerGetOrderById(id),
  };
};
