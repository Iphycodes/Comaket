'use client';

import React from 'react';
import { Phone, Mail, Globe, MessageCircle, ExternalLink } from 'lucide-react';
import { CreatorProfileData, getIndustryLabel, PLAN_LABELS } from './profile-helpers';

interface ProfileAboutTabProps {
  creatorProfile?: CreatorProfileData;
  userEmail: string;
  isMobile: boolean;
  onEditProfile: () => void;
}

const ProfileAboutTab: React.FC<ProfileAboutTabProps> = ({ creatorProfile, userEmail }) => {
  const bio = creatorProfile?.bio || '';
  const industries = creatorProfile?.industries || [];
  const phone = creatorProfile?.phoneNumber || '';
  const whatsapp = creatorProfile?.whatsappNumber || '';
  const email = creatorProfile?.contactEmail || userEmail;
  const website = creatorProfile?.website || '';
  const socialLinks = creatorProfile?.socialLinks;
  const plan = creatorProfile?.plan || 'starter';
  const planConfig = PLAN_LABELS[plan] || PLAN_LABELS.starter;
  const username = creatorProfile?.username || '';

  return (
    <div className="space-y-5">
      {/* <div className="flex justify-end">
        <button
          onClick={onEditProfile}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 rounded-xl text-sm font-semibold hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all"
        >
          <Edit3 size={14} />
          Edit Info
        </button>
      </div> */}

      {/* Bio */}
      <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
        <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          About @{username}
        </h3>
        {bio ? (
          <p className="text-sm text-neutral-700 dark:text-neutral-300 leading-relaxed">{bio}</p>
        ) : (
          <p className="text-sm text-neutral-400 italic">No bio yet — tap Edit to add one.</p>
        )}
      </div>

      {/* Industries */}
      <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
        <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Industries
        </h3>
        {industries.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {industries.map((ind) => (
              <span
                key={ind}
                className="px-2.5 py-1 bg-neutral-50 dark:bg-neutral-700/50 rounded-full text-xs font-medium text-neutral-600 dark:text-neutral-300"
              >
                {getIndustryLabel(ind)}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-neutral-400 italic">No industries added yet.</p>
        )}
      </div>

      {/* Plan info */}
      <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
        <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Creator Plan
        </h3>
        <div className="flex items-center gap-3">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${planConfig.bg} ${planConfig.color}`}
          >
            {planConfig.label}
          </span>
          {creatorProfile?.totalStores !== undefined && (
            <span className="text-sm text-neutral-500">
              {creatorProfile.totalStores} store{creatorProfile.totalStores !== 1 ? 's' : ''}
            </span>
          )}
        </div>
      </div>

      {/* Contact */}
      <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
        <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
          Contact Info
        </h3>
        <div className="space-y-2.5">
          {phone && (
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-neutral-400" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{phone}</span>
            </div>
          )}
          {whatsapp && (
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-neutral-400" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">
                WhatsApp: {whatsapp}
              </span>
            </div>
          )}
          {email && (
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-neutral-400" />
              <span className="text-sm text-neutral-700 dark:text-neutral-300">{email}</span>
            </div>
          )}
          {website && (
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-neutral-400" />
              <a
                href={website.startsWith('http') ? website : `https://${website}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue hover:underline flex items-center gap-1"
              >
                {website.replace(/^https?:\/\//, '')}
                <ExternalLink size={12} />
              </a>
            </div>
          )}
          {!phone && !whatsapp && !email && !website && (
            <p className="text-sm text-neutral-400 italic">
              No contact info added yet — tap Edit to add.
            </p>
          )}
        </div>
      </div>

      {/* Social Links */}
      {(socialLinks?.instagram || socialLinks?.twitter || socialLinks?.tiktok) && (
        <div className="bg-white dark:bg-neutral-800/60 rounded-xl p-5 border border-neutral-100 dark:border-neutral-700/50">
          <h3 className="text-sm font-semibold text-neutral-500 dark:text-neutral-400 uppercase tracking-wider mb-3">
            Social Links
          </h3>
          <div className="flex flex-wrap gap-3">
            {socialLinks?.instagram && (
              <a
                href={`https://instagram.com/${socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-sm font-medium text-purple-700 dark:text-purple-300 hover:shadow-sm transition-all"
              >
                <i className="ri-instagram-line text-base" />@{socialLinks.instagram}
              </a>
            )}
            {socialLinks?.twitter && (
              <a
                href={`https://x.com/${socialLinks.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:shadow-sm transition-all"
              >
                <i className="ri-twitter-x-line text-base" />@{socialLinks.twitter}
              </a>
            )}
            {socialLinks?.tiktok && (
              <a
                href={`https://tiktok.com/@${socialLinks.tiktok}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-neutral-50 dark:bg-neutral-700/50 rounded-lg text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:shadow-sm transition-all"
              >
                <i className="ri-tiktok-line text-base" />@{socialLinks.tiktok}
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileAboutTab;
