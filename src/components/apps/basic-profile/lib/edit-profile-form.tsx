import React, { useState, useRef } from 'react';
import { Input, message as antMessage } from 'antd';
import { Mail, Save, Camera, MapPin, Building2 } from 'lucide-react';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { UpdateUserProfilePayload } from '@grc/services/users';
import { LocationOption } from './helpers';
import { SearchableSelect } from '@grc/_shared/components/searchable-select';

export interface EditProfileSavePayload extends UpdateUserProfilePayload {
  avatarFile?: File; // Raw file — parent uploads then includes URL in PATCH
}

interface EditProfileFormProps {
  userProfile: any;
  onSave: (payload: EditProfileSavePayload) => void;
  onCancel: () => void;
  isSaving?: boolean;
  // Location
  states?: LocationOption[];
  cities?: LocationOption[];
  loadingStates?: boolean;
  loadingCities?: boolean;
  onStateChange?: (state: string) => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  userProfile,
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

  const [firstName, setFirstName] = useState(userProfile?.firstName || '');
  const [lastName, setLastName] = useState(userProfile?.lastName || '');
  const [bio, setBio] = useState(userProfile?.bio || '');
  const [gender, setGender] = useState(userProfile?.gender || '');
  const [state, setState] = useState(userProfile?.state || '');
  const [city, setCity] = useState(userProfile?.city || '');

  // Image — store the File + a local preview URL
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleStateSelect = (stateName: string) => {
    setState(stateName);
    setCity('');
    onStateChange?.(stateName);
  };

  const handleCitySelect = (cityName: string) => {
    setCity(cityName);
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

    // Store file for upload on save
    setSelectedFile(file);

    // Show local preview
    const reader = new FileReader();
    reader.onload = () => setImagePreview(reader.result as string);
    reader.readAsDataURL(file);

    e.target.value = '';
  };

  const handleSave = () => {
    const payload: EditProfileSavePayload = {
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      ...(bio && { bio: bio.trim() }),
      ...(gender && { gender }),
      country: 'Nigeria',
      ...(state && { state: state.trim() }),
      ...(city && { city: city.trim() }),
    };

    // Attach the raw file — parent will upload → get URL → add avatar to PATCH
    if (selectedFile) {
      payload.avatarFile = selectedFile;
    }

    onSave(payload);
  };

  const displayImage = imagePreview || userProfile?.avatar;
  const nameForAvatar = firstName || 'U';

  return (
    <div className="flex flex-col h-full">
      {/* ── Sticky Header ──────────────────────────────────────────────── */}
      <div className="sticky top-0 z-10 bg-white dark:bg-[#1f1f1f] px-5 pt-5 pb-3 border-b border-neutral-100 dark:border-neutral-800">
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-0.5">Edit Profile</h2>
        <p className="text-sm text-neutral-400">Update your personal details</p>
      </div>

      {/* ── Scrollable Form Body ───────────────────────────────────────── */}
      <div className="flex-1 overflow-y-auto px-5 pt-5 pb-16 space-y-5">
        {/* Profile pic */}
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
                className="w-24 h-24 rounded-full object-cover border-4 border-neutral-100 dark:border-neutral-700"
              />
            ) : (
              <div
                className="w-24 h-24 rounded-full flex items-center justify-center text-white text-2xl font-bold border-4 border-neutral-100 dark:border-neutral-700"
                style={{ backgroundColor: getRandomColorByString(nameForAvatar) }}
              >
                {getFirstCharacter(nameForAvatar)}
              </div>
            )}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 w-8 h-8 bg-blue rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-neutral-900 hover:scale-110 transition-transform"
            >
              <Camera size={14} className="text-white" />
            </button>
          </div>
          {/* <p className="text-[11px] text-neutral-400">Tap to change photo</p>
          {selectedFile && (
            <span className="text-[11px] text-blue font-medium">New image selected</span>
          )} */}
        </div>

        {/* Name row */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              First Name
            </label>
            <Input
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="!rounded-lg h-11"
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              Last Name
            </label>
            <Input
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="!rounded-lg h-11"
            />
          </div>
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Email
          </label>
          <Input
            value={userProfile?.email || ''}
            disabled
            prefix={<Mail size={14} className="text-neutral-400" />}
            className="!rounded-lg h-11"
          />
          <p className="text-[11px] text-neutral-400 mt-1">Email cannot be changed</p>
        </div>

        {/* Bio */}
        <div>
          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Bio
          </label>
          <Input.TextArea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            placeholder="Tell us a little about yourself"
            maxLength={250}
            rows={3}
            showCount
            className="!rounded-lg !text-sm"
          />
        </div>

        {/* Gender */}
        <div>
          <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
            Gender
          </label>
          <div className="flex gap-2">
            {['male', 'female', 'other'].map((g) => (
              <button
                key={g}
                type="button"
                onClick={() => setGender(g)}
                className={`flex-1 py-2.5 rounded-lg text-sm font-medium border transition-all capitalize ${
                  gender === g
                    ? 'border-blue bg-blue-50 dark:bg-blue-900/20 text-blue dark:text-blue'
                    : 'border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:border-neutral-300'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* State & City */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              State
            </label>
            <SearchableSelect
              options={states}
              value={state}
              onChange={handleStateSelect}
              placeholder="Select state"
              searchPlaceholder="Search states..."
              loading={loadingStates}
              icon={MapPin}
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-neutral-700 dark:text-neutral-300 mb-1.5 block">
              City
            </label>
            {cities.length > 0 ? (
              <SearchableSelect
                options={cities}
                value={city}
                onChange={handleCitySelect}
                placeholder="Select city"
                searchPlaceholder="Search cities..."
                loading={loadingCities}
                icon={Building2}
                disabled={!state}
              />
            ) : (
              <Input
                value={city}
                onChange={(e) => setCity(e.target.value)}
                placeholder={state ? 'Enter city' : 'Select a state first'}
                disabled={!state}
                className="!rounded-lg h-11"
              />
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 pt-2 pb-6">
          <button
            onClick={onCancel}
            className="flex-1 py-3 text-sm font-medium text-neutral-600 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors border border-neutral-200 dark:border-neutral-700"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex-1 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {isSaving ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save size={16} />
                Save
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileForm;
