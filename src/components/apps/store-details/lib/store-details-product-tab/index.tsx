'use client';

import React, { useState, useMemo, useContext } from 'react';
import { Tooltip, Badge, message as antMessage } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Package,
  MessageCircle,
  ShoppingBag,
  ShoppingCart,
  Bookmark,
  Grid,
  List,
} from 'lucide-react';
import { Currencies } from '@grc/_shared/constant';
import { MarketItem } from '@grc/_shared/namespace';
import { numberFormat } from '@grc/_shared/helpers';
import { AppContext } from '@grc/app-context';
import { CartItem } from '@grc/_shared/namespace/cart';
import { useRouter } from 'next/navigation';
import MediaRenderer from '@grc/components/apps/media-renderer';
import Product from '@grc/components/apps/product';
import ModernItemPost from '@grc/components/apps/item-post-new';
import ItemDetailModal from '@grc/components/apps/item-detail-modal';
import { isEmpty } from 'lodash';

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

const transformListingToMarketItem = (listing: any): MarketItem | null => {
  if (!listing) return null;
  const store = listing.storeId && typeof listing.storeId === 'object' ? listing.storeId : null;
  const creator =
    listing.creatorId && typeof listing.creatorId === 'object' ? listing.creatorId : null;
  const user = listing?.userId;
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
    productTags: listing.tags || [],
    quantity: listing.quantity ?? 1,
    availability: listing.status === 'live',
    isBuyable: listing.type === 'direct_purchase',
    sponsored: false,
    comments: [],
    listingType: listing.type === 'consignment' ? 'consignment' : 'self-listing',
  } as MarketItem;
};

interface StoreDetailsProductsTabProps {
  listings: any[];
  listingsTotal: number;
  isLoading: boolean;
  isFetching?: boolean;
  isMobile: boolean;
  onLoadMore?: (page: number) => void;
  storeName?: string;
  storeWhatsApp?: string;
}

const StoreDetailsProductsTab: React.FC<StoreDetailsProductsTabProps> = ({
  listings,
  listingsTotal,
  isLoading,
  isFetching,
  isMobile,
  onLoadMore,
  storeName,
  storeWhatsApp,
}) => {
  const router = useRouter();
  const { addToCart, isInCart, cartItems } = useContext(AppContext);

  const [viewType, setViewType] = useState<'grid' | 'list'>('grid');
  const [selectedProductId, setSelectedProductId] = useState<string>('');
  const [gridModalOpen, setGridModalOpen] = useState(false);
  const [gridModalItem, setGridModalItem] = useState<MarketItem | null>(null);
  const [savedItems, setSavedItems] = useState<(string | number)[]>(() => {
    try {
      return JSON.parse(localStorage.getItem('savedItems') || '[]');
    } catch {
      return [];
    }
  });

  const products: MarketItem[] = useMemo(
    () => listings.map(transformListingToMarketItem).filter(Boolean) as MarketItem[],
    [listings]
  );
  const selectedProduct = useMemo(
    () => products.find((item) => item.id?.toString() === selectedProductId),
    [selectedProductId, products]
  );

  const handleGridItemClick = (item: MarketItem) => {
    if (isMobile) {
      setSelectedProductId(item?.id?.toString());
    } else {
      setGridModalItem(item);
      setGridModalOpen(true);
    }
  };

  const handleWhatsAppMessage = (item: MarketItem) => {
    const phoneNumber = item.postUserProfile?.phoneNumber || storeWhatsApp || '';
    if (!phoneNumber) {
      antMessage.error('Seller phone number not available');
      return;
    }
    const formattedPrice = numberFormat(item.askingPrice?.price / 100, Currencies.NGN);
    const sellerName = item.postUserProfile?.displayName || storeName || 'Seller';
    const message = `Hi, ${sellerName},\nI am interested in this item on Comaket.\n\n${item.itemName}\n${item.description}\nPrice: ${formattedPrice}`;
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, '_blank');
  };

  const handleAddToCart = (item: MarketItem) => {
    const maxQty = item?.quantity ?? 1;
    const existing = cartItems?.find((i: CartItem) => i.id === item?.id);
    const currentQty = existing?.quantity || 0;
    if (currentQty >= maxQty) {
      antMessage.warning(`Maximum quantity (${maxQty}) reached`);
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

  const handleBookmark = (item: MarketItem) => {
    try {
      const current = JSON.parse(localStorage.getItem('savedItems') || '[]');
      const isSaved = current.includes(item?.id);
      if (isSaved) {
        const updated = current.filter((id: string | number) => id !== item?.id);
        localStorage.setItem('savedItems', JSON.stringify(updated));
        setSavedItems(updated);
      } else {
        current.push(item?.id);
        localStorage.setItem('savedItems', JSON.stringify(current));
        setSavedItems(current);
      }
      window.dispatchEvent(new Event('savedItemsChanged'));
    } catch {}
  };

  const handleShare = async (item: MarketItem) => {
    const url = `${window.location.origin}/product/${item.id}`;
    try {
      if (navigator.share) {
        await navigator.share({ title: item.itemName, url });
      } else {
        await navigator.clipboard.writeText(url);
        antMessage.success('Link copied!');
      }
    } catch {}
  };

  // ── Mobile full-screen Product view ─────────────────────────────────
  if (selectedProductId !== '' && selectedProduct && isMobile) {
    const cartItem = cartItems?.find((i: CartItem) => i.id === selectedProduct.id);
    return (
      <AnimatePresence mode="wait">
        <Product
          key={selectedProductId}
          item={selectedProduct}
          isInCart={isInCart(selectedProduct.id ?? '')}
          isSaved={savedItems.includes(selectedProduct.id)}
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

  if (isLoading) {
    return (
      <div className={`grid gap-4 ${isMobile ? 'grid-cols-2 px-4' : 'grid-cols-2 lg:grid-cols-3'}`}>
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="bg-neutral-100 dark:bg-neutral-800 rounded-lg aspect-square animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16 bg-neutral-50 dark:bg-neutral-800/30 rounded-2xl">
        <Package size={36} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-3" />
        <p className="text-sm text-neutral-500 dark:text-neutral-400">No products listed yet</p>
        <p className="text-xs text-neutral-400 mt-1">
          Check back soon — this store may add new items.
        </p>
      </div>
    );
  }

  const renderProductGrid = () => (
    <div className={`grid  ${isMobile ? 'grid-cols-2 gap-2' : 'grid-cols-2 gap-4 lg:grid-cols-4'}`}>
      {products.map((item) => {
        const isSaved = savedItems.includes(item?.id);
        const itemInCart = isInCart(item?.id ?? '');
        const isSoldOut = !item?.availability;
        const maxQty = item?.quantity ?? 1;
        const existing = cartItems?.find((i: CartItem) => i.id === item?.id);
        const isMaxQty = (existing?.quantity || 0) >= maxQty;
        const firstMedia = item?.media?.[0];

        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-neutral-800 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col"
          >
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
              {item?.availability && maxQty > 0 && maxQty <= 5 && (
                <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full z-[5]">
                  {maxQty} left
                </div>
              )}
              {item?.media?.length > 1 && (
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
            <div className="p-3 flex flex-col flex-grow">
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
                      <motion.button
                        whileTap={{ scale: 0.9 }}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleBookmark(item);
                        }}
                        className="p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 shadow-sm"
                      >
                        <Bookmark
                          size={16}
                          className={`${
                            isSaved ? 'fill-pink-500 text-pink-500' : 'text-neutral-400'
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
                      <MessageCircle size={14} /> WhatsApp
                    </button>
                    <motion.button
                      whileTap={{ scale: 0.9 }}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleBookmark(item);
                      }}
                      className="w-full p-2 rounded-lg border border-neutral-200 dark:border-neutral-600 bg-neutral-50 dark:bg-neutral-700 shadow-sm flex items-center justify-center gap-1.5 text-xs text-neutral-500"
                    >
                      <Bookmark
                        size={14}
                        className={`${
                          isSaved ? 'fill-pink-500 text-pink-500' : 'text-neutral-400'
                        } transition-colors`}
                      />{' '}
                      Save
                    </motion.button>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );

  const renderProductList = () => (
    <div className="space-y-6 max-w-4xl mx-auto">
      {products.map((item, idx) => (
        <div key={item.id || idx}>
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
        </div>
      ))}
    </div>
  );

  return (
    <div className={isMobile ? 'px-4' : 'px-2'}>
      <div className="flex items-center justify-end gap-2 mb-4">
        <button
          onClick={() => setViewType('grid')}
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
          onClick={() => setViewType('list')}
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
      {viewType === 'grid' ? renderProductGrid() : renderProductList()}
      {products.length < listingsTotal && onLoadMore && (
        <div className="flex justify-center mt-6">
          <button
            onClick={() => onLoadMore(Math.floor(products.length / 20) + 1)}
            disabled={isFetching}
            className="px-6 py-2.5 text-sm font-medium text-blue bg-blue-50 dark:bg-blue-900/10 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded-xl transition-colors disabled:opacity-50"
          >
            {isFetching ? 'Loading...' : 'Load More Products'}
          </button>
        </div>
      )}
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
  );
};

export default StoreDetailsProductsTab;
