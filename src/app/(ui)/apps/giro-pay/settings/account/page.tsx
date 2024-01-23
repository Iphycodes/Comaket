'use client';
import { AccountSetting } from '@grc/components/giro-pay/settings/account';
import { useAccountSetting } from '@grc/hooks/useAccountSetting';
import { useAuth } from '@grc/hooks/useAuth';
import { Form } from 'antd';
import dayjs from 'dayjs';
import { useEffect } from 'react';

const AccountSettingPage = () => {
  const [form] = Form.useForm();
  const { authData } = useAuth({});
  const { updateAccountSettingResponse, updateAccountSetting, accountSetting } = useAccountSetting({
    callAllAccountSetting: true,
  });
  const { isLoading: isUpdatingAccountSetting } = updateAccountSettingResponse;
  const handleUpdateAccountSetting = (payload: Record<string, any>) => {
    updateAccountSetting({
      payload,
      id: authData?.currentAccount?.id,
      options: {
        successMessage: `Account successfully updated`,
      },
    });
  };

  const formattedReportDeliveryTime = dayjs(accountSetting?.reportDeliveryTime);
  const formattedServiceFeeDeductionDate = dayjs(accountSetting?.serviceFeeDeductionDate);

  const initialValues = {
    reportDeliveryTime: formattedReportDeliveryTime,
    dailyTransactionReport: accountSetting?.dailyTransactionReport,
    serviceFeeDeductionDate: formattedServiceFeeDeductionDate,
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <AccountSetting
      handleUpdateAccountSetting={handleUpdateAccountSetting}
      isUpdatingAccountSetting={isUpdatingAccountSetting}
      form={form}
    />
  );
};

export default AccountSettingPage;
