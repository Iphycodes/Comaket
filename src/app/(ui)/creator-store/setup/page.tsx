'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { message as antMessage } from 'antd';
import { fetchData } from '@grc/_shared/helpers';
import { useStores } from '@grc/hooks/useStores';
import { useMedia } from '@grc/hooks/useMedia';
import { useCreators } from '@grc/hooks/useCreators';
import CreatorStoreSetup, {
  CreatorStoreSetupData,
  LocationOption,
} from '@grc/components/apps/creator-store-setup';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const NIGERIA_ISO2 = 'NG';

// ═══════════════════════════════════════════════════════════════════════════
// INITIAL STATE — includes tags
// ═══════════════════════════════════════════════════════════════════════════

const INITIAL_DATA: CreatorStoreSetupData = {
  storeName: '',
  tagline: '',
  bio: '',
  phoneNumber: '',
  whatsappNumber: '',
  address: '',
  state: '',
  city: '',
  profileImage: null,
  profileImageFile: null,
  selectedIndustries: [],
  tags: [],
};

// ═══════════════════════════════════════════════════════════════════════════
// VALIDATION — 3 active steps (stores inherit creator's plan)
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
      if (data.tags.length === 0) return 'Please add at least one tag';
      if (data.tags.length > 15) return 'You can select up to 15 tags';
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

  // ── Hooks ───────────────────────────────────────────────────────────
  const { createStore, isCreatingStore } = useStores();
  const { uploadImage, isUploadingGeneral } = useMedia();
  const { creatorProfile, isLoadingProfile } = useCreators({ fetchProfile: true });

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
    // Validate tags step (step 3)
    const error = validateStep(3, formData);
    if (error) {
      antMessage.error(error);
      return;
    }

    setIsSubmitting(true);

    try {
      // 1. Upload logo if a file was selected
      let logoUrl: string | null = null;
      if (formData.profileImageFile) {
        logoUrl = await uploadImage(formData.profileImageFile, true);
        if (!logoUrl) {
          antMessage.error('Failed to upload store logo');
          setIsSubmitting(false);
          return;
        }
      }

      // 2. Build the create store payload
      const payload: Record<string, any> = {
        name: formData.storeName.trim(),
        ...(formData.bio.trim() && { description: formData.bio.trim() }),
        ...(formData.tagline.trim() && { tagline: formData.tagline.trim() }),
        ...(formData.phoneNumber.trim() && { phoneNumber: formData.phoneNumber.trim() }), // "+2349076141362"
        ...(formData.whatsappNumber.trim() && { whatsappNumber: formData.whatsappNumber.trim() }), // "+2349076141362"
        categories: formData.selectedIndustries, // IDs: ["fashion", "jewelry"]
        tags: formData.tags, // ["ankara", "bespoke", "custom-jewelry"]
      };

      if (logoUrl) {
        payload.logo = logoUrl;
      }

      // Location
      if (formData.state) {
        payload.location = {
          country: 'Nigeria',
          state: formData.state,
          ...(formData.city && { city: formData.city }),
          ...(formData.address.trim() && { street: formData.address.trim() }),
        };
      }

      // 3. Create store
      const result = await createStore(payload);

      if (result) {
        setCurrentStep(4); // Success step
      } else {
        antMessage.error('Something went wrong. Please try again.');
      }
    } catch (err: any) {
      console.error('Store setup failed:', err);
      const errorMsg =
        err?.data?.message || err?.message || 'Failed to set up your store. Please try again.';
      antMessage.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  }, [formData, createStore, uploadImage]);

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <CreatorStoreSetup
      initialData={formData}
      currentStep={currentStep}
      isSubmitting={isSubmitting || isCreatingStore || isUploadingGeneral}
      states={states}
      cities={cities}
      loadingStates={loadingStates}
      loadingCities={loadingCities}
      creatorIndustries={creatorProfile?.industries}
      isLoadingCreatorProfile={isLoadingProfile}
      onStepChange={handleStepChange}
      onDataChange={handleDataChange}
      onStateChange={handleStateChange}
      onCityChange={handleCityChange}
      onSubmit={handleSubmit}
    />
  );
};

export default CreatorStoreSetupPage;
