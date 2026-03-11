'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  User,
  Phone,
  Mail,
  FileText,
  ShieldCheck,
  Loader2,
  Lock,
  ShoppingBag,
  ChevronDown,
  Search,
  Globe,
} from 'lucide-react';
import Image from 'next/image';
import { numberFormat } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { Input, message as antMessage } from 'antd';
import type {
  CheckoutCartItem,
  ShippingFormData,
  LocationOption,
} from '@grc/app/(ui)/(apps)/checkout/page';

const { TextArea } = Input;

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
  error,
}: {
  options: LocationOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  loading?: boolean;
  icon?: React.ElementType;
  disabled?: boolean;
  error?: boolean;
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
        className={`w-full h-10 pl-10 pr-10 rounded-lg border bg-white dark:bg-neutral-800 text-left text-sm flex items-center transition-all focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none ${
          error
            ? 'border-red-400 focus:border-red-400 focus:ring-red-400/20'
            : 'border-neutral-200 dark:border-neutral-700'
        } ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
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
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue dark:text-blue font-medium'
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
// FORM FIELD COMPONENTS (outside parent to avoid remount on re-render)
// ═══════════════════════════════════════════════════════════════════════════

const FormField: React.FC<{
  label: string;
  value: string;
  onChange: (value: string) => void;
  icon: React.ReactNode;
  placeholder: string;
  required?: boolean;
  type?: string;
  error?: string;
}> = ({ label, value, onChange, icon, placeholder, required = true, type, error }) => (
  <div>
    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <Input
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      prefix={icon}
      status={error ? 'error' : undefined}
      type={type}
      className="!rounded-lg !h-10"
    />
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

const SelectField: React.FC<{
  label: string;
  value: string;
  options: LocationOption[];
  loading: boolean;
  placeholder: string;
  searchPlaceholder: string;
  onChange: (val: string) => void;
  icon?: React.ElementType;
  disabled?: boolean;
  required?: boolean;
  error?: string;
}> = ({
  label,
  value,
  options,
  loading: isLoading,
  placeholder,
  searchPlaceholder,
  onChange,
  icon,
  disabled,
  required = true,
  error,
}) => (
  <div>
    <label className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mb-1.5 block">
      {label} {required && <span className="text-red-400">*</span>}
    </label>
    <SearchableSelect
      options={options}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      searchPlaceholder={searchPlaceholder}
      loading={isLoading}
      icon={icon}
      disabled={disabled}
      error={!!error}
    />
    {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

interface CheckoutProps {
  items: CheckoutCartItem[];
  cartTotal: number;
  cartCount: number;
  shipping: ShippingFormData;
  onShippingChange: (updates: Partial<ShippingFormData>) => void;
  isProcessing: boolean;
  onPlaceOrder: (shipping: ShippingFormData) => void;
  onBack: () => void;
  // Location
  countries: LocationOption[];
  states: LocationOption[];
  cities: LocationOption[];
  loadingCountries: boolean;
  loadingStates: boolean;
  loadingCities: boolean;
  onCountryChange: (country: string) => void;
  onStateChange: (state: string) => void;
  onCityChange: (city: string) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Checkout: React.FC<CheckoutProps> = ({
  items,
  cartTotal,
  cartCount,
  shipping,
  onShippingChange,
  isProcessing,
  onPlaceOrder,
  onBack,
  // Location
  countries,
  states,
  cities,
  loadingCountries,
  loadingStates,
  loadingCities,
  onCountryChange,
  onStateChange,
  onCityChange,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [errors, setErrors] = useState<Partial<Record<keyof ShippingFormData, string>>>({});

  // ── Update field ────────────────────────────────────────────────────
  const updateField = (field: keyof ShippingFormData, value: string) => {
    onShippingChange({ [field]: value });
    if (errors[field]) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next[field];
        return next;
      });
    }
  };

  // ── Validate ────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ShippingFormData, string>> = {};

    if (!shipping.fullName.trim()) newErrors.fullName = 'Full name is required';
    if (!shipping.phoneNumber.trim()) newErrors.phoneNumber = 'Phone number is required';
    if (!shipping.address.trim()) newErrors.address = 'Address is required';
    if (!shipping.country.trim()) newErrors.country = 'Country is required';
    if (!shipping.state.trim()) newErrors.state = 'State is required';
    if (!shipping.city.trim()) newErrors.city = 'City is required';

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      antMessage.warning('Please fill in all required fields');
      return false;
    }

    return true;
  };

  // ── Submit ──────────────────────────────────────────────────────────
  const handleSubmit = () => {
    if (!validate()) return;
    onPlaceOrder(shipping);
  };

  // ── Location change with error clearing ─────────────────────────────
  const handleCountrySelect = (val: string) => {
    onCountryChange(val);
    if (errors.country)
      setErrors((p) => {
        const n = { ...p };
        delete n.country;
        return n;
      });
    if (errors.state)
      setErrors((p) => {
        const n = { ...p };
        delete n.state;
        return n;
      });
    if (errors.city)
      setErrors((p) => {
        const n = { ...p };
        delete n.city;
        return n;
      });
  };

  const handleStateSelect = (val: string) => {
    onStateChange(val);
    if (errors.state)
      setErrors((p) => {
        const n = { ...p };
        delete n.state;
        return n;
      });
    if (errors.city)
      setErrors((p) => {
        const n = { ...p };
        delete n.city;
        return n;
      });
  };

  const handleCitySelect = (val: string) => {
    onCityChange(val);
    if (errors.city)
      setErrors((p) => {
        const n = { ...p };
        delete n.city;
        return n;
      });
  };

  return (
    <div
      className={`min-h-screen dark:bg-neutral-900/50 ${
        isMobile ? 'px-4 pt-10 pb-32' : 'py-6 max-w-5xl mx-auto px-4'
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-1.5 text-sm font-medium text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 transition-colors"
        >
          <ArrowLeft size={16} />
          Back to Cart
        </button>
      </div>

      <h1 className="text-2xl font-bold dark:text-white mb-6">Checkout</h1>

      <div className={`flex ${isMobile ? 'flex-col' : 'gap-8'}`}>
        {/* ── Shipping Form ────────────────────────────────────────── */}
        <div className={`${isMobile ? 'w-full' : 'w-3/5'}`}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-5 mb-6">
            <h3 className="font-semibold text-base dark:text-white mb-4 flex items-center gap-2">
              <MapPin size={16} className="text-blue" />
              Shipping Address
            </h3>

            <div className="space-y-4">
              <FormField
                label="Full Name"
                value={shipping.fullName}
                onChange={(v) => updateField('fullName', v)}
                icon={<User size={14} className="text-neutral-400" />}
                placeholder="John Doe"
                error={errors.fullName}
              />

              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                <FormField
                  label="Phone Number"
                  value={shipping.phoneNumber}
                  onChange={(v) => updateField('phoneNumber', v)}
                  icon={<Phone size={14} className="text-neutral-400" />}
                  placeholder="080XXXXXXXX"
                  type="tel"
                  error={errors.phoneNumber}
                />
                <FormField
                  label="Email"
                  value={shipping.email}
                  onChange={(v) => updateField('email', v)}
                  icon={<Mail size={14} className="text-neutral-400" />}
                  placeholder="john@example.com"
                  required={false}
                  type="email"
                  error={errors.email}
                />
              </div>

              <FormField
                label="Street Address"
                value={shipping.address}
                onChange={(v) => updateField('address', v)}
                icon={<MapPin size={14} className="text-neutral-400" />}
                placeholder="e.g. 12 Market Road, Wuse Zone 5"
                error={errors.address}
              />

              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                <SelectField
                  label="Country"
                  value={shipping.country}
                  options={countries}
                  loading={loadingCountries}
                  placeholder="Select country"
                  searchPlaceholder="Search countries..."
                  onChange={handleCountrySelect}
                  icon={Globe}
                  error={errors.country}
                />
                <SelectField
                  label="State"
                  value={shipping.state}
                  options={states}
                  loading={loadingStates}
                  placeholder="Select state"
                  searchPlaceholder="Search states..."
                  onChange={handleStateSelect}
                  icon={MapPin}
                  disabled={!shipping.country}
                  error={errors.state}
                />
              </div>

              <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-4`}>
                <SelectField
                  label="City"
                  value={shipping.city}
                  options={cities}
                  loading={loadingCities}
                  placeholder="Select city"
                  searchPlaceholder="Search cities..."
                  onChange={handleCitySelect}
                  icon={MapPin}
                  disabled={!shipping.state}
                  error={errors.city}
                />
                <FormField
                  label="Zip Code"
                  value={shipping.zipCode}
                  onChange={(v) => updateField('zipCode', v)}
                  icon={<MapPin size={14} className="text-neutral-400" />}
                  placeholder="Optional"
                  required={false}
                  error={errors.zipCode}
                />
              </div>
            </div>
          </div>

          {/* Buyer Note */}
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-5">
            <h3 className="font-semibold text-base dark:text-white mb-4 flex items-center gap-2">
              <FileText size={16} className="text-blue" />
              Order Note
              <span className="text-xs font-normal text-neutral-400">(optional)</span>
            </h3>
            <TextArea
              value={shipping.buyerNote}
              onChange={(e) => updateField('buyerNote', e.target.value)}
              placeholder="Any special instructions for the seller..."
              rows={3}
              maxLength={500}
              showCount
              className="!rounded-lg resize-none"
            />
          </div>
        </div>

        {/* ── Order Summary ────────────────────────────────────────── */}
        <div className={`${isMobile ? 'w-full mt-6' : 'w-2/5'}`}>
          <div className="bg-white dark:bg-neutral-800 rounded-xl border border-neutral-100 dark:border-neutral-700 p-5 sticky top-4">
            <h3 className="font-semibold text-base dark:text-white mb-4">
              Order Summary ({cartCount} {cartCount === 1 ? 'item' : 'items'})
            </h3>

            {/* Items list */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {items.map((item) => (
                <div key={item.listingId} className="flex gap-3">
                  <div className="relative w-14 h-14 rounded-lg overflow-hidden flex-shrink-0 bg-neutral-100 dark:bg-neutral-700">
                    {item.image ? (
                      <Image src={item.image} alt={item.itemName} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ShoppingBag size={16} className="text-neutral-300" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium dark:text-white truncate">{item.itemName}</p>
                    {item.storeName && (
                      <p className="text-[11px] text-neutral-400">{item.storeName}</p>
                    )}
                    <div className="flex items-center justify-between mt-0.5">
                      <span className="text-xs text-neutral-500">Qty: {item.quantity}</span>
                      <span className="text-sm font-semibold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                        {numberFormat(item.totalPrice / 100, Currencies.NGN)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="border-t border-neutral-100 dark:border-neutral-700 pt-3 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">Subtotal</span>
                <span className="font-medium dark:text-white">
                  {numberFormat(cartTotal / 100, Currencies.NGN)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-neutral-500 dark:text-neutral-400">Delivery</span>
                <span className="font-medium text-green-500">Free</span>
              </div>
              <div className="border-t border-neutral-100 dark:border-neutral-700 pt-2">
                <div className="flex justify-between">
                  <span className="font-semibold dark:text-white">Total</span>
                  <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    {numberFormat(cartTotal / 100, Currencies.NGN)}
                  </span>
                </div>
              </div>
            </div>

            {/* Pay Button */}
            <motion.button
              whileHover={!isProcessing ? { scale: 1.02 } : undefined}
              whileTap={!isProcessing ? { scale: 0.98 } : undefined}
              onClick={handleSubmit}
              disabled={isProcessing}
              className="w-full mt-5 bg-gradient-to-r from-blue to-indigo-600 hover:from-blue hover:to-indigo-800 text-white py-3.5 rounded-lg font-semibold flex items-center justify-center gap-2 shadow-md shadow-blue/20 hover:shadow-lg transition-all disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Pay {numberFormat(cartTotal / 100, Currencies.NGN)}
                </>
              )}
            </motion.button>

            {/* Security note */}
            <div className="flex items-center justify-center gap-1.5 mt-3">
              <ShieldCheck size={13} className="text-emerald-500" />
              <span className="text-[11px] text-neutral-400">
                Secured by Paystack · SSL encrypted
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
