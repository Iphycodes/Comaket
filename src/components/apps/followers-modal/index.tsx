'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Modal } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, UserPlus, UserCheck, Loader2, Users, ChevronRight } from 'lucide-react';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useRouter } from 'next/navigation';
import { useFollows } from '@grc/hooks/useFollows';
import type { FollowTargetType } from '@grc/services/follows';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES — matches actual API response
// ═══════════════════════════════════════════════════════════════════════════

export interface FollowerUser {
  _id: string;
  firstName?: string;
  lastName?: string;
  avatar?: string | null;
}

export interface FollowerCreatorProfile {
  _id: string;
  username?: string;
  slug?: string;
  profileImageUrl?: string | null;
  isVerified?: boolean;
}

export interface FollowerItem {
  _id: string;
  userId: FollowerUser;
  targetType: FollowTargetType;
  targetId: string;
  isCreator: boolean;
  creatorProfile: FollowerCreatorProfile | null;
  createdAt?: string;
  updatedAt?: string;
}

interface FollowersModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  targetType: FollowTargetType;
  targetId: string;
  currentUserId?: string;
  /**
   * When true, uses getMyFollows (own profile view) which enables follow-back.
   * When false, uses getFollowers (public view of someone else's followers).
   */
  isOwnProfile?: boolean;
}

const PER_PAGE = 20;
const SEARCH_DEBOUNCE = 400;

// ═══════════════════════════════════════════════════════════════════════════
// SKELETON ROW
// ═══════════════════════════════════════════════════════════════════════════

const FollowerSkeleton: React.FC = () => (
  <div className="flex items-center gap-3 px-4 py-3 animate-pulse">
    <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700 flex-shrink-0" />
    <div className="flex-1 space-y-1.5">
      <div className="h-3.5 bg-neutral-200 dark:bg-neutral-700 rounded w-28" />
      <div className="h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded w-20" />
    </div>
    <div className="h-7 w-16 bg-neutral-200 dark:bg-neutral-700 rounded-lg flex-shrink-0" />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// FOLLOWER ROW
// ═══════════════════════════════════════════════════════════════════════════

const FollowerRow: React.FC<{
  follower: FollowerItem;
  isFollowingBack: boolean;
  isToggling: boolean;
  onToggleFollow: () => void;
  onViewProfile: () => void;
  showFollowBack: boolean;
}> = ({ follower, isFollowingBack, isToggling, onToggleFollow, onViewProfile, showFollowBack }) => {
  const user = follower.userId;
  const creator = follower.creatorProfile;
  const isCreator = follower.isCreator && !!creator;

  const firstName = user?.firstName || '';
  const lastName = user?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';
  const avatar = creator?.profileImageUrl || user?.avatar || '';
  const username = creator?.username || creator?.slug || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 5 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors group"
    >
      <button
        onClick={isCreator ? onViewProfile : undefined}
        className={`flex-shrink-0 ${isCreator ? 'cursor-pointer' : 'cursor-default'}`}
      >
        {avatar ? (
          <img src={avatar} alt={fullName} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: getRandomColorByString(firstName || 'U') }}
          >
            {getFirstCharacter(firstName || 'U')}
          </div>
        )}
      </button>

      <button
        onClick={isCreator ? onViewProfile : undefined}
        className={`flex-1 min-w-0 text-left ${isCreator ? 'cursor-pointer' : 'cursor-default'}`}
      >
        <div className="flex items-center gap-1.5">
          <p
            className={`text-sm font-semibold text-neutral-900 dark:text-white truncate ${
              isCreator ? 'group-hover:font-semibold transition-colors' : ''
            }`}
          >
            {fullName}
          </p>
          {creator?.isVerified && (
            <i className="ri-verified-badge-fill text-[#1D9BF0] text-[14px] flex-shrink-0" />
          )}
        </div>
        {isCreator && username ? (
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">@{username}</p>
        ) : (
          <p className="text-[11px] text-neutral-400 dark:text-neutral-500">Member</p>
        )}
      </button>

      {showFollowBack && isCreator && creator?._id && (
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onToggleFollow}
          disabled={isToggling}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex-shrink-0 ${
            isFollowingBack
              ? 'bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-red-300 hover:text-red-500'
              : 'bg-blue text-white hover:bg-indigo-600'
          }`}
        >
          {isToggling ? (
            <Loader2 size={12} className="animate-spin" />
          ) : isFollowingBack ? (
            <>
              <UserCheck size={12} />
              <span className="hidden sm:inline">Following</span>
            </>
          ) : (
            <>
              <UserPlus size={12} />
              Follow
            </>
          )}
        </motion.button>
      )}

      {isCreator && (
        <ChevronRight
          size={14}
          className="text-neutral-300 dark:text-neutral-600 group-hover:text-neutral-500 transition-colors flex-shrink-0"
        />
      )}
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MOBILE BOTTOM SHEET
// ═══════════════════════════════════════════════════════════════════════════

const MobileSheet: React.FC<{
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ open, onClose, title, children }) => (
  <AnimatePresence>
    {open && (
      <>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 z-[200]"
        />
        <motion.div
          initial={{ y: '100%' }}
          animate={{ y: 0 }}
          exit={{ y: '100%' }}
          transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[201] bg-white dark:bg-neutral-900 rounded-t-2xl max-h-[85vh] flex flex-col"
        >
          <div className="pt-3 pb-2 px-5 border-b border-neutral-100 dark:border-neutral-800">
            <div className="w-10 h-1 bg-neutral-200 dark:bg-neutral-700 rounded-full mx-auto mb-3" />
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">{title}</h3>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center"
              >
                <X size={16} className="text-neutral-500" />
              </button>
            </div>
          </div>
          <div className="flex-1 overflow-hidden">{children}</div>
        </motion.div>
      </>
    )}
  </AnimatePresence>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const FollowersModal: React.FC<FollowersModalProps> = ({
  open,
  onClose,
  title = 'Followers',
  targetType,
  targetId,
  currentUserId,
  isOwnProfile = false,
}) => {
  const router = useRouter();
  const isMobile = useMediaQuery(mediaSize.mobile);

  const { getFollowers, getMyFollows, toggleFollow, checkFollow } = useFollows();

  // ── State ───────────────────────────────────────────────────────────
  const [allFollowers, setAllFollowers] = useState<FollowerItem[]>([]);
  const [totalFollowers, setTotalFollowers] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [followStatusMap, setFollowStatusMap] = useState<Record<string, boolean>>({});
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const hasInitialized = useRef(false);
  const searchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Debounce search ─────────────────────────────────────────────────
  useEffect(() => {
    if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    searchTimerRef.current = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, SEARCH_DEBOUNCE);
    return () => {
      if (searchTimerRef.current) clearTimeout(searchTimerRef.current);
    };
  }, [searchQuery]);

  // ── Fetch followers (supports both own profile + public) ────────────
  const loadFollowers = useCallback(
    async (page: number, search: string, append: boolean = false) => {
      if (!open) return;
      if (page === 1) setIsLoading(true);
      else setIsLoadingMore(true);

      try {
        let items: FollowerItem[] = [];
        let total = 0;

        if (isOwnProfile) {
          // Own profile — use getMyFollows
          const result = await getMyFollows({
            page,
            perPage: PER_PAGE,
            targetType,
            ...(search ? { search } : {}),
          });
          items = result?.data?.data || result?.data?.items || [];
          total = result?.data?.meta?.pagination?.total || result?.data?.total || items.length;
        } else {
          // Public view — use getFollowers
          if (!targetId) return;
          const result = await getFollowers(targetType, targetId, {
            page,
            perPage: PER_PAGE,
            ...(search ? { search } : {}),
          });
          items = result?.data || [];
          total = result?.meta?.pagination?.total || items.length;
        }

        if (append) {
          setAllFollowers((prev) => {
            const existingIds = new Set(prev.map((f) => f._id));
            const unique = items.filter((f) => !existingIds.has(f._id));
            return [...prev, ...unique];
          });
        } else {
          setAllFollowers(items);
        }

        setTotalFollowers(total);
        setHasMore(page * PER_PAGE < total);

        // Check follow-back status for creators in this batch
        const creatorIds = items
          .filter((f) => f.isCreator && f.creatorProfile?._id)
          .map((f) => f.creatorProfile!._id);

        if (creatorIds.length > 0) {
          try {
            const statusResult = await checkFollow({
              targetType: 'creator',
              targetIds: creatorIds,
            });
            if (statusResult) {
              setFollowStatusMap((prev) => ({ ...prev, ...statusResult }));
            }
          } catch {}
        }
      } catch {
      } finally {
        setIsLoading(false);
        setIsLoadingMore(false);
      }
    },
    [open, isOwnProfile, targetId, targetType, getFollowers, getMyFollows, checkFollow]
  );

  // ── Initial load when modal opens ───────────────────────────────────
  useEffect(() => {
    if (!open) return;
    if (!isOwnProfile && !targetId) return;
    setAllFollowers([]);
    setCurrentPage(1);
    setHasMore(false);
    setFollowStatusMap({});
    setSearchQuery('');
    setDebouncedSearch('');
    hasInitialized.current = false;
    loadFollowers(1, '').then(() => {
      hasInitialized.current = true;
    });
  }, [open, targetId, targetType, isOwnProfile]);

  // ── Re-fetch when debounced search changes ──────────────────────────
  useEffect(() => {
    if (!hasInitialized.current) return;
    setAllFollowers([]);
    setCurrentPage(1);
    setHasMore(false);
    loadFollowers(1, debouncedSearch);
  }, [debouncedSearch]);

  // ── Load more ───────────────────────────────────────────────────────
  const handleLoadMore = useCallback(() => {
    if (isLoadingMore || !hasMore || !hasInitialized.current) return;
    const nextPage = currentPage + 1;
    setCurrentPage(nextPage);
    loadFollowers(nextPage, debouncedSearch, true);
  }, [currentPage, isLoadingMore, hasMore, loadFollowers, debouncedSearch]);

  // ── IntersectionObserver for infinite scroll ────────────────────────
  useEffect(() => {
    const sentinel = sentinelRef.current;
    const container = scrollContainerRef.current;
    if (!sentinel || !container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoadingMore && !isLoading) {
          handleLoadMore();
        }
      },
      { root: container, rootMargin: '100px' }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [handleLoadMore, hasMore, isLoadingMore, isLoading]);

  // ── Toggle follow-back ──────────────────────────────────────────────
  const handleToggleFollowBack = useCallback(
    async (creatorId: string) => {
      setTogglingId(creatorId);
      try {
        const result = await toggleFollow({
          targetType: 'creator',
          targetId: creatorId,
        });
        const followed = result?.followed ?? !followStatusMap[creatorId];
        setFollowStatusMap((prev) => ({ ...prev, [creatorId]: followed }));
      } catch {
      } finally {
        setTogglingId(null);
      }
    },
    [toggleFollow, followStatusMap]
  );

  // ── Navigate to creator profile ─────────────────────────────────────
  const handleViewProfile = useCallback(
    (follower: FollowerItem) => {
      const username = follower.creatorProfile?.username || follower.creatorProfile?.slug;
      if (username) {
        router.push(`/creators/${encodeURIComponent(username)}`);
        onClose();
      }
    },
    [router, onClose]
  );

  // ── Content ─────────────────────────────────────────────────────────
  const content = (
    <div className="flex flex-col h-full">
      {/* Search — backend-driven */}
      <div className="px-4 py-3 border-b border-neutral-100 dark:border-neutral-800 flex-shrink-0">
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search followers..."
            className="w-full h-10 pl-9 pr-9 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-800 dark:text-white outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X size={14} className="text-neutral-400 hover:text-neutral-600" />
            </button>
          )}
        </div>
        <p className="text-[11px] text-neutral-400 mt-2 px-1">
          {totalFollowers} follower{totalFollowers !== 1 ? 's' : ''}
          {debouncedSearch && ' (filtered)'}
        </p>
      </div>

      {/* List */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div>
            {[1, 2, 3, 4, 5].map((i) => (
              <FollowerSkeleton key={i} />
            ))}
          </div>
        ) : allFollowers.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users size={36} className="text-neutral-200 dark:text-neutral-700 mb-3" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              {debouncedSearch ? 'No followers match your search' : 'No followers yet'}
            </p>
            {debouncedSearch && (
              <button
                onClick={() => setSearchQuery('')}
                className="text-xs text-blue hover:underline mt-1"
              >
                Clear search
              </button>
            )}
          </div>
        ) : (
          <>
            <div className="divide-y divide-neutral-50 dark:divide-neutral-800/50">
              {allFollowers.map((follower) => {
                const creatorId = follower.creatorProfile?._id || '';
                const isOwnEntry = currentUserId && follower.userId?._id === currentUserId;

                return (
                  <FollowerRow
                    key={follower._id}
                    follower={follower}
                    isFollowingBack={!!followStatusMap[creatorId]}
                    isToggling={togglingId === creatorId}
                    onToggleFollow={() => handleToggleFollowBack(creatorId)}
                    onViewProfile={() => handleViewProfile(follower)}
                    showFollowBack={!isOwnEntry && isOwnProfile}
                  />
                );
              })}
            </div>

            {/* Infinite scroll sentinel */}
            {hasMore && (
              <>
                <div ref={sentinelRef} className="h-1" />
                {isLoadingMore && (
                  <div>
                    {[1, 2, 3].map((i) => (
                      <FollowerSkeleton key={`more-${i}`} />
                    ))}
                  </div>
                )}
              </>
            )}

            {/* End of list */}
            {!hasMore && allFollowers.length > 0 && (
              <p className="text-center text-[11px] text-neutral-400 py-4">
                Showing all {allFollowers.length} follower
                {allFollowers.length !== 1 ? 's' : ''}
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );

  if (isMobile) {
    return (
      <MobileSheet open={open} onClose={onClose} title={title}>
        {content}
      </MobileSheet>
    );
  }

  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      title={null}
      width={600}
      className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden [&_.ant-modal-content]:!p-0 [&_.ant-modal-body]:!p-0"
    >
      <div className="flex flex-col" style={{ maxHeight: '70vh' }}>
        <div className="px-5 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-800 flex items-center justify-between flex-shrink-0">
          <h3 className="text-base font-bold text-neutral-900 dark:text-white">{title}</h3>
        </div>
        {content}
      </div>
    </Modal>
  );
};

export default FollowersModal;
