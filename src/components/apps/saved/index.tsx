'use client';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { Badge, Input, Tooltip, message as antMessage } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Grid,
  List,
  X,
  MessageCircle,
  Bookmark,
  ShoppingCart,
  ShoppingBag,
} from 'lucide-react';
import { useSearchParams, useRouter } from 'next/navigation';
import { mockMarketItems, Currencies } from '@grc/_shared/constant';
import ModernItemPost from '@grc/components/apps/item-post-new';
import { useSearch } from '@grc/hooks/useSearch';
import ProductListingSkeleton from '../item-post-new/lib/product-listing-skeleton';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { MarketItem } from '@grc/_shared/namespace';
import { CartItem } from '@grc/_shared/namespace/cart';
import { setBuyNowItem } from '@grc/_shared/namespace/buy';
import { numberFormat } from '@grc/_shared/helpers';
import MediaRenderer, { getFirstImageUrl } from '../media-renderer';
import { AppContext } from '@grc/app-context';
import Product from '../product';
import ItemDetailModal from '../item-detail-modal';
import { Shop } from 'iconsax-react';
import { Empty } from 'antd';

const SavedItems = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const [viewType, setViewType] = useState(searchParams?.get('view') || 'list');
  const { searchValue, debouncedChangeHandler } = useSearch();
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { addToCart, isInCart, cartItems } = useContext(AppContext);

  // Product detail states
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [gridModalOpen, setGridModalOpen] = useState(false);
  const [gridModalItem, setGridModalItem] = useState<MarketItem | null>(null);
  const [isSaved, setIsSaved] = useState<boolean>(false);

  // TODO: Replace with actual saved items from API/localStorage
  const savedItemsList = mockMarketItems;

  const selectedProduct = useMemo(
    () => savedItemsList?.find((item) => item.id?.toString() === selectedProductId),
    [selectedProductId, savedItemsList]
  );

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleViewChange = (view: string) => {
    setViewType(view);
    const newParams = new URLSearchParams(searchParams?.toString());
    newParams.set('view', view);
    router.push(`?${newParams.toString()}`, { scroll: false });
  };

  const handleVendorClick = (item: MarketItem) => {
    const vendorId = item.postUserProfile?.id || item.postUserProfile?.userName;
    if (vendorId) {
      router.push(`/vendors/${encodeURIComponent(vendorId)}`);
    }
  };

  const handleGridItemClick = (item: MarketItem) => {
    if (isMobile) {
      setSelectedProductId(item?.id?.toString());
    } else {
      setGridModalItem(item);
      setGridModalOpen(true);
    }
  };

  const handleBookmark = (item: MarketItem) => {
    try {
      const savedItems = JSON.parse(localStorage.getItem('savedItems') || '[]');
      if (isSaved) {
        const updatedItems = savedItems.filter((itemId: string | number) => itemId !== item?.id);
        localStorage.setItem('savedItems', JSON.stringify(updatedItems));
        setIsSaved(false);
      } else {
        if (!savedItems.includes(item?.id)) savedItems.push(item?.id);
        localStorage.setItem('savedItems', JSON.stringify(savedItems));
        setIsSaved(true);
      }
      window.dispatchEvent(new Event('savedItemsChanged'));
    } catch (error) {
      console.error('Error managing bookmarks:', error);
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
    const cartItem: CartItem = {
      id: item?.id,
      itemName: item?.itemName || '',
      description: item?.description || '',
      price: item?.askingPrice?.price || 0,
      quantity: 1,
      maxQuantity: maxQty,
      image: getFirstImageUrl(item?.media || []),
      condition: item?.condition || '',
      negotiable: item?.askingPrice?.negotiable || false,
      sellerName: item?.postUserProfile?.businessName || item?.postUserProfile?.userName || '',
    };
    addToCart(cartItem?.id);
    antMessage.success('Added to cart!');
  };

  const handleBuyNow = (item: MarketItem) => {
    const buyItem: CartItem = {
      id: item?.id,
      itemName: item?.itemName || '',
      description: item?.description || '',
      price: item?.askingPrice?.price || 0,
      quantity: 1,
      maxQuantity: item?.quantity ?? 1,
      image: getFirstImageUrl(item?.media || []),
      condition: item?.condition || '',
      negotiable: item?.askingPrice?.negotiable || false,
      sellerName: item?.postUserProfile?.businessName || item?.postUserProfile?.userName || '',
    };
    setBuyNowItem(buyItem);
    router.push('/checkout?mode=buynow');
  };

  const handleWhatsAppMessage = (item: MarketItem) => {
    const phoneNumber = item.postUserProfile?.phoneNumber || '';
    if (!phoneNumber) {
      antMessage.error('Seller phone number not available');
      return;
    }
    const formattedPrice = numberFormat(item.askingPrice?.price / 100, Currencies.NGN);
    const sellerName =
      item.postUserProfile?.businessName || item.postUserProfile?.userName || 'Seller';
    const message = `Hi, ${sellerName},\nI am interested in this item on Comaket.\n\n${item.itemName}\n${item.description}\nPrice: ${formattedPrice}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1, duration: 0.3 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const renderEmptyState = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-16"
    >
      <Empty
        image={
          <Shop size={80} className="mx-auto text-gray-300 dark:text-gray-600" strokeWidth={1} />
        }
        description={
          <div className="text-center">
            <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              No saved items
            </h3>
            <p className="text-gray-500 dark:text-gray-400">Items you save will appear here</p>
          </div>
        }
      />
    </motion.div>
  );

  /** Grid view — identical to Market grid */
  const renderProductGrid = () => {
    if (savedItemsList?.length === 0) return renderEmptyState();

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        {savedItemsList.map((item: MarketItem) => {
          const itemInCart = isInCart(item?.id ?? '');
          const isSoldOut = !item?.availability;
          const maxQty = item?.quantity ?? 1;
          const existing = cartItems?.find((i: CartItem) => i.id === item?.id);
          const currentQty = existing?.quantity || 0;
          const isMaxQty = currentQty >= maxQty;
          const firstMedia = item?.media?.[0];

          return (
            <motion.div
              key={item.id}
              variants={itemVariants}
              className="bg-white dark:bg-gray-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
            >
              {/* Image / Video Container */}
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
                      : 'bg-white/10 border border-gray-300/30'
                  }`}
                  count={
                    <div
                      className={`px-1 py-1 text-[10px] !flex gap-1 items-center font-semibold ${
                        item?.availability ? 'text-emerald-100' : 'text-gray-200'
                      }`}
                    >
                      <div
                        className={`w-1 h-1 rounded-full ${
                          item?.availability
                            ? 'bg-emerald-400 animate-pulse shadow-[0_0_12px_rgba(52,211,153,0.8)]'
                            : 'bg-gray-300'
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
                    {item.media.slice(0, 5).map((m, idx) => (
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

              {/* Product Details */}
              <div className="p-3 flex flex-col flex-grow">
                <div
                  className="flex items-center gap-1.5 mb-1.5 cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleVendorClick(item);
                  }}
                >
                  <img
                    src={item.postUserProfile?.profilePicUrl}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                  />
                  <span className="text-[11px] text-gray-500 dark:text-gray-400 font-medium truncate hover:text-blue transition-colors">
                    {item.postUserProfile?.businessName || item.postUserProfile?.userName}
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
                  className="font-semibold text-sm dark:text-white mb-1 line-clamp-2 cursor-pointer hover:text-blue transition-colors"
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

                <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3 flex-grow">
                  {item?.description}
                </p>

                {item?.productTags && item.productTags.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-3">
                    {item.productTags.slice(0, 2).map((tag: string, idx: number) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 text-[9px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                    {item.productTags.length > 2 && (
                      <span className="px-2 py-0.5 text-[9px] font-medium bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 rounded-full">
                        +{item.productTags.length - 2}
                      </span>
                    )}
                  </div>
                )}

                {/* Action Buttons — identical to Market */}
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
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
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
                              handleAddToCart(item);
                            }}
                            disabled={isSoldOut || isMaxQty}
                            className={`p-2 rounded-lg border shadow-sm transition-colors ${
                              isSoldOut || isMaxQty
                                ? 'bg-gray-100 border-gray-200 text-gray-300 cursor-not-allowed'
                                : itemInCart
                                  ? 'bg-blue-50 border-blue text-blue'
                                  : 'bg-neutral-50 border-neutral-200 dark:bg-gray-700 dark:border-gray-600 text-gray-500 hover:border-blue hover:text-blue'
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
                          <MessageCircle size={14} />
                          WhatsApp
                        </button>
                        <motion.button
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleBookmark(item);
                          }}
                          className="p-2 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 shadow-sm"
                        >
                          <Bookmark
                            size={16}
                            className={`${
                              isSaved ? 'fill-pink-500 text-pink-500' : 'text-gray-400'
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
                          handleWhatsAppMessage(item);
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
                          handleBookmark(item);
                        }}
                        className="w-full p-2 rounded-lg border border-neutral-200 dark:border-gray-600 bg-neutral-50 dark:bg-gray-700 shadow-sm flex items-center justify-center gap-1.5 text-xs text-gray-500"
                      >
                        <Bookmark
                          size={14}
                          className={`${
                            isSaved ? 'fill-pink-500 text-pink-500' : 'text-gray-400'
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

  const renderProductList = () => {
    if (savedItemsList?.length === 0) return renderEmptyState();

    return (
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-6 max-w-4xl mx-auto"
      >
        {isLoading ? (
          <div className="space-y-6">
            {[1, 2, 3].map((i) => (
              <div key={i}>
                <ProductListingSkeleton />
              </div>
            ))}
          </div>
        ) : (
          <>
            {savedItemsList.map((item, idx) => (
              <motion.div
                key={idx}
                variants={itemVariants}
                className="bg-white dark:bg-gray-800 rounded-lg transition-all duration-300"
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
          </>
        )}
      </motion.div>
    );
  };

  // ─── Mobile full-screen Product view ───
  if (selectedProductId !== '' && selectedProduct && isMobile) {
    return (
      <AnimatePresence mode="wait">
        <Product
          key={selectedProductId}
          item={selectedProduct}
          setSelectedProductId={setSelectedProductId}
        />
      </AnimatePresence>
    );
  }

  return (
    <div className="min-h-screen dark:bg-gray-900/50">
      <div className={`w-full !max-w-7xl mx-auto`}>
        <div className="mb-8">
          <div
            className={`py-5 ${
              isMobile ? 'px-2' : ''
            } sticky top-0 z-20 backdrop-blur-sm bg-white dark:bg-gray-800`}
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold dark:text-white">My Saved Products</h2>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleViewChange('grid')}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg transition-colors text-sm ${
                    viewType === 'grid'
                      ? 'bg-blue-50 text-blue dark:bg-blue/30 dark:text-blue'
                      : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
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
                      : 'text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
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
                } !w-full pl-11 pr-4 rounded-xl border-gray-200 hover:border-blue focus:border-blue transition-colors`}
                suffix={
                  searchValue && (
                    <X
                      size={16}
                      className="text-gray-400 hover:text-gray-600 cursor-pointer"
                      onClick={() => debouncedChangeHandler('')}
                    />
                  )
                }
                style={{ width: '100%' }}
              />
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
            </div>
          </div>

          <div className={`${isMobile ? 'px-0 mb-10' : ''} py-6`}>
            {viewType === 'grid' ? renderProductGrid() : renderProductList()}
          </div>
        </div>

        {/* Grid View Item Detail Modal (desktop only) */}
        {gridModalItem && (
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
        )}
      </div>
    </div>
  );
};

export default SavedItems;
