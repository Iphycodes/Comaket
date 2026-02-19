'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Package, CheckCircle, Clock, AlertTriangle } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import SellItem from '@grc/components/apps/sell-item';

// ═══════════════════════════════════════════════════════════════════════════
// METRIC CARDS
// ═══════════════════════════════════════════════════════════════════════════

interface MiniMetric {
  label: string;
  value: string;
  icon: React.ElementType;
  iconColor: string;
  iconBg: string;
}

const metrics: MiniMetric[] = [
  {
    label: 'Total Products',
    value: '24',
    icon: Package,
    iconColor: 'text-blue',
    iconBg: 'bg-blue-50 dark:bg-blue-900/20',
  },
  {
    label: 'Live',
    value: '18',
    icon: CheckCircle,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 dark:bg-emerald-900/20',
  },
  {
    label: 'In Review',
    value: '3',
    icon: Clock,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 dark:bg-amber-900/20',
  },
  {
    label: 'Sold Out',
    value: '2',
    icon: AlertTriangle,
    iconColor: 'text-red-500',
    iconBg: 'bg-red-50 dark:bg-red-900/20',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// MAIN COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

interface StoreProductsProps {
  storeId: string;
}

const StoreProducts: React.FC<StoreProductsProps> = ({}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  return (
    <div className="space-y-5">
      {/* Metrics Strip */}
      <div className={`grid gap-3 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
        {metrics.map((m, i) => (
          <motion.div
            key={m.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50 flex items-center gap-3"
          >
            <div
              className={`w-9 h-9 rounded-lg ${m.iconBg} flex items-center justify-center flex-shrink-0`}
            >
              <m.icon size={16} className={m.iconColor} />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{m.value}</p>
              <p className="text-[11px] text-gray-500">{m.label}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* SellItem Component — reused as-is */}
      <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden">
        <SellItem />
      </div>
    </div>
  );
};

export default StoreProducts;
