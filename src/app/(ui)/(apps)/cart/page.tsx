'use client';
import { AppContext } from '@grc/app-context';
import Cart from '@grc/components/apps/cart';
import { useContext, useEffect } from 'react';

const CartPage = () => {
  const { setIsSellItemModalOpen } = useContext(AppContext);
  useEffect(() => {
    setIsSellItemModalOpen(false);
  }, []);
  return <Cart />;
};

export default CartPage;
