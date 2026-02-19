'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { message as antMessage } from 'antd';
import { fetchData } from '@grc/_shared/helpers';
import CreatorStoreSetup, {
  type CreatorStoreSetupData,
  type LocationOption,
} from '@grc/components/apps/creator-store-setup';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const NIGERIA_ISO2 = 'NG';

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL STATE
// ═══════════════════════════════════════════════════════════════════════════

const INITIAL_DATA: CreatorStoreSetupData = {
  storeName: '',
  tagline: '',
  bio: '',
  phoneNumber: '',
  state: '',
  city: '',
  profileImage: null,
  selectedIndustries: [],
  selectedPlan: 'starter',
};

// ═══════════════════════════════════════════════════════════════════════════
// BACKEND INTEGRATION HELPERS
// ═══════════════════════════════════════════════════════════════════════════

const uploadProfileImage = async (base64Image: string): Promise<string> => {
  // ── TODO: Replace with real upload ──────────────────────────────────
  // const formData = new FormData();
  // formData.append('file', dataURItoBlob(base64Image));
  // const res = await fetch('/api/upload/profile-image', {
  //   method: 'POST',
  //   body: formData,
  // });
  // const data = await res.json();
  // return data.url;
  // ────────────────────────────────────────────────────────────────────
  await new Promise((r) => setTimeout(r, 500));
  return base64Image;
};

const submitCreatorStoreSetup = async (payload: {
  storeName: string;
  tagline: string;
  bio: string;
  phoneNumber: string;
  state: string;
  city: string;
  profileImageUrl: string | null;
  industries: string[];
  planId: string;
}): Promise<{ success: boolean; storeId?: string }> => {
  // ── TODO: Replace with real API call ───────────────────────────────
  // const res = await fetch('/api/creator/store-setup', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(payload),
  // });
  // if (!res.ok) throw new Error('Failed to create store');
  // return await res.json();
  // ────────────────────────────────────────────────────────────────────
  await new Promise((r) => setTimeout(r, 1500));
  console.log('Store setup payload:', payload);
  return { success: true, storeId: 'store_mock_123' };
};

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION
// ═══════════════════════════════════════════════════════════════════════════

const validateStep = (step: number, data: CreatorStoreSetupData): string | null => {
  switch (step) {
    case 1:
      if (!data.storeName.trim() || data.storeName.trim().length < 2)
        return 'Store name must be at least 2 characters';
      return null;
    case 2:
      if (data.selectedIndustries.length === 0) return 'Please select at least one industry';
      if (data.selectedIndustries.length > 5) return 'You can select up to 5 industries';
      return null;
    case 3:
      if (!data.selectedPlan) return 'Please select a plan';
      return null;
    default:
      return null;
  }
};

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT (Logic Layer)
// ═══════════════════════════════════════════════════════════════════════════

const CreatorStoreSetupPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<CreatorStoreSetupData>(INITIAL_DATA);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ── Location state ──────────────────────────────────────────────────
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // ── Fetch Nigerian states on mount ──────────────────────────────────
  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${NIGERIA_ISO2}/states`
        );
        setStates(
          (data || []).map((s: Record<string, any>) => ({
            name: s.name,
            iso2: s.iso2,
          }))
        );
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  // ── Fetch cities when state changes ─────────────────────────────────
  useEffect(() => {
    if (!formData.state) {
      setCities([]);
      return;
    }

    const selectedState = states.find((s) => s.name.toLowerCase() === formData.state.toLowerCase());

    if (!selectedState?.iso2) return;

    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${NIGERIA_ISO2}/states/${selectedState.iso2}/cities`
        );
        setCities(
          (data || []).map((c: Record<string, any>) => ({
            name: c.name,
          }))
        );
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [formData.state, states]);

  // ── Handlers ────────────────────────────────────────────────────────

  const handleDataChange = useCallback((partial: Partial<CreatorStoreSetupData>) => {
    setFormData((prev) => ({ ...prev, ...partial }));
  }, []);

  const handleStateChange = useCallback((state: string) => {
    setFormData((prev) => ({ ...prev, state, city: '' }));
  }, []);

  const handleCityChange = useCallback((city: string) => {
    setFormData((prev) => ({ ...prev, city }));
  }, []);

  const handleStepChange = useCallback(
    (nextStep: number) => {
      if (nextStep > currentStep) {
        const error = validateStep(currentStep, formData);
        if (error) {
          antMessage.error(error);
          return;
        }
      }
      setCurrentStep(nextStep);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [currentStep, formData]
  );

  const handleSubmit = useCallback(async () => {
    const error = validateStep(3, formData);
    if (error) {
      antMessage.error(error);
      return;
    }

    setIsSubmitting(true);

    try {
      let profileImageUrl: string | null = null;
      if (formData.profileImage) {
        profileImageUrl = await uploadProfileImage(formData.profileImage);
      }

      const result = await submitCreatorStoreSetup({
        storeName: formData.storeName.trim(),
        tagline: formData.tagline.trim(),
        bio: formData.bio.trim(),
        phoneNumber: formData.phoneNumber.trim(),
        state: formData.state,
        city: formData.city,
        profileImageUrl,
        industries: formData.selectedIndustries,
        planId: formData.selectedPlan,
      });

      if (result.success) {
        setCurrentStep(4);
        // ── TODO: Post-setup actions ─────────────────────────────
        // await queryClient.invalidateQueries(['user-profile']);
        // updateUserContext({ hasStore: true, storeId: result.storeId });
        // ─────────────────────────────────────────────────────────
      } else {
        antMessage.error('Something went wrong. Please try again.');
      }
    } catch (err) {
      console.error('Store setup failed:', err);
      antMessage.error('Failed to set up your store. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  }, [formData]);

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <CreatorStoreSetup
      initialData={formData}
      currentStep={currentStep}
      isSubmitting={isSubmitting}
      states={states}
      cities={cities}
      loadingStates={loadingStates}
      loadingCities={loadingCities}
      onStepChange={handleStepChange}
      onDataChange={handleDataChange}
      onStateChange={handleStateChange}
      onCityChange={handleCityChange}
      onSubmit={handleSubmit}
    />
  );
};

export default CreatorStoreSetupPage;
