'use client';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, SlidersHorizontal } from 'lucide-react';
import { mockMarketItems } from '@grc/_shared/constant';
import { mockMarketItemType } from '@grc/_shared/namespace';
import MarketItemsTable from './libs/market-item-table';
import SearchBar from '../market/lib/search-bar';
import FilterPanel from '../market/lib/filter-panel';
import SellItemModal from '../sell-item-modal';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import ItemDetailModal from '../item-detail-modal';
import UpdateItemModal from '../update-item-modal';
import DeleteConfirmModal from '../delete-confirm-modal';
import TableSkeleton from '../../../_shared/components/table-skeleton';

const SellItem = () => {
  // const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  // const [viewType, setViewType] = useState(searchParams?.get('view') || 'list');
  const [selectedItem, setSelectedItem] = useState<Partial<mockMarketItemType>>({});
  const [isItemModalOpen, setIsItemModalOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [isSellItemModalOpen, setIsSellItemModalOpen] = useState(false);
  const [isUpdateItemModalOpen, setIsUpdateItemModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const isMobile = useMediaQuery(mediaSize.mobile);

  useEffect(() => {
    // console.log('Vendor ID:', params.id);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewItem = (item: Partial<mockMarketItemType>) => {
    setSelectedItem(item);
    setIsItemModalOpen(true);
  };

  const handleEditItem = (item: Partial<mockMarketItemType>) => {
    setSelectedItem(item);
    setIsUpdateItemModalOpen(true);
  };

  const handleDeleteItem = (item: Partial<mockMarketItemType>) => {
    setSelectedItem(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (itemId: any) => {
    console.log('delete this item', itemId);
  };

  const handleTrackStatus = (id: string | number) => {
    const itemToTrack = mockMarketItems?.find((item) => item?.id?.toString() === id?.toString());
    if (itemToTrack) {
      handleViewItem(itemToTrack);
    }
  };

  // const handleShare = async () => {
  //   const shareUrl = window.location.href;
  //   try {
  //     if (navigator.share) {
  //       await navigator.share({
  //         title: mockVendorData.name,
  //         text: mockVendorData.description,
  //         url: shareUrl,
  //       });
  //     } else {
  //       await navigator.clipboard.writeText(shareUrl);
  //       message.success('Link copied to clipboard!');
  //     }
  //   } catch (error) {
  //     console.error('Error sharing:', error);
  //     message.error('Failed to share');
  //   }
  // };

  const renderProductList = () => {
    return (
      <div>
        {isLoading ? (
          <TableSkeleton />
        ) : (
          <MarketItemsTable
            items={mockMarketItems}
            onEdit={handleEditItem}
            onDelete={handleDeleteItem}
            onView={handleViewItem}
            isLoading={isLoading}
          />
        )}
      </div>
    );
  };

  return (
    <div className={` dark:bg-gray-900/50 ${isMobile ? 'max-w-100vw' : ''}`}>
      <div className={`w-full ${!isMobile ? 'max-w-7xl mx-auto px-4' : 'max-w-100vw px-2'}`}>
        {/* Vendor Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="py-0 sticky top-5 z-20"
        >
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 px-0">
            <div className="flex justify-end">
              <motion.button
                whileHover={{ scale: 1.02 }}
                onClick={() => setIsSellItemModalOpen(true)}
                whileTap={{ scale: 0.98 }}
                className="text-lg bg-gradient-to-r from-blue to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white py-3 px-6 rounded-lg font-medium flex items-center justify-center gap-1 shadow-sm"
              >
                <Plus size={20} />
                New Product
              </motion.button>
            </div>
          </div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white">My Products</h2>
            {/* <div className="flex items-center gap-4">
              <button
                onClick={() => handleViewChange('grid')}
                className={`flex items-center gap-2 ${
                  viewType === 'grid' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <Grid size={20} />
                Grid
              </button>
              <button
                onClick={() => handleViewChange('list')}
                className={`flex items-center gap-2 ${
                  viewType === 'list' ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400'
                }`}
              >
                <List size={20} />
                List
              </button>
            </div> */}
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-white dark:bg-gray-900/80 shadow-sm"
            >
              <div className="mb-4 py-4">
                <SearchBar
                  section="sell-item"
                  onSearch={(value, category) => {
                    // Your search handling logic
                    console.log(value, category);
                  }}
                />
                <div className="flex items-center gap-2 mt-5 mb-1">
                  <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
                  >
                    <SlidersHorizontal size={16} />
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                  </button>
                </div>

                <AnimatePresence>
                  {showFilters && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <FilterPanel />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </motion.div>
        <div className="mb-0">{renderProductList()}</div>

        <SellItemModal
          isSellItemModalOpen={isSellItemModalOpen}
          setIsSellItemModalOpen={setIsSellItemModalOpen}
          handleTrackStatus={handleTrackStatus}
        />

        <UpdateItemModal
          isModalOpen={isUpdateItemModalOpen}
          onClose={() => setIsUpdateItemModalOpen(false)}
          initialData={{
            productId: selectedItem?.id ?? '',
            itemName: selectedItem?.itemName ?? '',
            condition: selectedItem?.condition ?? 'fairly-used',
            description: selectedItem?.description ?? '',
            location: selectedItem?.location ?? '',
            askPrice: (selectedItem?.askingPrice?.price ?? 0) / 100,
            negotiable: selectedItem?.askingPrice?.negotiable,
          }}
          handleTrackStatus={handleTrackStatus}
        />

        {selectedItem && (
          <DeleteConfirmModal
            isOpen={isDeleteModalOpen}
            onClose={() => setIsDeleteModalOpen(false)}
            onConfirm={handleConfirmDelete}
            itemData={selectedItem}
          />
        )}

        {selectedItem && (
          <ItemDetailModal
            open={isItemModalOpen}
            onClose={() => setIsItemModalOpen(false)}
            item={{
              description: selectedItem?.description ?? '',
              sponsored: selectedItem?.sponsored ?? false,
              postUserProfile: selectedItem?.postUserProfile ?? {},
              postImgurls: selectedItem?.postImgUrls ?? [],
              askingPrice: selectedItem?.askingPrice ?? {},
              condition: selectedItem?.condition ?? 'Fairly Used',
              comments: selectedItem?.comments ?? [],
              itemName: selectedItem?.itemName ?? '',
              status: selectedItem.status ?? 'pending',
              platformFee: selectedItem.fee ?? 0,
              live: selectedItem.live ?? false,
              feePaymentStatus: selectedItem.feePaymentStatus ?? 'awaiting approval',
            }}
            isSellerView={true}
          />
        )}
      </div>
    </div>
  );
};

export default SellItem;
