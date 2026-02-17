'use client';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
import SellItem from '@grc/components/apps/sell-item';
import React, { useContext } from 'react';

interface SellItemPageProps {}

const SellItemPage = ({}: SellItemPageProps) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { setIsSellItemModalOpen } = useContext(AppContext);
  if (isMobile) {
    setIsSellItemModalOpen(true);
  }
  return <SellItem />;
};

export default SellItemPage;
