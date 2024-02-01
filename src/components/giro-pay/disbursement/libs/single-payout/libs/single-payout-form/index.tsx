import { AppLoader } from '@grc/_shared/components/app-loader';
import { IBalance } from '@grc/_shared/namespace/wallet';
import { AppContext } from '@grc/app-context';
import { Button, Checkbox, Col, Form, Input, InputNumber, FormInstance, Row, Select } from 'antd';
import { isEmpty } from 'lodash';
import React, { Dispatch, SetStateAction, memo, useContext, useState } from 'react';
import { TailSpin } from 'react-preloader-icon';

export interface IBanks {
  bankCode: string;
  name: string;
  nibssBankCode: string;
}

interface SinglePayoutFormProps {
  banks: IBanks[];
  handleSetPaymentDetails: (details: Record<string, any>) => void;
  handleSetSinglePayoutSteps: (steps: 'step1' | 'step2' | 'step3' | 'step4') => void;
  form: FormInstance<any>;
  loading: {
    isLoadingBanks: boolean;
    isLoadingBankDetails: boolean;
  };
  setBankCode: Dispatch<SetStateAction<string>>;
  debouncedChangeHandler: (e: string) => void;
  balance: IBalance;
  beneficiaryAccounts: Array<Record<string, any>>;
}

const { TextArea } = Input;

const SinglePayoutForm = ({
  handleSetPaymentDetails,
  handleSetSinglePayoutSteps,
  form,
  banks,
  loading,
  setBankCode,
  debouncedChangeHandler,
  balance,
  beneficiaryAccounts,
}: SinglePayoutFormProps) => {
  const { setPayoutdetails } = useContext(AppContext);
  const [showSaveBeneficiary, setShowBeneficiary] = useState(true);

  const options = banks?.map(({ name, bankCode }) => ({
    label: (
      <div>
        {name} - ({bankCode})
      </div>
    ),
    value: `${name}-${bankCode}`,
  }));

  const beneficiaryOptions = beneficiaryAccounts?.map(
    ({ accountName, accountNumber, bankName, bankCode }) => ({
      label: (
        <div>
          {accountName} | ({accountNumber}) | ({bankName})
        </div>
      ),
      value: `${accountName}-${accountNumber}-${bankName}-${bankCode}`,
    })
  );

  const handleBeneficiaryChange = (e: string) => {
    const values = e.split('-');
    if (!isEmpty(values)) {
      form.setFieldsValue({
        accountName: values[0],
        accountNumber: values[1],
        bankName: ` ${values[2]}-${values[3]}`,
      });
      setBankCode(` ${values[2]}-${values[3]}`);
      setPayoutdetails((prev) => ({
        ...prev,
        accountName: values[0],
        accountNumber: values[1],
        bankName: ` ${values[2]}-${values[3]}`,
      }));
      setShowBeneficiary(false);
    } else {
      setShowBeneficiary(true);
    }
  };

  const handleSubmit = (details: Record<string, any>) => {
    handleSetPaymentDetails(details);
    handleSetSinglePayoutSteps('step2');
    const singlePayoutDetails = form.getFieldsValue();
    setPayoutdetails((prev) => ({ ...prev, ...singlePayoutDetails }));
  };

  return (
    <div className="max-h-[550px] overflow-y-scroll">
      <Row className="py-5">
        <Col span={24} className="beneficiary-form">
          <div className="mb-0 text-muted-foreground">Select Saved Beneficiary</div>
          <Select
            bordered={true}
            showSearch
            size="large"
            // disabled={true}
            defaultValue={'Select a beneficiary'}
            placeholder={'Select Saved Beneficiary'}
            options={beneficiaryOptions}
            className={'w-full'}
            onChange={handleBeneficiaryChange}
          />
        </Col>
      </Row>
      <Form
        name={'single-payout-form'}
        onFinish={handleSubmit}
        layout="vertical"
        requiredMark={false}
        form={form}
        className="single-payout-form"
      >
        <Row>
          <Col lg={24} xs={24}>
            <Form.Item
              name="bankName"
              className="mb-3"
              rules={[{ required: true, message: 'Input bank name' }]}
              label={<div className="mb-0 text-muted-foreground">Bank</div>}
            >
              <Select
                size="large"
                placeholder={'Select Bank'}
                loading={loading.isLoadingBanks}
                disabled={loading.isLoadingBanks}
                showSearch={true}
                options={options}
                onChange={setBankCode}
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <Form.Item
              name="accountNumber"
              className="amount-inp mb-3"
              rules={[{ required: true, pattern: /^\d{10,}$/, message: 'Input account number' }]}
              label={<div className="mb-0 text-muted-foreground">{`Account Number`}</div>}
            >
              <Input
                className="w-full"
                size="large"
                placeholder="Account Number"
                onChange={(e: any) => {
                  debouncedChangeHandler(e.target.value);
                }}
              />
            </Form.Item>
            {loading.isLoadingBankDetails && (
              <AppLoader
                use={TailSpin}
                size={24}
                style={{ position: 'absolute', top: 36, left: '92%' }}
              />
            )}
          </Col>
        </Row>
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <Form.Item
              name="accountName"
              className="amount-inp mb-3"
              label={<div className="mb-0 text-muted-foreground">{`Account Name`}</div>}
            >
              <Input placeholder="Account Name" className="w-full" size="large" disabled />
            </Form.Item>
          </Col>
        </Row>

        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <Form.Item
              name="amount"
              className="amount-inp mb-3"
              rules={[
                () => ({
                  validator(_, value) {
                    if (!value) {
                      return Promise.reject(new Error(`Input amount`));
                    } else if (value && value <= balance.withdrawableAmount / 100) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error(`Amount exceeds withdrawable balance`));
                  },
                }),
              ]}
              label={<div className="mb-0 text-muted-foreground">{`Amount (\u20A6)`}</div>}
            >
              <InputNumber
                className="w-full"
                size="large"
                controls={false}
                min={100}
                prefix={<span className="text-muted-foreground">&#8358; </span>}
                placeholder="Amount"
              />
            </Form.Item>
          </Col>
        </Row>
        <Row className="my-0">
          <Col className="my-0" lg={24} xs={24}>
            <Form.Item
              name="narration"
              label={<div className="mb-0 text-muted-foreground">{`Narration`}</div>}
            >
              <TextArea
                placeholder="Narration"
                className="w-full min-h-24 max-h-24"
                size="large"
                rows={3}
              />
            </Form.Item>
          </Col>
        </Row>
        {showSaveBeneficiary && (
          <Row className="my-0">
            <Col className="my-0" lg={24} xs={24}>
              <Form.Item name="saveBeneficiary" valuePropName="checked">
                <Checkbox defaultChecked={false}>Save as Beneficiary</Checkbox>
              </Form.Item>
            </Col>
          </Row>
        )}

        <div className="flex items-center justify-end sticky bottom-0">
          <Button
            className="opacity-100 hover:opacity-95 font-normal bg-blue text-white h-12"
            type="primary"
            disabled={false}
            loading={false}
            htmlType="submit"
          >
            <div className="flex items-center gap-2">
              <span>Proceed to Payment</span>
              <span>
                <i className="ri-arrow-drop-right-line text-[25px]"></i>
              </span>
            </div>
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default memo(SinglePayoutForm);
