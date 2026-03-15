import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ShoppingBag, ChevronRight, ExternalLink, Store, Search, X } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { formatPrice, OrderStatus } from './helpers';
import CardSkeleton from './card-skeleton';
import { Timer, Package, Truck, CheckCircle, XCircle, RotateCcw } from 'lucide-react';
import { Input, Select } from 'antd';
import { useSearch } from '@grc/hooks/useSearch';
import { Pagination } from '@grc/_shared/namespace';

// ═══════════════════════════════════════════════════════════════════════════
// STATUS CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const orderStatusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: <Timer size={14} />,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'text-sky-600 dark:text-sky-400',
    bg: 'bg-sky-50 dark:bg-sky-900/20',
    icon: <CheckCircle size={14} />,
  },
  processing: {
    label: 'Processing',
    color: 'text-blue dark:text-blue',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: <Package size={14} />,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    icon: <Truck size={14} />,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: <CheckCircle size={14} />,
  },
  completed: {
    label: 'Completed',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: <CheckCircle size={14} />,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: <XCircle size={14} />,
  },
  returned: {
    label: 'Returned',
    color: 'text-neutral-600 dark:text-neutral-400',
    bg: 'bg-neutral-100 dark:bg-neutral-800',
    icon: <RotateCcw size={14} />,
  },
};

const orderStatusOptions = [
  { label: 'Pending', value: 'pending' },
  { label: 'Confirmed', value: 'confirmed' },
  { label: 'Processing', value: 'processing' },
  { label: 'Shipped', value: 'shipped' },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Completed', value: 'completed' },
  { label: 'Cancelled', value: 'cancelled' },
];

export const getOrderStatusConfig = (status: string) => {
  return (
    orderStatusConfig[status as OrderStatus] || {
      label: status,
      color: 'text-neutral-600 dark:text-neutral-400',
      bg: 'bg-neutral-100 dark:bg-neutral-800',
      icon: <Package size={14} />,
    }
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface OrdersTabProps {
  orders: any[];
  ordersTotal?: number;
  isLoading?: boolean;
  isFetching?: boolean;
  onViewOrder: (order: any) => void;
  isMobile: boolean;
  perPage?: number;
  pagination?: Pagination;
  onRefetch?: (params: {
    search?: string;
    status?: string;
    page?: number;
    perPage?: number;
  }) => void;
}

const PER_PAGE = 10;

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const OrdersTab: React.FC<OrdersTabProps> = ({
  orders,
  ordersTotal = 0,
  isLoading,
  isFetching,
  onViewOrder,
  isMobile,
  perPage = PER_PAGE,
  onRefetch,
  pagination,
}) => {
  const { push } = useRouter();

  // ── Search & Filter state ───────────────────────────────────────────
  const { searchValue, debouncedChangeHandler } = useSearch();
  const [filterStatus, setFilterStatus] = useState<string | null>(null);

  // ── Infinite scroll state ───────────────────────────────────────────
  const [accumulatedOrders, setAccumulatedOrders] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const hasInitialized = useRef(false);
  const lastFilterKey = useRef('');
  const sentinelRef = useRef<HTMLDivElement>(null);

  const hasActiveFilters = !!(searchValue || filterStatus);
  const total = pagination?.total ?? ordersTotal ?? 0;

  // ── Build a filter key to detect changes ────────────────────────────
  const filterKey = `${searchValue || ''}|${filterStatus || ''}`;

  // ── Reset accumulator when filters change ───────────────────────────
  useEffect(() => {
    if (filterKey !== lastFilterKey.current) {
      lastFilterKey.current = filterKey;
      setAccumulatedOrders([]);
      setCurrentPage(1);
      setHasMore(false);
      hasInitialized.current = false;
    }
  }, [filterKey]);

  // ── Refetch on filter change ────────────────────────────────────────
  useEffect(() => {
    if (onRefetch) {
      onRefetch({
        search: searchValue || undefined,
        status: filterStatus || undefined,
        page: 1,
        perPage,
      });
    }
  }, [searchValue, filterStatus]);

  // ── Accumulate orders when props change ─────────────────────────────
  useEffect(() => {
    if (isLoading || isFetching) return;
    if (!orders || orders.length === 0) {
      if (!hasInitialized.current) {
        hasInitialized.current = true;
        setHasMore(false);
      }
      return;
    }

    if (!hasInitialized.current) {
      // First page load
      setAccumulatedOrders(orders);
      setHasMore(orders.length < total);
      hasInitialized.current = true;
    } else if (currentPage > 1) {
      // Subsequent pages — append, dedup
      setAccumulatedOrders((prev) => {
        const existingIds = new Set(prev.map((o: any) => o._id || o.id));
        const unique = orders.filter((o: any) => !existingIds.has(o._id || o.id));
        const merged = [...prev, ...unique];
        return merged;
      });
      setHasMore(accumulatedOrders.length + orders.length < total);
    } else {
      // Page 1 reload (after filter clear etc)
      setAccumulatedOrders(orders);
      setHasMore(orders.length < total);
    }
  }, [isLoading, isFetching, orders, total]);

  // ── Load next page ──────────────────────────────────────────────────
  const loadNextPage = useCallback(() => {
    if (isFetching || !hasMore) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    if (onRefetch) {
      onRefetch({
        search: searchValue || undefined,
        status: filterStatus || undefined,
        page: nextPage,
        perPage,
      });
    }
  }, [currentPage, isFetching, hasMore, onRefetch, searchValue, filterStatus, perPage]);

  // ── IntersectionObserver for infinite scroll ────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetching && !isLoading) {
          loadNextPage();
        }
      },
      { rootMargin: '200px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadNextPage, hasMore, isFetching, isLoading]);

  const clearFilters = () => {
    debouncedChangeHandler('');
    setFilterStatus(null);
  };

  // ── Loading skeletons for more items ────────────────────────────────
  const LoadMoreSkeleton = () => (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <CardSkeleton key={`load-more-${i}`} />
      ))}
    </div>
  );

  // ── Initial loading state ───────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={`space-y-3 ${isMobile ? 'px-4' : ''}`}>
        {[1, 2, 3].map((i) => (
          <CardSkeleton key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className={isMobile ? 'px-4' : ''}>
      {/* ── Sticky Search + Filters ────────────────────────────────── */}
      <div
        className={`flex w-full ${isMobile ? 'flex-col gap-1' : 'items-center gap-2'} mb-4 sticky ${
          isMobile ? 'top-[75px]' : 'top-[45px]'
        } z-10 bg-white dark:bg-neutral-900 py-3 -mx-4 px-4`}
      >
        <div className="flex-2 w-full mb-2">
          <Input
            prefix={<Search size={isMobile ? 14 : 16} className="text-neutral-400" />}
            placeholder="Search orders..."
            onChange={(e) => debouncedChangeHandler(e.target.value)}
            allowClear
            className={`w-full ${isMobile ? 'h-9' : 'h-11'} rounded-xl`}
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
              isMobile ? 'flex-1 h-9' : 'w-[150px] h-11'
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

      {/* ── Empty state ────────────────────────────────────────────── */}
      {accumulatedOrders.length === 0 && !isFetching ? (
        <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl">
          <ShoppingBag size={36} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-3" />
          <p className="text-sm text-neutral-500 dark:text-neutral-400 font-medium">
            {hasActiveFilters ? 'No orders match your filters' : 'No orders yet'}
          </p>
          {hasActiveFilters ? (
            <button onClick={clearFilters} className="text-xs text-blue hover:underline mt-2">
              Clear filters
            </button>
          ) : (
            <>
              <p className="text-xs text-neutral-400 mt-1">Your purchases will appear here.</p>
              <button
                onClick={() => push('/market')}
                className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-blue hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                Browse Market <ExternalLink size={14} />
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {/* ── Order Cards ────────────────────────────────────────── */}
          {accumulatedOrders.map((order: any) => {
            const cfg = getOrderStatusConfig(order.status);
            const items = order.items || [];
            const store = order.storeId && typeof order.storeId === 'object' ? order.storeId : null;
            const seller =
              order.sellerId && typeof order.sellerId === 'object' ? order.sellerId : null;

            return (
              <motion.div
                key={order._id || order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => onViewOrder(order)}
                className="bg-white dark:bg-neutral-800/60 rounded-xl border border-neutral-100 dark:border-neutral-700/50 p-4 cursor-pointer hover:shadow-md hover:border-neutral-200 dark:hover:border-neutral-600 transition-all group"
              >
                {/* Top row */}
                <div className="flex items-center justify-between mb-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-neutral-900 dark:text-white">
                      {order.orderNumber}
                    </p>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {new Date(order.createdAt).toLocaleDateString('en-NG', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                      {seller && (
                        <span>
                          {' · by '}
                          <span className="font-medium text-neutral-500">
                            {`${seller.firstName || ''} ${seller.lastName || ''}`.trim()}
                          </span>
                        </span>
                      )}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.color} ${cfg.bg}`}
                    >
                      {cfg.icon}
                      {cfg.label}
                    </span>
                    <ChevronRight
                      size={16}
                      className="text-neutral-300 group-hover:text-neutral-500 transition-colors"
                    />
                  </div>
                </div>

                {/* Store / Seller row */}
                {(store || seller) && (
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 rounded-md bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {store?.logo ? (
                        <img src={store.logo} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <Store size={12} className="text-neutral-400" />
                      )}
                    </div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 truncate">
                      {store?.name || ''}
                      {seller && store && ' \u00b7 '}
                      {seller && `${seller.firstName} ${seller.lastName}`}
                    </span>
                  </div>
                )}

                {/* Items row */}
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {items.slice(0, 3).map((item: any, idx: number) => (
                      <div
                        key={item._id || item.id || idx}
                        className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 border-2 border-white dark:border-neutral-800 overflow-hidden"
                        style={{ zIndex: 3 - idx }}
                      >
                        {item.image && (
                          <img src={item.image} alt="" className="w-full h-full object-cover" />
                        )}
                      </div>
                    ))}
                    {items.length > 3 && (
                      <div
                        className="w-10 h-10 rounded-lg bg-neutral-100 dark:bg-neutral-700 border-2 border-white dark:border-neutral-800 flex items-center justify-center text-xs font-semibold text-neutral-400"
                        style={{ zIndex: 0 }}
                      >
                        +{items.length - 3}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs text-neutral-500 truncate">
                      {items.map((i: any) => i.itemName).join(', ')}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-neutral-900 dark:text-white flex-shrink-0">
                    {formatPrice(order.totalAmount, order.currency)}
                  </span>
                </div>
              </motion.div>
            );
          })}

          {/* ── Infinite scroll sentinel + loading skeleton ─────────── */}
          {hasMore && (
            <>
              <div ref={sentinelRef} className="h-1" />
              {isFetching && <LoadMoreSkeleton />}
            </>
          )}

          {/* ── End of list ─────────────────────────────────────────── */}
          {!hasMore && accumulatedOrders.length > 0 && (
            <p className="text-center text-xs text-neutral-400 py-4">
              {total > 0
                ? `Showing all ${accumulatedOrders.length} order${
                    accumulatedOrders.length !== 1 ? 's' : ''
                  }`
                : 'No more orders'}
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default OrdersTab;
