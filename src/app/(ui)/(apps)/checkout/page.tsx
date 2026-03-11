'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '@grc/hooks/useAuth';
import { useCart } from '@grc/hooks/useCart';
import { useUsers } from '@grc/hooks/useUser';
import { usePayments } from '@grc/hooks/usePayments';
import { fetchData } from '@grc/_shared/helpers';
import { message as antMessage } from 'antd';
import Checkout from '@grc/components/apps/checkout';
import { CheckoutCartPayload } from '@grc/services/cart';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ShippingFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  country: string;
  state: string;
  city: string;
  zipCode: string;
  buyerNote: string;
}

export interface CheckoutCartItem {
  listingId: string;
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  image: string;
  storeName: string;
}

export interface LocationOption {
  name: string;
  iso2?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// CHECKOUT PAGE
// ═══════════════════════════════════════════════════════════════════════════

const CheckoutPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated } = useAuth();
  const [isProcessing, setIsProcessing] = useState(false);

  // Read selected item IDs from cart page (?items=id1,id2,id3)
  const selectedItemIds = useMemo(
    () => searchParams?.get('items')?.split(',').filter(Boolean) || [],
    [searchParams]
  );

  // ── Hooks ───────────────────────────────────────────────────────────
  const { userProfile, isLoadingProfile } = useUsers({
    fetchProfile: !!isAuthenticated,
  });

  const {
    cartItems: rawCartItems,
    isLoadingCart,
    validateCart,
    checkout: checkoutCart,
    isCheckingOut,
  } = useCart({
    fetchCart: !!isAuthenticated,
    fetchCount: !!isAuthenticated,
  });

  const { initializePayment, isInitializingPayment } = usePayments();

  // ── Location state ────────────────────────────────────────────────
  const [countries, setCountries] = useState<LocationOption[]>([]);
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [loadingCountries, setLoadingCountries] = useState(false);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedCountryIso2, setSelectedCountryIso2] = useState('');
  const [selectedStateIso2, setSelectedStateIso2] = useState('');

  // ── Shipping form state (lifted for location coupling) ────────────
  const [shippingData, setShippingData] = useState<ShippingFormData>({
    fullName: '',
    phoneNumber: '',
    email: '',
    address: '',
    country: '',
    state: '',
    city: '',
    zipCode: '',
    buyerNote: '',
  });

  // Prefill from user profile once loaded
  useEffect(() => {
    if (!userProfile) return;
    const profile = userProfile || {};
    setShippingData((prev) => ({
      ...prev,
      fullName: prev.fullName || `${profile.firstName || ''} ${profile.lastName || ''}`.trim(),
      phoneNumber: prev.phoneNumber || profile.phoneNumber || profile.phone || '',
      email: prev.email || profile.email || '',
      address: prev.address || profile.address || '',
      country: prev.country || profile.country || 'Nigeria',
      state: prev.state || profile.state || '',
      city: prev.city || profile.city || '',
      zipCode: prev.zipCode || profile.zipCode || '',
    }));
  }, [userProfile]);

  // ── Fetch countries on mount ──────────────────────────────────────
  useEffect(() => {
    const loadCountries = async () => {
      setLoadingCountries(true);
      try {
        const data = await fetchData(`${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries`);
        const mapped = (data || []).map((c: Record<string, any>) => ({
          name: c.name,
          iso2: c.iso2,
        }));
        setCountries(mapped);

        // Auto-resolve iso2 for prefilled country
        const profileCountry = userProfile?.country || 'Nigeria';
        const match = mapped.find(
          (c: LocationOption) => c.name.toLowerCase() === profileCountry.toLowerCase()
        );
        if (match?.iso2) {
          setSelectedCountryIso2(match.iso2);
        }
      } catch (error) {
        console.error('Error fetching countries:', error);
      } finally {
        setLoadingCountries(false);
      }
    };
    loadCountries();
  }, []);

  // ── Fetch states when country changes ─────────────────────────────
  useEffect(() => {
    if (!selectedCountryIso2) {
      setStates([]);
      setCities([]);
      return;
    }
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${selectedCountryIso2}/states`
        );
        setStates(
          (data || []).map((s: Record<string, any>) => ({
            name: s.name,
            iso2: s.iso2,
          }))
        );
      } catch (error) {
        console.error('Error fetching states:', error);
        setStates([]);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, [selectedCountryIso2]);

  // ── Fetch cities when state changes ───────────────────────────────
  useEffect(() => {
    if (!selectedCountryIso2 || !selectedStateIso2) {
      setCities([]);
      return;
    }
    const loadCities = async () => {
      setLoadingCities(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${selectedCountryIso2}/states/${selectedStateIso2}/cities`
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
  }, [selectedCountryIso2, selectedStateIso2]);

  // ── Auto-resolve state iso2 when profile prefills ─────────────────
  useEffect(() => {
    if (!shippingData.state || states.length === 0) return;
    const match = states.find((s) => s.name.toLowerCase() === shippingData.state.toLowerCase());
    if (match?.iso2 && match.iso2 !== selectedStateIso2) {
      setSelectedStateIso2(match.iso2);
    }
  }, [shippingData.state, states]);

  // ── Location change handlers ──────────────────────────────────────
  const handleCountryChange = useCallback(
    (countryName: string) => {
      const match = countries.find((c) => c.name.toLowerCase() === countryName.toLowerCase());
      setSelectedCountryIso2(match?.iso2 || '');
      setSelectedStateIso2('');
      setShippingData((prev) => ({ ...prev, country: countryName, state: '', city: '' }));
    },
    [countries]
  );

  const handleStateChange = useCallback(
    (stateName: string) => {
      const match = states.find((s) => s.name.toLowerCase() === stateName.toLowerCase());
      setSelectedStateIso2(match?.iso2 || '');
      setShippingData((prev) => ({ ...prev, state: stateName, city: '' }));
    },
    [states]
  );

  const handleCityChange = useCallback((cityName: string) => {
    setShippingData((prev) => ({ ...prev, city: cityName }));
  }, []);

  const handleShippingChange = useCallback((updates: Partial<ShippingFormData>) => {
    setShippingData((prev) => ({ ...prev, ...updates }));
  }, []);

  // ── Filter cart items to only selected ones ─────────────────────────
  const checkoutItems: CheckoutCartItem[] = useMemo(() => {
    return (rawCartItems || [])
      .filter((item: any) => {
        // Must be available
        if (item.isAvailable === false) return false;
        // If specific items were selected from cart, only include those
        if (selectedItemIds.length > 0) {
          return selectedItemIds.includes(item.listingId);
        }
        // Fallback: include all available (direct navigation to /checkout)
        return true;
      })
      .map((item: any) => ({
        listingId: item?.listingId || '',
        itemName: item?.itemName || '',
        quantity: item?.quantity || 1,
        unitPrice: item?.unitPrice || 0,
        totalPrice: item?.totalPrice || 0,
        image: item?.listing?.media?.[0]?.url || item?.snapshot?.image || '',
        storeName: item?.store?.name || '',
      }));
  }, [rawCartItems, selectedItemIds]);

  // Compute total from selected items only (not backend cartSubtotal which is full cart)
  const cartTotal = useMemo(
    () => checkoutItems.reduce((sum, item) => sum + item.totalPrice, 0),
    [checkoutItems]
  );
  const cartCount = checkoutItems.length;

  // ── Place order + initialize payment ────────────────────────────────
  const handlePlaceOrder = useCallback(
    async (shipping: ShippingFormData) => {
      if (isProcessing) return;
      setIsProcessing(true);

      try {
        const callbackUrl = `${window.location.origin}/checkout/verify`;

        const checkoutPayload: CheckoutCartPayload & { listingIds?: string[] } = {
          shippingAddress: {
            fullName: shipping.fullName.trim(),
            phoneNumber: shipping.phoneNumber.trim(),
            address: shipping.address.trim(),
            country: shipping.country.trim(),
            state: shipping.state.trim(),
            city: shipping.city.trim(),
            ...(shipping.zipCode.trim() && { zipCode: shipping.zipCode.trim() }),
          },
          email: shipping.email,
          ...(shipping.buyerNote.trim() && { buyerNote: shipping.buyerNote.trim() }),
          callbackUrl,
        };

        // Pass selected listing IDs so backend only checks out these items
        if (selectedItemIds.length > 0) {
          checkoutPayload.listingIds = selectedItemIds;
        }

        const checkoutResult = await checkoutCart(checkoutPayload);
        const orderId =
          checkoutResult?.orders?.[0]?._id || checkoutResult?.data?.id || checkoutResult?._id;

        if (!orderId) {
          const authUrl =
            checkoutResult?.data?.payment?.authorizationUrl || checkoutResult?.authorizationUrl;
          if (authUrl) {
            window.location.href = authUrl;
            return;
          }
          antMessage.error('Failed to create order. Please try again.');
          setIsProcessing(false);
          return;
        }

        // Initialize payment with orderId
        await initializePayment({ orderId, callbackUrl });
      } catch (err: any) {
        const message =
          err?.data?.message || err?.message || 'Failed to process your order. Please try again.';
        antMessage.error(message);
      } finally {
        setIsProcessing(false);
      }
    },
    [validateCart, checkoutCart, initializePayment, isProcessing, selectedItemIds]
  );

  // ── Redirect if not authenticated ───────────────────────────────────
  if (!isAuthenticated) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <p className="text-neutral-500 text-sm">Please sign in to checkout</p>
        <button
          onClick={() => router.push('/auth/sign-in')}
          className="text-sm text-blue hover:text-blue font-medium"
        >
          Sign In
        </button>
      </div>
    );
  }

  // ── Loading ─────────────────────────────────────────────────────────
  if (isLoadingCart || isLoadingProfile) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-blue border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-sm text-neutral-400">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  // ── Empty cart ──────────────────────────────────────────────────────
  if (checkoutItems.length === 0 && !isProcessing && !isCheckingOut && !isInitializingPayment) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-3">
        <p className="text-neutral-500 text-sm">No Items Found</p>
        <button
          onClick={() => router.push('/cart')}
          className="text-sm text-blue hover:text-blue font-medium"
        >
          Return to Cart
        </button>
      </div>
    );
  }

  // ── Render ──────────────────────────────────────────────────────────
  return (
    <Checkout
      items={checkoutItems}
      cartTotal={cartTotal}
      cartCount={cartCount}
      shipping={shippingData}
      onShippingChange={handleShippingChange}
      isProcessing={isProcessing || isCheckingOut || isInitializingPayment}
      onPlaceOrder={handlePlaceOrder}
      onBack={() => router.push('/cart')}
      // Location
      countries={countries}
      states={states}
      cities={cities}
      loadingCountries={loadingCountries}
      loadingStates={loadingStates}
      loadingCities={loadingCities}
      onCountryChange={handleCountryChange}
      onStateChange={handleStateChange}
      onCityChange={handleCityChange}
    />
  );
};

export default CheckoutPage;
