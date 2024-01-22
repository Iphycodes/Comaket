'use client';
import React from 'react';
import { Button } from 'antd';
import { EmptyIcon } from '@grc/_shared/assets/svgs';
import { useRouter } from 'next/navigation';

type EmptyVirtualAccountProps = {
  handleCreateVirtualAccount: () => void;
  isVerified: boolean;
};

export const EmptyVirtualAccount = ({
  handleCreateVirtualAccount,
  isVerified,
}: EmptyVirtualAccountProps) => {
  const { push } = useRouter();

  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div>
        <EmptyIcon />
      </div>
      <div className="flex flex-col mt-[2px]">
        <span className="px-5 py-1 text-center">Your list of wallets is empty</span>
        <span className="px-5 py-1 text-center font-semibold text-lg">What is a wallet?</span>
        <span className="px-5 py-1 text-center leading-6">
          A wallet allows you embark on seamless financial transactions with our cutting-edge Giro
          Pay platform! <br />
          Unlock the power of secure fund transfers and effortless payments by creating your very
          own wallet.
          <br /> Elevate your financial experience today
          {isVerified ? (
            <span>.</span>
          ) : (
            <span> – but first, ensure a smooth journey by verifying your profile. </span>
          )}
          {/* Let convenience and efficiency redefine your financial interactions with our platform! */}
        </span>
        <div className="flex items-center justify-center">
          <Button
            type="primary"
            className=" py-6 px-10 opacity-100 hover:opacity-70 mt-4 bg-blue text-white rounded-lg flex items-center cursor-pointer"
            onClick={() => (isVerified ? handleCreateVirtualAccount() : push('settings'))}
          >
            {isVerified ? 'Create A Wallet' : 'Verify Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};
