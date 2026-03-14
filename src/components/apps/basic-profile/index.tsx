'use client';

import React, { useState } from 'react';
import { Tabs, Tooltip, Modal } from 'antd';
import { ClipboardList, Bookmark } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useMedia } from '@grc/hooks/useMedia';
import SavedItems from '../saved';

// Sub-components
import { BasicProfileProps } from './lib/helpers';
import ProfileCard from './lib/profile-card';
import EditProfileForm, { EditProfileSavePayload } from './lib/edit-profile-form';
import OrdersTab from './lib/orders-tab';
import OrderDetailView from './lib/order-detail-view';
import SwitchToCreatorCTA from './lib/switch-to-creator-cta';
import MobileOverlay from './lib/mobile-overlay';
import OrderDrawer from './lib/order-drawer';

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const BasicProfile: React.FC<BasicProfileProps> = ({
  userProfile,
  updateUserProfile,
  isUpdatingProfile,
  onProfileUpdated,
  // Location
  states,
  cities,
  loadingStates,
  loadingCities,
  onStateChange,
  // Orders
  orders = [],
  ordersPagination,
  isLoadingOrders,
  isFetchingOrders,
  onFetchOrderDetail,
  isLoadingOrderDetail,
  onRefetchOrders,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // ── Media hook for avatar upload ────────────────────────────────────
  const { uploadImage } = useMedia();

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleSaveProfile = async (payload: EditProfileSavePayload) => {
    try {
      setIsSaving(true);
      const { avatarFile, ...profileData } = payload;

      if (avatarFile) {
        const avatarUrl = await uploadImage(avatarFile, true);
        if (avatarUrl) {
          (profileData as any).avatar = avatarUrl;
        }
      }

      if (updateUserProfile) {
        await updateUserProfile(profileData);
        onProfileUpdated?.();
      }
      setIsEditOpen(false);
    } catch {
    } finally {
      setIsSaving(false);
    }
  };

  const handleViewOrder = async (order: any) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
    if (onFetchOrderDetail) {
      try {
        const detail = await onFetchOrderDetail(order._id || order.id);
        if (detail) setSelectedOrder(detail);
      } catch {}
    }
  };

  const handleCloseOrderDetail = () => {
    setIsOrderDetailOpen(false);
    setSelectedOrder(null);
  };

  const editFormProps = {
    userProfile,
    onSave: handleSaveProfile,
    onCancel: () => setIsEditOpen(false),
    isSaving: isSaving || isUpdatingProfile,
    states,
    cities,
    loadingStates,
    loadingCities,
    onStateChange,
  };

  return (
    <div
      className={`dark:bg-neutral-900/50 ${
        isMobile ? 'max-w-[100vw] mb-14 pt-2' : 'min-h-screen px-40'
      }`}
    >
      <div className={`w-full ${!isMobile ? 'mx-auto px-4' : ''}`}>
        <ProfileCard
          userProfile={userProfile}
          onEditClick={() => setIsEditOpen(true)}
          isMobile={isMobile}
        />

        <div className={isMobile ? 'mt-3' : 'mt-5'}>
          <SwitchToCreatorCTA isMobile={isMobile} />
        </div>

        {/* Tabs — sticky on BOTH mobile and desktop */}
        <div className={`mt-2 ${isMobile ? 'px-0' : ''} pb-10`}>
          <Tabs
            defaultActiveKey="orders"
            className={`[&_.ant-tabs-nav]:!mb-4 !text-black [&_.ant-tabs-nav]:!px-4 [&_.ant-tabs-nav]:!sticky [&_.ant-tabs-nav]:!z-20 [&_.ant-tabs-nav]:!bg-white [&_.ant-tabs-nav]:dark:!bg-neutral-900 [&_.ant-tabs-ink-bar]:!hidden [&_.ant-tabs-nav-list]:!w-full [&_.ant-tabs-nav-list]:!flex [&_.ant-tabs-tab]:!flex-1 [&_.ant-tabs-tab]:!justify-center [&_.ant-tabs-tab]:!text-sm [&_.ant-tabs-tab]:!text-black dark:[&_.ant-tabs-tab]:!text-white [&_.ant-tabs-tab]:!font-medium [&_.ant-tabs-tab]:!m-0 [&_.ant-tabs-tab]:!px-4 [&_.ant-tabs-tab]:!py-2.5 [&_.ant-tabs-tab]:!rounded-lg [&_.ant-tabs-tab]:!transition-all [&_.ant-tabs-tab-active]:!font-semibold [&_.ant-tabs-tab-active]:!bg-neutral-100 [&_.ant-tabs-tab-active]:dark:!bg-neutral-700 [&_.ant-tabs-nav-list]:!bg-nutral-50 [&_.ant-tabs-nav-list]:!text-black [&_.ant-tabs-nav-list]:dark:!bg-neutral-800 [&_.ant-tabs-nav-list]:!rounded-xl [&_.ant-tabs-nav-list]:!p-1 [&_.ant-tabs-tab:hover]:!text-black dark:[&_.ant-tabs-tab:hover]:!text-white [&_.ant-tabs-tab-btn]:!text-inherit hover:[&_.ant-tabs-tab-btn]:!text-inherit [&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-black dark:[&_.ant-tabs-tab-active_.ant-tabs-tab-btn]:!text-white ${
              isMobile ? '[&_.ant-tabs-nav]:!top-[30px]' : '[&_.ant-tabs-nav]:!top-0'
            }`}
            items={[
              {
                key: 'orders',
                label: (
                  <span className="flex items-center gap-1.5">
                    {isMobile ? (
                      <Tooltip title="Orders">
                        <ClipboardList size={20} />
                      </Tooltip>
                    ) : (
                      <>
                        <ClipboardList size={15} />
                        <span>My Orders</span>
                      </>
                    )}
                  </span>
                ),
                children: (
                  <OrdersTab
                    orders={orders}
                    ordersTotal={ordersPagination?.total}
                    pagination={ordersPagination}
                    isLoading={isLoadingOrders}
                    isFetching={isFetchingOrders}
                    onViewOrder={handleViewOrder}
                    isMobile={isMobile}
                    onRefetch={onRefetchOrders}
                  />
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
            ]}
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
          <EditProfileForm {...editFormProps} />
        </MobileOverlay>
      ) : (
        <Modal
          open={isEditOpen}
          onCancel={() => setIsEditOpen(false)}
          footer={null}
          width={700}
          className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden [&_.ant-modal-content]:!p-0 [&_.ant-modal-body]:!p-0"
          style={{ top: 40 }}
        >
          <div
            className="flex flex-col overflow-y-auto"
            style={{ maxHeight: 'calc(100vh - 120px)' }}
          >
            <EditProfileForm {...editFormProps} />
          </div>
        </Modal>
      )}

      {/* Order Detail */}
      {(selectedOrder || isLoadingOrderDetail) && (
        <>
          {isMobile ? (
            <MobileOverlay
              open={isOrderDetailOpen}
              onClose={handleCloseOrderDetail}
              title="Order Details"
              zIndex={200}
            >
              <OrderDetailView order={selectedOrder} isLoading={isLoadingOrderDetail} />
            </MobileOverlay>
          ) : (
            <OrderDrawer
              isOpen={isOrderDetailOpen}
              onClose={handleCloseOrderDetail}
              isMobile={isMobile}
            >
              <OrderDetailView order={selectedOrder} isLoading={isLoadingOrderDetail} />
            </OrderDrawer>
          )}
        </>
      )}
    </div>
  );
};

export default BasicProfile;
