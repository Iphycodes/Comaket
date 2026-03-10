import React, { useRef, useEffect, useCallback, useMemo, useState } from 'react';
import { Badge, Col, Empty, Row, Tooltip } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  SlidersHorizontal,
  Grid,
  List,
  MessageCircle,
  Bookmark,
  ShoppingCart,
  ShoppingBag,
  X,
} from 'lucide-react';
import FilterPanel from './lib/filter-panel';
import SearchBar from './lib/search-bar';
import ItemDetailModal from '../item-detail-modal';
import ProductListingSkeleton from '../item-post-new/lib/product-listing-skeleton';
import Product from '../product';
import { numberFormat } from '@grc/_shared/helpers';
import { CREATOR_INDUSTRIES, Currencies } from '@grc/_shared/constant';
import NotificationsDrawer from '../notification-drawer';
import { Shop } from 'iconsax-react';
import MediaRenderer from '../media-renderer';
import ModernItemPost from '../item-post-new';
import { MarketFilters } from '@grc/app/(ui)/(apps)/(home)/page';
import { Category } from '@grc/services/categories';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface MarketProps {
  listings: any[];
  totalListings: number;
  isLoading: boolean;
  isLoadingMore: boolean;
  isFetchingListings: boolean;
  hasMore: boolean;
  viewType: string;
  showFilters: boolean;
  isMobile: boolean;
  selectedProductId: string;
  selectedProduct: any;
  gridModalOpen: boolean;
  gridModalItem: any;
  filters: MarketFilters;
  categoryTree: Category[];
  onCategorySelect: (categorySlug: string | null) => void;
  onSubCategorySelect: (subCategorySlug: string | null) => void;
  onLoadMore: () => void;
  onSearch: (searchValue: string, category: string) => void;
  onApplyFilters: (filters: MarketFilters) => void;
  onResetFilters: () => void;
  onViewChange: (view: string) => void;
  onToggleFilters: () => void;
  onAddToCart: (item: any) => void;
  onBuyNow: (item: any) => void;
  onToggleSave: (item: any) => void;
  onWhatsAppMessage: (item: any) => void;
  onVendorClick: (item: any) => void;
  onGridItemClick: (item: any) => void;
  onCloseGridModal: () => void;
  onSelectProduct: React.Dispatch<React.SetStateAction<string>>;
  onShare: (item: any) => void;
  isInCart: (itemId: string | number) => boolean;
  isSaved: (itemId: string | number) => boolean;
  cartItems: any[];
  isAddingToCart: boolean;
  isTogglingSave: boolean;
}

const Market: React.FC<MarketProps> = ({
  listings,
  totalListings,
  isLoading,
  isLoadingMore,
  isFetchingListings,
  hasMore,
  viewType,
  showFilters,
  isMobile,
  selectedProductId,
  selectedProduct,
  gridModalOpen,
  gridModalItem,
  filters,
  categoryTree,
  onCategorySelect,
  onSubCategorySelect,
  onLoadMore,
  onSearch,
  onApplyFilters,
  onResetFilters,
  onViewChange,
  onToggleFilters,
  onAddToCart,
  onBuyNow,
  onToggleSave,
  onWhatsAppMessage,
  onVendorClick,
  onGridItemClick,
  onCloseGridModal,
  onSelectProduct,
  onShare,
  isInCart,
  isSaved,
  cartItems,
  // isAddingToCart,
  // isTogglingSave,
}) => {
  // ── Category navigation data ──
  // Use backend category tree if available, otherwise fall back to CREATOR_INDUSTRIES
  const displayCategories = useMemo(() => {
    if (categoryTree && categoryTree.length > 0) {
      return categoryTree.map((cat) => ({
        id: cat.slug || cat._id,
        label: cat.name,
        icon: cat.icon || '',
        children: (cat.children || []).map((child) => ({
          id: child.slug || child._id,
          label: child.name,
          icon: child.icon || '',
        })),
      }));
    }
    // Fallback: use CREATOR_INDUSTRIES as flat categories (no subcategories)
    return CREATOR_INDUSTRIES.map((ind) => ({
      id: ind.id,
      label: ind.label,
      icon: ind.icon || '',
      children: [] as { id: string; label: string; icon: string }[],
    }));
  }, [categoryTree]);

  // Find subcategories for the currently selected category
  const selectedCategoryChildren = useMemo(() => {
    if (!filters.category) return [];
    const found = displayCategories.find((cat) => cat.id === filters.category);
    return found?.children || [];
  }, [filters.category, displayCategories]);

  // ── Mobile scroll-hide header (Twitter-style) ──
  const [mobileHeaderHidden, setMobileHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const headerRef = useRef<HTMLDivElement | null>(null);

  const handleScroll = useCallback(() => {
    if (!scrollContainerRef.current) return;
    const currentY = scrollContainerRef.current.scrollTop;
    const delta = currentY - lastScrollYRef.current;

    if (delta > 5 && currentY > 80) {
      // Scrolling down past threshold → hide smoothly
      setMobileHeaderHidden(true);
    } else if (delta < -3) {
      // Scrolling up → show immediately
      setMobileHeaderHidden(false);
    }

    lastScrollYRef.current = currentY;
  }, []);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // ── Infinite scroll sentinel ──
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Cleanup old observer whenever deps change or on unmount
  useEffect(() => {
    return () => {
      observerRef.current?.disconnect();
    };
  }, []);

  // Callback ref that fires when sentinel mounts/unmounts
  const setSentinelRef = useCallback(
    (node: HTMLDivElement | null) => {
      // Cleanup previous observer
      observerRef.current?.disconnect();
      observerRef.current = null;
      sentinelRef.current = node;

      if (!node || !hasMore || isFetchingListings) return;

      const observer = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting) {
            onLoadMore();
          }
        },
        { rootMargin: '200px' }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [hasMore, isFetchingListings, onLoadMore]
  );

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.06, duration: 0.3 } },
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  // ── EMPTY STATE ──
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
              No items found
            </h3>
            <p className="text-neutral-500 dark:text-neutral-400">
              Try adjusting your search or filters.
            </p>
          </div>
        }
      />
    </motion.div>
  );

  // ── SKELETON LOADERS ──
  const renderSkeletonGrid = () => (
    <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <div
          key={i}
          className="bg-white dark:bg-neutral-800 overflow-hidden shadow-sm animate-pulse"
        >
          <div className="aspect-square bg-neutral-200 dark:bg-neutral-700" />
          <div className="p-3 space-y-2">
            <div className="flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700" />
              <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-700 rounded" />
            </div>
            <div className="h-4 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
            <div className="h-6 w-24 bg-neutral-200 dark:bg-neutral-700 rounded" />
            <div className="h-3 w-full bg-neutral-200 dark:bg-neutral-700 rounded" />
            <div className="h-9 w-full bg-neutral-200 dark:bg-neutral-700 rounded-lg" />
          </div>
        </div>
      ))}
    </div>
  );

  const renderSkeletonList = () => (
    <div className="space-y-6">
      {[1, 2, 3].map((i) => (
        <div key={i}>
          <ProductListingSkeleton />
        </div>
      ))}
    </div>
  );

  // ── GRID VIEW ──
  const renderProductGrid = () => {
    if (!isLoading && listings.length === 0) return renderEmptyState();

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {listings.map((item: any) => {
          const itemInCart = isInCart(item.id ?? '');
          const itemIsSaved = isSaved(item.id ?? '');
          const isSoldOut = !item.availability;
          const maxQty = item.quantity ?? 1;
          const existing = cartItems?.find((i: any) => i.listingId === item.id?.toString());
          const currentQty = existing?.quantity || 0;
          const isMaxQty = currentQty >= maxQty;
          const firstMedia = item.media?.[0];

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-white dark:bg-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col cursor-pointer"
              onClick={() => onGridItemClick(item)}
            >
              {/* Image */}
              <div
                className="relative aspect-square cursor-pointer group overflow-hidden"
                onClick={() => onGridItemClick(item)}
              >
                {firstMedia && (
                  <MediaRenderer
                    media={firstMedia}
                    alt={item.itemName ?? ''}
                    thumbnailMode={firstMedia.type === 'video'}
                    className="group-hover:scale-110 transition-transform duration-300"
                  />
                )}

                <Badge
                  className={`absolute top-2 left-2 backdrop-blur-md !rounded-lg shadow-lg z-[5] ${
                    item.availability
                      ? 'bg-white/10 border border-emerald-300/30'
                      : 'bg-white/10 border border-neutral-300/30'
                  }`}
                  count={
                    <div
                      className={`px-1 py-1 text-[10px] !flex gap-1 items-center font-semibold ${
                        item.availability ? 'text-emerald-100' : 'text-neutral-200'
                      }`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full ${
                          item.availability
                            ? 'bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                            : 'bg-neutral-300'
                        }`}
                      />
                      <span>{item.availability ? 'Available' : 'Sold Out'}</span>
                    </div>
                  }
                />

                <div className="absolute top-2 right-2 z-[5]">
                  <span
                    className={`px-2 py-1 rounded-full text-[10px] font-semibold backdrop-blur-sm ${
                      item.condition === 'Brand New'
                        ? 'bg-green-500/90 text-white'
                        : item.condition === 'Fairly Used'
                          ? 'bg-blue/90 text-white'
                          : 'bg-yellow-500/90 text-white'
                    }`}
                  >
                    {item.condition}
                  </span>
                </div>

                {item.availability && maxQty > 0 && maxQty <= 5 && (
                  <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full z-[5]">
                    {maxQty} left
                  </div>
                )}

                {item.media?.length > 1 && (
                  <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex items-center gap-1 z-[5]">
                    {item.media.slice(0, 5).map((_: any, idx: number) => (
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
                    onVendorClick(item);
                  }}
                >
                  {item.postUserProfile?.profilePicUrl ? (
                    <img
                      src={item.postUserProfile?.profilePicUrl || ''}
                      alt=""
                      className="w-5 h-5 rounded-full object-cover"
                      onError={(e) => {
                        const img = e.target as HTMLImageElement;
                        img.onerror = null; // ← prevent infinite loop
                        img.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-5 h-5 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
                  )}
                  <span className="text-[11px] text-neutral-500 dark:text-neutral-400 font-medium truncate hover:text-blue transition-colors">
                    {item.postUserProfile?.displayName}
                  </span>
                  {item?.postUserProfile?.isVerified && (
                    <i
                      className={`ri-verified-badge-fill ${
                        item?.postUserProfile?.isSuperVerified ? 'text-[#D4A017]' : 'text-[#1D9BF0]'
                      } text-[18px]`}
                    />
                  )}
                </div>

                <h3
                  className="font-semibold text-sm dark:text-white mb-1 line-clamp-2 cursor-pointer hover:text-blue transition-colors"
                  onClick={() => onGridItemClick(item)}
                >
                  {item.itemName}
                </h3>

                {!item.isBuyable && (
                  <span className="inline-flex items-center self-start px-1.5 py-0.5 text-[9px] font-medium bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 rounded-full mb-1">
                    Seller Listing
                  </span>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    {numberFormat((item.askingPrice?.price ?? 0) / 100, Currencies.NGN)}
                  </span>
                  {item.askingPrice?.negotiable && (
                    <span className="text-[9px] bg-orange-50 dark:bg-orange-900/20 text-orange-600 dark:text-orange-400 px-1.5 py-0.5 rounded-full font-medium">
                      Negotiable
                    </span>
                  )}
                </div>

                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-3 flex-grow">
                  {item.description}
                </p>

                {item.productTags?.length > 0 && (
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
                  {item.isBuyable ? (
                    <>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onBuyNow(item);
                          }}
                          disabled={isSoldOut}
                          className={`flex-1 py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm ${
                            isSoldOut
                              ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                              : 'bg-gradient-to-r from-blue to-indigo-700 hover:from-blue hover:to-indigo-800 text-white hover:shadow-md'
                          }`}
                        >
                          <ShoppingBag size={14} />
                          Buy Now
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
                              onAddToCart(item);
                            }}
                            disabled={isSoldOut || isMaxQty}
                            className={`p-2 rounded-lg border shadow-sm transition-colors ${
                              isSoldOut || isMaxQty
                                ? 'bg-neutral-100 border-neutral-200 text-neutral-300 cursor-not-allowed'
                                : itemInCart
                                  ? 'bg-blue-50 border-blue text-blue'
                                  : 'bg-neutral-50 border-neutral-200 dark:bg-neutral-700 dark:border-neutral-600 text-neutral-500 hover:border-blue hover:text-blue'
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
                            onWhatsAppMessage(item);
                          }}
                          className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                        >
                          <MessageCircle size={14} />
                          WhatsApp
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleSave(item);
                          }}
                          className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 shadow-sm"
                        >
                          <Bookmark
                            size={16}
                            className={`${
                              itemIsSaved ? 'fill-pink-500 text-pink-500' : 'text-neutral-400'
                            } transition-colors`}
                          />
                        </motion.button>
                      </div>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onWhatsAppMessage(item);
                        }}
                        className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white py-2 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-all shadow-sm hover:shadow-md"
                      >
                        <MessageCircle size={14} />
                        Message on WhatsApp
                      </button>
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onToggleSave(item);
                        }}
                        className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 shadow-sm flex items-center justify-center gap-1.5 text-xs text-neutral-500"
                      >
                        <Bookmark
                          size={14}
                          className={`${
                            itemIsSaved ? 'fill-pink-500 text-pink-500' : 'text-neutral-400'
                          } transition-colors`}
                        />
                        Save
                      </motion.button>
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

  // ── LIST VIEW ──
  const renderProductList = () => {
    if (!isLoading && listings.length === 0) return renderEmptyState();

    return (
      <div className="space-y-6 max-w-4xl mx-auto">
        {listings.map((item: any) => (
          <div key={item.id}>
            <ModernItemPost
              postUserProfile={item.postUserProfile ?? {}}
              sponsored={item.sponsored ?? false}
              description={item.description ?? ''}
              media={item.media ?? []}
              askingPrice={item.askingPrice ?? {}}
              condition={item.condition ?? 'Brand New'}
              itemName={item.itemName ?? ''}
              comments={item.comments ?? []}
              productTags={item.productTags ?? []}
              id={item.id ?? ''}
              quantity={item.quantity ?? 1}
              setSelectedProductId={onSelectProduct}
              availability={item.availability ?? true}
              isBuyable={item.isBuyable ?? false}
              listingType={item.listingType ?? 'self-listing'}
            />
          </div>
        ))}
      </div>
    );
  };

  // ── Mobile full-screen Product view ──
  if (selectedProductId !== '' && selectedProduct && isMobile) {
    return (
      <AnimatePresence mode="wait">
        <Product
          key={selectedProductId}
          item={selectedProduct}
          setSelectedProductId={onSelectProduct}
          isInCart={isInCart(selectedProduct.id ?? '')}
          isSaved={isSaved(selectedProduct.id ?? '')}
          cartQuantity={
            cartItems?.find(
              (ci: any) =>
                ci.listingId === selectedProduct.id?.toString() ||
                ci.id === selectedProduct.id?.toString()
            )?.quantity || 0
          }
          // isAddingToCart={isAddingToCart}
          // isTogglingSave={isTogglingSave}
          onAddToCart={() => onAddToCart(selectedProduct)}
          onBuyNow={() => onBuyNow(selectedProduct)}
          onToggleSave={() => onToggleSave(selectedProduct)}
          onWhatsAppMessage={() => onWhatsAppMessage(selectedProduct)}
          onShare={() => onShare(selectedProduct)}
          onGoBack={() => onSelectProduct('')}
        />
      </AnimatePresence>
    );
  }

  // ════════════════════════════════════════════════════════════════════════
  // MAIN RENDER
  // ════════════════════════════════════════════════════════════════════════

  console.log('MARKET DEBUG:', {
    hasMore,
    isLoading,
    listingsCount: listings.length,
    totalListings,
  });

  return (
    <div
      ref={scrollContainerRef}
      className="min-h-screen dark:!bg-transparent w-full relative"
      style={{ height: '100vh', overflowY: 'auto' }}
    >
      <Row gutter={[isMobile ? 0 : 24, 0]} className="w-full max-w-screen-7xl mx-auto">
        <Col lg={24} className="relative w-full p-0">
          {/* Sticky Search & Filter Bar */}
          <motion.div
            ref={headerRef}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className={`sticky top-0 z-20 backdrop-blur-md bg-white/80 dark:bg-neutral-900/80 shadow-sm ${
              isMobile ? 'pt-8' : ''
            }`}
            style={{
              transform: mobileHeaderHidden ? 'translateY(-100%)' : 'translateY(0)',
              transition: mobileHeaderHidden
                ? 'transform 0.3s ease-out' // smooth hide
                : 'transform 0.15s ease-out', // instant show
            }}
          >
            <div className={`p-4 ${isMobile ? 'px-1 pt-2' : ''}`}>
              <div className="w-full flex items-center justify-between gap-3 mb-3">
                <div className="flex-1">
                  <SearchBar section="market" onSearch={onSearch} />
                </div>
              </div>

              {/* ── Horizontal Scrollable Category Tags ── */}
              <div className="mb-2">
                <div
                  className="flex items-center gap-2 overflow-x-auto pb-1.5"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <style>{`.cat-scroll::-webkit-scrollbar { display: none; }`}</style>
                  {/* All button */}
                  <button
                    onClick={() => onCategorySelect(null)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
                      !filters.category
                        ? 'bg-blue text-white border-blue shadow-sm'
                        : 'bg-neutral-50 dark:bg-zinc-800/60 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-700 hover:border-neutral-300 dark:hover:border-zinc-600'
                    }`}
                  >
                    All
                  </button>
                  {displayCategories.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => onCategorySelect(filters.category === cat.id ? null : cat.id)}
                      className={`flex-shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
                        filters.category === cat.id
                          ? 'bg-blue text-white border-blue shadow-sm'
                          : 'bg-neutral-50 dark:bg-zinc-800/60 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-700 hover:border-neutral-300 dark:hover:border-zinc-600'
                      }`}
                    >
                      {cat.icon && <i className={`${cat.icon} text-[11px]`} />}
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Subcategories row */}
                <AnimatePresence>
                  {selectedCategoryChildren.length > 0 && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div
                        className="flex items-center gap-2 overflow-x-auto pt-1.5"
                        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                      >
                        <span className="text-[10px] text-neutral-400 dark:text-neutral-500 flex-shrink-0 pl-1">
                          Sub:
                        </span>
                        <button
                          onClick={() => onSubCategorySelect(null)}
                          className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border whitespace-nowrap ${
                            !filters.subCategory
                              ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                              : 'bg-neutral-50 dark:bg-zinc-800/60 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-zinc-700 hover:border-neutral-300 dark:hover:border-zinc-600'
                          }`}
                        >
                          All
                        </button>
                        {selectedCategoryChildren.map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() =>
                              onSubCategorySelect(filters.subCategory === sub.id ? null : sub.id)
                            }
                            className={`flex-shrink-0 inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border whitespace-nowrap ${
                              filters.subCategory === sub.id
                                ? 'bg-indigo-500 text-white border-indigo-500 shadow-sm'
                                : 'bg-neutral-50 dark:bg-zinc-800/60 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-zinc-700 hover:border-neutral-300 dark:hover:border-zinc-600'
                            }`}
                          >
                            {sub.icon && <i className={`${sub.icon} text-[10px]`} />}
                            {sub.label}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-1 min-w-0 overflow-x-auto scrollbar-hide">
                  <button
                    onClick={onToggleFilters}
                    className="flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-neutral-100 transition-colors flex-shrink-0"
                  >
                    <SlidersHorizontal size={16} />
                    {showFilters ? 'Hide' : 'Filters'}
                  </button>

                  {Object.keys(filters).length > 0 && (
                    <>
                      <span className="text-[11px] text-neutral-400 dark:text-neutral-500 flex-shrink-0">
                        ·
                      </span>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {filters.condition && (
                          <span
                            onClick={() => onApplyFilters({ ...filters, condition: undefined })}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue/10 text-blue cursor-pointer hover:bg-blue/20 transition-colors whitespace-nowrap"
                          >
                            {filters.condition === 'brand_new'
                              ? 'Brand New'
                              : filters.condition === 'fairly_used'
                                ? 'Fairly Used'
                                : filters.condition === 'refurbished'
                                  ? 'Refurbished'
                                  : filters.condition}
                            <X size={10} />
                          </span>
                        )}
                        {filters.category && (
                          <span
                            onClick={() => onCategorySelect(null)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue/10 text-blue cursor-pointer hover:bg-blue/20 transition-colors whitespace-nowrap"
                          >
                            {displayCategories.find((c) => c.id === filters.category)?.label ||
                              CREATOR_INDUSTRIES.find((i: any) => i.id === filters.category)
                                ?.label ||
                              filters.category}
                            <X size={10} />
                          </span>
                        )}
                        {filters.subCategory && (
                          <span
                            onClick={() => onSubCategorySelect(null)}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-indigo-500/10 text-indigo-600 cursor-pointer hover:bg-indigo-500/20 transition-colors whitespace-nowrap"
                          >
                            {selectedCategoryChildren.find((c) => c.id === filters.subCategory)
                              ?.label || filters.subCategory}
                            <X size={10} />
                          </span>
                        )}
                        {(filters.minPrice !== undefined || filters.maxPrice !== undefined) && (
                          <span
                            onClick={() =>
                              onApplyFilters({
                                ...filters,
                                minPrice: undefined,
                                maxPrice: undefined,
                              })
                            }
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue/10 text-blue cursor-pointer hover:bg-blue/20 transition-colors whitespace-nowrap"
                          >
                            {filters.minPrice
                              ? numberFormat(filters.minPrice / 100, Currencies.NGN)
                              : '₦0'}{' '}
                            –{' '}
                            {filters.maxPrice
                              ? numberFormat(filters.maxPrice / 100, Currencies.NGN)
                              : 'Any'}
                            <X size={10} />
                          </span>
                        )}
                        {filters.sort && (
                          <span
                            onClick={() => onApplyFilters({ ...filters, sort: undefined })}
                            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-blue/10 text-blue cursor-pointer hover:bg-blue/20 transition-colors whitespace-nowrap"
                          >
                            {filters.sort === 'price_asc'
                              ? 'Low→High'
                              : filters.sort === 'price_desc'
                                ? 'High→Low'
                                : filters.sort === 'newest'
                                  ? 'Newest'
                                  : filters.sort === 'oldest'
                                    ? 'Oldest'
                                    : filters.sort}
                            <X size={10} />
                          </span>
                        )}
                        <button
                          onClick={onResetFilters}
                          className="text-[10px] text-neutral-400 hover:text-red-500 transition-colors flex-shrink-0"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    </>
                  )}

                  {!isLoading && Object.keys(filters).length === 0 && (
                    <span className="text-xs text-neutral-400 flex-shrink-0">
                      {totalListings} item{totalListings !== 1 ? 's' : ''}
                    </span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => onViewChange('grid')}
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
                    onClick={() => onViewChange('list')}
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

              <AnimatePresence>
                {showFilters && (
                  // <motion.div
                  //   initial={{ height: 0, opacity: 0 }}
                  //   animate={{ height: 'auto', opacity: 1 }}
                  //   exit={{ height: 0, opacity: 0 }}
                  //   transition={{ duration: 0.2 }}
                  //   className="overflow-hidden"
                  // >
                  <FilterPanel
                    filters={filters}
                    onApplyFilters={onApplyFilters}
                    onResetFilters={onResetFilters}
                    // open={showFilters}
                    // onClose={() => setShowFilters(false)}
                  />
                  // </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Items */}
          <div className={`${isMobile ? 'px-0 mb-10' : 'px-4'} py-6`}>
            {isLoading ? (
              viewType === 'grid' ? (
                renderSkeletonGrid()
              ) : (
                renderSkeletonList()
              )
            ) : (
              <motion.div variants={containerVariants} initial="hidden" animate="visible">
                {viewType === 'grid' ? renderProductGrid() : renderProductList()}
              </motion.div>
            )}

            {/* Loading more skeletons */}
            {isLoadingMore && (
              <div className="py-8">
                {viewType === 'grid' ? renderSkeletonGrid() : renderSkeletonList()}
              </div>
            )}

            {/* Sentinel for IntersectionObserver */}
            {hasMore && !isLoading && <div ref={setSentinelRef} className="h-4 w-full" />}

            {/* End of results */}
            {!hasMore && listings.length > 0 && !isLoading && (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-400">
                  You&apos;ve seen all {totalListings} items
                </p>
              </div>
            )}
          </div>
        </Col>
      </Row>

      {/* Grid View Item Detail Modal (desktop) */}
      {gridModalItem && (
        <ItemDetailModal
          open={gridModalOpen}
          onClose={onCloseGridModal}
          item={{
            description: gridModalItem.description ?? '',
            sponsored: gridModalItem.sponsored ?? false,
            postUserProfile: gridModalItem.postUserProfile ?? {},
            media: gridModalItem.media ?? [],
            askingPrice: gridModalItem.askingPrice ?? {},
            condition: gridModalItem.condition ?? 'Brand New',
            comments: gridModalItem.comments ?? [],
            itemName: gridModalItem.itemName ?? '',
            id: gridModalItem.id ?? '',
            productTags: gridModalItem.productTags ?? [],
            quantity: gridModalItem.quantity ?? 1,
            isBuyable: gridModalItem.isBuyable ?? false,
            listingType: gridModalItem.listingType ?? 'self-listing',
          }}
        />
      )}

      <NotificationsDrawer />
    </div>
  );
};

export default Market;
