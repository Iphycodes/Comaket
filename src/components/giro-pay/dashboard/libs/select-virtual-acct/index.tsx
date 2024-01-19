import React, { memo, useEffect } from 'react';
import { Form, Select } from 'antd';
import { startCase, isEmpty, pick, toLower } from 'lodash';
import { VirtualAccountNamespace } from '@grc/_shared/namespace/virtual-account';

interface ISelectVirtualAcct {
  setVAccount: (acct: VirtualAccountNamespace.Account | null) => void;
  vAccount: VirtualAccountNamespace.Account | null;
  accounts: VirtualAccountNamespace.Account[];
  isLoadingAccounts: boolean;
  theme?: string;
  style?: React.CSSProperties;
  width?: string;
  className?: string;
}

const SelectVirtualAcct = ({
  setVAccount,
  accounts,
  isLoadingAccounts,
  style,
  width,
  className,
}: ISelectVirtualAcct) => {
  const [form] = Form.useForm();

  const pickAcctValue = (acct: any) =>
    pick(acct, ['_id', 'accountName', 'accountNumber', 'accountNumber']);

  const defaultAccount = accounts?.[0];
  useEffect(() => form.resetFields(), [defaultAccount, form]);

  const options = accounts?.map((s) => ({
    label: (
      <div>
        {startCase(toLower(s?.accountName))} <span style={{ padding: '0 8px' }}>|</span>{' '}
        {s?.accountNumber}
        <span style={{ padding: '0 8px' }}>|</span> {s?.bankName}
      </div>
    ),
    value: JSON.stringify(pickAcctValue(s)),
  }));

  return (
    <Form requiredMark={false} form={form}>
      <Form.Item className="virtual-select-form-item">
        <Select
          style={{ ...style, width: width }}
          bordered={true}
          showSearch
          defaultValue={
            !isEmpty(accounts)
              ? JSON.stringify(pickAcctValue(accounts?.[0]))
              : 'No Virtual Account Created'
          }
          size="small"
          loading={isLoadingAccounts}
          disabled={accounts?.length === 0}
          className={`${className}`}
          onChange={(value) => setVAccount?.(JSON.parse(value))}
          options={options}
        />
      </Form.Item>
    </Form>
  );
};

export default memo(SelectVirtualAcct);
