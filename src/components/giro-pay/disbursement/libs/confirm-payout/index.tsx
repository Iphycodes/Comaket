import { Button } from 'antd';
import React from 'react';

interface ConfirmPayoutProps {
  paymentDetails: Record<string, any>;
  handleSetSteps: (steps: 'step1' | 'step2' | 'step3' | 'step4') => void;
}

const ConfirmPayout: React.FC<ConfirmPayoutProps> = ({ paymentDetails, handleSetSteps }) => {
  const handleGoBack = () => {
    handleSetSteps('step1');
  };
  return (
    <div className="w-full flex flex-col gap-3">
      <span
        onClick={() => handleGoBack()}
        className="mb-2 flex gap-1 w-20 cursor-pointer text-blue items-center"
      >
        <i className="ri-arrow-left-line text-[20px]"></i>
        <span>Go Back</span>
      </span>
      <div className="w-full flex items-center justify-center font-bold text-[32px] border-b py-2">
        {`\u20A6 ${paymentDetails?.amount}`}
      </div>
      <div className="border-b">
        {Object.entries(paymentDetails).map(([key, value]) => {
          // typeof value === 'object' ?
          return (
            <div key={key} className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-gray-500">
                <span>
                  {(() => {
                    switch (key) {
                      case 'name':
                        return <i className="ri-user-line text-[20px]"></i>;
                      case 'reciepient-bank':
                        return <i className="ri-bank-line text-[20px]"></i>;
                      case 'account-number':
                        return <i className="ri-archive-drawer-line text-[20px]"></i>;
                      case 'amount':
                        return <i className="ri-wallet-2-line text-[20px]"></i>;
                      default:
                        return <i className="ri-rest-time-line text-[20px]"></i>;
                    }
                  })()}
                </span>
                <span className="text-[16px]">{key}</span>
              </div>
              <div>
                {key === 'reciepients' ? (
                  <span className="text-blue font-semibold hover:underline">View Reciepients</span>
                ) : (
                  <span className="font-semibold">{`${
                    key === 'amount' ? `\u20A6${value}` : value
                  }`}</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
      <div className="py-2">
        <div>Payment method</div>
        <div className="p-3 rounded-md flex bg-gray-100 justify-between items-center">
          <div className="flex gap-2 items-center">
            <span
              className="h-10 w-10 bg-cyan-50 flex items-center justify-center"
              style={{ borderRadius: '50%' }}
            >
              <i className="ri-wallet-fill text-blue text-[20px]"></i>
            </span>
            <span className="text-gray-600 font-semibold">{'Balance (\u20A65000)'}</span>
          </div>
          <div className="text-blue">{'Top-up >'}</div>
        </div>
      </div>

      <Button
        className="opacity-100 w-full flex justify-center items-center hover:opacity-95 font-normal bg-blue text-white h-12"
        type="primary"
        disabled={false}
        loading={false}
        onClick={() => handleSetSteps('step3')}
      >
        <div className="flex items-center gap-2 text-[18px] font-semibold">
          <span>Proceed</span>
        </div>
      </Button>
    </div>
  );
};

export default ConfirmPayout;
