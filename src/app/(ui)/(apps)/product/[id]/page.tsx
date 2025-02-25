import Product from '@grc/components/apps/product';
import React from 'react';

const ProductPage = ({ params }: { params: { id: string } }) => {
  return <Product productId={params?.id} />;
};

export default ProductPage;
