'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from 'antd';
import { ArrowRight, Eye, EyeOff, Lock, Mail, Sparkles, User, X } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type AuthView = 'login' | 'signup';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: AuthView;
  onLogin: (data: { email: string; password: string }) => void;
  onSignup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// FLOATING SHAPES (Decorative background)
// ═══════════════════════════════════════════════════════════════════════════

const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-gradient-to-br from-blue/10 to-indigo-500/10 blur-2xl"
    />
    <motion.div
      animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 blur-2xl"
    />
    <motion.div
      animate={{ x: [0, 10, 0] }}
      transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
      className="absolute top-1/3 -left-6 w-24 h-24 rounded-full bg-gradient-to-br from-amber-400/8 to-orange-400/8 blur-xl"
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// PASSWORD INPUT
// ═══════════════════════════════════════════════════════════════════════════

const PasswordInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (val: string) => void;
  placeholder: string;
}) => {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Lock
        size={16}
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
      />
      <Input
        type={visible ? 'text' : 'password'}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="!rounded-xl h-12 !pl-10 !pr-10 !text-base"
      />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors z-10"
      >
        {visible ? <EyeOff size={16} /> : <Eye size={16} />}
      </button>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PASSWORD STRENGTH
// ═══════════════════════════════════════════════════════════════════════════

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^a-zA-Z0-9]/.test(password)) score++;
  return score;
};

const strengthLabels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
const strengthColors = [
  'bg-gray-200 dark:bg-gray-700',
  'bg-red-400',
  'bg-amber-400',
  'bg-blue',
  'bg-emerald-400',
];

const PasswordStrength = ({ password }: { password: string }) => {
  const strength = getPasswordStrength(password);
  if (!password) return null;

  return (
    <div className="space-y-1.5">
      <div className="flex gap-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-all duration-300 ${
              i <= strength ? strengthColors[strength] : 'bg-gray-200 dark:bg-gray-700'
            }`}
          />
        ))}
      </div>
      <p
        className={`text-[11px] font-medium ${
          strength <= 1
            ? 'text-red-400'
            : strength === 2
              ? 'text-amber-500'
              : strength === 3
                ? 'text-blue'
                : 'text-emerald-500'
        }`}
      >
        {strengthLabels[strength]}
      </p>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SIGNUP FORM
// ═══════════════════════════════════════════════════════════════════════════

const SignupForm = ({
  onSubmit,
  onSwitchToLogin,
  isSubmitting,
}: {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  onSwitchToLogin: () => void;
  isSubmitting: boolean;
}) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!firstName.trim()) errs.firstName = 'First name is required';
    if (!lastName.trim()) errs.lastName = 'Last name is required';
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      email: email.trim().toLowerCase(),
      password,
    });
  };

  const isMobile = useMediaQuery(mediaSize.mobile);

  return (
    <motion.form
      key="signup"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue/25"
        >
          <Sparkles size={24} className="text-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Create your account</h2>
        <p className="text-sm text-gray-500">Join the Comaket community</p>
      </div>

      {/* Name fields */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
            First Name
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
            />
            <Input
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                errors.firstName && setErrors((p) => ({ ...p, firstName: '' }));
              }}
              placeholder="First name"
              className="!rounded-xl h-12 !pl-10 !text-base"
              status={errors.firstName ? 'error' : undefined}
            />
          </div>
          {errors.firstName && <p className="text-[11px] text-red-400 mt-1">{errors.firstName}</p>}
        </div>
        <div>
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
            Last Name
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
            />
            <Input
              value={lastName}
              onChange={(e) => {
                setLastName(e.target.value);
                errors.lastName && setErrors((p) => ({ ...p, lastName: '' }));
              }}
              placeholder="Last name"
              className="!rounded-xl h-12 !pl-10 !text-base"
              status={errors.lastName ? 'error' : undefined}
            />
          </div>
          {errors.lastName && <p className="text-[11px] text-red-400 mt-1">{errors.lastName}</p>}
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
          Email
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              errors.email && setErrors((p) => ({ ...p, email: '' }));
            }}
            placeholder="you@example.com"
            className="!rounded-xl h-12 !pl-10 !text-base"
            status={errors.email ? 'error' : undefined}
          />
        </div>
        {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
          Password
        </label>
        <PasswordInput
          value={password}
          onChange={(v) => {
            setPassword(v);
            errors.password && setErrors((p) => ({ ...p, password: '' }));
          }}
          placeholder="Min. 8 characters"
        />
        {errors.password && <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>}
        <div className="mt-2">
          <PasswordStrength password={password} />
        </div>
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-indigo-600 hover:from-blue hover:to-indigo-700 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Creating account...
          </>
        ) : (
          <>
            Create Account
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-gray-900 px-3 text-gray-400">or</span>
        </div>
      </div>

      {/* Switch to login */}
      <p className="text-center text-sm text-gray-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-blue hover:text-blue transition-colors"
        >
          Sign in
        </button>
      </p>
    </motion.form>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// LOGIN FORM
// ═══════════════════════════════════════════════════════════════════════════

const LoginForm = ({
  onSubmit,
  onSwitchToSignup,
  isSubmitting,
}: {
  onSubmit: (data: { email: string; password: string }) => void;
  onSwitchToSignup: () => void;
  isSubmitting: boolean;
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!email.trim()) errs.email = 'Email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errs.email = 'Enter a valid email';
    if (!password) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    onSubmit({ email: email.trim().toLowerCase(), password });
  };

  return (
    <motion.form
      key="login"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Header */}
      <div className="text-center space-y-2">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue/25"
        >
          <Lock size={24} className="text-white" />
        </motion.div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Welcome back</h2>
        <p className="text-sm text-gray-500">Sign in to your Comaket account</p>
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1 block">
          Email
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 z-10 pointer-events-none"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              errors.email && setErrors((p) => ({ ...p, email: '' }));
            }}
            placeholder="you@example.com"
            className="!rounded-xl h-12 !pl-10 !text-base"
            status={errors.email ? 'error' : undefined}
          />
        </div>
        {errors.email && <p className="text-[11px] text-red-400 mt-1">{errors.email}</p>}
      </div>

      {/* Password */}
      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">Password</label>
          <button
            type="button"
            className="text-[11px] font-medium text-blue hover:text-blue transition-colors"
          >
            Forgot password?
          </button>
        </div>
        <PasswordInput
          value={password}
          onChange={(v) => {
            setPassword(v);
            errors.password && setErrors((p) => ({ ...p, password: '' }));
          }}
          placeholder="Enter your password"
        />
        {errors.password && <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-indigo-600 hover:from-blue hover:to-indigo-700 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Signing in...
          </>
        ) : (
          <>
            Sign In
            <ArrowRight size={16} />
          </>
        )}
      </button>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200 dark:border-gray-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-gray-900 px-3 text-gray-400">or</span>
        </div>
      </div>

      {/* Switch to signup */}
      <p className="text-center text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-blue hover:text-blue transition-colors"
        >
          Create one
        </button>
      </p>
    </motion.form>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// AUTH MODAL — Desktop modal / Mobile full-screen
// ═══════════════════════════════════════════════════════════════════════════

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = 'login',
  onLogin,
  onSignup,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [view, setView] = useState<AuthView>(initialView);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset view when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setIsSubmitting(false);
    }
  }, [isOpen, initialView]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  const handleLogin = useCallback(
    async (data: { email: string; password: string }) => {
      setIsSubmitting(true);
      try {
        await onLogin(data);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onLogin]
  );

  const handleSignup = useCallback(
    async (data: { firstName: string; lastName: string; email: string; password: string }) => {
      setIsSubmitting(true);
      try {
        await onSignup(data);
      } finally {
        setIsSubmitting(false);
      }
    },
    [onSignup]
  );

  // ── MOBILE: Full-screen view ──────────────────────────────────────

  if (isMobile) {
    return (
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: '100%' }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 300 }}
            className="fixed inset-0 z-[10000] bg-white dark:bg-gray-900 flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800">
              <span className="text-sm font-semibold text-gray-400">
                {view === 'login' ? 'Sign In' : 'Sign Up'}
              </span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={18} className="text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 relative">
              <FloatingShapes />
              <div className="relative z-10">
                <AnimatePresence mode="wait">
                  {view === 'signup' ? (
                    <SignupForm
                      key="signup"
                      onSubmit={handleSignup}
                      onSwitchToLogin={() => setView('login')}
                      isSubmitting={isSubmitting}
                    />
                  ) : (
                    <LoginForm
                      key="login"
                      onSubmit={handleLogin}
                      onSwitchToSignup={() => setView('signup')}
                      isSubmitting={isSubmitting}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom brand */}
            <div className="px-5 py-4 border-t border-gray-100 dark:border-gray-800">
              <p className="text-center text-[11px] text-gray-400">
                By continuing, you agree to Comaket&apos;s Terms of Service & Privacy Policy
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  // ── DESKTOP: Centered modal ───────────────────────────────────────

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Modal card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-md mx-4 bg-white dark:bg-gray-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Decorative shapes */}
            <FloatingShapes />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <X size={16} className="text-gray-400" />
            </button>

            {/* Form content */}
            <div className="relative z-10 px-8 py-8">
              <AnimatePresence mode="wait">
                {view === 'signup' ? (
                  <SignupForm
                    key="signup"
                    onSubmit={handleSignup}
                    onSwitchToLogin={() => setView('login')}
                    isSubmitting={isSubmitting}
                  />
                ) : (
                  <LoginForm
                    key="login"
                    onSubmit={handleLogin}
                    onSwitchToSignup={() => setView('signup')}
                    isSubmitting={isSubmitting}
                  />
                )}
              </AnimatePresence>
            </div>

            {/* Bottom terms */}
            <div className="px-8 pb-6">
              <p className="text-center text-[11px] text-gray-400">
                By continuing, you agree to Comaket&apos;s Terms of Service & Privacy Policy
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
