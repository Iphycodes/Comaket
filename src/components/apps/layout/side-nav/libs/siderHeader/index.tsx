'use client';
import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';

export interface AppSettingsSiderHeaderProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export const AppSettingsSiderHeader = (props: AppSettingsSiderHeaderProps) => {
  const { collapsed } = props;
  const { push } = useRouter();
  const { theme } = useTheme();

  return (
    <div className="flex flex-col justify-start items-start gap-10 py-2 mt-2 px-5">
      {!collapsed && (
        <span className="cursor-pointer" onClick={() => push('/apps')}>
          <Image
            priority
            src={`/assets/svgs/${theme === 'light' ? 'giro-logo' : 'giro-logo-white'}.svg`}
            alt="giro-logo"
            width={140}
            height={60}
          />
        </span>
      )}
    </div>
  );
};
