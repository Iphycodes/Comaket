'use client';
import { Suspense } from 'react';
import Checkout from '@grc/components/apps/checkout';

const CheckoutContent = () => {
  return <Checkout />;
};

const CheckoutPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-[80vh] flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-500" />
        </div>
      }
    >
      <CheckoutContent />
    </Suspense>
  );
};

export default CheckoutPage;
