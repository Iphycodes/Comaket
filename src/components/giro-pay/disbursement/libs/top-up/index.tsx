'use client';
import { GoCopy } from 'react-icons/go';

const TopUp = () => {
  return (
    <div className="w-[40%] flex flex-col min-h-[400px] shadow-sm border rounded-lg">
      <div className="w-full py-3 px-2 font-bold text-md border-y">Top-up</div>
      <div className="flex flex-col flex-grow items-center gap-10 px-10 py-7">
        <div className="flex flex-col items-center text-center">
          <div className="text-[32px] font-bold">Top-Up Balance</div>
          <span className="font-thin">
            To add funds to your virtual account balance, transfer into the account details below:
          </span>
        </div>
        <div className="flex flex-col gap-2 text-center">
          <div className="flex flex-col">
            <span className="font-thin">Account Number</span>
            <span className="font-bold relative text-[24px]">
              <span>0065453363</span>
              <GoCopy size={20} className="absolute right-0 top-0" />
            </span>
          </div>
          <div className="flex flex-col">
            <span className="font-thin">Account Name</span>
            <span className="font-bold text-[16px]">giro-pay Main Funding</span>
          </div>
          <div className="flex flex-col">
            <span className="font-thin">Bank Name</span>
            <span className="font-bold text-lg">MoniePoint</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopUp;
