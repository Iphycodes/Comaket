'use client';
import Product from '@grc/components/apps/product';
import React, { useState } from 'react';

const ProductPage = ({ params }: { params: { id: string } }) => {
  const [selectedProductId, setSelectedProductId] = useState('');

  console.log(selectedProductId);
  return <Product productId={params?.id} setSelectedProductId={setSelectedProductId} />;
};

export default ProductPage;
