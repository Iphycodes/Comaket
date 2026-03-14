'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Minus,
  Plus,
  Trash2,
  ShoppingBag,
  ArrowRight,
  ShoppingCart,
  LogIn,
  Loader2,
  AlertTriangle,
  Ban,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { Empty, Tooltip } from 'antd';
import { CartDisplayItem } from '@grc/app/(ui)/(apps)/cart/page';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface CartProps {
  isAuthenticated: boolean;
  cartItems: CartDisplayItem[];
  cartTotal: number;
  cartCount: number;
  selectedCount: number;
  availableCount: number;
  hasIssues: boolean;
  isLoading: boolean;
  isFetching?: boolean;
  isUpdatingItem?: boolean;
  isRemovingItem?: boolean;
  isClearingCart?: boolean;
  isValidating?: boolean;
  // Selection
  selectedIds: Set<string>;
  allSelected: boolean;
  onToggleSelect: (listingId: string) => void;
  onSelectAll: () => void;
  onDeselectAll: () => void;
  // Actions
  onUpdateQuantity: (listingId: string, quantity: number) => void;
  onRemoveItem: (listingId: string) => void;
  onClearCart: () => void;
  onCheckout: () => void;
  onContinueShopping: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const formatCondition = (condition: string) =>
  condition.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

const getStatusBadge = (item: CartDisplayItem) => {
  if (item.isDeleted) return { label: 'Removed', className: 'bg-red-500/90 text-white' };
  if (item.status === 'sold') return { label: 'Sold', className: 'bg-red-500/90 text-white' };
  if (item.status === 'rejected')
    return { label: 'Rejected', className: 'bg-red-500/90 text-white' };
  if (item.status === 'suspended')
    return { label: 'Suspended', className: 'bg-orange-500/90 text-white' };
  if (item.status === 'pending')
    return { label: 'Pending', className: 'bg-yellow-500/90 text-white' };
  return null;
};

// ═══════════════════════════════════════════════════════════════════════════
// CHECKBOX COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const SelectCheckbox: React.FC<{
  checked: boolean;
  onChange: () => void;
  indeterminate?: boolean;
  disabled?: boolean;
}> = ({ checked, onChange, indeterminate, disabled }) => (
  <button
    onClick={onChange}
    disabled={disabled}
    className="flex-shrink-0 focus:outline-none disabled:opacity-40 disabled:cursor-not-allowed"
    aria-label={checked ? 'Deselect item' : 'Select item'}
  >
    <motion.div
      initial={false}
      animate={{
        backgroundColor: checked || indeterminate ? 'rgb(59, 130, 246)' : 'transparent',
        borderColor: checked || indeterminate ? 'rgb(59, 130, 246)' : 'rgb(209, 213, 219)',
      }}
      transition={{ duration: 0.15 }}
      className={`w-[20px] h-[20px] rounded-md border-2 flex items-center justify-center ${
        !checked && !indeterminate
          ? 'hover:border-blue dark:border-neutral-600 dark:hover:border-blue'
          : ''
      } transition-colors`}
    >
      <AnimatePresence mode="wait">
        {checked && (
          <motion.svg
            key="check"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="none"
          >
            <path
              d="M2.5 6L5 8.5L9.5 3.5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        )}
        {indeterminate && !checked && (
          <motion.div
            key="indeterminate"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            exit={{ scaleX: 0, opacity: 0 }}
            transition={{ duration: 0.12, ease: 'easeOut' }}
            className="w-2.5 h-0.5 bg-white rounded-full"
          />
        )}
      </AnimatePresence>
    </motion.div>
  </button>
);

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Cart: React.FC<CartProps> = ({
  isAuthenticated,
  cartItems,
  cartTotal,
  cartCount,
  selectedCount,
  availableCount,
  hasIssues,
  isLoading,
  isUpdatingItem,
  isRemovingItem,
  isClearingCart,
  isValidating,
  selectedIds,
  allSelected,
  onToggleSelect,
  onSelectAll,
  onDeselectAll,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  onContinueShopping,
}) => {
  const router = useRouter();
  const isMobile = useMediaQuery(mediaSize.mobile);

  const unavailableCount = cartCount - availableCount;
  const someSelected = selectedCount > 0 && !allSelected;

  // ── Unauthenticated state ───────────────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div
        className={`min-h-[80vh] flex flex-col items-center justify-center ${
          isMobile ? 'px-4' : ''
        }`}
      >
        <Empty
          image={
            <ShoppingCart
              size={80}
              className="mx-auto text-neutral-300 dark:text-neutral-600"
              strokeWidth={1}
            />
          }
          description={
            <div className="text-center">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Sign in to view your cart
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                You need to be logged in to add items to your cart and checkout
              </p>
            </div>
          }
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => router.push('/auth/sign-in')}
          className="bg-gradient-to-r from-blue to-indigo-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
        >
          <LogIn size={18} />
          Sign In
        </motion.button>
      </div>
    );
  }

  // ── Loading state ───────────────────────────────────────────────────
  if (isLoading) {
    return (
      <div className={`min-h-[80vh] flex items-center justify-center ${isMobile ? 'px-4' : ''}`}>
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-400">Loading your cart...</p>
        </div>
      </div>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────────────
  if (cartItems.length === 0) {
    return (
      <div
        className={`min-h-[80vh] flex flex-col items-center justify-center ${
          isMobile ? 'px-4' : ''
        }`}
      >
        <Empty
          image={
            <ShoppingCart
              size={80}
              className="mx-auto text-neutral-300 dark:text-neutral-600"
              strokeWidth={1}
            />
          }
          description={
            <div className="text-center">
              <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
                Your cart is empty
              </h3>
              <p className="text-neutral-500 dark:text-neutral-400 mb-6">
                Browse the marketplace and add items to your cart
              </p>
            </div>
          }
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onContinueShopping}
          className="bg-gradient-to-r from-blue to-indigo-600 text-white px-6 py-3 rounded-lg font-medium flex items-center gap-2"
        >
          <ShoppingBag size={18} />
          Browse Marketplace
        </motion.button>
      </div>
    );
  }

  return (
    <div className={`h-screen min-h-screen ${isMobile ? 'px-3' : ''}`}>
      {/* Header */}
      <div
        className={`flex sticky top-0 items-center justify-between mb-4 py-4 bg-background border-b border-b-neutral-200 z-10 ${
          isMobile ? 'pt-10' : ''
        }`}
      >
        <div>
          <h1 className="text-2xl font-bold dark:text-white">Shopping Cart</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
            {cartCount} {cartCount === 1 ? 'item' : 'items'} in your cart
            {unavailableCount > 0 && (
              <span className="text-orange-500 ml-1">· {unavailableCount} unavailable</span>
            )}
          </p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onClearCart}
          disabled={isClearingCart}
          className="text-sm text-red-500 hover:text-red-600 font-medium flex items-center gap-1 disabled:opacity-50"
        >
          {isClearingCart ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
          Clear Cart
        </motion.button>
      </div>

      {/* ── Issues Warning Banner ──────────────────────────────────── */}
      {hasIssues && (
        <div className="mb-4 flex items-start gap-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/40 rounded-xl px-4 py-3">
          <AlertTriangle size={18} className="text-amber-500 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Some items in your cart are unavailable
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5">
              {unavailableCount} {unavailableCount === 1 ? 'item' : 'items'} can&apos;t be purchased
              and {unavailableCount === 1 ? 'is' : 'are'} excluded from your total. Remove{' '}
              {unavailableCount === 1 ? 'it' : 'them'} or continue with available items.
            </p>
          </div>
        </div>
      )}

      {/* ── Select All / Deselect All ──────────────────────────────── */}
      {availableCount > 0 && (
        <div className="flex items-center gap-3 mb-4">
          <SelectCheckbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={allSelected || someSelected ? onDeselectAll : onSelectAll}
          />
          <button
            onClick={allSelected || someSelected ? onDeselectAll : onSelectAll}
            className="text-sm font-medium text-neutral-700 dark:text-neutral-300  dark: transition-colors"
          >
            {allSelected ? 'Deselect all' : someSelected ? 'Deselect all' : 'Select all'}
          </button>
          <span className="text-xs text-neutral-400 dark:text-neutral-500">
            ({selectedCount} of {availableCount} selected)
          </span>
        </div>
      )}

      <div className={`flex ${isMobile ? 'flex-col' : 'gap-8'}`}>
        {/* Cart Items */}
        <div className={`${isMobile ? 'w-full' : 'w-2/3'} space-y-4 pb-10`}>
          <AnimatePresence>
            {cartItems.map((item) => {
              const maxQty = item.maxQuantity ?? Infinity;
              const isAtMax = item.quantity >= maxQty;
              const statusBadge = getStatusBadge(item);
              const isUnavailable = !item.isAvailable;
              const isSelected = selectedIds.has(item.listingId);

              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className={`relative bg-white dark:bg-neutral-800 rounded-xl border p-4 flex gap-3 transition-all ${
                    isUnavailable
                      ? 'border-red-200 dark:border-red-900/40 opacity-60'
                      : isSelected
                        ? 'border-blue/30 dark:border-blue/20 bg-blue/[0.02] dark:bg-blue/[0.03]'
                        : 'border-neutral-100 dark:border-neutral-700'
                  }`}
                >
                  {/* ── Checkbox — only for available items ────────── */}
                  {!isUnavailable && (
                    <div className="flex items-start pt-1">
                      <SelectCheckbox
                        checked={isSelected}
                        onChange={() => onToggleSelect(item.listingId)}
                      />
                    </div>
                  )}

                  {/* ── Unavailable overlay indicator ─────────────── */}
                  {isUnavailable && (
                    <div className="absolute top-0 left-0 right-0 bg-red-50 dark:bg-red-900/30 border-b border-red-200 dark:border-red-800/40 rounded-t-xl px-4 py-1.5 flex items-center gap-2">
                      <Ban size={12} className="text-red-500" />
                      <span className="text-[11px] font-medium text-red-600 dark:text-red-400">
                        {item.unavailableReason || 'Unavailable'}
                      </span>
                    </div>
                  )}

                  {/* Product Image */}
                  <div
                    className={`relative w-24 h-24 md:w-32 md:h-32 rounded-lg overflow-hidden flex-shrink-0 ${
                      isUnavailable ? 'mt-6' : ''
                    }`}
                  >
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.itemName}
                        fill
                        className={`object-cover transition-all ${
                          isUnavailable ? 'neutralscale' : ''
                        } ${!isSelected && !isUnavailable ? 'opacity-50' : ''}`}
                      />
                    ) : (
                      <div className="w-full h-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center">
                        <ShoppingBag size={24} className="text-neutral-300 dark:text-neutral-600" />
                      </div>
                    )}
                    {/* Condition badge */}
                    {item.condition && !isUnavailable && (
                      <div className="absolute top-1 right-1">
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold backdrop-blur-sm ${
                            item.condition === 'Brand New' || item.condition === 'brand_new'
                              ? 'bg-green-500/90 text-white'
                              : item.condition === 'Uk Used' || item.condition === 'uk_used'
                                ? 'bg-blue/90 text-white'
                                : 'bg-yellow-500/90 text-white'
                          }`}
                        >
                          {formatCondition(item.condition)}
                        </span>
                      </div>
                    )}
                    {/* Status badge for unavailable items */}
                    {statusBadge && (
                      <div className="absolute top-1 left-1">
                        <span
                          className={`px-1.5 py-0.5 rounded-full text-[9px] font-semibold backdrop-blur-sm ${statusBadge.className}`}
                        >
                          {statusBadge.label}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Product Details */}
                  <div
                    className={`flex-1 flex flex-col justify-between min-w-0 ${
                      isUnavailable ? 'mt-6' : ''
                    }`}
                  >
                    <div>
                      <h3
                        className={`font-semibold text-sm md:text-base truncate transition-colors ${
                          isUnavailable
                            ? 'text-neutral-400 dark:text-neutral-500 line-through'
                            : !isSelected
                              ? 'text-neutral-400 dark:text-neutral-500'
                              : 'dark:text-white'
                        }`}
                      >
                        {item.itemName}
                      </h3>
                      {item.sellerName && (
                        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                          Seller: {item.sellerName}
                        </p>
                      )}

                      {/* Price section */}
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <span
                          className={`text-lg font-bold transition-colors ${
                            isUnavailable || !isSelected
                              ? 'text-neutral-400 dark:text-neutral-500'
                              : 'bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent'
                          }`}
                        >
                          {numberFormat(item.price / 100, Currencies.NGN)}
                        </span>

                        {/* Price changed indicator */}
                        {item.priceChanged && item.oldPrice && (
                          <>
                            <span className="text-xs text-neutral-400 line-through">
                              {numberFormat(item.oldPrice / 100, Currencies.NGN)}
                            </span>
                            {item.price < item.oldPrice ? (
                              <span className="flex items-center gap-0.5 text-[10px] text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-1.5 py-0.5 rounded-full font-medium">
                                <TrendingDown size={10} />
                                Price dropped
                              </span>
                            ) : (
                              <span className="flex items-center gap-0.5 text-[10px] text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-1.5 py-0.5 rounded-full font-medium">
                                <TrendingUp size={10} />
                                Price increased
                              </span>
                            )}
                          </>
                        )}

                        {item.negotiable && item.isAvailable && (
                          <span className="text-[9px] bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-full font-medium">
                            Negotiable
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Quantity & Remove */}
                    <div className="flex items-center justify-between mt-3">
                      {isUnavailable ? (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-neutral-400">Qty: {item.quantity}</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => onUpdateQuantity(item.listingId, item.quantity - 1)}
                            disabled={isUpdatingItem}
                            className="w-8 h-8 rounded-full border border-neutral-200 dark:border-neutral-600 flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50"
                          >
                            <Minus size={14} />
                          </motion.button>
                          <span className="w-8 text-center font-medium text-sm">
                            {item.quantity}
                          </span>
                          <Tooltip
                            title={isAtMax ? `Max available: ${maxQty}` : ''}
                            open={isAtMax ? undefined : false}
                          >
                            <motion.button
                              whileTap={!isAtMax ? { scale: 0.9 } : undefined}
                              onClick={() => {
                                if (!isAtMax) {
                                  onUpdateQuantity(item.listingId, item.quantity + 1);
                                }
                              }}
                              disabled={isAtMax || isUpdatingItem}
                              className={`w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                                isAtMax
                                  ? 'border-neutral-100 dark:border-neutral-700 text-neutral-300 dark:text-neutral-600 cursor-not-allowed bg-neutral-50 dark:bg-neutral-800'
                                  : 'border-neutral-200 dark:border-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-700 disabled:opacity-50'
                              }`}
                            >
                              <Plus size={14} />
                            </motion.button>
                          </Tooltip>
                          {/* Stock hint */}
                          {maxQty !== Infinity && maxQty <= 5 && (
                            <span className="text-[10px] text-orange-500 font-medium ml-1">
                              {maxQty} available
                            </span>
                          )}
                        </div>
                      )}

                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={() => onRemoveItem(item.listingId)}
                        disabled={isRemovingItem}
                        className="text-red-400 hover:text-red-500 p-2 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      >
                        {isRemovingItem ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className={`${isMobile ? 'w-full mt-6 mb-24' : 'w-1/3'}`}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-5 sticky top-24">
            <h3 className="font-semibold text-lg mb-4 dark:text-white">Order Summary</h3>

            <div className="space-y-3 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">
                  Subtotal ({selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected)
                </span>
                <span className="font-medium dark:text-white">
                  {numberFormat(cartTotal / 100, Currencies.NGN)}
                </span>
              </div>

              {/* Unselected items note */}
              {availableCount - selectedCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-neutral-400 dark:text-neutral-500">
                    {availableCount - selectedCount} not selected
                  </span>
                  <button
                    onClick={onSelectAll}
                    className="text-xs text-blue hover:underline font-medium"
                  >
                    Select all
                  </button>
                </div>
              )}

              {/* Show excluded items note */}
              {unavailableCount > 0 && (
                <div className="flex justify-between text-sm">
                  <span className="text-orange-500 dark:text-orange-400 flex items-center gap-1">
                    <AlertTriangle size={12} />
                    {unavailableCount} unavailable
                  </span>
                  <span className="text-xs text-neutral-400">excluded</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">Delivery</span>
                <span className="font-medium text-green-500">Free</span>
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-700 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold dark:text-white">Total</span>
                  <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    {numberFormat(cartTotal / 100, Currencies.NGN)}
                  </span>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={selectedCount > 0 ? { scale: 1.02 } : undefined}
              whileTap={selectedCount > 0 ? { scale: 0.98 } : undefined}
              onClick={onCheckout}
              disabled={isValidating || selectedCount === 0}
              className="w-full bg-gradient-to-r from-blue to-indigo-600 hover:from-blue hover:to-indigo-800 text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isValidating ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Validating...
                </>
              ) : selectedCount === 0 ? (
                <>Select items to checkout</>
              ) : (
                <>
                  Proceed to Checkout ({selectedCount} Items)
                  <ArrowRight size={18} />
                </>
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onContinueShopping}
              className="w-full mt-3 bg-neutral-100 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-all"
            >
              <ShoppingBag size={18} />
              Continue Shopping
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
