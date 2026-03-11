'use client';

import React, { useState, useMemo, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Modal, message as antMessage, Dropdown } from 'antd';
import {
  Package,
  CheckCircle,
  Clock,
  AlertTriangle,
  Plus,
  Search,
  MoreHorizontal,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Ban,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import { useListings } from '@grc/hooks/useListings';
import SellItemModal from '@grc/components/apps/sell-item-modal';

// ═══════════════════════════════════════════════════════════════════════════
// STATUS CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const statusConfig: Record<string, { label: string; color: string; dot: string }> = {
  live: {
    label: 'Live',
    color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20 dark:text-emerald-400',
    dot: 'bg-emerald-400',
  },
  in_review: {
    label: 'In Review',
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
    dot: 'bg-amber-400',
  },
  approved: {
    label: 'Approved',
    color: 'text-blue bg-blue-50 dark:bg-blue-900/20',
    dot: 'bg-blue',
  },
  draft: {
    label: 'Draft',
    color: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-400',
    dot: 'bg-neutral-400',
  },
  rejected: {
    label: 'Rejected',
    color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
    dot: 'bg-red-400',
  },
  sold: {
    label: 'Sold',
    color: 'text-purple-600 bg-purple-50 dark:bg-purple-900/20 dark:text-purple-400',
    dot: 'bg-purple-400',
  },
  suspended: {
    label: 'Suspended',
    color: 'text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400',
    dot: 'bg-red-400',
  },
  delisted: {
    label: 'Delisted',
    color: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-400',
    dot: 'bg-neutral-400',
  },
  awaiting_fee: {
    label: 'Awaiting Fee',
    color: 'text-amber-600 bg-amber-50 dark:bg-amber-900/20 dark:text-amber-400',
    dot: 'bg-amber-400',
  },
  awaiting_product: {
    label: 'Awaiting Product',
    color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-900/20 dark:text-indigo-400',
    dot: 'bg-indigo-400',
  },
  expired: {
    label: 'Expired',
    color: 'text-neutral-500 bg-neutral-100 dark:bg-neutral-700 dark:text-neutral-400',
    dot: 'bg-neutral-400',
  },
};

const StatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const c = statusConfig[status] || statusConfig.draft;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold ${c.color}`}
    >
      <div className={`w-1.5 h-1.5 rounded-full ${c.dot}`} />
      {c.label}
    </span>
  );
};

const conditionMap: Record<string, string> = {
  brand_new: 'Brand New',
  fairly_used: 'Fairly Used',
  refurbished: 'Refurbished',
  used: 'Used',
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface StoreProductsProps {
  storeId: string;
  listings: any[];
  listingsTotal: number;
  isLoading: boolean;
  isFetching?: boolean;
  page: number;
  onPageChange: (page: number) => void;
  perPage: number;
  onRefresh: () => void;
  /** Store industries for category options in sell modal */
  storeIndustries?: { id: string; label: string }[];
  /** Default state/city from store location */
  defaultLocation?: { state: string; city: string };
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const StoreProducts: React.FC<StoreProductsProps> = ({
  storeId,
  listings,
  listingsTotal,
  isLoading,
  isFetching,
  page,
  onPageChange,
  perPage,
  onRefresh,
  storeIndustries,
  defaultLocation,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [sellModalOpen, setSellModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const { delistListing, deleteListing } = useListings();

  // ── Metrics from real data ──────────────────────────────────────────
  const metrics = useMemo(() => {
    const total = listingsTotal;
    const live = listings.filter((l: any) => l.status === 'live').length;
    const inReview = listings.filter(
      (l: any) => l.status === 'in_review' || l.status === 'approved'
    ).length;
    const soldOut = listings.filter(
      (l: any) => (l.quantity ?? 0) <= 0 && l.status === 'live'
    ).length;
    return [
      {
        label: 'Total Products',
        value: `${total}`,
        icon: Package,
        iconColor: 'text-blue',
        iconBg: 'bg-blue-50 dark:bg-blue-900/20',
      },
      {
        label: 'Live',
        value: `${live}`,
        icon: CheckCircle,
        iconColor: 'text-emerald-600',
        iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
      },
      {
        label: 'In Review',
        value: `${inReview}`,
        icon: Clock,
        iconColor: 'text-amber-600',
        iconBg: 'bg-amber-50 dark:bg-amber-900/20',
      },
      {
        label: 'Sold Out',
        value: `${soldOut}`,
        icon: AlertTriangle,
        iconColor: 'text-red-500',
        iconBg: 'bg-red-50 dark:bg-red-900/20',
      },
    ];
  }, [listings, listingsTotal]);

  // ── Filter ──────────────────────────────────────────────────────────
  const filteredListings = useMemo(() => {
    if (!searchQuery.trim()) return listings;
    const q = searchQuery.toLowerCase();
    return listings.filter((l: any) => (l.itemName || '').toLowerCase().includes(q));
  }, [listings, searchQuery]);

  // ── Pagination ──────────────────────────────────────────────────────
  const totalPages = Math.ceil(listingsTotal / perPage);

  // ── Actions ─────────────────────────────────────────────────────────
  const handleDelist = useCallback(
    async (listingId: string) => {
      try {
        await delistListing?.(listingId);
        antMessage.success('Listing delisted');
        onRefresh();
      } catch {
        antMessage.error('Failed to delist');
      }
    },
    [delistListing, onRefresh]
  );

  const handleDelete = useCallback(
    async (listingId: string) => {
      Modal.confirm({
        title: 'Delete Listing',
        content: 'This action cannot be undone. Are you sure?',
        okText: 'Delete',
        okButtonProps: { danger: true },
        onOk: async () => {
          try {
            await deleteListing?.(listingId);
            antMessage.success('Listing deleted');
            onRefresh();
          } catch {
            antMessage.error('Failed to delete');
          }
        },
      });
    },
    [deleteListing, onRefresh]
  );

  const handleTrackStatus = useCallback((_: string | number) => {
    // Could navigate to listing detail or scroll to it
  }, []);

  const getDropdownItems = (listing: any) => {
    const items: any[] = [];
    if (listing.status === 'live') {
      items.push({
        key: 'delist',
        label: 'Delist',
        icon: <Ban size={14} />,
        onClick: () => handleDelist(listing._id),
      });
    }
    items.push({
      key: 'delete',
      label: 'Delete',
      icon: <Trash2 size={14} />,
      danger: true,
      onClick: () => handleDelete(listing._id),
    });
    return items;
  };

  // ── Skeleton ────────────────────────────────────────────────────────
  const ProductSkeleton = () => (
    <div className="animate-pulse flex items-center gap-4 p-4 border-b border-neutral-50 dark:border-neutral-700/30">
      <div className="w-14 h-14 rounded-xl bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
      <div className="flex-1 space-y-2">
        <div className="h-3.5 bg-neutral-200 dark:bg-neutral-700 rounded w-40" />
        <div className="h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded w-24" />
      </div>
      <div className="h-5 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-full" />
    </div>
  );

  return (
    <div className="space-y-5">
      {/* Metrics */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {metrics.map((m, i) => (
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

      {/* Header + Search + Add */}
      <div className={`flex gap-3 ${isMobile ? 'flex-col' : 'items-center justify-between'}`}>
        <div className="relative flex-1">
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
          />
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full ${
              isMobile ? 'h-10' : 'h-11'
            } pl-10 pr-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all`}
          />
        </div>
        <button
          onClick={() => setSellModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue/20 hover:shadow-lg transition-all"
        >
          <Plus size={16} />
          Add Product
        </button>
      </div>

      {/* Listing Table / Cards */}
      <div className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 overflow-hidden">
        {isLoading ? (
          <div>
            {[1, 2, 3, 4, 5].map((i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-16">
            <Package size={36} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-3" />
            <p className="text-sm text-neutral-500">
              {searchQuery ? 'No products match your search' : 'No products yet'}
            </p>
            {!searchQuery && (
              <button
                onClick={() => setSellModalOpen(true)}
                className="text-sm text-blue font-semibold mt-2 hover:underline"
              >
                Add your first product
              </button>
            )}
          </div>
        ) : (
          <>
            {!isMobile ? (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-neutral-100 dark:border-neutral-700">
                    {['Product', 'Price', 'Qty', 'Status', 'Views', ''].map((h) => (
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
                  {filteredListings.map((listing: any) => {
                    const firstMedia = listing.media?.[0];
                    const price =
                      listing.effectivePrice?.amount || listing.askingPrice?.amount || 0;
                    return (
                      <tr
                        key={listing._id}
                        className="border-b border-neutral-50 dark:border-neutral-700/30 hover:bg-neutral-50/50 dark:hover:bg-neutral-700/20 transition-colors"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                              {firstMedia ? (
                                <img
                                  src={firstMedia.url || firstMedia.thumbnail}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Package size={16} className="text-neutral-400 m-auto" />
                              )}
                            </div>
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate max-w-[200px]">
                                {listing.itemName}
                              </p>
                              <p className="text-[11px] text-neutral-400">
                                {conditionMap[listing.condition] || listing.condition}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm font-semibold text-neutral-900 dark:text-white">
                          {numberFormat(price / 100, Currencies.NGN)}
                        </td>
                        <td className="px-5 py-3.5 text-sm text-neutral-600 dark:text-neutral-400">
                          {listing.quantity ?? 0}
                        </td>
                        <td className="px-5 py-3.5">
                          <StatusBadge status={listing.status} />
                        </td>
                        <td className="px-5 py-3.5 text-sm text-neutral-500">
                          {listing.views || 0}
                        </td>
                        <td className="px-5 py-3.5">
                          <Dropdown menu={{ items: getDropdownItems(listing) }} trigger={['click']}>
                            <button className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                              <MoreHorizontal size={16} className="text-neutral-400" />
                            </button>
                          </Dropdown>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            ) : (
              <div className="divide-y divide-neutral-50 dark:divide-neutral-700/30">
                {filteredListings.map((listing: any) => {
                  const firstMedia = listing.media?.[0];
                  const price = listing.effectivePrice?.amount || listing.askingPrice?.amount || 0;
                  return (
                    <div key={listing._id} className="flex items-center gap-3 p-4">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-neutral-100 dark:bg-neutral-700 flex-shrink-0">
                        {firstMedia ? (
                          <img
                            src={firstMedia.url || firstMedia.thumbnail}
                            alt=""
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Package size={18} className="text-neutral-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                          {listing.itemName}
                        </p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
                            {numberFormat(price / 100, Currencies.NGN)}
                          </span>
                          <span className="text-[11px] text-neutral-400">
                            · Qty: {listing.quantity ?? 0}
                          </span>
                        </div>
                        <StatusBadge status={listing.status} />
                      </div>
                      <Dropdown menu={{ items: getDropdownItems(listing) }} trigger={['click']}>
                        <button className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors">
                          <MoreHorizontal size={16} className="text-neutral-400" />
                        </button>
                      </Dropdown>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-neutral-100 dark:border-neutral-700">
                <span className="text-xs text-neutral-500">
                  Page {page} of {totalPages} · {listingsTotal} product
                  {listingsTotal !== 1 ? 's' : ''}
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => onPageChange(page - 1)}
                    disabled={page <= 1}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft size={16} className="text-neutral-500" />
                  </button>
                  <button
                    onClick={() => onPageChange(page + 1)}
                    disabled={page >= totalPages}
                    className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight size={16} className="text-neutral-500" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {isFetching && !isLoading && (
          <div className="flex items-center justify-center gap-2 py-3 border-t border-neutral-100 dark:border-neutral-700">
            <Loader2 size={14} className="animate-spin text-blue" />
            <span className="text-xs text-neutral-400">Updating...</span>
          </div>
        )}
      </div>

      {/* Sell Item Modal */}
      <SellItemModal
        isSellItemModalOpen={sellModalOpen}
        setIsSellItemModalOpen={setSellModalOpen}
        handleTrackStatus={handleTrackStatus}
        storeId={storeId}
        categoryOptions={storeIndustries}
        defaultLocation={defaultLocation}
      />
    </div>
  );
};

export default StoreProducts;
