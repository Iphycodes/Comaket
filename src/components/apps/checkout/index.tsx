'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  CheckCircle,
  ShoppingCart,
  CreditCard,
  User,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppContext } from '@grc/app-context';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { usePaystackPayment } from 'react-paystack';
import { message } from 'antd';
import { CartItem } from '@grc/_shared/namespace/cart';
import { clearBuyNowItem, getBuyNowItem } from '@grc/_shared/namespace/buy';

// ─── Types ───────────────────────────────────────────────────────────
interface CustomerInfo {
  fullName: string;
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
}

type StepType = 'success' | 'review' | 'info';

// ─── Paystack button sub-component ──────────────────────────────────
const CheckoutContent = ({
  customerInfo,
  checkoutItems,
  checkoutTotal,
  onPaymentSuccess,
}: {
  customerInfo: CustomerInfo;
  checkoutItems: CartItem[];
  checkoutTotal: number;
  onPaymentSuccess: (reference: any) => void;
}) => {
  const config = {
    reference: `CMK-${new Date().getTime().toString()}`,
    email: customerInfo.email,
    amount: checkoutTotal,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    metadata: {
      custom_fields: [
        {
          display_name: 'Customer Name',
          variable_name: 'customer_name',
          value: customerInfo.fullName,
        },
        {
          display_name: 'Phone Number',
          variable_name: 'phone_number',
          value: customerInfo.phone,
        },
        {
          display_name: 'WhatsApp Number',
          variable_name: 'whatsapp_number',
          value: customerInfo.whatsapp,
        },
        {
          display_name: 'Delivery Address',
          variable_name: 'delivery_address',
          value: `${customerInfo.address}, ${customerInfo.city}, ${customerInfo.state}`,
        },
        {
          display_name: 'Items',
          variable_name: 'items',
          value: checkoutItems
            .map(
              (item) => `${item.itemName} x${item.quantity} (${item.sellerName}) - ID: ${item.id}`
            )
            .join(', '),
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const onClose = () => {
    message.info('Payment cancelled. You can try again.');
  };

  const handlePay = () => {
    initializePayment({ onSuccess: onPaymentSuccess, onClose });
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={handlePay}
      className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-2 shadow-lg transition-all text-base"
    >
      <Lock size={18} />
      Pay {numberFormat(checkoutTotal / 100, Currencies.NGN)}
    </motion.button>
  );
};

// ─── Main Checkout ───────────────────────────────────────────────────
const Checkout = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { cartItems, clearCart } = useContext(AppContext);

  const isBuyNow = searchParams?.get('mode') === 'buynow';

  const [buyNowItem, setBuyNowItemState] = useState<CartItem | null>(null);

  useEffect(() => {
    if (isBuyNow) {
      const item = getBuyNowItem();
      setBuyNowItemState(item);
    }
  }, [isBuyNow]);

  // Determine which items we're checking out
  const checkoutItems: CartItem[] = useMemo(() => {
    if (isBuyNow && buyNowItem) {
      return [buyNowItem];
    }
    return cartItems;
  }, [isBuyNow, buyNowItem, cartItems]);

  const checkoutTotal = useMemo(() => {
    return checkoutItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [checkoutItems]);

  const checkoutCount = useMemo(() => {
    return checkoutItems.reduce((count, item) => count + item.quantity, 0);
  }, [checkoutItems]);

  // Group items by seller for display
  const itemsBySeller = useMemo(() => {
    const grouped: Record<string, CartItem[]> = {};
    checkoutItems.forEach((item) => {
      const seller = item.sellerName || 'Unknown Seller';
      if (!grouped[seller]) grouped[seller] = [];
      grouped[seller].push(item);
    });
    return grouped;
  }, [checkoutItems]);

  const [step, setStep] = useState<StepType>('info');
  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    whatsapp: '',
    address: '',
    city: '',
    state: '',
  });
  const [paymentReference, setPaymentReference] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo((prev) => ({ ...prev, [name]: value }));
  };

  const isInfoValid = () => {
    return (
      customerInfo.fullName.trim() !== '' &&
      customerInfo.email.trim() !== '' &&
      customerInfo.phone.trim() !== '' &&
      customerInfo.whatsapp.trim() !== '' &&
      customerInfo.address.trim() !== '' &&
      customerInfo.city.trim() !== '' &&
      customerInfo.state.trim() !== ''
    );
  };

  const handlePaymentSuccess = (reference: any) => {
    setPaymentReference(reference?.reference || reference?.trxref || '');
    setStep('success');
    if (!isBuyNow) {
      clearCart();
    }
    clearBuyNowItem();
    message.success('Payment successful!');
  };

  const handleBack = () => {
    if (step === 'review') {
      setStep('info');
    } else {
      clearBuyNowItem();
      if (isBuyNow) {
        router.back();
      } else {
        router.push('/cart');
      }
    }
  };

  const isEmpty = checkoutItems.length === 0 && step !== 'success';

  // ─── Empty state ──────────────────────────────────────────────────
  if (isEmpty) {
    return (
      <div
        className={`min-h-[80vh] flex flex-col items-center justify-center ${
          isMobile ? 'px-4' : ''
        }`}
      >
        <ShoppingCart size={80} className="text-gray-300 dark:text-gray-600 mb-4" strokeWidth={1} />
        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
          {isBuyNow ? 'No item selected' : 'Your cart is empty'}
        </h3>
        <p className="text-gray-500 dark:text-gray-400 mb-6">
          {isBuyNow
            ? 'The item you tried to buy is no longer available.'
            : 'Add items to your cart first'}
        </p>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/')}
          className="bg-gradient-to-r from-blue to-indigo-600 text-white px-6 py-3 rounded-lg font-medium"
        >
          Browse Marketplace
        </motion.button>
      </div>
    );
  }

  // ─── Success state ────────────────────────────────────────────────
  if (step === 'success') {
    return (
      <div
        className={`min-h-[80vh] flex flex-col items-center justify-center ${
          isMobile ? 'px-4' : ''
        }`}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15 }}
          className="mb-6"
        >
          <div className="w-24 h-24 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
            <CheckCircle size={48} className="text-green-500" />
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-center"
        >
          <h2 className="text-2xl font-bold dark:text-white mb-2">Payment Successful!</h2>
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            Your order has been placed successfully.
          </p>
          {paymentReference && (
            <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">
              Reference: <span className="font-mono font-medium">{paymentReference}</span>
            </p>
          )}
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-8 max-w-md">
            Thank you for shopping on Comaket! A confirmation will be sent to{' '}
            <strong>{customerInfo.email}</strong>. The respective sellers will be notified and will
            reach out regarding delivery via your email, WhatsApp or phone number.
          </p>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => router.push('/')}
            className="bg-gradient-to-r from-blue to-indigo-600 text-white px-8 py-3 rounded-lg font-medium"
          >
            Continue Shopping
          </motion.button>
        </motion.div>
      </div>
    );
  }

  // ─── Main checkout flow ───────────────────────────────────────────
  return (
    <div className={`min-h-screen ${isMobile ? 'px-3 pb-24' : 'py-6'}`}>
      {/* Header */}
      <div
        className={`sticky w-full top-0 items-center justify-between mb-6 bg-background py-4 border-b border-b-neutral-200 z-10 ${
          isMobile ? 'pt-10' : ''
        }`}
      >
        <div className="flex items-center gap-3 mb-6">
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={handleBack}
            className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft size={20} />
          </motion.button>

          <div>
            <h1 className="text-lg font-bold dark:text-white">Checkout</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {step === 'info' ? 'Step 1: Your Information' : 'Step 2: Review & Pay'}
            </p>
          </div>
        </div>
        {/* Step indicator */}
        <div className="flex items-center gap-2">
          <div
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              step === 'info' || step === 'review'
                ? 'bg-indigo-500'
                : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
          <div
            className={`flex-1 h-1.5 rounded-full transition-colors ${
              step === 'review' ? 'bg-indigo-500' : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        </div>
      </div>

      <div className={`flex ${isMobile ? 'flex-col' : 'gap-8'}`}>
        {/* Main Content */}
        <div className={`${isMobile ? 'w-full' : 'w-2/3'}`}>
          {/* ── Step 1: Customer info form ── */}
          {step === 'info' && (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5"
            >
              <h3 className="font-semibold text-lg mb-4 dark:text-white flex items-center gap-2">
                <User size={20} />
                Customer Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      name="fullName"
                      value={customerInfo.fullName}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="email"
                      name="email"
                      value={customerInfo.email}
                      onChange={handleInputChange}
                      placeholder="you@example.com"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      name="phone"
                      value={customerInfo.phone}
                      onChange={handleInputChange}
                      placeholder="08012345678"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    WhatsApp Number *
                  </label>
                  <div className="relative">
                    <MessageCircle
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="tel"
                      name="whatsapp"
                      value={customerInfo.whatsapp}
                      onChange={handleInputChange}
                      placeholder="08012345678"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    We&apos;ll use this to send order updates via WhatsApp
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Delivery Address *
                  </label>
                  <div className="relative">
                    <MapPin
                      size={16}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      name="address"
                      value={customerInfo.address}
                      onChange={handleInputChange}
                      placeholder="Street address"
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      City *
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={customerInfo.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      State *
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={customerInfo.state}
                      onChange={handleInputChange}
                      placeholder="State"
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all text-sm"
                    />
                  </div>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep('review')}
                disabled={!isInfoValid()}
                className={`w-full mt-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all ${
                  isInfoValid()
                    ? 'bg-gradient-to-r from-blue to-indigo-600 hover:from-blue hover:to-indigo-700 text-white shadow-sm'
                    : 'bg-gray-200 dark:bg-gray-700 text-gray-400 cursor-not-allowed'
                }`}
              >
                Continue to Review
                <ArrowLeft size={16} className="rotate-180" />
              </motion.button>
            </motion.div>
          )}

          {/* ── Step 2: Review & Pay ── */}
          {step === 'review' && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-4"
            >
              {/* Customer Info Summary */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold dark:text-white flex items-center gap-2">
                    <User size={18} />
                    Delivery Information
                  </h3>
                  <button
                    onClick={() => setStep('info')}
                    className="text-sm text-indigo-500 hover:text-indigo-600 font-medium"
                  >
                    Edit
                  </button>
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300 space-y-1">
                  <p className="font-medium">{customerInfo.fullName}</p>
                  <p>{customerInfo.email}</p>
                  <p>{customerInfo.phone}</p>
                  <p className="flex items-center gap-1">
                    <MessageCircle size={13} className="text-green-500" />
                    {customerInfo.whatsapp}
                  </p>
                  <p>
                    {customerInfo.address}, {customerInfo.city}, {customerInfo.state}
                  </p>
                </div>
              </div>

              {/* Order Items — grouped by seller */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                <h3 className="font-semibold dark:text-white flex items-center gap-2 mb-4">
                  <ShoppingCart size={18} />
                  Order Items ({checkoutCount})
                </h3>

                <div className="space-y-5">
                  {Object.entries(itemsBySeller).map(([seller, items]) => (
                    <div key={seller}>
                      {/* Seller header — only show if multi-vendor cart */}
                      {Object.keys(itemsBySeller).length > 1 && (
                        <p className="text-xs font-medium text-gray-400 dark:text-gray-500 uppercase tracking-wide mb-2">
                          {seller}
                        </p>
                      )}
                      <div className="space-y-3">
                        {items.map((item) => (
                          <div key={item.id} className="flex items-center gap-3">
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                              <Image
                                src={item.image}
                                alt={item.itemName}
                                fill
                                className="object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium dark:text-white truncate">
                                {item.itemName}
                              </p>
                              <p className="text-xs text-gray-500">
                                Qty: {item.quantity}
                                {Object.keys(itemsBySeller).length <= 1 && (
                                  <span className="ml-2 text-gray-400">• {item.sellerName}</span>
                                )}
                              </p>
                            </div>
                            <span className="text-sm font-semibold dark:text-white">
                              {numberFormat((item.price * item.quantity) / 100, Currencies.NGN)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Section */}
              <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5">
                <h3 className="font-semibold dark:text-white flex items-center gap-2 mb-4">
                  <CreditCard size={18} />
                  Payment
                </h3>

                <div className="flex items-center gap-2 mb-4 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <ShieldCheck size={18} className="text-green-500" />
                  <p className="text-sm text-green-700 dark:text-green-400">
                    Secure payment powered by Paystack
                  </p>
                </div>

                <CheckoutContent
                  customerInfo={customerInfo}
                  checkoutItems={checkoutItems}
                  checkoutTotal={checkoutTotal}
                  onPaymentSuccess={handlePaymentSuccess}
                />
              </div>
            </motion.div>
          )}
        </div>

        {/* Order Summary Sidebar */}
        <div className={`${isMobile ? 'w-full mt-6' : 'w-1/3'}`}>
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-5 sticky top-4">
            <h3 className="font-semibold text-lg mb-4 dark:text-white">Order Summary</h3>

            <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
              {checkoutItems.map((item) => (
                <div key={item.id} className="flex items-center gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={item.image} alt={item.itemName} fill className="object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium dark:text-white truncate">{item.itemName}</p>
                    <p className="text-xs text-gray-400">
                      x{item.quantity} • {item.sellerName}
                    </p>
                  </div>
                  <span className="text-xs font-semibold dark:text-white">
                    {numberFormat((item.price * item.quantity) / 100, Currencies.NGN)}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-gray-100 dark:border-gray-700 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Subtotal</span>
                <span className="font-medium dark:text-white">
                  {numberFormat(checkoutTotal / 100, Currencies.NGN)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Delivery</span>
                <span className="font-medium text-green-500">Free</span>
              </div>
              <div className="border-t border-gray-100 dark:border-gray-700 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold dark:text-white">Total</span>
                  <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    {numberFormat(checkoutTotal / 100, Currencies.NGN)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
