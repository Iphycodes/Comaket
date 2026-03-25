'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  CheckCheck,
  Trash2,
  Package,
  ShoppingCart,
  Heart,
  Star,
  AlertCircle,
  UserPlus,
  Store,
  Truck,
  CheckCircle,
  XCircle,
  X,
  ChevronRight,
  Inbox,
  Sparkles,
} from 'lucide-react';
import {
  useGetAlertsQuery,
  useMarkAlertAsReadMutation,
  useMarkAllAlertsAsReadMutation,
  useDeleteAlertMutation,
  useClearAllAlertsMutation,
  Alert,
} from '@grc/services/alerts';
import { useRouter } from 'next/navigation';
import { message } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

// Alert type → icon + color mapping
const alertTypeConfig: Record<string, { icon: React.ElementType; color: string; bg: string }> = {
  welcome: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  order_placed: {
    icon: ShoppingCart,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  order_confirmed: {
    icon: CheckCircle,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  order_processing: {
    icon: Package,
    color: 'text-indigo-500',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
  },
  order_shipped: {
    icon: Truck,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
  },
  order_delivered: {
    icon: CheckCheck,
    color: 'text-teal-500',
    bg: 'bg-teal-50 dark:bg-teal-900/20',
  },
  order_completed: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  order_cancelled: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  order_refunded: {
    icon: XCircle,
    color: 'text-orange-500',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
  },
  new_order_received: {
    icon: ShoppingCart,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  listing_submitted: {
    icon: Package,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  listing_approved: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  listing_rejected: { icon: XCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  listing_live: { icon: Star, color: 'text-amber-500', bg: 'bg-amber-50 dark:bg-amber-900/20' },
  listing_sold: {
    icon: ShoppingCart,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  payment_successful: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  payment_failed: { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50 dark:bg-red-900/20' },
  store_created: { icon: Store, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
  store_verified: {
    icon: CheckCircle,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  new_follower: { icon: UserPlus, color: 'text-pink-500', bg: 'bg-pink-50 dark:bg-pink-900/20' },
  new_review: { icon: Heart, color: 'text-rose-500', bg: 'bg-rose-50 dark:bg-rose-900/20' },
  dispute_submitted: {
    icon: AlertCircle,
    color: 'text-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  dispute_resolved: {
    icon: CheckCircle,
    color: 'text-green-500',
    bg: 'bg-green-50 dark:bg-green-900/20',
  },
  system_announcement: { icon: Bell, color: 'text-blue-500', bg: 'bg-blue-50 dark:bg-blue-900/20' },
};

const defaultConfig = {
  icon: Bell,
  color: 'text-neutral-500',
  bg: 'bg-neutral-50 dark:bg-neutral-800/40',
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

export default function AlertsPage() {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const router = useRouter();
  const [page, setPage] = useState(1);

  // Track which alerts were unread when the page first loaded (these are "new")
  const [newAlertIds, setNewAlertIds] = useState<Set<string>>(new Set());
  const hasMarkedRef = useRef(false);

  const { data: alertsData, isLoading } = useGetAlertsQuery({ page, perPage: 30 });

  const [_markAsRead] = useMarkAlertAsReadMutation();
  const [markAllAsRead] = useMarkAllAlertsAsReadMutation();
  const [deleteAlert] = useDeleteAlertMutation();
  const [clearAll] = useClearAllAlertsMutation();

  const alerts = alertsData?.data?.data || [];
  const pagination = alertsData?.data?.pagination;

  // On first load: capture unread alert IDs, then mark all as read
  useEffect(() => {
    if (alerts.length > 0 && !hasMarkedRef.current) {
      const unreadIds = new Set<string>(
        alerts.filter((a: Alert) => !a.isRead).map((a: Alert) => a._id)
      );
      if (unreadIds.size > 0) {
        setNewAlertIds(unreadIds);
        // Mark all as read silently
        markAllAsRead({ options: { noSuccessMessage: true } } as any).catch(() => {});
      }
      hasMarkedRef.current = true;
    }
  }, [alerts, markAllAsRead]);

  const handleAlertClick = useCallback(
    async (alert: Alert) => {
      // Navigate based on entity type
      if (alert.entityType === 'order' && alert.metadata?.orderNumber) {
        router.push('/profile?tab=orders');
      } else if (alert.entityType === 'listing') {
        router.push('/profile?tab=orders');
      } else if (alert.entityType === 'store' && alert.entityId) {
        router.push(`/stores/${alert.entityId}`);
      }
    },
    [router]
  );

  const handleClearAll = async () => {
    try {
      await clearAll().unwrap();
      setNewAlertIds(new Set());
      message.success('All notifications cleared');
    } catch {
      message.error('Failed to clear notifications');
    }
  };

  const handleDelete = async (e: React.MouseEvent, alertId: string) => {
    e.stopPropagation();
    try {
      await deleteAlert(alertId).unwrap();
      setNewAlertIds((prev) => {
        const next = new Set(prev);
        next.delete(alertId);
        return next;
      });
    } catch {
      message.error('Failed to delete notification');
    }
  };

  const newCount = newAlertIds.size;

  return (
    <div className={`max-w-2xl mx-auto px-4 ${isMobile ? 'pt-14 pb-28' : 'py-6'}`}>
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Bell size={20} className="text-neutral-600 dark:text-neutral-400" />
          <h1 className="text-lg font-bold text-neutral-900 dark:text-neutral-100">
            Notifications
          </h1>
          {newCount > 0 && (
            <span className="text-[10px] font-bold bg-blue/10 text-blue px-2 py-0.5 rounded-full">
              {newCount} new
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {alerts.length > 0 && (
            <button
              onClick={handleClearAll}
              className="flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-red-500 transition-colors px-2.5 py-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <Trash2 size={14} />
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Alert list */}
      {isLoading ? (
        <div className="space-y-3">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="animate-pulse flex gap-3 p-4 rounded-xl bg-neutral-100 dark:bg-neutral-800"
            >
              <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-1/3" />
                <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-2/3" />
              </div>
            </div>
          ))}
        </div>
      ) : alerts.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-4">
            <Inbox size={28} className="text-neutral-400" />
          </div>
          <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">
            No notifications yet
          </p>
          <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
            You&apos;ll be notified about orders, listings, and more
          </p>
        </div>
      ) : (
        <div className="space-y-1.5">
          {/* New notifications section */}
          {newCount > 0 && (
            <div className="flex items-center gap-2 mb-3">
              <Sparkles size={14} className="text-blue" />
              <span className="text-xs font-semibold text-blue">New</span>
              <div className="flex-1 h-px bg-blue/20" />
            </div>
          )}

          <AnimatePresence mode="popLayout">
            {alerts.map((alert: Alert, index: number) => {
              const cfg = alertTypeConfig[alert.type] || defaultConfig;
              const Icon = cfg.icon;
              const isNew = newAlertIds.has(alert._id);

              // Insert "Earlier" divider after the last new notification
              const prevAlert = index > 0 ? alerts[index - 1] : null;
              const showEarlierDivider = !isNew && prevAlert && newAlertIds.has(prevAlert._id);

              return (
                <React.Fragment key={alert._id}>
                  {showEarlierDivider && (
                    <div className="flex items-center gap-2 my-3">
                      <span className="text-xs font-semibold text-neutral-400">Earlier</span>
                      <div className="flex-1 h-px bg-neutral-200 dark:bg-neutral-700" />
                    </div>
                  )}
                  <motion.div
                    layout
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => handleAlertClick(alert)}
                    className={`group flex items-start gap-3 p-3.5 rounded-xl cursor-pointer transition-all border ${
                      isNew
                        ? 'bg-blue-50/60 dark:bg-blue-900/15 border-blue-100 dark:border-blue-800/30'
                        : 'bg-white dark:bg-neutral-900 border-neutral-100 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                    }`}
                  >
                    {/* Icon */}
                    <div
                      className={`flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center ${cfg.bg}`}
                    >
                      <Icon size={16} className={cfg.color} />
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span
                          className={`text-sm font-semibold truncate ${
                            isNew
                              ? 'text-neutral-900 dark:text-white'
                              : 'text-neutral-700 dark:text-neutral-200'
                          }`}
                        >
                          {alert.title}
                        </span>
                        {isNew && <div className="w-2 h-2 rounded-full bg-blue flex-shrink-0" />}
                      </div>
                      <p className="text-xs text-neutral-600 dark:text-neutral-400 line-clamp-2 leading-relaxed">
                        {alert.message}
                      </p>
                      <span className="text-[10px] text-neutral-400 dark:text-neutral-500 mt-1 block">
                        {timeAgo(alert.createdAt)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={(e) => handleDelete(e, alert._id)}
                        className="p-1.5 rounded-lg text-neutral-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      >
                        <X size={14} />
                      </button>
                      {alert.entityType && (
                        <ChevronRight
                          size={14}
                          className="text-neutral-300 dark:text-neutral-600"
                        />
                      )}
                    </div>
                  </motion.div>
                </React.Fragment>
              );
            })}
          </AnimatePresence>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <div className="flex justify-center gap-2 pt-4">
              <button
                disabled={page <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 disabled:opacity-40 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Previous
              </button>
              <span className="px-3 py-1.5 text-xs text-neutral-500">
                {page} / {pagination.totalPages}
              </span>
              <button
                disabled={page >= pagination.totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="px-3 py-1.5 text-xs font-medium rounded-lg bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 disabled:opacity-40 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
