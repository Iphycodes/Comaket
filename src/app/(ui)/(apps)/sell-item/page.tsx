'use client';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import dynamic from 'next/dynamic';
import React, { useContext } from 'react';

const SellItem = dynamic(() => import('@grc/components/apps/sell-item'), { ssr: false });

const SellItemPage = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { setIsSellItemModalOpen } = useContext(AppContext);

  if (isMobile) {
    setIsSellItemModalOpen(true);
  }

  return <SellItem />;
};

export default SellItemPage;
