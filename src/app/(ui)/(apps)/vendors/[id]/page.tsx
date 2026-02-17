'use client';

import React from 'react';
import { useRouter, usePathname } from 'next/navigation';
import VendorDetail from '@grc/components/apps/vendor-details';
import { mockVendors } from '@grc/_shared/constant';

const VendorDetailPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const vendorId = pathname?.split('/')?.[2];

  const vendor = mockVendors.find((v) => v.id === vendorId);

  if (!vendor) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <p className="text-gray-500 text-sm">Vendor not found</p>
        <button
          onClick={() => router.push('/vendors')}
          className="text-sm text-blue-500 hover:text-blue-600 font-medium"
        >
          Back to Vendors
        </button>
      </div>
    );
  }

  return <VendorDetail vendor={vendor} onBack={() => router.back()} />;
};

export default VendorDetailPage;
