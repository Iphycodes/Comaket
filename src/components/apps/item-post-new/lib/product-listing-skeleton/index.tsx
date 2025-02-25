import React from 'react';
import { Skeleton } from 'antd';

const ProductListingSkeleton = () => {
  return (
    <div className="w-full bg-white rounded-lg shadow-sm">
      {/* Seller info */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Skeleton.Avatar active size={40} />
          <div className="flex flex-col">
            <Skeleton.Button active size="small" style={{ width: 120 }} />
            {/* <div className="flex items-center gap-2 mt-2">
              <Skeleton.Button active size="small" style={{ width: 80 }} />
            </div> */}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Left section - Product Images */}
        <div className="w-full md:w-1/2">
          <div className="relative aspect-square w-full h-full rounded-lg overflow-hidden">
            <Skeleton.Image active className="!w-[100%] !h-[100%]" />
            {/* <div className="absolute bottom-4 right-4">
              <Skeleton.Button active size="small" style={{ width: 80 }} />
            </div> */}
          </div>
        </div>

        {/* Right section - Product Details */}
        <div className="flex-1 flex flex-col">
          {/* Product info */}
          <div className="mb-6">
            <div className="mb-4">
              <Skeleton.Input active size="large" block style={{ marginBottom: 12 }} />
              {/* <Skeleton.Input active size="large" block style={{ width: '60%' }} /> */}
            </div>
            <Skeleton paragraph={{ rows: 2 }} active />
          </div>

          {/* Stats and actions */}
          <div className="mt-auto">
            {/* <div className="flex justify-between mb-4">
              <div className="flex gap-4">
                <Skeleton.Button active size="small" style={{ width: 60 }} />
                <Skeleton.Button active size="small" style={{ width: 60 }} />
              </div>
              <div className="flex gap-4">
                <Skeleton.Button active size="small" style={{ width: 40 }} />
                <Skeleton.Button active size="small" style={{ width: 40 }} />
              </div>
            </div> */}

            {/* Primary actions */}
            <div className="flex gap-4">
              <Skeleton.Button active block size="large" style={{ height: 48 }} />
              <Skeleton.Button active block size="large" style={{ height: 48 }} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductListingSkeleton;
