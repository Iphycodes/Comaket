'use client';
import React, { Dispatch, SetStateAction, useContext } from 'react';
import Image from 'next/image';
import { Button, Select } from 'antd';
import { PlusIcon, ManageBusinessIcon } from '@grc/_shared/assets/svgs';
import { useRouter } from 'next/navigation';
import { AccountNamespace } from '@grc/_shared/namespace/account';
import { isEmpty } from 'lodash';
import { useTheme } from 'next-themes';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
// import { MenuFoldOutlined, CloseOutlined } from '@ant-design/icons';

export interface SiderHeaderProps {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
  accounts: AccountNamespace.Account[];
  currentAccount: AccountNamespace.Account | undefined;
}

export const SiderHeader = (props: SiderHeaderProps) => {
  const { collapsed, accounts, currentAccount } = props;
  const { push } = useRouter();
  const { theme } = useTheme();
  const isMobile = useMediaQuery(mediaSize.mobile);
  const { setToggleSider } = useContext(AppContext);

  const options = (accounts || []).map((account) => ({
    label: <div>{account?.name ?? ''}</div>,
    value: JSON.stringify(account) ?? '',
  }));

  //   const HandleToggleSider = () => {
  //     if (isMobile) {
  //       setCollapsed(true);
  //     } else {
  //       setCollapsed(!collapsed);
  //       setToggleSider(!toggleSider);
  //     }
  //   };

  return (
    <div className="flex flex-col justify-start items-start gap-10 py-2 mt-2 px-4">
      {!collapsed && (
        <div className="flex justify-between w-full items-center">
          <span className="cursor-pointer" onClick={() => push('/apps')}>
            <Image
              src={`/assets/svgs/${theme === 'light' ? 'giro-logo' : 'giro-logo-white'}.svg`}
              alt="giro-logo"
              width={140}
              height={60}
              priority
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
      <div className="w-full">
        <span className="py-2 px-1 text-[15px] font-medium text-card-foreground">Business(es)</span>
        <Select
          placeholder={'Select a business'}
          size="middle"
          className="w-full business-selector"
          defaultValue={!isEmpty(accounts) && JSON.stringify(currentAccount)}
          options={options}
        />
      </div>
      <div className="w-full gap-3 flex flex-col items-center justify-center border-b border-border/100 pb-5 mb-3">
        <Button type="primary" className="flex items-center" ghost block icon={<PlusIcon />}>
          Add New Business
        </Button>
        <Button
          type="primary"
          className="flex items-center"
          ghost
          block
          icon={<ManageBusinessIcon />}
        >
          Manage All Businesses
        </Button>
      </div>
    </div>
  );
};
