import React from 'react';
import { Tooltip } from 'antd';
import { Mail, Phone, Edit3, ShoppingBag, Settings } from 'lucide-react';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';

interface ProfileCardProps {
  userProfile?: any;
  onEditClick: () => void;
  isMobile: boolean;
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userProfile, onEditClick, isMobile }) => {
  const firstName = userProfile?.firstName || '';
  const lastName = userProfile?.lastName || '';
  const fullName = `${firstName} ${lastName}`.trim() || 'User';
  const email = userProfile?.email || '';
  const avatarUrl = userProfile?.avatar || '';
  const phoneNumber = userProfile?.mobile?.phoneNumber || '';

  // ── MOBILE: Centered layout ─────────────────────────────────────────
  if (isMobile) {
    return (
      <div className="px-4 mt-10">
        <div className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 overflow-hidden">
          <div className="px-5 pb-6 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="relative mb-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-40 h-40 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-lg"
                />
              ) : (
                <div
                  className="w-20 h-20 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-white dark:border-neutral-800 shadow-lg"
                  style={{ backgroundColor: getRandomColorByString(firstName || 'U') }}
                >
                  {getFirstCharacter(firstName || 'U')}
                </div>
              )}
            </div>

            <h1 className="text-lg font-bold text-neutral-900 dark:text-white">{fullName}</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-neutral-100 dark:bg-neutral-700/50 text-neutral-500 dark:text-neutral-400 rounded-full text-[11px] font-semibold mt-1">
              <ShoppingBag size={11} />
              Member
            </span>

            {userProfile?.bio && (
              <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-2.5 max-w-sm leading-relaxed">
                {userProfile.bio}
              </p>
            )}

            {/* <div className="flex flex-wrap justify-center gap-2 mt-4">
              {email && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-700/40 rounded-lg text-xs text-neutral-500 dark:text-neutral-400">
                  <Mail size={12} className="text-neutral-400" />
                  {email}
                </span>
              )}
              {phoneNumber && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-700/40 rounded-lg text-xs text-neutral-500 dark:text-neutral-400">
                  <Phone size={12} className="text-neutral-400" />
                  {phoneNumber}
                </span>
              )}
              {locationStr && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-700/40 rounded-lg text-xs text-neutral-500 dark:text-neutral-400">
                  <MapPin size={12} className="text-neutral-400" />
                  {locationStr}
                </span>
              )}
              {joinedDate && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-700/40 rounded-lg text-xs text-neutral-500 dark:text-neutral-400">
                  <Calendar size={12} className="text-neutral-400" />
                  Joined {formatJoinDate(joinedDate)}
                </span>
              )}
            </div> */}

            <div className="flex items-center gap-2 mt-5">
              <button
                onClick={onEditClick}
                className="flex items-center gap-1.5 px-5 py-2 !bg-neutral-50 rounded-xl text-sm font-semibold shadow-sm shadow-blue/20 hover:shadow-md transition-all"
              >
                <Edit3 size={14} />
                Edit Profile
              </button>
              <Tooltip title="Settings">
                <button className="w-9 h-9 flex items-center justify-center bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-all">
                  <Settings size={16} className="text-neutral-500" />
                </button>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── DESKTOP: Original left-aligned layout ───────────────────────────
  return (
    <div className="mt-10">
      <div className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 overflow-hidden py-4">
        <div className="px-5 pb-5">
          <div className="flex items-end justify-between">
            <div className="relative">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={fullName}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-neutral-800 shadow-lg"
                />
              ) : (
                <div
                  className="w-24 h-24 rounded-full flex items-center justify-center text-white text-3xl font-bold border-4 border-white dark:border-neutral-800 shadow-lg"
                  style={{ backgroundColor: getRandomColorByString(firstName || 'U') }}
                >
                  {getFirstCharacter(firstName || 'U')}
                </div>
              )}
              <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-neutral-800" />
            </div>
            <div className="flex gap-2 pb-1">
              <button
                onClick={onEditClick}
                className="flex items-center gap-1.5 px-4 py-2 bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-all"
              >
                <Edit3 size={14} />
                Edit
              </button>
              <Tooltip title="Settings">
                <button className="w-9 h-9 flex items-center justify-center bg-neutral-50 dark:bg-neutral-700 border border-neutral-200 dark:border-neutral-600 rounded-xl hover:bg-neutral-100 dark:hover:bg-neutral-600 transition-all">
                  <Settings size={16} className="text-neutral-500" />
                </button>
              </Tooltip>
            </div>
          </div>

          <div className="mt-3">
            <div className="flex items-center gap-1">
              <h1 className="text-xl font-bold text-neutral-900 dark:text-white">{fullName}</h1>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-neutral-100 dark:bg-neutral-700/50 text-neutral-500 dark:text-neutral-400 rounded-full text-[11px] font-semibold mt-1">
                <ShoppingBag size={11} />
                Member
              </span>
            </div>

            {userProfile?.bio && <p className="text-sm text-neutral-500 mt-1">{userProfile.bio}</p>}

            <div className="flex flex-col gap-y-1 mt-2 text-sm text-neutral-500">
              <span className="flex items-center gap-1.5">
                <Mail size={13} className="text-neutral-400" />
                {email}
              </span>
              {phoneNumber && (
                <span className="flex items-center gap-1.5">
                  <Phone size={13} className="text-neutral-400" />
                  {phoneNumber}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;
