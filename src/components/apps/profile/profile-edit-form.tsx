'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Input, message as antMessage } from 'antd';
import { Save, Plus, Check, Camera } from 'lucide-react';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { CreatorProfileData, INDUSTRY_LABELS } from './profile-helpers';

const { TextArea } = Input;

// ═══════════════════════════════════════════════════════════════════════════
// SEARCHABLE SELECT (reused pattern from creator setup)
// ═══════════════════════════════════════════════════════════════════════════

interface SearchableSelectProps {
  options: { label: string; value: string }[];
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  loading?: boolean;
  disabled?: boolean;
}

const SearchableSelect: React.FC<SearchableSelectProps> = ({
  options,
  value,
  onChange,
  placeholder,
  loading,
  disabled,
}) => {
  const [search, setSearch] = useState('');
  const [open, setOpen] = useState(false);

  const filtered = options.filter((o) => o.label.toLowerCase().includes(search.toLowerCase()));

  const selectedLabel = options.find((o) => o.value === value)?.label || '';

  return (
    <div className="relative">
      <input
        type="text"
        value={open ? search : selectedLabel}
        onChange={(e) => {
          setSearch(e.target.value);
          if (!open) setOpen(true);
        }}
        onFocus={() => {
          setOpen(true);
          setSearch('');
        }}
        onBlur={() => setTimeout(() => setOpen(false), 200)}
        placeholder={loading ? 'Loading...' : placeholder}
        disabled={disabled || loading}
        className="w-full px-3 py-2.5 text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-neutral-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue/30 focus:border-blue transition-all"
      />
      {open && filtered.length > 0 && (
        <div className="absolute z-50 mt-1 w-full max-h-48 overflow-y-auto bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-lg">
          {filtered.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
                setSearch('');
              }}
              className={`w-full text-left px-3 py-2 text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700 transition-colors ${
                opt.value === value
                  ? 'bg-blue-50 dark:bg-blue-900/20 text-blue dark:text-blue font-medium'
                  : 'text-neutral-700 dark:text-neutral-300'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface CreatorEditSavePayload {
  bio: string;
  contactEmail: string;
  phoneNumber: string;
  whatsappNumber: string;
  website: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    tiktok: string;
  };
  location: {
    country: string;
    state: string;
    city: string;
  };
  industries: string[];
  profileImageFile?: File; // Raw file — parent uploads then includes URL in PATCH
}

interface ProfileEditFormProps {
  creatorProfile?: CreatorProfileData;
  userEmail: string;
  onSave: (data: CreatorEditSavePayload) => void;
  onCancel: () => void;
  isSaving?: boolean;
  // Location
  states?: { name: string; iso2?: string }[];
  cities?: { name: string }[];
  loadingStates?: boolean;
  loadingCities?: boolean;
  onStateChange?: (stateName: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({
  creatorProfile,
  userEmail,
  onSave,
  onCancel,
  isSaving,
  states = [],
  cities = [],
  loadingStates,
  loadingCities,
  onStateChange,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState({
    bio: creatorProfile?.bio || '',
    contactEmail: creatorProfile?.contactEmail || userEmail || '',
    phoneNumber: creatorProfile?.phoneNumber || '',
    whatsappNumber: creatorProfile?.whatsappNumber || '',
    website: creatorProfile?.website || '',
    instagram: creatorProfile?.socialLinks?.instagram || '',
    twitter: creatorProfile?.socialLinks?.twitter || '',
    tiktok: creatorProfile?.socialLinks?.tiktok || '',
    state: creatorProfile?.location?.state || '',
    city: creatorProfile?.location?.city || '',
    industries: creatorProfile?.industries || [],
  });

  // Image state
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Sync form when creatorProfile changes
  useEffect(() => {
    if (creatorProfile) {
      setForm({
        bio: creatorProfile.bio || '',
        contactEmail: creatorProfile.contactEmail || userEmail || '',
        phoneNumber: creatorProfile.phoneNumber || '',
        whatsappNumber: creatorProfile.whatsappNumber || '',
        website: creatorProfile.website || '',
        instagram: creatorProfile.socialLinks?.instagram || '',
        twitter: creatorProfile.socialLinks?.twitter || '',
        tiktok: creatorProfile.socialLinks?.tiktok || '',
        state: creatorProfile.location?.state || '',
        city: creatorProfile.location?.city || '',
        industries: creatorProfile.industries || [],
      });
    }
  }, [creatorProfile, userEmail]);

  const updateField = (key: string, value: any) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleStateSelect = (stateName: string) => {
    updateField('state', stateName);
    updateField('city', '');
    onStateChange?.(stateName);
  };

  const toggleIndustry = (id: string) => {
    setForm((prev) => {
      const current = prev.industries;
      if (current.includes(id)) {
        return { ...prev, industries: current.filter((i) => i !== id) };
      }
      if (current.length >= 5) {
        antMessage.warning('Maximum 5 industries allowed');
        return prev;
      }
      return { ...prev, industries: [...current, id] };
    });
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      antMessage.error('Please select an image file');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      antMessage.error('Image must be less than 5MB');
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleSubmit = () => {
    const payload: CreatorEditSavePayload = {
      bio: form.bio,
      contactEmail: form.contactEmail,
      phoneNumber: form.phoneNumber,
      whatsappNumber: form.whatsappNumber,
      website: form.website,
      socialLinks: {
        instagram: form.instagram,
        twitter: form.twitter,
        tiktok: form.tiktok,
      },
      location: {
        country: 'Nigeria',
        state: form.state,
        city: form.city,
      },
      industries: form.industries,
    };

    if (selectedFile) {
      payload.profileImageFile = selectedFile;
    }

    onSave(payload);
  };

  const stateOptions = states.map((s) => ({ label: s.name, value: s.name }));
  const cityOptions = cities.map((c) => ({ label: c.name, value: c.name }));

  const allIndustries = Object.entries(INDUSTRY_LABELS).map(([id, label]) => ({
    id,
    label,
  }));

  // Display image: local preview > existing profile image > fallback
  const existingImage =
    (creatorProfile as any)?.profileImageUrl ||
    (creatorProfile as any)?.logo ||
    (creatorProfile as any)?.avatar ||
    null;
  const displayImage = imagePreview || existingImage;
  const nameForAvatar =
    (creatorProfile as any)?.firstName || (creatorProfile as any)?.username || 'C';

  return (
    <div className="p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Edit Profile</h2>
        <div className="flex items-center gap-2">
          <button
            onClick={onCancel}
            className="px-3 py-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isSaving}
            className="flex items-center gap-1.5 px-4 py-2 bg-blue text-white rounded-xl text-sm font-semibold hover:bg-blue disabled:opacity-50 transition-all"
          >
            <Save size={14} />
            {isSaving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* ── Profile Image ──────────────────────────────────────────────── */}
      <div className="flex flex-col items-center gap-1">
        <div className="relative">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
          />
          {displayImage ? (
            <img
              src={displayImage}
              alt="Profile"
              className="w-20 h-20 rounded-full object-cover border-4 border-neutral-100 dark:border-neutral-700"
            />
          ) : (
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center text-white text-xl font-bold border-4 border-neutral-100 dark:border-neutral-700"
              style={{ backgroundColor: getRandomColorByString(nameForAvatar) }}
            >
              {getFirstCharacter(nameForAvatar)}
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute bottom-0 right-0 w-7 h-7 bg-blue rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-neutral-900 hover:scale-110 transition-transform"
          >
            <Camera size={12} className="text-white" />
          </button>
        </div>
        <p className="text-[11px] text-neutral-400">Tap to change photo</p>
        {selectedFile && (
          <span className="text-[11px] text-blue font-medium">New image selected</span>
        )}
      </div>

      {/* Bio */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
          Bio
        </label>
        <TextArea
          value={form.bio}
          onChange={(e) => updateField('bio', e.target.value)}
          maxLength={300}
          rows={3}
          placeholder="Tell people about yourself..."
          className="!rounded-xl !text-sm !border-neutral-200 dark:!border-neutral-700 dark:!bg-neutral-800 dark:!text-white"
        />
        <p className="text-[11px] text-neutral-400 mt-1 text-right">{form.bio.length}/300</p>
      </div>

      {/* Industries */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
          Industries ({form.industries.length}/5)
        </label>
        <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto">
          {allIndustries.map(({ id, label }) => {
            const selected = form.industries.includes(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => toggleIndustry(id)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                  selected
                    ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue text-blue dark:text-indigo-300'
                    : 'bg-neutral-50 dark:bg-neutral-800 border-neutral-100 dark:border-neutral-700 text-neutral-500 dark:text-neutral-400 hover:border-neutral-200 dark:hover:border-neutral-600'
                }`}
              >
                {selected ? <Check size={12} /> : <Plus size={12} />}
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Location */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
          Location
        </label>
        <div className="grid grid-cols-2 gap-3">
          <SearchableSelect
            options={stateOptions}
            value={form.state}
            onChange={handleStateSelect}
            placeholder="Select State"
            loading={loadingStates}
          />
          <SearchableSelect
            options={cityOptions}
            value={form.city}
            onChange={(val) => updateField('city', val)}
            placeholder="Select City"
            loading={loadingCities}
            disabled={!form.state}
          />
        </div>
      </div>

      {/* Contact */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
          Contact Information
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Email</label>
            <Input
              value={form.contactEmail}
              onChange={(e) => updateField('contactEmail', e.target.value)}
              placeholder="contact@example.com"
              className="!rounded-xl !text-sm !border-neutral-200 dark:!border-neutral-700 dark:!bg-neutral-800 dark:!text-white"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-neutral-400 mb-1">Phone</label>
              <Input
                value={form.phoneNumber}
                onChange={(e) => updateField('phoneNumber', e.target.value)}
                placeholder="08000000000"
                className="!rounded-xl !text-sm !border-neutral-200 dark:!border-neutral-700 dark:!bg-neutral-800 dark:!text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-neutral-400 mb-1">WhatsApp</label>
              <Input
                value={form.whatsappNumber}
                onChange={(e) => updateField('whatsappNumber', e.target.value)}
                placeholder="08000000000"
                className="!rounded-xl !text-sm !border-neutral-200 dark:!border-neutral-700 dark:!bg-neutral-800 dark:!text-white"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">Website</label>
            <Input
              value={form.website}
              onChange={(e) => updateField('website', e.target.value)}
              placeholder="https://yoursite.com"
              className="!rounded-xl !text-sm !border-neutral-200 dark:!border-neutral-700 dark:!bg-neutral-800 dark:!text-white"
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div>
        <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5">
          Social Links
        </label>
        <div className="space-y-3">
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              <i className="ri-instagram-line mr-1" />
              Instagram
            </label>
            <Input
              value={form.instagram}
              onChange={(e) => updateField('instagram', e.target.value)}
              placeholder="username"
              prefix={<span className="text-neutral-400 text-xs">@</span>}
              className="!rounded-xl !text-sm !border-neutral-200 dark:!border-neutral-700 dark:!bg-neutral-800 dark:!text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              <i className="ri-twitter-x-line mr-1" />
              Twitter / X
            </label>
            <Input
              value={form.twitter}
              onChange={(e) => updateField('twitter', e.target.value)}
              placeholder="username"
              prefix={<span className="text-neutral-400 text-xs">@</span>}
              className="!rounded-xl !text-sm !border-neutral-200 dark:!border-neutral-700 dark:!bg-neutral-800 dark:!text-white"
            />
          </div>
          <div>
            <label className="block text-xs text-neutral-400 mb-1">
              <i className="ri-tiktok-line mr-1" />
              TikTok
            </label>
            <Input
              value={form.tiktok}
              onChange={(e) => updateField('tiktok', e.target.value)}
              placeholder="username"
              prefix={<span className="text-neutral-400 text-xs">@</span>}
              className="!rounded-xl !text-sm !border-neutral-200 dark:!border-neutral-700 dark:!bg-neutral-800 dark:!text-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileEditForm;
