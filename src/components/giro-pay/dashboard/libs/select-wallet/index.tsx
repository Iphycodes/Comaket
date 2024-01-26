import React, { memo, useEffect } from 'react';
import { Form, Select } from 'antd';
import { startCase, isEmpty, pick, toLower } from 'lodash';
import { WalletNamespace } from '@grc/_shared/namespace/wallet';

interface ISelectWallet {
  setWallet: (acct: WalletNamespace.Wallet | null) => void;
  // wallet: WalletNamespace.Wallet | null;
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
}: ISelectWallet) => {
  const [form] = Form.useForm();

  const pickAcctValue = (acct: any) =>
    pick(acct, ['_id', 'accountName', 'accountNumber', 'accountNumber']);

  const initialValues = {
    selectWallet: !isEmpty(wallets)
      ? JSON.stringify(pickAcctValue(wallets?.[0]))
      : 'No Wallet Created',
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const options = wallets?.map((w) => ({
    label: (
      <div className="font-bold">
        {startCase(toLower(w?.accountName))} <span style={{ padding: '0 8px' }}>|</span>{' '}
        {w?.accountNumber}
        <span style={{ padding: '0 8px' }}>|</span> {w?.bankName}
      </div>
    ),
    value: JSON.stringify(pickAcctValue(w)),
  }));

  return (
    <Form requiredMark={false} form={form}>
      <Form.Item name={'selectWallet'} className="virtual-select-form-item font-bold">
        <Select
          style={{ ...style, width: width }}
          bordered={true}
          showSearch
          // defaultValue={
          //   !isEmpty(wallets)
          //     ? JSON.stringify(pickAcctValue(wallets?.[0]))
          //     : 'No Wallet Created'
          // }
          loading={isLoadingWallets}
          disabled={wallets?.length === 0}
          className={`${className} font-bold`}
          onChange={(value) => setWallet?.(JSON.parse(value))}
          options={options}
        />
      </Form.Item>
    </Form>
  );
};

export default memo(SelectWallet);
