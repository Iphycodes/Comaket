'use client';

// /(ui)/(apps)/checkout/page.tsx
import dynamic from 'next/dynamic';

const Checkout = dynamic(() => import('@grc/components/apps/checkout'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <p className="text-gray-400">Loading checkout...</p>
    </div>
  ),
});

export default function CheckoutPage() {
  return <Checkout />;
}
