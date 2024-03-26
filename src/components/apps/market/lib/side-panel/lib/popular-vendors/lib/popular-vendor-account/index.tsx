'use client';
import Image from 'next/image';
import React from 'react';

interface Props {
  // Add your prop types here
  vendorProfile: Record<string, any>;
}

const PopularVendorAccount: React.FC<Props> = ({ vendorProfile }) => {
  return (
    <div className="w-full hover:bg-gray-100 cursor-pointer px-1 py-2 flex justify-between items-center">
      <section className="flex gap-3 items-center">
        <Image
          src={vendorProfile?.profilePicUrl ?? ''}
          alt="user-dp"
          width={50}
          height={50}
          style={{ width: '50px', height: '50px' }}
          className="rounded-[50%]"
        />
        <div className="flex flex-col gap-1 justify-center">
          <span className="font-semibold text-[16px]" style={{ lineHeight: '12px' }}>
            {vendorProfile?.businessName ?? vendorProfile?.userName ?? `Business`}{' '}
          </span>
          <span className="post-status text-[14px] font-light">{vendorProfile?.category}</span>
        </div>
      </section>
      <section>
        <span className="cursor-pointer text-blue hover:underline">View</span>
      </section>
    </div>
  );
};

export default PopularVendorAccount;
