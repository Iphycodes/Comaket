'use client';

import React, { useState, useMemo } from 'react';
import { Input, message as antMessage } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  ChevronDown,
  CircleGauge,
  Loader2,
  MapPin,
  PartyPopper,
  Plus,
  Rocket,
  Search,
  ShoppingBag,
  Sparkles,
  Store,
  Tag,
  User,
  MapPinHouse,
  X,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { CREATOR_INDUSTRIES, getKeywordsForIndustries } from '@grc/_shared/constant';
import Confetti from 'react-confetti';
import { useWindowSize } from 'react-use';
import PhoneInput from '@grc/_shared/components/phone-input';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CreatorStoreSetupData {
  storeName: string;
  tagline: string;
  bio: string;
  phoneNumber: string; // stored as "+2349076141362"
  whatsappNumber: string; // stored as "+2349076141362"
  address: string;
  state: string;
  city: string;
  profileImage: string | null;
  profileImageFile: File | null;
  selectedIndustries: string[]; // IDs e.g. ["fashion", "jewelry"]
  tags: string[];
}

export interface LocationOption {
  name: string;
  iso2?: string;
}

interface CreatorStoreSetupProps {
  initialData: CreatorStoreSetupData;
  currentStep: number;
  isSubmitting: boolean;
  states: LocationOption[];
  cities: LocationOption[];
  loadingStates: boolean;
  loadingCities: boolean;
  creatorIndustries?: string[];
  isLoadingCreatorProfile?: boolean;
  onStepChange: (step: number) => void;
  onDataChange: (data: Partial<CreatorStoreSetupData>) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  onSubmit: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// SEARCHABLE SELECT
// ═══════════════════════════════════════════════════════════════════════════

const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  loading,
  icon: Icon,
  disabled,
}: {
  options: LocationOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  loading?: boolean;
  icon?: React.ElementType;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-left text-sm flex items-center transition-all focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {Icon && (
          <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        )}
        <span className={value ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-neutral-100 dark:border-neutral-700">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-neutral-100 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-blue"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Loading...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-sm text-neutral-400">No results found</div>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => {
                      onChange(opt.name);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      value === opt.name
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue font-medium'
                        : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {opt.name}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP INDICATOR — 3 active steps
// ═══════════════════════════════════════════════════════════════════════════

const steps = [
  { key: 1, label: 'Your Store', icon: <Store size={16} /> },
  { key: 2, label: 'Industry', icon: <Sparkles size={16} /> },
  { key: 3, label: 'Tags', icon: <Tag size={16} /> },
];

const StepIndicator: React.FC<{ current: number; isMobile: boolean }> = ({ current, isMobile }) => (
  <div className="flex items-center justify-center gap-1">
    {steps.map((step, i) => (
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
        {i < steps.length - 1 && (
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
// STEP 1: STORE BIO — with PhoneInput
// ═══════════════════════════════════════════════════════════════════════════

interface Step1Props {
  data: CreatorStoreSetupData;
  states: LocationOption[];
  cities: LocationOption[];
  loadingStates: boolean;
  loadingCities: boolean;
  onChange: (data: Partial<CreatorStoreSetupData>) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
  onNext: () => void;
  isMobile: boolean;
}

const Step1StoreBio: React.FC<Step1Props> = ({
  data,
  states,
  cities,
  loadingStates,
  loadingCities,
  onChange,
  onStateChange,
  onCityChange,
  onNext,
  isMobile,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () =>
      onChange({ profileImage: reader.result as string, profileImageFile: file });
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const canProceed = data.storeName.trim().length >= 2;

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -30 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue to-indigo-500 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-blue/20">
          <Store size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Set Up Your Store</h2>
        <p className="text-sm text-neutral-500 mt-1">Tell buyers who you are and what you create</p>
      </div>

      <div className="max-w-2xl flex mx-auto justify-center">
        <div className="w-full space-y-6">
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
                  alt="Store"
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

          {/* Store Name */}
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Store Name <span className="text-red-400">*</span>
            </label>
            <Input
              value={data.storeName}
              onChange={(e) => onChange({ storeName: e.target.value })}
              placeholder="e.g. EmTech Store, Ada's Creations"
              maxLength={40}
              showCount
              className="!rounded-xl h-12 !text-base"
              prefix={<Store size={16} className="text-neutral-400 mr-1" />}
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Tagline
            </label>
            <Input
              value={data.tagline}
              onChange={(e) => onChange({ tagline: e.target.value })}
              placeholder="A short line about your store"
              maxLength={80}
              showCount
              className="!rounded-xl h-12"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              About Your Store
            </label>
            <Input.TextArea
              value={data.bio}
              onChange={(e) => onChange({ bio: e.target.value })}
              placeholder="Tell buyers what makes your products special..."
              rows={3}
              maxLength={300}
              showCount
              className="!rounded-xl resize-none"
            />
          </div>

          {/* Phone & WhatsApp — PhoneInput */}
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Contact Numbers
            </label>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
              <div>
                <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                  Phone Number
                </label>
                <PhoneInput
                  value={data.phoneNumber}
                  onChange={(val) => onChange({ phoneNumber: val })}
                  placeholder="9076141362"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                  WhatsApp Number
                </label>
                <PhoneInput
                  value={data.whatsappNumber}
                  onChange={(val) => onChange({ whatsappNumber: val })}
                  placeholder="9076141362"
                />
              </div>
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Store Location
            </label>
            <div className={`grid ${isMobile ? 'grid-cols-1 gap-4' : 'grid-cols-2 gap-4'}`}>
              <div>
                <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                  State
                </label>
                <SearchableSelect
                  options={states}
                  value={data.state}
                  onChange={onStateChange}
                  placeholder="Select your state"
                  searchPlaceholder="Search states..."
                  loading={loadingStates}
                  icon={MapPin}
                />
              </div>
              <div>
                <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                  City
                </label>
                {cities.length > 0 ? (
                  <SearchableSelect
                    options={cities}
                    value={data.city}
                    onChange={onCityChange}
                    placeholder={data.state ? 'Select your city' : 'Select a state first'}
                    searchPlaceholder="Search cities..."
                    loading={loadingCities}
                    icon={MapPin}
                    disabled={!data.state}
                  />
                ) : (
                  <div className="relative">
                    <MapPin
                      size={14}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none"
                    />
                    <Input
                      value={data.city}
                      onChange={(e) => onChange({ city: e.target.value })}
                      placeholder={
                        loadingCities
                          ? 'Loading cities...'
                          : data.state
                            ? 'Type your city'
                            : 'Select a state first'
                      }
                      disabled={!data.state}
                      className="!rounded-xl h-[42px] !pl-10"
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="mt-4">
              <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1 block">
                Address <span className="text-neutral-300 dark:text-neutral-600">(optional)</span>
              </label>
              <Input
                value={data.address}
                onChange={(e) => onChange({ address: e.target.value })}
                placeholder="e.g. 12 Market Road, Wuse Zone 5"
                maxLength={200}
                className="!rounded-xl h-[42px]"
                prefix={<MapPinHouse size={14} className="text-neutral-400" />}
              />
            </div>
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
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 2: INDUSTRY SELECTION
// ═══════════════════════════════════════════════════════════════════════════

const MAX_INDUSTRIES = 5;

const Step2Industry: React.FC<{
  data: CreatorStoreSetupData;
  onChange: (d: Partial<CreatorStoreSetupData>) => void;
  onNext: () => void;
  onBack: () => void;
  isMobile: boolean;
  creatorIndustries?: string[];
  isLoadingCreatorProfile?: boolean;
}> = ({
  data,
  onChange,
  onNext,
  onBack,
  isMobile,
  creatorIndustries,
  isLoadingCreatorProfile: _isLoadingCreatorProfile,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  // Filter industries to only show the creator's own industries (if available)
  const availableIndustries = useMemo(() => {
    if (creatorIndustries && creatorIndustries.length > 0) {
      return CREATOR_INDUSTRIES.filter((ind) => creatorIndustries.includes(ind.id));
    }
    // Fallback: show all industries if creator profile has no industries set
    return CREATOR_INDUSTRIES;
  }, [creatorIndustries]);

  const filteredIndustries = useMemo(() => {
    if (!searchQuery.trim()) return availableIndustries;
    const q = searchQuery.toLowerCase();
    return availableIndustries.filter(
      (ind) => ind.label.toLowerCase().includes(q) || ind.description.toLowerCase().includes(q)
    );
  }, [searchQuery, availableIndustries]);

  const toggleIndustry = (id: string) => {
    const current = data.selectedIndustries;
    if (current.includes(id)) {
      const remaining = current.filter((i) => i !== id);
      const remainingKw = new Set(getKeywordsForIndustries(remaining));
      const cleanedTags = data.tags.filter(
        (t) => remainingKw.has(t) || !getKeywordsForIndustries([id]).includes(t)
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
          <Sparkles size={24} className="text-white" />
        </div>
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">What Do You Create?</h2>
        <p className="text-sm text-neutral-500 mt-1">
          Select up to {MAX_INDUSTRIES} industries that describe your work
        </p>
        {creatorIndustries && creatorIndustries.length > 0 && (
          <p className="text-xs text-amber-600 dark:text-amber-400 mt-2 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-lg inline-block">
            Industries are based on your creator profile. Update your creator profile to add more
            industries.
          </p>
        )}
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-neutral-500">
          {data.selectedIndustries.length} of {MAX_INDUSTRIES} selected
        </span>
        {data.selectedIndustries.length > 0 && (
          <button
            onClick={() => onChange({ selectedIndustries: [], tags: [] })}
            className="text-xs text-red-400 hover:text-red-500 font-medium"
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
          <ArrowLeft size={16} /> Back
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
          Continue <ArrowRight size={16} />
        </button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 3: TAGS — NEW STEP
// ═══════════════════════════════════════════════════════════════════════════

const MAX_TAGS = 15;

const Step3Tags: React.FC<{
  data: CreatorStoreSetupData;
  onChange: (d: Partial<CreatorStoreSetupData>) => void;
  onSubmit?: () => void;
  isSubmitting?: boolean;
  onBack: () => void;
  isMobile: boolean;
}> = ({ data, onChange, onSubmit, isSubmitting = false, onBack }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customTag, setCustomTag] = useState('');

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
    if (current.includes(tag)) onChange({ tags: current.filter((t) => t !== tag) });
    else if (current.length < MAX_TAGS) onChange({ tags: [...current, tag] });
    else antMessage.warning(`You can select up to ${MAX_TAGS} tags`);
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
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Add Store Tags</h2>
        <p className="text-sm text-neutral-500 mt-1 max-w-sm mx-auto">
          Tags help buyers discover your store when they search on Comaket. Pick keywords that match
          what you sell.
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
          onClick={onSubmit}
          disabled={!canProceed || isSubmitting}
          className={`flex-1 py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
            canProceed && !isSubmitting
              ? 'bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg'
              : 'bg-neutral-200 dark:bg-neutral-700 text-neutral-400 cursor-not-allowed'
          }`}
        >
          {isSubmitting ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Setting up...
            </>
          ) : (
            <>
              <Rocket size={16} /> Launch My Store
            </>
          )}
        </button>
      </div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// STEP 4: SUCCESS
// ═══════════════════════════════════════════════════════════════════════════

const Step4Success: React.FC<{ data: CreatorStoreSetupData; isMobile: boolean }> = ({ data }) => {
  const industries = CREATOR_INDUSTRIES.filter((ind) => data.selectedIndustries.includes(ind.id));
  const { width, height } = useWindowSize();

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="text-center space-y-6"
    >
      <div className="fixed inset-0 pointer-events-none z-50">
        <Confetti
          width={width}
          height={height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.9}
          tweenDuration={3000}
        />
      </div>
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
          You&apos;re All Set! 🎉
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-sm text-neutral-500 mt-2"
        >
          <strong>{data.storeName}</strong> is live on Comaket
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
              <Store size={20} className="text-white" />
            </div>
          )}
          <div>
            <p className="text-sm font-bold text-neutral-900 dark:text-white">{data.storeName}</p>
            {data.tagline && <p className="text-xs text-neutral-400 italic">{data.tagline}</p>}
          </div>
        </div>
        {(data.state || data.address) && (
          <div className="flex items-center gap-1.5 text-xs text-neutral-500">
            <MapPin size={12} className="text-neutral-400" />
            {data.address && <span>{data.address}, </span>}
            {data.city && `${data.city}, `}
            {data.state}
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
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="space-y-3"
      >
        <a
          href="/sell-item"
          className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all"
        >
          <ShoppingBag size={16} /> Sell Your First Item
        </a>
        <a
          href="/my-store/dashboard"
          className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-all"
        >
          <CircleGauge size={16} /> Go to Dashboard
        </a>
      </motion.div>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT — 4 steps (3 active + success)
// ═══════════════════════════════════════════════════════════════════════════

const CreatorStoreSetup: React.FC<CreatorStoreSetupProps> = (props) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const {
    initialData,
    currentStep,
    isSubmitting,
    states,
    cities,
    loadingStates,
    loadingCities,
    creatorIndustries,
    isLoadingCreatorProfile,
    onStepChange,
    onDataChange,
    onStateChange,
    onCityChange,
    onSubmit,
  } = props;

  return (
    <div className={`min-h-screen dark:bg-neutral-900 ${isMobile ? 'pt-10' : ''}`}>
      <div className={`w-full ${isMobile ? 'px-4 py-6' : 'max-w-4xl mx-auto px-4 py-10'}`}>
        {currentStep <= 3 && (
          <div className="mb-8">
            <StepIndicator current={currentStep} isMobile={isMobile} />
          </div>
        )}
        <div
          className={`bg-white dark:bg-neutral-800/60 rounded-2xl dark:border-neutral-700/50 ${
            isMobile ? 'p-5' : 'p-8'
          } shadow-sm`}
        >
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <Step1StoreBio
                key="s1"
                data={initialData}
                states={states}
                cities={cities}
                loadingStates={loadingStates}
                loadingCities={loadingCities}
                onChange={onDataChange}
                onStateChange={onStateChange}
                onCityChange={onCityChange}
                onNext={() => onStepChange(2)}
                isMobile={isMobile}
              />
            )}
            {currentStep === 2 && (
              <Step2Industry
                key="s2"
                data={initialData}
                onChange={onDataChange}
                onNext={() => onStepChange(3)}
                onBack={() => onStepChange(1)}
                isMobile={isMobile}
                creatorIndustries={creatorIndustries}
                isLoadingCreatorProfile={isLoadingCreatorProfile}
              />
            )}
            {currentStep === 3 && (
              <Step3Tags
                key="s3"
                data={initialData}
                onChange={onDataChange}
                onSubmit={onSubmit}
                isSubmitting={isSubmitting}
                onBack={() => onStepChange(2)}
                isMobile={isMobile}
              />
            )}
            {currentStep === 4 && <Step4Success key="s4" data={initialData} isMobile={isMobile} />}
          </AnimatePresence>
        </div>
        {currentStep <= 3 && (
          <p className="text-center text-[11px] text-neutral-400 mt-6">
            You can always change these settings later in your store profile
          </p>
        )}
      </div>
    </div>
  );
};

export default CreatorStoreSetup;
