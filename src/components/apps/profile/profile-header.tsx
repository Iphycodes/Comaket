'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Tooltip } from 'antd';
import { MapPin, Star, Edit3, Store, ChevronRight, ChevronDown, PlusCircle } from 'lucide-react';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { useRouter } from 'next/navigation';
import { CreatorProfileData, VerifiedBadge, getIndustryLabel } from './profile-helpers';
import StoreConfirmModal from '../layout/side-nav/lib/store-confirm-modal';

interface StoreItem {
  _id: string;
  id?: string;
  name: string;
  slug: string;
  description?: string;
  category?: string;
  status?: string;
  totalListings?: number;
  rating?: number;
  logo?: string | null;
  [key: string]: any;
}

interface ProfileHeaderProps {
  userProfile?: any;
  creatorProfile?: CreatorProfileData;
  reviewsCount: number;
  computedRating: number;
  isMobile: boolean;
  onEditProfile: () => void;
  stores?: StoreItem[];
  isOwnProfile?: boolean;
  isCreatorOwnProfile?: boolean;
  followersCount?: number;
  onShowFollowers?: () => void;
}

interface StoreDropdownProps {
  stores: StoreItem[];
  isOwnProfile: boolean;
  isMobile: boolean;
  setShowStoreConfirm: React.Dispatch<React.SetStateAction<boolean>>;
}

const StoreDropdown: React.FC<StoreDropdownProps> = ({
  stores,
  isOwnProfile,
  isMobile,
  setShowStoreConfirm,
}) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [open]);

  const handleStoreClick = (store: StoreItem) => {
    router.push(
      isOwnProfile ? `/my-store/${store._id || store.id}` : `/stores/${store._id || store.id}`
    );
    setOpen(false);
  };

  const handleCreateStore = () => {
    setShowStoreConfirm(true);
    setOpen(false);
  };
  const activeStores = stores.filter((s) => s.status !== 'suspended' && s.status !== 'deleted');
  const statusDot = (status?: string) =>
    status === 'active'
      ? 'bg-emerald-400'
      : status === 'pending'
        ? 'bg-amber-400'
        : 'bg-neutral-300';

  if (activeStores.length === 0) {
    if (!isOwnProfile) return null;
    return (
      <button
        onClick={handleCreateStore}
        className={`flex items-center rounded-xl text-sm font-semibold bg-gradient-to-r from-blue/5 to-indigo-500/5 dark:from-blue/10 dark:to-indigo-500/10 border border-dashed border-blue/30 dark:border-blue/40 text-blue hover:bg-blue/10 dark:hover:bg-blue/20 transition-all ${
          isMobile ? 'gap-1 px-3 py-1.5' : 'gap-1.5 px-4 py-2.5'
        }`}
      >
        <PlusCircle size={15} />
        {isMobile ? 'Store' : 'Create Store'}
      </button>
    );
  }

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => setOpen((p) => !p)}
        className={`flex items-center rounded-xl text-sm font-semibold bg-gradient-to-r from-blue/5 to-indigo-500/5 dark:from-blue/10 dark:to-indigo-500/10 border border-blue/20 dark:border-blue/30 text-blue hover:bg-blue/10 dark:hover:bg-blue/20 transition-all ${
          isMobile ? 'gap-1 px-3 py-1.5' : 'gap-1.5 px-4 py-2.5'
        }`}
      >
        <Store size={15} />
        {isMobile ? <span>Stores</span> : <span>My Stores ({activeStores.length})</span>}
        <ChevronDown
          size={14}
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && (
        <div
          className={`absolute z-50 mt-2 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden ${
            isMobile ? 'right-0 w-64' : 'right-0 w-72'
          }`}
          style={{ animation: 'fadeInDown 0.15s ease-out' }}
        >
          <div className="px-3.5 py-2.5 border-b border-neutral-100 dark:border-neutral-700/50">
            <p className="text-[11px] font-semibold text-neutral-400 dark:text-neutral-500 uppercase tracking-wider">
              {isOwnProfile ? 'My Stores' : 'Stores'}
            </p>
          </div>
          {isOwnProfile && (
            <button
              onClick={handleCreateStore}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-colors group text-left border-b border-neutral-100 dark:border-neutral-700/50"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-blue/10 to-indigo-500/10 dark:from-blue/20 dark:to-indigo-500/20 border border-dashed border-blue/30 flex items-center justify-center flex-shrink-0">
                <PlusCircle size={16} className="text-blue" />
              </div>
              <span className="text-sm font-semibold text-blue">Add New Store</span>
              <ChevronRight
                size={15}
                className="text-blue/40 group-hover:text-blue group-hover:translate-x-0.5 transition-all flex-shrink-0 ml-auto"
              />
            </button>
          )}
          <div className="max-h-64 overflow-y-auto py-1">
            {activeStores.map((store) => (
              <button
                key={store._id}
                onClick={() => handleStoreClick(store)}
                className="w-full flex items-center gap-3 px-3.5 py-2.5 hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors group text-left"
              >
                <div className="w-9 h-9 rounded-lg overflow-hidden flex-shrink-0 shadow-sm">
                  {store.logo ? (
                    <img src={store.logo} alt={store.name} className="w-full h-full object-cover" />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                      style={{ backgroundColor: getRandomColorByString(store.name || 'Store') }}
                    >
                      {getFirstCharacter(store.name || 'S')}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="text-sm font-semibold text-neutral-800 dark:text-neutral-100 truncate group-hover:text-blue transition-colors">
                      {store.name}
                    </p>
                    <div
                      className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${statusDot(
                        store.status
                      )}`}
                    />
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    {store.category && (
                      <span className="text-[11px] text-neutral-400 truncate">
                        {store.category}
                      </span>
                    )}
                    {store.rating != null && store.rating > 0 && (
                      <span className="flex items-center gap-0.5 text-[11px] text-amber-500">
                        <Star size={10} className="fill-amber-500" />
                        {store.rating}
                      </span>
                    )}
                    {store.totalListings != null && store.totalListings > 0 && (
                      <span className="text-[11px] text-neutral-400">
                        {store.totalListings} items
                      </span>
                    )}
                  </div>
                </div>
                <ChevronRight
                  size={15}
                  className="text-neutral-300 dark:text-neutral-600 group-hover:text-blue group-hover:translate-x-0.5 transition-all flex-shrink-0"
                />
              </button>
            ))}
          </div>
        </div>
      )}
      <style jsx>{`
        @keyframes fadeInDown {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  userProfile,
  creatorProfile,
  reviewsCount,
  isMobile,
  onEditProfile,
  stores = [],
  isOwnProfile = true,
  isCreatorOwnProfile = false,
  followersCount = 0,
  onShowFollowers,
}) => {
  const firstName = creatorProfile?.userId?.firstName || userProfile?.firstName || '';
  const lastName = creatorProfile?.userId?.lastName || userProfile?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';
  const avatarUrl = creatorProfile?.profileImageUrl || userProfile?.avatar || '';
  const coverImageUrl = creatorProfile?.coverImage || '';
  const username = creatorProfile?.username || '';
  const bio = creatorProfile?.bio || '';
  const isVerified = creatorProfile?.isVerified || false;
  const locationStr = [creatorProfile?.location?.city, creatorProfile?.location?.state]
    .filter(Boolean)
    .join(', ');
  const productCount = creatorProfile?.totalListings || 0;
  const industries = creatorProfile?.industries || [];
  const showStoreSection = isCreatorOwnProfile;
  const [showStoreConfirm, setShowStoreConfirm] = useState(false);

  return (
    <>
      <div className="relative h-44 sm:h-56 bg-gradient-to-br from-neutral-200 to-neutral-100 dark:from-neutral-800 dark:to-neutral-900 overflow-hidden sm:rounded-b-2xl">
        {coverImageUrl ? (
          <img
            src={coverImageUrl}
            alt=""
            className="w-full h-full object-cover opacity-70 dark:opacity-40"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-blue/20 via-purple-500/10 to-pink-500/20 dark:from-blue-900/40 dark:via-purple-900/20 dark:to-pink-900/30" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        {/* <div className="absolute bottom-4 right-4 flex gap-1.5 flex-wrap justify-end">
          <span
            className={`flex items-center gap-1 px-2.5 py-1 backdrop-blur-sm rounded-full text-[11px] font-semibold shadow-sm ${planConfig.bg} ${planConfig.color}`}
          >
            <Award size={11} />
            {planConfig.label} Plan
          </span>
          {totalSales > 0 && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-white/90 dark:bg-neutral-900/80 backdrop-blur-sm rounded-full text-[11px] font-semibold text-neutral-700 dark:text-neutral-300 shadow-sm">
              <Award size={11} className="text-amber-500" />
              {totalSales} sale{totalSales !== 1 ? 's' : ''}
            </span>
          )}
        </div> */}
      </div>

      <div className={`${isMobile ? 'px-4' : ''} -mt-24 relative z-10`}>
        <div className="flex items-end justify-between gap-4">
          <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-neutral-900 overflow-hidden shadow-lg bg-neutral-200 dark:bg-neutral-700 flex-shrink-0">
            {avatarUrl ? (
              <img src={avatarUrl} alt={fullName} className="w-full h-full object-cover" />
            ) : (
              <div
                className="w-full h-full flex items-center justify-center text-white text-5xl font-bold"
                style={{ backgroundColor: getRandomColorByString(firstName || 'U') }}
              >
                {getFirstCharacter(firstName || 'U')}
              </div>
            )}
          </div>
          <div className="pb-2 flex items-center gap-2">
            {showStoreSection && (
              <StoreDropdown
                stores={stores}
                isOwnProfile={isOwnProfile}
                isMobile={isMobile}
                setShowStoreConfirm={setShowStoreConfirm}
              />
            )}
            {isOwnProfile && (
              <button
                onClick={onEditProfile}
                className={`flex items-center rounded-xl text-sm font-semibold bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all ${
                  isMobile ? 'text-sm gap-1 px-3 py-1.5' : 'gap-2 px-5 py-2.5'
                }`}
              >
                <Edit3 size={16} />
                {isMobile ? 'Edit' : 'Edit Profile'}
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center gap-4 mt-3 flex-wrap">
          <div className="flex-1 min-w-0 pb-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-bold text-neutral-900 dark:text-white">
                {fullName}
              </h1>
              {isVerified && (
                <Tooltip title="Verified Creator">
                  <VerifiedBadge />
                </Tooltip>
              )}
            </div>
            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-0.5">
              {username && <span className="font-medium">@{username}</span>}
            </p>
            <div className="text-wrap max-w-2xl">
              {bio && (
                <>
                  <span className="italic">{bio}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Stats — followers clickable */}
        <div className="flex items-center gap-4 mt-1 text-sm text-neutral-500">
          <button onClick={onShowFollowers} className="hover:text-blue transition-colors">
            <strong className="text-neutral-900 dark:text-white">
              {followersCount.toLocaleString()}
            </strong>{' '}
            followers
          </button>
          <span>
            <strong className="text-neutral-900 dark:text-white">{productCount}</strong> products
          </span>
          <span>
            <strong className="text-neutral-900 dark:text-white">{reviewsCount}</strong> reviews
          </span>
        </div>

        {industries.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {industries.map((ind) => (
              <span
                key={ind}
                className="px-2.5 py-1 bg-neutral-50 dark:bg-neutral-800 rounded-full text-[11px] font-medium text-neutral-500 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-700"
              >
                {getIndustryLabel(ind)}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3">
          {locationStr && (
            <span className="flex items-center gap-1.5 text-sm text-neutral-500">
              <MapPin size={14} className="text-neutral-400" />
              {locationStr}
            </span>
          )}
          {/* {joinedDate && (
            <span className="flex items-center gap-1.5 text-sm text-neutral-500">
              <Calendar size={14} className="text-neutral-400" />
              Joined {formatJoinDate(joinedDate)}
            </span>
          )} */}
        </div>
      </div>
      <StoreConfirmModal setShowConfirm={setShowStoreConfirm} showConfirm={showStoreConfirm} />
    </>
  );
};

export default ProfileHeader;
