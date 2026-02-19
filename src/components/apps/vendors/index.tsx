'use client';

import React, { useState, useMemo } from 'react';
import { Select } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  MapPin,
  Star,
  Package,
  ChevronRight,
  Zap,
  X,
  Users,
  ArrowUpDown,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { Vendor } from '@grc/_shared/namespace/vendor';
import { mockVendors } from '@grc/_shared/constant';
import { allVendorCategories, allVendorLocations } from '@grc/_shared/helpers';

// ─── Twitter-style Verified Badge ─────────────────────────────────────────────

const VerifiedBadge: React.FC<{ isSuper?: boolean; size?: number }> = ({
  isSuper = false,
  // size = 16,
}) => {
  const fill = isSuper ? '#D4A017' : '#1D9BF0';

  return (
    <i
      className={`ri-verified-badge-fill ${isSuper ? 'text-[#D4A017]' : 'text-[#1D9BF0]'} `}
      color={fill}
    ></i>
  );
};

// ─── Sort options ─────────────────────────────────────────────────────────────

type SortOption = 'rating' | 'products' | 'newest' | 'reviews';

const sortOptions: { label: string; value: SortOption }[] = [
  { label: 'Highest Rated', value: 'rating' },
  { label: 'Most Products', value: 'products' },
  { label: 'Most Reviews', value: 'reviews' },
  { label: 'Newest', value: 'newest' },
];

const sortVendors = (vendors: Vendor[], sort: SortOption): Vendor[] => {
  return [...vendors].sort((a, b) => {
    switch (sort) {
      case 'rating':
        return b.rating - a.rating;
      case 'products':
        return b.productCount - a.productCount;
      case 'reviews':
        return b.reviewCount - a.reviewCount;
      case 'newest':
        return new Date(b.joinedDate).getTime() - new Date(a.joinedDate).getTime();
      default:
        return 0;
    }
  });
};

// ─── Vendor Card ──────────────────────────────────────────────────────────────

const VendorCard: React.FC<{
  vendor: Vendor;
  onSelect: (id: string) => void;
  index: number;
}> = ({ vendor, onSelect, index }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => onSelect(vendor.id)}
      className="group bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/60 p-4 cursor-pointer hover:border-blue dark:hover:border-blue hover:shadow-md transition-all duration-200"
    >
      {/* Top row: avatar + name + verified */}
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0">
          <img
            src={vendor.profilePicUrl}
            alt={vendor.businessName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {vendor.businessName}
            </h3>
            {vendor.isVerified && <VerifiedBadge isSuper={vendor.isSuperVerified} size={16} />}
          </div>
          <div className="flex items-center gap-1 text-xs text-gray-400 mt-0.5">
            <MapPin size={11} />
            <span>{vendor.location}</span>
          </div>
        </div>
        <ChevronRight
          size={16}
          className="text-gray-300 dark:text-gray-600 group-hover:text-blue transition-colors flex-shrink-0"
        />
      </div>

      {/* Rating + stats row */}
      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50">
        {/* Rating */}
        <div className="flex items-center gap-1">
          <Star size={13} className="text-amber-400 fill-amber-400" />
          <span className="text-sm font-bold text-gray-900 dark:text-white">{vendor.rating}</span>
          <span className="text-[11px] text-gray-400">({vendor.reviewCount})</span>
        </div>

        <span className="w-px h-3.5 bg-gray-200 dark:bg-gray-700" />

        {/* Products */}
        <div className="flex items-center gap-1">
          <Package size={12} className="text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {vendor.productCount} <span className="text-gray-400">items</span>
          </span>
        </div>

        {vendor.stats && vendor.stats.responseRate >= 80 && (
          <>
            <span className="w-px h-3.5 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-emerald-500" />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {vendor.stats.responseRate}%
              </span>
            </div>
          </>
        )}
      </div>

      {/* Categories */}
      {vendor.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {vendor.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 bg-gray-50 dark:bg-gray-700/50 rounded text-[11px] text-gray-500 dark:text-gray-400"
            >
              {cat}
            </span>
          ))}
          {vendor.categories.length > 3 && (
            <span className="text-[11px] text-gray-400">+{vendor.categories.length - 3}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Vendors Page ────────────────────────────────────────────────────────

interface Props {
  onSelectVendor: (vendorId: string) => void;
}

const Vendors: React.FC<Props> = ({ onSelectVendor }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState<string | null>(null);
  const [filterLocation, setFilterLocation] = useState<string | null>(null);
  const [filterVerified, setFilterVerified] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<SortOption>('rating');

  const hasActiveFilters = filterCategory || filterLocation || filterVerified;

  const clearAllFilters = () => {
    setFilterCategory(null);
    setFilterLocation(null);
    setFilterVerified(false);
  };

  const filteredVendors = useMemo(() => {
    let results = mockVendors;

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (v) =>
          v.businessName.toLowerCase().includes(q) ||
          v.name.toLowerCase().includes(q) ||
          v.description.toLowerCase().includes(q) ||
          v.categories.some((c) => c.toLowerCase().includes(q))
      );
    }

    if (filterCategory) {
      results = results.filter((v) => v.categories.includes(filterCategory));
    }

    if (filterLocation) {
      results = results.filter((v) => v.location === filterLocation);
    }

    if (filterVerified) {
      results = results.filter((v) => v.isVerified);
    }

    return sortVendors(results, sortBy);
  }, [searchQuery, filterCategory, filterLocation, filterVerified, sortBy]);

  return (
    <div className={`dark:bg-gray-900/50 h-screen min-h-screen ${isMobile ? 'max-w-[100vw]' : ''}`}>
      <div className={`w-full ${!isMobile ? 'max-w-7xl mx-auto px-4' : 'px-3'}`}>
        {/* ── Header ──────────────────────────────────────────────────────── */}

        <div
          className={`flex sticky top-0 items-center justify-between mb-6 bg-background py-4 border-b border-b-neutral-200 z-10 ${
            isMobile ? 'pt-10' : ''
          }`}
        >
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="w-full"
          >
            <div className="mb-4">
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <Users size={22} className="text-blue" />
                    Vendors
                  </h1>
                  <p className="text-xs text-gray-400 mt-1">
                    {filteredVendors.length} vendor{filteredVendors.length !== 1 ? 's' : ''} ·
                    Browse trusted sellers on Comaket
                  </p>
                </div>
              </div>
            </div>

            {/* Search */}

            <div className="relative flex mb-3 !w-full">
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Search vendors by name, category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="!w-full h-11 pl-10 pr-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
              />
            </div>

            {/* Filters */}
            <div className={`flex w-full items-center gap-2 mb-3 ${isMobile ? 'flex-wrap' : ''}`}>
              <Select
                allowClear
                placeholder="Category"
                value={filterCategory}
                onChange={(val) => setFilterCategory(val || null)}
                options={allVendorCategories.map((c) => ({ label: c, value: c }))}
                className={`${
                  isMobile ? 'flex-1 min-w-[120px]' : 'w-[150px]'
                } h-9 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-200 dark:[&_.ant-select-selector]:!border-gray-700 [&_.ant-select-selector]:!bg-white dark:[&_.ant-select-selector]:!bg-gray-800`}
              />
              <Select
                allowClear
                placeholder="Location"
                value={filterLocation}
                onChange={(val) => setFilterLocation(val || null)}
                options={allVendorLocations.map((l) => ({ label: l, value: l }))}
                className={`${
                  isMobile ? 'flex-1 min-w-[120px]' : 'w-[170px]'
                } h-9 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-200 dark:[&_.ant-select-selector]:!border-gray-700 [&_.ant-select-selector]:!bg-white dark:[&_.ant-select-selector]:!bg-gray-800`}
              />

              {/* Verified toggle */}
              <button
                onClick={() => setFilterVerified(!filterVerified)}
                className={`flex items-center gap-1.5 px-3 h-9 text-xs font-medium rounded-lg border transition-all ${
                  filterVerified
                    ? 'bg-blue-50 dark:bg-blue-900/20 border-blue dark:border-blue text-blue dark:text-blue'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-500 hover:border-gray-300'
                }`}
              >
                <VerifiedBadge size={13} />
                Verified
              </button>

              {/* Sort */}
              {!isMobile && (
                <div className="ml-auto flex items-center gap-1.5">
                  <ArrowUpDown size={13} className="text-gray-400" />
                  <Select
                    value={sortBy}
                    onChange={(val) => setSortBy(val)}
                    options={sortOptions}
                    className="w-[150px] h-9 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-gray-200 dark:[&_.ant-select-selector]:!border-gray-700 [&_.ant-select-selector]:!bg-white dark:[&_.ant-select-selector]:!bg-gray-800"
                  />
                </div>
              )}

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
          </motion.div>
        </div>

        {/* ── Vendor Grid ─────────────────────────────────────────────────── */}
        <div className="pb-10">
          <AnimatePresence mode="wait">
            {filteredVendors.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-3 ${
                  isMobile ? 'grid-cols-1 mb-10' : 'grid-cols-2 lg:grid-cols-3'
                }`}
              >
                {filteredVendors.map((vendor, i) => (
                  <VendorCard key={vendor.id} vendor={vendor} onSelect={onSelectVendor} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <Users size={44} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No vendors found</p>
                <p className="text-xs text-gray-400 mt-1">Try adjusting your search or filters</p>
                {hasActiveFilters && (
                  <button
                    onClick={clearAllFilters}
                    className="mt-4 text-sm text-blue hover:text-blue font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Vendors;
