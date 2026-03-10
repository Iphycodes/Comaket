'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  DollarSign,
  ShoppingCart,
  Package,
  Star,
  Eye,
  Users,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Truck,
  Store,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface MetricCardProps {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  subtitle?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// METRIC CARD
// ═══════════════════════════════════════════════════════════════════════════

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  icon: Icon,
  iconColor,
  iconBg,
  subtitle,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-neutral-800/60 rounded-2xl p-5 border border-neutral-100 dark:border-neutral-700/50 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
    <p className="text-2xl font-bold text-neutral-900 dark:text-white mt-3">{value}</p>
    <p className="text-xs text-neutral-500 mt-1">{label}</p>
    {subtitle && <p className="text-[11px] text-neutral-400 mt-0.5">{subtitle}</p>}
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// ORDER STATUS BADGE
// ═══════════════════════════════════════════════════════════════════════════

const orderStatusConfig: Record<string, { label: string; color: string; icon: React.ElementType }> =
  {
    pending: {
      label: 'Pending',
      color: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
      icon: Clock,
    },
    processing: {
      label: 'Processing',
      color: 'bg-blue-50 text-blue dark:bg-blue-900/20 dark:text-blue',
      icon: Package,
    },
    shipped: {
      label: 'Shipped',
      color: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/20 dark:text-indigo-400',
      icon: Truck,
    },
    delivered: {
      label: 'Delivered',
      color: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400',
      icon: CheckCircle,
    },
    cancelled: {
      label: 'Cancelled',
      color: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
      icon: AlertCircle,
    },
  };

const OrderStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const config = orderStatusConfig[status] || orderStatusConfig.pending;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold ${config.color}`}
    >
      <Icon size={10} />
      {config.label}
    </span>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

interface StoreDashboardProps {
  storeId: string;
  storeName: string;
  store: any;
  totalProducts: number;
  isLoadingProducts: boolean;
  recentOrders: any[];
  totalOrders: number;
  isLoadingOrders: boolean;
}

const StoreDashboard: React.FC<StoreDashboardProps> = ({
  storeId,
  storeName,
  store,
  totalProducts,
  recentOrders,
  totalOrders,
  isLoadingOrders,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const router = useRouter();

  // ── Derive metrics from store data ──────────────────────────────────
  const totalRevenue = store?.totalRevenue || store?.analytics?.totalRevenue || 0;
  const totalSales = store?.totalSales || store?.analytics?.totalSales || 0;
  const storeRating = store?.rating || store?.averageRating || 0;
  const totalReviews = store?.totalReviews || 0;
  const totalViews = store?.views || store?.analytics?.totalViews || 0;
  const totalFollowers = store?.followersCount || store?.totalFollowers || 0;

  // Count orders by status from recent orders
  const pendingOrders = recentOrders.filter((o: any) => o.status === 'pending').length;
  const liveProducts = store?.totalListings || totalProducts;
  const inReviewProducts = store?.pendingListings || 0;

  const formatRelativeTime = (dateStr: string) => {
    if (!dateStr) return '';
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  // ── Extract order display data ──────────────────────────────────────
  const getOrderDisplayData = (order: any) => {
    const items = order?.items || order?.orderItems || [];
    const firstItem = items[0];
    const listing =
      firstItem?.listingId && typeof firstItem.listingId === 'object' ? firstItem.listingId : null;
    const buyer = order?.buyerId && typeof order.buyerId === 'object' ? order.buyerId : null;

    return {
      id: order?.orderNumber || order?._id || '',
      customerName: buyer
        ? `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim()
        : order?.customerName || 'Customer',
      productName: listing?.itemName || firstItem?.itemName || 'Order',
      amount: order?.totalAmount || order?.total || 0,
      status: order?.status || 'pending',
      date: order?.createdAt || '',
      itemCount: items.length,
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-neutral-500 mt-0.5">
          Overview of {storeName}&apos;s performance
        </p>
      </div>

      {/* Primary Metrics */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <MetricCard
          label="Total Revenue"
          value={totalRevenue > 0 ? numberFormat(totalRevenue / 100, Currencies.NGN) : '₦0'}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
          subtitle={totalSales > 0 ? `${totalSales} sale${totalSales !== 1 ? 's' : ''}` : undefined}
        />
        <MetricCard
          label="Total Orders"
          value={`${totalOrders}`}
          icon={ShoppingCart}
          iconColor="text-blue"
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          subtitle={pendingOrders > 0 ? `${pendingOrders} pending` : undefined}
        />
        <MetricCard
          label="Active Products"
          value={`${liveProducts}`}
          icon={Package}
          iconColor="text-violet-600"
          iconBg="bg-violet-50 dark:bg-violet-900/20"
          subtitle={inReviewProducts > 0 ? `${inReviewProducts} in review` : undefined}
        />
        <MetricCard
          label="Store Rating"
          value={storeRating > 0 ? storeRating.toFixed(1) : '—'}
          icon={Star}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          subtitle={
            totalReviews > 0
              ? `${totalReviews} review${totalReviews !== 1 ? 's' : ''}`
              : 'No reviews yet'
          }
        />
      </div>

      {/* Secondary Metrics */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
        <MetricCard
          label="Store Views"
          value={totalViews > 0 ? totalViews.toLocaleString() : '0'}
          icon={Eye}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-50 dark:bg-cyan-900/20"
        />
        <MetricCard
          label="Followers"
          value={totalFollowers > 0 ? totalFollowers.toLocaleString() : '0'}
          icon={Users}
          iconColor="text-pink-600"
          iconBg="bg-pink-50 dark:bg-pink-900/20"
        />
        {!isMobile && (
          <MetricCard
            label="Total Products"
            value={`${totalProducts}`}
            icon={Store}
            iconColor="text-orange-600"
            iconBg="bg-orange-50 dark:bg-orange-900/20"
          />
        )}
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50"
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">Recent Orders</h3>
          <button
            onClick={() => router.push(`/my-store/${storeId}/orders`)}
            className="text-xs font-semibold text-blue hover:text-blue flex items-center gap-1"
          >
            View All <ExternalLink size={10} />
          </button>
        </div>

        {isLoadingOrders ? (
          <div className="p-8 text-center">
            <div className="w-6 h-6 border-2 border-blue/30 border-t-blue rounded-full animate-spin mx-auto mb-2" />
            <p className="text-xs text-neutral-400">Loading orders...</p>
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="text-center py-12 px-4">
            <ShoppingCart
              size={32}
              className="mx-auto text-neutral-200 dark:text-neutral-700 mb-3"
            />
            <p className="text-sm text-neutral-400">No orders yet</p>
            <p className="text-xs text-neutral-400 mt-1">Orders from customers will appear here</p>
          </div>
        ) : !isMobile ? (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-700">
                  <th className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-5 pb-3">
                    Order
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-5 pb-3">
                    Customer
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-5 pb-3">
                    Product
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-5 pb-3">
                    Amount
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-5 pb-3">
                    Status
                  </th>
                  <th className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-5 pb-3">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.slice(0, 5).map((order: any) => {
                  const d = getOrderDisplayData(order);
                  return (
                    <tr
                      key={order._id || order.id}
                      className="border-b border-neutral-50 dark:border-neutral-700/30 hover:bg-neutral-50/50 dark:hover:bg-neutral-700/20 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5 text-xs font-semibold text-blue">{d.id}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                            <span className="text-[10px] font-bold text-neutral-500">
                              {d.customerName.charAt(0)}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-neutral-900 dark:text-white">
                            {d.customerName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-neutral-600 dark:text-neutral-400">
                        {d.productName}
                        {d.itemCount > 1 ? ` +${d.itemCount - 1}` : ''}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-neutral-900 dark:text-white">
                        {numberFormat(d.amount / 100, Currencies.NGN)}
                      </td>
                      <td className="px-5 py-3.5">
                        <OrderStatusBadge status={d.status} />
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-neutral-400">
                        {formatRelativeTime(d.date)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-4 space-y-3">
            {recentOrders.slice(0, 5).map((order: any) => {
              const d = getOrderDisplayData(order);
              return (
                <div
                  key={order._id || order.id}
                  className="flex items-center gap-3 p-3 bg-neutral-50 dark:bg-neutral-800 rounded-xl"
                >
                  <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0">
                    <span className="text-xs font-bold text-neutral-500">
                      {d.customerName.charAt(0)}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-semibold text-neutral-900 dark:text-white truncate">
                        {d.productName}
                      </p>
                      <span className="text-xs font-bold text-neutral-900 dark:text-white flex-shrink-0">
                        {numberFormat(d.amount / 100, Currencies.NGN)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2 mt-1">
                      <span className="text-[11px] text-neutral-400">{d.customerName}</span>
                      <OrderStatusBadge status={d.status} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StoreDashboard;
