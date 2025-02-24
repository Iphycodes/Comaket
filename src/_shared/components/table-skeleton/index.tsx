import React from 'react';
import { Skeleton } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

interface TableSkeletonProps {
  rows?: number;
  columns?: number;
  className?: string;
}

const TableSkeleton: React.FC<TableSkeletonProps> = ({ rows = 5, columns = 4, className = '' }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  return (
    <div
      className={`w-full overflow-hidden bg-white dark:bg-gray-800 rounded-lg shadow ${className}`}
    >
      {/* Table header skeleton */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div
          className={`grid ${
            isMobile ? 'grid-cols-2' : `grid-cols-${Math.min(columns, 6)}`
          } gap-4 p-4`}
        >
          {Array(isMobile ? Math.min(columns, 2) : Math.min(columns, 6))
            .fill(0)
            .map((_, idx) => (
              <Skeleton.Button
                key={`header-${idx}`}
                active
                size={isMobile ? 'small' : 'default'}
                style={{
                  width: isMobile ? '100%' : idx === 0 ? '70%' : '100%',
                  height: isMobile ? 24 : 32,
                }}
                className="rounded"
              />
            ))}
        </div>
      </div>

      {/* Table body skeleton */}
      {Array(rows)
        .fill(0)
        .map((_, rowIdx) => (
          <div
            key={`row-${rowIdx}`}
            className={`border-b border-gray-100 dark:border-gray-700 ${
              rowIdx % 2 === 0 ? 'bg-gray-50 dark:bg-gray-900/20' : 'bg-white dark:bg-gray-800'
            }`}
          >
            <div
              className={`grid ${
                isMobile ? 'grid-cols-2' : `grid-cols-${Math.min(columns, 6)}`
              } gap-4 p-4`}
            >
              {Array(isMobile ? Math.min(columns, 2) : Math.min(columns, 6))
                .fill(0)
                .map((_, colIdx) => (
                  <Skeleton.Button
                    key={`cell-${rowIdx}-${colIdx}`}
                    active
                    size={isMobile ? 'small' : 'default'}
                    style={{
                      width: '100%',
                      height: isMobile ? 20 : 28,
                    }}
                    className="rounded"
                  />
                ))}
            </div>
          </div>
        ))}

      {/* Mobile view - pagination skeleton */}
      {isMobile && (
        <div className="p-4 flex justify-center">
          <Skeleton.Button
            active
            size="small"
            style={{ width: 150, height: 32 }}
            className="rounded"
          />
        </div>
      )}

      {/* Desktop view - pagination skeleton */}
      {!isMobile && (
        <div className="p-4 flex justify-between items-center">
          <Skeleton.Button active style={{ width: 100, height: 32 }} className="rounded" />
          <div className="flex space-x-2">
            {Array(5)
              .fill(0)
              .map((_, idx) => (
                <Skeleton.Button
                  key={`pagination-${idx}`}
                  active
                  style={{ width: 36, height: 36 }}
                  className="rounded-full"
                />
              ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TableSkeleton;
