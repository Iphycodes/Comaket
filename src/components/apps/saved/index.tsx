'use client';
import React, { useEffect, useState } from 'react';
import { Modal, Input } from 'antd';
import { motion } from 'framer-motion';
import { Search, Grid, List, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { mockMarketItems } from '@grc/_shared/constant';
import ModernItemPost from '@grc/components/apps/item-post-new';
import { useSearch } from '@grc/hooks/useSearch';
import ProductListingSkeleton from '../item-post-new/lib/product-listing-skeleton';

// Mock vendor data - replace with actual data later
const mockVendorData = {
  id: '123456',
  name: 'Tech Haven Store',
  avatar: '/assets/imgs/avatar.jpg',
  description:
    'Your one-stop shop for all premium tech accessories and gadgets. We provide authentic products with warranty.',
  address: 'Silicon Valley, CA',
  categories: ['Electronics', 'Accessories', 'Gadgets', 'Smart Home'],
  rating: 4.8,
  totalSales: 1234,
  joinedDate: '2023',
};

const SavedItems = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState(searchParams?.get('view') || 'list');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const { searchValue, debouncedChangeHandler } = useSearch();

  useEffect(() => {
    // console.log('Vendor ID:', params.id);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewChange = (view: string) => {
    setViewType(view);
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set('view', view);
    router.push(`?${newParams.toString()}`, { scroll: false });
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

  const handleChat = () => {
    // Implement chat functionality
    console.log('Opening chat with vendor:', mockVendorData.id);
    // You can redirect to chat page or open chat modal
    router.push(`/chats?vendor=${mockVendorData.id}`);
  };

  const handleImageClick = (item: any) => {
    setSelectedItem(item);
    setIsModalVisible(true);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  const renderProductGrid = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
    >
      {mockMarketItems.map((item, idx) => (
        <motion.div
          key={idx}
          variants={itemVariants}
          className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
        >
          {/* Image Container with Condition Badge */}
          <div className="relative aspect-square" onClick={() => handleImageClick(item)}>
            <img
              src={item?.postImgUrls?.[0]}
              alt={item?.itemName}
              className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
            />
            <div className="absolute top-2 left-2">
              <span
                className={`
              px-2 py-1 rounded-full text-xs font-medium
              ${
                item?.condition === 'Brand New'
                  ? 'bg-green-500 text-white'
                  : item?.condition === 'Fairly Used'
                    ? 'bg-blue text-white'
                    : 'bg-yellow-500 text-white'
              }
            `}
              >
                {item?.condition}
              </span>
            </div>
            {item?.sponsored && (
              <div className="absolute top-2 right-2">
                <span className="bg-gray-900/70 text-white px-2 py-1 rounded-full text-xs">
                  Sponsored
                </span>
              </div>
            )}
          </div>

          {/* Product Details */}
          <div className="p-3">
            {/* Title and Price Row */}
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-medium text-sm truncate flex-1 dark:text-white">
                {item?.itemName}
              </h3>
              <span className="text-sm font-bold text-green-600 dark:text-green-400 whitespace-nowrap ml-2">
                ${item?.askingPrice?.price}
              </span>
            </div>

            {/* Description and Action Row */}
            <div className="flex justify-between items-center">
              <p className="text-xs text-gray-500 dark:text-gray-400 truncate max-w-[55%]">
                {item?.description}
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleChat();
                }}
                className="text-xs bg-blue hover:bg-blue text-white px-2 py-1 rounded-full flex items-center gap-1 transition-colors"
              >
                {/* <MessageCircle size={12} /> */}
                Chat Seller
              </button>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );

  const renderProductList = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-3xl mx-auto"
    >
      {isLoading ? (
        <div className="space-y-6">
          {[1, 2, 3].map((i) => (
            <div key={i}>
              <ProductListingSkeleton />
            </div>
          ))}
        </div>
      ) : (
        <>
          {mockMarketItems.map((item, idx) => (
            <motion.div
              key={idx}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 rounded-lg transition-all duration-300"
            >
              <ModernItemPost
                postUserProfile={item?.postUserProfile ?? {}}
                sponsored={item?.sponsored ?? false}
                description={item?.description ?? ''}
                postImgurls={item?.postImgUrls ?? []}
                askingPrice={item?.askingPrice ?? {}}
                condition={item?.condition ?? 'Brand New'}
                itemName={item?.itemName ?? ''}
                comments={item?.comments ?? []}
                id={item?.id ?? ''}
              />
            </motion.div>
          ))}
        </>
      )}
    </motion.div>
  );

  return (
    <div className="min-h-screen dark:bg-gray-900/50">
      <div className="w-full max-w-7xl mx-auto px-4">
        <div className="mb-8">
          <div className="py-5 sticky top-0 z-20 backdrop-blur-sm bg-white dark:bg-gray-800">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">My Saved Products</h2>
              <div className="flex items-center gap-4">
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
              </div>
            </div>
            <div className="flex-1 relative">
              <Input
                value={searchValue}
                onChange={(e) => debouncedChangeHandler(e.target.value)}
                placeholder="Search Saved Products..."
                className="h-12 !w-full pl-11 pr-4 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors"
                suffix={
                  searchValue && (
                    <X
                      size={16}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={() => debouncedChangeHandler('')}
                    />
                  )
                }
                style={{ width: '100%' }}
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>
          {viewType === 'grid' ? renderProductGrid() : renderProductList()}
        </div>

        {/* Product Detail Modal */}
        <Modal
          open={isModalVisible}
          onCancel={() => setIsModalVisible(false)}
          footer={null}
          width={800}
          className="product-detail-modal"
          closeIcon={<X className="text-gray-500" />}
        >
          {selectedItem && (
            <ModernItemPost
              postUserProfile={selectedItem?.postUserProfile ?? {}}
              sponsored={selectedItem?.sponsored ?? false}
              description={selectedItem?.description ?? ''}
              postImgurls={selectedItem?.postImgUrls ?? []}
              askingPrice={selectedItem?.askingPrice ?? {}}
              condition={selectedItem?.condition ?? 'Brand New'}
              itemName={selectedItem?.itemName ?? ''}
              comments={selectedItem?.comments ?? []}
              id={selectedItem?.id ?? ''}
            />
          )}
        </Modal>
      </div>
    </div>
  );
};

export default SavedItems;
