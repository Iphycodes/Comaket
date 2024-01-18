'use client';
import React from 'react';
import { Button } from 'antd';
import { EmptyIcon } from '@grc/_shared/assets/svgs';
import { useRouter } from 'next/navigation';
import CustomToolTip from '@grc/_shared/components/custom-tooltip';
import { InfoCircleOutlined } from '@ant-design/icons';

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
      <div className="flex flex-col mt-1">
        <span className="px-5 py-1 text-center">
          Your list of virtual accounts is empty{' '}
          <CustomToolTip
            title="A virtual account allows you to commence funding and disbursements on Giro. You can create a virtual account only after verifying your profile"
            placement={'bottomRight'}
          >
            {' '}
            <InfoCircleOutlined />
          </CustomToolTip>
        </span>
        <div className="flex items-center justify-center">
          <Button
            type="primary"
            className="p-5 opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white rounded-lg flex items-center cursor-pointer"
            onClick={() => (isVerified ? handleCreateVirtualAccount() : push('settings'))}
          >
            {isVerified ? 'Create Virtual Account' : 'Verify Profile'}
          </Button>
        </div>
      </div>
    </div>
  );
};
