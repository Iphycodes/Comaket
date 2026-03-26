'use client';

import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from 'antd';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  MailCheck,
  RefreshCw,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useAuth } from '@grc/hooks/useAuth';
import { GoogleAuthButton } from './lib/google-auth-btn';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type AuthView = 'login' | 'signup' | 'verify-email' | 'forgot-password';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: 'login' | 'signup';
  // onAuthSuccess?: () => void;
}

// ═══════════════════════════════════════════════════════════════════════════
// GOOGLE ICON
// ═══════════════════════════════════════════════════════════════════════════

// ═══════════════════════════════════════════════════════════════════════════
// FLOATING SHAPES
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
// OTP INPUT — 6 individual digit boxes
// ═══════════════════════════════════════════════════════════════════════════

const OtpInput = ({
  length = 6,
  onComplete,
  disabled = false,
  error = false,
}: {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
  error?: boolean;
}) => {
  const [values, setValues] = useState<string[]>(Array(length).fill(''));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset values when error changes or disabled changes
  useEffect(() => {
    if (error) {
      setValues(Array(length).fill(''));
      inputRefs.current[0]?.focus();
    }
  }, [error, length]);

  const focusInput = (index: number) => {
    if (index >= 0 && index < length) {
      inputRefs.current[index]?.focus();
      inputRefs.current[index]?.select();
    }
  };

  const handleChange = (index: number, value: string) => {
    // Only allow single digit
    const digit = value.replace(/[^0-9]/g, '').slice(-1);
    const newValues = [...values];
    newValues[index] = digit;
    setValues(newValues);

    if (digit && index < length - 1) {
      focusInput(index + 1);
    }

    // Auto-submit when all filled
    const otp = newValues.join('');
    if (otp.length === length && !newValues.includes('')) {
      onComplete(otp);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (!values[index] && index > 0) {
        // Move to previous and clear it
        const newValues = [...values];
        newValues[index - 1] = '';
        setValues(newValues);
        focusInput(index - 1);
        e.preventDefault();
      } else {
        // Clear current
        const newValues = [...values];
        newValues[index] = '';
        setValues(newValues);
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1);
      e.preventDefault();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      focusInput(index + 1);
      e.preventDefault();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData
      .getData('text')
      .replace(/[^0-9]/g, '')
      .slice(0, length);
    if (!pasted) return;

    const newValues = [...values];
    for (let i = 0; i < pasted.length; i++) {
      newValues[i] = pasted[i];
    }
    setValues(newValues);

    // Focus the next empty or last
    const nextEmpty = newValues.findIndex((v) => !v);
    focusInput(nextEmpty >= 0 ? nextEmpty : length - 1);

    // Auto-submit if complete
    if (pasted.length === length) {
      onComplete(pasted);
    }
  };

  return (
    <div className="flex gap-2.5 justify-center">
      {Array.from({ length }).map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
        >
          <input
            ref={(el) => {
              inputRefs.current[i] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={values[i]}
            disabled={disabled}
            onChange={(e) => handleChange(i, e.target.value)}
            onKeyDown={(e) => handleKeyDown(i, e)}
            onPaste={i === 0 ? handlePaste : undefined}
            onFocus={(e) => e.target.select()}
            className={`w-12 h-14 text-center text-xl font-bold rounded-xl border-2 outline-none transition-all duration-200 bg-white dark:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed ${
              error
                ? 'border-red-400 text-red-500 shake'
                : values[i]
                  ? 'border-blue text-neutral-900 dark:text-white shadow-sm shadow-blue/10'
                  : 'border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white focus:border-blue focus:shadow-sm focus:shadow-blue/10'
            }`}
            style={{ caretColor: 'transparent', fontSize: '16px' }}
          />
        </motion.div>
      ))}
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// RESEND COUNTDOWN
// ═══════════════════════════════════════════════════════════════════════════

const useResendCountdown = (seconds: number = 30) => {
  const [countdown, setCountdown] = useState(seconds);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    if (!isActive) return;
    if (countdown <= 0) {
      setIsActive(false);
      return;
    }
    const timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown, isActive]);

  const restart = () => {
    setCountdown(seconds);
    setIsActive(true);
  };

  return { countdown, canResend: !isActive, restart };
};

// ═══════════════════════════════════════════════════════════════════════════
// VERIFY EMAIL VIEW
// ═══════════════════════════════════════════════════════════════════════════

const VerifyEmailView = ({
  email,
  onVerify,
  onResend,
  onBack,
  isVerifying,
  isResending,
}: {
  email: string;
  onVerify: (otp: string) => void;
  onResend: () => void;
  onBack: () => void;
  isVerifying: boolean;
  isResending: boolean;
}) => {
  const [otpError, setOtpError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const { countdown, canResend, restart } = useResendCountdown(30);

  const handleComplete = (otp: string) => {
    setOtpError(false);
    setErrorMessage('');
    onVerify(otp);
  };

  const handleResend = () => {
    if (!canResend || isResending) return;
    onResend();
    restart();
  };

  // Mask email: e****@example.com
  const maskedEmail = email
    ? email.replace(/^(.)(.*)(@.+)$/, (_, first, middle, domain) => {
        return first + '*'.repeat(Math.min(middle.length, 4)) + domain;
      })
    : '';

  return (
    <motion.div
      key="verify-email"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Back button */}
      <button
        type="button"
        onClick={onBack}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors -mb-2"
      >
        <ArrowLeft size={16} />
        Back
      </button>

      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-400/25"
        >
          <MailCheck size={28} className="text-white" />
        </motion.div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Verify your email</h2>
          <p className="text-sm text-neutral-500 mt-1">
            We sent a 6-digit code to{' '}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">
              {maskedEmail}
            </span>
          </p>
        </div>
      </div>

      {/* OTP Input */}
      <div className="py-2">
        <OtpInput onComplete={handleComplete} disabled={isVerifying} error={otpError} />
        {errorMessage && (
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center text-sm text-red-500 mt-3"
          >
            {errorMessage}
          </motion.p>
        )}
      </div>

      {/* Verifying indicator */}
      {isVerifying && (
        <div className="flex items-center justify-center gap-2 text-sm text-blue">
          <div className="w-4 h-4 border-2 border-blue/30 border-t-blue rounded-full animate-spin" />
          Verifying...
        </div>
      )}

      {/* Resend */}
      <div className="text-center">
        <p className="text-sm text-neutral-500">
          Didn&apos;t receive the code?{' '}
          {canResend ? (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-blue  transition-colors inline-flex items-center gap-1"
            >
              {isResending ? (
                <>
                  <RefreshCw size={13} className="animate-spin" />
                  Sending...
                </>
              ) : (
                'Resend code'
              )}
            </button>
          ) : (
            <span className="font-medium text-neutral-400">
              Resend in{' '}
              <span className="tabular-nums text-neutral-600 dark:text-neutral-300">
                {countdown}s
              </span>
            </span>
          )}
        </p>
      </div>

      {/* Help text */}
      <p className="text-center text-[11px] text-neutral-400 leading-relaxed">
        Check your spam folder if you don&apos;t see the email. The code expires in 10 minutes.
      </p>
    </motion.div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// FORGOT PASSWORD VIEW
// ═══════════════════════════════════════════════════════════════════════════

const ForgotPasswordView = ({
  onSubmit,
  onBackToLogin,
  isSubmitting,
}: {
  onSubmit: (email: string) => void;
  onBackToLogin: () => void;
  isSubmitting: boolean;
}) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email is required');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Enter a valid email');
      return;
    }
    setError('');
    onSubmit(email.trim().toLowerCase());
    setSent(true);
  };

  if (sent && !isSubmitting) {
    return (
      <motion.div
        key="forgot-sent"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="space-y-6 text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.15, type: 'spring', stiffness: 200 }}
          className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-400/25"
        >
          <CheckCircle size={30} className="text-white" />
        </motion.div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Check your email</h2>
          <p className="text-sm text-neutral-500 mt-2 leading-relaxed max-w-[280px] mx-auto">
            We&apos;ve sent a password reset link to{' '}
            <span className="font-medium text-neutral-700 dark:text-neutral-300">{email}</span>
          </p>
        </div>
        <div className="space-y-3">
          <button
            type="button"
            onClick={() => {
              setSent(false);
              setEmail('');
            }}
            className="text-sm text-blue  font-medium transition-colors"
          >
            Try a different email
          </button>
          <div>
            <button
              type="button"
              onClick={onBackToLogin}
              className="flex items-center gap-1.5 mx-auto text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
            >
              <ArrowLeft size={14} />
              Back to sign in
            </button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.form
      key="forgot-password"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {/* Back */}
      <button
        type="button"
        onClick={onBackToLogin}
        className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors -mb-2"
      >
        <ArrowLeft size={16} />
        Back to sign in
      </button>

      {/* Header */}
      <div className="text-center space-y-3">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
          className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto shadow-lg shadow-amber-400/25"
        >
          <KeyRound size={24} className="text-white" />
        </motion.div>
        <div>
          <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Forgot password?</h2>
          <p className="text-sm text-neutral-500 mt-1">
            Enter your email and we&apos;ll send you a reset link
          </p>
        </div>
      </div>

      {/* Email */}
      <div>
        <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 block">
          Email
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none"
          />
          <Input
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              error && setError('');
            }}
            placeholder="you@example.com"
            className="!rounded-xl h-12 !pl-10 !text-base"
            status={error ? 'error' : undefined}
          />
        </div>
        {error && <p className="text-[11px] text-red-400 mt-1">{error}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full py-3.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white shadow-md shadow-amber-500/20 hover:shadow-lg transition-all disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Sending...
          </>
        ) : (
          <>
            Send Reset Link
            <ArrowRight size={16} />
          </>
        )}
      </button>
    </motion.form>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SIGNUP FORM
// ═══════════════════════════════════════════════════════════════════════════

const SignupForm = ({
  onSubmit,
  onSwitchToLogin,
  onGoogleSignInCompleted,
  isSubmitting,
  authError,
}: {
  onSubmit: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  onSwitchToLogin: () => void;
  onGoogleSignInCompleted: () => void;
  isSubmitting: boolean;
  authError?: string;
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
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Create your account</h2>
        <p className="text-sm text-neutral-500">
          Join the {process.env.NEXT_PUBLIC_APP_NAME || 'Kraft'} community
        </p>
      </div>

      {/* Auth error */}
      {authError && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>
        </motion.div>
      )}

      {/* Name fields */}
      <div className={`grid ${isMobile ? 'grid-cols-1' : 'grid-cols-2'} gap-3`}>
        <div>
          <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 block">
            First Name
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none"
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
          <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 block">
            Last Name
          </label>
          <div className="relative">
            <User
              size={16}
              className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none"
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
        <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 block">
          Email
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none"
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
        <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 block">
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
          <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-neutral-900 px-3 text-neutral-400">or</span>
        </div>
      </div>

      {/* Google */}
      <GoogleAuthButton onSuccess={onGoogleSignInCompleted} />

      {/* Switch */}
      <p className="text-center text-sm text-neutral-500">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="font-semibold text-blue  transition-colors"
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
  onGoogleSignInCompleted,
  onForgotPassword,
  isSubmitting,
  authError,
}: {
  onSubmit: (data: { email: string; password: string }) => void;
  onSwitchToSignup: () => void;
  onGoogleSignInCompleted: () => void;
  onForgotPassword: () => void;
  isSubmitting: boolean;
  authError?: string;
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
        <h2 className="text-xl font-bold text-neutral-900 dark:text-white">Welcome back</h2>
        <p className="text-sm text-neutral-500">
          Sign in to your {process.env.NEXT_PUBLIC_APP_NAME || 'Kraft'} account
        </p>
      </div>

      {/* Auth error */}
      {authError && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/40 rounded-xl px-4 py-3"
        >
          <p className="text-sm text-red-600 dark:text-red-400">{authError}</p>
        </motion.div>
      )}

      {/* Email */}
      <div>
        <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400 mb-1 block">
          Email
        </label>
        <div className="relative">
          <Mail
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none"
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
          <label className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
            Password
          </label>
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-[11px] font-medium text-blue  transition-colors"
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
          <div className="w-full border-t border-neutral-200 dark:border-neutral-700" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white dark:bg-neutral-900 px-3 text-neutral-400">or</span>
        </div>
      </div>

      <GoogleAuthButton onSuccess={onGoogleSignInCompleted} />

      {/* Switch */}
      <p className="text-center text-sm text-neutral-500">
        Don&apos;t have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToSignup}
          className="font-semibold text-blue  transition-colors"
        >
          Create one
        </button>
      </p>
    </motion.form>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// AUTH MODAL — Manages full auth flow internally
// ═══════════════════════════════════════════════════════════════════════════

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialView = 'login',
  // onAuthSuccess,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  // ── Auth hook (all API calls managed here) ──────────────────────────
  const {
    signIn,
    signUp,
    verifyOtp,
    resendOtp,
    forgotPassword,
    isSigningIn,
    isSigningUp,
    isVerifyingOtp,
    isResendingOtp,
    isSendingForgotPassword,
  } = useAuth();

  // ── State ───────────────────────────────────────────────────────────
  const [view, setView] = useState<AuthView>(initialView);
  const [pendingEmail, setPendingEmail] = useState(''); // email for verify / forgot
  const [authError, setAuthError] = useState('');
  const [previousView, setPreviousView] = useState<AuthView>('login');

  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setView(initialView);
      setPendingEmail('');
      setAuthError('');
    }
  }, [isOpen, initialView]);

  // Lock body scroll
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

  // ── Complete auth (close modal + notify layout) ─────────────────────
  const handleAuthComplete = () => {
    onClose();
    console.log('google auth done::::::');
  };

  // ── Signup ──────────────────────────────────────────────────────────
  const handleSignup = useCallback(
    async (data: { firstName: string; lastName: string; email: string; password: string }) => {
      setAuthError('');
      try {
        await signUp(data);
        // Backend auto-sends OTP on signup — go to verify
        setPendingEmail(data.email);
        setPreviousView('signup');
        setView('verify-email');
      } catch (error: any) {
        const msg =
          error?.data?.message ||
          error?.data?.meta?.error?.message ||
          error?.message ||
          'Signup failed. Please try again.';
        setAuthError(msg);
      }
    },
    [signUp]
  );

  // ── Login ───────────────────────────────────────────────────────────
  const handleLogin = useCallback(
    async (data: { email: string; password: string }) => {
      setAuthError('');
      try {
        const result = await signIn(data);

        // Check if email is verified from the response
        // Handle different response structures
        const user = result?.data?.user || result?.data || result?.user || result;
        const isVerified = user?.isEmailVerified ?? user?.emailVerified ?? true;

        if (!isVerified) {
          // Email not verified — send OTP and go to verify view
          setPendingEmail(data.email);
          setPreviousView('login');
          try {
            await resendOtp({ email: data.email });
          } catch {
            // Silently continue — OTP might have already been sent
          }
          setView('verify-email');
          return;
        }

        // Fully authenticated
        handleAuthComplete();
      } catch (error: any) {
        const errMsg =
          error?.data?.message || error?.data?.meta?.error?.message || error?.message || '';

        // Check if the error is about email verification
        const isVerificationError =
          errMsg.toLowerCase().includes('verify') ||
          errMsg.toLowerCase().includes('not verified') ||
          errMsg.toLowerCase().includes('email verification') ||
          error?.data?.code === 'EMAIL_NOT_VERIFIED';

        if (isVerificationError) {
          setPendingEmail(data.email);
          setPreviousView('login');
          try {
            await resendOtp({ email: data.email });
          } catch {
            // Continue anyway
          }
          setView('verify-email');
          return;
        }

        setAuthError(errMsg || 'Login failed. Please try again.');
      }
    },
    [signIn, resendOtp, handleAuthComplete]
  );

  // ── Verify OTP ──────────────────────────────────────────────────────
  const handleVerifyOtp = useCallback(
    async (otp: string) => {
      try {
        await verifyOtp({ email: pendingEmail, otp });
        handleAuthComplete();
      } catch (error: any) {
        const msg =
          error?.data?.message ||
          error?.data?.meta?.error?.message ||
          error?.message ||
          'Invalid verification code. Please try again.';
        setAuthError(msg);
      }
    },
    [verifyOtp, pendingEmail, handleAuthComplete]
  );

  // ── Resend OTP ──────────────────────────────────────────────────────
  const handleResendOtp = useCallback(async () => {
    try {
      await resendOtp({ email: pendingEmail });
    } catch {
      // Error handled by RTK middleware toast
    }
  }, [resendOtp, pendingEmail]);

  // ── Forgot Password ─────────────────────────────────────────────────
  const handleForgotPassword = useCallback(
    async (email: string) => {
      try {
        await forgotPassword({ email });
      } catch {
        // Error handled by RTK middleware toast
      }
    },
    [forgotPassword]
  );

  // ── Get top bar title ───────────────────────────────────────────────
  const getTopBarTitle = () => {
    switch (view) {
      case 'login':
        return 'Sign In';
      case 'signup':
        return 'Sign Up';
      case 'verify-email':
        return 'Verify Email';
      case 'forgot-password':
        return 'Reset Password';
      default:
        return '';
    }
  };

  // ── Render current view ─────────────────────────────────────────────
  const renderView = () => (
    <AnimatePresence mode="wait">
      {view === 'signup' && (
        <SignupForm
          key="signup"
          onSubmit={handleSignup}
          onSwitchToLogin={() => {
            setAuthError('');
            setView('login');
          }}
          onGoogleSignInCompleted={handleAuthComplete}
          isSubmitting={isSigningUp}
          authError={authError}
        />
      )}
      {view === 'login' && (
        <LoginForm
          key="login"
          onSubmit={handleLogin}
          onSwitchToSignup={() => {
            setAuthError('');
            setView('signup');
          }}
          onGoogleSignInCompleted={handleAuthComplete}
          onForgotPassword={() => {
            setAuthError('');
            setView('forgot-password');
          }}
          isSubmitting={isSigningIn}
          authError={authError}
        />
      )}
      {view === 'verify-email' && (
        <VerifyEmailView
          key="verify-email"
          email={pendingEmail}
          onVerify={handleVerifyOtp}
          onResend={handleResendOtp}
          onBack={() => {
            setAuthError('');
            setView(previousView === 'signup' ? 'signup' : 'login');
          }}
          isVerifying={isVerifyingOtp}
          isResending={isResendingOtp}
        />
      )}
      {view === 'forgot-password' && (
        <ForgotPasswordView
          key="forgot-password"
          onSubmit={handleForgotPassword}
          onBackToLogin={() => {
            setAuthError('');
            setView('login');
          }}
          isSubmitting={isSendingForgotPassword}
        />
      )}
    </AnimatePresence>
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
            className="fixed inset-0 z-[10000] bg-white dark:bg-neutral-900 flex flex-col"
          >
            {/* Top bar */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-100 dark:border-neutral-800">
              <span className="text-sm font-semibold text-neutral-400">{getTopBarTitle()}</span>
              <button
                onClick={onClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
              >
                <X size={18} className="text-neutral-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto px-5 py-6 relative">
              <FloatingShapes />
              <div className="relative z-10">{renderView()}</div>
            </div>

            {/* Bottom brand */}
            <div className="px-5 py-4 border-t border-neutral-100 dark:border-neutral-800">
              <p className="text-center text-[11px] text-neutral-400">
                By continuing, you agree to {process.env.NEXT_PUBLIC_APP_NAME || 'Kraft'}&apos;s
                Terms of Service & Privacy Policy
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
            className="relative w-full max-w-md mx-4 bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden"
          >
            <FloatingShapes />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full flex items-center justify-center hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
            >
              <X size={16} className="text-neutral-400" />
            </button>

            {/* Form content */}
            <div className="relative z-10 px-8 py-8">{renderView()}</div>

            {/* Bottom terms */}
            <div className="px-8 pb-6">
              <p className="text-center text-[11px] text-neutral-400">
                By continuing, you agree to {process.env.NEXT_PUBLIC_APP_NAME || 'Kraft'}&apos;s
                Terms of Service & Privacy Policy
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
