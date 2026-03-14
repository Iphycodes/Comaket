'use client';

import React, { useState, useMemo } from 'react';
import { Input, message as antMessage } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AlertTriangle,
  ArrowLeft,
  ArrowRight,
  AtSign,
  Camera,
  Check,
  CheckCircle,
  CreditCard,
  Crown,
  Globe,
  Loader2,
  Mail,
  MapPin,
  Building2,
  Minus,
  PartyPopper,
  Plus,
  Rocket,
  Search,
  ShoppingBag,
  Sparkles,
  Tag,
  User,
  UserCheck,
  Palette,
  X,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import {
  CREATOR_INDUSTRIES,
  CREATOR_PLANS,
  CreatorPlan,
  getKeywordsForIndustries,
} from '@grc/_shared/constant';
import { SearchableSelect } from '@grc/_shared/components/searchable-select';
import PhoneInput from '@grc/_shared/components/phone-input';
import { useGetPlatformSettingsQuery } from '@grc/services/payments';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CreatorAccountData {
  // Step 1: Profile
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  contactEmail: string;
  phoneNumber: string; // stored as "+2349076141362"
  whatsappNumber: string; // stored as "+2349076141362"
  website: string;
  instagramHandle: string;
  twitterHandle: string;
  tiktokHandle: string;
  profileImage: string | null;
  state: string;
  city: string;
  // Step 2: Industries (stored as IDs e.g. ["fashion", "jewelry"])
  selectedIndustries: string[];
  // Step 3: Tags
  tags: string[];
  // Step 4: Plan
  selectedPlan: string;
}

export interface MemberPrefillData {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profileImageUrl: string | null;
  bio?: string;
  state?: string;
  city?: string;
}

export interface LocationOption {
  name: string;
  iso2?: string;
}

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

interface CreatorAccountSetupProps {
  data: CreatorAccountData;
  currentStep: number;
  isSubmitting: boolean;
  usernameStatus: UsernameStatus;
  onStepChange: (step: number) => void;
  onDataChange: (data: Partial<CreatorAccountData>) => void;
  onCheckUsername: (username: string) => void;
  onSubmit: () => void;
  states?: LocationOption[];
  cities?: LocationOption[];
  loadingStates?: boolean;
  loadingCities?: boolean;
  onStateChange?: (state: string) => void;
  /** Error from failed subscription payment return */
  subscriptionError?: string | null;
}

// ═══════════════════════════════════════════════════════════════════════════
// STEP INDICATOR — 4 steps (Profile → Industry → Tags → Plan)
// ═══════════════════════════════════════════════════════════════════════════

const stepsConfig = [
  { key: 1, label: 'Profile', icon: <User size={16} /> },
  { key: 2, label: 'Industry', icon: <Palette size={16} /> },
  { key: 3, label: 'Tags', icon: <Tag size={16} /> },
  { key: 4, label: 'Plan', icon: <Crown size={16} /> },
];

const StepIndicator: React.FC<{ current: number; isMobile: boolean }> = ({ current, isMobile }) => (
  <div className="flex items-center justify-center gap-1">
    {stepsConfig.map((step, i) => (
      <React.Fragment key={step.key}>
        <div className="flex items-center gap-1.5">
          <div
            className={`flex items-center justify-center rounded-full transition-all duration-300 ${
              current > step.key
                ? 'w-8 h-8 bg-emerald-500 text-white'
                : current === step.key
                  ? 'w-8 h-8 bg-gradient-to-r from-blue to-indigo-500 text-white shadow-md shadow-blue/20'
                  : 'w-8 h-8 bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
            }`}
          >
            {current > step.key ? <Check size={14} /> : step.icon}
          </div>
          {!isMobile && (
            <span
              className={`text-xs font-semibold transition-colors ${
                current >= step.key ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'
              }`}
            >
              {step.label}
            </span>
          )}
        </div>
        {i < stepsConfig.length - 1 && (
          <div
            className={`h-[2px] transition-all duration-500 ${isMobile ? 'w-6' : 'w-10'} ${
              current > step.key ? 'bg-emerald-500' : 'bg-neutral-200 dark:bg-neutral-700'
            }`}
          />
        )}
      </React.Fragment>
    ))}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// USERNAME INPUT
// ═══════════════════════════════════════════════════════════════════════════

const UsernameInput: React.FC<{
  value: string;
  status: UsernameStatus;
  onChange: (val: string) => void;
  onCheck: (val: string) => void;
}> = ({ value, status, onChange, onCheck }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, '');
    onChange(raw);
    if (raw.length >= 3) onCheck(raw);
  };

  const statusIndicator = () => {
    switch (status) {
      case 'checking':
        return <Loader2 size={16} className="text-blue animate-spin" />;
      case 'available':
        return <CheckCircle size={16} className="text-emerald-500" />;
      case 'taken':
        return <span className="text-[11px] text-red-500 font-medium">Taken</span>;
      case 'invalid':
        return <span className="text-[11px] text-red-500 font-medium">Invalid</span>;
      default:
        return null;
    }
  };

  return (
    <div>
      <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
        Username <span className="text-red-400">*</span>
      </label>
      <div className="relative">
        <Input
          value={value}
          onChange={handleChange}
          placeholder="e.g. emtech, ada.creates"
          maxLength={30}
          className="!rounded-xl h-12 !text-base !pl-9"
        />
        <AtSign
          size={16}
          className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 pointer-events-none"
        />
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">{statusIndicator()}</div>
      </div>
      <p className="text-[11px] text-neutral-400 mt-1.5">
        Letters, numbers, dots and underscores only. Min 3 characters.
      </p>
      {status === 'available' && value.length >= 3 && (
        <p className="text-[11px] text-emerald-500 font-medium mt-0.5">
          comaket.com/@{value} is yours!
        </p>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 1: PROFILE & IDENTITY — with PhoneInput
// ═══════════════════════════════════════════════════════════════════════════

interface Step1Props {
  data: CreatorAccountData;
  usernameStatus: UsernameStatus;
  onChange: (data: Partial<CreatorAccountData>) => void;
  onCheckUsername: (username: string) => void;
  onNext: () => void;
  isMobile: boolean;
  states?: LocationOption[];
  cities?: LocationOption[];
  loadingStates?: boolean;
  loadingCities?: boolean;
  onStateChange?: (state: string) => void;
}

const Step1Profile: React.FC<Step1Props> = ({
  data,
  usernameStatus,
  onChange,
  onCheckUsername,
  onNext,
  isMobile,
  states = [],
  cities = [],
  loadingStates,
  loadingCities,
  onStateChange,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const [showSocials, setShowSocials] = useState(
    !!(data.instagramHandle || data.twitterHandle || data.tiktokHandle || data.website)
  );

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onChange({ profileImage: reader.result as string });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleStateSelect = (stateName: string) => {
    onChange({ state: stateName, city: '' });
    onStateChange?.(stateName);
  };

  const canProceed =
    data.username.length >= 3 &&
    data.firstName.trim().length >= 1 &&
    data.lastName.trim().length >= 1 &&
    (usernameStatus === 'available' || usernameStatus === 'idle');

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue to-indigo-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue/20">
          <UserCheck size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">
          Create Your Creator Profile
        </h2>
        <p className="text-sm text-neutral-500 mt-1">
          This is your personal identity as a creator on Comaket
        </p>
      </div>

      <div className="max-w-2xl mx-auto justify-center space-y-4">
        {/* Profile image */}
        <div className="flex justify-center">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          <button onClick={() => fileInputRef.current?.click()} className="relative group">
            {data.profileImage ? (
              <img
                src={data.profileImage}
                alt="Profile"
                className="w-24 h-24 rounded-full object-cover border-4 border-neutral-100 dark:border-neutral-700"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-neutral-100 dark:bg-neutral-800 border-4 border-neutral-50 dark:border-neutral-700 flex items-center justify-center">
                <User size={32} className="text-neutral-300 dark:text-neutral-600" />
              </div>
            )}
            <div className="absolute bottom-0 right-0 w-8 h-8 bg-blue rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-neutral-900 group-hover:scale-110 transition-transform">
              <Camera size={14} className="text-white" />
            </div>
          </button>
        </div>

        <UsernameInput
          value={data.username}
          status={usernameStatus}
          onChange={(val) => onChange({ username: val })}
          onCheck={onCheckUsername}
        />

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              First Name <span className="text-red-400">*</span>
            </label>
            <Input
              value={data.firstName}
              onChange={(e) => onChange({ firstName: e.target.value })}
              placeholder="First name"
              className="!rounded-xl h-12"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Last Name <span className="text-red-400">*</span>
            </label>
            <Input
              value={data.lastName}
              onChange={(e) => onChange({ lastName: e.target.value })}
              placeholder="Last name"
              className="!rounded-xl h-12"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Bio
          </label>
          <Input.TextArea
            value={data.bio}
            onChange={(e) => onChange({ bio: e.target.value })}
            placeholder="What do you create? Tell the world..."
            rows={3}
            maxLength={250}
            showCount
            className="!rounded-xl resize-none"
          />
        </div>

        {/* Contact */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-5">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Contact</h3>
          <p className="text-[11px] text-neutral-400 mb-4">
            How buyers and collaborators can reach you
          </p>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                Email
              </label>
              <Input
                value={data.contactEmail}
                onChange={(e) => onChange({ contactEmail: e.target.value })}
                placeholder="your@email.com"
                className="!rounded-xl h-11"
                prefix={<Mail size={14} className="text-neutral-400" />}
              />
            </div>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-3'}`}>
              <div>
                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  Phone
                </label>
                <PhoneInput
                  value={data.phoneNumber}
                  onChange={(val) => onChange({ phoneNumber: val })}
                  placeholder="9076141362"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  WhatsApp
                </label>
                <PhoneInput
                  value={data.whatsappNumber}
                  onChange={(val) => onChange({ whatsappNumber: val })}
                  placeholder="9076141362"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Location */}
        <div className="border-t border-neutral-200 dark:border-neutral-700 pt-5">
          <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-1">Location</h3>
          <p className="text-[11px] text-neutral-400 mb-4">Help buyers find creators near them</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                State
              </label>
              <SearchableSelect
                options={states}
                value={data.state}
                onChange={handleStateSelect}
                placeholder="Select state"
                searchPlaceholder="Search states..."
                loading={loadingStates}
                icon={MapPin}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                City
              </label>
              {cities.length > 0 ? (
                <SearchableSelect
                  options={cities}
                  value={data.city}
                  onChange={(v) => onChange({ city: v })}
                  placeholder="Select city"
                  searchPlaceholder="Search cities..."
                  loading={loadingCities}
                  icon={Building2}
                  disabled={!data.state}
                />
              ) : (
                <Input
                  value={data.city}
                  onChange={(e) => onChange({ city: e.target.value })}
                  placeholder={data.state ? 'Enter city' : 'Select a state first'}
                  disabled={!data.state}
                  className="!rounded-xl h-11"
                />
              )}
            </div>
          </div>
        </div>

        {/* Socials */}
        <div>
          <button
            onClick={() => setShowSocials(!showSocials)}
            className="flex items-center gap-2 text-sm font-semibold text-blue hover:text-indigo-600 transition-colors"
          >
            <Globe size={14} />
            {showSocials ? 'Hide' : 'Add'} Website & Socials
            <motion.span
              animate={{ rotate: showSocials ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="text-xs"
            >
              ▼
            </motion.span>
          </button>
          <AnimatePresence>
            {showSocials && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="overflow-hidden"
              >
                <div className="space-y-4 pt-4">
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                      Website
                    </label>
                    <Input
                      value={data.website}
                      onChange={(e) => onChange({ website: e.target.value })}
                      placeholder="https://yoursite.com"
                      className="!rounded-xl h-11"
                      prefix={<Globe size={14} className="text-neutral-400" />}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                      Instagram
                    </label>
                    <Input
                      value={data.instagramHandle}
                      onChange={(e) => onChange({ instagramHandle: e.target.value })}
                      placeholder="username"
                      className="!rounded-xl h-11"
                      prefix={
                        <span className="text-neutral-400 text-sm flex items-center gap-1">
                          <i className="ri-instagram-line" /> @
                        </span>
                      }
                    />
                  </div>
                  <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-3'}`}>
                    <div>
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                        Twitter / X
                      </label>
                      <Input
                        value={data.twitterHandle}
                        onChange={(e) => onChange({ twitterHandle: e.target.value })}
                        placeholder="username"
                        className="!rounded-xl h-11"
                        prefix={
                          <span className="text-neutral-400 text-sm flex items-center gap-1">
                            <i className="ri-twitter-x-line" /> @
                          </span>
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                        TikTok
                      </label>
                      <Input
                        value={data.tiktokHandle}
                        onChange={(e) => onChange({ tiktokHandle: e.target.value })}
                        placeholder="username"
                        className="!rounded-xl h-11"
                        prefix={
                          <span className="text-neutral-400 text-sm flex items-center gap-1">
                            <i className="ri-tiktok-line" /> @
                          </span>
                        }
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            canProceed
              ? 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: INDUSTRY SELECTION — sends IDs (e.g. "fashion", "jewelry")
// ═══════════════════════════════════════════════════════════════════════════

const MAX_INDUSTRIES = 5;

const Step2Industry: React.FC<{
  data: CreatorAccountData;
  onChange: (data: Partial<CreatorAccountData>) => void;
  onNext: () => void;
  onBack: () => void;
  isMobile: boolean;
}> = ({ data, onChange, onNext, onBack, isMobile }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredIndustries = useMemo(() => {
    if (!searchQuery.trim()) return CREATOR_INDUSTRIES;
    const q = searchQuery.toLowerCase();
    return CREATOR_INDUSTRIES.filter(
      (ind) => ind.label.toLowerCase().includes(q) || ind.description.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  const toggleIndustry = (id: string) => {
    const current = data.selectedIndustries;
    if (current.includes(id)) {
      // Also clear tags that belong ONLY to this industry (not shared with remaining ones)
      const remaining = current.filter((i) => i !== id);
      const remainingKeywords = new Set(getKeywordsForIndustries(remaining));
      const cleanedTags = data.tags.filter(
        (t) => remainingKeywords.has(t) || !getKeywordsForIndustries([id]).includes(t)
      );
      onChange({ selectedIndustries: remaining, tags: cleanedTags });
    } else if (current.length < MAX_INDUSTRIES) {
      onChange({ selectedIndustries: [...current, id] });
    } else {
      antMessage.warning(`You can select up to ${MAX_INDUSTRIES} industries`);
    }
  };

  const canProceed = data.selectedIndustries.length >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-orange-500/20">
          <Palette size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">What Do You Create?</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Select up to {MAX_INDUSTRIES} industries that best describe your craft
        </p>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500">
          {data.selectedIndustries.length} of {MAX_INDUSTRIES} selected
        </span>
        {data.selectedIndustries.length > 0 && (
          <button
            onClick={() => onChange({ selectedIndustries: [], tags: [] })}
            className="text-xs text-red-400 hover:text-red-500 font-medium transition-colors"
          >
            Clear all
          </button>
        )}
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        <input
          type="text"
          placeholder="Search industries..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full h-11 pl-10 pr-4 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none transition-all"
        />
      </div>

      <div
        className={`grid ${
          isMobile ? 'grid-cols-1' : 'grid-cols-2'
        } gap-2 max-h-[340px] overflow-y-auto pr-1 pb-1`}
      >
        {filteredIndustries.map((industry) => {
          const isSelected = data.selectedIndustries.includes(industry.id);
          return (
            <motion.button
              key={industry.id}
              whileTap={{ scale: 0.97 }}
              onClick={() => toggleIndustry(industry.id)}
              className={`flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                isSelected
                  ? 'border-blue bg-blue/5 dark:bg-blue/10 shadow-sm'
                  : 'border-neutral-100 dark:border-neutral-700/50 hover:border-neutral-200 dark:hover:border-neutral-600'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected
                    ? `bg-gradient-to-br ${industry.color} text-white shadow-sm`
                    : 'bg-neutral-50 dark:bg-neutral-800 text-neutral-400'
                }`}
              >
                <i className={`${industry.icon} text-lg`} />
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-semibold ${
                    isSelected
                      ? 'text-neutral-900 dark:text-white'
                      : 'text-neutral-700 dark:text-neutral-300'
                  }`}
                >
                  {industry.label}
                </p>
                <p className="text-[11px] text-neutral-400 truncate">{industry.description}</p>
              </div>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  isSelected
                    ? 'bg-blue text-white'
                    : 'border-2 border-neutral-200 dark:border-neutral-600'
                }`}
              >
                {isSelected && <Check size={12} />}
              </div>
            </motion.button>
          );
        })}
        {filteredIndustries.length === 0 && (
          <div className="col-span-2 text-center py-8">
            <p className="text-sm text-neutral-400">
              No industries found for &quot;{searchQuery}&quot;
            </p>
          </div>
        )}
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 px-5 py-3.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            canProceed
              ? 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: TAGS / KEYWORDS — NEW STEP
// ═══════════════════════════════════════════════════════════════════════════

const MAX_TAGS = 15;

const Step3Tags: React.FC<{
  data: CreatorAccountData;
  onChange: (data: Partial<CreatorAccountData>) => void;
  onNext: () => void;
  onBack: () => void;
  isMobile: boolean;
}> = ({ data, onChange, onNext, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customTag, setCustomTag] = useState('');

  // All keywords from selected industries, deduped
  const suggestedTags = useMemo(
    () => getKeywordsForIndustries(data.selectedIndustries),
    [data.selectedIndustries]
  );

  const filteredSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return suggestedTags;
    const q = searchQuery.toLowerCase();
    return suggestedTags.filter((tag) => tag.toLowerCase().includes(q));
  }, [suggestedTags, searchQuery]);

  const toggleTag = (tag: string) => {
    const current = data.tags;
    if (current.includes(tag)) {
      onChange({ tags: current.filter((t) => t !== tag) });
    } else if (current.length < MAX_TAGS) {
      onChange({ tags: [...current, tag] });
    } else {
      antMessage.warning(`You can select up to ${MAX_TAGS} tags`);
    }
  };

  const sanitizeTag = (raw: string): string =>
    raw
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '');

  const addCustomTag = () => {
    const tag = sanitizeTag(customTag);
    if (!tag) return;
    if (data.tags.includes(tag)) {
      antMessage.info('Tag already added');
      setCustomTag('');
      return;
    }
    if (data.tags.length >= MAX_TAGS) {
      antMessage.warning(`You can select up to ${MAX_TAGS} tags`);
      return;
    }
    onChange({ tags: [...data.tags, tag] });
    setCustomTag('');
  };

  const handleCustomKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addCustomTag();
    }
  };

  const canProceed = data.tags.length >= 1;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-5"
    >
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-emerald-500/20">
          <Tag size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Add Your Tags</h2>
        <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
          These keywords help buyers find you when searching on Comaket. The more relevant your
          tags, the easier it is for the right customers to discover your products and stores.
        </p>
      </div>

      {/* Selected tags */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-neutral-500">
            {data.tags.length} of {MAX_TAGS} tags
          </span>
          {data.tags.length > 0 && (
            <button
              onClick={() => onChange({ tags: [] })}
              className="text-xs text-red-400 hover:text-red-500 font-medium transition-colors"
            >
              Clear all
            </button>
          )}
        </div>
        {data.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 p-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl border border-neutral-100 dark:border-neutral-700/50 mb-3">
            <AnimatePresence>
              {data.tags.map((tag) => (
                <motion.span
                  key={tag}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.8, opacity: 0 }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue text-blue dark:text-blue-300 rounded-full text-xs font-medium"
                >
                  {tag}
                  <button
                    onClick={() => toggleTag(tag)}
                    className="hover:text-red-500 transition-colors"
                  >
                    <X size={12} />
                  </button>
                </motion.span>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Custom tag input */}
      <div>
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">
          Add a custom tag
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={customTag}
            onChange={(e) => setCustomTag(e.target.value)}
            onKeyDown={handleCustomKeyDown}
            placeholder="Type a tag and press Enter"
            className="flex-1 h-10 px-3 border border-neutral-200 dark:border-neutral-700 rounded-xl bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
          />
          <button
            onClick={addCustomTag}
            disabled={!customTag.trim() || data.tags.length >= MAX_TAGS}
            className="flex items-center gap-1 px-4 h-10 rounded-xl text-xs font-semibold bg-blue text-white hover:bg-indigo-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <Plus size={14} />
            Add
          </button>
        </div>
      </div>

      {/* Suggested tags */}
      <div>
        <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">
          Suggested from your industries — tap to add
        </label>
        <div className="relative mb-2">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Filter suggestions..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-9 pl-8 pr-3 border border-neutral-200 dark:border-neutral-700 rounded-lg bg-white dark:bg-neutral-800 text-xs text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all"
          />
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-[200px] overflow-y-auto pr-1 pb-1">
          {filteredSuggestions.map((tag) => {
            const isSelected = data.tags.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => toggleTag(tag)}
                className={`px-2.5 py-1 rounded-full text-xs font-medium border transition-all ${
                  isSelected
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue text-blue dark:text-blue-300'
                    : 'bg-white dark:bg-neutral-800 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-blue '
                }`}
              >
                {isSelected ? (
                  <span className="inline-flex items-center gap-1">
                    <Check size={10} />
                    {tag}
                  </span>
                ) : (
                  tag
                )}
              </button>
            );
          })}
          {filteredSuggestions.length === 0 && (
            <p className="text-xs text-neutral-400 py-4 w-full text-center">
              No suggestions match &quot;{searchQuery}&quot;
            </p>
          )}
        </div>
      </div>

      <div className="flex gap-3 pt-2">
        <button
          onClick={onBack}
          className="flex items-center justify-center gap-1.5 px-5 py-3.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors"
        >
          <ArrowLeft size={16} />
          Back
        </button>
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            canProceed
              ? 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
          }`}
        >
          Continue
          <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: PLAN SELECTION
// ═══════════════════════════════════════════════════════════════════════════

const Step4Plan: React.FC<{
  data: CreatorAccountData;
  onChange: (data: Partial<CreatorAccountData>) => void;
  onSubmit: () => void;
  onBack: () => void;
  isSubmitting: boolean;
  isMobile: boolean;
  subscriptionError?: string | null;
  plans: CreatorPlan[];
}> = ({ data, onChange, onSubmit, onBack, isSubmitting, isMobile, subscriptionError, plans }) => (
  <motion.div
    initial={{ opacity: 0, x: 30 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0, x: -30 }}
    transition={{ duration: 0.3 }}
    className="space-y-5"
  >
    <div className="text-center">
      <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-purple-500/20">
        <Crown size={24} className="text-white" />
      </div>
      <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Choose Your Plan</h2>
      <p className="text-sm text-neutral-500 mt-1">Start free, upgrade when you&apos;re ready</p>
    </div>

    {/* Subscription error banner */}
    {subscriptionError && (
      <div className="flex items-start gap-2.5 p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800/30 rounded-xl">
        <AlertTriangle size={16} className="text-red-500 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-sm font-semibold text-red-700 dark:text-red-400">Payment Issue</p>
          <p className="text-xs text-red-600 dark:text-red-400/80 mt-0.5 leading-relaxed">
            {subscriptionError}
          </p>
        </div>
      </div>
    )}
    <div
      className={`${isMobile ? 'space-y-3' : 'grid gap-3'}`}
      style={
        !isMobile ? { gridTemplateColumns: `repeat(${plans.length}, minmax(0, 1fr))` } : undefined
      }
    >
      {plans.map((plan) => {
        const isSelected = data.selectedPlan === plan.id;
        return (
          <motion.button
            key={plan.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onChange({ selectedPlan: plan.id })}
            className={`relative w-full text-left rounded-2xl border-2 p-5 transition-all ${
              isSelected
                ? plan.highlighted
                  ? 'border-blue bg-gradient-to-b from-blue/5 to-indigo-500/5 shadow-lg shadow-blue/10'
                  : 'border-blue bg-blue/5 dark:bg-blue/10 shadow-md'
                : 'border-neutral-100 dark:border-neutral-700/50 hover:border-neutral-200 dark:hover:border-neutral-600'
            }`}
          >
            {plan.badge && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <span
                  className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide shadow-sm ${
                    plan.id === 'pro'
                      ? 'bg-gradient-to-r from-blue to-indigo-500 text-white'
                      : 'bg-gradient-to-r from-amber-400 to-orange-500 text-white'
                  }`}
                >
                  {plan.badge}
                </span>
              </div>
            )}
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-base font-bold text-neutral-900 dark:text-white">{plan.name}</h3>
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-blue text-white'
                    : 'border-2 border-neutral-200 dark:border-neutral-600'
                }`}
              >
                {isSelected && <Check size={12} />}
              </div>
            </div>
            <div className="mb-3">
              <span
                className={`text-2xl font-bold ${
                  plan.price === 0
                    ? 'text-emerald-600 dark:text-emerald-400'
                    : 'bg-gradient-to-r from-blue to-indigo-500 bg-clip-text text-transparent'
                }`}
              >
                {plan.priceLabel}
              </span>
            </div>
            <p className="text-xs text-neutral-500 mb-4 leading-relaxed">{plan.description}</p>
            <div className="space-y-2">
              {plan.features.map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={14} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-600 dark:text-neutral-400">{f}</span>
                </div>
              ))}
              {plan.limits.map((l, i) => (
                <div key={`l-${i}`} className="flex items-start gap-2">
                  <Minus size={14} className="text-neutral-300 flex-shrink-0 mt-0.5" />
                  <span className="text-xs text-neutral-400">{l}</span>
                </div>
              ))}
            </div>
          </motion.button>
        );
      })}
    </div>
    <div className="flex gap-3 pt-2">
      <button
        onClick={onBack}
        className="flex items-center justify-center gap-1.5 px-5 py-3.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 transition-colors"
      >
        <ArrowLeft size={16} />
        Back
      </button>
      <button
        onClick={onSubmit}
        disabled={isSubmitting}
        className="flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Setting up...
          </>
        ) : data.selectedPlan !== 'starter' ? (
          <>
            <CreditCard size={16} />
            Pay & Become a Creator
          </>
        ) : (
          <>
            <Rocket size={16} />
            Become a Creator
          </>
        )}
      </button>
    </div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// STEP 5: SUCCESS
// ═══════════════════════════════════════════════════════════════════════════

const Step5Success: React.FC<{
  data: CreatorAccountData;
  isMobile: boolean;
  plans: CreatorPlan[];
}> = ({ data, plans }) => {
  const plan =
    plans.find((p) => p.id === data.selectedPlan) ||
    CREATOR_PLANS.find((p) => p.id === data.selectedPlan);
  const industries = CREATOR_INDUSTRIES.filter((ind) => data.selectedIndustries.includes(ind.id));
  const locationStr = [data.city, data.state].filter(Boolean).join(', ');

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center space-y-6"
    >
      <div className="relative">
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
          className="w-20 h-20 rounded-3xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto shadow-xl shadow-emerald-500/30"
        >
          <PartyPopper size={36} className="text-white" />
        </motion.div>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0.5],
              x: [0, (i % 2 === 0 ? 1 : -1) * (30 + i * 15)],
              y: [0, -(20 + i * 10)],
            }}
            transition={{ delay: 0.4 + i * 0.1, duration: 1.2, ease: 'easeOut' }}
            className={`absolute top-8 left-1/2 w-2 h-2 rounded-full ${
              [
                'bg-blue',
                'bg-amber-400',
                'bg-rose-400',
                'bg-emerald-400',
                'bg-purple-400',
                'bg-orange-400',
              ][i]
            }`}
          />
        ))}
      </div>

      <div>
        <motion.h2
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-2xl font-bold text-neutral-900 dark:text-white"
        >
          Welcome, Creator! 🎉
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-neutral-500 mt-2"
        >
          <strong>@{data.username}</strong> is live on Comaket
        </motion.p>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="bg-neutral-50 dark:bg-neutral-800/50 rounded-2xl p-5 text-left space-y-4"
      >
        <div className="flex items-center gap-3">
          {data.profileImage ? (
            <img
              src={data.profileImage}
              alt=""
              className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-neutral-700"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue to-indigo-500 flex items-center justify-center">
              <User size={20} className="text-white" />
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">
              {data.firstName} {data.lastName}
            </p>
            <p className="text-xs text-neutral-400">@{data.username}</p>
          </div>
        </div>
        {locationStr && (
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <MapPin size={14} className="text-neutral-400" />
            {locationStr}
          </div>
        )}
        <div>
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
            Industries
          </p>
          <div className="flex flex-wrap gap-1.5">
            {industries.map((ind) => (
              <span
                key={ind.id}
                className="inline-flex items-center gap-1 px-2.5 py-1 bg-white dark:bg-neutral-700/50 rounded-lg text-xs font-medium text-neutral-600 dark:text-neutral-300 border border-neutral-100 dark:border-neutral-600"
              >
                <i className={`${ind.icon} text-xs`} />
                {ind.label}
              </span>
            ))}
          </div>
        </div>
        {data.tags.length > 0 && (
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider mb-2">
              Tags
            </p>
            <div className="flex flex-wrap gap-1.5">
              {data.tags.slice(0, 8).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 bg-blue-50 dark:bg-blue-900/20 rounded-full text-[11px] font-medium text-blue dark:text-blue-300"
                >
                  {tag}
                </span>
              ))}
              {data.tags.length > 8 && (
                <span className="text-[11px] text-neutral-400">+{data.tags.length - 8} more</span>
              )}
            </div>
          </div>
        )}
        <div className="flex items-center justify-between py-2 border-t border-neutral-200 dark:border-neutral-700">
          <div>
            <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider">
              Plan
            </p>
            <p className="text-sm font-bold text-neutral-900 dark:text-white mt-0.5">
              {plan?.name} — {plan?.priceLabel}
            </p>
          </div>
          <Crown
            size={20}
            className={`${
              plan?.id === 'business'
                ? 'text-amber-500'
                : plan?.id === 'pro'
                  ? 'text-blue'
                  : 'text-neutral-400'
            }`}
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.55 }}
        className="bg-blue/5 dark:bg-blue/10 rounded-xl p-4 text-left border border-blue/10"
      >
        <p className="text-xs font-semibold text-blue mb-2 flex items-center gap-1.5">
          <Sparkles size={13} />
          What&apos;s next?
        </p>
        <ul className="space-y-1.5">
          {[
            'List your first product for sale',
            'Set up your creator store with custom branding',
            'Showcase your featured works to attract buyers',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle size={13} className="text-blue/60 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-neutral-600 dark:text-neutral-400">{item}</span>
            </li>
          ))}
        </ul>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <a
          href="/creator-store/setup"
          className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all"
        >
          <ShoppingBag size={16} />
          Create Your First Store
        </a>
        <a
          href="/profile"
          className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all"
        >
          <User size={16} />
          Go to My Profile
        </a>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN — 5 steps total (4 active + success)
// ═══════════════════════════════════════════════════════════════════════════

const CreatorAccountSetup: React.FC<CreatorAccountSetupProps> = ({
  data,
  currentStep,
  isSubmitting,
  usernameStatus,
  onStepChange,
  onDataChange,
  onCheckUsername,
  onSubmit,
  states,
  cities,
  loadingStates,
  loadingCities,
  onStateChange,
  subscriptionError,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { data: settingsResponse } = useGetPlatformSettingsQuery();

  const dynamicPlans = useMemo(() => {
    const apiPlans = settingsResponse?.data?.plans;
    if (!apiPlans) return CREATOR_PLANS;

    const apiMap = new Map<string, { priceKobo: number; active: boolean }>();
    for (const p of apiPlans) {
      apiMap.set(p.id, { priceKobo: p.priceKobo, active: p.active });
    }

    return CREATOR_PLANS.filter((plan) => {
      const api = apiMap.get(plan.id);
      return !api || api.active;
    }).map((plan) => {
      const api = apiMap.get(plan.id);
      if (!api) return plan;
      const priceKobo = api.priceKobo;
      const priceLabel =
        priceKobo === 0 ? 'Free' : `₦${(priceKobo / 100).toLocaleString('en-NG')}/mo`;
      return { ...plan, price: priceKobo, priceLabel };
    });
  }, [settingsResponse]);

  return (
    <div className={`min-h-screen dark:bg-neutral-900 ${isMobile ? 'pt-10' : ''}`}>
      <div className={`w-full ${isMobile ? 'px-4 py-6' : 'max-w-4xl mx-auto px-4 py-10'}`}>
        {currentStep <= 4 && (
          <div className="mb-8">
            <StepIndicator current={currentStep} isMobile={isMobile} />
          </div>
        )}

        <div
          className={`bg-white dark:bg-neutral-800/60 rounded-2xl dark:border-neutral-700/50 ${
            isMobile ? 'p-5' : 'p-8'
          }`}
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1Profile
                key="s1"
                data={data}
                usernameStatus={usernameStatus}
                onChange={onDataChange}
                onCheckUsername={onCheckUsername}
                onNext={() => onStepChange(2)}
                isMobile={isMobile}
                states={states}
                cities={cities}
                loadingStates={loadingStates}
                loadingCities={loadingCities}
                onStateChange={onStateChange}
              />
            )}
            {currentStep === 2 && (
              <Step2Industry
                key="s2"
                data={data}
                onChange={onDataChange}
                onNext={() => onStepChange(3)}
                onBack={() => onStepChange(1)}
                isMobile={isMobile}
              />
            )}
            {currentStep === 3 && (
              <Step3Tags
                key="s3"
                data={data}
                onChange={onDataChange}
                onNext={() => onStepChange(4)}
                onBack={() => onStepChange(2)}
                isMobile={isMobile}
              />
            )}
            {currentStep === 4 && (
              <Step4Plan
                key="s4"
                data={data}
                onChange={onDataChange}
                onSubmit={onSubmit}
                onBack={() => onStepChange(3)}
                isSubmitting={isSubmitting}
                isMobile={isMobile}
                subscriptionError={subscriptionError}
                plans={dynamicPlans}
              />
            )}
            {currentStep === 5 && (
              <Step5Success key="s5" data={data} isMobile={isMobile} plans={dynamicPlans} />
            )}
          </AnimatePresence>
        </div>

        {currentStep <= 4 && (
          <p className="text-center text-[11px] text-neutral-400 mt-6">
            You can always update these details later in your profile settings
          </p>
        )}
      </div>
    </div>
  );
};

export default CreatorAccountSetup;
