import { Currencies } from '@grc/_shared/constant';
import { numberFormat } from '@grc/_shared/helpers';
import { Slider, Tag } from 'antd';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';

// Define types
type Condition = 'new' | 'used' | 'refurbished';
type Category = string;

// FilterPanel Component
const FilterPanel = () => {
  const [priceRange, setPriceRange] = useState<number[]>([0, 1000]);
  const [selectedConditions, setSelectedConditions] = useState<Condition[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<Category[]>([]);
  const [activeSection, setActiveSection] = useState<'all' | 'price' | 'condition' | 'category'>(
    'all'
  );

  const conditions: { value: Condition; label: string }[] = [
    { value: 'new', label: 'Brand New' },
    { value: 'used', label: 'Fairly Used' },
    { value: 'refurbished', label: 'Refurbished' },
  ];

  const categories: Category[] = [
    'Electronics',
    'Fashion',
    'Home & Living',
    'Sports',
    'Books',
    'Automotive',
    'Health & Beauty',
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

  // Rest of your component remains the same until the categories mapping
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
                  ? 'bg-blue-50 bg-gray-100 dark:bg-gray-700 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'
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
                    max={1000}
                    value={priceRange}
                    onChange={(value: number[]) => setPriceRange(value)}
                    tooltip={{
                      formatter: (value) => `$${value}`,
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
                            ? 'bg-blue text-white border-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
                            : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700'
                        }`}
                      onClick={() => {
                        setSelectedConditions((prev) =>
                          prev.includes(condition.value)
                            ? prev.filter((c) => c !== condition.value)
                            : [...prev, condition.value]
                        );
                      }}
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
                            ? 'bg-blue text-white border-blue-200 dark:bg-blue-900/30 dark:text-blue-400'
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

      {/* Apply Filters Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mt-6 flex justify-end gap-3"
      >
        <button
          onClick={() => {
            setSelectedCategories([]);
            setSelectedConditions([]);
            setPriceRange([0, 1000]);
          }}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 transition-colors"
        >
          Reset
        </button>
        <button className="px-6 py-2 bg-blue hover:bg-blue-600 text-white rounded-lg transition-colors text-sm">
          Apply Filters
        </button>
      </motion.div>
    </motion.div>
  );
};

export default FilterPanel;
