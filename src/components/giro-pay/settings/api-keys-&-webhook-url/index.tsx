'use client';
import React from 'react';
import { Button, Card, Col, Form, Input, Row, Spin, Tooltip } from 'antd';
import { CopyIcon } from '@grc/_shared/assets/svgs';
import { motion } from 'framer-motion';

type ApiKeysAndWebhooksUrlProps = {
  mobileResponsive?: boolean;
  theme?: string;
  handleUpdateApiKeysAndWebhooksUrl: (payload: Record<string, any>) => void;
  isUpdatingApiKeysAndWebhooksUrl: boolean;
  isSecretKeyLoading: boolean;
};

export const ApiKeysAndWebhooksUrl = (props: ApiKeysAndWebhooksUrlProps) => {
  const { handleUpdateApiKeysAndWebhooksUrl, isUpdatingApiKeysAndWebhooksUrl, isSecretKeyLoading } =
    props;
  const [form] = Form.useForm();

  const onFinish = (values: Record<string, any>) => {
    handleUpdateApiKeysAndWebhooksUrl(values);
  };

  return (
    <motion.section
      style={{ backgroundColor: 'transparent' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ type: 'ease-in-out', duration: 0.4 }}
    >
      <section className=" w-4/5 mt-10 mx-auto">
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
            <Row gutter={[16, 16]} className="flex items center justify-center">
              <Col md={14} xs={24}>
                <Form.Item name="pubKey" label={<span>Live API Public Key</span>}>
                  <Input placeholder="" className="h-14" disabled />
                </Form.Item>
              </Col>
              <Col className="flex items-center justify-center text-xs">
                <div className={'flex items-center justify-center'}>
                  <CopyIcon className=" scale-75" />
                  <span className=" text-card-foreground">Copy</span>
                </div>
              </Col>
            </Row>
            <Row gutter={[16, 16]} className="flex items center justify-center">
              <Col md={14} xs={24}>
                <Form.Item name="secKey" label={<span>Live API Secret Key</span>}>
                  <Input
                    placeholder=""
                    className="h-14"
                    disabled
                    suffix={
                      <Tooltip title="get secret key">
                        {isSecretKeyLoading == true ? (
                          <Spin size="small" />
                        ) : (
                          <i className="ri-eye-2-line cursor-pointer" />
                        )}
                      </Tooltip>
                    }
                  />
                </Form.Item>
              </Col>
              <Col className="flex items-center justify-center text-xs">
                <div className={'flex items-center justify-center'}>
                  <CopyIcon className=" scale-75" />
                  <span className=" text-card-foreground">Copy</span>
                </div>
              </Col>
            </Row>

            <Row gutter={[16, 16]} className="flex items center justify-center">
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
                disabled={isUpdatingApiKeysAndWebhooksUrl}
                block={false}
                loading={isUpdatingApiKeysAndWebhooksUrl}
                htmlType="submit"
              >
                Update
              </Button>
            </div>
          </Form>
        </Card>
      </section>
    </motion.section>
  );
};
