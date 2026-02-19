'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Eye, ExternalLink } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useRouter } from 'next/navigation';
import { Vendor } from '@grc/_shared/namespace/vendor';
import VendorDetail from '@grc/components/apps/vendor-details';

// ═══════════════════════════════════════════════════════════════════════════
// MOCK VENDOR DATA — TODO: Build from real store data
// ═══════════════════════════════════════════════════════════════════════════

const mockVendor: Vendor = {
  id: 'vs-001',
  name: 'Emmanuel Okafor',
  businessName: 'EmTech Store',
  tagline: 'Your trusted gadget plug 🔌',
  description:
    'We sell authentic gadgets at the best prices in Lagos. Original products only with warranty. Fast delivery across Nigeria.',
  profilePicUrl: '/images/default-avatar.png',
  coverImageUrl: '',
  location: 'Ikeja, Lagos',
  phoneNumber: '2348012345678',
  email: 'emtech@gmail.com',
  rating: 4.8,
  reviewCount: 36,
  productCount: 24,
  followerCount: 158,
  isVerified: true,
  isSuperVerified: false,
  joinedDate: '2024-06-15T00:00:00Z',
  categories: ['Electronics', 'Phones', 'Accessories', 'Laptops'],
  operatingHours: 'Mon-Sat: 9AM - 7PM',
  acceptedPayments: ['Card', 'Transfer', 'Cash'],
  badges: ['Top Seller', 'Fast Shipper'],
  socialLinks: {
    instagram: 'emtech.ng',
    twitter: 'emtechng',
    website: 'https://emtech.ng',
  },
  reviews: [
    {
      id: 'r1',
      buyerName: 'Chidera Nwosu',
      rating: 5,
      comment: 'Amazing product! Fast delivery.',
      productName: 'iPhone 14 Pro Max',
      date: '2025-02-18T10:30:00Z',
    },
    {
      id: 'r2',
      buyerName: 'Amaka Eze',
      rating: 4,
      comment: 'Good quality product.',
      productName: 'Samsung Galaxy S24',
      date: '2025-02-17T15:20:00Z',
    },
    {
      id: 'r3',
      buyerName: 'Tunde Bakare',
      rating: 5,
      comment: 'Best seller on Comaket!',
      date: '2025-02-16T09:00:00Z',
    },
  ],
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface StorePreviewProps {
  storeId: string;
}

const StorePreview: React.FC<StorePreviewProps> = ({ storeId }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const router = useRouter();

  return (
    <div className="space-y-4">
      {/* Preview Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-50 to-cyan-50 dark:from-emerald-900/20 dark:to-cyan-900/20 border border-emerald-200 dark:border-emerald-800/30 rounded-xl p-4 flex items-center gap-3"
      >
        <div className="w-9 h-9 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center flex-shrink-0">
          <Eye size={16} className="text-emerald-600 dark:text-emerald-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">
            Store Preview
          </p>
          <p className="text-[11px] text-emerald-600/70 dark:text-emerald-400/60">
            This is how your store appears to buyers on Comaket
          </p>
        </div>
        {!isMobile && (
          <button
            onClick={() => window.open(`/vendors/${storeId}`, '_blank')}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold transition-colors"
          >
            <ExternalLink size={12} />
            Open Live
          </button>
        )}
      </motion.div>

      {/* VendorDetail Component — reused */}
      <div
        className={`${
          isMobile ? '-mx-4' : ''
        } bg-white dark:bg-gray-900 rounded-2xl overflow-hidden ${
          isMobile ? '' : 'border border-gray-100 dark:border-gray-700/50'
        }`}
      >
        <VendorDetail vendor={mockVendor} onBack={() => router.push(`/my-store/${storeId}`)} />
      </div>
    </div>
  );
};

export default StorePreview;
