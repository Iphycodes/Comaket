'use client';
import { AppContext } from '@grc/app-context';
import { ApiKeysAndWebhooksUrl } from '@grc/components/giro-pay/settings/api-keys-&-webhook-url';
import { useAccountSetting } from '@grc/hooks/useAccountSetting';
import { useAuth } from '@grc/hooks/useAuth';
import { Form } from 'antd';
import { omit } from 'lodash';
import { useTheme } from 'next-themes';
import { useContext, useEffect } from 'react';

const ApiKeysAndWebhooksUrlPage = () => {
  const { theme } = useTheme();
  const [form] = Form.useForm();
  const { isLiveMode, authData } = useContext(AppContext);
  const {} = useAuth({ callApp: true });
  const { getSecretKeyResponse, triggerSecretKey, updateAccount, updateAccountResponse } =
    useAccountSetting({
      callAllAccountSetting: true,
    });
  const id = authData?.currentAccount?.id;
  const secretKey = getSecretKeyResponse?.data?.data?.secKey;
  const { isLoading: isUpdatingWebhooksUrl } = updateAccountResponse;
  const { isLoading: isSecretKeyLoading, isSuccess: isGettingSecretKeySuccessful } =
    getSecretKeyResponse;

  const secKey = isLiveMode ? secretKey?.live : secretKey?.test;
  const pubKey = isLiveMode
    ? authData?.currentAccount?.pubKey?.live
    : authData?.currentAccount?.pubKey?.test;

  const handleGetSecretKey = (values: Record<string, any>) => {
    triggerSecretKey({
      payload: values,
      id: id,
      options: {
        successMessage: 'Secret key retrieved',
      },
    });
  };

  const handleUpdateWebhooksUrl = (values: Record<string, any>) => {
    const webhooks: string[] = [];
    const payload = {
      ...omit(values, ['pubKey', 'secKey']),
      webhooks: webhooks.concat(values?.webhooks),
    };

    updateAccount({
      payload,
      id: id,
      options: {
        successMessage: 'Webhook successfully updated',
      },
    });
  };

  const initialValues = {
    pubKey,
    secKey,
    webhooks: authData?.currentAccount?.webhooks?.[0],
  };

  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <ApiKeysAndWebhooksUrl
      isLoading={{ isSecretKeyLoading, isUpdatingWebhooksUrl }}
      handleUpdateWebhooksUrl={handleUpdateWebhooksUrl}
      handleGetSecretKey={handleGetSecretKey}
      theme={theme}
      form={form}
      isLiveMode={isLiveMode}
      isGettingSecretKeySuccessful={isGettingSecretKeySuccessful}
    />
  );
};

export default ApiKeysAndWebhooksUrlPage;
