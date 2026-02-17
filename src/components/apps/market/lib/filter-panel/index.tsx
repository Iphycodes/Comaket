import { Currencies, mockMarketItems } from '@grc/_shared/constant';
import { numberFormat } from '@grc/_shared/helpers';
import { Slider, Tag } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { Dispatch, SetStateAction, useContext, useState } from 'react';
import { AppContext } from '@grc/app-context';

// Define types
type Condition = 'Brand New' | 'Fairly Used' | 'Uk Used';
type Category = string;

interface FilterPanelProps {
  setIsLoading: Dispatch<SetStateAction<boolean>>;
  setShowFilters: Dispatch<SetStateAction<boolean>>;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ setIsLoading, setShowFilters }) => {
  const { setShopItems } = useContext(AppContext);

  // Max price in naira (from kobo) — adjust as needed
  const MAX_PRICE = 3000000;

  const [priceRange, setPriceRange] = useState<number[]>([0, MAX_PRICE]);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'price' | 'condition' | 'category'>(
    'all'
  );

  const conditions: { value: Condition; label: string }[] = [
    { value: 'Brand New', label: 'Brand New' },
    { value: 'Fairly Used', label: 'Fairly Used' },
    { value: 'Uk Used', label: 'UK Used' },
  ];

  const categories: Category[] = [
    'Laptops',
    'Phones',
    'Electronics',
    'Audio',
    'Gaming',
    'Accessories',
    'Fashion',
    'Home & Living',
  ];

  const sections = [
    { id: 'all' as const, label: 'All Filters' },
    { id: 'price' as const, label: 'Price Range' },
    { id: 'condition' as const, label: 'Condition' },
    { id: 'category' as const, label: 'Category' },
  ];

  const handleCategoryToggle = (category: Category) => {
    setSelectedCategories((prev) =>
      prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category]
    );
  };

  const handleConditionToggle = (condition: Condition) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
  };

  const handleApplyFilters = () => {
    setIsLoading(true);

    setTimeout(() => {
      const filtered = mockMarketItems.filter((item) => {
        // Price filter (convert kobo to naira for comparison)
        const priceInNaira = (item.askingPrice?.price ?? 0) / 100;
        const priceMatch = priceInNaira >= priceRange[0] && priceInNaira <= priceRange[1];

        // Condition filter
        const conditionMatch =
          selectedConditions.length === 0 || selectedConditions.includes(item.condition);

        // Category filter
        const categoryMatch =
          selectedCategories.length === 0 ||
          selectedCategories.some((cat) => item.category?.toLowerCase() === cat.toLowerCase());

        return priceMatch && conditionMatch && categoryMatch;
      });

      setShopItems(filtered);
      setIsLoading(false);
      setShowFilters(false);
    }, 1000);
  };

  const handleReset = () => {
    setSelectedCategories([]);
    setSelectedConditions([]);
    setPriceRange([0, MAX_PRICE]);
    setIsLoading(true);

    setTimeout(() => {
      setShopItems(mockMarketItems);
      setIsLoading(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="bg-white dark:bg-gray-800 rounded-lg mt-4"
    >
      {/* Filter Sections Tabs */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`px-4 py-2 rounded-lg text-sm whitespace-nowrap transition-colors
              ${
                activeSection === section.id
                  ? 'bg-indigo-50 dark:bg-gray-700 text-blue dark:text-blue'
                  : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
              }`}
          >
            {section.label}
          </button>
        ))}
      </div>

      <div className="space-y-6">
        {/* Price Range */}
        <AnimatePresence>
          {(activeSection === 'all' || activeSection === 'price') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-3">Price Range</h3>
                <div className="px-1">
                  <Slider
                    range
                    min={0}
                    max={MAX_PRICE}
                    step={10000}
                    value={priceRange}
                    onChange={(value: number[]) => setPriceRange(value)}
                    tooltip={{
                      formatter: (value) => numberFormat(value ?? 0, Currencies.NGN),
                    }}
                  />
                </div>

                <div className="flex justify-between text-sm text-gray-500 mt-1">
                  <span>{numberFormat(priceRange[0], Currencies.NGN)}</span>
                  <span>{numberFormat(priceRange[1], Currencies.NGN)}</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Conditions */}
        <AnimatePresence>
          {(activeSection === 'all' || activeSection === 'condition') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="mb-4">
                <h3 className="text-sm font-medium mb-3">Condition</h3>
                <div className="flex flex-wrap gap-2">
                  {conditions.map((condition) => (
                    <Tag
                      key={condition.value}
                      className={`px-3 py-1 rounded-lg cursor-pointer text-sm transition-colors
                        ${
                          selectedConditions.includes(condition.value)
                            ? 'bg-blue text-white border-blue dark:bg-blue/30 dark:text-blue'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      onClick={() => handleConditionToggle(condition.value)}
                    >
                      {condition.label}
                    </Tag>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Categories */}
        <AnimatePresence>
          {(activeSection === 'all' || activeSection === 'category') && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div>
                <h3 className="text-sm font-medium mb-3">Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <Tag
                      key={category}
                      className={`px-3 py-1 rounded-lg cursor-pointer text-sm transition-colors
                        ${
                          selectedCategories.includes(category)
                            ? 'bg-blue text-white border-blue dark:bg-blue/30 dark:text-blue'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      onClick={() => handleCategoryToggle(category)}
                    >
                      {category}
                    </Tag>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Apply / Reset Buttons */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 flex justify-end gap-3"
      >
        <button
          onClick={handleReset}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100 transition-colors"
        >
          Reset
        </button>
        <button
          onClick={handleApplyFilters}
          className="px-6 py-2 bg-blue hover:bg-blue text-white rounded-lg transition-colors text-sm"
        >
          Apply Filters
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FilterPanel;
