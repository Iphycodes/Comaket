'use client';
import React, { Dispatch, SetStateAction } from 'react';
import Image from 'next/image';
import { Button, Select } from 'antd';
import { PlusIcon, ManageBusinessIcon } from '@grc/_shared/assets/svgs';
import { useRouter } from 'next/navigation';
import { AccountNamespace } from '@grc/_shared/namespace/account';
import { isEmpty } from 'lodash';
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
    <div className="flex flex-col justify-start items-start gap-10 py-2 mt-2 px-5">
      {!collapsed && (
        <span className="cursor-pointer" onClick={() => push('/apps')}>
          <Image
            src={'/assets/svgs/giro-logo.svg'}
            alt="debit-logo"
            width={140}
            height={60}
            // style={{}}
          />
        </span>
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
