'use client';

import { Button, Input } from 'antd';

interface TopBarProps {
  handleDrawerToggle: () => void;
}

const TopBar = ({ handleDrawerToggle }: TopBarProps) => {
  return (
    <div className="flex justify-between gap-3 items-center">
      <Input
        placeholder={'Search Transaction...'}
        size="large"
        className="bg-gray-50 dark:bg-gray-800 w-80 border-gray-300 rounded-md shadow-sm"
        style={{ borderRadius: '5px' }}
      />
      <Button
        className="flex justify-center bg-cyan-50 dark:bg-gray-800 border-blue dark:border-gray-300 items-center h-12 w-12"
        shape="circle"
        onClick={() => handleDrawerToggle()}
      >
        <i className="ri-filter-line text-[22px] text-blue dark:text-gray-300"></i>
      </Button>
    </div>
  );
};

export default TopBar;
