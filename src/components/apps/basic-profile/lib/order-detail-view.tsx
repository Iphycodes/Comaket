import React, { useState, useCallback } from 'react';
import {
  Loader2,
  Store,
  MapPin,
  Phone,
  Pencil,
  Check,
  X,
  ExternalLink,
  Calendar,
  CreditCard,
  Clock,
  User,
  ChevronRight,
  Copy,
  CheckCheck,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatCondition, formatPrice, OrderStatus } from './helpers';
import {
  Timer,
  Package,
  Truck,
  CheckCircle,
  XCircle,
  RotateCcw,
  Wallet,
  Banknote,
} from 'lucide-react';

interface OrderDetailViewProps {
  order: any;
  isLoading?: boolean;
  onUpdateShippingAddress?: (
    orderId: string,
    address: {
      fullName: string;
      phoneNumber: string;
      address: string;
      city: string;
      state: string;
      country: string;
    }
  ) => Promise<void>;
  isUpdatingAddress?: boolean;
  isSellerView?: boolean;
}

const orderStatusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode; step: number }
> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: <Timer size={14} />,
    step: 0,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    icon: <CheckCircle size={14} />,
    step: 1,
  },
  processing: {
    label: 'Processing',
    color: 'text-blue dark:text-blue',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: <Package size={14} />,
    step: 2,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    icon: <Truck size={14} />,
    step: 3,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: <CheckCircle size={14} />,
    step: 4,
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: <CheckCircle size={14} />,
    step: 5,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: <XCircle size={14} />,
    step: -1,
  },
  returned: {
    label: 'Returned',
    color: 'text-neutral-600 dark:text-neutral-400',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    icon: <RotateCcw size={14} />,
    step: -1,
  },
};

export const getOrderStatusConfig = (status: string) => {
  return (
    orderStatusConfig[status as OrderStatus] || {
      label: status,
      color: 'text-neutral-600 dark:text-neutral-400',
      bg: 'bg-neutral-100 dark:bg-neutral-800',
      icon: <Package size={14} />,
      step: -1,
    }
  );
};

// Statuses where shipping address can still be edited
const EDITABLE_STATUSES: string[] = ['pending', 'confirmed', 'processing'];

const OrderDetailView: React.FC<OrderDetailViewProps> = ({
  order,
  isLoading,
  onUpdateShippingAddress,
  isUpdatingAddress,
  isSellerView = false,
}) => {
  const { push } = useRouter();
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [copiedRef, setCopiedRef] = useState(false);
  const [addressForm, setAddressForm] = useState({
    fullName: '',
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    country: '',
  });

  console.log('is seller variant::::', isSellerView);

  const startEditingAddress = useCallback(() => {
    if (!order?.shippingAddress) return;
    setAddressForm({
      fullName: order.shippingAddress.fullName || '',
      phoneNumber: order.shippingAddress.phoneNumber || '',
      address: order.shippingAddress.address || '',
      city: order.shippingAddress.city || '',
      state: order.shippingAddress.state || '',
      country: order.shippingAddress.country || 'Nigeria',
    });
    setIsEditingAddress(true);
  }, [order]);

  const cancelEditingAddress = () => {
    setIsEditingAddress(false);
  };

  const handleSaveAddress = async () => {
    if (!onUpdateShippingAddress || !order) return;
    await onUpdateShippingAddress(order._id || order.id, addressForm);
    setIsEditingAddress(false);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedRef(true);
    setTimeout(() => setCopiedRef(false), 2000);
  };

  const canEditAddress = EDITABLE_STATUSES.includes(order?.status) && !!onUpdateShippingAddress;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-neutral-400" />
      </div>
    );
  }

  if (!order) return null;

  const cfg = getOrderStatusConfig(order.status);
  const shippingAddr = order.shippingAddress;
  const seller = order.sellerId && typeof order.sellerId === 'object' ? order.sellerId : null;
  const store = order.storeId && typeof order.storeId === 'object' ? order.storeId : null;
  const tracking = order.trackingInfo || {};
  const payment = order.paymentInfo || {};

  return (
    <div className="p-5 space-y-5 pb-8">
      {/* ── Header ── */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-neutral-900 dark:text-white">
            {order.orderNumber}
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5 flex items-center gap-1">
            <Calendar size={12} />
            {new Date(order.createdAt).toLocaleDateString('en-NG', {
              weekday: 'short',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}
        >
          {cfg.icon}
          {cfg.label}
        </span>
      </div>

      {/* ── Status Progress ── */}
      {cfg.step >= 0 && <OrderStatusProgress currentStep={cfg.step} status={order.status} />}

      {/* ── Seller / Store Card ── */}
      {!isSellerView && (seller || store) && (
        <div
          onClick={() => store && push(`/store/${store._id || store.id}`)}
          className={`flex items-center gap-3 p-3.5 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700/40 ${
            store
              ? 'cursor-pointer hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors group'
              : ''
          }`}
        >
          {/* Store Logo */}
          <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue/10 to-indigo-500/10 dark:from-blue/20 dark:to-indigo-500/20 flex items-center justify-center overflow-hidden flex-shrink-0 border border-neutral-200 dark:border-neutral-700">
            {store?.logo ? (
              <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
            ) : (
              <Store size={18} className="text-blue" />
            )}
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                {store?.name || 'Store'}
              </p>
              {store && (
                <ChevronRight
                  size={14}
                  className="text-neutral-300 group-hover:text-neutral-500 dark:group-hover:text-neutral-300 transition-colors flex-shrink-0"
                />
              )}
            </div>
            {seller && (
              <p className="text-xs text-neutral-400 mt-0.5">
                Sold by {seller.firstName} {seller.lastName}
              </p>
            )}
            {seller?.phoneNumber && (
              <p className="text-xs text-neutral-400 flex items-center gap-1 mt-0.5">
                <Phone size={10} />
                {seller.phoneNumber}
              </p>
            )}
          </div>
          {store && (
            <ExternalLink
              size={14}
              className="text-neutral-300 group-hover:font-semibold transition-colors flex-shrink-0"
            />
          )}
        </div>
      )}

      {/* ── Items ── */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-700/40">
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300">
            Items ({order.items?.length || 0})
          </h3>
        </div>
        <div className="divide-y divide-neutral-100 dark:divide-neutral-700/50">
          {order.items?.map((item: any) => (
            <div key={item._id || item.id} className="flex items-center gap-3 p-4">
              <div className="w-14 h-14 rounded-lg bg-neutral-200 dark:bg-neutral-700 overflow-hidden flex-shrink-0">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                  {item.itemName}
                </p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  <span className="text-xs text-neutral-400">{formatCondition(item.type)}</span>
                  <span className="text-neutral-300 dark:text-neutral-600">·</span>
                  <span className="text-xs text-neutral-400">Qty: {item.quantity}</span>
                  {item.quantity > 1 && (
                    <>
                      <span className="text-neutral-300 dark:text-neutral-600">·</span>
                      <span className="text-xs text-neutral-400">
                        {formatPrice(item.unitPrice, order.currency)} each
                      </span>
                    </>
                  )}
                </div>
              </div>
              <span className="text-sm font-bold text-neutral-900 dark:text-white flex-shrink-0">
                {formatPrice(item.totalPrice, order.currency)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Shipping Address ── */}
      {shippingAddr && (
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700/40 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <MapPin size={14} className="text-neutral-400" />
              Shipping Address
            </h3>
            {canEditAddress && !isEditingAddress && (
              <button
                onClick={startEditingAddress}
                className="inline-flex items-center gap-1 text-xs font-medium text-blue/80 hover:font-semibold transition-colors"
              >
                <Pencil size={12} />
                Edit
              </button>
            )}
          </div>

          {isEditingAddress ? (
            /* ── Edit mode ── */
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1 block">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={addressForm.fullName}
                    onChange={(e) => setAddressForm((p) => ({ ...p, fullName: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
                    placeholder="Full name"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1 block">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={addressForm.phoneNumber}
                    onChange={(e) => setAddressForm((p) => ({ ...p, phoneNumber: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
                    placeholder="Phone number"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1 block">
                    Street Address *
                  </label>
                  <input
                    type="text"
                    value={addressForm.address}
                    onChange={(e) => setAddressForm((p) => ({ ...p, address: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
                    placeholder="Street address"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1 block">
                    City *
                  </label>
                  <input
                    type="text"
                    value={addressForm.city}
                    onChange={(e) => setAddressForm((p) => ({ ...p, city: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
                    placeholder="City"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1 block">
                    State *
                  </label>
                  <input
                    type="text"
                    value={addressForm.state}
                    onChange={(e) => setAddressForm((p) => ({ ...p, state: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
                    placeholder="State"
                  />
                </div>
                <div className="col-span-2">
                  <label className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-1 block">
                    Country
                  </label>
                  <input
                    type="text"
                    value={addressForm.country}
                    onChange={(e) => setAddressForm((p) => ({ ...p, country: e.target.value }))}
                    className="w-full px-3 py-2 text-sm rounded-lg border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
                    placeholder="Country"
                  />
                </div>
              </div>
              <div className="flex items-center gap-2 pt-1">
                <button
                  onClick={handleSaveAddress}
                  disabled={
                    isUpdatingAddress ||
                    !addressForm.fullName ||
                    !addressForm.phoneNumber ||
                    !addressForm.address ||
                    !addressForm.city ||
                    !addressForm.state
                  }
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-white bg-blue hover:bg-blue/90 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUpdatingAddress ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Check size={14} />
                  )}
                  Save Address
                </button>
                <button
                  onClick={cancelEditingAddress}
                  disabled={isUpdatingAddress}
                  className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-700 rounded-lg transition-colors"
                >
                  <X size={14} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            /* ── View mode ── */
            <div className="p-4 space-y-1.5">
              <p className="text-sm font-medium text-neutral-900 dark:text-white flex items-center gap-1.5">
                <User size={13} className="text-neutral-400" />
                {shippingAddr.fullName}
              </p>
              {shippingAddr.phoneNumber && (
                <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-center gap-1.5">
                  <Phone size={13} className="text-neutral-400" />
                  {shippingAddr.phoneNumber}
                </p>
              )}
              <p className="text-sm text-neutral-500 dark:text-neutral-400 flex items-start gap-1.5">
                <MapPin size={13} className="text-neutral-400 mt-0.5 flex-shrink-0" />
                <span>
                  {[
                    shippingAddr.address,
                    shippingAddr.city,
                    shippingAddr.state,
                    shippingAddr.country,
                  ]
                    .filter(Boolean)
                    .join(', ')}
                </span>
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── Tracking Info ── */}
      {(tracking.trackingNumber || tracking.carrier || tracking.shippedAt) && (
        <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700/40 overflow-hidden">
          <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
            <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
              <Truck size={14} className="text-neutral-400" />
              Tracking Information
            </h3>
          </div>
          <div className="p-4 space-y-2.5">
            {tracking.carrier && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Carrier</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {tracking.carrier}
                </span>
              </div>
            )}
            {tracking.trackingNumber && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Tracking No.</span>
                <button
                  onClick={() => copyToClipboard(tracking.trackingNumber)}
                  className="inline-flex items-center gap-1.5 font-medium text-blue/80 hover:font-semibold transition-colors"
                >
                  {tracking.trackingNumber}
                  {copiedRef ? <CheckCheck size={13} /> : <Copy size={13} />}
                </button>
              </div>
            )}
            {tracking.shippedAt && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipped On</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {new Date(tracking.shippedAt).toLocaleDateString('en-NG', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            {tracking.estimatedDelivery && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Est. Delivery</span>
                <span className="font-medium text-amber-600 dark:text-amber-400">
                  {new Date(tracking.estimatedDelivery).toLocaleDateString('en-NG', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
            {tracking.deliveredAt && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Delivered On</span>
                <span className="font-medium text-emerald-600 dark:text-emerald-400">
                  {new Date(tracking.deliveredAt).toLocaleDateString('en-NG', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── Payment & Summary ── */}
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700/40 overflow-hidden">
        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
          <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
            <CreditCard size={14} className="text-neutral-400" />
            Payment & Summary
          </h3>
        </div>
        <div className="p-4 space-y-2.5">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Method</span>
            <span className="font-medium text-neutral-900 dark:text-white capitalize">
              {payment.method || '—'}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Payment Status</span>
            <span
              className={`font-medium capitalize ${
                order.paymentStatus === 'success'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : order.paymentStatus === 'failed'
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-amber-600 dark:text-amber-400'
              }`}
            >
              {order.paymentStatus || payment.status || '—'}
            </span>
          </div>
          {payment.reference && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Reference</span>
              <button
                onClick={() => copyToClipboard(payment.reference)}
                className="inline-flex items-center gap-1.5 font-medium text-neutral-600 dark:text-neutral-300 text-xs font-mono  transition-colors max-w-[60%] truncate"
              >
                {payment.reference}
                <Copy size={11} className="flex-shrink-0" />
              </button>
            </div>
          )}
          {payment.paidAt && (
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Paid On</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {new Date(payment.paidAt).toLocaleDateString('en-NG', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}

          {/* Price breakdown */}
          <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3 mt-3 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-neutral-500">Subtotal</span>
              <span className="font-medium text-neutral-900 dark:text-white">
                {formatPrice(order.subtotal, order.currency)}
              </span>
            </div>
            {order.shippingFee > 0 ? (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-medium text-neutral-900 dark:text-white">
                  {formatPrice(order.shippingFee, order.currency)}
                </span>
              </div>
            ) : (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Shipping</span>
                <span className="font-medium text-emerald-500 text-xs">FREE</span>
              </div>
            )}
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500">Discount</span>
                <span className="font-medium text-emerald-500">
                  -{formatPrice(order.discount, order.currency)}
                </span>
              </div>
            )}
            <div className="flex justify-between pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-700">
              <span className="text-sm font-semibold text-neutral-900 dark:text-white">Total</span>
              <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                {formatPrice(order.totalAmount, order.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Timeline ── */}
      <OrderTimeline order={order} />

      {/* ── Disbursement Status (seller only) ── */}
      {isSellerView && order.disbursementStatus && (
        <DisbursementTimeline status={order.disbursementStatus} />
      )}

      {/* ── Notes ── */}
      {order.buyerNote && (
        <div className="bg-blue-50 dark:bg-blue-900/10 rounded-xl p-4 border border-blue-100 dark:border-blue-800/30">
          <p className="text-xs font-semibold text-blue/70 uppercase tracking-wider mb-1">
            Your Note
          </p>
          <p className="text-sm text-blue dark:text-blue">{order.buyerNote}</p>
        </div>
      )}
      {order.adminNote && (
        <div className="bg-purple-50 dark:bg-purple-900/10 rounded-xl p-4 border border-purple-100 dark:border-purple-800/30">
          <p className="text-xs font-semibold text-purple-600/70 dark:text-purple-400/70 uppercase tracking-wider mb-1">
            Admin Note
          </p>
          <p className="text-sm text-purple-700 dark:text-purple-300">{order.adminNote}</p>
        </div>
      )}
      {order.cancellationReason && (
        <div className="bg-red-50 dark:bg-red-900/10 rounded-xl p-4 border border-red-100 dark:border-red-800/30">
          <p className="text-xs font-semibold text-red-600/70 dark:text-red-400/70 uppercase tracking-wider mb-1">
            Cancellation Reason
          </p>
          <p className="text-sm text-red-700 dark:text-red-300">{order.cancellationReason}</p>
        </div>
      )}
    </div>
  );
};

/* ──────────────────────────────────────
   Status Progress Bar
   ────────────────────────────────────── */
const progressSteps = [
  { label: 'Confirmed', step: 1 },
  { label: 'Processing', step: 2 },
  { label: 'Shipped', step: 3 },
  { label: 'Delivered', step: 4 },
];

const OrderStatusProgress: React.FC<{ currentStep: number; status: string }> = ({
  currentStep,
}) => {
  return (
    <div className="flex items-center gap-1">
      {progressSteps.map((s) => {
        const isActive = currentStep >= s.step;
        const isCurrent = currentStep === s.step;
        return (
          <React.Fragment key={s.step}>
            <div className="flex flex-col items-center flex-1">
              <div
                className={`w-full h-1.5 rounded-full transition-colors ${
                  isActive ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-700'
                }`}
              />
              <span
                className={`text-[10px] mt-1.5 font-medium ${
                  isCurrent
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : isActive
                      ? 'text-neutral-500'
                      : 'text-neutral-300 dark:text-neutral-600'
                }`}
              >
                {s.label}
              </span>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};

/* ──────────────────────────────────────
   Order Timeline
   ────────────────────────────────────── */
const OrderTimeline: React.FC<{ order: any }> = ({ order }) => {
  const events: { label: string; date: string; icon: React.ReactNode; color: string }[] = [];

  if (order.createdAt) {
    events.push({
      label: 'Order placed',
      date: order.createdAt,
      icon: <Package size={13} />,
      color: 'text-neutral-500',
    });
  }
  if (order.paymentInfo?.paidAt) {
    events.push({
      label: 'Payment confirmed',
      date: order.paymentInfo.paidAt,
      icon: <CreditCard size={13} />,
      color: 'text-emerald-500',
    });
  }
  if (order.trackingInfo?.shippedAt) {
    events.push({
      label: `Shipped${order.trackingInfo.carrier ? ` via ${order.trackingInfo.carrier}` : ''}`,
      date: order.trackingInfo.shippedAt,
      icon: <Truck size={13} />,
      color: 'text-indigo-500',
    });
  }
  if (order.trackingInfo?.deliveredAt) {
    events.push({
      label: 'Delivered',
      date: order.trackingInfo.deliveredAt,
      icon: <CheckCircle size={13} />,
      color: 'text-emerald-500',
    });
  }

  if (events.length < 2) return null;

  // Sort chronologically
  events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
          <Clock size={14} className="text-neutral-400" />
          Timeline
        </h3>
      </div>
      <div className="p-4">
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-neutral-200 dark:bg-neutral-700" />

          <div className="space-y-4">
            {events.map((event, idx) => (
              <div key={idx} className="flex items-start gap-3 relative">
                <div
                  className={`w-[15px] h-[15px] rounded-full flex items-center justify-center bg-white dark:bg-neutral-900 border-2 ${
                    idx === events.length - 1
                      ? 'border-emerald-500'
                      : 'border-neutral-300 dark:border-neutral-600'
                  } z-10 flex-shrink-0`}
                >
                  <div
                    className={`w-[5px] h-[5px] rounded-full ${
                      idx === events.length - 1
                        ? 'bg-emerald-500'
                        : 'bg-neutral-300 dark:bg-neutral-600'
                    }`}
                  />
                </div>
                <div className="flex-1 -mt-0.5">
                  <p className="text-sm font-medium text-neutral-900 dark:text-white">
                    {event.label}
                  </p>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {new Date(event.date).toLocaleDateString('en-NG', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

/* ──────────────────────────────────────
   Disbursement Timeline (Seller View)
   ────────────────────────────────────── */

type DisbursementStatus = 'awaiting_completion' | 'awaiting_disbursement' | 'disbursed';

const disbursementSteps: {
  key: DisbursementStatus;
  label: string;
  description: string;
  icon: React.ReactNode;
  activeColor: string;
  activeBg: string;
}[] = [
  {
    key: 'awaiting_completion',
    label: 'Awaiting Completion',
    description: 'Order needs to be delivered and confirmed',
    icon: <Package size={14} />,
    activeColor: 'text-amber-600 dark:text-amber-400',
    activeBg: 'bg-amber-500',
  },
  {
    key: 'awaiting_disbursement',
    label: 'Awaiting Disbursement',
    description: 'Order completed — payout is being processed',
    icon: <Wallet size={14} />,
    activeColor: 'text-blue dark:text-blue',
    activeBg: 'bg-blue',
  },
  {
    key: 'disbursed',
    label: 'Disbursed',
    description: 'Payment has been sent to your account',
    icon: <Banknote size={14} />,
    activeColor: 'text-emerald-600 dark:text-emerald-400',
    activeBg: 'bg-emerald-500',
  },
];

const getDisbursementStepIndex = (status: string): number => {
  const idx = disbursementSteps.findIndex((s) => s.key === status);
  return idx >= 0 ? idx : -1;
};

const DisbursementTimeline: React.FC<{ status: string }> = ({ status }) => {
  const currentIndex = getDisbursementStepIndex(status);

  return (
    <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700/40 overflow-hidden">
      <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-700">
        <h3 className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
          <Banknote size={14} className="text-neutral-400" />
          Payout Status
        </h3>
      </div>
      <div className="p-4">
        {/* Progress bar */}
        <div className="flex items-center gap-1 mb-5">
          {disbursementSteps.map((step, idx) => {
            const isComplete = idx <= currentIndex;
            const isCurrent = idx === currentIndex;
            return (
              <div key={step.key} className="flex-1 flex flex-col items-center">
                <div
                  className={`w-full h-1.5 rounded-full transition-colors ${
                    isComplete ? step.activeBg : 'bg-neutral-200 dark:bg-neutral-700'
                  }`}
                />
                <span
                  className={`text-[10px] mt-1.5 font-medium text-center leading-tight ${
                    isCurrent
                      ? step.activeColor
                      : isComplete
                        ? 'text-neutral-500'
                        : 'text-neutral-300 dark:text-neutral-600'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Timeline dots */}
        <div className="relative">
          <div className="absolute left-[7px] top-2 bottom-2 w-px bg-neutral-200 dark:bg-neutral-700" />
          <div className="space-y-4">
            {disbursementSteps.map((step, idx) => {
              const isComplete = idx <= currentIndex;
              const isCurrent = idx === currentIndex;
              return (
                <div key={step.key} className="flex items-start gap-3 relative">
                  <div
                    className={`w-[15px] h-[15px] rounded-full flex items-center justify-center z-10 flex-shrink-0 border-2 ${
                      isComplete
                        ? isCurrent
                          ? `border-current ${step.activeColor} bg-white dark:bg-neutral-900`
                          : 'border-emerald-500 bg-white dark:bg-neutral-900'
                        : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-900'
                    }`}
                  >
                    <div
                      className={`w-[5px] h-[5px] rounded-full ${
                        isComplete
                          ? isCurrent
                            ? step.activeBg
                            : 'bg-emerald-500'
                          : 'bg-neutral-300 dark:bg-neutral-600'
                      }`}
                    />
                  </div>
                  <div className="flex-1 -mt-0.5">
                    <div className="flex items-center gap-2">
                      <p
                        className={`text-sm font-medium ${
                          isComplete
                            ? 'text-neutral-900 dark:text-white'
                            : 'text-neutral-400 dark:text-neutral-500'
                        }`}
                      >
                        {step.label}
                      </p>
                      {isCurrent && (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            step.activeColor
                          } ${
                            idx === 0
                              ? 'bg-amber-50 dark:bg-amber-900/20'
                              : idx === 1
                                ? 'bg-blue-50 dark:bg-blue-900/20'
                                : 'bg-emerald-50 dark:bg-emerald-900/20'
                          }`}
                        >
                          {step.icon}
                          Current
                        </span>
                      )}
                      {isComplete && !isCurrent && (
                        <CheckCircle size={12} className="text-emerald-500" />
                      )}
                    </div>
                    <p
                      className={`text-[11px] mt-0.5 ${
                        isComplete ? 'text-neutral-500' : 'text-neutral-400 dark:text-neutral-600'
                      }`}
                    >
                      {step.description}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderDetailView;
