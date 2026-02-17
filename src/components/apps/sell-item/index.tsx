'use client';

import React, { useEffect, useState, useCallback, useContext } from 'react';
import { Modal, message, InputNumber, Select } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Search, X, ArrowLeft, Send } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import SellItemModal from '../sell-item-modal';
import UpdateItemModal from '../update-item-modal';
import DeleteConfirmModal from '../delete-confirm-modal';
import TableSkeleton from '../../../_shared/components/table-skeleton';
import { SellItemType, SellItemStatus, SellingModel } from '@grc/_shared/namespace/sell-item';
import { mockSellItems } from '@grc/_shared/constant';
import SellItemDetail from './libs/sell-item-details';
import MarketItemsTable from './libs/market-item-table';
import { AppContext } from '@grc/app-context';

// ─── Filter option configs ──────────────────────────────────────────────────

const sellTypeOptions = [
  { label: 'Self Listing', value: 'self-listing' },
  { label: 'Consignment', value: 'consignment' },
  { label: 'Direct Sale', value: 'direct-sale' },
];

const statusOptions: { label: string; value: SellItemStatus }[] = [
  { label: 'In Review', value: 'in-review' },
  { label: 'Approved', value: 'approved' },
  { label: 'Awaiting Fee', value: 'awaiting-fee' },
  { label: 'Awaiting Product', value: 'awaiting-product' },
  { label: 'Price Offered', value: 'price-offered' },
  { label: 'Counter Offer', value: 'counter-offer' },
  { label: 'Live', value: 'live' },
  { label: 'Sold', value: 'sold' },
  { label: 'Rejected', value: 'rejected' },
  { label: 'Delisted', value: 'delisted' },
];

const conditionOptions = [
  { label: 'Brand New', value: 'Brand New' },
  { label: 'Uk Used', value: 'Uk Used' },
  { label: 'Fairly Used', value: 'Fairly Used' },
];

// ─── Mobile Full-Screen Overlay ─────────────────────────────────────────────

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
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        initial={{ opacity: 0, x: '100%' }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: '100%' }}
        transition={{ type: 'spring', damping: 28, stiffness: 300 }}
        className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col overflow-hidden"
        style={{ zIndex }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900">
          <button
            onClick={onClose}
            className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft size={18} />
            <span className="font-medium">{title || 'Back'}</span>
          </button>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <X size={16} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">{children}</div>
      </motion.div>
    )}
  </AnimatePresence>
);

// ─── Counter Offer View (mobile full-screen content) ────────────────────────

interface CounterOfferViewProps {
  item: SellItemType;
  onSubmit: (amountKobo: number) => void;
}

const CounterOfferView: React.FC<CounterOfferViewProps> = ({ item, onSubmit }) => {
  const [amount, setAmount] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const platformBidNaira = (item.platformBid || 0) / 100;
  const askingPriceNaira = (item.askingPrice?.price || 0) / 100;

  const handleSubmit = () => {
    if (!amount || amount <= 0) {
      message.warning('Please enter a valid counter offer amount');
      return;
    }
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(amount * 100);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="p-5 space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Counter Offer</h2>
        <p className="text-sm text-gray-500">
          Submit your counter offer for <strong>{item.itemName}</strong>
        </p>
      </div>

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Your asking price</span>
          <span className="font-semibold">₦{askingPriceNaira.toLocaleString()}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Their offer</span>
          <span className="font-semibold text-blue">₦{platformBidNaira.toLocaleString()}</span>
        </div>
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Difference</span>
            <span className="font-semibold text-orange-500">
              ₦{Math.abs(askingPriceNaira - platformBidNaira).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
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
          prefix={<span className="text-gray-400 text-base mr-1">₦</span>}
        />
        {amount && amount > 0 && (
          <p className="text-xs text-gray-400 mt-1.5">
            {amount > platformBidNaira
              ? `₦${(amount - platformBidNaira).toLocaleString()} above their offer`
              : amount < platformBidNaira
                ? `₦${(platformBidNaira - amount).toLocaleString()} below their offer`
                : 'Same as their offer'}
          </p>
        )}
      </div>

      <button
        onClick={handleSubmit}
        disabled={isSubmitting || !amount || amount <= 0}
        className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
          isSubmitting || !amount || amount <= 0
            ? 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white shadow-md shadow-orange-500/20 hover:shadow-lg'
        }`}
      >
        <Send size={16} />
        {isSubmitting ? 'Submitting...' : 'Send Counter Offer'}
      </button>
    </div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

const SellItem = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [isLoading, setIsLoading] = useState(true);
  const [items, setItems] = useState<SellItemType[]>(mockSellItems);
  const [searchQuery, setSearchQuery] = useState('');

  // Filters
  const [filterSellType, setFilterSellType] = useState<SellingModel | null>(null);
  const [filterStatus, setFilterStatus] = useState<SellItemStatus | null>(null);
  const [filterCondition, setFilterCondition] = useState<string | null>(null);

  // Selected item for detail/edit/delete
  const [selectedItem, setSelectedItem] = useState<SellItemType | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  // Modals (desktop)
  // const [isSellItemModalOpen, setIsSellItemModalOpen] = useState(false);
  const { isSellItemModalOpen, setIsSellItemModalOpen } = useContext(AppContext);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isCounterOfferModalOpen, setIsCounterOfferModalOpen] = useState(false);
  const [counterOfferAmount, setCounterOfferAmount] = useState<number>(0);

  // Mobile full-screen states
  const [isMobileCounterOfferOpen, setIsMobileCounterOfferOpen] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // ── Filters ───────────────────────────────────────────────────────────
  const hasActiveFilters = filterSellType || filterStatus || filterCondition;

  const clearAllFilters = () => {
    setFilterSellType(null);
    setFilterStatus(null);
    setFilterCondition(null);
  };

  const filteredItems = items.filter((item) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.itemName.toLowerCase().includes(q) && !item.description.toLowerCase().includes(q)) {
        return false;
      }
    }
    if (filterSellType && item.sellingModel !== filterSellType) return false;
    if (filterStatus && item.status !== filterStatus) return false;
    if (filterCondition && item.condition !== filterCondition) return false;
    return true;
  });

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleViewItem = (item: SellItemType) => {
    setSelectedItem(item);
    setIsDetailOpen(true);
  };

  /** Edit: UpdateItemModal handles mobile/desktop rendering internally */
  const handleEditItem = useCallback((item: SellItemType) => {
    setSelectedItem(item);
    setIsUpdateModalOpen(true);
  }, []);

  const handleCloseEdit = useCallback(() => {
    setIsUpdateModalOpen(false);
  }, []);

  const handleDeleteItem = (item: SellItemType) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (selectedItem) {
      setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      message.success('Product deleted successfully');
      setIsDeleteModalOpen(false);
      setIsDetailOpen(false);
      setSelectedItem(null);
    }
  };

  const handlePayFee = (item: SellItemType) => {
    setItems((prev) =>
      prev.map((i) =>
        i.id === item.id
          ? { ...i, status: 'live' as const, live: true, feePaymentStatus: 'processed' as const }
          : i
      )
    );
    setSelectedItem((prev) =>
      prev && prev.id === item.id
        ? { ...prev, status: 'live' as const, live: true, feePaymentStatus: 'processed' as const }
        : prev
    );
  };

  const handleAcceptOffer = (item: SellItemType) => {
    Modal.confirm({
      title: 'Accept Offer',
      content: `Are you sure you want to accept ₦${(
        (item.platformBid || 0) / 100
      ).toLocaleString()} for "${item.itemName}"?`,
      okText: 'Yes, Accept',
      okButtonProps: { className: '!bg-emerald-500 !border-emerald-500' },
      zIndex: 20000,
      onOk: () => {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, status: 'sold' as const } : i))
        );
        setSelectedItem((prev) =>
          prev && prev.id === item.id ? { ...prev, status: 'sold' as const } : prev
        );
        message.success("Offer accepted! We'll arrange payment and pickup.");
        setIsDetailOpen(false);
      },
    });
  };

  const handleRejectOffer = (item: SellItemType) => {
    Modal.confirm({
      title: 'Decline Offer',
      content: `Are you sure you want to decline the offer of ₦${(
        (item.platformBid || 0) / 100
      ).toLocaleString()} for "${item.itemName}"? This action cannot be undone.`,
      okText: 'Yes, Decline',
      okButtonProps: { danger: true },
      zIndex: 20000,
      onOk: () => {
        setItems((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, status: 'rejected' as const, rejectionReason: 'Seller declined the offer' }
              : i
          )
        );
        setSelectedItem((prev) =>
          prev && prev.id === item.id
            ? {
                ...prev,
                status: 'rejected' as const,
                rejectionReason: 'Seller declined the offer',
              }
            : prev
        );
        message.info('Offer declined');
        setIsDetailOpen(false);
      },
    });
  };

  /** Counter offer: mobile → MobileOverlay, desktop → modal */
  const handleCounterOffer = useCallback(
    (item: SellItemType) => {
      setSelectedItem(item);
      setCounterOfferAmount((item.platformBid || 0) / 100);
      if (isMobile) {
        setIsMobileCounterOfferOpen(true);
      } else {
        setIsCounterOfferModalOpen(true);
      }
    },
    [isMobile]
  );

  const handleSubmitCounterOffer = () => {
    if (selectedItem && counterOfferAmount > 0) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === selectedItem.id
            ? { ...i, status: 'counter-offer' as const, counterOffer: counterOfferAmount * 100 }
            : i
        )
      );
      setSelectedItem((prev) =>
        prev && prev.id === selectedItem.id
          ? {
              ...prev,
              status: 'counter-offer' as const,
              counterOffer: counterOfferAmount * 100,
            }
          : prev
      );
      setIsCounterOfferModalOpen(false);
      setIsDetailOpen(false);
      message.success('Counter offer sent!');
    }
  };

  const handleMobileCounterOfferSubmit = (amountKobo: number) => {
    if (selectedItem) {
      setItems((prev) =>
        prev.map((i) =>
          i.id === selectedItem.id
            ? { ...i, status: 'counter-offer' as const, counterOffer: amountKobo }
            : i
        )
      );
      setSelectedItem((prev) =>
        prev && prev.id === selectedItem.id
          ? { ...prev, status: 'counter-offer' as const, counterOffer: amountKobo }
          : prev
      );
      setIsMobileCounterOfferOpen(false);
      setIsDetailOpen(false);
      message.success('Counter offer sent!');
    }
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
  // RENDER — NO EARLY RETURNS.
  //
  // Z-index stack (mobile):
  //   z-20    — sticky header
  //   z-100   — detail overlay
  //   z-300   — counter offer overlay
  //   z-10000 — UpdateItemModal (handles its own full-screen rendering)
  //   z-20000 — Modal.confirm (accept/reject/delete)
  //
  // All modals always exist in the tree so they can portal to <body>.
  // ════════════════════════════════════════════════════════════════════════

  return (
    <div className={`dark:bg-gray-900/50 ${isMobile ? 'max-w-[100vw] mb-10' : ''}`}>
      {/* ── Main list view ─────────────────────────────────────────────── */}
      {/* Hidden (not unmounted) when mobile detail is showing */}
      <div className={isDetailOpen && isMobile ? 'hidden' : ''}>
        <div className={`w-full ${!isMobile ? 'max-w-7xl mx-auto px-4' : 'px-3'}`}>
          {/* Header */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-20 bg-white dark:bg-gray-900 pb-2"
          >
            <div className="flex items-center justify-between py-4">
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">My Products</h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  {filteredItems.length} product{filteredItems.length !== 1 ? 's' : ''}
                </p>
              </div>
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

            <div
              className={`flex ${isMobile ? 'flex-col items-start gap-1' : 'items-center gap-2'}`}
            >
              <div className="relative mb-3 flex-1 w-full">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                  type="text"
                  placeholder="Search your products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full ${
                    isMobile ? 'h-10' : 'h-12'
                  } pl-10 pr-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all`}
                />
              </div>

              <div className={`flex w-full items-center gap-2 mb-3 ${isMobile ? 'flex-wrap' : ''}`}>
                <Select
                  allowClear
                  placeholder="Sell Type"
                  value={filterSellType}
                  onChange={(val) => setFilterSellType(val || null)}
                  options={sellTypeOptions}
                  className={`${
                    isMobile ? 'flex-1 min-w-[120px] h-10' : 'w-[160px] h-12'
                  }  [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-200 dark:[&_.ant-select-selector]:!border-gray-700 [&_.ant-select-selector]:!bg-white dark:[&_.ant-select-selector]:!bg-gray-800`}
                  popupClassName="!rounded-lg"
                />
                <Select
                  allowClear
                  placeholder="Status"
                  value={filterStatus}
                  onChange={(val) => setFilterStatus(val || null)}
                  options={statusOptions}
                  className={`${
                    isMobile ? 'flex-1 min-w-[120px] h-10' : 'w-[160px] h-12'
                  } [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-200 dark:[&_.ant-select-selector]:!border-gray-700 [&_.ant-select-selector]:!bg-white dark:[&_.ant-select-selector]:!bg-gray-800`}
                  popupClassName="!rounded-lg"
                />
                <Select
                  allowClear
                  placeholder="Condition"
                  value={filterCondition}
                  onChange={(val) => setFilterCondition(val || null)}
                  options={conditionOptions}
                  className={`${
                    isMobile ? 'flex-1 min-w-[120px] h-10' : 'w-[160px] h-12'
                  } [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-200 dark:[&_.ant-select-selector]:!border-gray-700 [&_.ant-select-selector]:!bg-white dark:[&_.ant-select-selector]:!bg-gray-800`}
                  popupClassName="!rounded-lg"
                />

                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="flex items-center gap-1 px-3 h-9 text-xs font-medium text-gray-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-gray-200 dark:border-gray-700 transition-colors"
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
            {isLoading ? (
              isMobile ? (
                <div className="space-y-3">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="bg-white dark:bg-gray-800 rounded-2xl h-28 animate-pulse"
                    />
                  ))}
                </div>
              ) : (
                <TableSkeleton />
              )
            ) : (
              <MarketItemsTable
                items={filteredItems}
                onView={handleViewItem}
                onEdit={handleEditItem}
                onDelete={handleDeleteItem}
                onPayFee={handlePayFee}
                onAcceptOffer={handleAcceptOffer}
                onRejectOffer={handleRejectOffer}
                onCounterOffer={handleCounterOffer}
                isLoading={isLoading}
              />
            )}
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE DETAIL — fixed overlay at z-[100]                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AnimatePresence>
        {isDetailOpen && selectedItem && isMobile && (
          <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[100] bg-gray-50 dark:bg-gray-900 overflow-y-auto"
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

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MOBILE COUNTER OFFER — full-screen overlay at z-[300]            */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isMobile && selectedItem && (
        <MobileOverlay
          open={isMobileCounterOfferOpen}
          onClose={() => setIsMobileCounterOfferOpen(false)}
          title="Counter Offer"
          zIndex={300}
        >
          <CounterOfferView item={selectedItem} onSubmit={handleMobileCounterOfferSubmit} />
        </MobileOverlay>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* DESKTOP DETAIL MODAL                                             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
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

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ALL MODALS — always in the tree, never gated by early return     */}
      {/* ══════════════════════════════════════════════════════════════════ */}

      {/* Sell Item Modal */}
      <SellItemModal
        isSellItemModalOpen={isSellItemModalOpen}
        setIsSellItemModalOpen={setIsSellItemModalOpen}
        handleTrackStatus={handleTrackStatus}
      />

      {/* Update Item Modal — handles mobile/desktop rendering internally */}
      {selectedItem && (
        <UpdateItemModal
          isModalOpen={isUpdateModalOpen}
          onClose={handleCloseEdit}
          initialData={{
            productId: selectedItem.id,
            itemName: selectedItem.itemName,
            condition: selectedItem.condition,
            description: selectedItem.description,
            location: selectedItem.location,
            askPrice: (selectedItem.askingPrice?.price ?? 0) / 100,
            negotiable: selectedItem.askingPrice?.negotiable,
            images: selectedItem.postImgUrls || [],
          }}
          handleTrackStatus={handleTrackStatus}
        />
      )}

      {/* Delete Confirm Modal — confirmations stay as modals */}
      {selectedItem && (
        <DeleteConfirmModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          onConfirm={handleConfirmDelete}
          itemData={selectedItem}
        />
      )}

      {/* Counter Offer Modal (desktop only) */}
      <Modal
        open={isCounterOfferModalOpen}
        onCancel={() => setIsCounterOfferModalOpen(false)}
        title={
          <div>
            <h3 className="text-lg font-bold">Counter Offer</h3>
            <p className="text-xs text-gray-400 font-normal mt-1">
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
            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 block mb-2">
              Your Counter Price (₦)
            </label>
            <InputNumber
              className="w-full h-14 !rounded-xl"
              size="large"
              controls={false}
              prefix={<span className="text-gray-400">₦</span>}
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
              className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmitCounterOffer}
              disabled={counterOfferAmount <= 0}
              className={`flex-1 py-3 text-sm font-semibold rounded-xl transition-all ${
                counterOfferAmount > 0
                  ? 'bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-md hover:shadow-lg'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              Send Counter Offer
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SellItem;
