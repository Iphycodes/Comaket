import React from 'react';

const CardSkeleton = () => (
  <div className="bg-white dark:bg-neutral-800/60 rounded-xl border border-neutral-100 dark:border-neutral-700/50 p-4 animate-pulse">
    <div className="flex items-center justify-between mb-3">
      <div>
        <div className="h-4 w-28 bg-neutral-200 dark:bg-neutral-700 rounded" />
        <div className="h-3 w-20 bg-neutral-100 dark:bg-neutral-700/50 rounded mt-2" />
      </div>
      <div className="h-6 w-20 bg-neutral-100 dark:bg-neutral-700/50 rounded-full" />
    </div>
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
      <div className="flex-1">
        <div className="h-3 w-40 bg-neutral-100 dark:bg-neutral-700/50 rounded" />
      </div>
      <div className="h-4 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
    </div>
  </div>
);

export default CardSkeleton;
