'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Select, message as antMessage } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  BellOff,
  ShoppingCart,
  Star,
  Package,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Truck,
  Eye,
  Trash2,
  CheckCheck,
  ArrowLeft,
  X,
  ExternalLink,
  Info,
  UserPlus,
  Megaphone,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type NotificationType =
  | 'new_order'
  | 'order_update'
  | 'new_review'
  | 'product_approved'
  | 'product_rejected'
  | 'low_stock'
  | 'payout'
  | 'new_follower'
  | 'system'
  | 'promotion';

interface StoreNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  /** Optional deep-link path within the store portal */
  actionUrl?: string;
  actionLabel?: string;
  /** Extra metadata rendered in detail */
  meta?: Record<string, string>;
}

// ═══════════════════════════════════════════════════════════════════════════
// TYPE CONFIG — icon, color, background per notification type
// ═══════════════════════════════════════════════════════════════════════════

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string; bg: string; label: string }
> = {
  new_order: {
    icon: ShoppingCart,
    color: 'text-blue dark:text-blue',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    label: 'New Order',
  },
  order_update: {
    icon: Truck,
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    label: 'Order Update',
  },
  new_review: {
    icon: Star,
    color: 'text-amber-500 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    label: 'New Review',
  },
  product_approved: {
    icon: CheckCircle,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    label: 'Product Approved',
  },
  product_rejected: {
    icon: AlertTriangle,
    color: 'text-red-500 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    label: 'Product Rejected',
  },
  low_stock: {
    icon: Package,
    color: 'text-orange-600 dark:text-orange-400',
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    label: 'Low Stock',
  },
  payout: {
    icon: DollarSign,
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    label: 'Payout',
  },
  new_follower: {
    icon: UserPlus,
    color: 'text-violet-600 dark:text-violet-400',
    bg: 'bg-violet-50 dark:bg-violet-900/20',
    label: 'New Follower',
  },
  system: {
    icon: Info,
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-700/40',
    label: 'System',
  },
  promotion: {
    icon: Megaphone,
    color: 'text-pink-600 dark:text-pink-400',
    bg: 'bg-pink-50 dark:bg-pink-900/20',
    label: 'Promotion',
  },
};

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const now = new Date();
const hoursAgo = (h: number) => new Date(now.getTime() - h * 3600000).toISOString();
const daysAgo = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

const mockNotifications: StoreNotification[] = [
  {
    id: 'n01',
    type: 'new_order',
    title: 'New Order Received',
    message: 'Chidera Nwosu placed an order for iPhone 14 Pro Max worth ₦850,000.',
    timestamp: hoursAgo(0.5),
    read: false,
    actionUrl: '/orders',
    actionLabel: 'View Order',
    meta: { 'Order ID': 'ORD-2025-007', Amount: '₦850,000', Customer: 'Chidera Nwosu' },
  },
  {
    id: 'n02',
    type: 'new_review',
    title: 'New 5-Star Review',
    message:
      'Amaka Eze left a 5-star review: "Amazing product! Fast delivery and great packaging."',
    timestamp: hoursAgo(1),
    read: false,
    actionUrl: '/reviews',
    actionLabel: 'Reply',
    meta: { Rating: '★★★★★', Product: 'Samsung Galaxy S24' },
  },
  {
    id: 'n03',
    type: 'new_order',
    title: 'New Order Received',
    message: 'Tunde Bakare placed an order for AirPods Pro 2 and iPhone Case.',
    timestamp: hoursAgo(2),
    read: false,
    actionUrl: '/orders',
    actionLabel: 'View Order',
    meta: { 'Order ID': 'ORD-2025-008', Amount: '₦165,000', Items: '2' },
  },
  {
    id: 'n04',
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'iPhone 14 Pro Max has only 2 units remaining. Consider restocking soon.',
    timestamp: hoursAgo(3),
    read: false,
    actionUrl: '/products',
    actionLabel: 'Manage Product',
    meta: { Product: 'iPhone 14 Pro Max', 'Remaining Stock': '2 units' },
  },
  {
    id: 'n05',
    type: 'product_approved',
    title: 'Product Approved',
    message: 'Your listing "MacBook Air M3 15-inch" has been approved and is now live.',
    timestamp: hoursAgo(5),
    read: false,
    actionUrl: '/products',
    actionLabel: 'View Product',
  },
  {
    id: 'n06',
    type: 'new_follower',
    title: 'New Follower',
    message: 'Blessing Adeyemi started following your store.',
    timestamp: hoursAgo(6),
    read: true,
  },
  {
    id: 'n07',
    type: 'payout',
    title: 'Payout Processed',
    message: '₦1,250,000 has been sent to your GTBank account ending in 6789.',
    timestamp: hoursAgo(8),
    read: true,
    meta: { Amount: '₦1,250,000', Bank: 'GTBank ****6789', Reference: 'PAY-20250218-001' },
  },
  {
    id: 'n08',
    type: 'order_update',
    title: 'Order Delivered',
    message: 'Order ORD-2025-003 has been marked as delivered by the courier.',
    timestamp: daysAgo(1),
    read: true,
    actionUrl: '/orders',
    actionLabel: 'View Order',
  },
  {
    id: 'n09',
    type: 'new_review',
    title: 'New 3-Star Review',
    message: 'Ngozi Okafor left a 3-star review: "Product was okay but took longer than expected."',
    timestamp: daysAgo(1),
    read: true,
    actionUrl: '/reviews',
    actionLabel: 'Reply',
    meta: { Rating: '★★★☆☆', Product: 'AirPods Pro 2' },
  },
  {
    id: 'n10',
    type: 'product_rejected',
    title: 'Product Rejected',
    message:
      'Your listing "Wireless Speaker XL" was rejected. Reason: Image quality does not meet standards.',
    timestamp: daysAgo(1),
    read: true,
    actionUrl: '/products',
    actionLabel: 'Edit & Resubmit',
    meta: { Reason: 'Image quality does not meet standards' },
  },
  {
    id: 'n11',
    type: 'promotion',
    title: 'Boost Your Sales',
    message:
      'Stores that add at least 5 products this week get featured on the homepage. You have 3 so far!',
    timestamp: daysAgo(2),
    read: true,
  },
  {
    id: 'n12',
    type: 'system',
    title: 'Scheduled Maintenance',
    message:
      'Comaket will undergo maintenance on Feb 20, 2-4 AM WAT. Your store may be briefly unavailable.',
    timestamp: daysAgo(2),
    read: true,
  },
  {
    id: 'n13',
    type: 'new_follower',
    title: 'New Follower',
    message: 'Ibrahim Musa started following your store.',
    timestamp: daysAgo(3),
    read: true,
  },
  {
    id: 'n14',
    type: 'low_stock',
    title: 'Low Stock Alert',
    message: 'Samsung Galaxy S24 has only 1 unit remaining.',
    timestamp: daysAgo(3),
    read: true,
    actionUrl: '/products',
    actionLabel: 'Manage Product',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// TIME HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const isToday = (d: string) => {
  const date = new Date(d);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

const isYesterday = (d: string) => {
  const date = new Date(d);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  return (
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear()
  );
};

const formatRelativeTime = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-NG', {
    day: 'numeric',
    month: 'short',
  });
};

const formatFullDate = (dateStr: string) =>
  new Date(dateStr).toLocaleDateString('en-NG', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

// ═══════════════════════════════════════════════════════════════════════════
// GROUP NOTIFICATIONS BY DATE
// ═══════════════════════════════════════════════════════════════════════════

interface NotificationGroup {
  label: string;
  items: StoreNotification[];
}

const groupNotifications = (list: StoreNotification[]): NotificationGroup[] => {
  const today: StoreNotification[] = [];
  const yesterday: StoreNotification[] = [];
  const earlier: StoreNotification[] = [];

  list.forEach((n) => {
    if (isToday(n.timestamp)) today.push(n);
    else if (isYesterday(n.timestamp)) yesterday.push(n);
    else earlier.push(n);
  });

  const groups: NotificationGroup[] = [];
  if (today.length) groups.push({ label: 'Today', items: today });
  if (yesterday.length) groups.push({ label: 'Yesterday', items: yesterday });
  if (earlier.length) groups.push({ label: 'Earlier', items: earlier });
  return groups;
};

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION DETAIL VIEW (mobile full-screen + desktop inline)
// ═══════════════════════════════════════════════════════════════════════════

const NotificationDetail: React.FC<{
  notification: StoreNotification;
  onBack: () => void;
  onNavigate: (url: string) => void;
  onDelete: (id: string) => void;
  onToggleRead: (id: string) => void;
}> = ({ notification: n, onBack, onNavigate, onDelete, onToggleRead }) => {
  const cfg = typeConfig[n.type];
  const Icon = cfg.icon;

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start gap-3">
        <button
          onClick={onBack}
          className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors mt-0.5"
        >
          <ArrowLeft size={18} className="text-gray-500" />
        </button>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${cfg.color} ${cfg.bg}`}
            >
              <Icon size={10} /> {cfg.label}
            </span>
            {!n.read && <span className="w-2 h-2 rounded-full bg-blue flex-shrink-0" />}
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white mt-1.5">{n.title}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{formatFullDate(n.timestamp)}</p>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{n.message}</p>
      </div>

      {/* Metadata table */}
      {n.meta && Object.keys(n.meta).length > 0 && (
        <div className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
          <div className="px-5 py-3 border-b border-gray-100 dark:border-gray-700/50">
            <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              Details
            </h4>
          </div>
          <div className="divide-y divide-gray-50 dark:divide-gray-700/30">
            {Object.entries(n.meta).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between px-5 py-3">
                <span className="text-xs text-gray-500">{key}</span>
                <span className="text-xs font-semibold text-gray-900 dark:text-white">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-2">
        {n.actionUrl && (
          <button
            onClick={() => onNavigate(n.actionUrl!)}
            className="w-full py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <ExternalLink size={14} />
            {n.actionLabel || 'Go to Page'}
          </button>
        )}
        <div className="flex gap-2">
          <button
            onClick={() => onToggleRead(n.id)}
            className="flex-1 py-2.5 rounded-xl text-xs font-medium border border-gray-200 dark:border-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors flex items-center justify-center gap-1.5"
          >
            {n.read ? (
              <>
                <Eye size={13} /> Mark Unread
              </>
            ) : (
              <>
                <CheckCheck size={13} /> Mark Read
              </>
            )}
          </button>
          <button
            onClick={() => onDelete(n.id)}
            className="flex-1 py-2.5 rounded-xl text-xs font-medium border border-red-200 dark:border-red-800/50 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center justify-center gap-1.5"
          >
            <Trash2 size={13} /> Delete
          </button>
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// NOTIFICATION ROW
// ═══════════════════════════════════════════════════════════════════════════

const NotificationRow: React.FC<{
  notification: StoreNotification;
  onClick: () => void;
}> = ({ notification: n, onClick }) => {
  const cfg = typeConfig[n.type];
  const Icon = cfg.icon;

  return (
    <motion.button
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -40 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`w-full flex items-start gap-3 p-4 rounded-xl text-left transition-all ${
        n.read
          ? 'bg-white dark:bg-gray-800/40 hover:bg-gray-50 dark:hover:bg-gray-800/60'
          : 'bg-blue-50/50 dark:bg-blue-900/10 hover:bg-blue-50 dark:hover:bg-blue-900/15 border border-blue-100/50 dark:border-blue-800/20'
      }`}
    >
      {/* Icon */}
      <div
        className={`w-10 h-10 rounded-xl ${cfg.bg} flex items-center justify-center flex-shrink-0 mt-0.5`}
      >
        <Icon size={18} className={cfg.color} />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <p
            className={`text-sm font-semibold truncate ${
              n.read ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'
            }`}
          >
            {n.title}
          </p>
          {!n.read && <span className="w-2 h-2 rounded-full bg-blue flex-shrink-0" />}
        </div>
        <p
          className={`text-xs mt-0.5 line-clamp-2 leading-relaxed ${
            n.read ? 'text-gray-400' : 'text-gray-600 dark:text-gray-400'
          }`}
        >
          {n.message}
        </p>
        <div className="flex items-center gap-2 mt-1.5">
          <span
            className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[9px] font-semibold ${cfg.color} ${cfg.bg}`}
          >
            <Icon size={8} /> {cfg.label}
          </span>
          <span className="text-[10px] text-gray-400">{formatRelativeTime(n.timestamp)}</span>
        </div>
      </div>
    </motion.button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FILTER OPTIONS
// ═══════════════════════════════════════════════════════════════════════════

const filterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Orders', value: 'orders' },
  { label: 'Reviews', value: 'reviews' },
  { label: 'Products', value: 'products' },
  { label: 'Payouts', value: 'payouts' },
  { label: 'Followers', value: 'followers' },
  { label: 'System', value: 'system' },
];

const typesByFilter: Record<string, NotificationType[]> = {
  all: [],
  orders: ['new_order', 'order_update'],
  reviews: ['new_review'],
  products: ['product_approved', 'product_rejected', 'low_stock'],
  payouts: ['payout'],
  followers: ['new_follower'],
  system: ['system', 'promotion'],
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface StoreNotificationsProps {
  storeId: string;
}

const StoreNotifications: React.FC<StoreNotificationsProps> = ({ storeId }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [notifications, setNotifications] = useState<StoreNotification[]>(mockNotifications);
  const [filterCategory, setFilterCategory] = useState('all');
  const [readFilter, setReadFilter] = useState<'all' | 'unread' | 'read'>('all');
  const [selectedNotification, setSelectedNotification] = useState<StoreNotification | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // ── Computed ─────────────────────────────────────────────────────────
  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const filteredNotifications = useMemo(() => {
    return notifications.filter((n) => {
      // Category filter
      if (filterCategory !== 'all') {
        const allowedTypes = typesByFilter[filterCategory] || [];
        if (!allowedTypes.includes(n.type)) return false;
      }
      // Read filter
      if (readFilter === 'unread' && n.read) return false;
      if (readFilter === 'read' && !n.read) return false;
      return true;
    });
  }, [notifications, filterCategory, readFilter]);

  const groupedNotifications = useMemo(
    () => groupNotifications(filteredNotifications),
    [filteredNotifications]
  );

  // ── Handlers ────────────────────────────────────────────────────────
  const handleViewNotification = useCallback((n: StoreNotification) => {
    // Auto-mark as read on open
    if (!n.read) {
      setNotifications((prev) =>
        prev.map((item) => (item.id === n.id ? { ...item, read: true } : item))
      );
    }
    setSelectedNotification({ ...n, read: true });
    setIsDetailOpen(true);
  }, []);

  const handleCloseDetail = useCallback(() => {
    setIsDetailOpen(false);
    setSelectedNotification(null);
  }, []);

  const handleMarkAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    antMessage.success('All notifications marked as read');
  }, []);

  const handleToggleRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: !n.read } : n)));
    setSelectedNotification((prev) =>
      prev && prev.id === id ? { ...prev, read: !prev.read } : prev
    );
  }, []);

  const handleDelete = useCallback(
    (id: string) => {
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      if (selectedNotification?.id === id) {
        handleCloseDetail();
      }
      antMessage.success('Notification deleted');
    },
    [selectedNotification, handleCloseDetail]
  );

  const handleDeleteAllRead = useCallback(() => {
    setNotifications((prev) => prev.filter((n) => !n.read));
    antMessage.success('Cleared all read notifications');
  }, []);

  const handleNavigate = useCallback(
    (url: string) => {
      // In real app, this would use router.push to the store subpage
      handleCloseDetail();
      // TODO: router.push(`/my-store/${storeId}${url}`);
      antMessage.info(`Navigate to ${url}`);
    },
    [handleCloseDetail, storeId]
  );

  // ── Metric cards ────────────────────────────────────────────────────
  const metricCards = [
    {
      label: 'Unread',
      value: `${unreadCount}`,
      icon: Bell,
      iconColor: 'text-blue',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Total',
      value: `${notifications.length}`,
      icon: CheckCheck,
      iconColor: 'text-gray-600',
      iconBg: 'bg-gray-100 dark:bg-gray-700/40',
    },
    {
      label: 'Orders',
      value: `${
        notifications.filter((n) => n.type === 'new_order' || n.type === 'order_update').length
      }`,
      icon: ShoppingCart,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      label: 'Alerts',
      value: `${
        notifications.filter((n) => n.type === 'low_stock' || n.type === 'product_rejected').length
      }`,
      icon: AlertTriangle,
      iconColor: 'text-orange-500',
      iconBg: 'bg-orange-50 dark:bg-orange-900/20',
    },
  ];

  // ════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════

  return (
    <div className="space-y-5">
      {/* ── Metrics ──────────────────────────────────────────────────── */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {metricCards.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg ${m.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <m.icon size={16} className={m.iconColor} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{m.value}</p>
              <p className="text-[11px] text-gray-500">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ── Header + Actions ─────────────────────────────────────────── */}
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div>
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            {unreadCount > 0
              ? `${unreadCount} unread notification${unreadCount !== 1 ? 's' : ''}`
              : 'All caught up!'}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-blue dark:text-blue bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <CheckCheck size={13} />
              {isMobile ? 'Read All' : 'Mark All Read'}
            </button>
          )}
          {notifications.some((n) => n.read) && (
            <button
              onClick={handleDeleteAllRead}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-gray-500 bg-gray-100 dark:bg-gray-700/50 rounded-lg hover:bg-red-50 hover:text-red-500 dark:hover:bg-red-900/20 dark:hover:text-red-400 transition-colors"
            >
              <Trash2 size={13} />
              {isMobile ? 'Clear' : 'Clear Read'}
            </button>
          )}
        </div>
      </div>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'items-center'}`}>
        {/* Category pills — horizontal scroll on mobile */}
        <div className="flex-1 overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 pb-1">
            {filterOptions.map((opt) => {
              const isActive = filterCategory === opt.value;
              return (
                <button
                  key={opt.value}
                  onClick={() => setFilterCategory(opt.value)}
                  className={`flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    isActive
                      ? 'bg-blue text-white shadow-sm shadow-blue/20'
                      : 'bg-white dark:bg-gray-800 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>
        </div>
        {/* Read/Unread filter */}
        <Select
          value={readFilter}
          onChange={(v) => setReadFilter(v)}
          options={[
            { label: 'All', value: 'all' },
            { label: 'Unread', value: 'unread' },
            { label: 'Read', value: 'read' },
          ]}
          className={`${
            isMobile ? 'w-full' : 'w-[120px]'
          } h-9 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-200 dark:[&_.ant-select-selector]:!border-gray-700 [&_.ant-select-selector]:!text-xs`}
        />
      </div>

      {/* ── Notification List ────────────────────────────────────────── */}
      <div className={isDetailOpen && isMobile ? 'hidden' : ''}>
        {groupedNotifications.length > 0 ? (
          <div className="space-y-6">
            {groupedNotifications.map((group) => (
              <div key={group.label}>
                <div className="flex items-center gap-3 mb-2">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    {group.label}
                  </h3>
                  <div className="flex-1 h-px bg-gray-100 dark:bg-gray-800" />
                  <span className="text-[10px] text-gray-400">{group.items.length}</span>
                </div>
                <div className="space-y-1.5">
                  <AnimatePresence mode="popLayout">
                    {group.items.map((n) => (
                      <NotificationRow
                        key={n.id}
                        notification={n}
                        onClick={() => handleViewNotification(n)}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            ))}
          </div>
        ) : (
          /* Empty state */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20 bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50"
          >
            <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center mx-auto mb-4">
              <BellOff size={28} className="text-gray-300 dark:text-gray-600" />
            </div>
            <p className="text-sm font-semibold text-gray-500 dark:text-gray-400">
              No notifications
            </p>
            <p className="text-xs text-gray-400 mt-1">
              {filterCategory !== 'all' || readFilter !== 'all'
                ? 'Try adjusting your filters'
                : "You're all caught up!"}
            </p>
          </motion.div>
        )}
      </div>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* MOBILE DETAIL — full-screen overlay                          */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isDetailOpen && selectedNotification && isMobile && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 overflow-y-auto"
          >
            <div className="px-4 py-4 pt-12 pb-24">
              <NotificationDetail
                notification={selectedNotification}
                onBack={handleCloseDetail}
                onNavigate={handleNavigate}
                onDelete={handleDelete}
                onToggleRead={handleToggleRead}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ══════════════════════════════════════════════════════════════ */}
      {/* DESKTOP DETAIL — side panel / slide-over                     */}
      {/* ══════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isDetailOpen && selectedNotification && !isMobile && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleCloseDetail}
              className="fixed inset-0 bg-black/20 z-[60]"
            />
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 30, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[440px] bg-white dark:bg-gray-900 border-l border-gray-200 dark:border-gray-800 shadow-2xl z-[70] overflow-y-auto"
            >
              <div className="p-6">
                {/* Close button */}
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
                    Notification Detail
                  </h3>
                  <button
                    onClick={handleCloseDetail}
                    className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                  >
                    <X size={14} className="text-gray-500" />
                  </button>
                </div>
                <NotificationDetail
                  notification={selectedNotification}
                  onBack={handleCloseDetail}
                  onNavigate={handleNavigate}
                  onDelete={handleDelete}
                  onToggleRead={handleToggleRead}
                />
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StoreNotifications;
