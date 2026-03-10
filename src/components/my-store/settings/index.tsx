'use client';

import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Input, Select, Switch, Modal, message as antMessage } from 'antd';
import { motion } from 'framer-motion';
import {
  Store,
  Eye,
  Bell,
  CreditCard,
  Shield,
  Camera,
  MapPin,
  Globe,
  Trash2,
  Save,
  AlertTriangle,
  ChevronRight,
  Power,
  User,
  Loader2,
  CheckCircle,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import PhoneInput from '@grc/_shared/components/phone-input';

const { TextArea } = Input;
const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Comaket';

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
    className="bg-white dark:bg-neutral-800/60 rounded-2xl border border-neutral-100 dark:border-neutral-700/50 overflow-hidden"
  >
    <div className="p-5 pb-0">
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`w-9 h-9 rounded-lg ${iconBg} flex items-center justify-center flex-shrink-0`}
        >
          <Icon size={16} className={iconColor} />
        </div>
        <div>
          <h3 className="text-sm font-semibold text-neutral-900 dark:text-white">{title}</h3>
          {description && <p className="text-[11px] text-neutral-500">{description}</p>}
        </div>
      </div>
    </div>
    <div className="px-5 pb-5">{children}</div>
  </motion.div>
);

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface FormData {
  name: string;
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
  // operatingHours: string;
  returnPolicy: string;
  isActive: boolean;
  logo: string | null;
  // Notifications
  // notifyNewOrder: boolean;
  // notifyNewReview: boolean;
  // notifyLowStock: boolean;
  // notifyPromotions: boolean;
  // Payment
  bankName: string;
  bankCode: string;
  accountNumber: string;
  accountName: string;
  isVisible: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const buildFormFromStore = (store: any): FormData => ({
  name: store?.name || '',
  tagline: store?.tagline || store?.slogan || '',
  bio: store?.bio || store?.description || '',
  phoneNumber: store?.phoneNumber || store?.phone || '',
  whatsappNumber: store?.whatsappNumber || '',
  email: store?.email || '',
  state: store?.location?.state || '',
  city: store?.location?.city || '',
  website: store?.website || store?.socialLinks?.website || '',
  instagramHandle: store?.socialLinks?.instagram || store?.instagramHandle || '',
  twitterHandle: store?.socialLinks?.twitter || store?.twitterHandle || '',
  tiktokHandle: store?.socialLinks?.tiktok || store?.tiktokHandle || '',
  // operatingHours: store?.operatingHours || '',
  returnPolicy: store?.returnPolicy || '',
  isActive: store?.status === 'active' || store?.status === 'live' || store?.isActive === true,
  logo: store?.logo || null,
  // notifyNewOrder: store?.notifications?.newOrder ?? true,
  // notifyNewReview: store?.notifications?.newReview ?? true,
  // notifyLowStock: store?.notifications?.lowStock ?? true,
  // notifyPromotions: store?.notifications?.promotions ?? false,
  bankName: store?.bankDetails?.bankName || store?.paymentInfo?.bankName || '',
  bankCode: store?.bankDetails?.bankCode || store?.paymentInfo?.bankCode || '',
  accountNumber: store?.bankDetails?.accountNumber || store?.paymentInfo?.accountNumber || '',
  accountName: store?.bankDetails?.accountName || store?.paymentInfo?.accountName || '',
  isVisible: store?.isVisible,
});

const buildPayload = (form: FormData): Record<string, any> => ({
  name: form.name,
  tagline: form.tagline,
  bio: form.bio,
  phoneNumber: form.phoneNumber,
  whatsappNumber: form.whatsappNumber,
  email: form.email,
  location: { state: form.state, city: form.city, country: 'Nigeria' },
  website: form.website,
  socialLinks: {
    instagram: form.instagramHandle,
    twitter: form.twitterHandle,
    tiktok: form.tiktokHandle,
  },
  // operatingHours: form.operatingHours,
  returnPolicy: form.returnPolicy,
  logo: form.logo,
  // notifications: {
  //   newOrder: form.notifyNewOrder,
  //   newReview: form.notifyNewReview,
  //   lowStock: form.notifyLowStock,
  //   promotions: form.notifyPromotions,
  // },
  bankDetails: {
    bankName: form.bankName,
    bankCode: form.bankCode,
    accountNumber: form.accountNumber,
    accountName: form.accountName,
  },
});

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface StoreSettingsProps {
  storeId: string;
  store: any;
  onUpdateStore: (data: Record<string, any>) => Promise<void>;
  isSaving: boolean;
  onToggleVisibility: (visible: boolean) => Promise<void>;
  isTogglingVisibility?: boolean;
  onDeleteStore: () => Promise<void>;
  isDeleting?: boolean;
  onUploadImage: (file: File) => Promise<string | null>;
  isUploadingImage?: boolean;
  banks?: any[];
  isLoadingBanks?: boolean;
  onVerifyBankAccount?: (params: { account_number: string; bank_code: string }) => Promise<any>;
  bankAccountInfo?: any;
  isVerifyingBankAccount?: boolean;
}

const StoreSettingsPage: React.FC<StoreSettingsProps> = ({
  store,
  onUpdateStore,
  isSaving,
  onToggleVisibility,
  isTogglingVisibility,
  onDeleteStore,
  isDeleting,
  onUploadImage,
  isUploadingImage,
  banks = [],
  isLoadingBanks,
  onVerifyBankAccount,
  bankAccountInfo,
  isVerifyingBankAccount,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [form, setForm] = useState<FormData>(() => buildFormFromStore(store));
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [activeSection, setActiveSection] = useState<string | null>(isMobile ? null : 'details');

  // ── Sync form when store data changes ───────────────────────────────
  useEffect(() => {
    if (store) setForm(buildFormFromStore(store));
  }, [store]);

  // ── Bank options ────────────────────────────────────────────────────
  const bankOptions = useMemo(() => {
    return banks
      .filter((b: any) => b.active !== false)
      .map((b: any) => ({ label: b.name, value: b.code }));
  }, [banks]);

  // ── Auto-verify bank account when number is 10 digits + bank selected ─
  useEffect(() => {
    if (form.accountNumber.length === 10 && form.bankCode && onVerifyBankAccount) {
      onVerifyBankAccount({ account_number: form.accountNumber, bank_code: form.bankCode });
    }
  }, [form.accountNumber, form.bankCode]);

  // ── Sync verified account name ──────────────────────────────────────
  useEffect(() => {
    if (bankAccountInfo?.account_name) {
      setForm((prev) => ({ ...prev, accountName: bankAccountInfo.account_name }));
    }
  }, [bankAccountInfo]);

  const update = useCallback((partial: Partial<FormData>) => {
    setForm((prev) => ({ ...prev, ...partial }));
  }, []);

  // ── Save ────────────────────────────────────────────────────────────
  const handleSave = useCallback(async () => {
    if (!form.name.trim()) {
      antMessage.warning('Store name is required');
      return;
    }
    const payload = buildPayload(form);
    await onUpdateStore(payload);
  }, [form, onUpdateStore]);

  // ── Delete ──────────────────────────────────────────────────────────
  const handleDeleteStore = useCallback(async () => {
    if (deleteConfirmText !== form.name) {
      antMessage.error("Store name doesn't match");
      return;
    }
    await onDeleteStore();
    setIsDeleteModalOpen(false);
  }, [deleteConfirmText, form.name, onDeleteStore]);

  // ── Image Upload ────────────────────────────────────────────────────
  const profileInputRef = React.useRef<HTMLInputElement>(null);

  const handleLogoUpload = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (!file) return;
      e.target.value = '';

      // Preview immediately
      const reader = new FileReader();
      reader.onload = () => update({ logo: reader.result as string });
      reader.readAsDataURL(file);

      // Upload to get real URL
      const url = await onUploadImage(file);
      if (url) update({ logo: url });
    },
    [onUploadImage, update]
  );

  // ── Sections ────────────────────────────────────────────────────────
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
      label: 'Visibility',
      icon: Eye,
      color: 'text-emerald-600',
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    },
    // {
    //   key: 'notifications',
    //   label: 'Notifications',
    //   icon: Bell,
    //   color: 'text-violet-600',
    //   bg: 'bg-violet-50 dark:bg-violet-900/20',
    // },
    {
      key: 'payment',
      label: 'Payment & Payout',
      icon: CreditCard,
      color: 'text-orange-600',
      bg: 'bg-orange-50 dark:bg-orange-900/20',
    },
    // {
    //   key: 'policies',
    //   label: 'Policies',
    //   icon: Shield,
    //   color: 'text-cyan-600',
    //   bg: 'bg-cyan-50 dark:bg-cyan-900/20',
    // },
    {
      key: 'danger',
      label: 'Danger Zone',
      icon: AlertTriangle,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-900/20',
    },
  ];

  // ── Mobile section picker ───────────────────────────────────────────
  if (isMobile && !activeSection) {
    return (
      <div className="space-y-4">
        <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Settings</h1>
        <div className="space-y-2">
          {sections.map((sec) => (
            <button
              key={sec.key}
              onClick={() => setActiveSection(sec.key)}
              className="w-full flex items-center gap-3 p-4 bg-white dark:bg-neutral-800/60 rounded-xl border border-neutral-100 dark:border-neutral-700/50 text-left hover:shadow-sm transition-shadow"
            >
              <div
                className={`w-9 h-9 rounded-lg ${sec.bg} flex items-center justify-center flex-shrink-0`}
              >
                <sec.icon size={16} className={sec.color} />
              </div>
              <span className="text-sm font-medium text-neutral-900 dark:text-white flex-1">
                {sec.label}
              </span>
              <ChevronRight size={16} className="text-neutral-300" />
            </button>
          ))}
        </div>
      </div>
    );
  }

  // ── Render section ──────────────────────────────────────────────────
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
              {/* Logo */}
              <div className="flex items-center gap-4">
                <input
                  ref={profileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoUpload}
                />
                <button
                  onClick={() => profileInputRef.current?.click()}
                  className="relative group flex-shrink-0"
                  disabled={isUploadingImage}
                >
                  {form.logo ? (
                    <img
                      src={form.logo}
                      alt=""
                      className="w-16 h-16 rounded-full object-cover border-2 border-neutral-100 dark:border-neutral-700"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-neutral-700 flex items-center justify-center border-2 border-neutral-50 dark:border-neutral-600">
                      <Store size={24} className="text-neutral-300" />
                    </div>
                  )}
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue rounded-full flex items-center justify-center border-2 border-white dark:border-neutral-900 group-hover:scale-110 transition-transform">
                    {isUploadingImage ? (
                      <Loader2 size={10} className="text-white animate-spin" />
                    ) : (
                      <Camera size={10} className="text-white" />
                    )}
                  </div>
                </button>
                <div>
                  <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                    Store Logo
                  </p>
                  <p className="text-[11px] text-neutral-400">Recommended: 400×400px, PNG or JPG</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  Store Name
                </label>
                <Input
                  value={form.name}
                  onChange={(e) => update({ name: e.target.value })}
                  maxLength={40}
                  showCount
                  className="!rounded-xl h-11"
                  prefix={<Store size={14} className="text-neutral-400" />}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  Tagline
                </label>
                <Input
                  value={form.tagline}
                  onChange={(e) => update({ tagline: e.target.value })}
                  maxLength={80}
                  showCount
                  className="!rounded-xl h-11"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  About Your Store
                </label>
                <TextArea
                  value={form.bio}
                  onChange={(e) => update({ bio: e.target.value })}
                  rows={3}
                  maxLength={500}
                  showCount
                  className="!rounded-xl resize-none"
                />
              </div>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    Phone
                  </label>
                  <PhoneInput
                    value={form.phoneNumber}
                    onChange={(val) => update({ phoneNumber: val })}
                    placeholder="Phone number"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    WhatsApp
                  </label>
                  <PhoneInput
                    value={form.whatsappNumber}
                    onChange={(val) => update({ whatsappNumber: val })}
                    placeholder="WhatsApp number"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  Store Email
                </label>
                <Input
                  value={form.email}
                  onChange={(e) => update({ email: e.target.value })}
                  className="!rounded-xl h-11"
                  prefix={<User size={14} className="text-neutral-400" />}
                />
              </div>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    State
                  </label>
                  <Input
                    value={form.state}
                    onChange={(e) => update({ state: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<MapPin size={14} className="text-neutral-400" />}
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                    City
                  </label>
                  <Input
                    value={form.city}
                    onChange={(e) => update({ city: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<MapPin size={14} className="text-neutral-400" />}
                  />
                </div>
              </div>
              {/* <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  Operating Hours
                </label>
                <Input
                  value={form.operatingHours}
                  onChange={(e) => update({ operatingHours: e.target.value })}
                  className="!rounded-xl h-11"
                  prefix={<Clock size={14} className="text-neutral-400" />}
                  placeholder="e.g. Mon-Sat: 9AM - 7PM"
                />
              </div> */}

              <div className="pt-2">
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-2.5 block">
                  Social Links
                </label>
                <div className="space-y-3">
                  <Input
                    value={form.website}
                    onChange={(e) => update({ website: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<Globe size={14} className="text-neutral-400" />}
                    placeholder="https://your-website.com"
                  />
                  <Input
                    value={form.instagramHandle}
                    onChange={(e) => update({ instagramHandle: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<span className="text-neutral-400 text-xs">IG</span>}
                    placeholder="Instagram handle"
                  />
                  <Input
                    value={form.twitterHandle}
                    onChange={(e) => update({ twitterHandle: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<span className="text-neutral-400 text-xs">X</span>}
                    placeholder="Twitter/X handle"
                  />
                  <Input
                    value={form.tiktokHandle}
                    onChange={(e) => update({ tiktokHandle: e.target.value })}
                    className="!rounded-xl h-11"
                    prefix={<span className="text-neutral-400 text-xs">TT</span>}
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
            <div className="space-y-4">
              {/* On / Off toggle */}
              <div className="flex items-center justify-between gap-4 p-4 rounded-xl border border-neutral-100 dark:border-neutral-700/50">
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      form.isVisible
                        ? 'bg-emerald-50 dark:bg-emerald-900/20'
                        : 'bg-neutral-100 dark:bg-neutral-700/50'
                    }`}
                  >
                    {isTogglingVisibility ? (
                      <Loader2 size={18} className="text-neutral-400 animate-spin" />
                    ) : (
                      <Power
                        size={18}
                        className={form.isVisible ? 'text-emerald-600' : 'text-neutral-400'}
                      />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-neutral-900 dark:text-white">
                      {form.isVisible ? 'Store is Live' : 'Store is Offline'}
                    </p>
                    <p className="text-[11px] text-neutral-500">
                      {form.isVisible
                        ? `Visible to everyone on ${APP_NAME}`
                        : 'Hidden from marketplace — only you can see it'}
                    </p>
                  </div>
                </div>
                <Switch
                  checked={form.isVisible}
                  loading={isTogglingVisibility}
                  onChange={async (value) => {
                    await onToggleVisibility(value);
                    update({ isActive: !form.isVisible });
                  }}
                  className={form.isVisible ? '!bg-emerald-500' : ''}
                />
              </div>

              {/* Status indicator */}
              <div
                className={`flex items-center gap-2.5 px-4 py-3 rounded-xl ${
                  form.isVisible
                    ? 'bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20'
                    : 'bg-neutral-50 dark:bg-neutral-800/50 border border-neutral-100 dark:border-neutral-700/50'
                }`}
              >
                <div
                  className={`w-2.5 h-2.5 rounded-full ${
                    form.isVisible
                      ? 'bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(52,211,153,0.6)]'
                      : 'bg-neutral-400'
                  }`}
                />
                <span
                  className={`text-sm font-medium ${
                    form.isVisible ? 'text-emerald-700 dark:text-emerald-400' : 'text-neutral-500'
                  }`}
                >
                  {form.isVisible
                    ? 'Customers can find and browse your store'
                    : 'Your store is currently hidden'}
                </span>
              </div>
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
                    <p className="text-sm font-medium text-neutral-900 dark:text-white">
                      {item.label}
                    </p>
                    <p className="text-[11px] text-neutral-500">{item.desc}</p>
                  </div>
                  <Switch
                    checked={(form as any)[item.key]}
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
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  Bank Name
                </label>
                <Select
                  showSearch
                  value={form.bankCode || undefined}
                  onChange={(code) => {
                    const bank = banks.find((b: any) => b.code === code);
                    update({ bankCode: code, bankName: bank?.name || '', accountName: '' });
                  }}
                  options={bankOptions}
                  loading={isLoadingBanks}
                  placeholder="Search and select your bank"
                  filterOption={(input, option) =>
                    (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
                  }
                  className="w-full h-11 [&_.ant-select-selector]:!rounded-xl"
                  notFoundContent={isLoadingBanks ? 'Loading banks...' : 'No banks found'}
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  Account Number
                </label>
                <Input
                  value={form.accountNumber}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                    update({ accountNumber: val, accountName: '' });
                  }}
                  maxLength={10}
                  className="!rounded-xl h-11"
                  placeholder="10-digit account number"
                  suffix={
                    isVerifyingBankAccount ? (
                      <Loader2 size={14} className="animate-spin text-blue" />
                    ) : form.accountNumber.length === 10 && form.bankCode ? (
                      form.accountName ? (
                        <CheckCircle size={14} className="text-emerald-500" />
                      ) : null
                    ) : null
                  }
                />
                {form.accountNumber.length > 0 && form.accountNumber.length < 10 && (
                  <p className="text-[10px] text-neutral-400 mt-1">
                    {10 - form.accountNumber.length} more digit
                    {10 - form.accountNumber.length !== 1 ? 's' : ''} needed
                  </p>
                )}
                {form.accountNumber.length === 10 && !form.bankCode && (
                  <p className="text-[10px] text-amber-500 mt-1">Select a bank to verify</p>
                )}
              </div>
              <div>
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  Account Name
                </label>
                <Input
                  value={form.accountName}
                  className="!rounded-xl h-11"
                  disabled
                  placeholder={
                    isVerifyingBankAccount ? 'Verifying...' : 'Auto-verified from your bank'
                  }
                  prefix={
                    isVerifyingBankAccount ? (
                      <Loader2 size={14} className="text-blue animate-spin" />
                    ) : form.accountName ? (
                      <CheckCircle size={14} className="text-emerald-500" />
                    ) : (
                      <User size={14} className="text-neutral-400" />
                    )
                  }
                />
                {form.accountName && (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckCircle size={10} /> Account verified
                  </p>
                )}
                {!form.accountName &&
                  !isVerifyingBankAccount &&
                  form.accountNumber.length === 10 &&
                  form.bankCode && (
                    <p className="text-[11px] text-red-500 mt-1">
                      Could not verify account. Please check details.
                    </p>
                  )}
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
                <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                  Return Policy
                </label>
                <TextArea
                  value={form.returnPolicy}
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
                <p className="text-xs text-neutral-500 mb-3">
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
              className="p-1.5 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800"
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
                className="text-neutral-500"
              >
                <path d="M15 18l-6-6 6-6" />
              </svg>
            </button>
          )}
          <div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">Settings</h1>
            {isMobile && activeSection && (
              <p className="text-xs text-neutral-500">
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
          {isSaving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {isSaving ? 'Saving...' : 'Save'}
        </button>
      </div>

      {/* Desktop: all sections, Mobile: single section */}
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
        rootClassName="modal-with-backdrop"
        className="[&_.ant-modal-content]:!rounded-2xl"
      >
        <div className="space-y-4 pt-2">
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            To confirm, type <strong className="text-red-500">{form.name}</strong> in the box below.
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
              className="flex-1 py-2.5 text-sm font-medium text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteStore}
              disabled={deleteConfirmText !== form.name || isDeleting}
              className={`flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                deleteConfirmText === form.name && !isDeleting
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
              }`}
            >
              {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
              {isDeleting ? 'Deleting...' : 'Delete Permanently'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default StoreSettingsPage;
