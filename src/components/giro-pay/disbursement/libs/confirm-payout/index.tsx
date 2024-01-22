import { Button } from 'antd';
import React from 'react';

interface ConfirmPayoutProps {
  // Add your prop types here
  paymentDetails: Record<string, any>;
}

const ConfirmPayout: React.FC<ConfirmPayoutProps> = ({ paymentDetails }) => {
  return (
    <div className="w-full p-5 flex flex-col gap-3">
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
            {key === 'reciepients' && (
              <span className="text-blue font-semibold hover:underline">View Reciepients</span>
            )}
            {key !== 'reciepients' && (
              <span className="font-semibold">{`${key === 'amount' && 'N'}${value}`}</span>
            )}
          </div>
        );
      })}
      <Button
        className="opacity-100 w-full hover:opacity-95 font-normal bg-blue text-white h-12"
        type="primary"
        disabled={false}
        loading={false}
        htmlType="submit"
      >
        <div className="flex items-center gap-2">
          <span>
            <i className="ri-add-line text-[18px]"></i>
          </span>
          <span>Proceed</span>
        </div>
      </Button>
    </div>
  );
};

export default ConfirmPayout;
