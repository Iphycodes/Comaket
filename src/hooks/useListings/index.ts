import { useEffect } from 'react';
import {
  useCreateListingMutation,
  useLazyGetListingsQuery,
  useLazyGetListingByIdQuery,
  useLazyGetMyListingsQuery,
  useLazyGetListingsByStoreQuery,
  useLazyGetListingsByCreatorQuery,
  useUpdateListingMutation,
  useDeleteListingMutation,
  useLazyGetPendingListingsQuery,
  useAdminReviewListingMutation,
  useAdminConfirmFeeMutation,
  useSubmitCounterOfferMutation,
  useAcceptOfferMutation,
  useRejectOfferMutation,
  useDelistListingMutation,
  CreateListingPayload,
  UpdateListingPayload,
  AdminReviewListingPayload,
  QueryListingsParams,
} from '@grc/services/listings';
import { usePagination } from '../usePagination';

interface UseListingsProps {
  // Public
  fetchListings?: boolean;
  listingsParams?: QueryListingsParams;
  listingId?: string;
  // Seller
  fetchMyListings?: boolean;
  myListingsParams?: QueryListingsParams;
  // Store page
  storeId?: string;
  storeListingsParams?: QueryListingsParams;
  // Creator page
  creatorId?: string;
  creatorListingsParams?: QueryListingsParams;
  // Admin
  fetchPending?: boolean;
  pendingParams?: QueryListingsParams;
  customPaginate?: { page: number; perPage: number };
  all?: boolean;
  search?: string;
}

export const useListings = ({
  fetchListings = false,
  listingsParams = {},
  listingId,
  fetchMyListings = false,
  myListingsParams = {},
  storeId,
  storeListingsParams = {},
  creatorId,
  creatorListingsParams = {},
  fetchPending = false,
  pendingParams = {},
  customPaginate,
  all = false,
  search = '',
}: UseListingsProps = {}) => {
  // ── API hooks ─────────────────────────────────────────────

  const { paginate, pagination: listingPagination } = usePagination({
    key: 'getListings',
    perPage: 10,
  });
  const { paginate: myListingPaginate, pagination: myListingPagination } = usePagination({
    key: 'getMyListings',
    perPage: 7,
  });

  const cusPaginate = customPaginate ? customPaginate : paginate;
  const myListingCusPagintate = customPaginate ? customPaginate : myListingPaginate;

  // Seller
  const [createListing, createListingResponse] = useCreateListingMutation();
  const [updateListing, updateListingResponse] = useUpdateListingMutation();
  const [deleteListing, deleteListingResponse] = useDeleteListingMutation();
  const [submitCounterOffer, submitCounterOfferResponse] = useSubmitCounterOfferMutation();
  const [acceptOffer, acceptOfferResponse] = useAcceptOfferMutation();
  const [rejectOffer, rejectOfferResponse] = useRejectOfferMutation();
  const [delistListing, delistListingResponse] = useDelistListingMutation();

  // Public / queries
  const [triggerGetListings, getListingsResponse] = useLazyGetListingsQuery();
  const [triggerGetListingById, getListingByIdResponse] = useLazyGetListingByIdQuery();
  const [triggerGetMyListings, getMyListingsResponse] = useLazyGetMyListingsQuery();
  const [triggerGetByStore, getByStoreResponse] = useLazyGetListingsByStoreQuery();
  const [triggerGetByCreator, getByCreatorResponse] = useLazyGetListingsByCreatorQuery();

  // Admin
  const [triggerGetPending, getPendingResponse] = useLazyGetPendingListingsQuery();
  const [adminReviewListing, adminReviewResponse] = useAdminReviewListingMutation();
  const [adminConfirmFee, adminConfirmFeeResponse] = useAdminConfirmFeeMutation();

  // ── Fetch on mount ────────────────────────────────────────

  const listingParams = {
    search,
    ...listingsParams,
    ...(all === true ? { all: true } : { ...cusPaginate }),
  };

  const myListingParams = {
    search,
    ...myListingsParams,
    ...(all === true ? { all: true } : { ...myListingCusPagintate }),
  };

  useEffect(() => {
    if (fetchListings) triggerGetListings(listingParams);
  }, [fetchListings, JSON.stringify(listingParams)]);

  useEffect(() => {
    if (listingId) triggerGetListingById(listingId);
  }, [listingId]);

  useEffect(() => {
    if (fetchMyListings) triggerGetMyListings(myListingParams);
  }, [fetchMyListings, JSON.stringify(myListingParams)]);

  useEffect(() => {
    if (storeId) triggerGetByStore({ storeId, ...storeListingsParams });
  }, [storeId]);

  useEffect(() => {
    if (creatorId) triggerGetByCreator({ creatorId, ...creatorListingsParams });
  }, [creatorId]);

  useEffect(() => {
    if (fetchPending) triggerGetPending(pendingParams);
  }, [fetchPending]);

  // ── Handler functions ─────────────────────────────────────

  const handleCreateListing = async (data: CreateListingPayload) => {
    try {
      const result = await createListing({
        payload: data,
        options: { successMessage: 'Your product has been submitted for review' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetListings = async (params: QueryListingsParams = {}) => {
    try {
      return await triggerGetListings(params).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleGetListingById = async (id: string) => {
    try {
      return await triggerGetListingById(id).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleGetMyListings = async (params: QueryListingsParams = {}) => {
    try {
      return await triggerGetMyListings(params).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleGetByStore = async (id: string, params: QueryListingsParams = {}) => {
    try {
      return await triggerGetByStore({ storeId: id, ...params }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleGetByCreator = async (id: string, params: QueryListingsParams = {}) => {
    try {
      return await triggerGetByCreator({ creatorId: id, ...params }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateListing = async (id: string, data: UpdateListingPayload) => {
    try {
      return await updateListing({
        id,
        payload: data,
        options: { successMessage: 'Listing updated' },
      }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleDeleteListing = async (id: string) => {
    try {
      return await deleteListing({
        id,
        options: { successMessage: 'Listing deleted' },
      }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  // ── Seller Lifecycle Handlers ─────────────────────────────

  const handleCounterOffer = async (id: string, amount: number) => {
    try {
      return await submitCounterOffer({
        id,
        counterOffer: amount,
        options: { successMessage: 'Counter-offer submitted' },
      }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleAcceptOffer = async (id: string) => {
    try {
      return await acceptOffer({
        id,
        options: { successMessage: 'Offer accepted' },
      }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleRejectOffer = async (id: string) => {
    try {
      return await rejectOffer({
        id,
        options: { successMessage: 'Offer rejected' },
      }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleDelistListing = async (id: string) => {
    try {
      return await delistListing({
        id,
        options: { successMessage: 'Listing delisted from marketplace' },
      }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  // ── Admin Handlers ────────────────────────────────────────

  const handleGetPendingListings = async (params: QueryListingsParams = {}) => {
    try {
      return await triggerGetPending(params).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleAdminReview = async (id: string, data: AdminReviewListingPayload) => {
    const messages: Record<string, string> = {
      approve: 'Listing approved',
      reject: 'Listing rejected',
      suspend: 'Listing suspended',
      reinstate: 'Listing reinstated',
      delist: 'Listing delisted',
      make_offer: 'Price offer sent to seller',
      accept_counter: 'Counter-offer accepted',
      reject_counter: 'Counter-offer rejected',
      mark_awaiting_fee: 'Marked as awaiting fee payment',
      mark_awaiting_product: 'Marked as awaiting product',
      mark_live: 'Listing is now live',
    };
    try {
      return await adminReviewListing({
        id,
        payload: data,
        options: { successMessage: messages[data.action] || 'Action completed' },
      }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  const handleAdminConfirmFee = async (id: string) => {
    try {
      return await adminConfirmFee({
        id,
        options: { successMessage: 'Listing fee confirmed — item is now live' },
      }).unwrap();
    } catch (error) {
      throw error;
    }
  };

  // ── Return ────────────────────────────────────────────────

  return {
    // Handler functions
    createListing: handleCreateListing,
    getListings: handleGetListings,
    getListingById: handleGetListingById,
    getMyListings: handleGetMyListings,
    getListingsByStore: handleGetByStore,
    getListingsByCreator: handleGetByCreator,
    updateListing: handleUpdateListing,
    deleteListing: handleDeleteListing,
    // Seller lifecycle
    submitCounterOffer: handleCounterOffer,
    acceptOffer: handleAcceptOffer,
    rejectOffer: handleRejectOffer,
    delistListing: handleDelistListing,
    // Admin
    getPendingListings: handleGetPendingListings,
    adminReviewListing: handleAdminReview,
    adminConfirmFee: handleAdminConfirmFee,

    // ── Data ──────────────────────────────────────────────────
    listings: getListingsResponse?.data?.data || [],
    listingsTotal: getListingsResponse?.data?.meta?.pagination?.total || 0,
    listingsTotalPages: getListingsResponse?.data?.meta?.pagination?.totalPages || 0,

    listingDetail: getListingByIdResponse?.data?.data,

    myListings: getMyListingsResponse?.data?.data || [],
    myListingsTotal: getMyListingsResponse?.data?.meta?.pagination?.total || 0,
    myListingsTotalPages: getMyListingsResponse?.data?.meta?.pagination?.totalPages || 0,

    storeListings: getByStoreResponse?.data?.data || [],
    storeListingsTotal: getByStoreResponse?.data?.meta?.pagination?.total || 0,

    creatorListings: getByCreatorResponse?.data?.data || [],
    creatorListingsTotal: getByCreatorResponse?.data?.meta?.pagination?.total || 0,

    pendingListings: getPendingResponse?.data?.data || [],
    pendingTotal: getPendingResponse?.data?.meta?.pagination?.total || 0,

    myListingPagination,
    listingPagination,

    // ── Loading states ────────────────────────────────────────
    isCreatingListing: createListingResponse.isLoading,
    isLoadingListings: getListingsResponse.isLoading,
    isFetchingListings: getListingsResponse.isFetching,
    isLoadingListingDetail: getListingByIdResponse.isLoading,
    isFetchingListingDetail: getListingByIdResponse.isFetching,
    isLoadingMyListings: getMyListingsResponse.isLoading,
    isFetchingMyListings: getMyListingsResponse.isFetching,
    isLoadingStoreListings: getByStoreResponse.isLoading,
    isLoadingCreatorListings: getByCreatorResponse.isLoading,
    isUpdatingListing: updateListingResponse.isLoading,
    isDeletingListing: deleteListingResponse.isLoading,
    isSubmittingCounterOffer: submitCounterOfferResponse.isLoading,
    isAcceptingOffer: acceptOfferResponse.isLoading,
    isRejectingOffer: rejectOfferResponse.isLoading,
    isDelisting: delistListingResponse.isLoading,
    isLoadingPending: getPendingResponse.isLoading,
    isFetchingPending: getPendingResponse.isFetching,
    isReviewingListing: adminReviewResponse.isLoading,
    isConfirmingFee: adminConfirmFeeResponse.isLoading,

    // ── Success states ────────────────────────────────────────
    isCreateListingSuccess: createListingResponse.isSuccess,
    isUpdateListingSuccess: updateListingResponse.isSuccess,
    isDeleteListingSuccess: deleteListingResponse.isSuccess,
    isCounterOfferSuccess: submitCounterOfferResponse.isSuccess,
    isAcceptOfferSuccess: acceptOfferResponse.isSuccess,
    isRejectOfferSuccess: rejectOfferResponse.isSuccess,
    isDelistSuccess: delistListingResponse.isSuccess,
    isAdminReviewSuccess: adminReviewResponse.isSuccess,
    isConfirmFeeSuccess: adminConfirmFeeResponse.isSuccess,

    // ── Error states ──────────────────────────────────────────
    createListingError: createListingResponse.error,
    listingsError: getListingsResponse.error,
    listingDetailError: getListingByIdResponse.error,
    myListingsError: getMyListingsResponse.error,
    storeListingsError: getByStoreResponse.error,
    creatorListingsError: getByCreatorResponse.error,
    updateListingError: updateListingResponse.error,
    deleteListingError: deleteListingResponse.error,
    counterOfferError: submitCounterOfferResponse.error,
    acceptOfferError: acceptOfferResponse.error,
    rejectOfferError: rejectOfferResponse.error,
    delistError: delistListingResponse.error,
    pendingError: getPendingResponse.error,
    adminReviewError: adminReviewResponse.error,
    confirmFeeError: adminConfirmFeeResponse.error,

    // ── Raw responses ─────────────────────────────────────────
    createListingResponse,
    getListingsResponse,
    getListingByIdResponse,
    getMyListingsResponse,
    getByStoreResponse,
    getByCreatorResponse,
    updateListingResponse,
    deleteListingResponse,
    submitCounterOfferResponse,
    acceptOfferResponse,
    rejectOfferResponse,
    delistListingResponse,
    getPendingResponse,
    adminReviewResponse,
    adminConfirmFeeResponse,

    // ── Refetch actions ───────────────────────────────────────
    refetchListings: (params?: QueryListingsParams) => triggerGetListings(params || listingsParams),
    refetchMyListings: (params?: QueryListingsParams) =>
      triggerGetMyListings(params || myListingsParams),
    refetchStoreListings: (id: string, params?: QueryListingsParams) =>
      triggerGetByStore({ storeId: id, ...(params || storeListingsParams) }),
    refetchCreatorListings: (id: string, params?: QueryListingsParams) =>
      triggerGetByCreator({ creatorId: id, ...(params || creatorListingsParams) }),
    refetchPending: (params?: QueryListingsParams) => triggerGetPending(params || pendingParams),
    refetchListingDetail: (id: string) => triggerGetListingById(id),
  };
};
