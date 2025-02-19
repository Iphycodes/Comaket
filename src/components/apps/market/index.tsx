import React, { useContext, useEffect, useState } from 'react';
import { Badge, Col, Row } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { SlidersHorizontal } from 'lucide-react';
import SidePanel from './lib/side-panel';
import FilterPanel from './lib/filter-panel';
import SearchBar from './lib/search-bar';
import { mockMarketItems } from '@grc/_shared/constant';
import ModernItemPost from '../item-post-new';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { Notification } from 'iconsax-react';
import NotificationsDrawer from '../notification-drawer';
import { AppContext } from '@grc/app-context';
import UserDropdown from './lib/user-dropdown';
import ProductListingSkeleton from '../item-post-new/lib/product-listing-skeleton';

const Market = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

  const { setToggleNotificationsDrawer, toggleNotificationsDrawer } = useContext(AppContext);
  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        duration: 0.3,
      },
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

  const isMobile = useMediaQuery(mediaSize.mobile);
  const isDesktop = useMediaQuery(mediaSize.desktop);

  useEffect(() => {
    console.log('toggle:::', toggleNotificationsDrawer);
  }, [toggleNotificationsDrawer]);

  return (
    <div className="min-h-screen dark:bg-gray-900/50 w-full">
      <Row gutter={[isMobile ? 0 : 24, 0]} className="w-full max-w-screen-7xl mx-auto">
        {/* Main Content */}
        <Col lg={isMobile ? 24 : 15} className="relative w-full p-0">
          {/* Enhanced Search and Filter Bar */}
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="sticky top-0 z-20 backdrop-blur-sm bg-white/80 dark:bg-gray-900/80 shadow-sm"
          >
            <div className="p-4">
              <div className="w-full flex items-center justify-between gap-3">
                <div className="flex-1">
                  <SearchBar
                    section="market"
                    onSearch={(value, category) => {
                      // Your search handling logic
                      console.log(value, category);
                    }}
                  />
                </div>

                {isMobile && (
                  <div
                    className="cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      setToggleNotificationsDrawer(false);
                      // console.log('toggle:::', toggleNotificationsDrawer);
                    }}
                  >
                    <Badge count={5} size="small">
                      <Notification variant="Bulk" color="#1e88e5" size={24} />
                    </Badge>
                  </div>
                )}
                {isMobile && <UserDropdown />}
              </div>

              <div className="flex items-center gap-2 mt-3 mb-1">
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

          {/* Items Grid */}
          <div className="px-4 py-6">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i}>
                    <ProductListingSkeleton />
                  </div>
                ))}
              </div>
            ) : (
              <motion.div
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {mockMarketItems?.map((item, idx) => (
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
            )}
          </div>
        </Col>

        {/* Side Panel */}
        {isDesktop && (
          <Col lg={9}>
            <motion.div
              initial={{ x: 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.4 }}
              className="sticky top-0 pt-4"
            >
              <div className="bg-white dark:bg-gray-800 border border-neutral-50 rounded-lg shadow-sm p-4">
                <SidePanel />
              </div>
            </motion.div>
          </Col>
        )}
      </Row>

      <NotificationsDrawer />
    </div>
  );
};

export default Market;
