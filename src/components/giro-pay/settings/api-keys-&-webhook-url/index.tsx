'use client';
import React, { useEffect, useState } from 'react';
import { Button, Card, Col, Form, FormInstance, Input, Row, Spin, Tooltip, message } from 'antd';
import { CopyIcon, CopyIconLight } from '@grc/_shared/assets/svgs';
import { motion } from 'framer-motion';
import CustomModal from '@grc/_shared/components/custom-modal';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

type ApiKeysAndWebhooksUrlProps = {
  mobileResponsive?: boolean;
  theme?: string;
  handleUpdateWebhooksUrl: (payload: Record<string, any>) => void;
  handleGetSecretKey: (values: Record<string, any>) => void;
  isLoading: {
    isSecretKeyLoading: boolean;
    isUpdatingWebhooksUrl: boolean;
  };
  form: FormInstance<any>;
  isLiveMode: boolean;
  isGettingSecretKeySuccessful: boolean;
};

export const ApiKeysAndWebhooksUrl = (props: ApiKeysAndWebhooksUrlProps) => {
  const {
    handleUpdateWebhooksUrl,
    theme,
    form,
    isLiveMode,
    isLoading: { isSecretKeyLoading, isUpdatingWebhooksUrl },
    handleGetSecretKey,
    isGettingSecretKeySuccessful,
  } = props;
  const [openModal, setOpenModal] = useState(false);
  const isMobile = useMediaQuery(mediaSize.mobile);

  const handleAuthenticateGetSecretKey = (values: Record<string, any>) => {
    handleGetSecretKey(values);
  };

  const onFinish = (values: Record<string, any>) => {
    handleUpdateWebhooksUrl(values);
  };

  const onCopy: (text: string) => void = (text) =>
    (form.getFieldsValue() as any)?.[text] &&
    message.success({
      content:
        (text === 'pubKey'
          ? 'Public key'
          : text === 'secKey'
            ? 'Secret key'
            : text === 'webhooks'
              ? 'Webhooks url'
              : '') + ' copied.',
      icon: <></>,
    });

  const ConfirmModal = () => (
    <Form
      onFinish={handleAuthenticateGetSecretKey}
      layout="vertical"
      requiredMark={false}
      className="text-left"
    >
      <Form.Item
        name="password"
        rules={[{ required: true, message: 'Please enter your password' }]}
        label={<span>Password</span>}
      >
        <Input.Password placeholder="Enter Password" className="h-14" visibilityToggle />
      </Form.Item>
      <Button
        className="opacity-100 hover:opacity-70 mt-2 bg-blue text-white h-14 rounded-lg"
        type="primary"
        disabled={isSecretKeyLoading}
        block
        loading={isSecretKeyLoading}
        htmlType="submit"
      >
        Continue
      </Button>
    </Form>
  );

  useEffect(() => {
    if (isGettingSecretKeySuccessful) {
      setOpenModal(false);
    }
  }, [isGettingSecretKeySuccessful]);

  return (
    <motion.section
      style={{ backgroundColor: 'transparent' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'ease-in-out', duration: 0.4 }}
    >
      <section className={`${isMobile ? 'w-[94%]' : 'w-4/5'} mt-10 mx-auto`}>
        <Card className="dark:bg-zinc-800 text-card-foreground border dark:border-gray-500 shadow-md">
          <Form
            form={form}
            layout="vertical"
            requiredMark={false}
            onFinish={(value) => {
              onFinish(value);
            }}
            name="update-api-key-webhook-form"
            className="mt-5 update-api-key-webhook-form"
          >
            <Row
              gutter={isMobile ? [10, 10] : [16, 16]}
              className="flex items center justify-center"
            >
              <Col md={14} xs={20}>
                <Form.Item
                  name="pubKey"
                  label={<span>{isLiveMode ? 'Live' : 'Test'} API Public Key</span>}
                >
                  <Input placeholder="" className="h-14" disabled />
                </Form.Item>
              </Col>
              <Col xs={4} className="flex items-center justify-center text-xs">
                <div
                  className={'flex items-center justify-center cursor-pointer'}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(form.getFieldsValue()?.pubKey || '')
                      .then(() => onCopy('pubKey'))
                  }
                >
                  {theme === 'light' ? (
                    <CopyIcon className=" scale-75" />
                  ) : (
                    <CopyIconLight className=" scale-75" />
                  )}
                  <span className=" text-card-foreground">Copy</span>
                </div>
              </Col>
            </Row>
            <Row
              gutter={isMobile ? [10, 10] : [16, 16]}
              className="flex items center justify-center cursor-pointer"
            >
              <Col md={14} xs={20}>
                <Form.Item
                  name="secKey"
                  label={<span>{isLiveMode ? 'Live' : 'Test'} API Secret Key</span>}
                >
                  <Input
                    placeholder=""
                    className="h-14"
                    disabled
                    suffix={
                      <Tooltip title="get secret key">
                        {isSecretKeyLoading == true ? (
                          <Spin size="small" />
                        ) : (
                          <i
                            className="ri-eye-2-line cursor-pointer"
                            onClick={() => setOpenModal(true)}
                          />
                        )}
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>
              <Col xs={4} className="flex items-center justify-center text-xs">
                <div
                  className={'flex items-center justify-center cursor-pointer'}
                  onClick={() =>
                    navigator.clipboard
                      .writeText(form.getFieldsValue()?.secKey || '')
                      .then(() => onCopy('secKey'))
                  }
                >
                  {theme === 'light' ? (
                    <CopyIcon className=" scale-75" />
                  ) : (
                    <CopyIconLight className=" scale-75" />
                  )}
                  <span className=" text-card-foreground">Copy</span>
                </div>
              </Col>
            </Row>

            <Row
              gutter={isMobile ? [10, 10] : [16, 16]}
              className="flex items center justify-center"
            >
              <Col md={14} xs={24}>
                <Form.Item
                  name="webhooks"
                  rules={[{ required: true, message: 'Enter a webhook url' }]}
                  label={<span>Webhook URL</span>}
                >
                  <Input placeholder="" className="w-[100%] h-14" />
                </Form.Item>
              </Col>
              <Col md={2} xs={0}></Col>
            </Row>

            <div className="w-full flex items-center my-3">
              <Button
                className="opacity-100 hover:opacity-70 mt-1.5 bg-blue text-white h-12 rounded-lg px-10 mx-auto"
                type="primary"
                disabled={isUpdatingWebhooksUrl}
                block={false}
                loading={isUpdatingWebhooksUrl}
                htmlType="submit"
              >
                Update
              </Button>
            </div>
          </Form>
        </Card>

        <CustomModal
          setOpenModal={() => setOpenModal(!openModal)}
          openModal={openModal}
          component={<ConfirmModal />}
        />
      </section>
    </motion.section>
  );
};
