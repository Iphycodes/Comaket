'use client';
import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
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
    <div className="flex justify-start items-center py-5 px-7">
      {!collapsed && (
        <Image src={'/assets/imgs/debit-logo.png'} alt="debit-logo" width={50} height={60} />
      )}

      {/* <MenuToggle collapsed={collapsed}>
        {isMobile || isTablet ? (
          <CloseOutlined
            className="hamburger"
            style={{ fontSize: "24px" }}
            // onClick={() => HandleToggleSider()}
          />
        ) : (
          <MenuFoldOutlined
            className="hamburger"
            style={{ fontSize: "24px" }}
            // onClick={() => HandleToggleSider()}
          />
        )}
      </MenuToggle> */}
    </div>
  );
};
