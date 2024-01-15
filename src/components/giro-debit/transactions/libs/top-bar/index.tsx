'use client';

import { Button, Input } from 'antd';

const TopBar = () => {
  return (
    <div className="w-full flex justify-between gap-3 items-center">
      <Input
        placeholder={'Search Transaction'}
        size="large"
        className="bg-gray-100 w-80 border-gray-400"
        style={{ borderRadius: '5px' }}
      />

      <Button
        className="flex justify-center bg-cyan-50 border-cyan-700 items-center h-12 w-12"
        shape="circle"
      >
        <i className="ri-filter-line text-[22px] text-blue"></i>
      </Button>
    </div>
  );
};

export default TopBar;
