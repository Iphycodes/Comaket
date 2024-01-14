import { memo, useEffect } from 'react';
import { Form, Select } from 'antd';
import { startCase, isEmpty, pick, toLower } from 'lodash';
import { AccountNamespace } from '@grc/_shared/namespace/virtual-account';

interface ISelectVirtualAcct {
  setVAccount: (acct: AccountNamespace.Account | null) => void;
  vAccount: AccountNamespace.Account | null;
  accounts: AccountNamespace.Account[];
  isLoadingAccounts: boolean;
  theme?: string;
}

const SelectVirtualAcct = ({ setVAccount, accounts, isLoadingAccounts }: ISelectVirtualAcct) => {
  const [form] = Form.useForm();

  const pickAcctValue = (acct: any) =>
    pick(acct, ['_id', 'accountName', 'accountNumber', 'accountNumber']);

  useEffect(() => form.resetFields(), [accounts?.[0]]);

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
    <Form layout="vertical" requiredMark={false} form={form} className="select-virtual-account">
      <Form.Item name={'status_filter'} label={<span>Select A Virtual Account</span>}>
        <Select
          bordered={true}
          showSearch
          defaultValue={
            !isEmpty(accounts)
              ? JSON.stringify(pickAcctValue(accounts?.[0]))
              : 'No Virtual Account Created'
          }
          loading={isLoadingAccounts}
          disabled={accounts?.length === 0}
          className={''}
          onChange={(value) => setVAccount?.(JSON.parse(value))}
          options={options}
        />
      </Form.Item>
    </Form>
  );
};

export default memo(SelectVirtualAcct);
