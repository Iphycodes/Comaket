'use client';

import { Button } from 'antd';
import { Dispatch, SetStateAction } from 'react';
interface TopButtonsProps {
  setModalOpen: Dispatch<SetStateAction<boolean>>;
  setModalElement: Dispatch<
    SetStateAction<'top-up-balance' | 'single-payout' | 'batch-payout' | ''>
  >;
}

const TopButtons = ({ setModalOpen, setModalElement }: TopButtonsProps) => {
  const handleButtonClick = (key: 'top-up-balance' | 'single-payout' | 'batch-payout') => {
    setModalOpen(true);

    setModalElement(key);
  };
  return (
    <div className="flex items-center justify-between gap-3">
      <Button
        onClick={() => handleButtonClick('top-up-balance')}
        className="opacity-100 flex items-center bg-blue text-white h-12"
        type="primary"
        disabled={false}
        loading={false}
      >
        <div className="flex items-center gap-2">
          <span>
            <i className="ri-add-line text-[20px]"></i>
          </span>
          <span>Top Up Balance</span>
        </div>
      </Button>
      <Button
        onClick={() => handleButtonClick('single-payout')}
        className="opacity-100 hover:opacity-95 font-normal bg-green-600 text-white h-12"
        type="primary"
        disabled={false}
        loading={false}
      >
        <div className="flex items-center gap-2">
          <span>
            <i className="ri-send-plane-fill text-[18px]"></i>
          </span>
          <span>Initate Single Payout</span>
        </div>
      </Button>
      <Button
        onClick={() => handleButtonClick('batch-payout')}
        className="opacity-100 font-normal dark:border dark:border-gray-500 bg-gray-800 text-white h-12"
        type="primary"
        disabled={true}
        loading={false}
      >
        <div className="flex items-center gap-2">
          <span>
            <i className="ri-checkbox-multiple-fill text-[18px]"></i>
          </span>
          <span>Initiate Batch Payout</span>
        </div>
      </Button>
    </div>
  );
};

export default TopButtons;
