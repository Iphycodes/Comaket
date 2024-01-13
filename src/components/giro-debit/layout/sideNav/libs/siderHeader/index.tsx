'use client';
import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Select } from 'antd';
// import { MenuFoldOutlined, CloseOutlined } from '@ant-design/icons';

export interface SiderHeaderProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export const SiderHeader = (props: SiderHeaderProps) => {
  const { collapsed } = props;

  //   const HandleToggleSider = () => {
  //     if (isMobile) {
  //       setCollapsed(true);
  //     } else {
  //       setCollapsed(!collapsed);
  //       setToggleSider(!toggleSider);
  //     }
  //   };
  return (
    <div className="flex flex-col justify-start items-start gap-10 py-2 mt-2 px-5">
      {!collapsed && (
        <Image
          src={'/assets/svgs/giro-logo.svg'}
          alt="debit-logo"
          width={140}
          height={60}
          style={{}}
        />
      )}
      <div className="w-full">
        <span className="px-2 text-[12px]" style={{ color: '#666666' }}>
          Business
        </span>
        <Select
          placeholder={'Business'}
          size="large"
          style={{}}
          className="w-full business-selector"
        />
      </div>
    </div>
  );
};
