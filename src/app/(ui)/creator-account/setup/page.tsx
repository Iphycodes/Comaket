'use client';

import React, { useState, useCallback, useRef } from 'react';
import { message as antMessage } from 'antd';
import CreatorAccountSetup, {
  type CreatorAccountData,
  type MemberPrefillData,
} from '@grc/components/apps/creator-account-setup';

// ═══════════════════════════════════════════════════════════════════════════
// MEMBER PREFILL DATA
// This would come from your auth context / user profile query
// ═══════════════════════════════════════════════════════════════════════════

// ── TODO: Replace with real user data from auth context ──────────────
// Example:
// const { user } = useAuthContext();
// const memberData: MemberPrefillData = {
//   firstName: user.firstName,
//   lastName: user.lastName,
//   email: user.email,
//   phoneNumber: user.phoneNumber,
//   profileImageUrl: user.profilePicUrl,
// };
// ─────────────────────────────────────────────────────────────────────

const mockMemberData: MemberPrefillData = {
  firstName: 'Emmanuel',
  lastName: 'Okafor',
  email: 'emmanuel.okafor@gmail.com',
  phoneNumber: '2348012345678',
  profileImageUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
};

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL STATE (pre-filled from member account)
// ═══════════════════════════════════════════════════════════════════════════

const buildInitialData = (member: MemberPrefillData): CreatorAccountData => ({
  username: '',
  firstName: member.firstName,
  lastName: member.lastName,
  bio: '',
  contactEmail: member.email,
  phoneNumber: member.phoneNumber,
  whatsappNumber: member.phoneNumber, // default to same as phone
  website: '',
  instagramHandle: '',
  twitterHandle: '',
  tiktokHandle: '',
  profileImage: member.profileImageUrl,
  selectedIndustries: [],
  selectedPlan: 'starter',
});

// ═══════════════════════════════════════════════════════════════════════════
// BACKEND INTEGRATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

type UsernameStatus = 'idle' | 'checking' | 'available' | 'taken' | 'invalid';

/**
 * Checks if a username is available.
 * Replace with your actual endpoint.
 */
const checkUsernameAvailability = async (username: string): Promise<{ available: boolean }> => {
  // ── TODO: Replace with real API call ───────────────────────────────
  // Example:
  // const res = await fetch(`/api/creator/check-username?username=${encodeURIComponent(username)}`);
  // return await res.json();
  // ────────────────────────────────────────────────────────────────────

  await new Promise((r) => setTimeout(r, 600));

  // Mock: treat some usernames as taken
  const takenUsernames = ['admin', 'comaket', 'test', 'creator', 'emmanuel'];
  return { available: !takenUsernames.includes(username.toLowerCase()) };
};

/**
 * Uploads the creator profile image.
 */
const uploadProfileImage = async (base64Image: string): Promise<string> => {
  // ── TODO: Replace with real upload ──────────────────────────────────
  // const formData = new FormData();
  // formData.append('file', dataURItoBlob(base64Image));
  // const res = await fetch('/api/upload/creator-image', {
  //   method: 'POST',
  //   body: formData,
  // });
  // const data = await res.json();
  // return data.url;
  // ────────────────────────────────────────────────────────────────────

  await new Promise((r) => setTimeout(r, 500));
  return base64Image;
};

/**
 * Submits the creator account setup to the backend.
 * This upgrades a member account to a creator account.
 */
const submitCreatorAccount = async (payload: {
  username: string;
  firstName: string;
  lastName: string;
  bio: string;
  contactEmail: string;
  phoneNumber: string;
  whatsappNumber: string;
  website: string;
  socialLinks: {
    instagram: string;
    twitter: string;
    tiktok: string;
  };
  profileImageUrl: string | null;
  industries: string[];
  planId: string;
}): Promise<{ success: boolean; creatorId?: string }> => {
  // ── TODO: Replace with real API call ───────────────────────────────
  // const res = await fetch('/api/creator/setup-account', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) {
  //   const err = await res.json();
  //   throw new Error(err.message || 'Failed to create creator account');
  // }
  // return await res.json();
  // ────────────────────────────────────────────────────────────────────

  await new Promise((r) => setTimeout(r, 1500));
  console.log('Creator account payload:', payload);
  return { success: true, creatorId: 'creator_acc_123' };
};

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

const USERNAME_REGEX = /^[a-z0-9._]{3,30}$/;

const validateStep = (
  step: number,
  data: CreatorAccountData,
  usernameStatus: UsernameStatus
): string | null => {
  switch (step) {
    case 1:
      if (!data.username || data.username.length < 3) {
        return 'Username must be at least 3 characters';
      }
      if (!USERNAME_REGEX.test(data.username)) {
        return 'Username can only contain letters, numbers, dots and underscores';
      }
      if (usernameStatus === 'taken') {
        return 'That username is already taken';
      }
      if (usernameStatus === 'checking') {
        return 'Please wait while we check username availability';
      }
      if (!data.firstName.trim()) {
        return 'First name is required';
      }
      if (!data.lastName.trim()) {
        return 'Last name is required';
      }
      return null;

    case 2:
      if (data.selectedIndustries.length === 0) {
        return 'Please select at least one industry';
      }
      if (data.selectedIndustries.length > 5) {
        return 'You can select up to 5 industries';
      }
      return null;

    case 3:
      if (!data.selectedPlan) {
        return 'Please select a plan';
      }
      return null;

    default:
      return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT (Logic Layer)
// ═══════════════════════════════════════════════════════════════════════════

const CreatorAccountSetupPage = () => {
  // ── TODO: Replace mockMemberData with real user from auth context ──
  const memberData = mockMemberData;

  const [currentStep, setCurrentStep] = useState(2);
  const [formData, setFormData] = useState<CreatorAccountData>(buildInitialData(memberData));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [usernameStatus, setUsernameStatus] = useState<UsernameStatus>('idle');

  // Debounce timer for username check
  const usernameTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // ── Data change handler ─────────────────────────────────────────────

  const handleDataChange = useCallback((partial: Partial<CreatorAccountData>) => {
    setFormData((prev: any) => ({ ...prev, ...partial }));
  }, []);

  // ── Username check with debounce ────────────────────────────────────

  const handleCheckUsername = useCallback((username: string) => {
    // Clear previous timer
    if (usernameTimerRef.current) {
      clearTimeout(usernameTimerRef.current);
    }

    // Basic client-side validation first
    if (username.length < 3) {
      setUsernameStatus('idle');
      return;
    }
    if (!USERNAME_REGEX.test(username)) {
      setUsernameStatus('invalid');
      return;
    }

    setUsernameStatus('checking');

    // Debounce the API call by 500ms
    usernameTimerRef.current = setTimeout(async () => {
      try {
        const result = await checkUsernameAvailability(username);
        setUsernameStatus(result.available ? 'available' : 'taken');
      } catch {
        // If check fails, allow proceeding (server will validate again)
        setUsernameStatus('idle');
      }
    }, 500);
  }, []);

  // ── Step change with validation ─────────────────────────────────────

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

  // ── Final submit ────────────────────────────────────────────────────

  const handleSubmit = useCallback(async () => {
    const error = validateStep(3, formData, usernameStatus);
    if (error) {
      antMessage.error(error);
      return;
    }

    setIsSubmitting(true);

    try {
      // Step 1: Upload profile image if it's a new base64 image
      let profileImageUrl: string | null = formData.profileImage;
      if (formData.profileImage && formData.profileImage.startsWith('data:')) {
        profileImageUrl = await uploadProfileImage(formData.profileImage);
      }

      // Step 2: Submit to backend
      const result = await submitCreatorAccount({
        username: formData.username.trim(),
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        bio: formData.bio.trim(),
        contactEmail: formData.contactEmail.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        whatsappNumber: formData.whatsappNumber.trim(),
        website: formData.website.trim(),
        socialLinks: {
          instagram: formData.instagramHandle.trim(),
          twitter: formData.twitterHandle.trim(),
          tiktok: formData.tiktokHandle.trim(),
        },
        profileImageUrl,
        industries: formData.selectedIndustries,
        planId: formData.selectedPlan,
      });

      if (result.success) {
        setCurrentStep(4);

        // ── TODO: Post-setup actions ─────────────────────────────
        // - Update global auth/user context:
        //   updateUserContext({ isCreator: true, creatorId: result.creatorId });
        // - Invalidate user profile query:
        //   await queryClient.invalidateQueries(['user-profile']);
        // - Track analytics:
        //   analytics.track('creator_account_created', { plan: formData.selectedPlan });
        // ─────────────────────────────────────────────────────────
      } else {
        antMessage.error('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Creator account setup failed:', err);
      antMessage.error('Failed to set up your creator account. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, usernameStatus]);

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <CreatorAccountSetup
      data={formData}
      currentStep={currentStep}
      isSubmitting={isSubmitting}
      usernameStatus={usernameStatus}
      onStepChange={handleStepChange}
      onDataChange={handleDataChange}
      onCheckUsername={handleCheckUsername}
      onSubmit={handleSubmit}
    />
  );
};

export default CreatorAccountSetupPage;
