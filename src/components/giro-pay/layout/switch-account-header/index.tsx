import { Space } from 'antd';
import React from 'react';
import SelectVirtualAcct from '../../dashboard/libs/select-virtual-acct';

interface Props {
  // Add your prop types here
}

const SwitchAccountHeader: React.FC<Props> = ({}) => {
  return (
    <div className="flex w-full sticky min-h-8 z-10 top-16 items-center justify-end px-10 h-10 bg-cyan-50 dark:bg-gray-800">
      <Space size={10}>
        <span className="font-bold text-[14px] text-blue dark:text-white">Switch Wallet: </span>
        <SelectVirtualAcct
          width="500px"
          isLoadingAccounts={false}
          vAccount={{} as any}
          accounts={[{ accountName: 'John doe', accountNumber: '00000', bankName: 'demo' } as any]}
          setVAccount={() => {}}
          className="virtual-select font-bold"
        />
      </Space>
    </div>
  );
};

export default SwitchAccountHeader;
