import { CREATOR_INDUSTRIES, Currencies } from '@grc/_shared/constant';
import { numberFormat } from '@grc/_shared/helpers';
import { MarketFilters } from '@grc/_shared/helpers/transform-listing';
import { Slider } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { X, Check, RotateCcw } from 'lucide-react';
import { useState, useCallback, useMemo, useEffect } from 'react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

type Condition = 'brand_new' | 'fairly_used' | 'used' | 'refurbished';
type FilterTab = 'condition' | 'category' | 'price' | 'sort';

interface FilterPanelProps {
  filters: MarketFilters;
  onApplyFilters: (filters: MarketFilters) => void;
  onResetFilters: () => void;
}

const conditions: { value: Condition; label: string; emoji: string }[] = [
  { value: 'brand_new', label: 'Brand New', emoji: '' },
  { value: 'fairly_used', label: 'Fairly Used', emoji: '' },
  { value: 'refurbished', label: 'Refurbished', emoji: '' },
];

const sortOptions: { value: string; label: string }[] = [
  { value: '', label: 'Relevance' },
  { value: 'price_asc', label: 'Price: Low → High' },
  { value: 'price_desc', label: 'Price: High → Low' },
  { value: 'newest', label: 'Newest First' },
  { value: 'oldest', label: 'Oldest First' },
];

const pricePresets = [
  { label: 'Under ₦5K', min: 0, max: 500_000 },
  { label: '₦5K – ₦20K', min: 500_000, max: 2_000_000 },
  { label: '₦20K – ₦100K', min: 2_000_000, max: 10_000_000 },
  { label: '₦100K – ₦500K', min: 10_000_000, max: 50_000_000 },
  { label: '₦500K+', min: 50_000_000, max: 300_000_000 },
];

const MAX_PRICE = 300_000_000;

const FilterPanel: React.FC<FilterPanelProps> = ({ filters, onApplyFilters, onResetFilters }) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  const [activeTab, setActiveTab] = useState<FilterTab>('condition');
  const [priceRange, setPriceRange] = useState<number[]>([
    filters.minPrice ?? 0,
    filters.maxPrice ?? MAX_PRICE,
  ]);
  const [selectedCondition, setSelectedCondition] = useState<Condition | ''>(
    (filters.condition as Condition) || ''
  );
  const [selectedIndustry, setSelectedIndustry] = useState<string>(filters.category || '');
  const [selectedSort, setSelectedSort] = useState<string>(filters.sort || '');

  useEffect(() => {
    setPriceRange([filters.minPrice ?? 0, filters.maxPrice ?? MAX_PRICE]);
    setSelectedCondition((filters.condition as Condition) || '');
    setSelectedIndustry(filters.category || '');
    setSelectedSort(filters.sort || '');
  }, [filters]);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (priceRange[0] > 0 || priceRange[1] < MAX_PRICE) count++;
    if (selectedCondition) count++;
    if (selectedIndustry) count++;
    if (selectedSort) count++;
    return count;
  }, [priceRange, selectedCondition, selectedIndustry, selectedSort]);

  const tabHasValue = useCallback(
    (tab: FilterTab): boolean => {
      switch (tab) {
        case 'condition':
          return !!selectedCondition;
        case 'category':
          return !!selectedIndustry;
        case 'price':
          return priceRange[0] > 0 || priceRange[1] < MAX_PRICE;
        case 'sort':
          return !!selectedSort;
        default:
          return false;
      }
    },
    [selectedCondition, selectedIndustry, priceRange, selectedSort]
  );

  const handleApply = useCallback(() => {
    const newFilters: MarketFilters = {};
    if (priceRange[0] > 0) newFilters.minPrice = priceRange[0];
    if (priceRange[1] < MAX_PRICE) newFilters.maxPrice = priceRange[1];
    if (selectedCondition) newFilters.condition = selectedCondition;
    if (selectedIndustry) newFilters.category = selectedIndustry;
    if (selectedSort) newFilters.sort = selectedSort;
    onApplyFilters(newFilters);
  }, [priceRange, selectedCondition, selectedIndustry, selectedSort, onApplyFilters]);

  const handleReset = useCallback(() => {
    setPriceRange([0, MAX_PRICE]);
    setSelectedCondition('');
    setSelectedIndustry('');
    setSelectedSort('');
    onResetFilters();
  }, [onResetFilters]);

  const tabs: { id: FilterTab; label: string }[] = [
    { id: 'condition', label: 'Condition' },
    { id: 'category', label: 'Category' },
    { id: 'price', label: 'Price' },
    { id: 'sort', label: 'Sort' },
  ];

  // ── Active Filter Chips ──
  const ActiveChips = () => {
    if (activeFilterCount === 0) return null;
    return (
      <div className="flex flex-wrap gap-1.5 mb-3">
        {selectedCondition && (
          <motion.span
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setSelectedCondition('')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue/10 text-blue cursor-pointer hover:bg-blue/20 transition-colors"
          >
            {conditions.find((c) => c.value === selectedCondition)?.emoji}{' '}
            {conditions.find((c) => c.value === selectedCondition)?.label}
            <X size={12} />
          </motion.span>
        )}
        {selectedIndustry && (
          <motion.span
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setSelectedIndustry('')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue/10 text-blue cursor-pointer hover:bg-blue/20 transition-colors"
          >
            {CREATOR_INDUSTRIES.find((i) => i.id === selectedIndustry)?.label || selectedIndustry}
            <X size={12} />
          </motion.span>
        )}
        {(priceRange[0] > 0 || priceRange[1] < MAX_PRICE) && (
          <motion.span
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setPriceRange([0, MAX_PRICE])}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue/10 text-blue cursor-pointer hover:bg-blue/20 transition-colors"
          >
            {numberFormat(priceRange[0] / 100, Currencies.NGN)} –{' '}
            {numberFormat(priceRange[1] / 100, Currencies.NGN)}
            <X size={12} />
          </motion.span>
        )}
        {selectedSort && (
          <motion.span
            layout
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            onClick={() => setSelectedSort('')}
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-medium bg-blue/10 text-blue cursor-pointer hover:bg-blue/20 transition-colors"
          >
            {sortOptions.find((s) => s.value === selectedSort)?.label}
            <X size={12} />
          </motion.span>
        )}
      </div>
    );
  };

  // ── Tab Content Panels ──
  const ConditionContent = () => (
    <div className={`${isMobile ? 'grid grid-cols-2' : 'flex flex-wrap'} gap-2`}>
      {conditions.map((c) => (
        <button
          key={c.value}
          onClick={() => setSelectedCondition(selectedCondition === c.value ? '' : c.value)}
          className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium transition-all border ${
            selectedCondition === c.value
              ? 'bg-blue/5 text-blue border-blue/30 dark:bg-blue/10 dark:border-blue/40 shadow-sm'
              : 'bg-neutral-50 dark:bg-zinc-800/60 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-700 hover:border-neutral-300 dark:hover:border-zinc-600'
          }`}
        >
          <span className="text-sm">{c.emoji}</span>
          <span>{c.label}</span>
          {selectedCondition === c.value && <Check size={13} className="ml-auto text-blue" />}
        </button>
      ))}
    </div>
  );

  const CategoryContent = () => (
    <div
      className={`flex flex-wrap gap-2 ${
        isMobile ? 'max-h-[180px]' : 'max-h-[140px]'
      } overflow-y-auto`}
    >
      {CREATOR_INDUSTRIES.map((ind) => (
        <button
          key={ind.id}
          onClick={() => setSelectedIndustry(selectedIndustry === ind.id ? '' : ind.id)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border whitespace-nowrap ${
            selectedIndustry === ind.id
              ? 'bg-blue text-white border-blue shadow-sm'
              : 'bg-neutral-50 dark:bg-zinc-800/60 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-700 hover:border-neutral-300 dark:hover:border-zinc-600'
          }`}
        >
          <i className={`${ind.icon} mr-1 text-[11px]`} />
          {ind.label}
        </button>
      ))}
    </div>
  );

  const PriceContent = () => (
    <div>
      {/* Quick Presets */}
      <div className="flex flex-wrap gap-1.5 mb-4">
        {pricePresets.map((preset) => (
          <button
            key={preset.label}
            onClick={() => setPriceRange([preset.min, preset.max])}
            className={`px-2.5 py-1.5 rounded-full text-[11px] font-medium transition-all border ${
              priceRange[0] === preset.min && priceRange[1] === preset.max
                ? 'bg-blue/10 text-blue border-blue/30 dark:bg-blue/15 dark:border-blue/40'
                : 'bg-neutral-50 dark:bg-zinc-800/60 text-neutral-500 dark:text-neutral-400 border-neutral-200 dark:border-zinc-700 hover:border-neutral-300 dark:hover:border-zinc-600'
            }`}
          >
            {preset.label}
          </button>
        ))}
      </div>

      {/* Slider */}
      <div className="px-1">
        <Slider
          range
          min={0}
          max={MAX_PRICE}
          step={1_000_000}
          value={priceRange}
          onChange={(value: number[]) => setPriceRange(value)}
          tooltip={{
            formatter: (value) => numberFormat((value ?? 0) / 100, Currencies.NGN),
          }}
        />
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
          {numberFormat(priceRange[0] / 100, Currencies.NGN)}
        </span>
        <span className="text-[11px] font-medium text-neutral-500 dark:text-neutral-400 bg-neutral-50 dark:bg-zinc-800 px-2 py-0.5 rounded-md">
          {numberFormat(priceRange[1] / 100, Currencies.NGN)}
        </span>
      </div>
    </div>
  );

  const SortContent = () => (
    <div className="flex flex-wrap gap-2">
      {sortOptions.map((opt) => (
        <button
          key={opt.value || 'relevance'}
          onClick={() => setSelectedSort(opt.value === selectedSort ? '' : opt.value)}
          className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
            selectedSort === opt.value
              ? 'bg-blue text-white border-blue shadow-sm'
              : 'bg-neutral-50 dark:bg-zinc-800/60 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-zinc-700 hover:border-neutral-300 dark:hover:border-zinc-600'
          }`}
        >
          {selectedSort === opt.value && <Check size={12} className="inline mr-1" />}
          {opt.label}
        </button>
      ))}
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'condition':
        return <ConditionContent />;
      case 'category':
        return <CategoryContent />;
      case 'price':
        return <PriceContent />;
      case 'sort':
        return <SortContent />;
    }
  };

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div className="bg-white dark:bg-neutral-800/90 rounded-xl mt-3 border border-neutral-100 dark:border-zinc-800 shadow-sm overflow-hidden">
      {/* ── Horizontal Tabs ── */}
      <div className="flex border-b border-neutral-100 dark:border-zinc-800 overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`relative flex items-center gap-1.5 px-4 py-2.5 text-xs font-semibold whitespace-nowrap transition-colors flex-1 justify-center ${
              activeTab === tab.id
                ? 'text-blue'
                : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'
            }`}
          >
            {tab.label}
            {tabHasValue(tab.id) && (
              <span className="w-1.5 h-1.5 rounded-full bg-blue flex-shrink-0" />
            )}
            {activeTab === tab.id && (
              <motion.div
                layoutId="filter-tab-underline"
                className="absolute bottom-0 left-0 right-0 h-[2px] bg-blue rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* ── Content ── */}
      <div className="p-4">
        <ActiveChips />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {renderTabContent()}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── Footer ── */}
      <div className="flex items-center justify-between px-4 py-3 border-t border-neutral-100 dark:border-zinc-800 bg-neutral-50/50 dark:bg-zinc-900/30">
        <button
          onClick={handleReset}
          disabled={activeFilterCount === 0}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${
            activeFilterCount === 0
              ? 'text-neutral-300 dark:text-zinc-600 cursor-not-allowed'
              : 'text-neutral-500 hover:text-neutral-700 dark:text-neutral-400 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-zinc-800'
          }`}
        >
          <RotateCcw size={13} />
          Reset
        </button>
        <button
          onClick={handleApply}
          className="px-5 py-1.5 bg-blue hover:bg-blue/90 text-white rounded-lg text-xs font-semibold transition-all shadow-sm hover:shadow-md flex items-center gap-1.5"
        >
          <Check size={14} />
          Apply{activeFilterCount > 0 ? ` (${activeFilterCount})` : ''}
        </button>
      </div>
    </div>
  );
};

export default FilterPanel;
