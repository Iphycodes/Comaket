import React, { useState } from 'react';
import { Button, Input, Select } from 'antd';
import { Search, X, ChevronDown } from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

// Interface for the SearchBar props
interface SearchBarProps {
  onSearch: (searchValue: string, category: string) => void;
  className?: string; // Allow custom className to be passed for positioning/styling
  section: 'sell-item' | 'market';
}

// Interface for category options
interface CategoryOption {
  value: string;
  label: string;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSearch, className, section }) => {
  const [searchValue, setSearchValue] = useState<string>('');
  const [searchCategory, setSearchCategory] = useState<string>('all');
  const isMobile = useMediaQuery(mediaSize.mobile);
  const isDesktop = useMediaQuery(mediaSize.desktop);

  const categories: CategoryOption[] = [
    { value: 'all', label: 'All Categories' },
    { value: 'electronics', label: 'Electronics' },
    { value: 'fashion', label: 'Fashion' },
    { value: 'home', label: 'Home & Living' },
  ];

  const statusOptions: CategoryOption[] = [
    { value: 'all', label: 'All Status' },
    { value: 'approved', label: 'Approved' },
    { value: 'pending', label: 'Pending' },
    { value: 'rejected', label: 'Rejected' },
  ];

  return (
    <div className={`w-full ${className}`}>
      <div className="flex gap-2 w-full">
        {isDesktop && (
          <Select
            defaultValue="all"
            onChange={setSearchCategory}
            className={`category-select w-[200px] ${isMobile ? 'h-10' : 'h-12'}`}
            options={section === 'market' ? categories : statusOptions}
            suffixIcon={<ChevronDown size={16} />}
          />
        )}

        <div className="flex-1 flex gap-2">
          <div className="flex-1 relative">
            <Input
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Search for anything..."
              className={`${
                isMobile ? 'h-10' : 'h-12'
              } !w-full pl-11 pr-4 rounded-xl border-gray-200 hover:border-blue-400 focus:border-blue-500 transition-colors`}
              suffix={
                searchValue && (
                  <X
                    size={16}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                    onClick={() => setSearchValue('')}
                  />
                )
              }
              style={{ width: '100%' }}
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          </div>
          <Button
            onClick={() => onSearch(searchValue, searchCategory)}
            className={`${
              isMobile ? 'h-10' : 'h-12 px-6'
            } !bg-blue hover:bg-blue-600 !text-white hover:!text-white rounded-xl transition-colors flex items-center gap-2`}
          >
            <Search size={isMobile ? 14 : 18} />
            Search
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchBar;
