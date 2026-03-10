'use client';

import React, { useState, useMemo } from 'react';
import { Modal } from 'antd';
import { motion } from 'framer-motion';
import {
  AlertTriangle,
  ArrowDownCircle,
  ArrowUpCircle,
  Check,
  CheckCircle,
  CreditCard,
  Crown,
  Loader2,
  Minus,
  Rocket,
  Shield,
  Sparkles,
  XCircle,
  Zap,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { CREATOR_PLANS, CreatorPlan } from '@grc/_shared/constant';
import { SubscriptionDetails, useGetPlatformSettingsQuery } from '@grc/services/payments';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface SubscriptionProps {
  subscription: SubscriptionDetails | null;
  isLoading: boolean;
  isFetching: boolean;
  // Actions
  onChangePlan: (plan: 'starter' | 'pro' | 'business') => void;
  onCancelSubscription: () => void;
  // Loading states
  isChangingPlan: boolean;
  isCancelling: boolean;
  // Upgrade callback result
  upgradeSuccess: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const formatPrice = (kobo: number) => `₦${(kobo / 100).toLocaleString('en-NG')}`;

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-NG', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const getStatusConfig = (status: string, isActive: boolean) => {
  if (status === 'active' && isActive) {
    return {
      label: 'Active',
      color:
        'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800/30',
      icon: CheckCircle,
      iconColor: 'text-emerald-500',
    };
  }
  if (status === 'cancelled') {
    return {
      label: 'Cancelled',
      color:
        'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800/30',
      icon: XCircle,
      iconColor: 'text-amber-500',
    };
  }
  if (status === 'expired') {
    return {
      label: 'Expired',
      color:
        'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800/30',
      icon: XCircle,
      iconColor: 'text-red-500',
    };
  }
  // 'none' — starter/free
  return {
    label: 'Free Plan',
    color:
      'bg-neutral-50 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700',
    icon: Shield,
    iconColor: 'text-neutral-400',
  };
};

const PLAN_ICONS: Record<string, React.ElementType> = {
  starter: Rocket,
  pro: Zap,
  business: Crown,
};

const PLAN_GRADIENTS: Record<string, string> = {
  starter: 'from-neutral-400 to-neutral-500',
  pro: 'from-blue to-indigo-500',
  business: 'from-violet-500 to-purple-600',
};

/**
 * Merges static CREATOR_PLANS (features, descriptions) with dynamic pricing
 * from the platform settings API. Filters out inactive plans.
 */
const useDynamicPlans = (): { plans: CreatorPlan[]; isLoading: boolean } => {
  const { data: settingsResponse, isLoading } = useGetPlatformSettingsQuery();

  const plans = useMemo(() => {
    const apiPlans = settingsResponse?.data?.plans;
    if (!apiPlans) return CREATOR_PLANS;

    const apiMap = new Map<string, { priceKobo: number; active: boolean }>();
    for (const p of apiPlans) {
      apiMap.set(p.id, { priceKobo: p.priceKobo, active: p.active });
    }

    return CREATOR_PLANS.filter((plan) => {
      const api = apiMap.get(plan.id);
      return !api || api.active; // keep if no API data or active
    }).map((plan) => {
      const api = apiMap.get(plan.id);
      if (!api) return plan;
      const priceKobo = api.priceKobo;
      const priceLabel =
        priceKobo === 0 ? 'Free' : `₦${(priceKobo / 100).toLocaleString('en-NG')}/mo`;
      return { ...plan, price: priceKobo, priceLabel };
    });
  }, [settingsResponse]);

  return { plans, isLoading };
};

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON LOADER
// ═══════════════════════════════════════════════════════════════════════════

const SubscriptionSkeleton: React.FC = () => (
  <div className="space-y-6 animate-pulse">
    {/* Current plan skeleton */}
    <div className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
        <div className="space-y-2">
          <div className="w-32 h-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
          <div className="w-20 h-3 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="space-y-1.5">
            <div className="w-16 h-3 bg-neutral-200 dark:bg-neutral-700 rounded" />
            <div className="w-24 h-4 bg-neutral-200 dark:bg-neutral-700 rounded" />
          </div>
        ))}
      </div>
    </div>
    {/* Plan cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {[1, 2, 3].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 p-5 space-y-4"
        >
          <div className="w-20 h-5 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
          <div className="w-28 h-7 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
          <div className="space-y-2">
            {[1, 2, 3, 4].map((j) => (
              <div key={j} className="w-full h-3 bg-neutral-200 dark:bg-neutral-700 rounded" />
            ))}
          </div>
          <div className="w-full h-10 bg-neutral-200 dark:bg-neutral-700 rounded-xl" />
        </div>
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// CURRENT PLAN CARD
// ═══════════════════════════════════════════════════════════════════════════

const CurrentPlanCard: React.FC<{
  subscription: SubscriptionDetails;
  plans: CreatorPlan[];
}> = ({ subscription, plans }) => {
  const statusConfig = getStatusConfig(subscription.subscriptionStatus, subscription.isActive);
  const StatusIcon = statusConfig.icon;
  const PlanIcon = PLAN_ICONS[subscription.plan] || Shield;
  const gradient = PLAN_GRADIENTS[subscription.plan] || PLAN_GRADIENTS.starter;
  const planData =
    plans.find((p) => p.id === subscription.plan) ||
    CREATOR_PLANS.find((p) => p.id === subscription.plan);
  const isFreePlan = subscription.plan === 'starter';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 overflow-hidden"
    >
      {/* Header */}
      <div className="p-5 pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center shadow-lg`}
            >
              <PlanIcon size={18} className="text-white" />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                {planData?.name || subscription.plan} Plan
              </h3>
              <p className="text-xs text-neutral-500 mt-0.5">
                {isFreePlan ? 'No active subscription' : 'Your current subscription'}
              </p>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statusConfig.color}`}
          >
            <StatusIcon size={12} className={statusConfig.iconColor} />
            {statusConfig.label}
          </span>
        </div>
      </div>

      {/* Details grid */}
      {!isFreePlan && (
        <div className="px-5 pb-5">
          <div className="grid grid-cols-2 gap-4 p-4 bg-neutral-50 dark:bg-neutral-900/30 rounded-xl">
            {subscription.subscriptionStatus === 'active' && subscription.planExpiresAt && (
              <div>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                  Renews on
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">
                  {formatDate(subscription.planExpiresAt)}
                </p>
              </div>
            )}
            {subscription.subscriptionStatus === 'cancelled' && subscription.planExpiresAt && (
              <div>
                <p className="text-[11px] font-medium text-amber-500 uppercase tracking-wide">
                  Active until
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">
                  {formatDate(subscription.planExpiresAt)}
                </p>
              </div>
            )}
            {subscription.subscriptionStatus === 'expired' && (
              <div>
                <p className="text-[11px] font-medium text-red-400 uppercase tracking-wide">
                  Expired on
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">
                  {formatDate(subscription.planExpiresAt)}
                </p>
              </div>
            )}
            {subscription.daysRemaining !== null && subscription.daysRemaining > 0 && (
              <div>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                  Days remaining
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">
                  {subscription.daysRemaining} {subscription.daysRemaining === 1 ? 'day' : 'days'}
                </p>
              </div>
            )}
            {subscription.planAmountPaid > 0 && (
              <div>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                  Last payment
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5">
                  {formatPrice(subscription.planAmountPaid)}
                </p>
              </div>
            )}
            {subscription.paymentChannel && (
              <div>
                <p className="text-[11px] font-medium text-neutral-400 uppercase tracking-wide">
                  Payment method
                </p>
                <p className="text-sm font-semibold text-neutral-900 dark:text-white mt-0.5 capitalize">
                  {subscription.paymentChannel}
                </p>
              </div>
            )}
          </div>

          {/* Cancelled notice */}
          {subscription.subscriptionStatus === 'cancelled' && (
            <div className="flex items-start gap-2.5 p-3 mt-3 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-800/30 rounded-xl">
              <AlertTriangle size={14} className="text-amber-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-amber-700 dark:text-amber-400 leading-relaxed">
                Your subscription has been cancelled. You&apos;ll continue to have access to{' '}
                {planData?.name} features until {formatDate(subscription.planExpiresAt)}. After
                that, you&apos;ll be moved to the Starter plan.
              </p>
            </div>
          )}

          {/* Expired notice */}
          {subscription.subscriptionStatus === 'expired' && (
            <div className="flex items-start gap-2.5 p-3 mt-3 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl">
              <XCircle size={14} className="text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-red-700 dark:text-red-400 leading-relaxed">
                Your {planData?.name} subscription has expired. Upgrade to regain access to premium
                features.
              </p>
            </div>
          )}
        </div>
      )}

      {/* Free plan prompt */}
      {isFreePlan && (
        <div className="px-5 pb-5">
          <div className="flex items-start gap-2.5 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-800/30 rounded-xl">
            <Sparkles size={14} className="text-blue flex-shrink-0 mt-0.5" />
            <p className="text-xs text-blue-700 dark:text-blue-400 leading-relaxed">
              Upgrade to Pro or Business to unlock unlimited listings, analytics, featured works,
              and more.
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PLAN COMPARISON CARDS
// ═══════════════════════════════════════════════════════════════════════════

const PlanCards: React.FC<{
  currentPlan: string;
  subscriptionStatus: string;
  onSelect: (planId: 'starter' | 'pro' | 'business') => void;
  isChangingPlan: boolean;
  isMobile: boolean;
  plans: CreatorPlan[];
}> = ({ currentPlan, subscriptionStatus, onSelect, isChangingPlan, isMobile, plans }) => {
  const isCurrentPlan = (planId: string) => {
    if (subscriptionStatus === 'expired') return false;
    return currentPlan === planId;
  };

  const getAction = (planId: string) => {
    if (isCurrentPlan(planId)) return 'current';
    const currentIndex = plans.findIndex((p) => p.id === currentPlan);
    const targetIndex = plans.findIndex((p) => p.id === planId);
    if (subscriptionStatus === 'expired' || subscriptionStatus === 'none') return 'upgrade';
    if (targetIndex > currentIndex) return 'upgrade';
    return 'downgrade';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1 }}
    >
      <div className="mb-4">
        <h3 className="text-base font-bold text-neutral-900 dark:text-white">Available Plans</h3>
        <p className="text-xs text-neutral-500 mt-0.5">Choose the plan that fits your needs</p>
      </div>
      <div
        className={`${isMobile ? 'space-y-3' : 'grid gap-4'}`}
        style={
          !isMobile ? { gridTemplateColumns: `repeat(${plans.length}, minmax(0, 1fr))` } : undefined
        }
      >
        {plans.map((plan) => {
          const isCurrent = isCurrentPlan(plan.id);
          const action = getAction(plan.id);
          const PlanIcon = PLAN_ICONS[plan.id] || Shield;
          const gradient = PLAN_GRADIENTS[plan.id] || PLAN_GRADIENTS.starter;

          return (
            <motion.div
              key={plan.id}
              whileHover={!isCurrent ? { y: -2 } : undefined}
              className={`relative rounded-2xl border-2 p-5 transition-all ${
                isCurrent
                  ? plan.highlighted
                    ? 'border-blue bg-gradient-to-b from-blue/5 to-indigo-500/5 shadow-lg shadow-blue/10'
                    : 'border-blue bg-blue/5 dark:bg-blue/10 shadow-md'
                  : 'border-neutral-100 dark:border-neutral-700/50 hover:border-neutral-200 dark:hover:border-neutral-600 bg-white dark:bg-neutral-800/60'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm ${
                      plan.id === 'pro'
                        ? 'bg-gradient-to-r from-blue to-indigo-500 text-white'
                        : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                    }`}
                  >
                    {plan.badge}
                  </span>
                </div>
              )}

              {/* Current plan label */}
              {isCurrent && (
                <div className="absolute -top-3 right-4">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue text-white shadow-sm">
                    Current
                  </span>
                </div>
              )}

              {/* Plan header */}
              <div className="flex items-center gap-2.5 mb-3">
                <div
                  className={`w-8 h-8 rounded-lg bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  <PlanIcon size={14} className="text-white" />
                </div>
                <h4 className="text-base font-bold text-neutral-900 dark:text-white">
                  {plan.name}
                </h4>
              </div>

              {/* Price */}
              <div className="mb-3">
                <span
                  className={`text-2xl font-bold ${
                    plan.price === 0
                      ? 'text-emerald-600 dark:text-emerald-400'
                      : 'bg-gradient-to-r from-blue to-indigo-500 bg-clip-text text-transparent'
                  }`}
                >
                  {plan.priceLabel}
                </span>
              </div>

              <p className="text-xs text-neutral-500 mb-4 leading-relaxed">{plan.description}</p>

              {/* Features */}
              <div className="space-y-2 mb-5">
                {plan.features.map((f, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-neutral-600 dark:text-neutral-400">{f}</span>
                  </div>
                ))}
                {plan.limits.map((l, i) => (
                  <div key={`l-${i}`} className="flex items-start gap-2">
                    <Minus size={14} className="text-neutral-300 flex-shrink-0 mt-0.5" />
                    <span className="text-xs text-neutral-400">{l}</span>
                  </div>
                ))}
              </div>

              {/* CTA Button */}
              <button
                onClick={() => onSelect(plan.id as 'starter' | 'pro' | 'business')}
                disabled={isCurrent || isChangingPlan}
                className={`w-full py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  isCurrent
                    ? 'bg-neutral-100 dark:bg-neutral-700/50 text-neutral-400 cursor-not-allowed'
                    : action === 'upgrade'
                      ? 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
                      : 'bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                }`}
              >
                {isChangingPlan ? (
                  <>
                    <Loader2 size={14} className="animate-spin" />
                    Processing...
                  </>
                ) : isCurrent ? (
                  <>
                    <Check size={14} />
                    Current Plan
                  </>
                ) : action === 'upgrade' ? (
                  <>
                    <ArrowUpCircle size={14} />
                    Upgrade
                  </>
                ) : (
                  <>
                    <ArrowDownCircle size={14} />
                    Downgrade
                  </>
                )}
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CANCEL SECTION
// ═══════════════════════════════════════════════════════════════════════════

const CancelSection: React.FC<{
  subscription: SubscriptionDetails;
  onCancel: () => void;
  isCancelling: boolean;
  plans: CreatorPlan[];
}> = ({ subscription, onCancel, isCancelling, plans }) => {
  const [showModal, setShowModal] = useState(false);
  const planData =
    plans.find((p) => p.id === subscription.plan) ||
    CREATOR_PLANS.find((p) => p.id === subscription.plan);

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 p-5"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">
              Cancel Subscription
            </h3>
            <p className="text-xs text-neutral-500 mt-0.5">
              Your plan will remain active until the end of the current billing period.
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            disabled={isCancelling}
            className="px-4 py-2 rounded-xl text-xs font-semibold border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors disabled:opacity-50"
          >
            Cancel Plan
          </button>
        </div>
      </motion.div>

      <Modal
        open={showModal}
        onCancel={() => setShowModal(false)}
        footer={null}
        centered
        closable={false}
        width={420}
      >
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-900/20 flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={24} className="text-red-500" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
            Cancel Subscription?
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed mb-1">
            Are you sure you want to cancel your <strong>{planData?.name}</strong> subscription?
          </p>
          <p className="text-sm text-neutral-500 leading-relaxed mb-6">
            Your plan will remain active until{' '}
            <strong>{formatDate(subscription.planExpiresAt)}</strong>. After that, you&apos;ll be
            moved to the Starter plan.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => setShowModal(false)}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              Keep Plan
            </button>
            <button
              onClick={async () => {
                await onCancel();
                setShowModal(false);
              }}
              disabled={isCancelling}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-red-500 hover:bg-red-600 text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isCancelling ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Cancelling...
                </>
              ) : (
                'Yes, Cancel'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// UPGRADE SUCCESS BANNER
// ═══════════════════════════════════════════════════════════════════════════

const UpgradeSuccessBanner: React.FC = () => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800/30 rounded-2xl"
  >
    <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
      <CheckCircle size={18} className="text-emerald-600 dark:text-emerald-400" />
    </div>
    <div>
      <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
        Plan upgraded successfully!
      </p>
      <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-0.5">
        Your new plan is now active. Enjoy your upgraded features.
      </p>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Subscription: React.FC<SubscriptionProps> = ({
  subscription,
  isLoading,
  isFetching,
  onChangePlan,
  onCancelSubscription,
  isChangingPlan,
  isCancelling,
  upgradeSuccess,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { plans, isLoading: isLoadingPlans } = useDynamicPlans();
  const [confirmModal, setConfirmModal] = useState<{
    open: boolean;
    plan: 'starter' | 'pro' | 'business';
    action: 'upgrade' | 'downgrade';
  }>({ open: false, plan: 'starter', action: 'downgrade' });

  if (isLoading || isLoadingPlans) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <SubscriptionSkeleton />
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center py-16">
          <div className="w-14 h-14 rounded-2xl bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mx-auto mb-4">
            <CreditCard size={24} className="text-neutral-400" />
          </div>
          <h3 className="text-base font-semibold text-neutral-900 dark:text-white mb-1">
            Unable to load subscription
          </h3>
          <p className="text-sm text-neutral-500">Please try refreshing the page.</p>
        </div>
      </div>
    );
  }

  const handlePlanSelect = (planId: 'starter' | 'pro' | 'business') => {
    const currentIndex = plans.findIndex((p) => p.id === subscription.plan);
    const targetIndex = plans.findIndex((p) => p.id === planId);
    const isExpiredOrNone =
      subscription.subscriptionStatus === 'expired' || subscription.subscriptionStatus === 'none';
    const isUpgrade = isExpiredOrNone || targetIndex > currentIndex;

    if (isUpgrade && planId !== 'starter') {
      // Upgrades go directly to Paystack — no confirmation needed
      onChangePlan(planId);
    } else {
      // Downgrade — show confirmation modal
      setConfirmModal({ open: true, plan: planId, action: 'downgrade' });
    }
  };

  const handleConfirmDowngrade = async () => {
    onChangePlan(confirmModal.plan);
    setConfirmModal((prev) => ({ ...prev, open: false }));
  };

  const targetPlanData = plans.find((p) => p.id === confirmModal.plan);
  const showCancelSection =
    subscription.subscriptionStatus === 'active' && subscription.plan !== 'starter';

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Page header */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-1">
          <Crown size={20} className="text-blue" />
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Subscription</h1>
        </div>
        <p className="text-sm text-neutral-500">
          Manage your plan, billing, and subscription preferences.
        </p>
      </div>

      <div className="space-y-6">
        {/* Upgrade success banner */}
        {upgradeSuccess && <UpgradeSuccessBanner />}

        {/* Fetching overlay indicator */}
        {isFetching && !isLoading && (
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <Loader2 size={12} className="animate-spin" />
            Refreshing...
          </div>
        )}

        {/* Section 1: Current Plan */}
        <CurrentPlanCard subscription={subscription} plans={plans} />

        {/* Section 2: Plan Comparison */}
        <PlanCards
          currentPlan={subscription.plan}
          subscriptionStatus={subscription.subscriptionStatus}
          onSelect={handlePlanSelect}
          isChangingPlan={isChangingPlan}
          isMobile={isMobile}
          plans={plans}
        />

        {/* Section 3: Cancel Subscription */}
        {showCancelSection && (
          <CancelSection
            subscription={subscription}
            onCancel={onCancelSubscription}
            isCancelling={isCancelling}
            plans={plans}
          />
        )}
      </div>

      {/* Downgrade Confirmation Modal */}
      <Modal
        open={confirmModal.open}
        onCancel={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
        footer={null}
        centered
        closable={false}
        width={420}
      >
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mx-auto mb-4">
            <ArrowDownCircle size={24} className="text-amber-500" />
          </div>
          <h3 className="text-lg font-bold text-neutral-900 dark:text-white mb-2">
            Downgrade to {targetPlanData?.name}?
          </h3>
          <p className="text-sm text-neutral-500 leading-relaxed mb-1">
            {confirmModal.plan === 'starter'
              ? 'This will cancel your current subscription.'
              : `You'll be switching to the ${targetPlanData?.name} plan.`}
          </p>
          {subscription.planExpiresAt && (
            <p className="text-sm text-neutral-500 leading-relaxed mb-6">
              Your current plan will remain active until{' '}
              <strong>{formatDate(subscription.planExpiresAt)}</strong>.
            </p>
          )}
          {!subscription.planExpiresAt && <div className="mb-6" />}
          <div className="flex gap-3">
            <button
              onClick={() => setConfirmModal((prev) => ({ ...prev, open: false }))}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors"
            >
              Keep Current Plan
            </button>
            <button
              onClick={handleConfirmDowngrade}
              disabled={isChangingPlan}
              className="flex-1 py-2.5 rounded-xl text-sm font-semibold bg-amber-500 hover:bg-amber-600 text-white transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {isChangingPlan ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Processing...
                </>
              ) : (
                'Yes, Downgrade'
              )}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Subscription;
