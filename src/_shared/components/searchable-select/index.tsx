import { AnimatePresence } from 'framer-motion';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';

export interface LocationOption {
  name: string;
  iso2?: string;
}

export const SearchableSelect = ({
  options,
  value,
  onChange,
  placeholder,
  searchPlaceholder,
  loading,
  icon: Icon,
  disabled,
}: {
  options: LocationOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder: string;
  loading?: boolean;
  icon?: React.ElementType;
  disabled?: boolean;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const filteredOptions = options.filter((opt) =>
    opt.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => !disabled && setIsOpen(!isOpen)}
        className={`w-full pl-10 pr-10 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800 text-left text-sm flex items-center transition-all focus:ring-2 focus:ring-blue/20 focus:border-blue outline-none ${
          disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
        }`}
      >
        {Icon && (
          <Icon size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-neutral-400" />
        )}
        <span className={value ? 'text-neutral-900 dark:text-white' : 'text-neutral-400'}>
          {value || placeholder}
        </span>
        <ChevronDown
          size={16}
          className={`absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-full mt-1 bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-xl shadow-xl overflow-hidden"
          >
            <div className="p-2 border-b border-neutral-100 dark:border-neutral-700">
              <div className="relative">
                <Search
                  size={14}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400"
                />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={searchPlaceholder}
                  className="w-full pl-8 pr-3 py-2 text-sm rounded-lg border border-neutral-100 dark:border-neutral-700 bg-neutral-50 dark:bg-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-blue"
                  autoFocus
                />
              </div>
            </div>
            <div className="max-h-48 overflow-y-auto">
              {loading ? (
                <div className="p-4 text-center text-sm text-neutral-400 flex items-center justify-center gap-2">
                  <Loader2 size={14} className="animate-spin" /> Loading...
                </div>
              ) : filteredOptions.length === 0 ? (
                <div className="p-4 text-center text-sm text-neutral-400">No results found</div>
              ) : (
                filteredOptions.map((opt) => (
                  <button
                    key={opt.name}
                    type="button"
                    onClick={() => {
                      onChange(opt.name);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                      value === opt.name
                        ? 'bg-blue-50 dark:bg-blue-900/30 text-blue dark:text-blue font-medium'
                        : 'text-neutral-700 dark:text-neutral-200 hover:bg-neutral-50 dark:hover:bg-neutral-700'
                    }`}
                  >
                    {opt.name}
                  </button>
                ))
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      {isOpen && <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />}
    </div>
  );
};
