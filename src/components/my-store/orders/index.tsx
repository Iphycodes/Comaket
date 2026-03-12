'use client';

import React, { useState, useMemo } from 'react';
import { Select, message as antMessage } from 'antd';
import { motion } from 'framer-motion';
import {
  ShoppingCart,
  Clock,
  Package,
  CheckCircle,
  AlertCircle,
  Truck,
  Search,
  ArrowLeft,
  ChevronRight,
  ChevronLeft,
  DollarSign,
  Copy,
  MapPin,
  Phone,
  MessageCircle,
  Loader2,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import OrderDrawer from '@grc/components/apps/basic-profile/lib/order-drawer';
import OrderDetailView from '@grc/components/apps/basic-profile/lib/order-detail-view';

// ═══════════════════════════════════════════════════════════════════════════
// STATUS CONFIG
// ═══════════════════════════════════════════════════════════════════════════

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

const statusConfig: Record<
  string,
  { label: string; color: string; icon: React.ElementType; bg: string }
> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: Clock,
  },
  processing: {
    label: 'Processing',
    color: 'text-blue dark:text-blue',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: Package,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    icon: Truck,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: CheckCircle,
  },
  completed: {
    label: 'Completed',
    color: 'text-neutral-600 dark:text-neutral-200',
    bg: 'bg-neutral-50 dark:bg-neutral-900/20',
    icon: CheckCircle,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: AlertCircle,
  },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const c = statusConfig[status] || statusConfig.pending;
  const Icon = c.icon;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${c.color} ${c.bg}`}
    >
      <Icon size={11} /> {c.label}
    </span>
  );
};

const statusFlow: OrderStatus[] = ['pending', 'processing', 'shipped', 'delivered'];

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const extractOrderData = (order: any) => {
  const items = order?.items || order?.orderItems || [];
  const buyer = order?.buyerId && typeof order.buyerId === 'object' ? order.buyerId : null;

  return {
    id: order?.orderNumber || order?._id || '',
    rawId: order?._id || order?.id || '',
    customerName: buyer ? `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() : 'Customer',
    customerEmail: buyer?.email || '',
    customerPhone: order?.shippingAddress?.phone || buyer?.mobile?.phoneNumber || '',
    customerAddress: order?.shippingAddress
      ? [order.shippingAddress.street, order.shippingAddress.city, order.shippingAddress.state]
          .filter(Boolean)
          .join(', ')
      : '',
    items: items.map((item: any) => {
      const itemListing =
        item?.listingId && typeof item.listingId === 'object' ? item.listingId : null;
      return {
        name: itemListing?.itemName || item?.itemName || 'Product',
        quantity: item?.quantity || 1,
        price: item?.price || item?.amount || itemListing?.effectivePrice?.amount || 0,
        image: itemListing?.media?.[0]?.url || null,
      };
    }),
    totalAmount: order?.totalAmount || order?.total || 0,
    status: order?.status || 'pending',
    paymentMethod: order?.paymentMethod || order?.payment?.method || '—',
    createdAt: order?.createdAt || '',
    updatedAt: order?.updatedAt || '',
    note: order?.note || order?.customerNote || '',
    trackingNumber: order?.trackingNumber || '',
  };
};

const formatDate = (d: string) =>
  d
    ? new Date(d).toLocaleDateString('en-NG', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      })
    : '';
const formatShortDate = (d: string) =>
  d ? new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' }) : '';
// ═══════════════════════════════════════════════════════════════════════════
// ORDER DETAIL VIEW
// ═══════════════════════════════════════════════════════════════════════════

const _OrderDetail: React.FC<{
  order: any;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  isUpdating: boolean;
}> = ({ order, onBack, onUpdateStatus, isUpdating }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const d = extractOrderData(order);

  const nextStatus = useMemo(() => {
    const idx = statusFlow.indexOf(d.status as OrderStatus);
    if (idx >= 0 && idx < statusFlow.length - 1) return statusFlow[idx + 1];
    return null;
  }, [d.status]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    antMessage.success('Copied!');
  };

  return (
    <div className={`space-y-5 ${isMobile ? 'px-4 py-4 pb-10' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <ArrowLeft size={18} className="text-neutral-500" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{d.id}</h2>
              <button
                onClick={() => copyToClipboard(d.id)}
                className="p-1 rounded hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                <Copy size={12} className="text-neutral-400" />
              </button>
            </div>
            <p className="text-xs text-neutral-500">{formatDate(d.createdAt)}</p>
          </div>
        </div>
        <StatusBadge status={d.status} />
      </div>

      {/* Status Progress */}
      {d.status !== 'cancelled' && (
        <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-4 border border-neutral-100 dark:border-neutral-700/50">
          <div className="flex items-center justify-between">
            {statusFlow.map((s, i) => {
              const currentIdx = statusFlow.indexOf(d.status as OrderStatus);
              const isComplete = i <= currentIdx;
              const isCurrent = i === currentIdx;
              const cfg = statusConfig[s];
              const Icon = cfg.icon;
              return (
                <React.Fragment key={s}>
                  <div className="flex flex-col items-center gap-1">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        isComplete
                          ? 'bg-blue text-white'
                          : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400'
                      } ${isCurrent ? 'ring-2 ring-blue/30' : ''}`}
                    >
                      <Icon size={14} />
                    </div>
                    {!isMobile && (
                      <span
                        className={`text-[10px] font-medium ${
                          isComplete ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'
                        }`}
                      >
                        {cfg.label}
                      </span>
                    )}
                  </div>
                  {i < statusFlow.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 ${
                        i < currentIdx ? 'bg-blue' : 'bg-neutral-200 dark:bg-neutral-700'
                      }`}
                    />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      )}

      {/* Customer Info */}
      <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50 space-y-3">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Customer
        </h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
            <span className="text-sm font-bold text-neutral-500">{d.customerName.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900 dark:text-white">
              {d.customerName}
            </p>
            {d.customerEmail && <p className="text-xs text-neutral-500">{d.customerEmail}</p>}
          </div>
        </div>
        <div className="space-y-2 pt-1">
          {d.customerPhone && (
            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <Phone size={13} className="text-neutral-400" /> {d.customerPhone}
            </div>
          )}
          {d.customerAddress && (
            <div className="flex items-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
              <MapPin size={13} className="text-neutral-400" /> {d.customerAddress}
            </div>
          )}
        </div>
        {d.customerPhone && (
          <div className="flex gap-2 pt-2">
            <a
              href={`https://wa.me/${d.customerPhone}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors"
            >
              <MessageCircle size={13} /> WhatsApp
            </a>
            <a
              href={`tel:+${d.customerPhone}`}
              className="flex items-center gap-1.5 px-3 py-2 bg-neutral-100 dark:bg-neutral-700 hover:bg-neutral-200 dark:hover:bg-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-lg text-xs font-semibold transition-colors"
            >
              <Phone size={13} /> Call
            </a>
          </div>
        )}
      </div>

      {/* Items */}
      <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50 space-y-3">
        <h3 className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          Items ({d.items.length})
        </h3>
        {d.items.map((item: any, i: number) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 border-b border-neutral-50 dark:border-neutral-700/30 last:border-0"
          >
            <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center flex-shrink-0 overflow-hidden">
              {item.image ? (
                <img src={item.image} alt="" className="w-full h-full object-cover" />
              ) : (
                <Package size={16} className="text-neutral-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 dark:text-white truncate">
                {item.name}
              </p>
              <p className="text-xs text-neutral-500">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold text-neutral-900 dark:text-white">
              {numberFormat(item.price / 100, Currencies.NGN)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700">
          <span className="text-sm font-semibold text-neutral-500">Total</span>
          <span className="text-lg font-bold text-neutral-900 dark:text-white">
            {numberFormat(d.totalAmount / 100, Currencies.NGN)}
          </span>
        </div>
      </div>

      {/* Note */}
      {d.note && (
        <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-900/20">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
            Customer Note
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">{d.note}</p>
        </div>
      )}

      {/* Tracking */}
      {d.trackingNumber && (
        <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-4 border border-neutral-100 dark:border-neutral-700/50 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-neutral-400 uppercase">Tracking Number</p>
            <p className="text-sm font-mono font-bold text-neutral-900 dark:text-white mt-0.5">
              {d.trackingNumber}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(d.trackingNumber)}
            className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700"
          >
            <Copy size={14} className="text-neutral-400" />
          </button>
        </div>
      )}

      {/* Action */}
      {nextStatus && d.status !== 'cancelled' && (
        <button
          onClick={() => onUpdateStatus(d.rawId, nextStatus)}
          disabled={isUpdating}
          className="w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
        >
          {isUpdating ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            React.createElement(statusConfig[nextStatus].icon, { size: 16 })
          )}
          {isUpdating ? 'Updating...' : `Mark as ${statusConfig[nextStatus].label}`}
        </button>
      )}

      {d.status === 'pending' && (
        <button
          onClick={() => onUpdateStatus(d.rawId, 'cancelled')}
          disabled={isUpdating}
          className="w-full py-3 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-60"
        >
          Cancel Order
        </button>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface StoreOrdersProps {
  storeId: string;
  orders: any[];
  ordersTotal: number;
  isLoading: boolean;
  isFetching?: boolean;
  pagination?: any;
  filterStatus: string | null;
  searchQuery: string;
  onFilterChange: (status: string | null) => void;
  onSearchChange: (query: string) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
  isUpdatingStatus?: boolean;
  onFetchDetail?: (orderId: string) => void;
  orderDetail?: any;
  isLoadingDetail?: boolean;
  onRefresh?: () => void;
}

const StoreOrders: React.FC<StoreOrdersProps> = ({
  orders,
  ordersTotal,
  isLoading,
  isFetching,
  pagination,
  filterStatus,
  searchQuery,
  onFilterChange,
  onSearchChange,
  onUpdateStatus: _onUpdateStatus,
  isLoadingDetail,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  // ── Metrics ─────────────────────────────────────────────────────────
  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o: any) => {
      counts[o.status] = (counts[o.status] || 0) + 1;
    });
    return counts;
  }, [orders]);

  const totalRevenue = useMemo(
    () =>
      orders
        .filter((o: any) => o.status !== 'cancelled')
        .reduce((s: number, o: any) => s + (o.totalAmount || o.total || 0), 0),
    [orders]
  );

  const metricCards = [
    {
      label: 'Total Orders',
      value: `${ordersTotal}`,
      icon: ShoppingCart,
      iconColor: 'text-blue',
      iconBg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      label: 'Pending',
      value: `${statusCounts.pending}`,
      icon: Clock,
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50 dark:bg-amber-900/20',
    },
    {
      label: 'Processing',
      value: `${statusCounts.processing}`,
      icon: Package,
      iconColor: 'text-indigo-600',
      iconBg: 'bg-indigo-50 dark:bg-indigo-900/20',
    },
    {
      label: 'Revenue',
      value: totalRevenue > 0 ? numberFormat(totalRevenue / 100, Currencies.NGN) : '₦0',
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
  ];

  const handleViewOrder = (order: any) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedOrder(null);
  };

  // ── Skeleton ────────────────────────────────────────────────────────
  const OrderSkeleton = () => (
    <div className="animate-pulse flex items-center gap-3 p-4 border-b border-neutral-50 dark:border-neutral-700/30">
      <div className="w-10 h-10 rounded-xl bg-neutral-200 dark:bg-neutral-700" />
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-32" />
        <div className="h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded w-24" />
      </div>
      <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {metricCards.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-neutral-800/60 rounded-xl p-4 border border-neutral-100 dark:border-neutral-700/50 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg ${m.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <m.icon size={16} className={m.iconColor} />
            </div>
            <div>
              <p className="text-lg font-bold text-neutral-900 dark:text-white">{m.value}</p>
              <p className="text-[11px] text-neutral-500">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Header + Filters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Orders</h1>
          <span className="text-xs text-neutral-500">
            {ordersTotal} order{ordersTotal !== 1 ? 's' : ''}
          </span>
        </div>
        <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'items-center'}`}>
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className={`w-full ${
                isMobile ? 'h-10' : 'h-11'
              } pl-10 pr-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all`}
            />
          </div>
          <Select
            allowClear
            placeholder="Status"
            value={filterStatus}
            onChange={(v) => onFilterChange(v || null)}
            options={statusOptions}
            className={`${
              isMobile ? 'w-full h-10' : 'w-[160px] h-11'
            } [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-neutral-200 dark:[&_.ant-select-selector]:!border-neutral-700`}
          />
        </div>
      </div>

      {/* Order List */}
      <div className={isDetailOpen && isMobile ? 'hidden' : ''}>
        <div className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 overflow-hidden">
          {isLoading ? (
            <div>
              {[1, 2, 3, 4, 5].map((i) => (
                <OrderSkeleton key={i} />
              ))}
            </div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingCart
                size={32}
                className="mx-auto text-neutral-200 dark:text-neutral-700 mb-3"
              />
              <p className="text-sm text-neutral-400">
                {searchQuery || filterStatus ? 'No orders match your filters' : 'No orders yet'}
              </p>
            </div>
          ) : !isMobile ? (
            <table className="w-full">
              <thead>
                <tr className="border-b border-neutral-100 dark:border-neutral-700">
                  {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Date', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {orders.map((order: any) => {
                  const d = extractOrderData(order);
                  return (
                    <tr
                      key={d.rawId}
                      onClick={() => handleViewOrder(order)}
                      className="border-b border-neutral-50 dark:border-neutral-700/30 hover:bg-neutral-50/50 dark:hover:bg-neutral-700/20 transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5 text-xs font-semibold text-blue">{d.id}</td>
                      <td className="px-5 py-3.5">
                        <p className="text-xs font-medium text-neutral-900 dark:text-white">
                          {d.customerName}
                        </p>
                        <p className="text-[11px] text-neutral-400">{d.customerEmail}</p>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-neutral-600 dark:text-neutral-400">
                        {d.items.length} item{d.items.length !== 1 ? 's' : ''}
                      </td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-neutral-900 dark:text-white">
                        {numberFormat(d.totalAmount / 100, Currencies.NGN)}
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge status={d.status} />
                      </td>
                      <td className="px-5 py-3.5 text-[11px] text-neutral-400">
                        {formatShortDate(d.createdAt)}
                      </td>
                      <td className="px-5 py-3.5">
                        <ChevronRight size={14} className="text-neutral-300" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <div className="divide-y divide-neutral-50 dark:divide-neutral-700/30">
              {orders.map((order: any) => {
                const d = extractOrderData(order);
                return (
                  <motion.button
                    key={d.rawId}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleViewOrder(order)}
                    className="w-full p-4 text-left flex items-center gap-3"
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        statusConfig[d.status]?.bg || 'bg-neutral-100'
                      }`}
                    >
                      {React.createElement(statusConfig[d.status]?.icon || Clock, {
                        size: 16,
                        className: statusConfig[d.status]?.color || 'text-neutral-400',
                      })}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {d.customerName}
                        </p>
                        <span className="text-xs font-bold text-neutral-900 dark:text-white flex-shrink-0">
                          {numberFormat(d.totalAmount / 100, Currencies.NGN)}
                        </span>
                      </div>
                      <div className="flex items-center justify-between gap-2 mt-0.5">
                        <span className="text-[11px] text-neutral-400 truncate">
                          {d.id} · {d.items.length} item{d.items.length !== 1 ? 's' : ''}
                        </span>
                        <StatusBadge status={d.status} />
                      </div>
                    </div>
                  </motion.button>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          {pagination && !isLoading && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 dark:border-neutral-700">
              <span className="text-xs text-neutral-500">
                {ordersTotal} order{ordersTotal !== 1 ? 's' : ''}
              </span>
              <div className="flex items-center gap-1.5">
                {pagination.currentPage > 1 && (
                  <button
                    onClick={() => pagination.onChange?.(pagination.currentPage - 1)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <ChevronLeft size={16} className="text-neutral-500" />
                  </button>
                )}
                <span className="text-xs text-neutral-500 px-2">
                  Page {pagination.currentPage || 1} of {pagination.totalPages || 1}
                </span>
                {pagination.currentPage < pagination.totalPages && (
                  <button
                    onClick={() => pagination.onChange?.(pagination.currentPage + 1)}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                  >
                    <ChevronRight size={16} className="text-neutral-500" />
                  </button>
                )}
              </div>
            </div>
          )}

          {isFetching && !isLoading && (
            <div className="flex items-center justify-center gap-2 py-3 border-t border-neutral-100 dark:border-neutral-700">
              <Loader2 size={14} className="animate-spin text-blue" />
              <span className="text-xs text-neutral-400">Updating...</span>
            </div>
          )}
        </div>
      </div>

      {/* Detail — Mobile full-screen */}
      {/* <AnimatePresence>
        {isDetailOpen && selectedOrder && isMobile && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-neutral-900 overflow-y-auto pt-10"
          >
            <OrderDetail
              order={selectedOrder}
              onBack={handleCloseDetail}
              onUpdateStatus={handleStatusUpdate}
              isUpdating={isUpdatingStatus || false}
            />
          </motion.div>
        )}
      </AnimatePresence> */}

      {/* Detail — Desktop modal */}
      {/* {!isMobile && selectedOrder && (
        <Modal open={isDetailOpen} onCancel={handleCloseDetail} width={600} footer={null} rootClassName="modal-with-backdrop" className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden">
          <div className="max-h-[80vh] overflow-y-auto pb-2 px-1">
            <OrderDetail order={selectedOrder} onBack={handleCloseDetail} onUpdateStatus={handleStatusUpdate} isUpdating={isUpdatingStatus || false} />
          </div>
        </Modal>
      )} */}

      <OrderDrawer isOpen={isDetailOpen} onClose={handleCloseDetail} isMobile={isMobile}>
        <OrderDetailView order={selectedOrder} isLoading={isLoadingDetail} isSellerView={true} />
      </OrderDrawer>
    </div>
  );
};

export default StoreOrders;
