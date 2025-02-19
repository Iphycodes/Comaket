'use client';
import React, { useEffect, useState } from 'react';
import { Skeleton, Tag, Avatar, Modal, message } from 'antd';
import { motion } from 'framer-motion';
import { Search, Grid, List, MapPin, MessageCircle, Share2, X } from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { mockMarketItems } from '@grc/_shared/constant';
import ModernItemPost from '@grc/components/apps/item-post-new';

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

const VendorPage = ({ params }: { params: { id: string } }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState(searchParams?.get('view') || 'grid');
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    console.log('Vendor ID:', params.id);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [params.id]);

  const handleViewChange = (view: string) => {
    setViewType(view);
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set('view', view);
    router.push(`/vendor/${params.id}?${newParams.toString()}`, { scroll: false });
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: mockVendorData.name,
          text: mockVendorData.description,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        message.success('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
      message.error('Failed to share');
    }
  };

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

  //   const renderProductGrid = () => (
  //     <motion.div
  //       variants={containerVariants}
  //       initial="hidden"
  //       animate="visible"
  //       className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
  //     >
  //       {mockMarketItems.map((item, idx) => (
  //         <motion.div
  //           key={idx}
  //           variants={itemVariants}
  //           className="aspect-square rounded-lg overflow-hidden cursor-pointer"
  //           onClick={() => handleImageClick(item)}
  //         >
  //           <img
  //             src={item?.postImgUrls[0]}
  //             alt={item?.itemName}
  //             className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
  //           />
  //         </motion.div>
  //       ))}
  //     </motion.div>
  //   );
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
    </motion.div>
  );

  return (
    <div className="min-h-screen dark:bg-gray-900/50">
      <div className="w-full max-w-7xl mx-auto px-4">
        {isLoading ? (
          <div className="space-y-6 py-8">
            <Skeleton active avatar paragraph={{ rows: 4 }} />
          </div>
        ) : (
          <>
            {/* Vendor Header */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="py-8"
            >
              <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm">
                <div className="flex flex-col md:flex-row gap-6">
                  <Avatar src={mockVendorData.avatar} size={120} />
                  <div className="flex-1">
                    <div className="flex gap-4 items-center mb-2">
                      <h1 className="text-2xl font-bold dark:text-white">{mockVendorData.name}</h1>
                      <div className="flex gap-2">
                        <button
                          onClick={handleChat}
                          className="flex items-center gap-2 px-4 py-2 bg-blue hover:bg-blue text-white rounded-lg transition-colors"
                        >
                          <MessageCircle size={20} />
                          Chat with Vendor
                        </button>
                        <button
                          onClick={handleShare}
                          className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                          title="Share Profile"
                        >
                          <Share2 size={20} className="text-gray-600 dark:text-gray-300" />
                        </button>
                      </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-300 mb-4 max-w-[500px]">
                      {mockVendorData.description}
                    </p>
                    <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400 mb-4">
                      <MapPin size={16} />
                      {mockVendorData.address}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {mockVendorData.categories.map((category) => (
                        <Tag key={category} color="blue">
                          {category}
                        </Tag>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-2 md:text-right">
                    <div className="text-2xl font-bold dark:text-white">
                      {mockVendorData.rating}
                      <span className="text-sm text-gray-500 dark:text-gray-400"> / 5.0</span>
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      {mockVendorData.totalSales} likes
                    </div>
                    <div className="text-gray-500 dark:text-gray-400">
                      Member since {mockVendorData.joinedDate}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Products Section */}
            <div className="mb-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold dark:text-white">Products</h2>
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

              {/* Search Bar */}
              <div className="mb-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full px-4 py-2 pl-10 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Search
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                </div>
              </div>

              {/* Products Grid/List View */}
              {viewType === 'grid' ? renderProductGrid() : renderProductList()}
            </div>
          </>
        )}

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

export default VendorPage;
