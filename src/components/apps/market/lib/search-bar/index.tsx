import React, { useState, useCallback, useRef } from 'react';
import { Button, Input } from 'antd';
import { Search, X } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

interface SearchBarProps {
  onSearch: (searchValue: string, category: string) => void;
  className?: string;
  section: 'sell-item' | 'market';
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchCategory] = useState<string>('all');
  const isMobile = useMediaQuery(mediaSize.mobile);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const inputRef = useRef<any>(null);

  // Debounced search on typing
  const handleChange = useCallback(
    (value: string) => {
      setSearchValue(value);

      if (value === '') {
        handleClear();
      }
      // if (debounceRef.current) clearTimeout(debounceRef.current);
      // debounceRef.current = setTimeout(() => {
      //   onSearch(value, searchCategory);
      // }, 500);
    },
    [searchCategory]
  );

  const handleClear = useCallback(() => {
    setSearchValue('');
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSearch('', searchCategory);
    inputRef.current?.focus();
  }, [onSearch, searchCategory]);

  const handleSubmit = useCallback(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    onSearch(searchValue, searchCategory);
  }, [onSearch, searchValue, searchCategory]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        if (debounceRef.current) clearTimeout(debounceRef.current);
        onSearch(searchValue, searchCategory);
      }
    },
    [onSearch, searchValue, searchCategory]
  );

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-2 w-full">
        {/* {isDesktop && (
          <Select
            value={searchCategory}
            onChange={handleCategoryChange}
            className={`category-select w-[200px] ${isMobile ? 'h-10' : 'h-12'}`}
            options={section === 'market' ? categories : statusOptions}
            suffixIcon={<ChevronDown size={16} />}
          />
        )} */}

        <div className={`flex-1 flex ${isMobile ? 'gap-0' : 'gap-2'}`}>
          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              value={searchValue}
              onChange={(e) => handleChange(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search for anything..."
              className={`${isMobile ? 'h-10' : 'h-12'} !w-full ${
                isMobile ? 'pl-7' : 'pl-11'
              } pr-4 ${
                isMobile ? 'rounded-lg rounded-r-none border-r-0' : 'rounded-xl'
              } border-neutral-200 dark:border-neutral-700 hover:border-blue focus:border-blue transition-colors`}
              suffix={
                <X
                  size={16}
                  className={`cursor-pointer transition-opacity ${
                    searchValue
                      ? 'text-neutral-400 hover:text-neutral-600 opacity-100'
                      : 'opacity-0 pointer-events-none'
                  }`}
                  onClick={handleClear}
                />
              }
              style={{ width: '100%' }}
            />
            <Search
              className={`absolute ${
                isMobile ? 'left-2' : 'left-4'
              } top-1/2 -translate-y-1/2 text-neutral-400 z-10 pointer-events-none`}
              size={isMobile ? 16 : 18}
            />
          </div>
          <Button
            onClick={handleSubmit}
            className={`${
              isMobile ? 'h-10' : 'h-12 px-6'
            } !bg-blue hover:bg-blue !text-white hover:!text-white ${
              isMobile ? 'rounded-lg rounded-l-none border-l-0' : 'rounded-xl'
            } transition-colors flex items-center gap-2`}
          >
            <Search size={isMobile ? 14 : 18} />
            {!isMobile && <span>Search</span>}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
