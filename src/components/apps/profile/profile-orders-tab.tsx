'use client';
import React, { useState, useEffect } from 'react';
import { Drawer, Select, Input } from 'antd';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, Search, X } from 'lucide-react';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import { Pagination } from '@grc/_shared/namespace';
import { useSearch } from '@grc/hooks/useSearch';
import { orderStatusConfig, OrderStatus, MobileOverlay } from './profile-helpers';
import OrderDetailView from '../basic-profile/lib/order-detail-view';

// ═══════════════════════════════════════════════════════════════════════════
// ORDER STATUS FILTER OPTIONS
// ═══════════════════════════════════════════════════════════════════════════

const orderStatusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
  { label: 'Refunded', value: 'refunded' },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const formatDate = (date: string | undefined, opts?: Intl.DateTimeFormatOptions) => {
  if (!date) return '—';
  return new Date(date).toLocaleDateString('en-NG', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    ...opts,
  });
};

// ═══════════════════════════════════════════════════════════════════════════
// ORDER DETAIL VIEW — Comprehensive
// ═══════════════════════════════════════════════════════════════════════════

// const OrderDetailView: React.FC<{ order: any; variant?: 'seller' | 'buyer' }> = ({
//   order,
//   variant = 'seller',
// }) => {
//   const status = (order.status || 'pending') as OrderStatus;
//   const cfg = orderStatusConfig[status] || orderStatusConfig.pending;
//   const items = order.items || [];
//   const shipping = order.shippingAddress || {};
//   const tracking = order.trackingInfo || {};
//   const payment = order.paymentInfo || {};
//   const revenue = order.revenueSplit || {};
//   const orderId = order._id || order.id || '';
//   const orderNumber = order.orderNumber || `#${orderId.slice(-8).toUpperCase()}`;

//   const buyer =
//     typeof order.buyerId === 'object'
//       ? order.buyerId
//       : typeof order.buyer === 'object'
//         ? order.buyer
//         : null;
//   const seller =
//     typeof order.sellerId === 'object'
//       ? order.sellerId
//       : typeof order.seller === 'object'
//         ? order.seller
//         : null;
//   const store = typeof order.storeId === 'object' ? order.storeId : null;

//   const counterpartyLabel = variant === 'seller' ? 'Buyer' : 'Seller';
//   const counterparty = variant === 'seller' ? buyer : seller;
//   const counterpartyName = counterparty
//     ? `${counterparty.firstName || ''} ${counterparty.lastName || ''}`.trim()
//     : '—';

//   return (
//     <div className="space-y-5">
//       {/* Header */}
//       <div className="flex items-center justify-between">
//         <div>
//           <div className="flex items-center gap-2">
//             <h2 className="text-lg font-bold text-neutral-900 dark:text-white">{orderNumber}</h2>
//             <button
//               onClick={() => copyToClipboard(orderNumber)}
//               className="text-neutral-300 hover:text-neutral-500 transition-colors"
//             >
//               <Copy size={14} />
//             </button>
//           </div>
//           <p className="text-xs text-neutral-400 mt-0.5">{formatDateTime(order.createdAt)}</p>
//         </div>
//         <span
//           className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}
//         >
//           {cfg.icon}
//           {cfg.label}
//         </span>
//       </div>

//       {/* Items */}
//       <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl overflow-hidden">
//         <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700 flex items-center gap-2">
//           <Package size={14} className="text-neutral-400" />
//           <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
//             Items ({items.length})
//           </h3>
//         </div>
//         <div className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
//           {items.map((item: any, idx: number) => (
//             <div key={item._id || idx} className="p-4 flex items-center gap-3">
//               <div className="w-14 h-14 rounded-lg bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
//                 {item.image && (
//                   <img
//                     src={item.image}
//                     alt={item.itemName}
//                     className="w-full h-full object-cover"
//                   />
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
//                   {item.itemName || 'Item'}
//                 </p>
//                 <div className="flex items-center gap-3 mt-0.5">
//                   <span className="text-xs text-neutral-400">Qty: {item.quantity || 1}</span>
//                   {item.type && (
//                     <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue font-medium">
//                       {item.type === 'direct_purchase'
//                         ? 'Direct'
//                         : item.type === 'consignment'
//                           ? 'Consignment'
//                           : 'Self'}
//                     </span>
//                   )}
//                 </div>
//               </div>
//               <span className="text-sm font-bold text-neutral-900 dark:text-white flex-shrink-0">
//                 {numberFormat((item.totalPrice || item.unitPrice || 0) / 100, Currencies.NGN)}
//               </span>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Pricing Breakdown */}
//       <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 space-y-2.5">
//         <div className="flex items-center gap-2 mb-1">
//           <CircleDollarSign size={14} className="text-neutral-400" />
//           <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Summary</h3>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span className="text-neutral-500">Subtotal</span>
//           <span className="font-medium">
//             {numberFormat((order.subtotal || 0) / 100, Currencies.NGN)}
//           </span>
//         </div>
//         {(order.shippingFee || 0) > 0 && (
//           <div className="flex justify-between text-sm">
//             <span className="text-neutral-500">Shipping</span>
//             <span className="font-medium">
//               {numberFormat(order.shippingFee / 100, Currencies.NGN)}
//             </span>
//           </div>
//         )}
//         {(order.discount || 0) > 0 && (
//           <div className="flex justify-between text-sm">
//             <span className="text-neutral-500">Discount</span>
//             <span className="font-medium text-emerald-600">
//               -{numberFormat(order.discount / 100, Currencies.NGN)}
//             </span>
//           </div>
//         )}
//         <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2.5 flex justify-between">
//           <span className="text-sm font-semibold text-neutral-900 dark:text-white">Total</span>
//           <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
//             {numberFormat((order.totalAmount || 0) / 100, Currencies.NGN)}
//           </span>
//         </div>
//         {variant === 'seller' && revenue.sellerPayout != null && (
//           <div className="flex justify-between text-sm pt-1">
//             <span className="text-neutral-500">Your Payout</span>
//             <span className="font-semibold text-emerald-600">
//               {numberFormat((revenue.sellerPayout || 0) / 100, Currencies.NGN)}
//             </span>
//           </div>
//         )}
//       </div>

//       {/* Counterparty + Store */}
//       <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 space-y-3">
//         <div className="flex items-center gap-2 mb-1">
//           <User size={14} className="text-neutral-400" />
//           <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">People</h3>
//         </div>
//         <div className="flex justify-between text-sm">
//           <span className="text-neutral-500">{counterpartyLabel}</span>
//           <span className="font-medium text-neutral-900 dark:text-white">{counterpartyName}</span>
//         </div>
//         {counterparty?.email && (
//           <div className="flex justify-between text-sm">
//             <span className="text-neutral-500">Email</span>
//             <span className="font-medium text-neutral-900 dark:text-white">{counterparty.email}</span>
//           </div>
//         )}
//         {store && (
//           <div className="flex justify-between text-sm">
//             <span className="text-neutral-500">Store</span>
//             <span className="font-medium text-blue">{store.name}</span>
//           </div>
//         )}
//       </div>

//       {/* Shipping Address */}
//       {shipping.address && (
//         <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 space-y-3">
//           <div className="flex items-center gap-2 mb-1">
//             <MapPin size={14} className="text-neutral-400" />
//             <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
//               Shipping Address
//             </h3>
//           </div>
//           <p className="text-sm text-neutral-900 dark:text-white">{shipping.fullName}</p>
//           <p className="text-sm text-neutral-600 dark:text-neutral-400">
//             {[shipping.address, shipping.city, shipping.state, shipping.country]
//               .filter(Boolean)
//               .join(', ')}
//           </p>
//           {shipping.phoneNumber && (
//             <div className="flex items-center gap-1.5 text-sm text-neutral-500">
//               <Phone size={12} /> {shipping.phoneNumber}
//             </div>
//           )}
//         </div>
//       )}

//       {/* Tracking */}
//       {(tracking.carrier || tracking.trackingNumber) && (
//         <div className="bg-blue-50 dark:bg-blue-950/30 border border-blue-100 dark:border-blue-900 rounded-xl p-4 space-y-3">
//           <div className="flex items-center gap-2 mb-1">
//             <Truck size={14} className="text-blue" />
//             <h3 className="text-sm font-semibold text-blue">Tracking</h3>
//           </div>
//           {tracking.carrier && (
//             <div className="flex justify-between text-sm">
//               <span className="text-neutral-500">Carrier</span>
//               <span className="font-medium">{tracking.carrier}</span>
//             </div>
//           )}
//           {tracking.trackingNumber && (
//             <div className="flex justify-between text-sm">
//               <span className="text-neutral-500">Tracking #</span>
//               <div className="flex items-center gap-1.5">
//                 <span className="font-medium text-blue">{tracking.trackingNumber}</span>
//                 <button
//                   onClick={() => copyToClipboard(tracking.trackingNumber)}
//                   className="text-neutral-300 hover:text-neutral-500"
//                 >
//                   <Copy size={12} />
//                 </button>
//               </div>
//             </div>
//           )}
//           {tracking.shippedAt && (
//             <div className="flex justify-between text-sm">
//               <span className="text-neutral-500">Shipped</span>
//               <span className="font-medium">{formatDate(tracking.shippedAt)}</span>
//             </div>
//           )}
//           {tracking.deliveredAt && (
//             <div className="flex justify-between text-sm">
//               <span className="text-neutral-500">Delivered</span>
//               <span className="font-medium text-emerald-600">
//                 {formatDate(tracking.deliveredAt)}
//               </span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Payment */}
//       {payment.method && (
//         <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-4 space-y-3">
//           <div className="flex items-center gap-2 mb-1">
//             <CreditCard size={14} className="text-neutral-400" />
//             <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">Payment</h3>
//           </div>
//           <div className="flex justify-between text-sm">
//             <span className="text-neutral-500">Method</span>
//             <span className="font-medium capitalize">{payment.method}</span>
//           </div>
//           {payment.reference && (
//             <div className="flex justify-between text-sm">
//               <span className="text-neutral-500">Reference</span>
//               <div className="flex items-center gap-1.5">
//                 <span className="font-medium text-xs">{payment.reference}</span>
//                 <button
//                   onClick={() => copyToClipboard(payment.reference)}
//                   className="text-neutral-300 hover:text-neutral-500"
//                 >
//                   <Copy size={12} />
//                 </button>
//               </div>
//             </div>
//           )}
//           {payment.paidAt && (
//             <div className="flex justify-between text-sm">
//               <span className="text-neutral-500">Paid</span>
//               <span className="font-medium">{formatDate(payment.paidAt)}</span>
//             </div>
//           )}
//           {payment.status && (
//             <div className="flex justify-between text-sm">
//               <span className="text-neutral-500">Status</span>
//               <span
//                 className={`font-semibold capitalize ${
//                   payment.status === 'success'
//                     ? 'text-emerald-600'
//                     : payment.status === 'failed'
//                       ? 'text-red-500'
//                       : 'text-amber-500'
//                 }`}
//               >
//                 {payment.status}
//               </span>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Notes */}
//       {(order.buyerNote || order.adminNote || order.cancellationReason) && (
//         <div className="space-y-2">
//           {order.buyerNote && (
//             <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30">
//               <p className="text-sm text-amber-700 dark:text-amber-300">
//                 <strong>Buyer Note:</strong> {order.buyerNote}
//               </p>
//             </div>
//           )}
//           {order.adminNote && (
//             <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
//               <p className="text-sm text-blue dark:text-indigo-300">
//                 <strong>Admin Note:</strong> {order.adminNote}
//               </p>
//             </div>
//           )}
//           {order.cancellationReason && (
//             <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-800/30">
//               <p className="text-sm text-red-700 dark:text-red-300">
//                 <strong>Cancellation:</strong> {order.cancellationReason}
//               </p>
//             </div>
//           )}
//         </div>
//       )}

//       {/* Timestamps */}
//       <div className="flex items-center gap-4 pt-2 text-[11px] text-neutral-400">
//         <span className="flex items-center gap-1">
//           <Calendar size={11} /> Created {formatDate(order.createdAt)}
//         </span>
//         <span className="flex items-center gap-1">
//           <Clock size={11} /> Updated {formatDate(order.updatedAt)}
//         </span>
//       </div>
//     </div>
//   );
// };

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ORDERS TAB
// ═══════════════════════════════════════════════════════════════════════════

interface ProfileOrdersTabProps {
  orders: any[];
  ordersTotal: number;
  isLoading: boolean;
  isFetching?: boolean;
  isMobile: boolean;
  onFetchOrderDetail?: (orderId: string) => Promise<any>;
  orderDetail?: any;
  isLoadingOrderDetail?: boolean;
  onLoadMore?: (page: number) => void;
  pagination?: Pagination;
  variant?: 'seller' | 'buyer';
  /** Called when search or filter changes — parent should refetch with these params */
  onRefetch?: (params: {
    search?: string;
    status?: string;
    page?: number;
    perPage?: number;
  }) => void;
}

const ProfileOrdersTab: React.FC<ProfileOrdersTabProps> = ({
  orders,
  ordersTotal,
  isLoading,
  isFetching,
  isMobile,
  onFetchOrderDetail,
  orderDetail,
  isLoadingOrderDetail,
  onLoadMore,
  pagination,
  variant = 'seller',
  onRefetch,
}) => {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  // Search & Filters — sent to backend
  const { searchValue, debouncedChangeHandler } = useSearch();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  const hasActiveFilters = !!(searchValue || filterStatus);

  // ── Send filters to backend on change ───────────────────────────────
  useEffect(() => {
    if (onRefetch) {
      onRefetch({
        search: searchValue || undefined,
        status: filterStatus || undefined,
        page: 1,
        perPage: 10,
      });
    }
  }, [searchValue, filterStatus]);

  const clearFilters = () => {
    debouncedChangeHandler('');
    setFilterStatus(null);
  };

  const handleViewOrder = async (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
    if (onFetchOrderDetail) {
      try {
        await onFetchOrderDetail(order._id || order.id);
      } catch {}
    }
  };

  const handleCloseOrderDetail = () => {
    setIsOrderDetailOpen(false);
    setSelectedOrder(null);
  };

  if (isLoading)
    return (
      <div className="space-y-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white dark:bg-neutral-800 rounded-2xl h-24 animate-pulse" />
        ))}
      </div>
    );

  return (
    <div className="p-5 px-6">
      <div className="space-y-1 mb-5">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
          {variant === 'buyer' ? 'Purchases' : 'Recieved Orders'}
        </h1>
        {/* Count */}
        <p className="text-xs text-neutral-400 mb-3">
          {ordersTotal} {variant === 'seller' ? 'order' : 'purchase'}
          {ordersTotal !== 1 ? 's' : ''}
          {hasActiveFilters ? ' (filtered)' : ''}
        </p>
      </div>

      {/* Search + Filters */}
      <div
        className={`flex w-full ${isMobile ? 'flex-col gap-1' : 'items-center gap-2'} mb-4 sticky ${
          isMobile ? 'top-[75px]' : 'top-[45px]'
        } z-10 bg-white dark:bg-neutral-900 py-3 -mx-4 px-4`}
      >
        <div className="flex-2 w-full mb-2">
          <Input
            prefix={<Search size={isMobile ? 14 : 16} className="text-neutral-400" />}
            placeholder={variant === 'seller' ? 'Search orders...' : 'Search purchases...'}
            onChange={(e) => debouncedChangeHandler(e.target.value)}
            allowClear
            className={`w-full ${isMobile ? 'h-10' : 'h-11'} rounded-xl`}
          />
        </div>
        <div className={`flex items-center gap-2 mb-2 ${isMobile ? 'w-full' : ''}`}>
          <Select
            allowClear
            placeholder="Status"
            value={filterStatus}
            onChange={(val) => setFilterStatus(val || null)}
            options={orderStatusOptions}
            className={`${
              isMobile ? 'flex-1 h-10' : 'w-[150px] h-11'
            } [&_.ant-select-selector]:!rounded-lg`}
            popupClassName="!rounded-lg"
          />
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 px-3 h-9 text-xs font-medium text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors"
            >
              <X size={13} /> Clear
            </button>
          )}
        </div>
      </div>

      {/* Empty state */}
      {!orders || orders.length === 0 ? (
        <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl">
          <ShoppingBag size={36} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-3" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {hasActiveFilters
              ? 'No orders match your filters'
              : variant === 'seller'
                ? 'No seller orders yet'
                : 'No purchases yet'}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="text-xs text-blue hover:underline mt-2">
              Clear filters
            </button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => {
            const status = (order?.status || 'pending') as OrderStatus;
            const cfg = orderStatusConfig[status] || orderStatusConfig.pending;
            const listingName = order.items?.[0]?.itemName || 'Item';
            const listingImage = order.items?.[0]?.image || '';
            const totalAmount = order.totalAmount || 0;
            const orderId = order._id || order.id;
            const orderNumber = order.orderNumber || `#${(orderId || '').slice(-8).toUpperCase()}`;
            const itemCount = order.items?.length || 0;
            const storeName = typeof order.storeId === 'object' ? order.storeId?.name : '';
            const counterparty =
              variant === 'seller'
                ? typeof order.buyerId === 'object'
                  ? `${order.buyerId?.firstName || ''} ${order.buyerId?.lastName || ''}`.trim()
                  : ''
                : typeof order.sellerId === 'object'
                  ? `${order.sellerId?.firstName || ''} ${order.sellerId?.lastName || ''}`.trim()
                  : storeName || '';

            return (
              <motion.div
                key={orderId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => handleViewOrder(order)}
                className="bg-white dark:bg-neutral-800/60 rounded-xl border border-neutral-100 dark:border-neutral-700/50 p-4 cursor-pointer hover:shadow-md hover:border-neutral-200 dark:hover:border-neutral-600 transition-all group"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">
                      {orderNumber}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {formatDate(order.createdAt)}
                      {counterparty && (
                        <span>
                          {' · '}
                          {variant === 'seller' ? 'from' : 'by'}{' '}
                          <span className="font-medium text-neutral-500">{counterparty}</span>
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.color} ${cfg.bg}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 transition-colors"
                    />
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                    {listingImage && (
                      <img src={listingImage} alt="" className="w-full h-full object-cover" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-600 dark:text-neutral-300 truncate font-medium">
                      {listingName}
                    </p>
                    {itemCount > 1 && (
                      <p className="text-[10px] text-neutral-400">
                        +{itemCount - 1} more item{itemCount > 2 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white flex-shrink-0">
                    {numberFormat(totalAmount / 100, Currencies.NGN)}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* Pagination */}
          {pagination && pagination.current < pagination.total && onLoadMore && (
            <button
              onClick={() => onLoadMore(pagination.current + 1)}
              disabled={isFetching}
              className="w-full py-3 text-sm font-medium text-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-colors"
            >
              {isFetching ? 'Loading...' : 'Load More'}
            </button>
          )}
          {!pagination && orders.length < ordersTotal && onLoadMore && (
            <button
              onClick={() => onLoadMore(Math.floor(orders.length / 20) + 1)}
              disabled={isFetching}
              className="w-full py-3 text-sm font-medium text-blue hover:bg-blue-50 dark:hover:bg-blue-900/10 rounded-xl transition-colors"
            >
              {isFetching ? 'Loading...' : 'Load More'}
            </button>
          )}

          {isFetching && !isLoading && (
            <div className="flex items-center justify-center py-4">
              <div className="w-5 h-5 border-2 border-blue border-t-transparent rounded-full animate-spin" />
              <span className="text-xs text-neutral-400 ml-2">Updating...</span>
            </div>
          )}
        </div>
      )}

      {/* ═══════════════════════════════════════════════════════════════ */}
      {/* ORDER DETAIL — Mobile: MobileOverlay, Desktop: Drawer         */}
      {/* ═══════════════════════════════════════════════════════════════ */}
      {selectedOrder && (
        <>
          {isMobile ? (
            <MobileOverlay
              open={isOrderDetailOpen}
              onClose={handleCloseOrderDetail}
              title="Order Details"
              zIndex={200}
            >
              {isLoadingOrderDetail ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="">
                  {/* <OrderDetailView order={selectedOrder} variant={variant} /> */}
                  <OrderDetailView
                    order={selectedOrder}
                    isLoading={isLoadingOrderDetail}
                    isSellerView={true}
                  />
                </div>
              )}
            </MobileOverlay>
          ) : (
            <Drawer
              open={isOrderDetailOpen}
              onClose={handleCloseOrderDetail}
              title={null}
              width={540}
              className="[&_.ant-drawer-body]:!p-0"
              closeIcon={null}
            >
              {/* Drawer header */}
              <div className="sticky top-0 z-10 bg-white dark:bg-neutral-900 border-b border-neutral-100 dark:border-neutral-800 px-6 py-4 flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900 dark:text-white">
                    Order Details
                  </h3>
                  <p className="text-xs text-neutral-400 mt-0.5">
                    {(orderDetail || selectedOrder)?.orderNumber ||
                      `#${((orderDetail || selectedOrder)?._id || '').slice(-8).toUpperCase()}`}
                  </p>
                </div>
                <button
                  onClick={handleCloseOrderDetail}
                  className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
                >
                  <X size={16} className="text-neutral-500" />
                </button>
              </div>

              {/* Drawer body */}
              {!selectedOrder ? (
                <div className="flex items-center justify-center py-20">
                  <div className="w-6 h-6 border-2 border-blue border-t-transparent rounded-full animate-spin" />
                </div>
              ) : (
                <div className="overflow-y-auto" style={{ maxHeight: 'calc(100vh - 73px)' }}>
                  {/* <OrderDetailView order={selectedOrder} variant={variant} /> */}
                  <OrderDetailView
                    order={selectedOrder}
                    isLoading={isLoadingOrderDetail}
                    isSellerView={true}
                  />
                </div>
              )}
            </Drawer>
          )}
        </>
      )}
    </div>
  );
};

export default ProfileOrdersTab;
