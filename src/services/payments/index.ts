import { OptionType } from '@grc/_shared/namespace';
import { api } from '../api';
import { orderTag, listingTag, creatorTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface InitializePaymentPayload {
  orderId: string;
  callbackUrl?: string;
}

export interface InitializeListingFeePayload {
  listingId: string;
  callbackUrl?: string;
}

export interface InitializeSubscriptionPayload {
  plan: 'pro' | 'business';
  callbackUrl?: string;
}

export interface ChangePlanPayload {
  plan: 'starter' | 'pro' | 'business';
  callbackUrl?: string;
}

export interface PaymentInitResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
}

export interface ListingFeeInitResponse {
  authorizationUrl: string;
  accessCode: string;
  reference: string;
  pendingAmount: number;
  totalFee: number;
  previouslyPaid: number;
}

export interface VerifyPaymentResponse {
  verified: boolean;
  status: string;
  message: string;
  reference: string;
  paymentType?: string;
  listingId?: string;
  orderId?: string;
  plan?: string;
}

export interface SubscriptionDetails {
  plan: 'starter' | 'pro' | 'business';
  subscriptionStatus: 'active' | 'cancelled' | 'expired' | 'none';
  planStartedAt: string | null;
  planExpiresAt: string | null;
  planAmountPaid: number;
  nextBillingAmount: number;
  paymentChannel: string | null;
  paymentReference: string | null;
  paystackSubscriptionCode: string | null;
  isActive: boolean;
  daysRemaining: number | null;
}

export interface CancelSubscriptionResponse {
  message: string;
  plan: string;
  activeUntil: string | null;
}

export interface Bank {
  id: number;
  name: string;
  slug: string;
  code: string;
  active: boolean;
}

export interface VerifyBankAccountParams {
  account_number: string;
  bank_code: string;
}

export interface BankAccountInfo {
  account_number: string;
  account_name: string;
  bank_id: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const paymentsApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Initialize payment for an order
    initializePayment: builder.mutation<
      Record<string, any>,
      { payload: InitializePaymentPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/payments/initialize`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Initialize listing fee payment
    initializeListingFee: builder.mutation<
      Record<string, any>,
      { payload: InitializeListingFeePayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/payments/listing-fee`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [listingTag],
    }),

    // Initialize subscription payment
    initializeSubscription: builder.mutation<
      Record<string, any>,
      { payload: InitializeSubscriptionPayload; options: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/payments/subscribe`,
        method: 'POST',
        body: payload,
      }),
    }),

    // Get my subscription details
    getMySubscription: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/payments/my-subscription`,
        method: 'GET',
      }),
      providesTags: [creatorTag],
    }),

    // Cancel subscription
    cancelSubscription: builder.mutation<Record<string, any>, { options?: OptionType }>({
      query: () => ({
        url: `/payments/cancel-subscription`,
        method: 'POST',
      }),
      invalidatesTags: [creatorTag],
    }),

    // Change/upgrade plan
    changePlan: builder.mutation<
      Record<string, any>,
      { payload: ChangePlanPayload; options?: OptionType }
    >({
      query: ({ payload }) => ({
        url: `/payments/change-plan`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [creatorTag],
    }),

    // Verify payment by reference
    verifyPayment: builder.query<Record<string, any>, string>({
      query: (reference) => ({
        url: `/payments/verify/${reference}`,
        method: 'GET',
      }),
      providesTags: [orderTag],
    }),

    // Get public platform settings (plan pricing, feature flags)
    getPlatformSettings: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/platform/settings`,
        method: 'GET',
      }),
    }),

    // List all Nigerian banks
    listBanks: builder.query<Record<string, any>, void>({
      query: () => ({
        url: `/payments/banks`,
        method: 'GET',
      }),
    }),

    // Verify bank account number
    verifyBankAccount: builder.query<Record<string, any>, VerifyBankAccountParams>({
      query: (params) => ({
        url: `/payments/banks/verify`,
        method: 'GET',
        params,
      }),
    }),

    // Verify OPay payment by reference
    verifyOPayPayment: builder.query<Record<string, any>, string>({
      query: (reference) => ({
        url: `/payments/verify-opay/${reference}`,
        method: 'GET',
      }),
      providesTags: [orderTag],
    }),
  }),
});

export const {
  useInitializePaymentMutation,
  useInitializeListingFeeMutation,
  useInitializeSubscriptionMutation,
  useGetMySubscriptionQuery,
  useLazyGetMySubscriptionQuery,
  useCancelSubscriptionMutation,
  useChangePlanMutation,
  useGetPlatformSettingsQuery,
  useLazyGetPlatformSettingsQuery,
  useVerifyPaymentQuery,
  useLazyVerifyPaymentQuery,
  useListBanksQuery,
  useLazyListBanksQuery,
  useVerifyBankAccountQuery,
  useLazyVerifyBankAccountQuery,
  useVerifyOPayPaymentQuery,
  useLazyVerifyOPayPaymentQuery,
} = paymentsApi;
