'use client';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import dynamic from 'next/dynamic';
import { useUsers } from '@grc/hooks/useUser';
import { useOrders } from '@grc/hooks/useOrders';
import { useSavedProducts } from '@grc/hooks/useSavedProducts';
import { useCreators } from '@grc/hooks/useCreators';
import { useReviews } from '@grc/hooks/useReviews';
import { MarketItem } from '@grc/_shared/namespace';
import { fetchData } from '@grc/_shared/helpers';
import { useAuth } from '@grc/hooks/useAuth';
import UnauthenticatedProfile from '@grc/components/apps/unauthenticated-profile';
import { useStores } from '@grc/hooks/useStores';

const Profile = dynamic(() => import('@grc/components/apps/profile'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <p className="text-neutral-400">Loading profile...</p>
    </div>
  ),
});
const BasicProfile = dynamic(() => import('@grc/components/apps/basic-profile'), {
  ssr: false,
  loading: () => (
    <div className="min-h-[80vh] flex items-center justify-center">
      <p className="text-neutral-400">Loading profile...</p>
    </div>
  ),
});

const NIGERIA_ISO2 = 'NG';

interface LocationOption {
  name: string;
  iso2?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// TRANSFORM: Backend saved product → MarketItem
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

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ProfilePage = () => {
  const { isAuthenticated } = useAuth();
  const { userProfile, isLoadingProfile, updateUserProfile, isUpdatingProfile, refetchProfile } =
    useUsers({ fetchProfile: isAuthenticated ?? false });
  const isCreatorAccount = userProfile?.role === 'creator';

  // ══════════════════════════════════════════════════════════════════════
  // CREATOR-SPECIFIC HOOKS
  // ══════════════════════════════════════════════════════════════════════

  const {
    creatorProfile,
    isLoadingProfile: isLoadingCreatorProfile,
    updateCreatorProfile,
    isUpdatingProfile: isUpdatingCreatorProfile,
    refetchProfile: refetchCreatorProfile,
  } = useCreators({ fetchProfile: isAuthenticated ? isCreatorAccount : false });

  // Seller Orders (received orders)
  const {
    sellerOrders,
    sellerOrdersTotal,
    isLoadingSellerOrders,
    isFetchingSellerOrders,
    refetchSellerOrders,
    getOrderById: getSellerOrderById,
    orderDetail: sellerOrderDetail,
    isLoadingOrderDetail: isLoadingSellerOrderDetail,
    isFetchingOrderDetail: isFetchingSellerOrderDetail,
    updateOrderStatus,
    isUpdatingOrderStatus,
    sellerOrdersPagination,
  } = useOrders({ fetchSellerOrders: isCreatorAccount });

  // Buyer Orders (purchases) — ALWAYS fetch for ALL accounts
  const {
    myOrders,
    isLoadingMyOrders,
    isFetchingMyOrders,
    refetchMyOrders,
    getOrderById: getBuyerOrderById,
    orderDetail: buyerOrderDetail,
    isLoadingOrderDetail: isLoadingBuyerOrderDetail,
    isFetchingOrderDetail: isFetchingBuyerOrderDetail,
    myOrdersPagination,
  } = useOrders({ fetchMyOrders: true });

  const buyerOrders = myOrders || [];

  const { myStores } = useStores({ fetchMyStores: true });

  console.log('my storesss:::::', myStores);

  // Reviews
  const {
    reviews: creatorReviews,
    reviewsTotal: creatorReviewsTotal,
    isLoadingReviews,
    sellerReply,
    isReplyingToReview,
    refetchReviews,
  } = useReviews({
    fetchReviews: isCreatorAccount && !!creatorProfile?._id,
    reviewsParams: { creatorId: creatorProfile?._id },
  });

  // ══════════════════════════════════════════════════════════════════════
  // SAVED PRODUCTS
  // ══════════════════════════════════════════════════════════════════════

  const {
    getSavedResponse,
    isLoadingSaved,
    isFetchingSaved,
    removeSavedProduct,
    isRemoving,
    refetchSaved,
    refetchCount,
    getCountResponse,
  } = useSavedProducts({
    fetchSaved: !isCreatorAccount,
    fetchCount: !isCreatorAccount,
  });

  const rawSavedProducts = getSavedResponse?.data?.data || [];
  const savedCount = getCountResponse?.data?.data?.count || 0;
  const savedMarketItems: MarketItem[] = useMemo(
    () => rawSavedProducts.map(transformSavedToMarketItem).filter(Boolean) as MarketItem[],
    [rawSavedProducts]
  );

  // ── Location ───────────────────────────────────────────────
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedStateIso2, setSelectedStateIso2] = useState<string>('');

  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${NIGERIA_ISO2}/states`
        );
        setStates((data || []).map((s: any) => ({ name: s.name, iso2: s.iso2 })));
      } catch (e) {
        console.error('Error fetching states:', e);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    const stateName = isCreatorAccount ? creatorProfile?.location?.state : userProfile?.state;
    if (stateName && states.length > 0) {
      const match = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
      if (match?.iso2) setSelectedStateIso2(match.iso2);
    }
  }, [userProfile?.state, creatorProfile?.location?.state, states, isCreatorAccount]);

  useEffect(() => {
    if (!selectedStateIso2) {
      setCities([]);
      return;
    }
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${NIGERIA_ISO2}/states/${selectedStateIso2}/cities`
        );
        setCities((data || []).map((c: any) => ({ name: c.name })));
      } catch (e) {
        console.error('Error fetching cities:', e);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedStateIso2]);

  const handleStateChange = useCallback(
    (stateName: string) => {
      const match = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
      setSelectedStateIso2(match?.iso2 || '');
    },
    [states]
  );

  // ══════════════════════════════════════════════════════════════════════
  // HANDLERS
  // ══════════════════════════════════════════════════════════════════════

  const handleUpdateCreatorProfile = useCallback(
    async (data: any) => {
      try {
        await updateCreatorProfile(data);
        refetchCreatorProfile();
      } catch {}
    },
    [updateCreatorProfile, refetchCreatorProfile]
  );

  const handleFetchSellerOrderDetail = useCallback(
    async (orderId: string) => {
      try {
        return (await getSellerOrderById(orderId))?.data;
      } catch {}
    },
    [getSellerOrderById]
  );

  const handleLoadMoreSellerOrders = useCallback(
    async (page: number) => {
      refetchSellerOrders({ page, perPage: 10 });
    },
    [refetchSellerOrders]
  );

  const handleRefetchSellerOrders = useCallback(
    (params: { search?: string; status?: string; page?: number; perPage?: number }) => {
      refetchSellerOrders(params);
    },
    [refetchSellerOrders]
  );

  const handleRefetchBuyerOrders = useCallback(
    (params: { search?: string; status?: string; page?: number; perPage?: number }) => {
      refetchMyOrders(params);
    },
    [refetchMyOrders]
  );

  const handleUpdateOrderStatus = useCallback(
    async (id: string, data: any) => {
      try {
        const r = await updateOrderStatus(id, data);
        refetchSellerOrders();
        return r;
      } catch {}
    },
    [updateOrderStatus, refetchSellerOrders]
  );

  const handleSellerReply = useCallback(
    async (reviewId: string, data: any) => {
      try {
        const r = await sellerReply(reviewId, data);
        refetchReviews();
        return r;
      } catch {}
    },
    [sellerReply, refetchReviews]
  );

  const handleLoadMoreReviews = useCallback(
    async (page: number) => {
      refetchReviews({ creatorId: creatorProfile?._id, page, perPage: 10 });
    },
    [refetchReviews, creatorProfile?._id]
  );

  // Buyer order handlers
  const handleFetchBuyerOrderDetail = useCallback(
    async (orderId: string) => {
      try {
        return (await getBuyerOrderById(orderId))?.data;
      } catch {}
    },
    [getBuyerOrderById]
  );

  const handleLoadMoreBuyerOrders = useCallback(
    async (page: number) => {
      refetchMyOrders({ page, perPage: 10 });
    },
    [refetchMyOrders]
  );

  // Basic profile handlers
  const handleRemoveSaved = useCallback(
    async (listingId: string) => {
      try {
        await removeSavedProduct(listingId);
        refetchSaved();
        refetchCount();
      } catch {}
    },
    [removeSavedProduct, refetchSaved, refetchCount]
  );

  const handleLoadMoreOrders = useCallback(
    async (page: number) => {
      refetchMyOrders({ page, perPage: 10 });
    },
    [refetchMyOrders]
  );

  const handleLoadMoreSaved = useCallback(
    async (page: number) => {
      refetchSaved({ page, perPage: 10 });
    },
    [refetchSaved]
  );

  // ══════════════════════════════════════════════════════════════════════
  // RENDER
  // ══════════════════════════════════════════════════════════════════════

  if (isLoadingProfile) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <p className="text-neutral-400">Loading profile...</p>
      </div>
    );
  }

  if (!isAuthenticated) return <UnauthenticatedProfile />;

  if (isCreatorAccount) {
    return (
      <Profile
        userProfile={userProfile}
        updateUserProfile={updateUserProfile}
        isUpdatingProfile={isUpdatingProfile}
        creatorProfile={creatorProfile}
        isLoadingCreatorProfile={isLoadingCreatorProfile}
        updateCreatorProfile={handleUpdateCreatorProfile}
        isUpdatingCreatorProfile={isUpdatingCreatorProfile}
        onCreatorProfileUpdated={refetchCreatorProfile}
        // Seller Orders (received)
        sellerOrders={sellerOrders}
        sellerOrdersTotal={sellerOrdersTotal}
        isLoadingSellerOrders={isLoadingSellerOrders}
        isFetchingSellerOrders={isFetchingSellerOrders}
        onLoadMoreSellerOrders={handleLoadMoreSellerOrders}
        onFetchOrderDetail={handleFetchSellerOrderDetail}
        orderDetail={sellerOrderDetail}
        isLoadingOrderDetail={isLoadingSellerOrderDetail || isFetchingSellerOrderDetail}
        onUpdateOrderStatus={handleUpdateOrderStatus}
        isUpdatingOrderStatus={isUpdatingOrderStatus}
        sellerOrdersPagination={sellerOrdersPagination}
        onRefetchSellerOrders={handleRefetchSellerOrders}
        // Buyer Orders (purchases)
        buyerOrders={buyerOrders}
        buyerOrdersTotal={buyerOrders?.length || 0}
        isLoadingBuyerOrders={isLoadingMyOrders}
        isFetchingBuyerOrders={isFetchingMyOrders}
        onLoadMoreBuyerOrders={handleLoadMoreBuyerOrders}
        onFetchBuyerOrderDetail={handleFetchBuyerOrderDetail}
        buyerOrderDetail={buyerOrderDetail}
        isLoadingBuyerOrderDetail={isLoadingBuyerOrderDetail || isFetchingBuyerOrderDetail}
        onRefetchBuyerOrders={handleRefetchBuyerOrders}
        // Reviews
        reviews={creatorReviews}
        reviewsTotal={creatorReviewsTotal}
        isLoadingReviews={isLoadingReviews}
        onSellerReply={handleSellerReply}
        isReplyingToReview={isReplyingToReview}
        onLoadMoreReviews={handleLoadMoreReviews}
        // Location
        states={states}
        cities={cities}
        loadingStates={loadingStates}
        loadingCities={loadingCities}
        onStateChange={handleStateChange}
        myStores={myStores ?? []}
      />
    );
  }

  return (
    <BasicProfile
      userProfile={userProfile}
      updateUserProfile={updateUserProfile}
      isUpdatingProfile={isUpdatingProfile}
      onProfileUpdated={refetchProfile}
      states={states}
      cities={cities}
      loadingStates={loadingStates}
      loadingCities={loadingCities}
      onStateChange={handleStateChange}
      orders={buyerOrders}
      ordersPagination={myOrdersPagination}
      isLoadingOrders={isLoadingMyOrders}
      isFetchingOrders={isFetchingMyOrders}
      onLoadMoreOrders={handleLoadMoreOrders}
      onFetchOrderDetail={handleFetchBuyerOrderDetail}
      orderDetail={buyerOrderDetail}
      isLoadingOrderDetail={isLoadingBuyerOrderDetail || isFetchingBuyerOrderDetail}
      savedItems={savedMarketItems}
      savedPagination={sellerOrdersPagination}
      savedCount={savedCount}
      isLoadingSaved={isLoadingSaved}
      isFetchingSaved={isFetchingSaved}
      onRemoveSaved={handleRemoveSaved}
      isRemovingSaved={isRemoving}
      onLoadMoreSaved={handleLoadMoreSaved}
      onRefetchOrders={handleRefetchBuyerOrders}
    />
  );
};

export default ProfilePage;
