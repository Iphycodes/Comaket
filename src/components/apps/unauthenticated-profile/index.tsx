'use client';

import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { LogIn, ShoppingBag, Heart, User, Sparkles } from 'lucide-react';
import { AppContext } from '@grc/app-context';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

const features = [
  { icon: ShoppingBag, label: 'Track your orders' },
  { icon: Heart, label: 'Save items you love' },
  { icon: Sparkles, label: 'Become a creator & sell' },
];

const UnauthenticatedProfile: React.FC = () => {
  const { setIsAuthModalOpen } = useContext(AppContext);
  const isMobile = useMediaQuery(mediaSize.mobile);

  return (
    <div
      className={`dark:bg-neutral-900/50 min-h-[80vh] flex items-center justify-center ${
        isMobile ? 'px-5 mb-14 pt-8' : 'px-4'
      }`}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="w-full max-w-sm text-center"
      >
        {/* Avatar placeholder */}
        <div className="relative mx-auto mb-6 w-24 h-24">
          <div className="w-full h-full rounded-full bg-gradient-to-br from-neutral-100 to-neutral-50 dark:from-neutral-800 dark:to-neutral-800/60 border-2 border-dashed border-neutral-200 dark:border-neutral-700 flex items-center justify-center">
            <User size={36} className="text-neutral-300 dark:text-neutral-600" strokeWidth={1.5} />
          </div>
        </div>

        {/* Text */}
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white mb-1.5">
          Welcome to Comaket
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 leading-relaxed mb-6">
          Sign in to access your profile, manage orders, and explore everything the marketplace has
          to offer.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {features.map(({ icon: Icon, label }) => (
            <span
              key={label}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-neutral-50 dark:bg-neutral-800/70 rounded-full text-xs font-medium text-neutral-500 dark:text-neutral-400 border border-neutral-100 dark:border-neutral-700/60"
            >
              <Icon size={13} />
              {label}
            </span>
          ))}
        </div>

        {/* Sign in button */}
        <button
          onClick={() => setIsAuthModalOpen(true)}
          className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <LogIn size={16} />
          Sign In
        </button>

        <p className="text-[11px] text-neutral-400 dark:text-neutral-500 mt-3">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="text-blue hover:underline font-medium"
          >
            Create one
          </button>
        </p>
      </motion.div>
    </div>
  );
};

export default UnauthenticatedProfile;
