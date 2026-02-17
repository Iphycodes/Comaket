'use client';
import Product from '@grc/components/apps/product';
import { mockMarketItems } from '@grc/_shared/constant';
import React, { useState } from 'react';

const ProductPage = ({ params }: { params: { id: string } }) => {
  const [selectedProductId, setSelectedProductId] = useState('');
  const item = mockMarketItems.find((i) => i.id === params?.id) || mockMarketItems[0];

  console.log('selected id::::', selectedProductId);

  return <Product item={item} setSelectedProductId={setSelectedProductId} />;
};

export default ProductPage;
