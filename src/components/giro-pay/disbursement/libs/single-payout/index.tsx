import React, { Dispatch, SetStateAction } from 'react';
import SinglePayoutForm from './libs/single-payout-form';
import ConfirmPayout from '../confirm-payout';
import { FormInstance, Space } from 'antd';
import ConfirmPayoutPassword from '../confirm-payout-password';
import PayoutSuccess from '../batch-payout/libs/payout-success';
import { IBalance } from '@grc/_shared/namespace/wallet';
import { pick } from 'lodash';

export interface IBanks {
  bankCode: string;
  name: string;
  nibssBankCode: string;
}

interface SinglePayoutProps {
  banks: IBanks[];
  balance: IBalance;
  setModalElement: Dispatch<
    SetStateAction<'top-up-balance' | 'single-payout' | 'batch-payout' | ''>
  >;
  setPaymentDetails: Dispatch<SetStateAction<Record<string, any>>>;
  paymentDetails: Record<string, any>;
  singlePayoutSteps: string;
  setSinglePayoutSteps: Dispatch<SetStateAction<'step1' | 'step2' | 'step3' | 'step4'>>;
  loading: {
    isLoadingBanks: boolean;
    isLoadingBankDetails: boolean;
    isPayoutLoading: boolean;
    isVerifyingUser: boolean;
  };
  setBankCode: Dispatch<SetStateAction<string>>;
  form: FormInstance<any>;
  debouncedChangeHandler: (e: string) => void;
  handleVerifyUser: (values: Record<string, any>) => void;
  beneficiaryAccounts: Array<Record<string, any>>;
}

const SinglePayout = ({
  balance,
  setModalElement,
  paymentDetails,
  setPaymentDetails,
  singlePayoutSteps,
  setSinglePayoutSteps,
  loading,
  banks,
  setBankCode,
  form,
  debouncedChangeHandler,
  handleVerifyUser,
  beneficiaryAccounts,
}: SinglePayoutProps) => {
  const handleSetPaymentDetails = (details: Record<string, any>) => {
    setPaymentDetails(details);
  };

  const handleSetSinglePayoutSteps = (steps: 'step1' | 'step2' | 'step3' | 'step4') => {
    setSinglePayoutSteps(steps);
  };

  return (
    <>
      <div className="flex sticky top-0 bg-white dark:bg-[#1f1f1f] z-10 items-center border-b pb-2">
        <Space className="" size={10}>
          <span
            className="text-[16px] flex justify-center items-center h-12 w-12 bg-blue"
            style={{ borderRadius: '50%' }}
          >
            <i className="ri-send-plane-fill text-white text-[18px]"></i>{' '}
          </span>
          <span className="font-bold text-[20px]">
            {singlePayoutSteps === 'step1' && 'Single Payout'}
            {singlePayoutSteps === 'step2' && 'Confirm Payout'}
            {singlePayoutSteps === 'step3' && 'Confirm Payment'}
            {singlePayoutSteps === 'step4' && 'Payment Successful'}
          </span>
        </Space>
      </div>
      {singlePayoutSteps === 'step1' && (
        <SinglePayoutForm
          handleSetPaymentDetails={handleSetPaymentDetails}
          handleSetSinglePayoutSteps={handleSetSinglePayoutSteps}
          form={form}
          loading={loading}
          banks={banks}
          setBankCode={setBankCode}
          debouncedChangeHandler={debouncedChangeHandler}
          balance={balance}
          beneficiaryAccounts={beneficiaryAccounts}
        />
      )}
      {singlePayoutSteps === 'step2' && (
        <ConfirmPayout
          balance={balance}
          paymentDetails={paymentDetails}
          handleSetSteps={handleSetSinglePayoutSteps}
          setModalElement={setModalElement}
        />
      )}
      {singlePayoutSteps === 'step3' && (
        <ConfirmPayoutPassword
          loading={pick(loading, ['isPayoutLoading', 'isVerifyingUser'])}
          handleVerifyUser={handleVerifyUser}
        />
      )}
      {singlePayoutSteps === 'step4' && <PayoutSuccess />}
    </>
  );
};

export default SinglePayout;
