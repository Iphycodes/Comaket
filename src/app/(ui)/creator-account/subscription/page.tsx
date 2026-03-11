'use client';

import React, { useEffect, useRef, useCallback } from 'react';
import { message as antMessage } from 'antd';
import { useSearchParams } from 'next/navigation';
import { usePayments } from '@grc/hooks/usePayments';
import Subscription from '@grc/components/apps/subscription';

// ═══════════════════════════════════════════════════════════════════════════
// SUBSCRIPTION PAGE
// ═══════════════════════════════════════════════════════════════════════════

const SubscriptionPage = () => {
  const searchParams = useSearchParams();

  // ── Detect payment return from Paystack ────────────────────────────
  const upgradedParam = searchParams?.get('upgraded');
  const referenceParam = searchParams?.get('reference') || searchParams?.get('trxref') || '';
  const isPaymentReturn = !!upgradedParam || !!referenceParam;

  const verifyAttempted = useRef(false);

  // ── Hook ───────────────────────────────────────────────────────────
  const {
    subscription,
    isLoadingSubscription,
    isFetchingSubscription,
    refetchSubscription,
    cancelSubscription,
    isCancellingSubscription,
    changePlan,
    isChangingPlan,
    verifyPayment,
  } = usePayments({ fetchSubscription: true });

  // ── Verify payment on return from Paystack ─────────────────────────
  useEffect(() => {
    if (!isPaymentReturn || verifyAttempted.current) return;
    verifyAttempted.current = true;

    const verify = async () => {
      if (referenceParam) {
        try {
          await verifyPayment(referenceParam);
        } catch {
          // Verification errors are non-fatal — subscription data will reflect the actual state
        }
      }
      // Refetch subscription to get the latest state
      refetchSubscription();
      // Clean URL params
      window.history.replaceState({}, '', window.location.pathname);
    };

    verify();
  }, [isPaymentReturn, referenceParam, verifyPayment, refetchSubscription]);

  // ── Handlers ───────────────────────────────────────────────────────

  const handleChangePlan = useCallback(
    async (plan: 'starter' | 'pro' | 'business') => {
      try {
        const callbackUrl = `${window.location.origin}/creator-account/subscription?upgraded=true`;
        const result = await changePlan({ plan, callbackUrl });

        // If the result contains an authorizationUrl, the hook is redirecting to Paystack
        // — don't show any message, the user is leaving the page
        const hasRedirect = result?.data?.authorizationUrl;
        if (!hasRedirect) {
          // Downgrade completed — no redirect happened
          antMessage.success('Plan changed successfully');
          refetchSubscription();
        }
      } catch (err: any) {
        antMessage.error(err?.data?.message || 'Failed to change plan. Please try again.');
      }
    },
    [changePlan, refetchSubscription]
  );

  const handleCancelSubscription = useCallback(async () => {
    try {
      await cancelSubscription();
      refetchSubscription();
    } catch (err: any) {
      antMessage.error(err?.data?.message || 'Failed to cancel subscription. Please try again.');
    }
  }, [cancelSubscription, refetchSubscription]);

  // ── Render ─────────────────────────────────────────────────────────

  return (
    <Subscription
      subscription={subscription || null}
      isLoading={isLoadingSubscription}
      isFetching={isFetchingSubscription}
      onChangePlan={handleChangePlan}
      onCancelSubscription={handleCancelSubscription}
      isChangingPlan={isChangingPlan}
      isCancelling={isCancellingSubscription}
      upgradeSuccess={isPaymentReturn && !!upgradedParam}
    />
  );
};

export default SubscriptionPage;
