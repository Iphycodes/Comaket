'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { usePayments } from '@grc/hooks/usePayments';
import { useLazyVerifyOPayPaymentQuery } from '@grc/services/payments';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  XCircle,
  Loader2,
  ShoppingBag,
  ClipboardList,
  RefreshCw,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

// ═══════════════════════════════════════════════════════════════════════════
// PAYMENT VERIFICATION PAGE — /checkout/verify?reference=xxx
// Also supports OPay: /checkout/verify?provider=opay&reference=xxx
// ═══════════════════════════════════════════════════════════════════════════

const PaymentVerifyPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery(mediaSize.mobile);
  const reference =
    searchParams?.get('reference') ||
    searchParams?.get('trxref') ||
    searchParams?.get('orderNo') ||
    '';
  const provider = searchParams?.get('provider') || 'paystack';
  const isOPay = provider === 'opay';

  const [verificationStatus, setVerificationStatus] = useState<
    'loading' | 'success' | 'failed' | 'error'
  >('loading');
  const [statusMessage, setStatusMessage] = useState('');

  // Paystack verify (only used if not OPay)
  const { verifyPayment, isVerifyingPayment, paymentVerification } = usePayments({
    verifyReference: !isOPay && reference ? reference : undefined,
  });

  // OPay verify
  const [triggerVerifyOPay, opayVerifyResponse] = useLazyVerifyOPayPaymentQuery();

  // ── Auto-verify OPay on mount ──────────────────────────────────────
  useEffect(() => {
    if (isOPay && reference) {
      triggerVerifyOPay(reference);
    }
  }, [isOPay, reference]);

  // ── Watch verification result ───────────────────────────────────────
  useEffect(() => {
    if (!reference) {
      setVerificationStatus('error');
      setStatusMessage('No payment reference found.');
      return;
    }
  }, [reference]);

  // Paystack result
  useEffect(() => {
    if (isOPay || !paymentVerification) return;

    if (paymentVerification.verified && paymentVerification.status === 'success') {
      setVerificationStatus('success');
      setStatusMessage('Your payment was successful! Your order is being processed.');
    } else if (paymentVerification.status === 'failed') {
      setVerificationStatus('failed');
      setStatusMessage(
        paymentVerification.message || 'Payment was not completed. Please try again.'
      );
    } else {
      setVerificationStatus('failed');
      setStatusMessage(paymentVerification.message || 'Payment could not be verified.');
    }
  }, [paymentVerification, isOPay]);

  // OPay result
  useEffect(() => {
    if (!isOPay) return;
    const opayData = opayVerifyResponse?.data?.data;
    if (!opayData) return;

    if (opayData.verified && opayData.status === 'success') {
      setVerificationStatus('success');
      setStatusMessage('Your payment was successful! Your order is being processed.');
    } else if (opayData.status === 'pending') {
      setVerificationStatus('loading');
      setStatusMessage('Payment is still being processed...');
      // Retry after a few seconds
      setTimeout(() => {
        if (reference) triggerVerifyOPay(reference);
      }, 5000);
    } else {
      setVerificationStatus('failed');
      setStatusMessage(opayData.message || 'Payment could not be verified.');
    }
  }, [opayVerifyResponse?.data, isOPay]);

  // ── Handle retry ────────────────────────────────────────────────────
  const handleRetry = async () => {
    if (!reference) return;
    setVerificationStatus('loading');
    try {
      if (isOPay) {
        const result = await triggerVerifyOPay(reference).unwrap();
        const data = result?.data;
        if (data?.verified && data?.status === 'success') {
          setVerificationStatus('success');
          setStatusMessage('Your payment was successful!');
        } else {
          setVerificationStatus('failed');
          setStatusMessage(data?.message || 'Payment could not be verified.');
        }
      } else {
        const result = await verifyPayment(reference);
        const data = result?.data;
        if (data?.verified && data?.status === 'success') {
          setVerificationStatus('success');
          setStatusMessage('Your payment was successful!');
        } else {
          setVerificationStatus('failed');
          setStatusMessage(data?.message || 'Payment could not be verified.');
        }
      }
    } catch {
      setVerificationStatus('error');
      setStatusMessage('Failed to verify payment. Please try again later.');
    }
  };

  // ── Status icon ─────────────────────────────────────────────────────
  const statusConfig = {
    loading: {
      icon: <Loader2 size={64} className="text-blue animate-spin" />,
      title: 'Verifying Payment',
      subtitle: 'Please wait while we confirm your payment...',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    success: {
      icon: <CheckCircle2 size={64} className="text-emerald-500" />,
      title: 'Payment Successful!',
      subtitle: statusMessage,
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    failed: {
      icon: <XCircle size={64} className="text-red-500" />,
      title: 'Payment Failed',
      subtitle: statusMessage,
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
    error: {
      icon: <XCircle size={64} className="text-amber-500" />,
      title: 'Verification Error',
      subtitle: statusMessage,
      bg: 'bg-amber-50 dark:bg-amber-900/20',
    },
  };

  const config = statusConfig[verificationStatus];

  return (
    <div
      className={`h-screen overflow-hidden flex items-center justify-center ${
        isMobile ? 'px-4' : ''
      } dark:bg-neutral-900/50`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-md w-full"
      >
        {/* Icon */}
        <div
          className={`w-28 h-28 rounded-full ${config.bg} flex items-center justify-center mx-auto mb-6`}
        >
          {config.icon}
        </div>

        {/* Title & message */}
        <h1 className="text-2xl font-bold dark:text-white mb-2">{config.title}</h1>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-8 leading-relaxed">
          {config.subtitle}
        </p>

        {/* Reference */}
        {reference && verificationStatus !== 'loading' && (
          <div className="bg-neutral-50 dark:bg-neutral-800 rounded-lg px-4 py-2.5 mb-6 inline-block">
            <span className="text-xs text-neutral-400">Reference: </span>
            <span className="text-xs font-mono font-medium text-neutral-600 dark:text-neutral-300">
              {reference}
            </span>
          </div>
        )}

        {/* Action buttons */}
        <div className="space-y-3">
          {verificationStatus === 'success' && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/profile?tab=purchases')}
                className="w-full bg-gradient-to-r from-blue to-indigo-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-md shadow-blue/20"
              >
                <ClipboardList size={18} />
                View My Orders
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/market')}
                className="w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                <ShoppingBag size={18} />
                Continue Shopping
              </motion.button>
            </>
          )}

          {(verificationStatus === 'failed' || verificationStatus === 'error') && (
            <>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRetry}
                disabled={isVerifyingPayment}
                className="w-full bg-gradient-to-r from-blue to-indigo-600 text-white py-3 rounded-xl font-medium flex items-center justify-center gap-2 shadow-md shadow-blue/20 disabled:opacity-70"
              >
                {isVerifyingPayment ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : (
                  <RefreshCw size={18} />
                )}
                Retry Verification
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push('/cart')}
                className="w-full bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-200 py-3 rounded-xl font-medium flex items-center justify-center gap-2"
              >
                Back to Cart
              </motion.button>
            </>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PaymentVerifyPage;
