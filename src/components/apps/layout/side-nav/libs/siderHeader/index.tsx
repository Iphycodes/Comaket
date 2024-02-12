'use client';
import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useTheme } from 'next-themes';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

export interface AppSettingsSiderHeaderProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  setToggleSider: Dispatch<SetStateAction<boolean>>;
}

export const AppSettingsSiderHeader = (props: AppSettingsSiderHeaderProps) => {
  const { collapsed, setToggleSider } = props;
  const { push } = useRouter();
  const { theme } = useTheme();
  const isMobile = useMediaQuery(mediaSize.mobile);

  return (
    <div className="flex flex-col justify-start items-start gap-10 py-2 mt-2 px-5">
      {!collapsed && (
        <div className="flex justify-between w-full items-center">
          <span className="cursor-pointer" onClick={() => push('/apps')}>
            <Image
              priority
              src={`/assets/svgs/${theme === 'light' ? 'giro-logo' : 'giro-logo-white'}.svg`}
              alt="giro-logo"
              width={140}
              height={60}
            />
          </span>
          {isMobile && (
            <span>
              <i
                className="ri-close-line cursor-pointer text-[34px]"
                onClick={() => setToggleSider(true)}
              ></i>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
