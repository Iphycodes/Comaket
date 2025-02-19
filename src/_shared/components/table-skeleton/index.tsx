import React from 'react';
import { Skeleton, Space } from 'antd';
import { motion } from 'framer-motion';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

const TableSkeleton = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  // Create an array of 5 items for skeleton rows
  const skeletonRows = Array(2).fill(null);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`overflow-hidden ${isMobile ? 'max-w-[100vw]' : ''}`}
    >
      <div className="overflow-x-auto">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-4">
          {/* Table Header Skeleton */}
          <div className="mb-4 grid grid-cols-8 gap-4 border-b pb-4">
            <Skeleton.Button active size="small" className="h-8" />
            <Skeleton.Button active size="small" className="h-8" />
            <Skeleton.Button active size="small" className="h-8" />
            <Skeleton.Button active size="small" className="h-8" />
            <Skeleton.Button active size="small" className="h-8" />
            <Skeleton.Button active size="small" className="h-8" />
            <Skeleton.Button active size="small" className="h-8" />
            <Skeleton.Button active size="small" className="h-8" />
          </div>

          {/* Table Rows Skeleton */}
          <div className="space-y-4">
            {skeletonRows.map((_, index) => (
              <div key={index} className="grid grid-cols-8 gap-4 py-4 border-b">
                {/* Sponsored Icon Column */}
                <div className="flex items-center">
                  <Skeleton.Button active size="small" className="w-6 h-6" />
                </div>

                {/* Item Column */}
                <div className="flex items-center gap-3 col-span-1">
                  <div className="flex-1">
                    <Skeleton.Button active size="small" className="w-24 mb-2" />
                    {/* <Skeleton.Button active size="small" className="w-32" /> */}
                  </div>
                </div>

                {/* Condition Column */}
                <div className="flex items-center">
                  <Skeleton.Button active size="small" className="w-16" />
                </div>

                {/* Price Column */}
                <div className="flex items-center">
                  <Skeleton.Button active size="small" className="w-20" />
                </div>

                {/* Negotiability Column */}
                <div className="flex items-center">
                  <Skeleton.Button active size="small" className="w-20" />
                </div>

                {/* Engagement Column */}
                <div className="flex items-center gap-2">
                  <Space>
                    <Skeleton.Button active size="small" className="w-8" />
                    <Skeleton.Button active size="small" className="w-8" />
                    <Skeleton.Button active size="small" className="w-8" />
                  </Space>
                </div>

                {/* Status Column */}
                <div className="flex items-center">
                  <Skeleton.Button active size="small" className="w-16" />
                </div>

                {/* Actions Column */}
                <div className="flex items-center gap-2">
                  <Space>
                    <Skeleton.Button active size="small" className="w-8 h-8" />
                    <Skeleton.Button active size="small" className="w-8 h-8" />
                    <Skeleton.Button active size="small" className="w-8 h-8" />
                  </Space>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TableSkeleton;
