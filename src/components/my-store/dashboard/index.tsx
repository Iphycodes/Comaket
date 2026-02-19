'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Tooltip } from 'antd';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Package,
  Star,
  Eye,
  Users,
  ArrowUpRight,
  Clock,
  CheckCircle,
  AlertCircle,
  ExternalLink,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface MetricCardProps {
  label: string;
  value: string;
  change?: number; // percentage
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  subtitle?: string;
}

interface RecentOrder {
  id: string;
  customerName: string;
  productName: string;
  amount: number; // kobo
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  date: string;
  avatar?: string;
}

interface TopProduct {
  id: string;
  name: string;
  image?: string;
  revenue: number;
  unitsSold: number;
  views: number;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const mockRecentOrders: RecentOrder[] = [
  {
    id: 'ORD-001',
    customerName: 'Chidera Nwosu',
    productName: 'iPhone 14 Pro Max',
    amount: 85000000,
    status: 'processing',
    date: '2025-02-18T14:30:00Z',
  },
  {
    id: 'ORD-002',
    customerName: 'Amaka Eze',
    productName: 'Samsung Galaxy S24',
    amount: 62000000,
    status: 'pending',
    date: '2025-02-18T12:15:00Z',
  },
  {
    id: 'ORD-003',
    customerName: 'Tunde Bakare',
    productName: 'AirPods Pro 2',
    amount: 15000000,
    status: 'delivered',
    date: '2025-02-17T16:45:00Z',
  },
  {
    id: 'ORD-004',
    customerName: 'Ngozi Okafor',
    productName: 'MacBook Air M2',
    amount: 120000000,
    status: 'shipped',
    date: '2025-02-17T09:20:00Z',
  },
  {
    id: 'ORD-005',
    customerName: 'Ibrahim Musa',
    productName: 'PS5 Console',
    amount: 45000000,
    status: 'cancelled',
    date: '2025-02-16T20:10:00Z',
  },
];

const mockTopProducts: TopProduct[] = [
  { id: 'p1', name: 'iPhone 14 Pro Max', revenue: 425000000, unitsSold: 5, views: 234 },
  { id: 'p2', name: 'Samsung Galaxy S24', revenue: 310000000, unitsSold: 5, views: 189 },
  { id: 'p3', name: 'AirPods Pro 2', revenue: 150000000, unitsSold: 10, views: 312 },
  { id: 'p4', name: 'MacBook Air M2', revenue: 240000000, unitsSold: 2, views: 156 },
];

// Weekly revenue data (last 7 days)
const weeklyRevenue = [32, 45, 28, 62, 51, 73, 58];
const weekLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ═══════════════════════════════════════════════════════════════════════════
// METRIC CARD
// ═══════════════════════════════════════════════════════════════════════════

const MetricCard: React.FC<MetricCardProps> = ({
  label,
  value,
  change,
  icon: Icon,
  iconColor,
  iconBg,
  subtitle,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow"
  >
    <div className="flex items-start justify-between">
      <div className={`w-10 h-10 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon size={20} className={iconColor} />
      </div>
      {change !== undefined && (
        <div
          className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${
            change >= 0
              ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400'
              : 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400'
          }`}
        >
          {change >= 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
          {Math.abs(change)}%
        </div>
      )}
    </div>
    <p className="text-2xl font-bold text-gray-900 dark:text-white mt-3">{value}</p>
    <p className="text-xs text-gray-500 mt-1">{label}</p>
    {subtitle && <p className="text-[11px] text-gray-400 mt-0.5">{subtitle}</p>}
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MINI BAR CHART
// ═══════════════════════════════════════════════════════════════════════════

const MiniBarChart: React.FC<{ data: number[]; labels: string[] }> = ({ data, labels }) => {
  const max = Math.max(...data);
  return (
    <div className="flex items-end gap-1.5 h-24">
      {data.map((val, i) => (
        <Tooltip key={i} title={`${labels[i]}: ₦${(val * 1000).toLocaleString()}`}>
          <div className="flex-1 flex flex-col items-center gap-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(val / max) * 100}%` }}
              transition={{ delay: i * 0.05, duration: 0.4, ease: 'easeOut' }}
              className="w-full rounded-t-md bg-gradient-to-t from-blue to-blue dark:from-blue dark:to-blue min-h-[4px] cursor-pointer hover:from-blue hover:to-blue transition-colors"
            />
            <span className="text-[9px] text-gray-400">{labels[i]}</span>
          </div>
        </Tooltip>
      ))}
    </div>
  );
};

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
      icon: ArrowUpRight,
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
}

const StoreDashboard: React.FC<StoreDashboardProps> = ({ storeName }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  const formatRelativeTime = (dateStr: string) => {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Overview of {storeName}&apos;s performance</p>
      </div>

      {/* Metric Cards */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        <MetricCard
          label="Total Revenue"
          value={numberFormat(1125000000 / 100, Currencies.NGN)}
          change={12.5}
          icon={DollarSign}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50 dark:bg-emerald-900/20"
          subtitle="This month"
        />
        <MetricCard
          label="Total Orders"
          value="48"
          change={8.3}
          icon={ShoppingCart}
          iconColor="text-blue"
          iconBg="bg-blue-50 dark:bg-blue-900/20"
          subtitle="12 pending"
        />
        <MetricCard
          label="Active Products"
          value="24"
          change={-2.1}
          icon={Package}
          iconColor="text-violet-600"
          iconBg="bg-violet-50 dark:bg-violet-900/20"
          subtitle="3 in review"
        />
        <MetricCard
          label="Store Rating"
          value="4.8"
          change={1.2}
          icon={Star}
          iconColor="text-amber-500"
          iconBg="bg-amber-50 dark:bg-amber-900/20"
          subtitle="36 reviews"
        />
      </div>

      {/* Secondary metrics */}
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2' : 'grid-cols-3'}`}>
        <MetricCard
          label="Store Views"
          value="1,247"
          change={24.7}
          icon={Eye}
          iconColor="text-cyan-600"
          iconBg="bg-cyan-50 dark:bg-cyan-900/20"
          subtitle="This week"
        />
        <MetricCard
          label="Unique Visitors"
          value="892"
          change={15.3}
          icon={Users}
          iconColor="text-pink-600"
          iconBg="bg-pink-50 dark:bg-pink-900/20"
          subtitle="This week"
        />
        {!isMobile && (
          <MetricCard
            label="Conversion Rate"
            value="3.8%"
            change={0.6}
            icon={TrendingUp}
            iconColor="text-orange-600"
            iconBg="bg-orange-50 dark:bg-orange-900/20"
            subtitle="Orders / Views"
          />
        )}
      </div>

      {/* Charts + Recent Activity Row */}
      <div className={`grid gap-6 ${isMobile ? 'grid-cols-1' : 'grid-cols-5'}`}>
        {/* Revenue Chart */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className={`bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 ${
            isMobile ? '' : 'col-span-3'
          }`}
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">
                Revenue This Week
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">Daily breakdown</p>
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                {numberFormat(349000000 / 100, Currencies.NGN)}
              </p>
              <p className="text-[11px] text-emerald-500 font-semibold flex items-center gap-0.5 justify-end">
                <TrendingUp size={10} /> +18.2% vs last week
              </p>
            </div>
          </div>
          <MiniBarChart data={weeklyRevenue} labels={weekLabels} />
        </motion.div>

        {/* Top Products */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className={`bg-white dark:bg-gray-800/60 rounded-2xl p-5 border border-gray-100 dark:border-gray-700/50 ${
            isMobile ? '' : 'col-span-2'
          }`}
        >
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Top Products</h3>
          <div className="space-y-3">
            {mockTopProducts.map((product, i) => {
              const maxRev = Math.max(...mockTopProducts.map((p) => p.revenue));
              return (
                <div key={product.id} className="flex items-center gap-3">
                  <span className="text-xs font-bold text-gray-400 w-4">#{i + 1}</span>
                  <div className="w-8 h-8 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                    <Package size={14} className="text-gray-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {product.name}
                    </p>
                    <div className="w-full h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full mt-1">
                      <div
                        className="h-full bg-gradient-to-r from-blue to-indigo-500 rounded-full"
                        style={{ width: `${(product.revenue / maxRev) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-semibold text-gray-600 dark:text-gray-300 flex-shrink-0">
                    {numberFormat(product.revenue / 100, Currencies.NGN)}
                  </span>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Recent Orders */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50"
      >
        <div className="flex items-center justify-between p-5 pb-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Orders</h3>
          <button className="text-xs font-semibold text-blue hover:text-blue flex items-center gap-1">
            View All <ExternalLink size={10} />
          </button>
        </div>

        {/* Desktop table */}
        {!isMobile ? (
          <div className="overflow-x-auto mt-4">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 pb-3">
                    Order
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 pb-3">
                    Customer
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 pb-3">
                    Product
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 pb-3">
                    Amount
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 pb-3">
                    Status
                  </th>
                  <th className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 pb-3">
                    Time
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockRecentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 text-xs font-semibold text-blue dark:text-blue">
                      {order.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-gray-500">
                            {order.customerName.charAt(0)}
                          </span>
                        </div>
                        <span className="text-xs font-medium text-gray-900 dark:text-white">
                          {order.customerName}
                        </span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 dark:text-gray-400">
                      {order.productName}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-gray-900 dark:text-white">
                      {numberFormat(order.amount / 100, Currencies.NGN)}
                    </td>
                    <td className="px-5 py-3.5">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5 text-[11px] text-gray-400">
                      {formatRelativeTime(order.date)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          /* Mobile order cards */
          <div className="p-4 space-y-3">
            {mockRecentOrders.map((order) => (
              <div
                key={order.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-xl"
              >
                <div className="w-9 h-9 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <span className="text-xs font-bold text-gray-500">
                    {order.customerName.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs font-semibold text-gray-900 dark:text-white truncate">
                      {order.productName}
                    </p>
                    <span className="text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                      {numberFormat(order.amount / 100, Currencies.NGN)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-1">
                    <span className="text-[11px] text-gray-400">{order.customerName}</span>
                    <OrderStatusBadge status={order.status} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default StoreDashboard;
