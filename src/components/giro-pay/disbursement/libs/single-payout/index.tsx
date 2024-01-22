import React, { useState } from 'react';
import SinglePayoutForm from './libs/single-payout-form';
import ConfirmPayout from '../confirm-payout';
import { Space } from 'antd';
import ConfirmPayoutPassword from '../confirm-payout-password';
import PayoutSuccess from '../batch-payout/libs/payout-success';

export interface IBanks {
  bankCode: string;
  name: string;
  nibssBankCode: string;
}

interface SinglePayoutProps {
  banks?: IBanks[];
}

const SinglePayout = ({}: SinglePayoutProps) => {
  const [paymentDetails, setPaymentDetails] = useState<Record<string, any>>({});
  const [singlePayoutSteps, setSinglePayoutSteps] = useState<'step1' | 'step2' | 'step3' | 'step4'>(
    'step1'
  );

  // const banksOptions = banks?.map(({ name, bankCode }) => ({
  //   Label: (
  //     <div style={{ background: 'var(--bg-secondary)' }}>
  //       {name} - ({bankCode})
  //     </div>
  //   ),
  //   value: `${name}-${bankCode}`,
  // }));

  const handleSetPaymentDetails = (details: Record<string, any>) => {
    setPaymentDetails(details);
  };

  const handleSetSinglePayoutSteps = (steps: 'step1' | 'step2' | 'step3' | 'step4') => {
    setSinglePayoutSteps(steps);
  };

  return (
    <>
      <div className="flex sticky top-0 bg-white z-10 items-center border-b-2 pb-2">
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
          </span>
        </Space>
      </div>
      {singlePayoutSteps === 'step1' && (
        <SinglePayoutForm
          handleSetPaymentDetails={handleSetPaymentDetails}
          handleSetSinglePayoutSteps={handleSetSinglePayoutSteps}
        />
      )}
      {singlePayoutSteps === 'step2' && (
        <ConfirmPayout
          paymentDetails={paymentDetails}
          handleSetSteps={handleSetSinglePayoutSteps}
        />
      )}
      {singlePayoutSteps === 'step3' && (
        <ConfirmPayoutPassword handleSetSteps={handleSetSinglePayoutSteps} />
      )}
      {singlePayoutSteps === 'step4' && <PayoutSuccess />}
    </>
  );
};

export default SinglePayout;
