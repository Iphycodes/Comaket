'use client';

import React, { useState, useRef, useEffect, useCallback, RefObject } from 'react';
import { Select, Dropdown } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Star,
  Package,
  ChevronRight,
  X,
  Users,
  Store,
  ShoppingBag,
  UserCircle,
  Loader2,
  Sparkles,
  MapPin,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { CREATOR_INDUSTRIES } from '@grc/_shared/constant';
import { getRandomColorByString } from '@grc/_shared/helpers';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface LocationOption {
  name: string;
  iso2?: string;
}

interface CreatorsProps {
  // Tab
  activeTab: 'creators' | 'stores';
  onTabChange: (tab: 'creators' | 'stores') => void;
  // Data
  creators: any[];
  stores: any[];
  // Loading
  isLoadingCreators: boolean;
  isLoadingStores: boolean;
  isLoadingMoreCreators: boolean;
  isLoadingMoreStores: boolean;
  // Pagination
  hasMoreCreators: boolean;
  hasMoreStores: boolean;
  onLoadMoreCreators: () => void;
  onLoadMoreStores: () => void;
  // Filters
  searchQuery: string;
  onSearchChange: (q: string) => void;
  filterIndustry: string | null;
  onIndustryChange: (v: string | null) => void;
  filterState: string | null;
  onStateChange: (v: string | null) => void;
  filterCity: string | null;
  onCityChange: (v: string | null) => void;
  onClearFilters: () => void;
  // Location data
  states: LocationOption[];
  cities: LocationOption[];
  loadingStates: boolean;
  loadingCities: boolean;
  // Navigation
  onSelectCreator: (id: string) => void;
  onSelectStore: (id: string) => void;
  // Scroll restore
  scrollContainerRef?: RefObject<HTMLDivElement>;
}

// ═══════════════════════════════════════════════════════════════════════════
// VERIFIED BADGE
// ═══════════════════════════════════════════════════════════════════════════

const VerifiedBadge: React.FC<{ size?: number }> = () => (
  <i className="ri-verified-badge-fill text-[#1D9BF0]" />
);

// ═══════════════════════════════════════════════════════════════════════════
// SEARCHABLE FILTER SELECT (compact version for filter bar)
// ═══════════════════════════════════════════════════════════════════════════

const FilterSelect: React.FC<{
  options: LocationOption[];
  value: string | null;
  onChange: (v: string | null) => void;
  placeholder: string;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}> = ({ options, value, onChange, placeholder, loading, disabled, className }) => (
  <Select
    allowClear
    showSearch
    placeholder={placeholder}
    value={value}
    onChange={(val) => onChange(val || null)}
    loading={loading}
    disabled={disabled}
    filterOption={(input, option) =>
      (option?.label as string)?.toLowerCase().includes(input.toLowerCase())
    }
    options={options.map((o) => ({ label: o.name, value: o.name }))}
    className={`h-9 [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!border-neutral-200 dark:[&_.ant-select-selector]:!border-neutral-700 [&_.ant-select-selector]:!bg-white dark:[&_.ant-select-selector]:!bg-neutral-800 ${
      className || ''
    }`}
  />
);

// ═══════════════════════════════════════════════════════════════════════════
// TAB BAR (TikTok-style with sliding indicator)
// ═══════════════════════════════════════════════════════════════════════════

const TabBar: React.FC<{
  activeTab: 'creators' | 'stores';
  onTabChange: (tab: 'creators' | 'stores') => void;
  creatorsCount: number;
  storesCount: number;
}> = ({ activeTab, onTabChange, creatorsCount, storesCount }) => {
  const tabs = [
    {
      key: 'creators' as const,
      label: 'Creators',
      icon: <Users size={15} />,
      count: creatorsCount,
    },
    {
      key: 'stores' as const,
      label: 'Creator Stores',
      icon: <Store size={15} />,
      count: storesCount,
    },
  ];

  return (
    <div className="relative flex border-b border-neutral-200 dark:border-neutral-700/60">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            onClick={() => onTabChange(tab.key)}
            className={`relative flex-1 flex items-center justify-center gap-2 py-3 text-sm font-semibold transition-colors ${
              isActive
                ? 'text-blue'
                : 'text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
            {tab.count > 0 && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-blue/10 text-blue'
                    : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                }`}
              >
                {tab.count}
              </span>
            )}
            {isActive && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-blue rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON CARD
// ═══════════════════════════════════════════════════════════════════════════

const SkeletonCard: React.FC<{ type: 'creator' | 'store' }> = ({ type }) => (
  <div className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/40 p-5 animate-pulse">
    <div className="flex items-center gap-4">
      {/* Avatar skeleton */}
      <div
        className={`${
          type === 'creator' ? 'w-16 h-16' : 'w-14 h-14'
        } rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0`}
      />
      <div className="flex-1 space-y-2.5">
        <div className="h-4 bg-neutral-200 dark:bg-neutral-700 rounded-lg w-2/3" />
        <div className="h-3 bg-neutral-100 dark:bg-neutral-700/60 rounded-lg w-1/2" />
      </div>
    </div>
    <div className="mt-4 space-y-2">
      <div className="h-3 bg-neutral-100 dark:bg-neutral-700/40 rounded w-full" />
      <div className="h-3 bg-neutral-100 dark:bg-neutral-700/40 rounded w-3/4" />
    </div>
    <div className="flex gap-2 mt-4">
      <div className="h-6 w-16 bg-neutral-100 dark:bg-neutral-700/40 rounded-full" />
      <div className="h-6 w-16 bg-neutral-100 dark:bg-neutral-700/40 rounded-full" />
    </div>
  </div>
);

const SkeletonGrid: React.FC<{ count?: number; type: 'creator' | 'store'; isMobile: boolean }> = ({
  count = 6,
  type,
  isMobile,
}) => (
  <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} type={type} />
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// CREATOR CARD
// ═══════════════════════════════════════════════════════════════════════════

const CreatorCard: React.FC<{
  creator: any;
  onSelect: (username: string) => void;
  index: number;
}> = ({ creator, onSelect, index }) => {
  const displayName =
    creator.userId?.firstName && creator.userId?.lastName
      ? `${creator.userId.firstName} ${creator.userId.lastName}`
      : creator.username || 'Creator';

  const avatar = creator.profileImageUrl || creator.userId?.avatar || null;

  const industries = creator.industries || [];
  const rating = creator.rating || 0;
  const totalListings = creator.totalListings || 0;
  const totalFollowers = creator.totalFollowers || 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => onSelect(creator?.username || creator.id)}
      className="group relative bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/40 p-5 cursor-pointer hover:border-blue/40 dark:hover:border-blue/40 hover:shadow-lg hover:shadow-blue/5 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Large avatar */}
        <div className="relative flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={displayName}
              className="w-16 h-16 rounded-full object-cover ring-2 ring-neutral-100 dark:ring-neutral-700"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue/20 to-indigo-500/20 ring-2 ring-neutral-100 dark:ring-neutral-700 flex items-center justify-center">
              <UserCircle size={28} className="text-blue/60" />
            </div>
          )}
          {creator.isVerified && (
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center">
              <VerifiedBadge />
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <h3 className="font-bold text-[15px] text-neutral-900 dark:text-white truncate leading-tight">
              {displayName}
            </h3>
          </div>
          {creator.username && (
            <p className="text-xs text-neutral-400 mt-0.5">@{creator.username}</p>
          )}
          {creator.bio && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
              {creator.bio}
            </p>
          )}
        </div>

        <ChevronRight
          size={16}
          className="text-neutral-200 dark:text-neutral-700 group-hover:font-semibold transition-colors flex-shrink-0 mt-1"
        />
      </div>

      {/* Industries */}
      {industries.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3.5">
          {industries.slice(0, 3).map((ind: string) => (
            <span
              key={ind}
              className="inline-flex items-center px-2 py-0.5 bg-neutral-50 dark:bg-neutral-700/40 rounded-md text-[11px] font-medium text-neutral-500 dark:text-neutral-400"
            >
              {ind}
            </span>
          ))}
          {industries.length > 3 && (
            <span className="text-[11px] text-neutral-300 dark:text-neutral-600 self-center">
              +{industries.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Stats footer */}
      <div className="flex items-center gap-4 mt-3.5 pt-3 border-t border-neutral-50 dark:border-neutral-700/30">
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              {rating.toFixed(1)}
            </span>
            {creator.totalReviews > 0 && (
              <span className="text-[10px] text-neutral-400">({creator.totalReviews})</span>
            )}
          </div>
        )}
        {totalListings > 0 && (
          <>
            {rating > 0 && <span className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" />}
            <div className="flex items-center gap-1">
              <Package size={11} className="text-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {totalListings} listing{totalListings !== 1 ? 's' : ''}
              </span>
            </div>
          </>
        )}
        {totalFollowers > 0 && (
          <>
            <span className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex items-center gap-1">
              <Users size={11} className="text-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {totalFollowers}
              </span>
            </div>
          </>
        )}
        {/* {creator.totalStores > 0 && (
          <>
            <span className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex items-center gap-1">
              <Store size={11} className="text-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {creator.totalStores} store{creator.totalStores !== 1 ? 's' : ''}
              </span>
            </div>
          </>
        )} */}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STORE CARD
// ═══════════════════════════════════════════════════════════════════════════

const StoreCard: React.FC<{
  store: any;
  onSelect: (id: string) => void;
  index: number;
}> = ({ store, onSelect, index }) => {
  const router = useRouter();
  const nameInitial = (store.name || 'S').charAt(0).toUpperCase();
  const rating = store.rating || 0;
  const totalListings = store.totalListings || 0;
  const followers = store.followers || 0;

  const handleUsernameClick = (username: string) => {
    router.push(`/creators/${encodeURIComponent(username)}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.3 }}
      onClick={() => onSelect(store._id || store.id)}
      className="group relative bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/40 p-5 cursor-pointer hover:border-emerald-400/40 dark:hover:border-emerald-400/40 hover:shadow-lg hover:shadow-emerald-500/5 transition-all duration-300"
    >
      <div className="flex items-start gap-4">
        {/* Large logo */}
        <div className="relative flex-shrink-0">
          {store.logo ? (
            <img
              src={store.logo}
              alt={store.name}
              className="w-14 h-14 rounded-xl object-cover ring-2 ring-neutral-100 dark:ring-neutral-700"
            />
          ) : (
            <div
              className="w-14 h-14 rounded-xl ring-2 ring-neutral-100 dark:ring-neutral-700 flex items-center justify-center"
              style={{ backgroundColor: getRandomColorByString(nameInitial) }}
            >
              <span className="text-lg font-bold text-white">{nameInitial}</span>
            </div>
          )}
          {store.isVerified || store.isSuperVerified ? (
            <div className="absolute -bottom-0.5 -right-0.5 w-5 h-5 bg-white dark:bg-neutral-800 rounded-full flex items-center justify-center">
              {store.isSuperVerified ? (
                <i className="ri-verified-badge-fill text-[#E8A800] text-sm" />
              ) : (
                <VerifiedBadge />
              )}
            </div>
          ) : store.status === 'active' ? (
            <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 bg-emerald-400 rounded-full ring-2 ring-white dark:ring-neutral-800" />
          ) : null}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-[15px] text-neutral-900 dark:text-white truncate leading-tight">
            {store.name}
            {(store.isVerified || store.isSuperVerified) && (
              <span className="inline-flex ml-1 align-middle">
                {store.isSuperVerified ? (
                  <i className="ri-verified-badge-fill text-[#E8A800] text-xs" />
                ) : (
                  <i className="ri-verified-badge-fill text-[#1D9BF0] text-xs" />
                )}
              </span>
            )}
          </h3>
          {store.creatorId && !store.creatorId?.isSystemAccount && (
            <p className="text-[11px] text-neutral-500 dark:text-blue/60 mt-0.5 truncate">
              Owned by: @
              <span
                className="cursor-pointer hover:font-semibold"
                onClick={() => handleUsernameClick(store.creatorId?.username)}
              >
                {store.creatorId?.username}
              </span>
            </p>
          )}
          {/* {store.tagline && (
            <p className="text-[11px] text-blue/70 dark:text-blue/60 mt-0.5 truncate italic">
              {store.tagline}
            </p>
          )} */}
          {store.description && (
            <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1.5 line-clamp-2 leading-relaxed">
              {store.description}
            </p>
          )}
        </div>

        <ChevronRight
          size={16}
          className="text-neutral-200 dark:text-neutral-700 group-hover:text-emerald-500 transition-colors flex-shrink-0 mt-1"
        />
      </div>

      {/* Category tag */}
      {store.category && (
        <div className="mt-3.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-50 dark:bg-emerald-900/20 rounded-md text-[11px] font-medium text-emerald-600 dark:text-emerald-400">
            <ShoppingBag size={10} />
            {store.category}
          </span>
        </div>
      )}

      {/* Stats footer */}
      <div className="flex items-center gap-4 mt-3.5 pt-3 border-t border-neutral-50 dark:border-neutral-700/30">
        {rating > 0 && (
          <div className="flex items-center gap-1">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
              {rating.toFixed(1)}
            </span>
            {store.totalReviews > 0 && (
              <span className="text-[10px] text-neutral-400">({store.totalReviews})</span>
            )}
          </div>
        )}
        {totalListings > 0 && (
          <>
            {rating > 0 && <span className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" />}
            <div className="flex items-center gap-1">
              <Package size={11} className="text-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {totalListings} item{totalListings !== 1 ? 's' : ''}
              </span>
            </div>
          </>
        )}
        {followers > 0 && (
          <>
            <span className="w-px h-3 bg-neutral-200 dark:bg-neutral-700" />
            <div className="flex items-center gap-1">
              <Users size={11} className="text-neutral-400" />
              <span className="text-xs text-neutral-500 dark:text-neutral-400">
                {followers} Followers
              </span>
            </div>
          </>
        )}
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// INFINITE SCROLL SENTINEL
// ═══════════════════════════════════════════════════════════════════════════

const InfiniteScrollSentinel: React.FC<{
  onIntersect: () => void;
  hasMore: boolean;
  isLoading: boolean;
}> = ({ onIntersect, hasMore, isLoading }) => {
  const sentinelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!hasMore || isLoading) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          onIntersect();
        }
      },
      { rootMargin: '200px' }
    );

    const el = sentinelRef.current;
    if (el) observer.observe(el);

    return () => {
      if (el) observer.unobserve(el);
    };
  }, [onIntersect, hasMore, isLoading]);

  if (!hasMore) return null;

  return (
    <div ref={sentinelRef} className="flex items-center justify-center py-8">
      {isLoading && (
        <div className="flex items-center gap-2 text-neutral-400 text-sm">
          <Loader2 size={16} className="animate-spin" />
          <span>Loading more...</span>
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// EMPTY STATE
// ═══════════════════════════════════════════════════════════════════════════

const EmptyState: React.FC<{
  type: 'creators' | 'stores';
  hasFilters: boolean;
  onClear: () => void;
}> = ({ type, hasFilters, onClear }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.95 }}
    animate={{ opacity: 1, scale: 1 }}
    className="text-center py-20"
  >
    {type === 'creators' ? (
      <Users size={48} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-4" />
    ) : (
      <Store size={48} className="mx-auto text-neutral-200 dark:text-neutral-700 mb-4" />
    )}
    <p className="text-neutral-500 dark:text-neutral-400 font-semibold">
      No {type === 'creators' ? 'creators' : 'stores'} found
    </p>
    <p className="text-xs text-neutral-400 mt-1">Try adjusting your search or filters</p>
    {hasFilters && (
      <button onClick={onClear} className="mt-4 text-sm text-blue hover:underline font-medium">
        Clear all filters
      </button>
    )}
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Creators: React.FC<CreatorsProps> = (props) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const searchTimerRef = useRef<NodeJS.Timeout | null>(null);
  const [searchInput, setSearchInput] = useState(props.searchQuery);

  // ── Scroll-hide header (mobile only, Twitter-style) ───────────────
  const [headerMode, setHeaderMode] = useState<'static' | 'visible' | 'hidden'>('static');
  const lastScrollYRef = useRef(0);
  const internalScrollRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = props.scrollContainerRef || internalScrollRef;
  const headerRef = useRef<HTMLDivElement>(null);
  const headerHeightRef = useRef(0);

  useEffect(() => {
    if (!isMobile) return;
    const container = scrollContainerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const currentY = container.scrollTop;
      const delta = currentY - lastScrollYRef.current;
      const headerH = headerHeightRef.current || (headerRef.current?.offsetHeight ?? 0);
      if (headerRef.current) headerHeightRef.current = headerRef.current.offsetHeight;

      if (currentY <= 10) {
        setHeaderMode('static');
      } else if (delta < -3) {
        setHeaderMode('visible');
      } else if (delta > 5 && currentY > headerH) {
        setHeaderMode('hidden');
      }

      lastScrollYRef.current = currentY;
    };

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [isMobile]);

  const {
    activeTab,
    onTabChange,
    creators,
    stores,
    isLoadingCreators,
    isLoadingStores,
    isLoadingMoreCreators,
    isLoadingMoreStores,
    hasMoreCreators,
    hasMoreStores,
    onLoadMoreCreators,
    onLoadMoreStores,
    filterIndustry,
    onIndustryChange,
    filterState,
    onStateChange,
    filterCity,
    onCityChange,
    onClearFilters,
    states,
    cities,
    loadingStates,
    loadingCities,
    onSelectCreator,
    onSelectStore,
    onSearchChange,
  } = props;

  // ── Debounced search ────────────────────────────────────────────────
  const handleSearchInput = useCallback(
    (value: string) => {
      setSearchInput(value);
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
      searchTimerRef.current = setTimeout(() => {
        onSearchChange(value);
      }, 400);
    },
    [onSearchChange]
  );

  // Sync external changes
  useEffect(() => {
    setSearchInput(props.searchQuery);
  }, [props.searchQuery]);

  const hasActiveFilters = !!filterIndustry || !!filterState || !!filterCity || !!props.searchQuery;

  const industryOptions = CREATOR_INDUSTRIES.map((ind) => ({
    label: ind.label,
    value: ind.id,
  }));

  // ── Header class logic ─────────────────────────────────────────────
  const getHeaderClassName = () => {
    const base =
      'bg-neutral-50 dark:bg-neutral-900/95 backdrop-blur-md z-20 border-b border-neutral-200 dark:border-neutral-700/60';

    if (!isMobile) {
      return `sticky top-0 ${base} pt-3 pb-0`;
    }

    // Mobile modes
    switch (headerMode) {
      case 'static':
        return `relative ${base} pt-14 pb-0`;
      case 'visible':
        return `fixed top-0 left-0 right-0 shadow-md ${base} pt-14 pb-0`;
      case 'hidden':
        return `fixed top-0 left-0 right-0 shadow-md ${base} pt-14 pb-0`;
      default:
        return `relative ${base} pt-14 pb-0`;
    }
  };

  const getHeaderStyle = (): React.CSSProperties => {
    if (!isMobile) return {};
    switch (headerMode) {
      case 'hidden':
        return { transform: 'translateY(-100%)', transition: 'transform 0.3s ease-out' };
      case 'visible':
        return { transform: 'translateY(0)', transition: 'transform 0.15s ease-out' };
      default:
        return {};
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      style={isMobile ? { height: '100vh', overflowY: 'auto' } : undefined}
      className={`dark:bg-neutral-900/50 bg-neutral-50 min-h-screen ${
        isMobile ? 'max-w-[100vw] pb-20' : 'w-full pt-8'
      }`}
    >
      <div className={`w-full ${!isMobile ? 'mx-auto px-4' : 'px-3'}`}>
        {/* ── Header ──────────────────────────────────────────────────── */}
        {/* Title + subtitle — NOT sticky on desktop */}
        {!isMobile && (
          <div className="pt-4 pb-3">
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white flex items-center gap-2">
              <Sparkles size={20} className="text-blue" />
              Discover Creators
            </h1>
            <p className="text-xs text-neutral-400 mt-0.5">
              Find creators and stores on {process.env.NEXT_PUBLIC_APP_NAME || 'Kraft'}
            </p>
          </div>
        )}

        <div ref={headerRef} className={getHeaderClassName()} style={getHeaderStyle()}>
          <div
            className={isMobile ? 'flex-col items-start gap-1' : 'flex w-full items-center gap-2'}
          >
            {/* Search bar + location (same row on mobile; on desktop, search merges into filters row below) */}
            <div className={`flex items-center gap-2 w-full ${isMobile ? 'mb-3' : 'hidden'}`}>
              <div className="relative flex-1">
                <Search
                  size={16}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  placeholder="Search by name, industry, keyword..."
                  value={searchInput}
                  onChange={(e) => handleSearchInput(e.target.value)}
                  className="w-full h-9 pl-10 pr-10 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
                />
                {searchInput && (
                  <button
                    onClick={() => handleSearchInput('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>

              {/* Location button — inline on mobile */}
              {isMobile && (
                <Dropdown
                  trigger={['click']}
                  placement="bottomRight"
                  dropdownRender={() => (
                    <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-xl border border-neutral-200 dark:border-neutral-700 p-3 min-w-[240px] space-y-2">
                      <FilterSelect
                        options={states}
                        value={filterState}
                        onChange={onStateChange}
                        placeholder="State"
                        loading={loadingStates}
                        className="w-full !h-9"
                      />
                      <FilterSelect
                        options={cities}
                        value={filterCity}
                        onChange={onCityChange}
                        placeholder="City"
                        loading={loadingCities}
                        disabled={!filterState}
                        className="w-full !h-9"
                      />
                    </div>
                  )}
                >
                  <button
                    className={`flex-shrink-0 flex items-center justify-center w-9 h-9 rounded-xl border transition-colors ${
                      filterState
                        ? 'bg-blue/10 text-blue border-blue/30'
                        : 'bg-white dark:bg-neutral-800 text-neutral-500 border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    <MapPin size={16} />
                  </button>
                </Dropdown>
              )}
            </div>

            {/* Filters row */}
            {isMobile ? (
              <div className="pb-2 space-y-2">
                {/* Industry tags — horizontal scroll */}
                <div
                  className="flex items-center gap-1.5 overflow-x-auto pb-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <button
                    onClick={() => onIndustryChange(null)}
                    className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border whitespace-nowrap ${
                      !filterIndustry
                        ? 'bg-blue text-white border-blue'
                        : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                    }`}
                  >
                    All
                  </button>
                  {industryOptions.map((ind) => (
                    <button
                      key={ind.value}
                      onClick={() =>
                        onIndustryChange(filterIndustry === ind.value ? null : ind.value)
                      }
                      className={`flex-shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all border whitespace-nowrap ${
                        filterIndustry === ind.value
                          ? 'bg-blue text-white border-blue'
                          : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
                      }`}
                    >
                      {ind.label}
                    </button>
                  ))}

                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        onClearFilters();
                        setSearchInput('');
                      }}
                      className="flex-shrink-0 flex items-center gap-1 px-2.5 py-1 text-[11px] font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-full border border-red-200 dark:border-red-800/40 transition-colors whitespace-nowrap"
                    >
                      <X size={11} />
                      Clear
                    </button>
                  )}
                </div>
              </div>
            ) : (
              <div className="pb-3 space-y-2 overflow-hidden">
                {/* Row 1: Search + Location filters */}
                <div className="flex items-center gap-2">
                  <div className="relative flex-1">
                    <Search
                      size={16}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400"
                    />
                    <input
                      type="text"
                      placeholder="Search by name, industry, keyword..."
                      value={searchInput}
                      onChange={(e) => handleSearchInput(e.target.value)}
                      className="w-full h-10 pl-10 pr-10 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
                    />
                    {searchInput && (
                      <button
                        onClick={() => handleSearchInput('')}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-300 hover:text-neutral-500 transition-colors"
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                  <FilterSelect
                    options={states}
                    value={filterState}
                    onChange={onStateChange}
                    placeholder="State"
                    loading={loadingStates}
                    className="w-[150px] !h-10"
                  />

                  <FilterSelect
                    options={cities}
                    value={filterCity}
                    onChange={onCityChange}
                    placeholder="City"
                    loading={loadingCities}
                    disabled={!filterState}
                    className="w-[150px] !h-10"
                  />

                  {hasActiveFilters && (
                    <button
                      onClick={() => {
                        onClearFilters();
                        setSearchInput('');
                      }}
                      className="flex items-center gap-1 px-3 h-10 text-xs font-medium text-neutral-500 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg border border-neutral-200 dark:border-neutral-700 transition-colors flex-shrink-0"
                    >
                      <X size={12} />
                      Clear
                    </button>
                  )}
                </div>

                {/* Row 2: Industry tags — horizontal scroll */}
                <div
                  className="flex items-center gap-1.5 overflow-x-auto max-w-full"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <button
                    onClick={() => onIndustryChange(null)}
                    className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
                      !filterIndustry
                        ? 'bg-blue text-white border-blue shadow-sm'
                        : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-blue/30'
                    }`}
                  >
                    All
                  </button>
                  {industryOptions.map((ind) => (
                    <button
                      key={ind.value}
                      onClick={() =>
                        onIndustryChange(filterIndustry === ind.value ? null : ind.value)
                      }
                      className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
                        filterIndustry === ind.value
                          ? 'bg-blue text-white border-blue shadow-sm'
                          : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700 hover:border-blue/30'
                      }`}
                    >
                      {ind.label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Tabs */}
          <TabBar
            activeTab={activeTab}
            onTabChange={onTabChange}
            creatorsCount={creators.length}
            storesCount={stores.length}
          />
        </div>

        {/* Spacer when header is fixed on mobile */}
        {isMobile && headerMode !== 'static' && (
          <div style={{ height: headerHeightRef.current || 0 }} />
        )}

        {/* ── Content Area ─────────────────────────────────────────────── */}
        <div className="pt-5 pb-10">
          <AnimatePresence mode="wait">
            {/* ── Creators Tab ─────────────────────────────────────────── */}
            {activeTab === 'creators' && (
              <motion.div
                key="creators-tab"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.2 }}
              >
                {isLoadingCreators ? (
                  <SkeletonGrid count={6} type="creator" isMobile={isMobile} />
                ) : creators.length > 0 ? (
                  <>
                    <div
                      className={`grid gap-4 ${
                        isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'
                      }`}
                    >
                      {creators.map((creator, i) => (
                        <CreatorCard
                          key={creator._id || creator.id}
                          creator={creator}
                          onSelect={onSelectCreator}
                          index={i}
                        />
                      ))}
                    </div>

                    {/* Load more skeletons */}
                    {isLoadingMoreCreators && (
                      <div className="mt-4">
                        <SkeletonGrid count={3} type="creator" isMobile={isMobile} />
                      </div>
                    )}

                    <InfiniteScrollSentinel
                      onIntersect={onLoadMoreCreators}
                      hasMore={hasMoreCreators}
                      isLoading={isLoadingMoreCreators}
                    />
                  </>
                ) : (
                  <EmptyState
                    type="creators"
                    hasFilters={hasActiveFilters}
                    onClear={() => {
                      onClearFilters();
                      setSearchInput('');
                    }}
                  />
                )}
              </motion.div>
            )}

            {/* ── Stores Tab ───────────────────────────────────────────── */}
            {activeTab === 'stores' && (
              <motion.div
                key="stores-tab"
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -10 }}
                transition={{ duration: 0.2 }}
              >
                {isLoadingStores ? (
                  <SkeletonGrid count={6} type="store" isMobile={isMobile} />
                ) : stores.length > 0 ? (
                  <>
                    <div
                      className={`grid gap-4 ${
                        isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'
                      }`}
                    >
                      {stores.map((store, i) => (
                        <StoreCard
                          key={store._id || store.id}
                          store={store}
                          onSelect={onSelectStore}
                          index={i}
                        />
                      ))}
                    </div>

                    {isLoadingMoreStores && (
                      <div className="mt-4">
                        <SkeletonGrid count={3} type="store" isMobile={isMobile} />
                      </div>
                    )}

                    <InfiniteScrollSentinel
                      onIntersect={onLoadMoreStores}
                      hasMore={hasMoreStores}
                      isLoading={isLoadingMoreStores}
                    />
                  </>
                ) : (
                  <EmptyState
                    type="stores"
                    hasFilters={hasActiveFilters}
                    onClear={() => {
                      onClearFilters();
                      setSearchInput('');
                    }}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Creators;
