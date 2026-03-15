'use client';

import React, { useMemo, useState, useEffect } from 'react';
import { Tabs, Tooltip, Modal } from 'antd';
import {
  Star,
  Package,
  Bookmark,
  ClipboardList,
  Users,
  Sparkles,
  ShoppingCart,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { VendorReview } from '@grc/_shared/namespace/vendor';
import { useMedia } from '@grc/hooks/useMedia';

import { useSearchParams } from 'next/navigation';
import SellItem from '../sell-item';
import SavedItems from '../saved';
import FeaturedWorks from '../featured-works';
import FollowersModal from '../followers-modal';
import ProfileHeader from './profile-header';
import ProfileOrdersTab from './profile-orders-tab';
import ProfileReviewsTab from './profile-reviews-tab';
import ProfileAboutTab from './profile-about-tab';
import ProfileEditForm from './profile-edit-form';
import { ProfileProps, MobileOverlay } from './profile-helpers';
import type { CreatorEditSavePayload } from './profile-edit-form';

const Profile: React.FC<ProfileProps> = ({
  userProfile,
  creatorProfile,
  isLoadingCreatorProfile,
  updateCreatorProfile,
  isUpdatingCreatorProfile,
  onCreatorProfileUpdated,
  sellerOrders = [],
  sellerOrdersTotal = 0,
  isLoadingSellerOrders,
  isFetchingSellerOrders,
  onLoadMoreSellerOrders,
  onFetchOrderDetail,
  orderDetail,
  isLoadingOrderDetail,
  sellerOrdersPagination,
  onRefetchSellerOrders,
  buyerOrders = [],
  buyerOrdersTotal = 0,
  isLoadingBuyerOrders,
  isFetchingBuyerOrders,
  onLoadMoreBuyerOrders,
  onFetchBuyerOrderDetail,
  buyerOrderDetail,
  isLoadingBuyerOrderDetail,
  buyerOrdersPagination,
  onRefetchBuyerOrders,
  reviews = [],
  reviewsTotal = 0,
  isLoadingReviews,
  onLoadMoreReviews,
  states,
  cities,
  loadingStates,
  loadingCities,
  onStateChange,
  myStores,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const searchParams = useSearchParams();
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [showFollowers, setShowFollowers] = useState(false);

  // ── Read tab param and clean URL ────────────────────────────────────
  const tabParam = searchParams?.get('tab');
  const defaultTab = tabParam || 'featured';

  useEffect(() => {
    if (tabParam) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const { uploadImage } = useMedia();

  // ── Followers count from creator profile ────────────────────────────
  const followersCount = creatorProfile?.followersCount || creatorProfile?.totalFollowers || 0;

  const email = creatorProfile?.contactEmail || userProfile?.email || '';

  const vendorReviews: VendorReview[] = useMemo(() => {
    if (!reviews || reviews.length === 0) return [];
    return reviews.map((r: any) => ({
      id: r._id || r.id || '',
      buyerName:
        typeof r.buyer === 'object'
          ? `${r.buyer?.firstName || ''} ${r.buyer?.lastName || ''}`.trim()
          : r.buyerName || 'Anonymous',
      buyerAvatar: typeof r.buyer === 'object' ? r.buyer?.avatar || '' : r.buyerAvatar || '',
      rating: r.rating || 0,
      comment: r.comment || r.review || '',
      date: r.createdAt || r.date || '',
      productName: typeof r.listing === 'object' ? r.listing?.itemName || '' : r.productName || '',
      sellerReply: r.sellerReply || null,
    }));
  }, [reviews]);

  const computedRating = useMemo(() => {
    if (vendorReviews.length === 0) return creatorProfile?.rating || 0;
    const sum = vendorReviews.reduce((s, r) => s + r.rating, 0);
    return Math.round((sum / vendorReviews.length) * 10) / 10;
  }, [vendorReviews, creatorProfile?.rating]);

  const handleSaveProfile = async (payload: CreatorEditSavePayload) => {
    try {
      setIsSaving(true);
      const { profileImageFile, ...profileData } = payload;
      if (profileImageFile) {
        const imageUrl = await uploadImage(profileImageFile, true);
        if (imageUrl) (profileData as any).profileImageUrl = imageUrl;
      }
      if (updateCreatorProfile) {
        await updateCreatorProfile(profileData);
        onCreatorProfileUpdated?.();
      }
      setIsEditOpen(false);
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoadingCreatorProfile) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-400">Loading creator profile...</p>
        </div>
      </div>
    );
  }

  const tabItems = [
    {
      key: 'featured',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="Featured Works">
              <Sparkles size={20} />
            </Tooltip>
          ) : (
            <>
              <Sparkles size={15} />
              <span>Featured Works</span>
            </>
          )}
        </span>
      ),
      children: (
        <FeaturedWorks
          ownerType="creator"
          ownerId={creatorProfile?._id ?? ''}
          isOwnProfile={true}
        />
      ),
    },
    {
      key: 'products',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="My Products">
              <Package size={20} />
            </Tooltip>
          ) : (
            <>
              <Package size={15} />
              <span>My Products</span>
            </>
          )}
        </span>
      ),
      children: <SellItem />,
    },
    {
      key: 'orders',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="Received Orders">
              <ClipboardList size={20} />
            </Tooltip>
          ) : (
            <>
              <ClipboardList size={15} />
              <span>Received Orders</span>
            </>
          )}
        </span>
      ),
      children: (
        <div className={isMobile ? 'px-4' : ''}>
          <ProfileOrdersTab
            orders={sellerOrders}
            ordersTotal={sellerOrdersTotal}
            isLoading={isLoadingSellerOrders || false}
            isFetching={isFetchingSellerOrders}
            isMobile={isMobile}
            onFetchOrderDetail={onFetchOrderDetail}
            orderDetail={orderDetail}
            isLoadingOrderDetail={isLoadingOrderDetail}
            onLoadMore={onLoadMoreSellerOrders}
            pagination={sellerOrdersPagination}
            variant="seller"
            onRefetch={onRefetchSellerOrders}
            tab="my-orders"
          />
        </div>
      ),
    },
    {
      key: 'purchases',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="My Purchases">
              <ShoppingCart size={20} />
            </Tooltip>
          ) : (
            <>
              <ShoppingCart size={15} />
              <span>My Purchases</span>
            </>
          )}
        </span>
      ),
      children: (
        <div className={isMobile ? 'px-4' : ''}>
          <ProfileOrdersTab
            orders={buyerOrders}
            ordersTotal={buyerOrdersTotal}
            isLoading={isLoadingBuyerOrders || false}
            isFetching={isFetchingBuyerOrders}
            isMobile={isMobile}
            onFetchOrderDetail={onFetchBuyerOrderDetail}
            orderDetail={buyerOrderDetail}
            isLoadingOrderDetail={isLoadingBuyerOrderDetail}
            onLoadMore={onLoadMoreBuyerOrders}
            pagination={buyerOrdersPagination}
            variant="buyer"
            onRefetch={onRefetchBuyerOrders}
            tab="my-purchases"
          />
        </div>
      ),
    },
    {
      key: 'saved',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="Saved">
              <Bookmark size={20} />
            </Tooltip>
          ) : (
            <>
              <Bookmark size={15} />
              <span>Saved</span>
            </>
          )}
        </span>
      ),
      children: <SavedItems />,
    },
    {
      key: 'reviews',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="Reviews">
              <Star size={20} />
            </Tooltip>
          ) : (
            <>
              <Star size={15} />
              <span>Reviews</span>
            </>
          )}
        </span>
      ),
      children: (
        <div className={isMobile ? 'px-4' : ''}>
          <ProfileReviewsTab
            reviews={vendorReviews}
            reviewsTotal={reviewsTotal}
            computedRating={computedRating}
            isLoading={isLoadingReviews || false}
            isMobile={isMobile}
            onLoadMore={onLoadMoreReviews}
          />
        </div>
      ),
    },
    {
      key: 'about',
      label: (
        <span className="flex items-center gap-1.5">
          {isMobile ? (
            <Tooltip title="About">
              <Users size={20} />
            </Tooltip>
          ) : (
            <>
              <Users size={15} />
              <span>About</span>
            </>
          )}
        </span>
      ),
      children: (
        <div className={isMobile ? 'px-4' : ''}>
          <ProfileAboutTab
            creatorProfile={creatorProfile}
            userEmail={email}
            isMobile={isMobile}
            onEditProfile={() => setIsEditOpen(true)}
          />
        </div>
      ),
    },
  ];

  return (
    <div
      className={`dark:bg-neutral-900/50 ${isMobile ? 'max-w-[100vw] mb-14 pt-0' : 'min-h-screen'}`}
    >
      <div className={`w-full ${!isMobile ? 'mx-auto px-4' : ''}`}>
        <ProfileHeader
          userProfile={userProfile}
          creatorProfile={creatorProfile}
          reviewsCount={reviewsTotal}
          computedRating={computedRating}
          isMobile={isMobile}
          onEditProfile={() => setIsEditOpen(true)}
          stores={myStores ?? []}
          isCreatorOwnProfile={true}
          followersCount={followersCount}
          onShowFollowers={() => setShowFollowers(true)}
        />

        <div className={`${isMobile ? 'mt-3 px-0' : 'mt-6'} pb-10`}>
          <Tabs
            defaultActiveKey={defaultTab}
            className={`[&_.ant-tabs-nav]:!mb-4 [&_.ant-tabs-tab]:!text-sm [&_.ant-tabs-tab]:!font-medium [&_.ant-tabs-tab-active]:!font-semibold [&_.ant-tabs-ink-bar]:!bg-blue [&_.ant-tabs-nav]:!sticky [&_.ant-tabs-nav]:!z-[100] [&_.ant-tabs-nav]:!bg-white [&_.ant-tabs-nav]:dark:!bg-neutral-900 [&_.ant-tabs-tab]:!text-black dark:[&_.ant-tabs-tab]:!text-white [&_.ant-tabs-tab:hover]:!text-black dark:[&_.ant-tabs-tab:hover]:!text-white [&_.ant-tabs-tab-btn]:!text-inherit hover:[&_.ant-tabs-tab-btn]:!text-inherit [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-black dark:[&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-white ${
              isMobile
                ? '[&_.ant-tabs-nav-list]:!flex-nowrap [&_.ant-tabs-nav-list]:!gap-1 [&_.ant-tabs-nav-wrap]:!overflow-x-auto [&_.ant-tabs-nav-wrap]:!flex-nowrap [&_.ant-tabs-nav-operations]:!hidden [&_.ant-tabs-nav]:!top-[40px] [&_.ant-tabs-tab]:!flex-shrink-0 [&_.ant-tabs-tab]:!px-3 [&_.ant-tabs-nav-list]:!justify-between [&_.ant-tabs-nav]:!px-4 [&_.ant-tabs-tab:last-child]:!mr-[30px]'
                : '[&_.ant-tabs-nav]:!px-4 [&_.ant-tabs-nav]:!top-0'
            }`}
            items={tabItems}
          />
        </div>
      </div>

      {/* Edit Profile */}
      {isMobile ? (
        <MobileOverlay
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Profile"
          zIndex={200}
        >
          <ProfileEditForm
            creatorProfile={creatorProfile}
            userEmail={email}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditOpen(false)}
            isSaving={isSaving || isUpdatingCreatorProfile}
            states={states}
            cities={cities}
            loadingStates={loadingStates}
            loadingCities={loadingCities}
            onStateChange={onStateChange}
          />
        </MobileOverlay>
      ) : (
        <Modal
          open={isEditOpen}
          onCancel={() => setIsEditOpen(false)}
          footer={null}
          width={640}
          className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden"
        >
          <div className="max-h-[80vh] overflow-y-auto">
            <ProfileEditForm
              creatorProfile={creatorProfile}
              userEmail={email}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditOpen(false)}
              isSaving={isSaving || isUpdatingCreatorProfile}
              states={states}
              cities={cities}
              loadingStates={loadingStates}
              loadingCities={loadingCities}
              onStateChange={onStateChange}
            />
          </div>
        </Modal>
      )}

      {/* Followers Modal */}
      <FollowersModal
        open={showFollowers}
        onClose={() => setShowFollowers(false)}
        title="My Followers"
        targetType="creator"
        targetId={creatorProfile?._id || ''}
        currentUserId={userProfile?._id}
      />
    </div>
  );
};

export default Profile;
