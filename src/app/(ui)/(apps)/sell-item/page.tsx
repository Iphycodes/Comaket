'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const SellItem = dynamic(() => import('@grc/components/apps/sell-item'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-blue border-t-transparent rounded-full animate-spin" />
    </div>
  ),
});

const SellItemPage = () => {
  return <SellItem />;
};

export default SellItemPage;
