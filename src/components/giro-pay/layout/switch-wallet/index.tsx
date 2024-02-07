import { Space } from 'antd';
import React from 'react';
import SelectWallet from '../../dashboard/libs/select-wallet';
import { WalletNamespace } from '@grc/_shared/namespace/wallet';

interface SwitchWalletHeaderProps {
  wallets: WalletNamespace.Wallet[];
  isLoadingWallets: boolean;
  setWallet: (acct: WalletNamespace.Wallet | null) => void;
  wallet: WalletNamespace.Wallet | null;
}

const SwitchWalletHeader: React.FC<SwitchWalletHeaderProps> = ({
  wallets,
  isLoadingWallets,
  setWallet,
  wallet,
}) => {
  return (
    <div className="flex w-full sticky min-h-8 z-10 top-16 items-center justify-end px-10 h-10 bg-cyan-50 dark:bg-gray-800">
      <Space size={10}>
        <span className="font-bold text-[14px] text-blue dark:text-white">Switch Wallet: </span>
        <SelectWallet
          width="300px"
          isLoadingWallets={isLoadingWallets}
          wallets={wallets}
          wallet={wallet}
          setWallet={setWallet}
          className="virtual-select font-bold"
        />
      </Space>
    </div>
  );
};

export default SwitchWalletHeader;
