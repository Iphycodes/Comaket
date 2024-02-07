'use client';

import { Badge, Button, Input } from 'antd';
import { isEmpty } from 'lodash';
import { ChangeEvent, Dispatch, SetStateAction } from 'react';

interface TopBarProps {
  handleDrawerToggle: () => void;
  setSearchValue: Dispatch<SetStateAction<string>>;
  transactionsData: Record<string, any>[];
  filter?: Record<string, any>;
}

const TopBar = ({ handleDrawerToggle, setSearchValue, transactionsData, filter }: TopBarProps) => {
  const handleSearch = (event: ChangeEvent<HTMLInputElement>) => {
    const inputValue = event.target.value;
    setSearchValue(inputValue);
  };

  return (
    <div className="flex justify-between gap-3 items-center">
      {!isEmpty(transactionsData) && (
        <Input
          placeholder={'Search Transaction...'}
          size="large"
          className="bg-gray-50 dark:bg-gray-800 w-80 border-gray-300 rounded-md shadow-sm"
          style={{ borderRadius: '5px' }}
          onChange={handleSearch}
        />
      )}
      <Button
        className="flex justify-center relative bg-cyan-50 dark:bg-gray-800 border-blue dark:border-gray-300 items-center h-12 w-12"
        shape="circle"
        onClick={() => handleDrawerToggle()}
      >
        {!isEmpty(filter?.filterData) && (
          <Badge
            count={Object.keys(filter?.filterData).length}
            // count={5}
            color="#e0ae26"
            // style={{ position: 'absolute', left: -10, top: -4 }}
            className="absolute top-[-4px] left-[-8px]"
            size={'default'}
          />
        )}
        <i className="ri-filter-line text-[22px] text-blue dark:text-gray-300"></i>
      </Button>
    </div>
  );
};

export default TopBar;
