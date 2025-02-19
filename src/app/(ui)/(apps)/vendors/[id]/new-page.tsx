'use client';
import React, { useEffect, useState } from 'react';
import { Skeleton, Tag, Avatar } from 'antd';
import { motion } from 'framer-motion';
import { Search, Grid, List, MapPin } from 'lucide-react';
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

  useEffect(() => {
    console.log('Vendor ID:', params.id);
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, [params.id]);

  const handleViewChange = (view: string) => {
    setViewType(view);
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set('view', view);
    // Update URL without reload
    router.push(`/vendor/${params.id}?${newParams.toString()}`, { scroll: false });
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
          className="aspect-square rounded-lg overflow-hidden"
        >
          <img
            src={item?.postImgUrls?.[0]}
            alt={item?.itemName}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </motion.div>
      ))}
    </motion.div>
  );

  const renderProductList = () => (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-3xl mx-auto" // Added max-width and centered
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
                    <h1 className="text-2xl font-bold mb-2 dark:text-white">
                      {mockVendorData.name}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
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
                      {mockVendorData.totalSales} sales
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
      </div>
    </div>
  );
};

export default VendorPage;
