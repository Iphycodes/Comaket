'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CheckCircle,
  XCircle,
  Loader2,
  CreditCard,
  Package,
  RotateCcw,
  ShoppingCart,
  Crown,
} from 'lucide-react';
import { usePayments } from '@grc/hooks/usePayments';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Comaket';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type PaymentType = 'listing_fee' | 'order' | 'subscription' | 'unknown';
type VerifyStatus = 'loading' | 'success' | 'failed' | 'error';

interface PaymentMeta {
  type: PaymentType;
  listingId?: string;
  orderId?: string;
  reference: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CONFIG PER PAYMENT TYPE
// ═══════════════════════════════════════════════════════════════════════════

const paymentTypeConfig: Record<
  PaymentType,
  {
    label: string;
    icon: React.ElementType;
    successTitle: string;
    successMessage: string;
    failedTitle: string;
    failedMessage: string;
    gradient: string;
    iconColor: string;
    redirectLabel: string;
    getRedirectPath: (meta: PaymentMeta) => string;
  }
> = {
  listing_fee: {
    label: 'Listing Fee',
    icon: Package,
    successTitle: 'Listing Fee Paid!',
    successMessage: 'Your product is now live on the marketplace. Buyers can find and purchase it.',
    failedTitle: 'Payment Failed',
    failedMessage:
      'Your listing fee payment could not be completed. Your product is still saved — you can try paying again.',
    gradient: 'from-blue to-indigo-500',
    iconColor: 'text-blue',
    redirectLabel: 'View My Products',
    getRedirectPath: () => '/profile?tab=products',
  },
  order: {
    label: 'Order Payment',
    icon: ShoppingCart,
    successTitle: 'Order Confirmed!',
    successMessage:
      'Your payment was successful. The seller has been notified and will begin processing your order.',
    failedTitle: 'Payment Failed',
    failedMessage:
      'We could not process your payment. Your order has not been placed. Please try again.',
    gradient: 'from-emerald-500 to-teal-500',
    iconColor: 'text-emerald-600',
    redirectLabel: 'View My Orders',
    getRedirectPath: (meta) => (meta.orderId ? `/profile?tab=orders` : '/profile?tab=orders'),
  },
  subscription: {
    label: 'Subscription',
    icon: Crown,
    successTitle: 'Subscription Active!',
    successMessage: `Welcome to ${APP_NAME} Pro! Your premium features are now unlocked.`,
    failedTitle: 'Subscription Failed',
    failedMessage:
      'We could not activate your subscription. You have not been charged. Please try again.',
    gradient: 'from-violet-500 to-purple-500',
    iconColor: 'text-violet-600',
    redirectLabel: 'Go to Dashboard',
    getRedirectPath: () => '/',
  },
  unknown: {
    label: 'Payment',
    icon: CreditCard,
    successTitle: 'Payment Successful!',
    successMessage: 'Your payment has been confirmed.',
    failedTitle: 'Payment Failed',
    failedMessage:
      'Your payment could not be verified. Please contact support if you were charged.',
    gradient: 'from-neutral-600 to-neutral-800',
    iconColor: 'text-neutral-600',
    redirectLabel: 'Go Home',
    getRedirectPath: () => '/',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function PaymentVerifyPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  // ── Extract URL params ──────────────────────────────────────────────
  // Paystack appends ?reference=xxx&trxref=xxx to the callbackUrl
  const reference = searchParams?.get('reference') || searchParams?.get('trxref') || '';
  const type = (searchParams?.get('type') || 'unknown') as PaymentType;
  const listingId = searchParams?.get('listingId') || '';
  const orderId = searchParams?.get('orderId') || '';

  const meta: PaymentMeta = useMemo(
    () => ({
      type: ['listing_fee', 'order', 'subscription'].includes(type) ? type : 'unknown',
      listingId: listingId || undefined,
      orderId: orderId || undefined,
      reference,
    }),
    [type, listingId, orderId, reference]
  );

  const config = paymentTypeConfig[meta.type];
  const TypeIcon = config.icon;

  // ── Verification state ──────────────────────────────────────────────
  const [status, setStatus] = useState<VerifyStatus>('loading');
  const [verifyData, setVerifyData] = useState<any>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [retryCount, setRetryCount] = useState(0);

  const { verifyPayment } = usePayments();

  // ── Verify on mount ─────────────────────────────────────────────────
  useEffect(() => {
    if (!reference) {
      setStatus('error');
      setErrorMessage('No payment reference found. This page requires a valid payment reference.');
      return;
    }

    const verify = async () => {
      setStatus('loading');
      try {
        const result = await verifyPayment(reference);
        const data = result?.data || result;

        if (data?.verified || data?.status === 'success' || data?.status === 'paid') {
          setVerifyData(data);
          setStatus('success');
          // Auto-redirect after successful verification
          const redirectPath = paymentTypeConfig[meta.type].getRedirectPath(meta);
          router.replace(redirectPath);
        } else {
          setVerifyData(data);
          setStatus('failed');
        }
      } catch (error: any) {
        const msg = error?.data?.message || error?.message || 'Verification failed';
        setErrorMessage(msg);
        setStatus('error');
      }
    };

    verify();
  }, [reference, retryCount]);

  // ── Retry handler ───────────────────────────────────────────────────
  const handleRetry = () => setRetryCount((c) => c + 1);

  // ── Navigate ────────────────────────────────────────────────────────
  const handleRedirect = () => router.push(config.getRedirectPath(meta));
  const handleGoHome = () => router.push('/');

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════

  return (
    <div className="min-h-screen dark:bg-neutral-950 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-white dark:bg-neutral-900 rounded-3xl shadow-sm shadow-neutral-200/50 dark:shadow-black/20 border border-neutral-100 dark:border-neutral-800 overflow-hidden">
          {/* Top gradient bar */}
          <div
            className={`h-1.5 bg-gradient-to-r ${
              status === 'success'
                ? config.gradient
                : status === 'failed'
                  ? 'from-red-500 to-rose-500'
                  : status === 'error'
                    ? 'from-neutral-400 to-neutral-500'
                    : 'from-blue to-indigo-500'
            }`}
          />

          <div className="p-8 flex flex-col items-center text-center">
            <AnimatePresence mode="wait">
              {/* ── Loading ── */}
              {status === 'loading' && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center"
                >
                  <div className="relative mb-6">
                    <div className="w-20 h-20 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                      <Loader2 size={32} className="text-blue animate-spin" />
                    </div>
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-blue/20"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.5, 0, 0.5] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Verifying Payment
                  </h2>
                  <p className="text-sm text-neutral-500 max-w-[280px]">
                    Please wait while we confirm your {config.label.toLowerCase()} payment with
                    Paystack...
                  </p>
                  {reference && (
                    <p className="text-[11px] text-neutral-400 mt-4 font-mono bg-neutral-50 dark:bg-neutral-800 px-3 py-1.5 rounded-lg">
                      Ref:{' '}
                      {reference.length > 30
                        ? `${reference.slice(0, 15)}...${reference.slice(-10)}`
                        : reference}
                    </p>
                  )}
                </motion.div>
              )}

              {/* ── Success (brief — auto-redirects) ── */}
              {status === 'success' && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-emerald-50 dark:bg-emerald-900/20 flex items-center justify-center mb-6">
                    <CheckCircle size={40} className="text-emerald-500" />
                  </div>
                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Payment Confirmed
                  </h2>
                  <p className="text-sm text-neutral-500">Redirecting...</p>
                </motion.div>
              )}

              {/* ── Failed ── */}
              {status === 'failed' && (
                <motion.div
                  key="failed"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: 'spring', stiffness: 200, damping: 15 }}
                    className="mb-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center">
                      <XCircle size={40} className="text-red-500" />
                    </div>
                  </motion.div>

                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    {config.failedTitle}
                  </h2>
                  <p className="text-sm text-neutral-500 max-w-[300px] leading-relaxed">
                    {config.failedMessage}
                  </p>

                  {verifyData?.message && (
                    <div className="mt-4 px-4 py-2.5 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-800/30 w-full">
                      <p className="text-xs text-red-600 dark:text-red-400">{verifyData.message}</p>
                    </div>
                  )}

                  {reference && (
                    <p className="text-[10px] text-neutral-400 mt-4 font-mono">Ref: {reference}</p>
                  )}

                  <div className="w-full mt-8 space-y-3">
                    <button
                      onClick={handleRetry}
                      className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue to-indigo-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                    >
                      <RotateCcw size={16} />
                      Try Again
                    </button>
                    <button
                      onClick={handleRedirect}
                      className="w-full py-3 rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors flex items-center justify-center gap-2"
                    >
                      <TypeIcon size={14} />
                      {config.redirectLabel}
                    </button>
                  </div>
                </motion.div>
              )}

              {/* ── Error (no reference / network error) ── */}
              {status === 'error' && (
                <motion.div
                  key="error"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <div className="w-20 h-20 rounded-full bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-6">
                    <CreditCard size={32} className="text-amber-500" />
                  </div>

                  <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-2">
                    Verification Error
                  </h2>
                  <p className="text-sm text-neutral-500 max-w-[300px] leading-relaxed">
                    {errorMessage || 'Something went wrong while verifying your payment.'}
                  </p>

                  <div className="w-full mt-8 space-y-3">
                    {reference && (
                      <button
                        onClick={handleRetry}
                        className="w-full py-3.5 rounded-xl text-sm font-semibold text-white bg-gradient-to-r from-blue to-indigo-500 shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2"
                      >
                        <RotateCcw size={16} />
                        Retry Verification
                      </button>
                    )}
                    <button
                      onClick={handleGoHome}
                      className="w-full py-3 rounded-xl text-sm font-medium text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
                    >
                      Back to Home
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Footer */}
          <div className="px-8 pb-6 pt-2 border-t border-neutral-50 dark:border-neutral-800">
            <div className="flex items-center justify-center gap-2 text-[11px] text-neutral-400">
              <CreditCard size={12} />
              <span>Secured by Paystack · {APP_NAME}</span>
            </div>
          </div>
        </div>

        {/* Help link */}
        <p className="text-center text-xs text-neutral-400 mt-6">
          Having issues?{' '}
          <button
            onClick={() => router.push('/support')}
            className="text-blue hover:underline font-medium"
          >
            Contact Support
          </button>
        </p>
      </motion.div>
    </div>
  );
}
