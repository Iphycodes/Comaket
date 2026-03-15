'use client';

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
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
import { useGetCategoryTreeQuery, Category } from '@grc/services/categories';
import { transformListing, MarketFilters } from '@grc/_shared/helpers/transform-listing';
import { useScrollRestore } from '@grc/hooks/useScrollRestore';
import { useUsers } from '@grc/hooks/useUser';

const PER_PAGE = 20;

const MarketPage = () => {
  const router = useRouter();
  const { userProfile } = useUsers({ fetchProfile: true });
  const searchParams = useSearchParams();
  const isMobile = useMediaQuery(mediaSize.mobile);

  const [viewType, setViewType] = useState(searchParams?.get('view') || 'grid');
  const [showFilters, setShowFilters] = useState(false);
  const initialCategory = searchParams?.get('category') || undefined;
  const [filters, setFilters] = useState<MarketFilters>(
    initialCategory ? { category: initialCategory } : {}
  );
  const [page, setPage] = useState(1);
  const [accumulatedListings, setAccumulatedListings] = useState<any[]>([]);
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [gridModalOpen, setGridModalOpen] = useState(false);
  const [gridModalItem, setGridModalItem] = useState<any>(null);

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const { searchValue, setSearchValue } = useSearch(600);
  const { saveScrollPosition } = useScrollRestore(
    accumulatedListings.length > 0,
    scrollContainerRef
  );

  // Quietly remove the category query param from URL after reading it
  useEffect(() => {
    if (searchParams?.get('category')) {
      const newParams = new URLSearchParams(searchParams.toString());
      newParams.delete('category');
      const newUrl = newParams.toString() ? `/market?${newParams.toString()}` : '/market';
      router.replace(newUrl, { scroll: false });
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

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

  const { addToCart, isInCart, cartItems, refetchCount } = useCart({
    fetchCart: true,
    fetchCount: true,
  });

  const { toggleSave, checkSavedStatus, savedStatusMap } = useSavedProducts({});

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

  // Reset on search/filter change — clear listings so skeleton shows
  useEffect(() => {
    setPage(1);
    setAccumulatedListings([]);
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
      saveScrollPosition();
      if (item?.postUserProfile?.isStore) {
        router.push(`/stores/${encodeURIComponent(item?.postUserProfile?.id)}`);
      } else {
        router.push(`/creators/${encodeURIComponent(item?.postUserProfile?.userName)}`);
      }
    },
    [router, saveScrollPosition]
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

  // Show skeleton when no listings to display, unless a fetch completed with genuinely 0 results
  const hasCompletedEmptyFetch =
    !isLoadingListings &&
    !isFetchingListings &&
    Array.isArray(rawListings) &&
    rawListings.length === 0;
  const showFullSkeleton = accumulatedListings.length === 0 && !hasCompletedEmptyFetch;

  return (
    <Market
      listings={transformedListings}
      totalListings={listingsTotal}
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
      currentUserId={userProfile?._id}
      scrollContainerRef={scrollContainerRef}
    />
  );
};

export default MarketPage;
