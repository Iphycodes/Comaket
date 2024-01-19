'use client';
import { ApiKeysAndWebhooksUrl } from '@grc/components/giro-pay/settings/api-keys-&-webhook-url';

const ApiKeysAndWebhooksUrlPage = () => {
  const handleUpdateApiKeysAndWebhooksUrl = (payload: Record<string, any>) => {
    console.log('handleUpdateApiKeysAndWebhooksUrl values::', payload);
  };
  const isUpdatingApiKeysAndWebhooksUrl = false;
  const isSecretKeyLoading = false;

  return (
    <ApiKeysAndWebhooksUrl
      isSecretKeyLoading={isSecretKeyLoading}
      handleUpdateApiKeysAndWebhooksUrl={handleUpdateApiKeysAndWebhooksUrl}
      isUpdatingApiKeysAndWebhooksUrl={isUpdatingApiKeysAndWebhooksUrl}
    />
  );
};

export default ApiKeysAndWebhooksUrlPage;
