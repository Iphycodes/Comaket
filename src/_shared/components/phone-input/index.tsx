'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Search } from 'lucide-react';

// ═══════════════════════════════════════════════════════════════════════════
// COUNTRY CODES
// ═══════════════════════════════════════════════════════════════════════════

export interface CountryCode {
  name: string;
  code: string;
  iso: string;
  flag: string;
}

export const COUNTRY_CODES: CountryCode[] = [
  { name: 'Nigeria', code: '+234', iso: 'NG', flag: '🇳🇬' },
  { name: 'Ghana', code: '+233', iso: 'GH', flag: '🇬🇭' },
  { name: 'Kenya', code: '+254', iso: 'KE', flag: '🇰🇪' },
  { name: 'South Africa', code: '+27', iso: 'ZA', flag: '🇿🇦' },
  { name: 'Cameroon', code: '+237', iso: 'CM', flag: '🇨🇲' },
  { name: 'Tanzania', code: '+255', iso: 'TZ', flag: '🇹🇿' },
  { name: 'Uganda', code: '+256', iso: 'UG', flag: '🇺🇬' },
  { name: 'Rwanda', code: '+250', iso: 'RW', flag: '🇷🇼' },
  { name: 'Ethiopia', code: '+251', iso: 'ET', flag: '🇪🇹' },
  { name: 'Egypt', code: '+20', iso: 'EG', flag: '🇪🇬' },
  { name: 'Morocco', code: '+212', iso: 'MA', flag: '🇲🇦' },
  { name: 'Senegal', code: '+221', iso: 'SN', flag: '🇸🇳' },
  { name: 'Ivory Coast', code: '+225', iso: 'CI', flag: '🇨🇮' },
  { name: 'Benin', code: '+229', iso: 'BJ', flag: '🇧🇯' },
  { name: 'Togo', code: '+228', iso: 'TG', flag: '🇹🇬' },
  { name: 'Niger', code: '+227', iso: 'NE', flag: '🇳🇪' },
  { name: 'Mali', code: '+223', iso: 'ML', flag: '🇲🇱' },
  { name: 'Sierra Leone', code: '+232', iso: 'SL', flag: '🇸🇱' },
  { name: 'Liberia', code: '+231', iso: 'LR', flag: '🇱🇷' },
  { name: 'Gambia', code: '+220', iso: 'GM', flag: '🇬🇲' },
  { name: 'United Kingdom', code: '+44', iso: 'GB', flag: '🇬🇧' },
  { name: 'United States', code: '+1', iso: 'US', flag: '🇺🇸' },
  { name: 'Canada', code: '+1', iso: 'CA', flag: '🇨🇦' },
  { name: 'India', code: '+91', iso: 'IN', flag: '🇮🇳' },
  { name: 'China', code: '+86', iso: 'CN', flag: '🇨🇳' },
  { name: 'UAE', code: '+971', iso: 'AE', flag: '🇦🇪' },
  { name: 'Saudi Arabia', code: '+966', iso: 'SA', flag: '🇸🇦' },
  { name: 'Germany', code: '+49', iso: 'DE', flag: '🇩🇪' },
  { name: 'France', code: '+33', iso: 'FR', flag: '🇫🇷' },
  { name: 'Brazil', code: '+55', iso: 'BR', flag: '🇧🇷' },
  { name: 'Australia', code: '+61', iso: 'AU', flag: '🇦🇺' },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

/**
 * Format phone to international: strips leading 0, prepends code.
 * ("09076141362", "+234") → "+2349076141362"
 */
export const formatPhoneNumber = (localNumber: string, countryCode: string): string => {
  let digits = localNumber.replace(/[^0-9]/g, '');
  if (digits.startsWith('0')) digits = digits.substring(1);
  if (!digits) return '';
  return `${countryCode}${digits}`;
};

/**
 * Parse international phone string back to { countryCode, localNumber }.
 * "+2349076141362" → { countryCode: "+234", localNumber: "9076141362" }
 */
export const parsePhoneNumber = (phone: string): { countryCode: string; localNumber: string } => {
  if (!phone) return { countryCode: '+234', localNumber: '' };
  const cleaned = phone.replace(/[^0-9+]/g, '');

  // Try matching longest country code first
  const sorted = [...COUNTRY_CODES].sort((a, b) => b.code.length - a.code.length);
  for (const cc of sorted) {
    if (cleaned.startsWith(cc.code)) {
      return { countryCode: cc.code, localNumber: cleaned.substring(cc.code.length) };
    }
  }

  // If starts with 0, assume Nigeria local
  if (cleaned.startsWith('0')) {
    return { countryCode: '+234', localNumber: cleaned.substring(1) };
  }

  return { countryCode: '+234', localNumber: cleaned };
};

// ═══════════════════════════════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface PhoneInputProps {
  /** Full international phone string, e.g. "+2349076141362" */
  value: string;
  /** Called with the full formatted international string */
  onChange: (formattedPhone: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  defaultCountry?: string;
}

const PhoneInput: React.FC<PhoneInputProps> = ({
  value,
  onChange,
  placeholder = 'e.g. 9076141362',
  className = '',
  disabled = false,
  defaultCountry = 'NG',
}) => {
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');

  // Parse existing value
  const parsed = useMemo(() => parsePhoneNumber(value), [value]);
  const [selectedCode, setSelectedCode] = useState<string>(
    parsed.countryCode || COUNTRY_CODES.find((c) => c.iso === defaultCountry)?.code || '+234'
  );
  const [localNumber, setLocalNumber] = useState(parsed.localNumber || '');

  // Sync when external value changes
  useEffect(() => {
    const p = parsePhoneNumber(value);
    if (p.countryCode) setSelectedCode(p.countryCode);
    setLocalNumber(p.localNumber);
  }, [value]);

  const selectedCountry = COUNTRY_CODES.find((c) => c.code === selectedCode) || COUNTRY_CODES[0];

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return COUNTRY_CODES;
    const q = search.toLowerCase();
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) || c.code.includes(q) || c.iso.toLowerCase().includes(q)
    );
  }, [search]);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setLocalNumber(raw);
    onChange(formatPhoneNumber(raw, selectedCode));
  };

  const handleSelectCountry = (country: CountryCode) => {
    setSelectedCode(country.code);
    setOpen(false);
    setSearch('');
    onChange(formatPhoneNumber(localNumber, country.code));
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      {/* Country code button */}
      <div ref={dropdownRef} className="relative">
        <button
          type="button"
          onClick={() => !disabled && setOpen(!open)}
          disabled={disabled}
          className="flex items-center gap-1 px-3 h-11 bg-neutral-50 dark:bg-neutral-800 border border-r-0 border-neutral-200 dark:border-neutral-700 rounded-l-xl text-sm font-medium text-neutral-700 dark:text-neutral-300 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <span className="text-base leading-none">{selectedCountry.flag}</span>
          <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            {selectedCode}
          </span>
          <ChevronDown
            size={12}
            className={`text-neutral-400 transition-transform duration-200 ${
              open ? 'rotate-180' : ''
            }`}
          />
        </button>

        {open && (
          <div
            className="absolute z-50 top-full mt-1 left-0 w-64 bg-white dark:bg-neutral-800 rounded-xl border border-neutral-200 dark:border-neutral-700 shadow-xl shadow-black/10 dark:shadow-black/30 overflow-hidden"
            style={{ animation: 'phoneDropIn 0.15s ease-out' }}
          >
            <div className="p-2 border-b border-neutral-100 dark:border-neutral-700">
              <div className="relative">
                <Search
                  size={13}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search country..."
                  autoFocus
                  className="w-full h-8 pl-8 pr-3 text-xs rounded-lg border border-neutral-200 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-blue/30 focus:border-blue transition-all"
                />
              </div>
            </div>
            <div className="max-h-52 overflow-y-auto py-1">
              {filteredCountries.length === 0 ? (
                <p className="text-xs text-neutral-400 text-center py-4">No countries found</p>
              ) : (
                filteredCountries.map((country) => (
                  <button
                    key={`${country.iso}-${country.code}`}
                    type="button"
                    onClick={() => handleSelectCountry(country)}
                    className={`w-full flex items-center gap-2.5 px-3 py-2 text-left text-sm hover:bg-neutral-50 dark:hover:bg-neutral-700/50 transition-colors ${
                      country.code === selectedCode && country.iso === selectedCountry.iso
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue font-medium'
                        : 'text-neutral-700 dark:text-neutral-300'
                    }`}
                  >
                    <span className="text-base leading-none">{country.flag}</span>
                    <span className="flex-1 truncate text-xs">{country.name}</span>
                    <span className="text-[11px] text-neutral-400 font-mono flex-shrink-0">
                      {country.code}
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {/* Number input */}
      <input
        type="tel"
        inputMode="numeric"
        value={localNumber}
        onChange={handleLocalChange}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 h-11 px-3 border border-neutral-200 dark:border-neutral-700 rounded-r-xl bg-white dark:bg-neutral-800 text-sm text-neutral-900 dark:text-white placeholder-neutral-400 outline-none focus:ring-2 focus:ring-blue/20 focus:border-blue transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />

      <style jsx>{`
        @keyframes phoneDropIn {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};

export default PhoneInput;
