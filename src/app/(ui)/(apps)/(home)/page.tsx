'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { message as antMessage } from 'antd';
import { useListings } from '@grc/hooks/useListings';
import { useCart } from '@grc/hooks/useCart';
import { useSavedProducts } from '@grc/hooks/useSavedProducts';
import { useSearch } from '@grc/hooks/useSearch';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import Market from '@grc/components/apps/market';
import { isEmpty } from 'lodash';
import { useGetCategoryTreeQuery, Category } from '@grc/services/categories';

const PER_PAGE = 21;

const conditionDisplayMap: Record<string, string> = {
  brand_new: 'Brand New',
  fairly_used: 'Fairly Used',
  used: 'Used',
  refurbished: 'Refurbished',
};

export const transformListing = (listing: any) => {
  const creator =
    listing.creatorId && typeof listing.creatorId === 'object' ? listing.creatorId : null;
  const store = listing.storeId && typeof listing.storeId === 'object' ? listing.storeId : null;
  const user = listing.userId && typeof listing.userId === 'object' ? listing.userId : null;

  return {
    id: listing._id || listing.id,
    itemName: listing.itemName || '',
    description: listing.description || '',
    condition: conditionDisplayMap[listing.condition] || listing.condition || 'Brand New',
    category: listing.category || '',
    media: (listing.media || []).map((m: any) => ({
      url: m.url,
      type: m.type || 'image',
      thumbnail: m.thumbnail,
      _id: m._id || m.id,
      id: m._id || m.id,
    })),
    askingPrice: {
      price: listing.effectivePrice?.amount || listing.askingPrice?.amount || 0,
      currency: listing.effectivePrice?.currency || listing.askingPrice?.currency || 'NGN',
      negotiable: listing.askingPrice?.negotiable || false,
    },
    quantity: listing.quantity ?? 0,
    availability: (listing.quantity ?? 0) > 0,
    sponsored: false,
    isBuyable: listing.isBuyable ?? false,
    listingType: listing.type || 'self-listing',
    productTags: listing.tags || [],
    comments: [],
    views: listing.views || 0,
    likes: listing.likes || 0,
    totalSales: listing.totalSales || 0,
    postUserProfile: {
      isStore: !isEmpty(store),
      displayName: !isEmpty(store) ? store?.name : `${user?.firstName} ${user?.lastName}`,
      userName: creator?.username,
      profilePicUrl: !isEmpty(store)
        ? store?.logo
        : creator?.profileImageUrl ?? listing?.userId?.avatar,
      id: !isEmpty(store) ? store?._id : creator?._id,
      isVerified: !isEmpty(store) ? store?.isVerified : creator?.isVerified,
      isSuperVerified: !isEmpty(store) ? store?.isSuperVerified : creator?.isSuperVerified,
      phoneNumber:
        listing.whatsappNumber || !isEmpty(store)
          ? store?.whatsappNumber ?? store?.phoneNumber
          : creator?.whatsappNumber ?? listing?.phoneNumber,
      location: !isEmpty(store)
        ? `${store?.location?.city}, ${store?.location?.state}`
        : `${creator?.location?.city}, ${creator?.location?.state}`,
    },
    _raw: listing,
  };
};

export interface MarketFilters {
  category?: string;
  subCategory?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

const MarketPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery(mediaSize.mobile);

  const [viewType, setViewType] = useState(searchParams?.get('view') || 'grid');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<MarketFilters>({});
  const [page, setPage] = useState(1);
  const [accumulatedListings, setAccumulatedListings] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [gridModalOpen, setGridModalOpen] = useState(false);
  const [gridModalItem, setGridModalItem] = useState<any>(null);

  const { searchValue, setSearchValue } = useSearch(600);

  // Fetch category tree from backend
  const { data: categoryTreeResponse } = useGetCategoryTreeQuery();
  const categoryTree: Category[] = useMemo(
    () => categoryTreeResponse?.data || [],
    [categoryTreeResponse]
  );

  const {
    listings: rawListings,
    listingsTotal,
    isLoadingListings,
    isFetchingListings,
  } = useListings({
    fetchListings: true,
    listingsParams: {
      ...(filters.category && filters.category !== 'all' ? { category: filters.category } : {}),
      ...(filters.subCategory ? { subCategory: filters.subCategory } : {}),
      ...(filters.condition ? { condition: filters.condition } : {}),
      ...(filters.minPrice !== undefined ? { minPrice: filters.minPrice } : {}),
      ...(filters.maxPrice !== undefined ? { maxPrice: filters.maxPrice } : {}),
      ...(filters.sort ? { sort: filters.sort } : {}),
    },
    search: searchValue,
    customPaginate: { page, perPage: PER_PAGE },
  });

  const { addToCart, isInCart, cartItems, refetchCount, isAddingToCart } = useCart({
    fetchCart: true,
    fetchCount: true,
  });

  const { toggleSave, checkSavedStatus, savedStatusMap, isToggling } = useSavedProducts({});

  // Accumulate for infinite scroll
  useEffect(() => {
    if (!rawListings) return;
    if (page === 1) {
      setAccumulatedListings(rawListings);
    } else {
      setAccumulatedListings((prev) => {
        const existingIds = new Set(prev.map((l: any) => l._id || l.id));
        const newItems = rawListings.filter((l: any) => !existingIds.has(l._id || l.id));
        return [...prev, ...newItems];
      });
    }
  }, [rawListings, page]);

  // Reset on search/filter change
  useEffect(() => {
    setPage(1);
    // setAccumulatedListings([]);
  }, [searchValue, JSON.stringify(filters)]);

  // Check saved status for visible listings
  useEffect(() => {
    if (accumulatedListings.length > 0 && checkSavedStatus) {
      const ids = accumulatedListings.map((l: any) => l._id || l.id).filter(Boolean);
      if (ids.length > 0) checkSavedStatus(ids).catch(() => {});
    }
  }, [accumulatedListings.length]);

  const transformedListings = useMemo(
    () => accumulatedListings.map(transformListing),
    [accumulatedListings]
  );

  const selectedProduct = useMemo(
    () => transformedListings.find((item) => item.id?.toString() === selectedProductId),
    [selectedProductId, transformedListings]
  );

  const hasMore = accumulatedListings.length < listingsTotal;
  const handleLoadMore = useCallback(() => {
    if (!isFetchingListings && hasMore) setPage((prev) => prev + 1);
    console.log('load more fired:::::', hasMore);
  }, [isFetchingListings, hasMore]);

  const handleSearch = useCallback(
    (value: string, category: string) => {
      setSearchValue(value);
      if (category && category !== 'all') {
        setFilters((prev) => ({ ...prev, category }));
      } else {
        setFilters((prev) => {
          const { category: _category, ...rest } = prev;
          return rest;
        });
      }
    },
    [setSearchValue]
  );

  const handleApplyFilters = useCallback((newFilters: MarketFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  }, []);

  const handleResetFilters = useCallback(() => setFilters({}), []);

  const handleCategorySelect = useCallback((categorySlug: string | null) => {
    setFilters((prev) => {
      const { category: _category, subCategory: _subCategory, ...rest } = prev;
      if (!categorySlug) return rest; // "All" clicked - clear category & subCategory
      return { ...rest, category: categorySlug };
    });
  }, []);

  const handleSubCategorySelect = useCallback((subCategorySlug: string | null) => {
    setFilters((prev) => {
      const { subCategory: _subCategory, ...rest } = prev;
      if (!subCategorySlug) return rest;
      return { ...rest, subCategory: subCategorySlug };
    });
  }, []);

  const handleViewChange = useCallback(
    (view: string) => {
      setViewType(view);
      const newParams = new URLSearchParams(searchParams?.toString());
      newParams.set('view', view);
      router.push(`?${newParams.toString()}`, { scroll: false });
    },
    [searchParams, router]
  );

  const handleAddToCart = useCallback(
    async (item: any) => {
      const listingId = (item.id || '').toString();
      try {
        if (isInCart(listingId)) {
          antMessage.info('Item is already in your cart');
          return;
        }
        await addToCart(listingId, 1);
        refetchCount();
      } catch {}
    },
    [addToCart, isInCart, refetchCount]
  );

  const handleBuyNow = useCallback(
    async (item: any) => {
      const listingId = (item.id || '').toString();
      try {
        if (!isInCart(listingId)) {
          await addToCart(listingId, 1);
          refetchCount();
        }
        router.push(`/cart?select=${listingId}`);
      } catch {}
    },
    [addToCart, isInCart, refetchCount, router]
  );

  const handleToggleSave = useCallback(
    async (item: any) => {
      const listingId = (item.id || '').toString();
      try {
        await toggleSave(listingId);
        // Re-check ALL visible listings, not just the toggled one
        if (checkSavedStatus) {
          const allIds = accumulatedListings.map((l: any) => l._id || l.id).filter(Boolean);
          checkSavedStatus(allIds).catch(() => {});
        }
      } catch {}
    },
    [toggleSave, checkSavedStatus, accumulatedListings]
  );

  const handleWhatsAppMessage = useCallback((item: any) => {
    const phoneNumber = item.postUserProfile?.phoneNumber || '';
    if (!phoneNumber) {
      antMessage.error('Seller phone number not available');
      return;
    }
    const formattedPrice = numberFormat((item.askingPrice?.price || 0) / 100, Currencies.NGN);
    const sellerName =
      item.postUserProfile?.displayName || item.postUserProfile?.userName || 'Seller';
    const msg = `Hi ${sellerName},\nI'm interested in this item on Comaket.\n\n${item.itemName}\n${item.description}\nPrice: ${formattedPrice}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(msg)}`, '_blank');
  }, []);

  const handleVendorClick = useCallback(
    (item: any) => {
      console.log('post user data::::::', item?.postUserProfile);
      if (item?.postUserProfile?.isStore) {
        router.push(`/stores/${encodeURIComponent(item?.postUserProfile?.id)}`);
      } else {
        router.push(`/creators/${encodeURIComponent(item?.postUserProfile?.userName)}`);
      }
    },
    [router]
  );

  const handleGridItemClick = useCallback(
    (item: any) => {
      if (isMobile) {
        setSelectedProductId(item.id?.toString());
      } else {
        setGridModalItem(item);
        setGridModalOpen(true);
      }
    },
    [isMobile]
  );

  const handleCloseGridModal = useCallback(() => {
    setGridModalOpen(false);
    setGridModalItem(null);
  }, []);

  const checkItemInCart = useCallback(
    (itemId: string | number) => isInCart(itemId?.toString()),
    [isInCart]
  );

  const checkItemSaved = useCallback(
    (itemId: string | number) => savedStatusMap?.[itemId?.toString()] || false,
    [savedStatusMap]
  );

  const handleShare = useCallback(async (item: any) => {
    const url = `${window.location.origin}/product/${item.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.itemName, text: `Check out: ${item.itemName}`, url });
      } else {
        await navigator.clipboard.writeText(url);
        antMessage.success('Link copied to clipboard!');
      }
    } catch {}
  }, []);

  // Covers the 1-frame gap where rawListings arrived but useEffect hasn't populated accumulatedListings yet
  const isDataPending = !!rawListings && rawListings.length > 0 && accumulatedListings.length === 0;

  const showFullSkeleton =
    ((isLoadingListings || isFetchingListings) && accumulatedListings.length === 0) ||
    isDataPending;

  return (
    <Market
      listings={transformedListings}
      totalListings={listingsTotal}
      // isLoading={isInitialLoading || isFetchingListings || isLoadingListings}
      // isLoadingMore={isLoadingMore || isFetchingListings}
      // isFetchingListings={isFetchingListings || isLoadingListings || isInitialLoading}
      isLoading={showFullSkeleton}
      isLoadingMore={isFetchingListings && accumulatedListings.length > 0 && page > 1}
      isFetchingListings={isFetchingListings}
      hasMore={hasMore}
      viewType={viewType}
      showFilters={showFilters}
      isMobile={isMobile}
      selectedProductId={selectedProductId}
      selectedProduct={selectedProduct}
      gridModalOpen={gridModalOpen}
      gridModalItem={gridModalItem}
      filters={filters}
      categoryTree={categoryTree}
      onCategorySelect={handleCategorySelect}
      onSubCategorySelect={handleSubCategorySelect}
      onLoadMore={handleLoadMore}
      onSearch={handleSearch}
      onApplyFilters={handleApplyFilters}
      onResetFilters={handleResetFilters}
      onViewChange={handleViewChange}
      onToggleFilters={() => setShowFilters(!showFilters)}
      onAddToCart={handleAddToCart}
      onBuyNow={handleBuyNow}
      onToggleSave={handleToggleSave}
      onWhatsAppMessage={handleWhatsAppMessage}
      onVendorClick={handleVendorClick}
      onGridItemClick={handleGridItemClick}
      onCloseGridModal={handleCloseGridModal}
      onSelectProduct={setSelectedProductId}
      onShare={handleShare}
      isInCart={checkItemInCart}
      isSaved={checkItemSaved}
      cartItems={cartItems}
      isAddingToCart={isAddingToCart}
      isTogglingSave={isToggling}
    />
  );
};

export default MarketPage;
