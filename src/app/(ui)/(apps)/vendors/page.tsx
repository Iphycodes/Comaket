'use client';
import React from 'react';
import Vendors from '@grc/components/apps/vendors';
import { useRouter } from 'next/navigation';

const VendorsPage = () => {
  const { push } = useRouter();
  const handleClickVendor = (id: string) => {
    push(`/vendors/${id}`);
  };
  return (
    // <div className="min-h-[90vh] flex items-center bg-neutral-50 dark:bg-gray-900">
    //   <div className="mx-auto my-auto">
    //     <ComingSoon
    //       header={
    //         <div className="pt-6 text-center">
    //           <h1 className="text-3xl font-bold dark:text-white mb-1">Discover Vendors</h1>
    //           <p className="text-gray-600 dark:text-gray-300 mb-2">
    //             Find and connect with trusted vendors in our marketplace
    //           </p>
    //         </div>
    //       }
    //     />
    //   </div>
    // </div>
    <Vendors onSelectVendor={handleClickVendor} />
  );
};
export default VendorsPage;
