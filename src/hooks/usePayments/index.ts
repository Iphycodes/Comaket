import { useEffect } from 'react';
import {
  useInitializePaymentMutation,
  useInitializeListingFeeMutation,
  useInitializeSubscriptionMutation,
  useLazyGetMySubscriptionQuery,
  useCancelSubscriptionMutation,
  useChangePlanMutation,
  useLazyVerifyPaymentQuery,
  useLazyListBanksQuery,
  useLazyVerifyBankAccountQuery,
  InitializePaymentPayload,
  InitializeListingFeePayload,
  InitializeSubscriptionPayload,
  ChangePlanPayload,
  VerifyBankAccountParams,
} from '@grc/services/payments';

interface UsePaymentsProps {
  fetchBanks?: boolean;
  fetchSubscription?: boolean;
  verifyReference?: string;
}

export const usePayments = ({
  fetchBanks = false,
  fetchSubscription = false,
  verifyReference,
}: UsePaymentsProps = {}) => {
  // API hooks
  const [initializePayment, initializePaymentResponse] = useInitializePaymentMutation();
  const [initializeListingFee, initializeListingFeeResponse] = useInitializeListingFeeMutation();
  const [initializeSubscription, initializeSubscriptionResponse] =
    useInitializeSubscriptionMutation();
  const [triggerGetMySubscription, getMySubscriptionResponse] = useLazyGetMySubscriptionQuery();
  const [cancelSubscription, cancelSubscriptionResponse] = useCancelSubscriptionMutation();
  const [changePlan, changePlanResponse] = useChangePlanMutation();
  const [triggerVerifyPayment, verifyPaymentResponse] = useLazyVerifyPaymentQuery();
  const [triggerListBanks, listBanksResponse] = useLazyListBanksQuery();
  const [triggerVerifyBankAccount, verifyBankAccountResponse] = useLazyVerifyBankAccountQuery();

  // Fetch on mount if requested
  useEffect(() => {
    if (fetchBanks) {
      triggerListBanks();
    }
  }, [fetchBanks]);

  useEffect(() => {
    if (fetchSubscription) {
      triggerGetMySubscription();
    }
  }, [fetchSubscription]);

  useEffect(() => {
    if (verifyReference) {
      triggerVerifyPayment(verifyReference);
    }
  }, [verifyReference]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleInitializePayment = async (data: InitializePaymentPayload) => {
    try {
      const result = await initializePayment({
        payload: data,
        options: { noSuccessMessage: true },
      }).unwrap();

      const authUrl = result?.data?.authorizationUrl;
      if (authUrl) {
        window.location.href = authUrl;
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleInitializeListingFee = async (data: InitializeListingFeePayload) => {
    try {
      const result = await initializeListingFee({
        payload: data,
        options: { noSuccessMessage: true },
      }).unwrap();

      const authUrl = result?.data?.authorizationUrl;
      if (authUrl) {
        window.location.href = authUrl;
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleInitializeSubscription = async (data: InitializeSubscriptionPayload) => {
    try {
      const result = await initializeSubscription({
        payload: data,
        options: { noSuccessMessage: true },
      }).unwrap();

      const authUrl = result?.data?.authorizationUrl;
      if (authUrl) {
        window.location.href = authUrl;
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetMySubscription = async () => {
    try {
      const result = await triggerGetMySubscription().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleCancelSubscription = async () => {
    try {
      const result = await cancelSubscription({
        options: { successMessage: 'Subscription cancelled' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleChangePlan = async (data: ChangePlanPayload) => {
    try {
      const result = await changePlan({
        payload: data,
        options: { noSuccessMessage: true },
      }).unwrap();

      // If upgrading, result will have authorizationUrl for payment
      const authUrl = result?.data?.authorizationUrl;
      if (authUrl) {
        window.location.href = authUrl;
      }

      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyPayment = async (reference: string) => {
    try {
      const result = await triggerVerifyPayment(reference).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleListBanks = async () => {
    try {
      const result = await triggerListBanks().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleVerifyBankAccount = async (params: VerifyBankAccountParams) => {
    try {
      const result = await triggerVerifyBankAccount(params).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    initializePayment: handleInitializePayment,
    initializeListingFee: handleInitializeListingFee,
    initializeSubscription: handleInitializeSubscription,
    getMySubscription: handleGetMySubscription,
    cancelSubscription: handleCancelSubscription,
    changePlan: handleChangePlan,
    verifyPayment: handleVerifyPayment,
    listBanks: handleListBanks,
    verifyBankAccount: handleVerifyBankAccount,

    // Data
    paymentInit: initializePaymentResponse?.data?.data,
    listingFeeInit: initializeListingFeeResponse?.data?.data,
    subscriptionInit: initializeSubscriptionResponse?.data?.data,
    subscription: getMySubscriptionResponse?.data?.data,
    cancelResult: cancelSubscriptionResponse?.data?.data,
    changePlanResult: changePlanResponse?.data?.data,
    paymentVerification: verifyPaymentResponse?.data?.data,
    banks: listBanksResponse?.data?.data || [],
    bankAccountInfo: verifyBankAccountResponse?.data?.data,

    // Loading states
    isInitializingPayment: initializePaymentResponse.isLoading,
    isInitializingListingFee: initializeListingFeeResponse.isLoading,
    isInitializingSubscription: initializeSubscriptionResponse.isLoading,
    isLoadingSubscription: getMySubscriptionResponse.isLoading,
    isFetchingSubscription: getMySubscriptionResponse.isFetching,
    isCancellingSubscription: cancelSubscriptionResponse.isLoading,
    isChangingPlan: changePlanResponse.isLoading,
    isVerifyingPayment: verifyPaymentResponse.isLoading,
    isFetchingVerification: verifyPaymentResponse.isFetching,
    isLoadingBanks: listBanksResponse.isLoading,
    isFetchingBanks: listBanksResponse.isFetching,
    isVerifyingBankAccount: verifyBankAccountResponse.isLoading,
    isFetchingBankAccount: verifyBankAccountResponse.isFetching,

    // Success states
    isInitPaymentSuccess: initializePaymentResponse.isSuccess,
    isInitListingFeeSuccess: initializeListingFeeResponse.isSuccess,
    isInitSubscriptionSuccess: initializeSubscriptionResponse.isSuccess,
    isCancelSubscriptionSuccess: cancelSubscriptionResponse.isSuccess,
    isChangePlanSuccess: changePlanResponse.isSuccess,
    isVerifyPaymentSuccess: verifyPaymentResponse.isSuccess,
    isVerifyBankAccountSuccess: verifyBankAccountResponse.isSuccess,

    // Error states
    initPaymentError: initializePaymentResponse.error,
    initListingFeeError: initializeListingFeeResponse.error,
    initSubscriptionError: initializeSubscriptionResponse.error,
    subscriptionError: getMySubscriptionResponse.error,
    cancelSubscriptionError: cancelSubscriptionResponse.error,
    changePlanError: changePlanResponse.error,
    verifyPaymentError: verifyPaymentResponse.error,
    banksError: listBanksResponse.error,
    verifyBankAccountError: verifyBankAccountResponse.error,

    // Response states
    initializePaymentResponse,
    initializeListingFeeResponse,
    initializeSubscriptionResponse,
    getMySubscriptionResponse,
    cancelSubscriptionResponse,
    changePlanResponse,
    verifyPaymentResponse,
    listBanksResponse,
    verifyBankAccountResponse,

    // Actions
    refetchBanks: () => triggerListBanks(),
    refetchSubscription: () => triggerGetMySubscription(),
  };
};
