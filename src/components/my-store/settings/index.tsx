'use client';

import React, { useState, useCallback } from 'react';
import { Input, Switch, Modal, message as antMessage } from 'antd';
import { motion } from 'framer-motion';
import {
  Store,
  Eye,
  Bell,
  CreditCard,
  Shield,
  Camera,
  MapPin,
  Phone,
  Globe,
  Trash2,
  Save,
  AlertTriangle,
  ChevronRight,
  Pause,
  Power,
  Clock,
  User,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

const { TextArea } = Input;

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

type StoreStatus = 'live' | 'offline' | 'paused';

interface StoreSettings {
  storeName: string;
  tagline: string;
  bio: string;
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  state: string;
  city: string;
  website: string;
  instagramHandle: string;
  twitterHandle: string;
  tiktokHandle: string;
  operatingHours: string;
  returnPolicy: string;
  status: StoreStatus;
  profileImage: string | null;
  coverImage: string | null;
  // Notifications
  notifyNewOrder: boolean;
  notifyNewReview: boolean;
  notifyLowStock: boolean;
  notifyPromotions: boolean;
  // Payment
  bankName: string;
  accountNumber: string;
  accountName: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

const initialSettings: StoreSettings = {
  storeName: 'EmTech Store',
  tagline: 'Your trusted gadget plug 🔌',
  bio: 'We sell authentic gadgets at the best prices in Lagos. Original products only with warranty.',
  phoneNumber: '2348012345678',
  whatsappNumber: '2348012345678',
  email: 'emtech@gmail.com',
  state: 'Lagos',
  city: 'Ikeja',
  website: 'https://emtech.ng',
  instagramHandle: 'emtech.ng',
  twitterHandle: 'emtechng',
  tiktokHandle: 'emtech.ng',
  operatingHours: 'Mon-Sat: 9AM - 7PM',
  returnPolicy: '7-day return policy for unopened items. Buyer covers return shipping.',
  status: 'live',
  profileImage: null,
  coverImage: null,
  notifyNewOrder: true,
  notifyNewReview: true,
  notifyLowStock: true,
  notifyPromotions: false,
  bankName: 'GTBank',
  accountNumber: '0123456789',
  accountName: 'Emmanuel Okafor',
};

// ═══════════════════════════════════════════════════════════════════════════
// SECTION CARD
// ═══════════════════════════════════════════════════════════════════════════

const SectionCard: React.FC<{
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ icon: Icon, iconColor, iconBg, title, description, children }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden"
  >
    <div className="p-5 pb-0">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon size={16} className={iconColor} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{title}</h3>
          {description && <p className="text-[11px] text-gray-500">{description}</p>}
        </div>
      </div>
    </div>
    <div className="px-5 pb-5">{children}</div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// STATUS CONFIG
// ═══════════════════════════════════════════════════════════════════════════

const statusOptions: {
  value: StoreStatus;
  label: string;
  desc: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  {
    value: 'live',
    label: 'Live',
    desc: 'Your store is visible to everyone',
    icon: Power,
    color: 'text-emerald-600 border-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    value: 'paused',
    label: 'Paused',
    desc: 'Temporarily hidden from marketplace',
    icon: Pause,
    color: 'text-amber-600 border-amber-500',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    value: 'offline',
    label: 'Offline',
    desc: 'Store is not visible to anyone',
    icon: Eye,
    color: 'text-gray-600 border-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-700/50',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface StoreSettingsProps {
  storeId: string;
}

const StoreSettingsPage: React.FC<StoreSettingsProps> = ({}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [settings, setSettings] = useState<StoreSettings>(initialSettings);
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(isMobile ? null : 'details');

  const update = useCallback((partial: Partial<StoreSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleSave = useCallback(async () => {
    setIsSaving(true);
    // ── TODO: Replace with real API call ───────────────────────────
    await new Promise((r) => setTimeout(r, 1000));
    setIsSaving(false);
    antMessage.success('Settings saved!');
  }, [settings]);

  const handleDeleteStore = useCallback(() => {
    if (deleteConfirmText !== settings.storeName) {
      antMessage.error("Store name doesn't match");
      return;
    }
    // ── TODO: Replace with real API call ───────────────────────────
    antMessage.success('Store deletion request submitted');
    setIsDeleteModalOpen(false);
  }, [deleteConfirmText, settings.storeName]);

  const profileInputRef = React.useRef<HTMLInputElement>(null);

  const handleImageUpload =
    (type: 'profile' | 'cover') => (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = () =>
        update(
          type === 'profile'
            ? { profileImage: reader.result as string }
            : { coverImage: reader.result as string }
        );
      reader.readAsDataURL(file);
      e.target.value = '';
    };

  // Mobile: section navigation
  const sections = [
    {
      key: 'details',
      label: 'Store Details',
      icon: Store,
      color: 'text-blue',
      bg: 'bg-blue-50 dark:bg-blue-900/20',
    },
    {
      key: 'visibility',
      label: 'Visibility & Status',
      icon: Eye,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    {
      key: 'notifications',
      label: 'Notifications',
      icon: Bell,
      color: 'text-violet-600',
      bg: 'bg-violet-50 dark:bg-violet-900/20',
    },
    {
      key: 'payment',
      label: 'Payment & Payout',
      icon: CreditCard,
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    {
      key: 'policies',
      label: 'Policies',
      icon: Shield,
      color: 'text-cyan-600',
      bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    },
    {
      key: 'danger',
      label: 'Danger Zone',
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  // If mobile and no section selected, show section picker
  if (isMobile && !activeSection) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
        <div className="space-y-2">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              className="w-full flex items-center gap-3 p-4 bg-white dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/50 text-left hover:shadow-sm transition-shadow"
            >
              <div
                className={`w-9 h-9 rounded-lg ${sec.bg} flex items-center justify-center flex-shrink-0`}
              >
                <sec.icon size={16} className={sec.color} />
              </div>
              <span className="text-sm font-medium text-gray-900 dark:text-white flex-1">
                {sec.label}
              </span>
              <ChevronRight size={16} className="text-gray-300" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  const renderSection = (key: string) => {
    switch (key) {
      case 'details':
        return (
          <SectionCard
            icon={Store}
            iconColor="text-blue"
            iconBg="bg-blue-50 dark:bg-blue-900/20"
            title="Store Details"
            description="Basic information about your store"
          >
            <div className="space-y-5">
              {/* Images */}
              <div className="flex items-center gap-4">
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageUpload('profile')}
                />
                <button
                  onClick={() => profileInputRef.current?.click()}
                  className="relative group flex-shrink-0"
                >
                  {settings.profileImage ? (
                    <img
                      src={settings.profileImage}
                      alt=""
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-100 dark:border-gray-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border-2 border-gray-50 dark:border-gray-600">
                      <Store size={24} className="text-gray-300" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue rounded-full flex items-center justify-center border-2 border-white dark:border-gray-900 group-hover:scale-110 transition-transform">
                    <Camera size={10} className="text-white" />
                  </div>
                </button>
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white">Store Logo</p>
                  <p className="text-[11px] text-gray-400">Recommended: 400×400px, PNG or JPG</p>
                </div>
              </div>

              {/* Fields */}
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Store Name
                </label>
                <Input
                  value={settings.storeName}
                  onChange={(e) => update({ storeName: e.target.value })}
                  maxLength={40}
                  showCount
                  className="!rounded-xl h-11"
                  prefix={<Store size={14} className="text-gray-400" />}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Tagline
                </label>
                <Input
                  value={settings.tagline}
                  onChange={(e) => update({ tagline: e.target.value })}
                  maxLength={80}
                  showCount
                  className="!rounded-xl h-11"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                  About Your Store
                </label>
                <TextArea
                  value={settings.bio}
                  onChange={(e) => update({ bio: e.target.value })}
                  rows={3}
                  maxLength={500}
                  showCount
                  className="!rounded-xl resize-none"
                />
              </div>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                    Phone
                  </label>
                  <Input
                    value={settings.phoneNumber}
                    onChange={(e) => update({ phoneNumber: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<Phone size={14} className="text-gray-400" />}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                    WhatsApp
                  </label>
                  <Input
                    value={settings.whatsappNumber}
                    onChange={(e) => update({ whatsappNumber: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<Phone size={14} className="text-gray-400" />}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Store Email
                </label>
                <Input
                  value={settings.email}
                  onChange={(e) => update({ email: e.target.value })}
                  className="!rounded-xl h-11"
                  prefix={<User size={14} className="text-gray-400" />}
                />
              </div>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                    State
                  </label>
                  <Input
                    value={settings.state}
                    onChange={(e) => update({ state: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<MapPin size={14} className="text-gray-400" />}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                    City
                  </label>
                  <Input
                    value={settings.city}
                    onChange={(e) => update({ city: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<MapPin size={14} className="text-gray-400" />}
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Operating Hours
                </label>
                <Input
                  value={settings.operatingHours}
                  onChange={(e) => update({ operatingHours: e.target.value })}
                  className="!rounded-xl h-11"
                  prefix={<Clock size={14} className="text-gray-400" />}
                  placeholder="e.g. Mon-Sat: 9AM - 7PM"
                />
              </div>

              <div className="pt-2">
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-2.5 block">
                  Social Links
                </label>
                <div className="space-y-3">
                  <Input
                    value={settings.website}
                    onChange={(e) => update({ website: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<Globe size={14} className="text-gray-400" />}
                    placeholder="https://your-website.com"
                  />
                  <Input
                    value={settings.instagramHandle}
                    onChange={(e) => update({ instagramHandle: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<span className="text-gray-400 text-xs">IG</span>}
                    placeholder="Instagram handle"
                  />
                  <Input
                    value={settings.twitterHandle}
                    onChange={(e) => update({ twitterHandle: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<span className="text-gray-400 text-xs">X</span>}
                    placeholder="Twitter/X handle"
                  />
                  <Input
                    value={settings.tiktokHandle}
                    onChange={(e) => update({ tiktokHandle: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<span className="text-gray-400 text-xs">TT</span>}
                    placeholder="TikTok handle"
                  />
                </div>
              </div>
            </div>
          </SectionCard>
        );

      case 'visibility':
        return (
          <SectionCard
            icon={Eye}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50 dark:bg-emerald-900/20"
            title="Store Visibility"
            description="Control who can see your store"
          >
            <div className="space-y-3">
              {statusOptions.map((opt) => {
                const isActive = settings.status === opt.value;
                const Icon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    onClick={() => update({ status: opt.value })}
                    className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 text-left transition-all ${
                      isActive
                        ? `${opt.bg} ${opt.color} border-current`
                        : 'border-gray-100 dark:border-gray-700/50 hover:border-gray-200'
                    }`}
                  >
                    <Icon size={18} className={isActive ? '' : 'text-gray-400'} />
                    <div className="flex-1">
                      <p
                        className={`text-sm font-semibold ${
                          isActive ? '' : 'text-gray-700 dark:text-gray-300'
                        }`}
                      >
                        {opt.label}
                      </p>
                      <p className={`text-[11px] ${isActive ? 'opacity-70' : 'text-gray-400'}`}>
                        {opt.desc}
                      </p>
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        isActive
                          ? 'border-current bg-current'
                          : 'border-gray-300 dark:border-gray-600'
                      }`}
                    >
                      {isActive && <div className="w-2 h-2 rounded-full bg-white" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </SectionCard>
        );

      case 'notifications':
        return (
          <SectionCard
            icon={Bell}
            iconColor="text-violet-600"
            iconBg="bg-violet-50 dark:bg-violet-900/20"
            title="Notifications"
            description="Choose what alerts you receive"
          >
            <div className="space-y-4">
              {[
                {
                  key: 'notifyNewOrder',
                  label: 'New Orders',
                  desc: 'Get notified when a customer places an order',
                },
                {
                  key: 'notifyNewReview',
                  label: 'New Reviews',
                  desc: 'Get notified when someone reviews your store',
                },
                {
                  key: 'notifyLowStock',
                  label: 'Low Stock Alerts',
                  desc: 'Alert when products are running low',
                },
                {
                  key: 'notifyPromotions',
                  label: 'Promotions & Tips',
                  desc: 'Seller tips and promotional opportunities',
                },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between gap-4 py-1">
                  <div>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-gray-500">{item.desc}</p>
                  </div>
                  <Switch
                    checked={(settings as any)[item.key]}
                    onChange={(checked) => update({ [item.key]: checked })}
                  />
                </div>
              ))}
            </div>
          </SectionCard>
        );

      case 'payment':
        return (
          <SectionCard
            icon={CreditCard}
            iconColor="text-orange-600"
            iconBg="bg-orange-50 dark:bg-orange-900/20"
            title="Payment & Payout"
            description="Where you receive your earnings"
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Bank Name
                </label>
                <Input
                  value={settings.bankName}
                  onChange={(e) => update({ bankName: e.target.value })}
                  className="!rounded-xl h-11"
                  placeholder="e.g. GTBank, Access Bank"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Account Number
                </label>
                <Input
                  value={settings.accountNumber}
                  onChange={(e) => update({ accountNumber: e.target.value })}
                  maxLength={10}
                  className="!rounded-xl h-11"
                  placeholder="10-digit account number"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Account Name
                </label>
                <Input
                  value={settings.accountName}
                  onChange={(e) => update({ accountName: e.target.value })}
                  className="!rounded-xl h-11"
                  disabled
                />
                <p className="text-[11px] text-gray-400 mt-1">Auto-verified from your bank</p>
              </div>
            </div>
          </SectionCard>
        );

      case 'policies':
        return (
          <SectionCard
            icon={Shield}
            iconColor="text-cyan-600"
            iconBg="bg-cyan-50 dark:bg-cyan-900/20"
            title="Store Policies"
            description="Return policy and terms for buyers"
          >
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 block">
                  Return Policy
                </label>
                <TextArea
                  value={settings.returnPolicy}
                  onChange={(e) => update({ returnPolicy: e.target.value })}
                  rows={4}
                  maxLength={1000}
                  showCount
                  className="!rounded-xl resize-none"
                  placeholder="Describe your return/refund policy..."
                />
              </div>
              <div className="p-3 bg-cyan-50/50 dark:bg-cyan-900/10 rounded-lg border border-cyan-100 dark:border-cyan-900/20">
                <p className="text-[11px] text-cyan-700 dark:text-cyan-400">
                  💡 Stores with clear return policies receive 40% more orders on average.
                </p>
              </div>
            </div>
          </SectionCard>
        );

      case 'danger':
        return (
          <SectionCard
            icon={AlertTriangle}
            iconColor="text-red-500"
            iconBg="bg-red-50 dark:bg-red-900/20"
            title="Danger Zone"
            description="Irreversible actions"
          >
            <div className="space-y-3">
              <div className="p-4 border-2 border-red-100 dark:border-red-900/30 rounded-xl">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400 mb-1">
                  Delete This Store
                </p>
                <p className="text-xs text-gray-500 mb-3">
                  This will permanently delete your store, all products, and order history. This
                  action cannot be undone.
                </p>
                <button
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="px-4 py-2 rounded-lg text-xs font-semibold border border-red-300 dark:border-red-700 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1.5"
                >
                  <Trash2 size={13} /> Delete Store
                </button>
              </div>
            </div>
          </SectionCard>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isMobile && activeSection && (
            <button
              onClick={() => setActiveSection(null)}
              className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-gray-500"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h1>
            {isMobile && activeSection && (
              <p className="text-xs text-gray-500">
                {sections.find((s) => s.key === activeSection)?.label}
              </p>
            )}
          </div>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all disabled:opacity-60"
        >
          {isSaving ? (
            <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <Save size={14} />
          )}
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Desktop: all sections stacked, Mobile: single section */}
      {isMobile ? (
        activeSection && renderSection(activeSection)
      ) : (
        <div className="space-y-5">
          {sections.map((sec) => (
            <div key={sec.key}>{renderSection(sec.key)}</div>
          ))}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        open={isDeleteModalOpen}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setDeleteConfirmText('');
        }}
        title={
          <div className="flex items-center gap-2 text-base font-bold text-red-600">
            <Trash2 size={18} /> Delete Store
          </div>
        }
        footer={null}
        width={isMobile ? '95%' : 440}
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            To confirm, type <strong className="text-red-500">{settings.storeName}</strong> in the
            box below.
          </p>
          <Input
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            placeholder="Type store name to confirm"
            className="!rounded-xl h-11"
          />
          <div className="flex gap-3">
            <button
              onClick={() => {
                setIsDeleteModalOpen(false);
                setDeleteConfirmText('');
              }}
              className="flex-1 py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteStore}
              disabled={deleteConfirmText !== settings.storeName}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                deleteConfirmText === settings.storeName
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Trash2 size={14} /> Delete Permanently
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoreSettingsPage;
