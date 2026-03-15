'use client';

import React, { useState, useContext, Suspense } from 'react';
import { motion } from 'framer-motion';
import { Input } from 'antd';
import { ArrowRight, CheckCircle, Eye, EyeOff, KeyRound, Lock, ShieldCheck } from 'lucide-react';
import { useSearchParams } from 'next/navigation';
import { useAuth } from '@grc/hooks/useAuth';
import { AppContext } from '@grc/app-context';

// ═══════════════════════════════════════════════════════════════════════════
// PASSWORD INPUT (inline to avoid import issues)
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
        className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none"
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
        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 transition-colors z-10"
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
  'bg-neutral-200 dark:bg-neutral-700',
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
              i <= strength ? strengthColors[strength] : 'bg-neutral-200 dark:bg-neutral-700'
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
// FLOATING SHAPES
// ═══════════════════════════════════════════════════════════════════════════

const FloatingShapes = () => (
  <div className="absolute inset-0 overflow-hidden pointer-events-none">
    <motion.div
      animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
      transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      className="absolute -top-20 -right-20 w-56 h-56 rounded-full bg-gradient-to-br from-blue/10 to-indigo-500/10 blur-3xl"
    />
    <motion.div
      animate={{ y: [0, 15, 0], rotate: [0, -8, 0] }}
      transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      className="absolute -bottom-20 -left-20 w-48 h-48 rounded-full bg-gradient-to-br from-violet-500/10 to-purple-500/10 blur-3xl"
    />
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// RESET PASSWORD CONTENT
// ═══════════════════════════════════════════════════════════════════════════

const ResetPasswordContent = () => {
  const searchParams = useSearchParams();
  const token = searchParams?.get('token') ?? '';
  const { resetPassword, isResettingPassword } = useAuth();
  const { setIsAuthModalOpen } = useContext(AppContext);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!password) errs.password = 'Password is required';
    else if (password.length < 8) errs.password = 'Password must be at least 8 characters';
    if (!confirmPassword) errs.confirmPassword = 'Please confirm your password';
    else if (password !== confirmPassword) errs.confirmPassword = 'Passwords do not match';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitError('');

    try {
      await resetPassword({ token, newPassword: password });
      setIsSuccess(true);
    } catch (error: any) {
      const msg =
        error?.data?.message ||
        error?.data?.meta?.error?.message ||
        error?.message ||
        'Failed to reset password. The link may have expired.';
      setSubmitError(msg);
    }
  };

  // ── No token ────────────────────────────────────────────────────────
  if (!token) {
    return (
      <div className="h-screen overflow-hidden flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 relative">
        <FloatingShapes />
        <div className="relative z-10 w-full max-w-md mx-4">
          <div className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-900/30 flex items-center justify-center mx-auto mb-4">
              <ShieldCheck size={28} className="text-red-500" />
            </div>
            <h1 className="text-xl font-bold text-neutral-900 dark:text-white">
              Invalid Reset Link
            </h1>
            <p className="text-sm text-neutral-500 mt-2 leading-relaxed">
              This password reset link is invalid or has expired. Please request a new one.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-6 px-6 py-3 rounded-xl text-sm font-semibold bg-gradient-to-r from-blue to-indigo-600 text-white shadow-md hover:shadow-lg transition-all"
            >
              Back to Sign In
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Success ─────────────────────────────────────────────────────────
  if (isSuccess) {
    return (
      <div className="h-screen overflow-hidden flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 relative">
        <FloatingShapes />
        <div className="relative z-10 w-full max-w-md mx-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 p-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
              className="w-20 h-20 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto mb-5 shadow-lg shadow-emerald-400/25"
            >
              <CheckCircle size={36} className="text-white" />
            </motion.div>
            <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Password Reset!</h1>
            <p className="text-sm text-neutral-500 mt-2 leading-relaxed max-w-[280px] mx-auto">
              Your password has been successfully changed. You can now sign in with your new
              password.
            </p>
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="mt-6 w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-indigo-600 hover:from-blue hover:to-indigo-700 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all"
            >
              Sign In
              <ArrowRight size={16} />
            </button>
          </motion.div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────────────
  return (
    <div className="h-screen overflow-hidden flex items-center justify-center bg-neutral-50 dark:bg-neutral-950 relative py-10">
      <FloatingShapes />
      <div className="relative z-10 w-full max-w-md mx-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-neutral-900 rounded-2xl shadow-xl border border-neutral-100 dark:border-neutral-800 p-8"
        >
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Header */}
            <div className="text-center space-y-3">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
                className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue to-indigo-600 flex items-center justify-center mx-auto shadow-lg shadow-blue/25"
              >
                <KeyRound size={28} className="text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">
                  Set new password
                </h1>
                <p className="text-sm text-neutral-500 mt-1">
                  Choose a strong password for your account
                </p>
              </div>
            </div>

            {/* Error */}
            {submitError && (
              <motion.div
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3"
              >
                <p className="text-sm text-red-600 dark:text-red-400">{submitError}</p>
              </motion.div>
            )}

            {/* New Password */}
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                New Password
              </label>
              <PasswordInput
                value={password}
                onChange={(v) => {
                  setPassword(v);
                  errors.password && setErrors((p) => ({ ...p, password: '' }));
                }}
                placeholder="Min. 8 characters"
              />
              {errors.password && (
                <p className="text-[11px] text-red-400 mt-1">{errors.password}</p>
              )}
              <div className="mt-2">
                <PasswordStrength password={password} />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1.5 block">
                Confirm Password
              </label>
              <PasswordInput
                value={confirmPassword}
                onChange={(v) => {
                  setConfirmPassword(v);
                  errors.confirmPassword && setErrors((p) => ({ ...p, confirmPassword: '' }));
                }}
                placeholder="Re-enter your password"
              />
              {errors.confirmPassword && (
                <p className="text-[11px] text-red-400 mt-1">{errors.confirmPassword}</p>
              )}
              {/* Match indicator */}
              {confirmPassword && password && confirmPassword === password && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-[11px] text-emerald-500 font-medium mt-1 flex items-center gap-1"
                >
                  <CheckCircle size={11} />
                  Passwords match
                </motion.p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={isResettingPassword}
              className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-blue to-indigo-600 hover:from-blue hover:to-indigo-700 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all disabled:opacity-60"
            >
              {isResettingPassword ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Resetting...
                </>
              ) : (
                <>
                  Reset Password
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </motion.div>

        {/* Bottom note */}
        <p className="text-center text-[11px] text-neutral-400 mt-4">
          Remembered your password?{' '}
          <button
            onClick={() => setIsAuthModalOpen(true)}
            className="font-medium text-blue  transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE WRAPPER (with Suspense for useSearchParams)
// ═══════════════════════════════════════════════════════════════════════════

const ResetPasswordPage = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-neutral-50 dark:bg-neutral-950">
          <div className="w-8 h-8 border-3 border-blue/30 border-t-blue rounded-full animate-spin" />
        </div>
      }
    >
      <ResetPasswordContent />
    </Suspense>
  );
};

export default ResetPasswordPage;
