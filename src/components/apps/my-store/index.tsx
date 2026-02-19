'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Star,
  Package,
  ChevronRight,
  Zap,
  Plus,
  Store,
  Edit3,
  Trash2,
  MoreVertical,
  Eye,
} from 'lucide-react';
import { Dropdown, message as antMessage } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useRouter } from 'next/navigation';

// ─── Types ──────────────────────────────────────────────────────────────────

interface VendorStore {
  id: string;
  businessName: string;
  profilePicUrl: string;
  location: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  responseRate: number;
  categories: string[];
  isVerified: boolean;
  isSuperVerified: boolean;
  status: 'active' | 'pending' | 'suspended';
  joinedDate: string;
}

// ─── Mock Data ──────────────────────────────────────────────────────────────

const mockUserStores: VendorStore[] = [
  {
    id: 'vs-001',
    businessName: 'EmTech Store',
    profilePicUrl:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
    location: 'Kaduna, Nigeria',
    rating: 4.6,
    reviewCount: 47,
    productCount: 28,
    responseRate: 96,
    categories: ['Electronics', 'Phones', 'Laptops'],
    isVerified: true,
    isSuperVerified: false,
    status: 'active',
    joinedDate: '2023-06-15T00:00:00Z',
  },
  {
    id: 'vs-002',
    businessName: 'Gadget Hub NG',
    profilePicUrl:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop',
    location: 'Lagos, Nigeria',
    rating: 4.3,
    reviewCount: 23,
    productCount: 15,
    responseRate: 88,
    categories: ['Accessories', 'Smart Home', 'Gaming'],
    isVerified: true,
    isSuperVerified: false,
    status: 'active',
    joinedDate: '2024-01-20T00:00:00Z',
  },
  {
    id: 'vs-003',
    businessName: 'PhoneDeals Kaduna',
    profilePicUrl:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
    location: 'Kaduna, Nigeria',
    rating: 0,
    reviewCount: 0,
    productCount: 0,
    responseRate: 0,
    categories: ['Phones'],
    isVerified: false,
    isSuperVerified: false,
    status: 'pending',
    joinedDate: '2025-02-10T00:00:00Z',
  },
];

// ─── Verified Badge ─────────────────────────────────────────────────────────

const VerifiedBadge: React.FC<{ isSuper?: boolean }> = ({ isSuper = false }) => (
  <i
    className={`ri-verified-badge-fill ${
      isSuper ? 'text-[#D4A017]' : 'text-[#1D9BF0]'
    } text-[16px]`}
  />
);

// ─── Status Badge ───────────────────────────────────────────────────────────

const statusConfig: Record<string, { label: string; color: string; bg: string }> = {
  active: {
    label: 'Active',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  pending: {
    label: 'Pending',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  suspended: {
    label: 'Suspended',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
  },
};

// ─── Store Card ─────────────────────────────────────────────────────────────

const StoreCard: React.FC<{
  store: VendorStore;
  onSelect: (id: string) => void;
  index: number;
}> = ({ store, onSelect, index }) => {
  const cfg = statusConfig[store.status];

  const menuItems = [
    {
      key: 'view',
      label: (
        <span className="flex items-center gap-2 text-sm">
          <Eye size={14} /> View Store
        </span>
      ),
      onClick: () => onSelect(store.id),
    },
    {
      key: 'edit',
      label: (
        <span className="flex items-center gap-2 text-sm">
          <Edit3 size={14} /> Edit Store
        </span>
      ),
      onClick: () => antMessage.info('Edit store — coming soon'),
    },
    {
      type: 'divider' as const,
    },
    {
      key: 'delete',
      label: (
        <span className="flex items-center gap-2 text-sm text-red-500">
          <Trash2 size={14} /> Delete Store
        </span>
      ),
      onClick: () => antMessage.info('Delete store — coming soon'),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="group bg-white dark:bg-gray-800/80 rounded-xl border border-gray-200 dark:border-gray-700/60 p-4 cursor-pointer hover:border-blue dark:hover:border-blue hover:shadow-md transition-all duration-200"
    >
      {/* Top row */}
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 dark:bg-gray-700 flex-shrink-0"
          onClick={() => onSelect(store.id)}
        >
          <img
            src={store.profilePicUrl}
            alt={store.businessName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 min-w-0" onClick={() => onSelect(store.id)}>
          <div className="flex items-center gap-1.5">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {store.businessName}
            </h3>
            {store.isVerified && <VerifiedBadge isSuper={store.isSuperVerified} />}
          </div>
          <div className="flex items-center gap-2 mt-0.5">
            <div className="flex items-center gap-1 text-xs text-gray-400">
              <MapPin size={11} />
              <span>{store.location}</span>
            </div>
            <span
              className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${cfg.color} ${cfg.bg}`}
            >
              {cfg.label}
            </span>
          </div>
        </div>

        {/* Actions dropdown */}
        <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
          <button
            onClick={(e) => e.stopPropagation()}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <MoreVertical size={16} className="text-gray-400" />
          </button>
        </Dropdown>
      </div>

      {/* Stats row */}
      <div
        className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700/50"
        onClick={() => onSelect(store.id)}
      >
        {store.rating > 0 && (
          <>
            <div className="flex items-center gap-1">
              <Star size={13} className="text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-gray-900 dark:text-white">
                {store.rating}
              </span>
              <span className="text-[11px] text-gray-400">({store.reviewCount})</span>
            </div>
            <span className="w-px h-3.5 bg-gray-200 dark:bg-gray-700" />
          </>
        )}

        <div className="flex items-center gap-1">
          <Package size={12} className="text-gray-400" />
          <span className="text-xs text-gray-600 dark:text-gray-300">
            {store.productCount} <span className="text-gray-400">items</span>
          </span>
        </div>

        {store.responseRate >= 80 && (
          <>
            <span className="w-px h-3.5 bg-gray-200 dark:bg-gray-700" />
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-emerald-500" />
              <span className="text-xs text-gray-600 dark:text-gray-300">
                {store.responseRate}%
              </span>
            </div>
          </>
        )}

        <ChevronRight
          size={16}
          className="ml-auto text-gray-300 dark:text-gray-600 group-hover:text-blue transition-colors flex-shrink-0"
        />
      </div>

      {/* Categories */}
      {store.categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3" onClick={() => onSelect(store.id)}>
          {store.categories.slice(0, 3).map((cat) => (
            <span
              key={cat}
              className="px-2 py-0.5 bg-gray-50 dark:bg-gray-700/50 rounded text-[11px] text-gray-500 dark:text-gray-400"
            >
              {cat}
            </span>
          ))}
          {store.categories.length > 3 && (
            <span className="text-[11px] text-gray-400">+{store.categories.length - 3}</span>
          )}
        </div>
      )}
    </motion.div>
  );
};

// ─── Main Component ─────────────────────────────────────────────────────────

const MyStore = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const router = useRouter();
  const [stores] = useState<VendorStore[]>(mockUserStores);

  const handleSelectStore = (id: string) => {
    router.push(`/my-store/${id}`);
  };

  const handleCreateStore = () => {
    antMessage.info('Create store — coming soon');
  };

  return (
    <div className={`dark:bg-gray-900/50 min-h-screen ${isMobile ? 'max-w-[100vw]' : ''}`}>
      <div className={`w-full ${!isMobile ? 'max-w-4xl mx-auto px-4' : 'px-3'}`}>
        {/* Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="py-5"
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Store size={22} className="text-purple-500" />
                My Stores
              </h1>
              <p className="text-xs text-gray-400 mt-1">
                {stores.length} store{stores.length !== 1 ? 's' : ''} · Manage your vendor profiles
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreateStore}
              className="bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white py-2.5 px-5 rounded-xl font-semibold flex items-center gap-1.5 text-sm shadow-md shadow-blue/20 hover:shadow-lg transition-all"
            >
              <Plus size={18} />
              {isMobile ? 'New' : 'New Store'}
            </motion.button>
          </div>
        </motion.div>

        {/* Store List */}
        <div className={`pb-10 ${isMobile ? 'mb-10' : ''}`}>
          <AnimatePresence mode="wait">
            {stores.length > 0 ? (
              <motion.div
                key="grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`grid gap-3 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}
              >
                {stores.map((store, i) => (
                  <StoreCard key={store.id} store={store} onSelect={handleSelectStore} index={i} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-20"
              >
                <Store size={48} className="mx-auto text-gray-200 dark:text-gray-700 mb-4" />
                <p className="text-gray-500 dark:text-gray-400 font-medium">No stores yet</p>
                <p className="text-xs text-gray-400 mt-1">
                  Create your first vendor store to start selling on Comaket
                </p>
                <button
                  onClick={handleCreateStore}
                  className="mt-5 inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue/20 hover:shadow-lg transition-all"
                >
                  <Plus size={16} />
                  Create Store
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default MyStore;
