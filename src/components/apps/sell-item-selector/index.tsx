'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Store, Handshake, BadgeDollarSign, ArrowRight, Shield, Clock, Zap } from 'lucide-react';
import { SellingModel } from '@grc/_shared/namespace/sell-item';
import { useGetPlatformSettingsQuery } from '@grc/services/payments';

interface SellTypeSelectorProps {
  onSelect: (model: SellingModel) => void;
  selected?: SellingModel;
}

const sellOptions: {
  model: SellingModel;
  title: string;
  subtitle: string;
  description: string;
  icon: React.ElementType;
  accentIcon: React.ElementType;
  features: string[];
  fee: string;
  gradient: string;
  accentColor: string;
  bgPattern: string;
}[] = [
  {
    model: 'self-listing',
    title: 'Self Listing',
    subtitle: 'List & Sell Yourself',
    description:
      'List your item on the marketplace and manage sales yourself. You handle enquiries, negotiations, and delivery directly with buyers.',
    icon: Store,
    accentIcon: Zap,
    features: [
      'Full control over your listing',
      'Communicate directly with buyers',
      'Set your own price & terms',
      'Item goes live after fee payment',
    ],
    fee: '__SELF_FEE__',
    gradient: 'from-blue to-indigo-600',
    accentColor: 'blue',
    bgPattern: 'radial-gradient(circle at 80% 20%, rgba(99,102,241,0.08) 0%, transparent 50%)',
  },
  {
    model: 'consignment',
    title: 'Consignment',
    subtitle: 'We Sell For You',
    description:
      'Hand over your item to us and we handle everything — listing, pricing, buyer communication, and delivery. You get paid when it sells.',
    icon: Handshake,
    accentIcon: Shield,
    features: [
      'Zero upfront cost',
      'We handle everything',
      '__CONSIGNMENT_SELLER_CUT__',
      'Professional product photography',
    ],
    fee: '__CONSIGNMENT_FEE__',
    gradient: 'from-violet-500 to-purple-600',
    accentColor: 'violet',
    bgPattern: 'radial-gradient(circle at 20% 80%, rgba(139,92,246,0.08) 0%, transparent 50%)',
  },
  {
    model: 'direct-sale',
    title: 'Sell To Us',
    subtitle: 'Instant Cash Offer',
    description:
      'Sell your item directly to Comaket. Submit your item for review and receive a price offer from us. Accept, counter, or decline — your choice.',
    icon: BadgeDollarSign,
    accentIcon: Clock,
    features: [
      'Get paid fast — no waiting for a buyer',
      'We make you a fair offer',
      'Negotiate if you want more',
      'Hassle-free, no listing needed',
    ],
    fee: 'No fees — we buy from you',
    gradient: 'from-emerald-500 to-teal-600',
    accentColor: 'emerald',
    bgPattern: 'radial-gradient(circle at 50% 10%, rgba(16,185,129,0.08) 0%, transparent 50%)',
  },
];

const SellTypeSelector: React.FC<SellTypeSelectorProps> = ({ onSelect, selected }) => {
  const { data: platformSettingsData } = useGetPlatformSettingsQuery();
  const ps = platformSettingsData?.data || {};
  const selfFeePercent = ps.selfListingFeePercent ?? 5;
  const consignmentPercent = ps.consignmentCommissionPercent ?? 15;

  // Replace placeholders with dynamic values
  const options = sellOptions.map((opt) => ({
    ...opt,
    fee: opt.fee
      .replace('__SELF_FEE__', `${selfFeePercent}% listing fee`)
      .replace('__CONSIGNMENT_FEE__', `${consignmentPercent}% commission on sale`),
    features: opt.features.map((f) =>
      f.replace('__CONSIGNMENT_SELLER_CUT__', `You get ${100 - consignmentPercent}% when it sells`)
    ),
  }));

  return (
    <div className="space-y-4">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-white">
          How would you like to sell?
        </h3>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
          Choose the selling method that works best for you
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {options.map((option, index) => {
          const Icon = option.icon;
          const AccentIcon = option.accentIcon;
          const isSelected = selected === option.model;

          return (
            <motion.button
              key={option.model}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.35, ease: 'easeOut' }}
              whileHover={{ scale: 1.01, y: -2 }}
              whileTap={{ scale: 0.995 }}
              onClick={() => onSelect(option.model)}
              className={`
                relative w-full text-left rounded-2xl border-2 p-5 transition-all duration-200 overflow-hidden
                ${
                  isSelected
                    ? `border-${option.accentColor}-500 bg-white dark:bg-neutral-800 shadow-lg shadow-${option.accentColor}-500/10`
                    : 'border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 hover:border-neutral-300 dark:hover:border-neutral-600 hover:shadow-md'
                }
              `}
              style={{ background: isSelected ? option.bgPattern : undefined }}
            >
              {/* Selected indicator */}
              {isSelected && (
                <motion.div
                  layoutId="sell-type-indicator"
                  className={`absolute top-0 left-0 w-1.5 h-full bg-gradient-to-b ${option.gradient} rounded-l-2xl`}
                  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                />
              )}

              <div className="flex items-start gap-4">
                {/* Icon */}
                <div
                  className={`
                  flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center
                  ${
                    isSelected
                      ? `bg-gradient-to-br ${option.gradient} text-white shadow-md`
                      : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-500 dark:text-neutral-400'
                  }
                  transition-all duration-200
                `}
                >
                  <Icon size={22} />
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-semibold text-neutral-900 dark:text-white text-base">
                        {option.title}
                      </h4>
                      <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                        {option.subtitle}
                      </p>
                    </div>
                    <motion.div
                      animate={{ x: isSelected ? 0 : -4, opacity: isSelected ? 1 : 0.4 }}
                      className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                        isSelected
                          ? `bg-gradient-to-br ${option.gradient} text-white`
                          : 'bg-neutral-100 dark:bg-neutral-700 text-neutral-400'
                      }`}
                    >
                      <ArrowRight size={16} />
                    </motion.div>
                  </div>

                  <p className="text-sm text-neutral-600 dark:text-neutral-300 mt-2 leading-relaxed">
                    {option.description}
                  </p>

                  {/* Features */}
                  <div className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1.5">
                    {option.features.map((feature, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400"
                      >
                        <div
                          className={`w-1 h-1 rounded-full flex-shrink-0 ${
                            isSelected
                              ? `bg-${option.accentColor}-500`
                              : 'bg-neutral-300 dark:bg-neutral-600'
                          }`}
                        />
                        <span className="truncate">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Fee badge */}
                  <div className="mt-3 flex items-center gap-2">
                    <AccentIcon size={13} className="text-neutral-400" />
                    <span
                      className={`text-xs font-semibold ${
                        isSelected
                          ? `text-${option.accentColor}-600 dark:text-${option.accentColor}-400`
                          : 'text-neutral-500'
                      }`}
                    >
                      {option.fee}
                    </span>
                  </div>
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};

export default SellTypeSelector;
