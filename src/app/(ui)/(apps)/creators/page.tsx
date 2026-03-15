'use client';

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { fetchData } from '@grc/_shared/helpers';
import { useRouter } from 'next/navigation';
import { useCreators } from '@grc/hooks/useCreators';
import { useStores } from '@grc/hooks/useStores';
import { LocationOption } from '@grc/components/apps/creator-account-setup';
import Creators from '@grc/components/apps/find-creators';
import { isEmpty, omit } from 'lodash';
import { useScrollRestore } from '@grc/hooks/useScrollRestore';

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTS
// ═══════════════════════════════════════════════════════════════════════════

const NIGERIA_ISO2 = 'NG';
const PER_PAGE = 12;

// ═══════════════════════════════════════════════════════════════════════════
// PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const CreatorsPage = () => {
  const router = useRouter();

  // ── Shared filter state ─────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'creators' | 'stores'>('creators');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterIndustry, setFilterIndustry] = useState<string | null>(null);
  const [filterState, setFilterState] = useState<string | null>(null);
  const [filterCity, setFilterCity] = useState<string | null>(null);

  // ── Pagination state (separate per tab) ─────────────────────────────
  const [creatorsPage, setCreatorsPage] = useState(1);
  const [storesPage, setStoresPage] = useState(1);
  const [creatorsList, setCreatorsList] = useState<any[]>([]);
  const [storesList, setStoresList] = useState<any[]>([]);
  const [hasMoreCreators, setHasMoreCreators] = useState(true);
  const [hasMoreStores, setHasMoreStores] = useState(true);

  // ── Location state ──────────────────────────────────────────────────
  const [states, setStates] = useState<LocationOption[]>([]);
  const [cities, setCities] = useState<LocationOption[]>([]);
  const [loadingStates, setLoadingStates] = useState(false);
  const [loadingCities, setLoadingCities] = useState(false);

  // ── Hooks ───────────────────────────────────────────────────────────
  const { browseCreators, isFetchingCreators } = useCreators();

  const { browseStores, isFetchingStores } = useStores();

  // ── Track if this is a "load more" vs fresh search ──────────────────
  const isLoadingMoreRef = useRef(false);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const dataReady = creatorsList.length > 0 || storesList.length > 0;
  const { saveScrollPosition } = useScrollRestore(dataReady, scrollContainerRef);

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

  // ── Fetch cities when state filter changes ──────────────────────────
  useEffect(() => {
    if (!filterState) {
      setCities([]);
      return;
    }

    const selectedState = states.find((s) => s.name.toLowerCase() === filterState.toLowerCase());
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
  }, [filterState, states]);

  // ── Build query params ──────────────────────────────────────────────
  const buildParams = useCallback(
    (page: number) => {
      const params: Record<string, any> = {
        page,
        perPage: PER_PAGE,
      };
      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (filterIndustry) params.industry = filterIndustry;
      if (filterState) params.state = filterState;
      if (filterCity) params.city = filterCity;
      return params;
    },
    [searchQuery, filterIndustry, filterState, filterCity]
  );

  // ── Fetch creators ─────────────────────────────────────────────────
  const fetchCreatorsList = useCallback(
    async (page: number, append = false) => {
      try {
        const params = buildParams(page);
        const result = await browseCreators(params);
        const items = result?.data || [];

        if (append) {
          setCreatorsList((prev) => [...prev, ...items]);
        } else {
          setCreatorsList(items);
        }

        setHasMoreCreators(items.length >= PER_PAGE);
      } catch (err) {
        console.error('Error fetching creators:', err);
        if (!append) setCreatorsList([]);
        setHasMoreCreators(false);
      }
    },
    [buildParams, browseCreators]
  );

  // ── Fetch stores ───────────────────────────────────────────────────
  const fetchStoresList = useCallback(
    async (page: number, append = false) => {
      try {
        const params = buildParams(page);
        const result = await browseStores({
          ...omit(params, 'industry'),
          ...(!isEmpty(params?.industry) ? { category: params?.industry ?? '' } : {}),
        });
        const items = result?.data || [];

        if (append) {
          setStoresList((prev) => [...prev, ...items]);
        } else {
          setStoresList(items);
        }

        setHasMoreStores(items.length >= PER_PAGE);
      } catch (err) {
        console.error('Error fetching stores:', err);
        if (!append) setStoresList([]);
        setHasMoreStores(false);
      }
    },
    [buildParams, browseStores]
  );

  // ── Initial fetch + refetch on filter changes ──────────────────────
  useEffect(() => {
    setCreatorsPage(1);
    setStoresPage(1);
    setHasMoreCreators(true);
    setHasMoreStores(true);
    fetchCreatorsList(1, false);
    fetchStoresList(1, false);
  }, [searchQuery, filterIndustry, filterState, filterCity]);

  // ── Load more handlers ─────────────────────────────────────────────
  const handleLoadMoreCreators = useCallback(() => {
    if (isFetchingCreators || !hasMoreCreators || isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    const nextPage = creatorsPage + 1;
    setCreatorsPage(nextPage);
    fetchCreatorsList(nextPage, true).finally(() => {
      isLoadingMoreRef.current = false;
    });
  }, [creatorsPage, isFetchingCreators, hasMoreCreators, fetchCreatorsList]);

  const handleLoadMoreStores = useCallback(() => {
    if (isFetchingStores || !hasMoreStores || isLoadingMoreRef.current) return;
    isLoadingMoreRef.current = true;
    const nextPage = storesPage + 1;
    setStoresPage(nextPage);
    fetchStoresList(nextPage, true).finally(() => {
      isLoadingMoreRef.current = false;
    });
  }, [storesPage, isFetchingStores, hasMoreStores, fetchStoresList]);

  // ── Navigation ─────────────────────────────────────────────────────
  const handleSelectCreator = useCallback(
    (username: string) => {
      saveScrollPosition();
      router.push(`/creators/${encodeURIComponent(username)}`);
    },
    [router, saveScrollPosition]
  );

  const handleSelectStore = useCallback(
    (id: string) => {
      saveScrollPosition();
      router.push(`/stores/${id}`);
    },
    [router, saveScrollPosition]
  );

  // ── Filter handlers ────────────────────────────────────────────────
  const handleStateChange = useCallback((state: string | null) => {
    setFilterState(state);
    setFilterCity(null);
  }, []);

  const handleClearFilters = useCallback(() => {
    setSearchQuery('');
    setFilterIndustry(null);
    setFilterState(null);
    setFilterCity(null);
  }, []);

  // ── Render ─────────────────────────────────────────────────────────
  return (
    <Creators
      // Tab
      activeTab={activeTab}
      onTabChange={setActiveTab}
      // Data
      creators={creatorsList}
      stores={storesList}
      // Loading
      isLoadingCreators={isFetchingCreators && creatorsPage === 1}
      isLoadingStores={isFetchingStores && storesPage === 1}
      isLoadingMoreCreators={isFetchingCreators && creatorsPage > 1}
      isLoadingMoreStores={isFetchingStores && storesPage > 1}
      // Pagination
      hasMoreCreators={hasMoreCreators}
      hasMoreStores={hasMoreStores}
      onLoadMoreCreators={handleLoadMoreCreators}
      onLoadMoreStores={handleLoadMoreStores}
      // Filters
      searchQuery={searchQuery}
      onSearchChange={setSearchQuery}
      filterIndustry={filterIndustry}
      onIndustryChange={setFilterIndustry}
      filterState={filterState}
      onStateChange={handleStateChange}
      filterCity={filterCity}
      onCityChange={setFilterCity}
      onClearFilters={handleClearFilters}
      // Location data
      states={states}
      cities={cities}
      loadingStates={loadingStates}
      loadingCities={loadingCities}
      // Navigation
      onSelectCreator={handleSelectCreator}
      onSelectStore={handleSelectStore}
      // Scroll restore
      scrollContainerRef={scrollContainerRef}
    />
  );
};

export default CreatorsPage;
