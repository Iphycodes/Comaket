import React, { useEffect, useState, useCallback, useContext, useMemo } from 'react';
import { Modal, message, InputNumber, Select, Input } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, ArrowLeft, Send, RefreshCw } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import UpdateItemModal from '../update-item-modal';
import DeleteConfirmModal from '../delete-confirm-modal';
import TableSkeleton from '../../../_shared/components/table-skeleton';
import { SellItemType, SellItemStatus, SellingModel } from '@grc/_shared/namespace/sell-item';
import SellItemDetail from './libs/sell-item-details';
import MarketItemsTable from './libs/market-item-table';
import { AppContext } from '@grc/app-context';
import { useListings } from '@grc/hooks/useListings';
import { usePayments } from '@grc/hooks/usePayments';
import type { ListingType, ListingStatus, QueryListingsParams } from '@grc/services/listings';
import { useSearch } from '@grc/hooks/useSearch';

// ═══════════════════════════════════════════════════════════════════════════
// TRANSFORM: Backend Listing → Frontend SellItemType (display only)
// ═══════════════════════════════════════════════════════════════════════════

const TYPE_TO_MODEL: Record<string, SellingModel> = {
  self_listing: 'self-listing',
  consignment: 'consignment',
  direct_purchase: 'direct-sale',
};

const STATUS_TO_FE: Record<string, SellItemStatus> = {
  draft: 'in-review',
  in_review: 'in-review',
  approved: 'approved',
  rejected: 'rejected',
  awaiting_fee: 'awaiting-fee',
  awaiting_product: 'awaiting-product',
  price_offered: 'price-offered',
  counter_offer: 'counter-offer',
  live: 'live',
  sold: 'sold',
  suspended: 'delisted',
  expired: 'delisted',
  delisted: 'delisted',
};

const CONDITION_TO_FE: Record<string, string> = {
  brand_new: 'Brand New',
  fairly_used: 'Fairly Used',
  used: 'Uk Used',
  refurbished: 'Refurbished',
};

const CONDITION_TO_BE: Record<string, string> = {
  'Brand New': 'brand_new',
  'Fairly Used': 'fairly_used',
  Refurbished: 'refurbished',
};

const transformListingToSellItem = (listing: any): SellItemType => {
  const store = listing.storeId && typeof listing.storeId === 'object' ? listing.storeId : null;

  return {
    id: listing._id,
    itemName: listing.itemName || '',
    description: listing.description || '',
    condition: CONDITION_TO_FE[listing.condition] || listing.condition || '',
    sellingModel: TYPE_TO_MODEL[listing.type] || ('self-listing' as SellingModel),
    status: STATUS_TO_FE[listing.status] || ('in-review' as SellItemStatus),
    askingPrice: {
      price: listing.askingPrice?.amount || 0,
      negotiable: listing.askingPrice?.negotiable ?? false,
    },
    platformBid: listing.platformBid || 0,
    counterOffer: listing.counterOffer || 0,
    postImgUrls: (listing.media || []).map((m: any) => (typeof m === 'string' ? m : m.url)),
    media: listing.media || [],
    location: listing.location || '',
    live: listing.status === 'live',
    feePaymentStatus:
      listing.status === 'live'
        ? 'processed'
        : listing.listingFeeStatus === 'paid'
          ? 'processed'
          : listing.listingFeeStatus || 'pending',
    listingFee: listing.listingFee || 0,
    rejectionReason: listing.reviewInfo?.rejectionReason || '',
    quantity: listing.quantity || 1,
    category: listing.category || '',
    tags: listing.tags || [],
    whatsappNumber: listing.whatsappNumber || '',
    storeId: store?._id || (typeof listing.storeId === 'string' ? listing.storeId : ''),
    storeName: store?.name || '',
    views: listing.views || 0,
    likes: listing.likes || [],
    comments: listing.comments || [],
    bookMarks: listing.bookMarks || [],
    totalSales: listing.totalSales || 0,
    sponsored: false,
    isBuyable: listing.isBuyable || false,
    adminPricing: listing.adminPricing,
    effectivePrice: listing.effectivePrice,
    createdAt: listing.createdAt || '',
    updatedAt: listing.updatedAt || '',
    postUserProfile: {},
  } as SellItemType;
};

// ═══════════════════════════════════════════════════════════════════════════
// FILTER OPTIONS
// ═══════════════════════════════════════════════════════════════════════════

const sellTypeOptions: { label: string; value: ListingType }[] = [
  { label: 'Self Listing', value: 'self_listing' },
  { label: 'Consignment', value: 'consignment' },
  { label: 'Direct Purchase', value: 'direct_purchase' },
];

const statusOptions: { label: string; value: ListingStatus }[] = [
  { label: 'In Review', value: 'in_review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Awaiting Fee', value: 'awaiting_fee' },
  { label: 'Awaiting Product', value: 'awaiting_product' },
  { label: 'Price Offered', value: 'price_offered' },
  { label: 'Counter Offer', value: 'counter_offer' },
  { label: 'Live', value: 'live' },
  { label: 'Sold', value: 'sold' },
  { label: 'Delisted', value: 'delisted' },
];

const conditionOptions = [
  { label: 'Brand New', value: 'brand_new' },
  { label: 'Fairly Used', value: 'fairly_used' },
  { label: 'Uk Used', value: 'used' },
  { label: 'Refurbished', value: 'refurbished' },
];

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE OVERLAY
// ═══════════════════════════════════════════════════════════════════════════

interface MobileOverlayProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  zIndex?: number;
  children: React.ReactNode;
}

const MobileOverlay: React.FC<MobileOverlayProps> = ({
  open,
  onClose,
  title,
  zIndex = 200,
  children,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className="fixed inset-0 bg-white dark:bg-neutral-900 flex flex-col overflow-hidden"
          style={{ zIndex }}
        >
          <div
            className={`sticky top-0 z-10 bg-white dark:bg-neutral-900 pb-3 pt-1 -mx-1 px-1 ${
              isMobile ? 'pt-9' : ''
            }`}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0 bg-white dark:bg-neutral-900">
              <button
                onClick={onClose}
                className="flex items-center gap-2 text-sm text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition-colors"
              >
                <ArrowLeft size={18} />
                <span className="font-medium">{title || 'Back'}</span>
              </button>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors"
              >
                <X size={16} className="text-neutral-500" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// COUNTER OFFER VIEW
// ═══════════════════════════════════════════════════════════════════════════

interface CounterOfferViewProps {
  item: SellItemType;
  onSubmit: (amountKobo: number) => void;
  isSubmitting?: boolean;
}

const CounterOfferView: React.FC<CounterOfferViewProps> = ({
  item,
  onSubmit,
  isSubmitting: isSubmittingProp,
}) => {
  const [amount, setAmount] = useState<number | null>(null);
  const platformBidNaira = (item.platformBid || 0) / 100;
  const askingPriceNaira = (item.askingPrice?.price || 0) / 100;

  return (
    <div className="p-5 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-1">Counter Offer</h2>
        <p className="text-sm text-neutral-500">
          Submit your counter offer for <strong>{item.itemName}</strong>
        </p>
      </div>
      <div className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Your asking price</span>
          <span className="font-semibold">₦{askingPriceNaira.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-neutral-500">Their offer</span>
          <span className="font-semibold text-blue">₦{platformBidNaira.toLocaleString()}</span>
        </div>
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-neutral-500">Difference</span>
            <span className="font-semibold text-orange-500">
              ₦{Math.abs(askingPriceNaira - platformBidNaira).toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div>
        <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-2 block">
          Your Counter Offer (₦)
        </label>
        <InputNumber
          value={amount}
          onChange={(val) => setAmount(val)}
          placeholder="Enter amount in Naira"
          className="!w-full !h-14 !text-lg !rounded-xl"
          formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
          parser={(value) => Number(value?.replace(/\$\s?|(,*)/g, '') || 0)}
          min={1}
          controls={false}
          prefix={<span className="text-neutral-400 text-base mr-1">₦</span>}
        />
        {amount && amount > 0 && (
          <p className="text-xs text-neutral-400 mt-1.5">
            {amount > platformBidNaira
              ? `₦${(amount - platformBidNaira).toLocaleString()} above their offer`
              : amount < platformBidNaira
                ? `₦${(platformBidNaira - amount).toLocaleString()} below their offer`
                : 'Same as their offer'}
          </p>
        )}
      </div>
      <button
        onClick={() => {
          if (amount && amount > 0) onSubmit(amount * 100);
          else message.warning('Please enter a valid counter offer amount');
        }}
        disabled={isSubmittingProp || !amount || amount <= 0}
        className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
          isSubmittingProp || !amount || amount <= 0
            ? 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 hover:shadow-lg'
        }`}
      >
        <Send size={16} />
        {isSubmittingProp ? 'Submitting...' : 'Send Counter Offer'}
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface SellItemProps {
  storeId?: string;
}

const SellItem = ({ storeId }: SellItemProps) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { setIsSellItemModalOpen } = useContext(AppContext);

  // ── Filter State ──────────────────────────────────────────────────────
  const { searchValue, debouncedChangeHandler } = useSearch();
  const [filterType, setFilterType] = useState<ListingType | null>(null);
  const [filterStatus, setFilterStatus] = useState<ListingStatus | null>(null);
  const [filterCondition, setFilterCondition] = useState<string | null>(null);

  const queryParams: QueryListingsParams = useMemo(() => {
    const params: QueryListingsParams = {};
    if (filterType) params.type = filterType;
    if (filterStatus) params.status = filterStatus;
    if (filterCondition) params.condition = filterCondition;
    return params;
  }, [filterType, filterStatus, filterCondition]);

  // ── Listings Hook ─────────────────────────────────────────────────────
  const {
    myListings,
    myListingsTotal,
    isLoadingMyListings,
    isFetchingMyListings,
    refetchMyListings,
    deleteListing: apiDeleteListing,
    acceptOffer: apiAcceptOffer,
    rejectOffer: apiRejectOffer,
    submitCounterOffer: apiCounterOffer,
    isSubmittingCounterOffer,
    myListingPagination,
  } = useListings({
    fetchMyListings: true,
    myListingsParams: storeId ? { ...queryParams, storeId } : { ...queryParams },
    search: searchValue,
  });

  // ── Payments Hook — for listing fee ───────────────────────────────────
  const { initializeListingFee, isInitializingListingFee } = usePayments();

  const [payingFeeId, setPayingFeeId] = useState<string | null>(null);

  // ── Filter helpers ────────────────────────────────────────────────────
  const hasActiveFilters = !!(filterType || filterStatus || filterCondition || searchValue);

  const clearAllFilters = () => {
    debouncedChangeHandler('');
    setFilterType(null);
    setFilterStatus(null);
    setFilterCondition(null);
  };

  // ── Transform backend → frontend ─────────────────────────────────────
  const items: SellItemType[] = useMemo(
    () => (myListings || []).map(transformListingToSellItem),
    [myListings]
  );

  // ── Selected item / modal state ───────────────────────────────────────
  const [selectedItem, setSelectedItem] = useState<SellItemType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCounterOfferModalOpen, setIsCounterOfferModalOpen] = useState(false);
  const [counterOfferAmount, setCounterOfferAmount] = useState<number>(0);
  const [isMobileCounterOfferOpen, setIsMobileCounterOfferOpen] = useState(false);

  useEffect(() => {
    if (selectedItem && items.length > 0) {
      const updated = items.find((i) => i.id === selectedItem.id);
      if (updated) setSelectedItem(updated);
    }
  }, [items]);

  // ══════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ══════════════════════════════════════════════════════════════════════

  const refetch = useCallback(() => {
    refetchMyListings(queryParams);
  }, [refetchMyListings, queryParams]);

  const handleViewItem = (item: SellItemType) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };
  const handleEditItem = useCallback((item: SellItemType) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  }, []);
  const handleCloseEdit = useCallback(() => {
    setIsUpdateModalOpen(false);
    refetch();
  }, [refetch]);
  const handleDeleteItem = (item: SellItemType) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedItem) return;
    try {
      await apiDeleteListing(selectedItem.id as string);
      setIsDeleteModalOpen(false);
      setIsDetailOpen(false);
      setSelectedItem(null);
      refetch();
    } catch {}
  };

  // ── Pay Listing Fee — backend-initialized Paystack ────────────────────
  const handlePayFee = useCallback(
    async (item: SellItemType) => {
      const listingId = item.id as string;
      setPayingFeeId(listingId);
      try {
        const callbackUrl = `${window.location.origin}/payment/verify?type=listing_fee&listingId=${listingId}`;
        await initializeListingFee({
          listingId,
          callbackUrl,
        });
        // initializeListingFee redirects to Paystack automatically via window.location.href
      } catch (error: any) {
        const msg = error?.data?.message || 'Failed to initialize payment. Please try again.';
        message.error(msg);
        setPayingFeeId(null);
      }
    },
    [initializeListingFee]
  );

  const handleAcceptOffer = useCallback(
    (item: SellItemType) => {
      Modal.confirm({
        title: 'Accept Offer',
        content: `Are you sure you want to accept ₦${(
          (item.platformBid || 0) / 100
        ).toLocaleString()} for "${item.itemName}"?`,
        okText: 'Yes, Accept',
        okButtonProps: { className: '!bg-emerald-500 !border-emerald-500' },
        zIndex: 20000,
        onOk: async () => {
          try {
            await apiAcceptOffer(item.id as string);
            setIsDetailOpen(false);
            refetch();
          } catch {}
        },
      });
    },
    [apiAcceptOffer, refetch]
  );

  const handleRejectOffer = useCallback(
    (item: SellItemType) => {
      Modal.confirm({
        title: 'Decline Offer',
        content: `Are you sure you want to decline the offer of ₦${(
          (item.platformBid || 0) / 100
        ).toLocaleString()} for "${item.itemName}"? This action cannot be undone.`,
        okText: 'Yes, Decline',
        okButtonProps: { danger: true },
        zIndex: 20000,
        onOk: async () => {
          try {
            await apiRejectOffer(item.id as string);
            setIsDetailOpen(false);
            refetch();
          } catch {}
        },
      });
    },
    [apiRejectOffer, refetch]
  );

  const handleCounterOffer = useCallback(
    (item: SellItemType) => {
      setSelectedItem(item);
      setCounterOfferAmount((item.platformBid || 0) / 100);
      if (isMobile) setIsMobileCounterOfferOpen(true);
      else setIsCounterOfferModalOpen(true);
    },
    [isMobile]
  );

  const handleSubmitCounterOffer = async () => {
    if (!selectedItem || counterOfferAmount <= 0) return;
    try {
      await apiCounterOffer(selectedItem.id as string, counterOfferAmount * 100);
      setIsCounterOfferModalOpen(false);
      setIsDetailOpen(false);
      refetch();
    } catch {}
  };

  const handleMobileCounterOfferSubmit = async (amountKobo: number) => {
    if (!selectedItem) return;
    try {
      await apiCounterOffer(selectedItem.id as string, amountKobo);
      setIsMobileCounterOfferOpen(false);
      setIsDetailOpen(false);
      refetch();
    } catch {}
  };

  const handleTrackStatus = (id: string | number) => {
    const item = items.find((i) => String(i.id) === String(id));
    if (item) handleViewItem(item);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
    setSelectedItem(null);
  };

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════

  return (
    <div className={`dark:bg-neutral-900/50 ${isMobile ? 'max-w-[100vw] mb-10' : ''}`}>
      {/* ── Main list view ──────────────────────────────────────────── */}
      <div className={isDetailOpen && isMobile ? 'hidden' : ''}>
        <div className={`w-full ${!isMobile ? 'max-w-7xl mx-auto px-4' : 'px-3'}`}>
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-20 bg-white dark:bg-neutral-900 pb-2"
          >
            <div className="flex items-center justify-between py-4">
              <div>
                <h1 className="text-xl font-bold text-neutral-900 dark:text-white">My Products</h1>
                <p className="text-xs text-neutral-400 mt-0.5">
                  {myListingsTotal} product{myListingsTotal !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={refetch}
                  disabled={isFetchingMyListings}
                  className={`w-10 h-10 rounded-xl border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-all ${
                    isFetchingMyListings ? 'animate-spin' : ''
                  }`}
                >
                  <RefreshCw size={16} />
                </button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setIsSellItemModalOpen(true)}
                  className="bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white py-2.5 px-5 rounded-xl font-semibold flex items-center gap-1.5 text-sm shadow-md shadow-blue/20 hover:shadow-lg transition-all"
                >
                  <Plus size={18} />
                  {isMobile ? 'Sell' : 'New Product'}
                </motion.button>
              </div>
            </div>

            {/* Filters */}
            <div
              className={`flex w-full ${
                isMobile ? 'flex-col items-start gap-1' : 'items-center gap-2'
              }`}
            >
              <div className="mb-3 flex-2 w-full relative">
                <Input
                  prefix={<Search size={isMobile ? 16 : 18} className="text-neutral-400" />}
                  placeholder="Search your products..."
                  onChange={(e) => debouncedChangeHandler(e.target.value)}
                  className={`w-full ${
                    isMobile ? 'h-10' : 'h-12'
                  } !rounded-xl !border-neutral-200 dark:!border-neutral-700`}
                />
                {searchValue && (
                  <button
                    onClick={() => debouncedChangeHandler('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors"
                  >
                    <X size={12} />
                  </button>
                )}
              </div>
              <div
                className={`flex flex-1 w-full items-center gap-2 mb-3 ${
                  isMobile ? 'flex-wrap' : ''
                }`}
              >
                <Select
                  allowClear
                  placeholder="Sell Type"
                  value={filterType}
                  onChange={(val) => setFilterType(val || null)}
                  options={sellTypeOptions}
                  className={`${
                    isMobile ? 'flex-1 min-w-[120px] h-10' : 'w-[160px] h-12'
                  } [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-neutral-200 dark:[&_.ant-select-selector]:!border-neutral-700`}
                />
                <Select
                  allowClear
                  placeholder="Status"
                  value={filterStatus}
                  onChange={(val) => setFilterStatus(val || null)}
                  options={statusOptions}
                  className={`${
                    isMobile ? 'flex-1 min-w-[120px] h-10' : 'w-[160px] h-12'
                  } [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-neutral-200 dark:[&_.ant-select-selector]:!border-neutral-700`}
                />
                <Select
                  allowClear
                  placeholder="Condition"
                  value={filterCondition}
                  onChange={(val) => setFilterCondition(val || null)}
                  options={conditionOptions}
                  className={`${
                    isMobile ? 'flex-1 min-w-[120px] h-10' : 'w-[160px] h-12'
                  } [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-neutral-200 dark:[&_.ant-select-selector]:!border-neutral-700`}
                />
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 px-3 h-9 text-xs font-medium text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors"
                  >
                    <X size={13} />
                    Clear
                  </button>
                )}
              </div>
            </div>
          </motion.div>

          {/* Product list */}
          <div className="pb-8">
            {isLoadingMyListings ? (
              isMobile ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-neutral-800 rounded-2xl h-28 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <TableSkeleton />
              )
            ) : (
              <MarketItemsTable
                items={items}
                onView={handleViewItem}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onPayFee={handlePayFee}
                onAcceptOffer={handleAcceptOffer}
                onRejectOffer={handleRejectOffer}
                onCounterOffer={handleCounterOffer}
                isLoading={isLoadingMyListings || isFetchingMyListings}
                pagination={myListingPagination}
                isPayingFee={isInitializingListingFee}
                payingFeeId={payingFeeId}
              />
            )}
            {isFetchingMyListings && !isLoadingMyListings && (
              <div className="flex items-center justify-center py-4">
                <div className="w-5 h-5 border-2 border-blue border-t-transparent rounded-full animate-spin" />
                <span className="text-xs text-neutral-400 ml-2">Updating...</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MOBILE DETAIL ──────────────────────────────────────────── */}
      <AnimatePresence>
        {isDetailOpen && selectedItem && isMobile && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-neutral-50 dark:bg-neutral-900 overflow-y-auto"
          >
            <div className="px-3 py-4 mb-10">
              <SellItemDetail
                item={selectedItem}
                onBack={handleCloseDetail}
                onEdit={() => handleEditItem(selectedItem)}
                onDelete={() => handleDeleteItem(selectedItem)}
                onPayFee={() => handlePayFee(selectedItem)}
                onAcceptOffer={() => handleAcceptOffer(selectedItem)}
                onRejectOffer={() => handleRejectOffer(selectedItem)}
                onCounterOffer={() => handleCounterOffer(selectedItem)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── MOBILE COUNTER OFFER ───────────────────────────────────── */}
      {isMobile && selectedItem && (
        <MobileOverlay
          open={isMobileCounterOfferOpen}
          onClose={() => setIsMobileCounterOfferOpen(false)}
          title="Counter Offer"
          zIndex={300}
        >
          <CounterOfferView
            item={selectedItem}
            onSubmit={handleMobileCounterOfferSubmit}
            isSubmitting={isSubmittingCounterOffer}
          />
        </MobileOverlay>
      )}

      {/* ── DESKTOP DETAIL ─────────────────────────────────────────── */}
      {!isMobile && selectedItem && (
        <Modal
          open={isDetailOpen}
          onCancel={handleCloseDetail}
          width={720}
          footer={null}
          className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden"
        >
          <div className="max-h-[80vh] overflow-y-auto pb-2 px-1">
            <SellItemDetail
              item={selectedItem}
              onBack={handleCloseDetail}
              onEdit={() => handleEditItem(selectedItem)}
              onDelete={() => handleDeleteItem(selectedItem)}
              onPayFee={() => handlePayFee(selectedItem)}
              onAcceptOffer={() => handleAcceptOffer(selectedItem)}
              onRejectOffer={() => handleRejectOffer(selectedItem)}
              onCounterOffer={() => handleCounterOffer(selectedItem)}
            />
          </div>
        </Modal>
      )}

      {/* ── ALL MODALS ─────────────────────────────────────────────── */}
      {selectedItem && (
        <UpdateItemModal
          isModalOpen={isUpdateModalOpen}
          onClose={handleCloseEdit}
          initialData={{
            productId: selectedItem.id,
            itemName: selectedItem.itemName,
            condition: CONDITION_TO_BE[selectedItem.condition] || selectedItem.condition,
            description: selectedItem.description,
            state: selectedItem.location?.state || '',
            city: selectedItem.location?.city || '',
            askPrice: (selectedItem.askingPrice?.price ?? 0) / 100,
            negotiable: selectedItem.askingPrice?.negotiable,
            images: selectedItem.postImgUrls || [],
            status: selectedItem.status,
            sellingModel: selectedItem.sellingModel,
            listingFee: selectedItem.listingFee || 0,
          }}
          handleTrackStatus={handleTrackStatus}
        />
      )}

      {selectedItem && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemData={selectedItem}
        />
      )}

      <Modal
        open={isCounterOfferModalOpen}
        onCancel={() => setIsCounterOfferModalOpen(false)}
        title={
          <div>
            <h3 className="text-lg font-bold">Counter Offer</h3>
            <p className="text-xs text-neutral-400 font-normal mt-1">
              Their offer: ₦{((selectedItem?.platformBid || 0) / 100).toLocaleString()} · Your ask:
              ₦{((selectedItem?.askingPrice?.price || 0) / 100).toLocaleString()}
            </p>
          </div>
        }
        footer={null}
        width={420}
      >
        <div className="space-y-4 pt-4">
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 block mb-2">
              Your Counter Price (₦)
            </label>
            <InputNumber
              className="w-full h-14 !rounded-xl"
              size="large"
              controls={false}
              prefix={<span className="text-neutral-400">₦</span>}
              placeholder="Enter your counter offer"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: any) => value?.replace(/,/g, '')}
              value={counterOfferAmount}
              onChange={(value) => setCounterOfferAmount(Number(value) || 0)}
            />
          </div>
          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setIsCounterOfferModalOpen(false)}
              className="flex-1 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitCounterOffer}
              disabled={counterOfferAmount <= 0 || isSubmittingCounterOffer}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                counterOfferAmount > 0 && !isSubmittingCounterOffer
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:shadow-lg'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {isSubmittingCounterOffer ? 'Sending...' : 'Send Counter Offer'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SellItem;
