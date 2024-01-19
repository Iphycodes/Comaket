'use client';

import { Button } from 'antd';

const TopButtons = () => {
  return (
    <div className="flex items-center justify-between gap-3">
      <Button
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
        className="opacity-100 font-normal bg-gray-800 text-white h-12"
        type="primary"
        disabled={false}
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
