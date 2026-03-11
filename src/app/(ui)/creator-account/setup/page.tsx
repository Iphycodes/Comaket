'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { message as antMessage } from 'antd';
import { useSearchParams } from 'next/navigation';
import { fetchData } from '@grc/_shared/helpers';
import { useUsers } from '@grc/hooks/useUser';
import { useCreators } from '@grc/hooks/useCreators';
import { usePayments } from '@grc/hooks/usePayments';
import { useMedia } from '@grc/hooks/useMedia';
import CreatorAccountSetup, {
  type CreatorAccountData,
  type LocationOption,
} from '@grc/components/apps/creator-account-setup';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const NIGERIA_ISO2 = 'NG';
const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/;
const SESSION_KEY = 'creator_setup_form';
const FREE_PLAN_ID = 'starter';

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

// ═══════════════════════════════════════════════════════════════════════════
// BUILD INITIAL DATA
// ═══════════════════════════════════════════════════════════════════════════

const buildInitialData = (profile?: any): CreatorAccountData => ({
  username: '',
  firstName: profile?.firstName || '',
  lastName: profile?.lastName || '',
  bio: profile?.bio || '',
  contactEmail: profile?.email || '',
  phoneNumber: profile?.mobile?.phoneNumber || '',
  whatsappNumber: profile?.mobile?.phoneNumber || '',
  website: '',
  instagramHandle: '',
  twitterHandle: '',
  tiktokHandle: '',
  profileImage: profile?.avatar || null,
  state: profile?.state || '',
  city: profile?.city || '',
  selectedIndustries: [],
  tags: [],
  selectedPlan: FREE_PLAN_ID,
});

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

const validateStep = (
  step: number,
  data: CreatorAccountData,
  usernameStatus: UsernameStatus
): string | null => {
  switch (step) {
    case 1:
      if (!data.username || data.username.length < 3)
        return 'Username must be at least 3 characters';
      if (!USERNAME_REGEX.test(data.username))
        return 'Username can only contain letters, numbers, dots and underscores';
      if (usernameStatus === 'taken') return 'That username is already taken';
      if (usernameStatus === 'checking') return 'Please wait while we check username availability';
      if (!data.firstName.trim()) return 'First name is required';
      if (!data.lastName.trim()) return 'Last name is required';
      return null;
    case 2:
      if (data.selectedIndustries.length === 0) return 'Please select at least one industry';
      if (data.selectedIndustries.length > 5) return 'You can select up to 5 industries';
      return null;
    case 3:
      if (data.tags.length === 0) return 'Please add at least one tag';
      if (data.tags.length > 15) return 'You can select up to 15 tags';
      return null;
    case 4:
      if (!data.selectedPlan) return 'Please select a plan';
      return null;
    default:
      return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// SESSION STORAGE — persists form across Paystack redirect
// ═══════════════════════════════════════════════════════════════════════════

const saveFormToSession = (data: CreatorAccountData) => {
  try {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(data));
  } catch {}
};

const loadFormFromSession = (): CreatorAccountData | null => {
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const clearFormSession = () => {
  try {
    sessionStorage.removeItem(SESSION_KEY);
  } catch {}
};

// ═══════════════════════════════════════════════════════════════════════════
// BUILD CREATOR PAYLOAD
// ═══════════════════════════════════════════════════════════════════════════

const buildCreatorPayload = (data: CreatorAccountData, avatarUrl?: string | null) => ({
  username: data.username.trim(),
  firstName: data.firstName.trim(),
  lastName: data.lastName.trim(),
  bio: data.bio.trim(),
  contactEmail: data.contactEmail.trim(),
  phoneNumber: data.phoneNumber.trim(),
  whatsappNumber: data.whatsappNumber.trim(),
  website: data.website.trim(),
  socialLinks: {
    instagram: data.instagramHandle.trim(),
    twitter: data.twitterHandle.trim(),
    tiktok: data.tiktokHandle.trim(),
  },
  ...(avatarUrl && { profileImageUrl: avatarUrl }),
  location: { country: 'Nigeria', state: data.state, city: data.city },
  industries: data.selectedIndustries,
  tags: data.tags,
  planId: data.selectedPlan,
});

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const CreatorAccountSetupPage = () => {
  const searchParams = useSearchParams();

  // ── Detect payment return from Paystack ─────────────────────────────
  const stepParam = searchParams?.get('step');
  const referenceParam = searchParams?.get('reference') || searchParams?.get('trxref') || '';
  const isPaymentReturn = stepParam === 'verify' && !!referenceParam;

  // ── Hooks ───────────────────────────────────────────────────────────
  const { userProfile, isLoadingProfile } = useUsers({ fetchProfile: true });
  const { checkUsername, becomeCreator } = useCreators();
  const { initializeSubscription, isInitializingSubscription, verifyPayment } = usePayments();
  const { uploadImage, isUploadingGeneral } = useMedia();

  // ── Upload profile image helper ─────────────────────────────────────
  const uploadProfileImage = useCallback(
    async (imageData: string | null): Promise<string | null> => {
      if (!imageData) return null;
      if (!imageData.startsWith('data:')) return imageData; // already a URL
      try {
        const res = await fetch(imageData);
        const blob = await res.blob();
        const file = new File([blob], `creator-avatar-${Date.now()}.jpg`, {
          type: blob.type || 'image/jpeg',
        });
        const url = await uploadImage(file, true);
        return url || null;
      } catch {
        return null;
      }
    },
    [uploadImage]
  );

  // ── Form state ──────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreatorAccountData>(buildInitialData());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');
  const [isInitialized, setIsInitialized] = useState(false);
  const [isVerifyingSubscription, setIsVerifyingSubscription] = useState(false);
  const [subscriptionError, setSubscriptionError] = useState<string | null>(null);

  const usernameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const verifyAttempted = useRef(false);

  // ── Location state ──────────────────────────────────────────────────
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedStateIso2, setSelectedStateIso2] = useState<string>('');

  // ── Prefill form once user profile loads (skip if returning from payment) ─
  useEffect(() => {
    if (userProfile && !isInitialized && !isPaymentReturn) {
      setFormData(buildInitialData(userProfile));
      setIsInitialized(true);
    }
  }, [userProfile, isInitialized, isPaymentReturn]);

  // ══════════════════════════════════════════════════════════════════════
  // PAYMENT RETURN FLOW
  // Paystack redirects back to: /creator-account/setup?step=verify&reference=PSK_xxx
  // 1. Restore saved form from sessionStorage
  // 2. Verify payment with backend
  // 3. If verified → call becomeCreator with paid plan → step 5
  // 4. If failed → show error on step 4 so user can retry
  // ══════════════════════════════════════════════════════════════════════

  useEffect(() => {
    if (!isPaymentReturn || verifyAttempted.current) return;
    verifyAttempted.current = true;

    const verifyAndComplete = async () => {
      setIsVerifyingSubscription(true);

      // 1. Restore form
      const savedForm = loadFormFromSession();
      if (!savedForm) {
        setSubscriptionError('Your session expired. Please fill in the form and try again.');
        setIsVerifyingSubscription(false);
        // Clean URL
        window.history.replaceState({}, '', window.location.pathname);
        return;
      }

      setFormData(savedForm);
      setUsernameStatus('available'); // Was validated before redirect

      try {
        // 2. Verify payment
        const result = await verifyPayment(referenceParam);
        const data = result?.data || result;

        if (!data?.verified && data?.status !== 'success' && data?.status !== 'paid') {
          // Payment not confirmed
          setSubscriptionError(
            'Subscription payment could not be verified. You can retry or choose a different plan.'
          );
          setCurrentStep(4);
          setIsVerifyingSubscription(false);
          window.history.replaceState({}, '', window.location.pathname);
          return;
        }

        // 3. Payment verified → upload avatar and complete creator signup
        const avatarUrl = await uploadProfileImage(savedForm.profileImage);
        const payload = buildCreatorPayload(savedForm, avatarUrl);
        await becomeCreator(payload);

        // 4. Done!
        clearFormSession();
        setCurrentStep(5);
        window.history.replaceState({}, '', window.location.pathname);
      } catch (err: any) {
        console.error('Post-payment creator setup failed:', err);
        setSubscriptionError(
          err?.data?.message ||
            'Something went wrong after payment. Please contact support — you will not be charged again.'
        );
        setCurrentStep(4);
        window.history.replaceState({}, '', window.location.pathname);
      } finally {
        setIsVerifyingSubscription(false);
      }
    };

    verifyAndComplete();
  }, [isPaymentReturn, referenceParam, verifyPayment, becomeCreator]);

  // ── Fetch states on mount ───────────────────────────────────────────
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${NIGERIA_ISO2}/states`
        );
        setStates((data || []).map((s: Record<string, any>) => ({ name: s.name, iso2: s.iso2 })));
      } catch {
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    if (formData.state && states.length > 0 && !selectedStateIso2) {
      const match = states.find((s) => s.name.toLowerCase() === formData.state.toLowerCase());
      if (match?.iso2) setSelectedStateIso2(match.iso2);
    }
  }, [formData.state, states, selectedStateIso2]);

  useEffect(() => {
    if (!selectedStateIso2) {
      setCities([]);
      return;
    }
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${NIGERIA_ISO2}/states/${selectedStateIso2}/cities`
        );
        setCities((data || []).map((c: Record<string, any>) => ({ name: c.name })));
      } catch {
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedStateIso2]);

  // ── Handlers ────────────────────────────────────────────────────────

  const handleDataChange = useCallback(
    (partial: Partial<CreatorAccountData>) => {
      setFormData((prev) => ({ ...prev, ...partial }));
      if (subscriptionError) setSubscriptionError(null);
    },
    [subscriptionError]
  );

  const handleStateChange = useCallback(
    (stateName: string) => {
      const match = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
      setSelectedStateIso2(match?.iso2 || '');
    },
    [states]
  );

  const handleCheckUsername = useCallback(
    (username: string) => {
      if (usernameTimerRef.current) clearTimeout(usernameTimerRef.current);
      if (username.length < 3) {
        setUsernameStatus('idle');
        return;
      }
      if (!USERNAME_REGEX.test(username)) {
        setUsernameStatus('invalid');
        return;
      }
      setUsernameStatus('checking');
      usernameTimerRef.current = setTimeout(async () => {
        try {
          const available = await checkUsername(username);
          setUsernameStatus(available ? 'available' : 'taken');
        } catch {
          setUsernameStatus('idle');
        }
      }, 500);
    },
    [checkUsername]
  );

  const handleStepChange = useCallback(
    (nextStep: number) => {
      if (nextStep > currentStep) {
        const error = validateStep(currentStep, formData, usernameStatus);
        if (error) {
          antMessage.error(error);
          return;
        }
      }
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentStep, formData, usernameStatus]
  );

  // ══════════════════════════════════════════════════════════════════════
  // SUBMIT — branches based on plan
  // ══════════════════════════════════════════════════════════════════════

  const handleSubmit = useCallback(async () => {
    const error = validateStep(4, formData, usernameStatus);
    if (error) {
      antMessage.error(error);
      return;
    }

    const isPaidPlan = formData.selectedPlan !== FREE_PLAN_ID;
    setIsSubmitting(true);

    if (isPaidPlan) {
      // ── PAID: save form → Paystack → verify on return ───────────────
      try {
        saveFormToSession(formData);
        const callbackUrl = `${window.location.origin}/creator-account/setup?step=verify`;
        await initializeSubscription({
          plan: formData.selectedPlan as 'pro' | 'business',
          callbackUrl,
        });
        // Page navigates away to Paystack — isSubmitting stays true
      } catch (err: any) {
        clearFormSession();
        antMessage.error(err?.data?.message || 'Failed to start subscription payment.');
        setIsSubmitting(false);
      }
    } else {
      // ── FREE: upload avatar and submit directly ─────────────────────
      try {
        const avatarUrl = await uploadProfileImage(formData.profileImage);
        const payload = buildCreatorPayload(formData, avatarUrl);
        await becomeCreator(payload);
        setCurrentStep(5);
      } catch (err: any) {
        antMessage.error(err?.data?.message || 'Failed to set up your creator account.');
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [formData, usernameStatus, becomeCreator, initializeSubscription]);

  // ── Loading states ──────────────────────────────────────────────────

  if (isLoadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-blue/30 border-t-blue rounded-full animate-spin mx-auto" />
          <p className="text-sm text-neutral-400">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (isVerifyingSubscription) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-blue/30 border-t-blue rounded-full animate-spin mx-auto" />
          <p className="text-base font-semibold text-neutral-900 dark:text-white">
            Confirming your subscription...
          </p>
          <p className="text-sm text-neutral-400 max-w-xs mx-auto">
            Verifying payment and setting up your creator account. This will only take a moment.
          </p>
        </div>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <CreatorAccountSetup
      data={formData}
      currentStep={currentStep}
      isSubmitting={isSubmitting || isInitializingSubscription || isUploadingGeneral}
      usernameStatus={usernameStatus}
      onStepChange={handleStepChange}
      onDataChange={handleDataChange}
      onCheckUsername={handleCheckUsername}
      onSubmit={handleSubmit}
      states={states}
      cities={cities}
      loadingStates={loadingStates}
      loadingCities={loadingCities}
      onStateChange={handleStateChange}
      subscriptionError={subscriptionError}
    />
  );
};

export default CreatorAccountSetupPage;
