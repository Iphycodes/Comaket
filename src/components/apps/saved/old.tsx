'use client';

import React, { useContext, useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { Badge, Input, Tooltip, message as antMessage, Empty } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid,
  List,
  X,
  MessageCircle,
  ShoppingCart,
  ShoppingBag,
  Loader2,
  BookmarkX,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { Currencies } from '@grc/_shared/constant';
import ModernItemPost from '@grc/components/apps/item-post-new';
import { useSearch } from '@grc/hooks/useSearch';
import ProductListingSkeleton from '../item-post-new/lib/product-listing-skeleton';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { MarketItem } from '@grc/_shared/namespace';
import { CartItem } from '@grc/_shared/namespace/cart';
import { numberFormat } from '@grc/_shared/helpers';
import MediaRenderer from '../media-renderer';
import { AppContext } from '@grc/app-context';
import Product from '../product';
import ItemDetailModal from '../item-detail-modal';
import { Shop } from 'iconsax-react';
import { useSavedProducts } from '@grc/hooks/useSavedProducts';

// ═══════════════════════════════════════════════════════════════════════════
// TRANSFORM
// ═══════════════════════════════════════════════════════════════════════════

const formatConditionLabel = (condition?: string): string => {
  if (!condition) return '';
  const map: Record<string, string> = {
    brand_new: 'Brand New',
    fairly_used: 'Fairly Used',
    uk_used: 'Uk Used',
    refurbished: 'Refurbished',
  };
  return map[condition] || condition.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};

const transformSavedToMarketItem = (saved: any): MarketItem | null => {
  const listing = saved?.listing;
  if (!listing) return null;
  const store = listing.storeId && typeof listing.storeId === 'object' ? listing.storeId : null;
  return {
    id: listing._id,
    itemName: listing.itemName || '',
    description: listing.description || '',
    condition: formatConditionLabel(listing.condition),
    askingPrice: {
      price: listing.askingPrice?.amount ?? 0,
      negotiable: listing.askingPrice?.negotiable ?? false,
    },
    media: listing.media || [],
    postUserProfile: {
      businessName: store?.name || '',
      userName: store?.slug || '',
      profilePicUrl: store?.logo || '',
      id: store?._id || '',
      isVerified: false,
      isSuperVerified: false,
      phoneNumber: listing.whatsappNumber || '',
    },
    productTags: listing.tags || [],
    quantity: listing.quantity ?? 1,
    availability: listing.status === 'live',
    isBuyable: listing.type === 'direct_purchase',
    sponsored: false,
    comments: [],
    listingType: listing.type === 'consignment' ? 'consignment' : 'self-listing',
  } as MarketItem;
};

const PER_PAGE = 20;

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const SavedItems: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [viewType, setViewType] = useState(searchParams?.get('view') || 'grid');
  const { searchValue, debouncedChangeHandler } = useSearch();
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { addToCart, isInCart, cartItems } = useContext(AppContext);

  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [gridModalOpen, setGridModalOpen] = useState(false);
  const [gridModalItem, setGridModalItem] = useState<MarketItem | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const loadMoreRef = useRef<HTMLDivElement>(null);
  const [, setExtraPages] = useState<any[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [allItems, setAllItems] = useState<any[]>([]);
  const [hasMore, setHasMore] = useState(false); // Start false — prevent premature fetch
  const hasInitialized = useRef(false);

  // ══════════════════════════════════════════════════════════════════════
  // HOOK
  // ══════════════════════════════════════════════════════════════════════

  const {
    isLoadingSaved,
    isFetchingSaved,
    removeSavedProduct,
    refetchSaved,
    refetchCount,
    savedTotal,
    getSavedResponse,
  } = useSavedProducts({
    fetchSaved: true,
    savedParams: { page: 1, perPage: PER_PAGE },
    fetchCount: true,
  });

  // ── Initialize from first load (ref-guarded, fires once) ─────────
  useEffect(() => {
    if (isLoadingSaved || hasInitialized.current) return;
    const data = getSavedResponse?.data?.data;
    const total = getSavedResponse?.data?.meta?.pagination?.total || 0;
    if (data && Array.isArray(data) && data.length > 0) {
      setAllItems(data);
      setHasMore(data.length < total);
      hasInitialized.current = true;
    }
  }, [isLoadingSaved, getSavedResponse]);

  const savedCount = savedTotal || 0;

  // Update hasMore based on first page data
  // useEffect(() => {
  //   console.log('firstPageItems', firstPageItems)
  //   if (!isLoadingSaved && firstPageItems.length > 0) {
  //     setHasMore(firstPageItems.length < firstPageTotal);
  //   }
  // }, [isLoadingSaved, firstPageItems.length, firstPageTotal]);

  // ── Load more handler ───────────────────────────────────────────────
  const handleLoadMore = useCallback(async () => {
    if (isFetchingSaved || !hasMore) return;
    const nextPage = currentPage + 1;
    try {
      const result = await refetchSaved({ page: nextPage, perPage: PER_PAGE });
      const newItems = result?.data?.data || [];
      if (newItems.length > 0) {
        setAllItems((prev) => {
          const existingIds = new Set(prev.map((p: any) => p._id));
          const unique = newItems.filter((n: any) => !existingIds.has(n._id));
          return [...prev, ...unique];
        });
        setCurrentPage(nextPage);
        const total = result?.data?.meta?.pagination?.total || 0;
        setHasMore(allItems.length + newItems.length < total);
      } else {
        setHasMore(false);
      }
    } catch {}
  }, [currentPage, isFetchingSaved, hasMore, refetchSaved, allItems.length]);

  // ── Infinite scroll ─────────────────────────────────────────────────
  useEffect(() => {
    const sentinel = loadMoreRef.current;
    if (!sentinel) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isFetchingSaved && !isLoadingSaved) {
          handleLoadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, isFetchingSaved, isLoadingSaved]);

  // ── Transform to MarketItem ─────────────────────────────────────────
  const savedItemsList: MarketItem[] = useMemo(
    () => allItems.map(transformSavedToMarketItem).filter(Boolean) as MarketItem[],
    [allItems]
  );

  // ── Client-side search filter ───────────────────────────────────────
  const filteredItems = useMemo(() => {
    if (!searchValue) return savedItemsList;
    const query = searchValue.toLowerCase();
    return savedItemsList.filter(
      (item) =>
        item.itemName?.toLowerCase().includes(query) ||
        item.description?.toLowerCase().includes(query) ||
        item.postUserProfile?.displayName?.toLowerCase().includes(query) ||
        item.postUserProfile?.userName?.toLowerCase().includes(query) ||
        item.productTags?.some((tag: string) => tag.toLowerCase().includes(query))
    );
  }, [savedItemsList, searchValue]);

  const selectedProduct = useMemo(
    () => savedItemsList?.find((item) => item.id?.toString() === selectedProductId),
    [selectedProductId, savedItemsList]
  );

  // ══════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ══════════════════════════════════════════════════════════════════════

  const handleViewChange = (view: string) => {
    setViewType(view);
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set('view', view);
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const handleVendorClick = (item: MarketItem) => {
    const vendorId = item.postUserProfile?.id || item.postUserProfile?.userName;
    if (vendorId) router.push(`/vendors/${encodeURIComponent(vendorId)}`);
  };

  const handleGridItemClick = (item: MarketItem) => {
    if (isMobile) {
      setSelectedProductId(item?.id?.toString());
    } else {
      setGridModalItem(item);
      setGridModalOpen(true);
    }
  };

  const handleBookmark = async (item: MarketItem) => {
    const listingId = item?.id?.toString();
    if (!listingId) return;
    setRemovingId(listingId);
    try {
      await removeSavedProduct(listingId);
      // Clean from extra pages local state
      setExtraPages((prev) => prev.filter((p: any) => p.listing?._id !== listingId));
      refetchSaved({ page: 1, perPage: PER_PAGE });
      refetchCount();
    } catch {
    } finally {
      setRemovingId(null);
    }
  };

  const handleAddToCart = (item: MarketItem) => {
    const maxQty = item?.quantity ?? 1;
    const existing = cartItems?.find((i: CartItem) => i.id === item?.id);
    const currentQty = existing?.quantity || 0;
    if (currentQty >= maxQty) {
      antMessage.warning(`Maximum quantity (${maxQty}) reached for this item`);
      return;
    }
    if (isInCart(item?.id)) {
      antMessage.info('Item is already in your cart');
      return;
    }
    addToCart(item?.id);
    antMessage.success('Added to cart!');
  };

  const handleBuyNow = (item: MarketItem) => {
    const listingId = (item?.id || '').toString();
    router.push(`/cart?select=${listingId}`);
  };

  const handleWhatsAppMessage = (item: MarketItem) => {
    const phoneNumber = item.postUserProfile?.phoneNumber || '';
    if (!phoneNumber) {
      antMessage.error('Seller phone number not available');
      return;
    }
    const formattedPrice = numberFormat(item.askingPrice?.price / 100, Currencies.NGN);
    const sellerName =
      item.postUserProfile?.displayName || item.postUserProfile?.userName || 'Seller';
    const message = `Hi, ${sellerName},\nI am interested in this item on Comaket.\n\n${item.itemName}\n${item.description}\nPrice: ${formattedPrice}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleShare = async (item: MarketItem) => {
    const shareData = {
      title: item.itemName,
      text: `Check out: ${item.itemName} - ${numberFormat(
        item.askingPrice?.price / 100,
        Currencies.NGN
      )}`,
      url: `${window.location.origin}/product/${item.id}`,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        antMessage.success('Link copied!');
      }
    } catch {}
  };

  // ══════════════════════════════════════════════════════════════════════
  // ANIMATIONS
  // ══════════════════════════════════════════════════════════════════════

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, duration: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const LoadMoreSkeleton = () => (
    <div
      className={
        viewType === 'grid'
          ? 'grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4'
          : 'space-y-6 max-w-4xl mx-auto'
      }
    >
      {[1, 2, 3].map((i) =>
        viewType === 'grid' ? (
          <div
            key={i}
            className="bg-white dark:bg-neutral-800 rounded-lg overflow-hidden animate-pulse"
          >
            <div className="aspect-square bg-neutral-200 dark:bg-neutral-700" />
            <div className="p-3 space-y-2">
              <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-3/4" />
              <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded w-1/2" />
              <div className="h-8 bg-neutral-200 dark:bg-neutral-700 rounded" />
            </div>
          </div>
        ) : (
          <div key={i}>
            <ProductListingSkeleton />
          </div>
        )
      )}
    </div>
  );

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <Empty
        image={
          <Shop
            size={80}
            className="mx-auto text-neutral-300 dark:text-neutral-600"
            strokeWidth={1}
          />
        }
        description={
          <div className="text-center">
            <h3 className="text-lg font-medium text-neutral-900 dark:text-neutral-100 mb-2">
              {searchValue ? 'No items match your search' : 'No saved items'}
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              {searchValue ? 'Try a different search term' : 'Items you save will appear here'}
            </p>
            {searchValue && (
              <button
                onClick={() => debouncedChangeHandler('')}
                className="text-sm text-blue hover:underline mt-2"
              >
                Clear search
              </button>
            )}
          </div>
        }
      />
    </motion.div>
  );

  // ══════════════════════════════════════════════════════════════════════
  // GRID VIEW
  // ══════════════════════════════════════════════════════════════════════

  const renderProductGrid = () => {
    if (filteredItems?.length === 0) return renderEmptyState();

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {filteredItems.map((item: MarketItem) => {
          const itemInCart = isInCart(item?.id ?? '');
          const isSoldOut = !item?.availability;
          const maxQty = item?.quantity ?? 1;
          const existing = cartItems?.find((i: CartItem) => i.id === item?.id);
          const currentQty = existing?.quantity || 0;
          const isMaxQty = currentQty >= maxQty;
          const firstMedia = item?.media?.[0];
          const isItemRemoving = removingId === item?.id?.toString();

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              layout
              className="bg-white dark:bg-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image */}
              <div
                className="relative aspect-square cursor-pointer group overflow-hidden"
                onClick={() => handleGridItemClick(item)}
              >
                {firstMedia && (
                  <MediaRenderer
                    media={firstMedia}
                    alt={item?.itemName ?? ''}
                    thumbnailMode={firstMedia.type === 'video'}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                )}

                <Badge
                  className={`absolute top-2 left-2 backdrop-blur-md !rounded-lg shadow-lg z-[5] ${
                    item?.availability
                      ? 'bg-white/10 border border-emerald-300/30'
                      : 'bg-white/10 border border-neutral-300/30'
                  }`}
                  count={
                    <div
                      className={`px-1 py-1 text-[10px] !flex gap-1 items-center font-semibold ${
                        item?.availability ? 'text-emerald-100' : 'text-neutral-200'
                      }`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full ${
                          item?.availability
                            ? 'bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                            : 'bg-neutral-300'
                        }`}
                      />
                      <span>{item?.availability ? 'Available' : 'Sold Out'}</span>
                    </div>
                  }
                />

                <div className="absolute top-2 right-2 z-[5]">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm ${
                      item?.condition === 'Brand New'
                        ? 'bg-green-500/90 text-white'
                        : item?.condition === 'Uk Used'
                          ? 'bg-blue/90 text-white'
                          : 'bg-yellow-500/90 text-white'
                    }`}
                  >
                    {item?.condition}
                  </span>
                </div>

                {item?.sponsored && (
                  <div className="absolute bottom-2 left-2 z-[5]">
                    <span className="bg-gradient-to-r from-blue to-indigo-500 text-white px-2 py-1 rounded-full text-[10px] font-semibold shadow-lg">
                      Sponsored
                    </span>
                  </div>
                )}

                {item?.availability && maxQty > 0 && maxQty <= 5 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full z-[5]">
                    {maxQty} left
                  </div>
                )}

                {item?.media?.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-[5]">
                    {item.media.slice(0, 5).map((m: any, idx: number) => (
                      <div
                        key={idx}
                        className={`w-1.5 h-1.5 rounded-full ${
                          idx === 0 ? 'bg-white' : 'bg-white/40'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>

              {/* Details */}
              <div className="p-3 flex flex-col flex-grow">
                <div
                  className="flex items-center gap-1.5 mb-1.5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVendorClick(item);
                  }}
                >
                  {item.postUserProfile?.profilePicUrl && (
                    <img
                      src={item.postUserProfile?.profilePicUrl}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover"
                    />
                  )}
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate  transition-colors">
                    {item.postUserProfile?.displayName || item.postUserProfile?.userName}
                  </span>
                  {item.postUserProfile?.isVerified && (
                    <i
                      className={`ri-verified-badge-fill ${
                        item.postUserProfile?.isSuperVerified ? 'text-[#D4A017]' : 'text-[#1D9BF0]'
                      } text-[14px] flex-shrink-0`}
                    />
                  )}
                </div>

                <h3
                  className="font-semibold text-sm dark:text-white mb-1 line-clamp-2 cursor-pointer  transition-colors"
                  onClick={() => handleGridItemClick(item)}
                >
                  {item?.itemName}
                </h3>

                {!item?.isBuyable && (
                  <span className="inline-flex items-center self-start px-1.5 py-0.5 text-[9px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full mb-1">
                    Seller Listing
                  </span>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    {numberFormat((item?.askingPrice?.price ?? 0) / 100, Currencies.NGN)}
                  </span>
                  {item?.askingPrice?.negotiable && (
                    <span className="text-[9px] bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-full font-medium">
                      Negotiable
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-3 flex-grow">
                  {item?.description}
                </p>

                {item?.productTags && item.productTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.productTags.slice(0, 2).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[9px] font-medium bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.productTags.length > 2 && (
                      <span className="px-2 py-0.5 text-[9px] font-medium bg-neutral-100 dark:bg-zinc-800 text-neutral-600 dark:text-neutral-400 rounded-full">
                        +{item.productTags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="space-y-1.5">
                  {item?.isBuyable ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBuyNow(item);
                          }}
                          disabled={isSoldOut}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                            isSoldOut
                              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue to-indigo-700 hover:from-blue hover:to-indigo-800 text-white hover:shadow-md'
                          }`}
                        >
                          <ShoppingBag size={14} /> Buy Now
                        </button>
                        <Tooltip
                          title={
                            isSoldOut
                              ? 'Sold out'
                              : isMaxQty
                                ? `Max qty (${maxQty})`
                                : itemInCart
                                  ? 'In cart'
                                  : 'Add to cart'
                          }
                        >
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleAddToCart(item);
                            }}
                            disabled={isSoldOut || isMaxQty}
                            className={`p-2 rounded-lg border shadow-sm transition-colors ${
                              isSoldOut || isMaxQty
                                ? 'bg-neutral-100 border-neutral-200 text-neutral-300 cursor-not-allowed'
                                : itemInCart
                                  ? 'bg-blue-50 border-blue text-blue'
                                  : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-700 dark:border-neutral-600 text-neutral-500 hover:border-blue '
                            }`}
                          >
                            <ShoppingCart size={14} />
                          </button>
                        </Tooltip>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleWhatsAppMessage(item);
                          }}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                        >
                          <MessageCircle size={14} /> WhatsApp
                        </button>
                        <Tooltip title="Remove from saved">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBookmark(item);
                            }}
                            disabled={isItemRemoving}
                            className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 shadow-sm disabled:opacity-50"
                          >
                            {isItemRemoving ? (
                              <Loader2 size={16} className="animate-spin text-neutral-400" />
                            ) : (
                              <BookmarkX size={16} className="text-pink-500" />
                            )}
                          </motion.button>
                        </Tooltip>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleWhatsAppMessage(item);
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                      >
                        <MessageCircle size={14} /> WhatsApp
                      </button>
                      <Tooltip title="Remove from saved">
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark(item);
                          }}
                          disabled={isItemRemoving}
                          className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 shadow-sm flex items-center justify-center gap-1.5 text-xs text-neutral-500 disabled:opacity-50"
                        >
                          {isItemRemoving ? (
                            <Loader2 size={14} className="animate-spin text-neutral-400" />
                          ) : (
                            <>
                              <BookmarkX size={14} className="text-pink-500" /> Remove
                            </>
                          )}
                        </motion.button>
                      </Tooltip>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          );
        })}
      </motion.div>
    );
  };

  // ══════════════════════════════════════════════════════════════════════
  // LIST VIEW
  // ══════════════════════════════════════════════════════════════════════

  const renderProductList = () => {
    if (filteredItems?.length === 0) return renderEmptyState();

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-4xl mx-auto"
      >
        {filteredItems.map((item, idx) => (
          <motion.div
            key={item?.id ?? idx}
            variants={itemVariants}
            className="bg-white dark:bg-neutral-800 rounded-lg transition-all duration-300"
          >
            <ModernItemPost
              postUserProfile={item?.postUserProfile ?? {}}
              sponsored={item?.sponsored ?? false}
              description={item?.description ?? ''}
              media={item?.media ?? []}
              askingPrice={item?.askingPrice ?? {}}
              condition={item?.condition ?? 'Brand New'}
              itemName={item?.itemName ?? ''}
              comments={item?.comments ?? []}
              productTags={item?.productTags ?? []}
              id={item?.id ?? ''}
              quantity={item?.quantity ?? 1}
              setSelectedProductId={setSelectedProductId}
              availability={item?.availability ?? true}
              isBuyable={item?.isBuyable ?? false}
              listingType={item?.listingType ?? 'self-listing'}
            />
          </motion.div>
        ))}
      </motion.div>
    );
  };

  const renderSkeletons = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <ProductListingSkeleton />
        </div>
      ))}
    </div>
  );

  // ── Mobile full-screen Product view ─────────────────────────────────
  if (selectedProductId !== '' && selectedProduct && isMobile) {
    const cartItem = cartItems?.find((i: CartItem) => i.id === selectedProduct.id);

    return (
      <AnimatePresence mode="wait">
        <Product
          key={selectedProductId}
          item={selectedProduct}
          isInCart={isInCart(selectedProduct.id ?? '')}
          isSaved={true}
          cartQuantity={cartItem?.quantity || 0}
          onAddToCart={() => handleAddToCart(selectedProduct)}
          onBuyNow={() => handleBuyNow(selectedProduct)}
          onToggleSave={() => handleBookmark(selectedProduct)}
          onWhatsAppMessage={() => handleWhatsAppMessage(selectedProduct)}
          onShare={() => handleShare(selectedProduct)}
          onGoBack={() => setSelectedProductId('')}
          setSelectedProductId={setSelectedProductId}
        />
      </AnimatePresence>
    );
  }

  const totalCount = savedCount || savedItemsList.length || 0;

  return (
    <div className="min-h-screen dark:bg-neutral-900/50">
      <div className="w-full !max-w-7xl mx-auto">
        <div className="mb-8">
          <div
            className={`py-5 ${
              isMobile ? 'px-2' : ''
            } sticky top-0 z-20 backdrop-blur-sm bg-white dark:bg-neutral-800`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">
                My Saved Products
                {totalCount > 0 && (
                  <span className="ml-2 text-sm font-normal text-neutral-400">({totalCount})</span>
                )}
              </h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewChange('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    viewType === 'grid'
                      ? 'bg-blue-50 text-blue dark:bg-blue/30 dark:text-blue'
                      : 'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                  }`}
                >
                  <Grid size={16} />
                  {!isMobile && <span className="font-medium">Grid</span>}
                </button>
                <button
                  onClick={() => handleViewChange('list')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    viewType === 'list'
                      ? 'bg-blue-50 text-blue dark:bg-blue/30 dark:text-blue'
                      : 'text-neutral-500 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-700'
                  }`}
                >
                  <List size={16} />
                  {!isMobile && <span className="font-medium">List</span>}
                </button>
              </div>
            </div>
            <div className="flex-1 relative">
              <Input
                value={searchValue}
                onChange={(e) => debouncedChangeHandler(e.target.value)}
                placeholder="Search Saved Products..."
                className={`${
                  isMobile ? 'h-10' : 'h-12'
                } !w-full pl-11 pr-4 rounded-xl border-neutral-200 hover:border-blue focus:border-blue transition-colors`}
                suffix={
                  searchValue && (
                    <X
                      size={16}
                      className="text-neutral-400 hover:text-neutral-600 cursor-pointer"
                      onClick={() => debouncedChangeHandler('')}
                    />
                  )
                }
                style={{ width: '100%' }}
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 z-10"
                size={18}
              />
            </div>
          </div>

          <div className={`${isMobile ? 'px-0 mb-10' : ''} py-6`}>
            {isLoadingSaved
              ? renderSkeletons()
              : viewType === 'grid'
                ? renderProductGrid()
                : renderProductList()}

            {/* Infinite scroll sentinel */}
            {!isLoadingSaved && hasMore && !searchValue && (
              <>
                <div ref={loadMoreRef} className="h-1" />
                {isFetchingSaved && <LoadMoreSkeleton />}
              </>
            )}

            {/* End of list */}
            {!isLoadingSaved && !hasMore && savedItemsList.length > 0 && !searchValue && (
              <p className="text-center text-xs text-neutral-400 py-6">
                You've seen all {totalCount} saved item{totalCount !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>

        {/* Desktop Item Detail Modal */}
        {gridModalItem && (
          <div onClick={(e) => e.stopPropagation()}>
            <ItemDetailModal
              open={gridModalOpen}
              onClose={() => {
                setGridModalOpen(false);
                setGridModalItem(null);
              }}
              item={{
                description: gridModalItem?.description ?? '',
                sponsored: gridModalItem?.sponsored ?? false,
                postUserProfile: gridModalItem?.postUserProfile ?? {},
                media: gridModalItem?.media ?? [],
                askingPrice: gridModalItem?.askingPrice ?? {},
                condition: gridModalItem?.condition ?? 'Brand New',
                comments: gridModalItem?.comments ?? [],
                itemName: gridModalItem?.itemName ?? '',
                id: gridModalItem?.id ?? '',
                productTags: gridModalItem?.productTags ?? [],
                quantity: gridModalItem?.quantity ?? 1,
                isBuyable: gridModalItem?.isBuyable ?? false,
                listingType: gridModalItem?.listingType ?? 'self-listing',
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default SavedItems;
