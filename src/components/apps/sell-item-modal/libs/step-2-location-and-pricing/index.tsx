'use client';

import React, { useEffect, useState, useMemo } from 'react';
import { Form, InputNumber, Select } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Info, Wallet, Percent, HandCoins, PartyPopper } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { SellingModel } from '@grc/_shared/namespace/sell-item';
import { fetchData } from '@grc/_shared/helpers';
import { useGetPlatformSettingsQuery } from '@grc/services/payments';

const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || 'Kraft';

// ═══════════════════════════════════════════════════════════════════════════

const NIGERIA_ISO2 = 'NG';

interface LocationOption {
  name: string;
  iso2?: string;
}

interface Props {
  form: FormInstance;
  initialData: Record<string, any>;
  onContinue: (values: Record<string, any>) => void;
  onBack: () => void;
  sellingModel: SellingModel;
  /** Quantity from basic info — used to calculate total listing value for fees */
  quantity?: number;
}

const SellItemPricing: React.FC<Props> = ({
  form,
  initialData,
  onContinue,
  onBack,
  sellingModel,
  quantity = 1,
}) => {
  const [askPrice, setAskPrice] = useState<number>(initialData?.askPrice || 0);

  // ── Platform Settings (from API) ────────────────────────────────────
  const { data: platformSettingsData } = useGetPlatformSettingsQuery();
  const ps = platformSettingsData?.data || {};

  const IS_FREE_LISTING = ps.freeListing ?? false;
  const IS_NO_COMMISSION = ps.noCommission ?? false;
  const SELF_LISTING_FEE_PERCENT = ps.selfListingFeePercent ?? 5;
  const CONSIGNMENT_COMMISSION_PERCENT = ps.consignmentCommissionPercent ?? 15;
  const LISTING_FEE_CAP_KOBO = ps.listingFeeCapKobo ?? 0;
  const CONSIGNMENT_COMMISSION_CAP_KOBO = ps.consignmentCommissionCapKobo ?? 0;

  const calculateListingFee = useMemo(
    () => (priceInKobo: number) => {
      const base =
        LISTING_FEE_CAP_KOBO > 0 ? Math.min(priceInKobo, LISTING_FEE_CAP_KOBO) : priceInKobo;
      return Math.round(base * (SELF_LISTING_FEE_PERCENT / 100));
    },
    [LISTING_FEE_CAP_KOBO, SELF_LISTING_FEE_PERCENT]
  );

  const calculateConsignmentCut = useMemo(
    () => (priceInKobo: number) => {
      const base =
        CONSIGNMENT_COMMISSION_CAP_KOBO > 0
          ? Math.min(priceInKobo, CONSIGNMENT_COMMISSION_CAP_KOBO)
          : priceInKobo;
      const platformCut = Math.round(base * (CONSIGNMENT_COMMISSION_PERCENT / 100));
      return { platformCut, sellerCut: priceInKobo - platformCut };
    },
    [CONSIGNMENT_COMMISSION_CAP_KOBO, CONSIGNMENT_COMMISSION_PERCENT]
  );

  // ── Location state ──────────────────────────────────────────────────
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);
  const [selectedStateIso2, setSelectedStateIso2] = useState<string>('');

  useEffect(() => {
    const loadStates = async () => {
      setLoadingStates(true);
      try {
        const data = await fetchData(
          `${process.env.NEXT_PUBLIC_COUNTRY_API_BASE_URL}/countries/${NIGERIA_ISO2}/states`
        );
        setStates((data || []).map((s: Record<string, any>) => ({ name: s.name, iso2: s.iso2 })));
      } catch (error) {
        console.error('Error fetching states:', error);
      } finally {
        setLoadingStates(false);
      }
    };
    loadStates();
  }, []);

  useEffect(() => {
    if (initialData?.state && states.length > 0) {
      const match = states.find((s) => s.name.toLowerCase() === initialData.state.toLowerCase());
      if (match?.iso2) setSelectedStateIso2(match.iso2);
    }
  }, [initialData?.state, states]);

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
      } catch (error) {
        console.error('Error fetching cities:', error);
        setCities([]);
      } finally {
        setLoadingCities(false);
      }
    };
    loadCities();
  }, [selectedStateIso2]);

  const handleStateChange = (stateName: string) => {
    const match = states.find((s) => s.name === stateName);
    setSelectedStateIso2(match?.iso2 || '');
    form.setFieldValue('city', undefined);
  };

  const stateOptions = states.map((s) => ({ label: s.name, value: s.name }));
  const cityOptions = cities.map((c) => ({ label: c.name, value: c.name }));

  useEffect(() => {
    form.setFieldsValue(initialData);
    if (initialData?.askPrice) setAskPrice(initialData.askPrice);
  }, [initialData]);

  // ── Fee calculations — based on total listing value (unit price × qty) ──
  const unitPriceKobo = (askPrice || 0) * 100;
  const totalValueKobo = unitPriceKobo * quantity;
  const priceInKobo = totalValueKobo; // used in cap checks in JSX
  const listingFee = calculateListingFee(totalValueKobo);
  const { platformCut, sellerCut } = calculateConsignmentCut(totalValueKobo);

  const onFinish = (values: Record<string, any>) => {
    const fee = IS_FREE_LISTING
      ? 0
      : sellingModel === 'self-listing'
        ? listingFee / 100
        : sellingModel === 'consignment' && !IS_NO_COMMISSION
          ? platformCut / 100
          : 0;
    onContinue({ ...values, fee });
  };

  const getPricingHint = () => {
    switch (sellingModel) {
      case 'self-listing':
        return {
          icon: Wallet,
          color: 'blue',
          bg: 'bg-indigo-50 dark:bg-blue-950/30',
          border: 'border-blue dark:border-blue',
          title: IS_FREE_LISTING ? 'Free Listing!' : 'Listing Fee',
          description: IS_FREE_LISTING
            ? `Great news! Listing on ${APP_NAME} is currently free. No fees to publish your item.`
            : `A ${SELF_LISTING_FEE_PERCENT}% listing fee is required to publish your item on the marketplace. This fee is one-time and non-refundable.`,
        };
      case 'consignment':
        return {
          icon: Percent,
          color: 'violet',
          bg: 'bg-violet-50 dark:bg-violet-950/30',
          border: 'border-violet-200 dark:border-violet-800',
          title: IS_NO_COMMISSION ? 'Zero Commission!' : 'Commission Split',
          description: IS_NO_COMMISSION
            ? `${APP_NAME} is currently waiving all commission fees. You keep 100% of the sale proceeds!`
            : `When your item sells, ${APP_NAME} takes a ${CONSIGNMENT_COMMISSION_PERCENT}% commission. You receive the remaining ${
                100 - CONSIGNMENT_COMMISSION_PERCENT
              }% directly to your account.`,
        };
      case 'direct-sale':
        return {
          icon: HandCoins,
          color: 'emerald',
          bg: 'bg-emerald-50 dark:bg-emerald-950/30',
          border: 'border-emerald-200 dark:border-emerald-800',
          title: 'Your Asking Price',
          description:
            "Enter how much you want for this item. After review, we'll make you an offer. You can accept, counter, or decline.",
        };
    }
  };

  const hint = getPricingHint();
  const HintIcon = hint.icon;

  return (
    <Form
      form={form}
      layout="vertical"
      requiredMark={false}
      onFinish={onFinish}
      className="space-y-5"
      initialValues={initialData}
    >
      <div className="space-y-5">
        {/* State & City */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Form.Item
            name="state"
            rules={[{ required: true, message: 'Select state' }]}
            label={<span className="font-semibold text-sm">State</span>}
            className="mb-0"
          >
            <Select
              showSearch
              className="h-12 [&_.ant-select-selector]:!rounded-xl"
              placeholder="Select state"
              loading={loadingStates}
              filterOption={(input, option) =>
                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
              }
              onChange={handleStateChange}
              options={stateOptions}
            />
          </Form.Item>
          <Form.Item
            name="city"
            rules={[{ required: true, message: 'Select city' }]}
            label={<span className="font-semibold text-sm">City</span>}
            className="mb-0"
          >
            <Select
              showSearch
              className="h-12 [&_.ant-select-selector]:!rounded-xl"
              placeholder={selectedStateIso2 ? 'Select city' : 'Select state first'}
              loading={loadingCities}
              disabled={!selectedStateIso2}
              filterOption={(input, option) =>
                (option?.label ?? '').toString().toLowerCase().includes(input.toLowerCase())
              }
              options={cityOptions}
              notFoundContent={
                loadingCities
                  ? 'Loading cities...'
                  : selectedStateIso2
                    ? 'No cities found'
                    : 'Select a state first'
              }
            />
          </Form.Item>
        </div>

        {/* Pricing hint */}
        <div className={`${hint.bg} ${hint.border} border rounded-xl p-4 flex gap-3`}>
          <div
            className={`flex-shrink-0 w-8 h-8 rounded-lg bg-${hint.color}-100 dark:bg-${hint.color}-900/50 flex items-center justify-center`}
          >
            {IS_FREE_LISTING && sellingModel === 'self-listing' ? (
              <PartyPopper size={16} className="text-emerald-600" />
            ) : IS_NO_COMMISSION && sellingModel === 'consignment' ? (
              <PartyPopper size={16} className="text-emerald-600" />
            ) : (
              <HintIcon
                size={16}
                className={`text-${hint.color}-600 dark:text-${hint.color}-400`}
              />
            )}
          </div>
          <div>
            <h4
              className={`text-sm font-semibold text-${hint.color}-700 dark:text-${hint.color}-300`}
            >
              {hint.title}
            </h4>
            <p className="text-xs text-neutral-600 dark:text-neutral-400 mt-0.5 leading-relaxed">
              {hint.description}
            </p>
          </div>
        </div>

        {/* Ask Price */}
        <div>
          <Form.Item
            name="askPrice"
            className="tall-number-input mb-0 w-full"
            rules={[{ required: true, message: 'Enter your asking price' }]}
            label={
              <span className="font-semibold text-sm">
                {sellingModel === 'direct-sale' ? 'Your Asking Price (₦)' : 'Ask Price (₦)'}
              </span>
            }
          >
            <InputNumber
              className="w-full h-14 !rounded-xl"
              size="large"
              controls={false}
              prefix={<span className="text-neutral-400">₦</span>}
              placeholder="Enter amount"
              formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
              parser={(value: any) => value?.replace(/,/g, '')}
              onChange={(value) => setAskPrice(Number(value) || 0)}
            />
          </Form.Item>

          {/* Fee/Commission Breakdown */}
          <AnimatePresence>
            {askPrice > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="mt-3 bg-neutral-50 dark:bg-neutral-800/50 rounded-xl p-3 space-y-2">
                  {sellingModel === 'self-listing' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Unit Price</span>
                        <span className="font-medium">₦{askPrice.toLocaleString()}</span>
                      </div>
                      {quantity > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Quantity</span>
                          <span className="font-medium">× {quantity}</span>
                        </div>
                      )}
                      {quantity > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Total Value</span>
                          <span className="font-medium">
                            ₦{(askPrice * quantity).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">
                          Listing Fee ({SELF_LISTING_FEE_PERCENT}%
                          {LISTING_FEE_CAP_KOBO > 0 && priceInKobo > LISTING_FEE_CAP_KOBO
                            ? ' · capped'
                            : ''}
                          )
                        </span>
                        {IS_FREE_LISTING ? (
                          <span className="font-semibold">
                            <span className="line-through text-neutral-400 mr-1.5">
                              ₦{(listingFee / 100).toLocaleString()}
                            </span>
                            <span className="text-emerald-600">₦0 (Free)</span>
                          </span>
                        ) : (
                          <span className="font-semibold text-blue">
                            ₦{(listingFee / 100).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {LISTING_FEE_CAP_KOBO > 0 &&
                        priceInKobo > LISTING_FEE_CAP_KOBO &&
                        !IS_FREE_LISTING && (
                          <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <Info size={11} /> Fee capped at {SELF_LISTING_FEE_PERCENT}% of ₦
                            {(LISTING_FEE_CAP_KOBO / 100).toLocaleString()}
                          </p>
                        )}
                      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 flex justify-between text-sm">
                        <span className="text-neutral-600 font-medium">
                          Fee to pay after review
                        </span>
                        <span className="font-bold text-blue">
                          {IS_FREE_LISTING ? '₦0' : `₦${(listingFee / 100).toLocaleString()}`}
                        </span>
                      </div>
                      {IS_FREE_LISTING && (
                        <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                          <PartyPopper size={12} /> Listing is free for a limited time!
                        </p>
                      )}
                    </>
                  )}

                  {sellingModel === 'consignment' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Unit Price</span>
                        <span className="font-medium">₦{askPrice.toLocaleString()}</span>
                      </div>
                      {quantity > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Quantity</span>
                          <span className="font-medium">× {quantity}</span>
                        </div>
                      )}
                      {quantity > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Total Value</span>
                          <span className="font-medium">
                            ₦{(askPrice * quantity).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">
                          Platform Commission ({CONSIGNMENT_COMMISSION_PERCENT}%
                          {CONSIGNMENT_COMMISSION_CAP_KOBO > 0 &&
                          priceInKobo > CONSIGNMENT_COMMISSION_CAP_KOBO
                            ? ' · capped'
                            : ''}
                          )
                        </span>
                        {IS_NO_COMMISSION ? (
                          <span className="font-medium">
                            <span className="line-through text-neutral-400 mr-1.5">
                              ₦{(platformCut / 100).toLocaleString()}
                            </span>
                            <span className="text-emerald-600">₦0</span>
                          </span>
                        ) : (
                          <span className="font-medium text-violet-600">
                            ₦{(platformCut / 100).toLocaleString()}
                          </span>
                        )}
                      </div>
                      {CONSIGNMENT_COMMISSION_CAP_KOBO > 0 &&
                        priceInKobo > CONSIGNMENT_COMMISSION_CAP_KOBO &&
                        !IS_NO_COMMISSION && (
                          <p className="text-[11px] text-neutral-400 flex items-center gap-1">
                            <Info size={11} /> Commission capped at {CONSIGNMENT_COMMISSION_PERCENT}
                            % of ₦{(CONSIGNMENT_COMMISSION_CAP_KOBO / 100).toLocaleString()}
                          </p>
                        )}
                      <div className="border-t border-neutral-200 dark:border-neutral-700 pt-2 flex justify-between text-sm">
                        <span className="text-neutral-600 font-medium">You receive when sold</span>
                        <span className="font-bold text-emerald-600">
                          ₦
                          {IS_NO_COMMISSION
                            ? (askPrice * quantity).toLocaleString()
                            : (sellerCut / 100).toLocaleString()}
                        </span>
                      </div>
                      {IS_NO_COMMISSION && (
                        <p className="text-[11px] text-emerald-600 font-medium flex items-center gap-1 mt-1">
                          <PartyPopper size={12} /> Commission is waived — you keep 100%!
                        </p>
                      )}
                    </>
                  )}

                  {sellingModel === 'direct-sale' && (
                    <>
                      <div className="flex justify-between text-sm">
                        <span className="text-neutral-500">Your asking price (per unit)</span>
                        <span className="font-medium">₦{askPrice.toLocaleString()}</span>
                      </div>
                      {quantity > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Quantity</span>
                          <span className="font-medium">× {quantity}</span>
                        </div>
                      )}
                      {quantity > 1 && (
                        <div className="flex justify-between text-sm">
                          <span className="text-neutral-500">Total Value</span>
                          <span className="font-medium">
                            ₦{(askPrice * quantity).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex items-center gap-1.5 text-xs text-neutral-400 mt-1">
                        <Info size={12} />
                        <span>We'll review and make you an offer after approval</span>
                      </div>
                    </>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Negotiable */}
        {sellingModel !== 'direct-sale' && (
          <Form.Item
            name="negotiable"
            className="mb-0"
            rules={[{ required: true, message: 'Select an option' }]}
            label={<span className="font-semibold text-sm">Open to Negotiation?</span>}
          >
            <Select
              options={[
                { label: 'Yes — Buyers can negotiate the price', value: true },
                { label: 'No — Price is fixed', value: false },
              ]}
              className="h-12 [&_.ant-select-selector]:!rounded-xl"
              placeholder="Select option"
            />
          </Form.Item>
        )}
      </div>

      {/* Actions */}
      <div className="flex justify-between pt-4 border-t border-neutral-100 dark:border-neutral-700">
        <button
          type="button"
          onClick={onBack}
          className="px-5 py-2.5 text-sm text-neutral-600 dark:text-neutral-400 hover:bg-neutral-100 dark:hover:bg-neutral-800 rounded-xl transition-colors font-medium"
        >
          Back
        </button>
        <button
          type="submit"
          className="px-8 py-2.5 text-sm font-semibold bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white rounded-xl shadow-md shadow-blue/20 hover:shadow-lg transition-all"
        >
          Continue
        </button>
      </div>
    </Form>
  );
};

export default SellItemPricing;
