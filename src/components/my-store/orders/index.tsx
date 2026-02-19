'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { Select, Modal, message as antMessage } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
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
  DollarSign,
  Copy,
  MapPin,
  Phone,
  MessageCircle,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';

interface OrderItem {
  name: string;
  quantity: number;
  price: number; // kobo
  image?: string;
}

interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: OrderItem[];
  totalAmount: number; // kobo
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  note?: string;
  trackingNumber?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const mockOrders: Order[] = [
  {
    id: 'ORD-2025-001',
    customerName: 'Chidera Nwosu',
    customerEmail: 'chidera@gmail.com',
    customerPhone: '2348011111111',
    customerAddress: '15 Awolowo Road, Ikoyi, Lagos',
    items: [
      { name: 'iPhone 14 Pro Max', quantity: 1, price: 85000000 },
      { name: 'iPhone Case - Clear', quantity: 2, price: 500000 },
    ],
    totalAmount: 86000000,
    status: 'processing',
    paymentMethod: 'Card',
    createdAt: '2025-02-18T14:30:00Z',
    updatedAt: '2025-02-18T15:00:00Z',
    note: 'Please package carefully',
  },
  {
    id: 'ORD-2025-002',
    customerName: 'Amaka Eze',
    customerEmail: 'amaka@yahoo.com',
    customerPhone: '2348022222222',
    customerAddress: '8 Ozumba Mbadiwe Ave, VI, Lagos',
    items: [{ name: 'Samsung Galaxy S24', quantity: 1, price: 62000000 }],
    totalAmount: 62000000,
    status: 'pending',
    paymentMethod: 'Transfer',
    createdAt: '2025-02-18T12:15:00Z',
    updatedAt: '2025-02-18T12:15:00Z',
  },
  {
    id: 'ORD-2025-003',
    customerName: 'Tunde Bakare',
    customerEmail: 'tunde@gmail.com',
    customerPhone: '2348033333333',
    customerAddress: '22 Herbert Macaulay Way, Yaba, Lagos',
    items: [{ name: 'AirPods Pro 2', quantity: 1, price: 15000000 }],
    totalAmount: 15000000,
    status: 'delivered',
    paymentMethod: 'Card',
    createdAt: '2025-02-17T16:45:00Z',
    updatedAt: '2025-02-18T10:00:00Z',
    trackingNumber: 'GIG-234567',
  },
  {
    id: 'ORD-2025-004',
    customerName: 'Ngozi Okafor',
    customerEmail: 'ngozi@outlook.com',
    customerPhone: '2348044444444',
    customerAddress: '5 Adeola Odeku, VI, Lagos',
    items: [{ name: 'MacBook Air M2', quantity: 1, price: 120000000 }],
    totalAmount: 120000000,
    status: 'shipped',
    paymentMethod: 'Card',
    createdAt: '2025-02-17T09:20:00Z',
    updatedAt: '2025-02-18T08:30:00Z',
    trackingNumber: 'DHL-789012',
  },
  {
    id: 'ORD-2025-005',
    customerName: 'Ibrahim Musa',
    customerEmail: 'ibrahim@gmail.com',
    customerPhone: '2348055555555',
    customerAddress: '12 Aminu Kano Crescent, Wuse, Abuja',
    items: [{ name: 'PS5 Console', quantity: 1, price: 45000000 }],
    totalAmount: 45000000,
    status: 'cancelled',
    paymentMethod: 'Transfer',
    createdAt: '2025-02-16T20:10:00Z',
    updatedAt: '2025-02-17T14:00:00Z',
  },
  {
    id: 'ORD-2025-006',
    customerName: 'Blessing Adeyemi',
    customerEmail: 'blessing@gmail.com',
    customerPhone: '2348066666666',
    customerAddress: '3 Allen Avenue, Ikeja, Lagos',
    items: [
      { name: 'iPhone 15 Pro', quantity: 1, price: 95000000 },
      { name: 'AirPods Max', quantity: 1, price: 35000000 },
    ],
    totalAmount: 130000000,
    status: 'pending',
    paymentMethod: 'Card',
    createdAt: '2025-02-18T16:00:00Z',
    updatedAt: '2025-02-18T16:00:00Z',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// STATUS CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const statusConfig: Record<
  OrderStatus,
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
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: AlertCircle,
  },
};

const StatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  const c = statusConfig[status];
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
// ORDER DETAIL VIEW
// ═══════════════════════════════════════════════════════════════════════════

const OrderDetail: React.FC<{
  order: Order;
  onBack: () => void;
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
}> = ({ order, onBack, onUpdateStatus }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  const nextStatus = useMemo(() => {
    const idx = statusFlow.indexOf(order.status);
    if (idx >= 0 && idx < statusFlow.length - 1) return statusFlow[idx + 1];
    return null;
  }, [order.status]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    antMessage.success('Copied!');
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  return (
    <div className={`space-y-5 ${isMobile ? 'px-4 py-4 pb-10' : ''}`}>
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <ArrowLeft size={18} className="text-gray-500" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">{order.id}</h2>
              <button
                onClick={() => copyToClipboard(order.id)}
                className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Copy size={12} className="text-gray-400" />
              </button>
            </div>
            <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
          </div>
        </div>
        <StatusBadge status={order.status} />
      </div>

      {/* Status Progress */}
      {order.status !== 'cancelled' && (
        <div className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center justify-between">
            {statusFlow.map((s, i) => {
              const currentIdx = statusFlow.indexOf(order.status);
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
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                      } ${isCurrent ? 'ring-2 ring-blue/30' : ''}`}
                    >
                      <Icon size={14} />
                    </div>
                    {!isMobile && (
                      <span
                        className={`text-[10px] font-medium ${
                          isComplete ? 'text-gray-900 dark:text-white' : 'text-gray-400'
                        }`}
                      >
                        {cfg.label}
                      </span>
                    )}
                  </div>
                  {i < statusFlow.length - 1 && (
                    <div
                      className={`flex-1 h-0.5 mx-1 ${
                        i < currentIdx ? 'bg-blue' : 'bg-gray-200 dark:bg-gray-700'
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
      <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50 space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Customer</h3>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
            <span className="text-sm font-bold text-gray-500">{order.customerName.charAt(0)}</span>
          </div>
          <div>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              {order.customerName}
            </p>
            <p className="text-xs text-gray-500">{order.customerEmail}</p>
          </div>
        </div>
        <div className="space-y-2 pt-1">
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <Phone size={13} className="text-gray-400" /> {order.customerPhone}
          </div>
          <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
            <MapPin size={13} className="text-gray-400" /> {order.customerAddress}
          </div>
        </div>
        <div className="flex gap-2 pt-2">
          <a
            href={`https://wa.me/${order.customerPhone}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <MessageCircle size={13} /> WhatsApp
          </a>
          <a
            href={`tel:+${order.customerPhone}`}
            className="flex items-center gap-1.5 px-3 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg text-xs font-semibold transition-colors"
          >
            <Phone size={13} /> Call
          </a>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50 space-y-3">
        <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
          Items ({order.items.length})
        </h3>
        {order.items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 py-2 border-b border-gray-50 dark:border-gray-700/30 last:border-0"
          >
            <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
              <Package size={16} className="text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                {item.name}
              </p>
              <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
            </div>
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {numberFormat(item.price / 100, Currencies.NGN)}
            </span>
          </div>
        ))}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-700">
          <span className="text-sm font-semibold text-gray-500">Total</span>
          <span className="text-lg font-bold text-gray-900 dark:text-white">
            {numberFormat(order.totalAmount / 100, Currencies.NGN)}
          </span>
        </div>
      </div>

      {/* Note */}
      {order.note && (
        <div className="bg-amber-50/50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-900/20">
          <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 mb-1">
            Customer Note
          </p>
          <p className="text-sm text-amber-700 dark:text-amber-300">{order.note}</p>
        </div>
      )}

      {/* Tracking */}
      {order.trackingNumber && (
        <div className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase">Tracking Number</p>
            <p className="text-sm font-mono font-bold text-gray-900 dark:text-white mt-0.5">
              {order.trackingNumber}
            </p>
          </div>
          <button
            onClick={() => copyToClipboard(order.trackingNumber!)}
            className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Copy size={14} className="text-gray-400" />
          </button>
        </div>
      )}

      {/* Action */}
      {nextStatus && order.status !== 'cancelled' && (
        <button
          onClick={() => onUpdateStatus(order.id, nextStatus)}
          className="w-full py-3.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          {React.createElement(statusConfig[nextStatus].icon, { size: 16 })}
          Mark as {statusConfig[nextStatus].label}
        </button>
      )}

      {order.status === 'pending' && (
        <button
          onClick={() => onUpdateStatus(order.id, 'cancelled')}
          className="w-full py-3 rounded-xl text-sm font-medium border border-red-200 dark:border-red-800 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
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
}

const StoreOrders: React.FC<StoreOrdersProps> = ({}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<OrderStatus | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const statusOptions = [
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Shipped', value: 'shipped' },
    { label: 'Delivered', value: 'delivered' },
    { label: 'Cancelled', value: 'cancelled' },
  ];

  const filteredOrders = useMemo(() => {
    return orders.filter((o) => {
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        if (
          !o.id.toLowerCase().includes(q) &&
          !o.customerName.toLowerCase().includes(q) &&
          !o.items.some((i) => i.name.toLowerCase().includes(q))
        )
          return false;
      }
      if (filterStatus && o.status !== filterStatus) return false;
      return true;
    });
  }, [orders, searchQuery, filterStatus]);

  const statusCounts = useMemo(() => {
    const counts: Record<string, number> = {
      pending: 0,
      processing: 0,
      shipped: 0,
      delivered: 0,
      cancelled: 0,
    };
    orders.forEach((o) => {
      counts[o.status]++;
    });
    return counts;
  }, [orders]);

  const totalRevenue = useMemo(
    () => orders.filter((o) => o.status !== 'cancelled').reduce((s, o) => s + o.totalAmount, 0),
    [orders]
  );

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleUpdateStatus = useCallback((orderId: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId ? { ...o, status: newStatus, updatedAt: new Date().toISOString() } : o
      )
    );
    setSelectedOrder((prev) =>
      prev && prev.id === orderId
        ? { ...prev, status: newStatus, updatedAt: new Date().toISOString() }
        : prev
    );
    antMessage.success(`Order updated to ${statusConfig[newStatus].label}`);
  }, []);

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedOrder(null);
  };

  const formatDate = (d: string) =>
    new Date(d).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });

  // ── Metrics ─────────────────────────────────────────────────────────

  const metricCards = [
    {
      label: 'Total Orders',
      value: `${orders.length}`,
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
      value: numberFormat(totalRevenue / 100, Currencies.NGN),
      icon: DollarSign,
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
  ];

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

      {/* Header + Filters */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white">Orders</h1>
          <span className="text-xs text-gray-500">
            {filteredOrders.length} order{filteredOrders.length !== 1 ? 's' : ''}
          </span>
        </div>

        <div className={`flex gap-2 ${isMobile ? 'flex-col' : 'items-center'}`}>
          <div className="relative flex-1">
            <Search
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full ${
                isMobile ? 'h-10' : 'h-11'
              } pl-10 pr-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all`}
            />
          </div>
          <Select
            allowClear
            placeholder="Status"
            value={filterStatus}
            onChange={(v) => setFilterStatus(v || null)}
            options={statusOptions}
            className={`${
              isMobile ? 'w-full h-10' : 'w-[160px] h-11'
            } [&_.ant-select-selector]:!rounded-xl [&_.ant-select-selector]:!border-gray-200 dark:[&_.ant-select-selector]:!border-gray-700`}
          />
        </div>
      </div>

      {/* Order List */}
      <div className={isDetailOpen && isMobile ? 'hidden' : ''}>
        {!isMobile ? (
          /* Desktop table */
          <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100 dark:border-gray-700">
                  {['Order', 'Customer', 'Items', 'Amount', 'Status', 'Date', ''].map((h) => (
                    <th
                      key={h}
                      className="text-left text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-5 py-3"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    onClick={() => handleViewOrder(order)}
                    className="border-b border-gray-50 dark:border-gray-700/30 hover:bg-gray-50/50 dark:hover:bg-gray-700/20 transition-colors cursor-pointer"
                  >
                    <td className="px-5 py-3.5 text-xs font-semibold text-blue dark:text-blue">
                      {order.id}
                    </td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-gray-900 dark:text-white">
                        {order.customerName}
                      </p>
                      <p className="text-[11px] text-gray-400">{order.customerEmail}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-gray-600 dark:text-gray-400">
                      {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-gray-900 dark:text-white">
                      {numberFormat(order.totalAmount / 100, Currencies.NGN)}
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={order.status} />
                    </td>
                    <td className="px-5 py-3.5 text-[11px] text-gray-400">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-5 py-3.5">
                      <ChevronRight size={14} className="text-gray-300" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredOrders.length === 0 && (
              <div className="text-center py-16">
                <ShoppingCart size={32} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
                <p className="text-sm text-gray-400">No orders found</p>
              </div>
            )}
          </div>
        ) : (
          /* Mobile cards */
          <div className="space-y-2">
            {filteredOrders.map((order) => (
              <motion.button
                key={order.id}
                whileTap={{ scale: 0.98 }}
                onClick={() => handleViewOrder(order)}
                className="w-full bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 text-left flex items-center gap-3"
              >
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                    statusConfig[order.status].bg
                  }`}
                >
                  {React.createElement(statusConfig[order.status].icon, {
                    size: 16,
                    className: statusConfig[order.status].color,
                  })}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                      {order.customerName}
                    </p>
                    <span className="text-xs font-bold text-gray-900 dark:text-white flex-shrink-0">
                      {numberFormat(order.totalAmount / 100, Currencies.NGN)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2 mt-0.5">
                    <span className="text-[11px] text-gray-400 truncate">
                      {order.id} · {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                    </span>
                    <StatusBadge status={order.status} />
                  </div>
                </div>
              </motion.button>
            ))}
            {filteredOrders.length === 0 && (
              <div className="text-center py-16 bg-white dark:bg-gray-800/60 rounded-2xl">
                <ShoppingCart size={32} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
                <p className="text-sm text-gray-400">No orders found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Detail — Mobile full-screen */}
      <AnimatePresence>
        {isDetailOpen && selectedOrder && isMobile && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-white dark:bg-gray-900 overflow-y-auto pt-10"
          >
            <OrderDetail
              order={selectedOrder}
              onBack={handleCloseDetail}
              onUpdateStatus={handleUpdateStatus}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Detail — Desktop modal */}
      {!isMobile && selectedOrder && (
        <Modal
          open={isDetailOpen}
          onCancel={handleCloseDetail}
          width={600}
          footer={null}
          className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden"
        >
          <div className="max-h-[80vh] overflow-y-auto pb-2 px-1">
            <OrderDetail
              order={selectedOrder}
              onBack={handleCloseDetail}
              onUpdateStatus={handleUpdateStatus}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default StoreOrders;
