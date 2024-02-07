import React, { memo, useEffect } from 'react';
import { Form, Select } from 'antd';
import { startCase, isEmpty, pick, toLower } from 'lodash';
import { WalletNamespace } from '@grc/_shared/namespace/wallet';

interface ISelectWallet {
  setWallet: (acct: WalletNamespace.Wallet | null) => void;
  wallet: WalletNamespace.Wallet | null;
  wallets: WalletNamespace.Wallet[];
  isLoadingWallets: boolean;
  theme?: string;
  style?: React.CSSProperties;
  width?: string;
  className?: string;
}

const SelectWallet = ({
  setWallet,
  wallets,
  isLoadingWallets,
  style,
  width,
  className,
  wallet,
}: ISelectWallet) => {
  const [form] = Form.useForm();

  const pickWalletValue = (wallet: any) =>
    pick(wallet, ['_id', 'accountName', 'accountNumber', 'bankName']);

  // const initialValues = {
  //   selectWallet: !isEmpty(wallets)
  //     ? JSON.stringify(pickWalletValue(wallets?.[0]))
  //     : 'No Wallet Created',
  // };

  // useEffect(() => {
  //   form.setFieldsValue(initialValues);
  // }, [form, initialValues]);

  useEffect(() => form.resetFields(), [wallets?.[0]]);

  const options = wallets?.map((w) => ({
    label: (
      <div className="font-bold">
        {startCase(toLower(w?.accountName))} <span style={{ padding: '0 8px' }}>|</span>{' '}
        {w?.accountNumber}
        <span style={{ padding: '0 8px' }}>|</span> {w?.bankName}
      </div>
    ),
    value: JSON.stringify(pickWalletValue(w)),
  }));
  return (
    <Form requiredMark={false} form={form}>
      <Form.Item name={'selectWallet'} className="virtual-select-form-item font-bold">
        <Select
          style={{ ...style, width: width }}
          bordered={true}
          showSearch
          defaultValue={
            isLoadingWallets
              ? ''
              : !isEmpty(wallet)
                ? JSON.stringify(pickWalletValue(wallet ?? {}))
                : !isEmpty(wallets)
                  ? JSON.stringify(pickWalletValue(wallets?.[0]))
                  : 'No Wallet Created'
          }
          loading={isLoadingWallets}
          disabled={isLoadingWallets || wallets?.length === 0}
          className={`${className} font-bold`}
          onChange={(value) => setWallet?.(JSON.parse(value))}
          options={options}
        />
      </Form.Item>
    </Form>
  );
};

export default memo(SelectWallet);
