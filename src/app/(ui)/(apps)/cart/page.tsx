'use client';

import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { AppContext } from '@grc/app-context';
import { useAuth } from '@grc/hooks/useAuth';
import { useCart } from '@grc/hooks/useCart';
import Cart from '@grc/components/apps/cart';
import { message as antMessage } from 'antd';
import type { CartItem } from '@grc/services/cart';

// ═══════════════════════════════════════════════════════════════════════════
// TRANSFORM: Backend CartItem → UI CartDisplayItem
// ═══════════════════════════════════════════════════════════════════════════

export interface CartDisplayItem {
  id: string;
  listingId: string;
  itemName: string;
  price: number;
  totalPrice: number;
  quantity: number;
  maxQuantity: number;
  image: string;
  condition: string;
  negotiable: boolean;
  sellerName: string;
  storeName: string;
  storeId: string;
  currency: string;
  type: string;
  isAvailable: boolean;
  isDeleted: boolean;
  priceChanged: boolean;
  oldPrice: number | null;
  status: string;
  unavailableReason: string;
}

const getUnavailableReason = (item: CartItem): string => {
  if (item.isDeleted) return 'This listing has been removed';
  if (!item.listing) return 'Listing no longer exists';

  const status = item.listing.status;
  if (status === 'sold') return 'This item has been sold';
  if (status === 'rejected') return 'This listing was rejected';
  if (status === 'suspended') return 'This listing is suspended';
  if (status === 'pending') return 'This listing is pending review';
  if (status !== 'live') return `Listing is ${status}`;

  const type = item.listing.type;
  if (type === 'consignment') return 'Consignment items are not available for direct purchase';

  if (item.listing.quantity <= 0) return 'Out of stock';

  return '';
};

const transformCartItem = (item: CartItem): CartDisplayItem => {
  const store = item.store || ({} as any);
  const listing = item.listing;
  const snapshot = item.snapshot;

  const liveImage = listing?.media?.[0]?.url || '';
  const image = liveImage || snapshot?.image || '';
  const condition = listing?.condition || '';
  const negotiable = listing?.askingPrice?.negotiable ?? false;
  const maxQuantity = listing?.quantity ?? item.quantity ?? 99;
  const oldPrice = item.priceChanged ? snapshot?.unitPrice || null : null;
  const unavailableReason = item.isAvailable ? '' : getUnavailableReason(item);

  return {
    id: item.listingId,
    listingId: item.listingId,
    itemName: item.itemName || snapshot?.itemName || '',
    price: item.unitPrice || 0,
    totalPrice: item.totalPrice || 0,
    quantity: item.quantity || 1,
    maxQuantity,
    image,
    condition,
    negotiable,
    sellerName: store?.name || '',
    storeName: store?.name || '',
    storeId: item.storeId || store?._id || '',
    currency: item.currency || 'NGN',
    type: listing?.type || snapshot?.type || '',
    isAvailable: item.isAvailable,
    isDeleted: item.isDeleted,
    priceChanged: item.priceChanged,
    oldPrice,
    status: listing?.status || '',
    unavailableReason,
  };
};

// ═══════════════════════════════════════════════════════════════════════════
// CART PAGE
// ═══════════════════════════════════════════════════════════════════════════

const CartPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const { setIsSellItemModalOpen } = useContext(AppContext);

  // Buy Now flow: ?select=listingId → only pre-select that item
  const selectOnly = searchParams?.get('select') ?? '';

  useEffect(() => {
    setIsSellItemModalOpen(false);
  }, []);

  // ── useCart ──────────────────────────────────────────────────────────
  const {
    cartItems: rawCartItems,
    cartItemCount,
    isLoadingCart,
    isFetchingCart,
    isUpdatingItem,
    isRemovingItem,
    isClearingCart,
    updateQuantity,
    removeItem,
    clearCart,
    refetchCart,
    refetchCount,
    validateCart,
    isValidating,
  } = useCart({
    fetchCart: !!isAuthenticated,
    fetchCount: !!isAuthenticated,
  });

  // ── Transform cart items for UI ─────────────────────────────────────
  const cartDisplayItems: CartDisplayItem[] = useMemo(
    () => (rawCartItems || []).map(transformCartItem),
    [rawCartItems]
  );

  // ── Selection state ─────────────────────────────────────────────────
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [hasInitialized, setHasInitialized] = useState(false);

  // ── Initialize selection ──────────────────────────────────────────
  useEffect(() => {
    if (cartDisplayItems.length === 0 || hasInitialized) return;

    if (selectOnly) {
      // Buy Now flow — wait until the item actually exists in cart data
      const itemExists = cartDisplayItems.some((item) => item.listingId === selectOnly);
      if (!itemExists) return; // Don't initialize yet — item hasn't loaded
      setSelectedIds(new Set([selectOnly]));
    } else {
      // Normal flow — select all available
      const availableIds = cartDisplayItems
        .filter((item) => item.isAvailable)
        .map((item) => item.listingId);
      setSelectedIds(new Set(availableIds));
    }
    setHasInitialized(true);
  }, [cartDisplayItems, hasInitialized, selectOnly]);

  // Clean up stale selections when items are removed
  useEffect(() => {
    if (!hasInitialized) return;
    const currentIds = new Set(cartDisplayItems.map((item) => item.listingId));
    setSelectedIds((prev) => {
      const next = new Set<string>();
      prev.forEach((id) => {
        if (currentIds.has(id)) next.add(id);
      });
      if (next.size === prev.size) return prev;
      return next;
    });
  }, [cartDisplayItems.length]); // removed hasInitialized from deps

  const handleToggleSelect = useCallback((listingId: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(listingId)) {
        next.delete(listingId);
      } else {
        next.add(listingId);
      }
      return next;
    });
  }, []);

  const handleSelectAll = useCallback(() => {
    const availableIds = cartDisplayItems
      .filter((item) => item.isAvailable)
      .map((item) => item.listingId);
    setSelectedIds(new Set(availableIds));
  }, [cartDisplayItems]);

  const handleDeselectAll = useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  // ── Derived totals from selection ───────────────────────────────────
  const availableItems = useMemo(
    () => cartDisplayItems.filter((item) => item.isAvailable),
    [cartDisplayItems]
  );

  const selectedItems = useMemo(
    () => availableItems.filter((item) => selectedIds.has(item.listingId)),
    [availableItems, selectedIds]
  );

  const selectedCount = selectedItems.length;
  const availableCount = availableItems.length;

  const selectedTotal = useMemo(
    () => selectedItems.reduce((sum, item) => sum + item.totalPrice, 0),
    [selectedItems]
  );

  const allAvailableSelected = selectedCount === availableCount && availableCount > 0;
  const hasIssues = cartDisplayItems.some((item) => !item.isAvailable);
  const totalItemCount = cartItemCount || cartDisplayItems.length;

  // ── Handlers ────────────────────────────────────────────────────────

  const handleUpdateQuantity = useCallback(
    async (listingId: string, quantity: number) => {
      if (quantity < 1) {
        try {
          await removeItem(listingId);
          refetchCart();
          refetchCount();
        } catch {}
        return;
      }
      try {
        await updateQuantity(listingId, quantity);
        refetchCart();
        refetchCount();
      } catch {}
    },
    [updateQuantity, removeItem, refetchCart, refetchCount]
  );

  const handleRemoveItem = useCallback(
    async (listingId: string) => {
      try {
        await removeItem(listingId);
        setSelectedIds((prev) => {
          const next = new Set(prev);
          next.delete(listingId);
          return next;
        });
        refetchCart();
        refetchCount();
      } catch {}
    },
    [removeItem, refetchCart, refetchCount]
  );

  const handleClearCart = useCallback(async () => {
    try {
      await clearCart();
      setSelectedIds(new Set());
      refetchCart();
      refetchCount();
    } catch {}
  }, [clearCart, refetchCart, refetchCount]);

  const handleCheckout = useCallback(async () => {
    if (selectedCount === 0) {
      antMessage.warning('Please select at least one item to checkout.');
      return;
    }

    try {
      const result = await validateCart();
      const validationData = result?.data;

      if (validationData && !validationData.valid) {
        const issueCount = validationData.issues?.length || 0;
        antMessage.warning(
          `${issueCount} item${issueCount !== 1 ? 's' : ''} in your cart ${
            issueCount !== 1 ? 'have' : 'has'
          } issues. Please review before checkout.`
        );
        refetchCart();
        return;
      }
    } catch {}

    // Pass selected listing IDs to checkout
    const selectedListingIds = Array.from(selectedIds).join(',');
    router.push(`/checkout?items=${selectedListingIds}`);
  }, [validateCart, router, refetchCart, selectedCount, selectedIds]);

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <Cart
      isAuthenticated={!!isAuthenticated}
      cartItems={cartDisplayItems}
      cartTotal={selectedTotal}
      cartCount={totalItemCount}
      selectedCount={selectedCount}
      availableCount={availableCount}
      hasIssues={hasIssues}
      isLoading={isLoadingCart}
      isFetching={isFetchingCart}
      isUpdatingItem={isUpdatingItem}
      isRemovingItem={isRemovingItem}
      isClearingCart={isClearingCart}
      isValidating={isValidating}
      selectedIds={selectedIds}
      allSelected={allAvailableSelected}
      onToggleSelect={handleToggleSelect}
      onSelectAll={handleSelectAll}
      onDeselectAll={handleDeselectAll}
      onUpdateQuantity={handleUpdateQuantity}
      onRemoveItem={handleRemoveItem}
      onClearCart={handleClearCart}
      onCheckout={handleCheckout}
      onContinueShopping={() => router.push('/market')}
    />
  );
};

export default CartPage;
