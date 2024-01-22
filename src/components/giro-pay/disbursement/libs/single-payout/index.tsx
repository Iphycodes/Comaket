// import React, { useState } from 'react';
// import SinglePayoutForm from './libs/single-payout-form';

export interface IBanks {
  bankCode: string;
  name: string;
  nibssBankCode: string;
}

interface SinglePayoutProps {
  banks?: IBanks[];
}

const SinglePayout = ({}: SinglePayoutProps) => {
  // const [paymentDetails, setPaymentDetails] = useState<Record<string, any>>({})
  // const [singlePayoutSteps, setSinglePayoutSteps] = useState<'step1' | 'step2' | 'step3'>('step1')

  // const banksOptions = banks?.map(({ name, bankCode }) => ({
  //   Label: (
  //     <div style={{ background: 'var(--bg-secondary)' }}>
  //       {name} - ({bankCode})
  //     </div>
  //   ),
  //   value: `${name}-${bankCode}`,
  // }));

  // const handleSetPaymentDetails = (details: Record<string, any>) => {
  //   setPaymentDetails(details);
  // }

  return (
    <>
      {
        // singlePayoutSteps === 'step1' && <SinglePayoutForm/>
      }
      {}
    </>
  );
};

export default SinglePayout;
