'use client';

import React, { useCallback, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { message as antMessage } from 'antd';
import { useListings } from '@grc/hooks/useListings';
import { useCart } from '@grc/hooks/useCart';
import { useSavedProducts } from '@grc/hooks/useSavedProducts';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import Product from '@grc/components/apps/product';
import { transformListing } from '../../(home)/page';

interface ProductPageProps {
  params: { id: string };
}

const ProductPage = ({ params }: ProductPageProps) => {
  const router = useRouter();
  const listingId = params?.id;

  // ── Fetch single listing ──────────────────────────────────────────────
  // Adjust this if your useListings hook uses different param names
  const { listingDetail: rawListing, isLoadingListingDetail } = useListings({
    listingId,
  });

  // ── Cart API ──────────────────────────────────────────────────────────
  const { addToCart, isInCart, cartItems, refetchCount, isAddingToCart } = useCart({
    fetchCart: true,
    fetchCount: true,
  });

  // ── Saved Products API ────────────────────────────────────────────────
  const { toggleSave, checkSavedStatus, savedStatusMap, isToggling } = useSavedProducts({});

  // ── Check saved status on mount ───────────────────────────────────────
  useEffect(() => {
    if (listingId && checkSavedStatus) {
      checkSavedStatus([listingId]).catch(() => {});
    }
  }, [listingId]);

  // ── Transform listing ─────────────────────────────────────────────────
  const item = useMemo(() => {
    if (!rawListing) return null;
    return transformListing(rawListing);
  }, [rawListing]);

  // ── Derived state ─────────────────────────────────────────────────────
  const itemInCart = isInCart(listingId);
  const itemIsSaved = savedStatusMap?.[listingId] || false;

  const existingCartItem = cartItems?.find(
    (ci: any) => ci.listingId === listingId || ci.id === listingId
  );
  const cartQuantity = existingCartItem?.quantity || 0;
  const maxQuantity = item?.quantity ?? 1;
  const isMaxQuantityReached = cartQuantity >= maxQuantity;
  const isSoldOut = item ? !item.availability : false;

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleAddToCart = useCallback(async () => {
    if (isSoldOut) return;
    if (isMaxQuantityReached) {
      antMessage.warning(`Maximum quantity (${maxQuantity}) reached for this item`);
      return;
    }
    if (itemInCart) {
      antMessage.info('Item is already in your cart');
      return;
    }
    try {
      await addToCart(listingId, 1);
      refetchCount();
      antMessage.success('Added to cart!');
    } catch {}
  }, [
    addToCart,
    listingId,
    isSoldOut,
    isMaxQuantityReached,
    itemInCart,
    maxQuantity,
    refetchCount,
  ]);

  // const handleBuyNow = useCallback(async () => {
  //   if (isSoldOut) return;
  //   try {
  //     if (!itemInCart) {
  //       await addToCart(listingId, 1);
  //       refetchCount();
  //     }
  //     router.push('/cart');
  //   } catch {}
  // }, [addToCart, listingId, isSoldOut, itemInCart, refetchCount, router]);

  const handleBuyNow = useCallback(async () => {
    if (isSoldOut) return;

    try {
      if (!itemInCart) {
        await addToCart(listingId, 1);
        refetchCount();
      }
      router.push(`/cart?select=${listingId}`);
    } catch {}
  }, [addToCart, itemInCart, listingId, isSoldOut, refetchCount, router]);

  const handleToggleSave = useCallback(async () => {
    try {
      await toggleSave(listingId);
      if (checkSavedStatus) checkSavedStatus([listingId]).catch(() => {});
    } catch {}
  }, [toggleSave, checkSavedStatus, listingId]);

  const handleWhatsAppMessage = useCallback(() => {
    if (!item) return;
    const phoneNumber = item.postUserProfile?.phoneNumber || '';
    if (!phoneNumber) {
      antMessage.error('Seller phone number not available');
      return;
    }
    const formattedPrice = numberFormat((item.askingPrice?.price ?? 0) / 100, Currencies.NGN);
    const sellerName =
      item.postUserProfile?.displayName || item.postUserProfile?.userName || 'Seller';

    const msg = `Hi, ${sellerName},\nI am interested in this item on Comaket.\n\nItem Id: ${listingId}\nName: ${item.itemName}\nDescription: ${item.description}\nPrice: ${formattedPrice}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  }, [item, listingId]);

  const handleShare = useCallback(async () => {
    if (!item) return;
    const url = `${window.location.origin}/product/${listingId}`;
    const shareData = {
      title: item.itemName || '',
      text: `Check out this item: ${item.itemName} - ${numberFormat(
        (item.askingPrice?.price ?? 0) / 100,
        Currencies.NGN
      )}`,
      url,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(url);
        antMessage.success('Link copied to clipboard!');
      }
    } catch {}
  }, [item, listingId]);

  const handleGoBack = useCallback(() => {
    router.back();
  }, [router]);

  // ── Loading state ─────────────────────────────────────────────────────
  if (isLoadingListingDetail || !item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <Product
      item={item}
      isInCart={itemInCart}
      isSaved={itemIsSaved}
      cartQuantity={cartQuantity}
      isAddingToCart={isAddingToCart}
      isTogglingSave={isToggling}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      onToggleSave={handleToggleSave}
      onWhatsAppMessage={handleWhatsAppMessage}
      onShare={handleShare}
      onGoBack={handleGoBack}
    />
  );
};

export default ProductPage;
