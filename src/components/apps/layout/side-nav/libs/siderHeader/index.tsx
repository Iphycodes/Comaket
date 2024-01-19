'use client';
import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export interface AppSettingsSiderHeaderProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export const AppSettingsSiderHeader = (props: AppSettingsSiderHeaderProps) => {
  const { collapsed } = props;
  const { push } = useRouter();

  return (
    <div className="flex flex-col justify-start items-start gap-10 py-2 mt-2 px-5">
      {!collapsed && (
        <span className="cursor-pointer" onClick={() => push('/apps')}>
          <Image src={'/assets/svgs/giro-logo.svg'} alt="debit-logo" width={140} height={60} />
        </span>
      )}
    </div>
  );
};
