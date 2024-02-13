import { numberFormat } from '@grc/_shared/helpers';
import { IBalance } from '@grc/_shared/namespace/wallet';
import { Button } from 'antd';
import { capitalize, startCase } from 'lodash';
import React, { useState } from 'react';
import ReciepientsTable from '../batch-payout/libs/reciepients-table';
import { ReciepientsDataType } from '@grc/_shared/constant';

interface ConfirmPayoutProps {
  paymentDetails: Record<string, any>;
  handleSetSteps: (steps: 'step1' | 'step2' | 'step3' | 'step4') => void;
  balance: IBalance;
  batchReciepientsData?: ReciepientsDataType[];
  handleSuccess?: () => void;
  key: 'batch-payout' | 'single-payout';
}

const ConfirmPayout: React.FC<ConfirmPayoutProps> = ({
  paymentDetails,
  handleSetSteps,
  balance,
  batchReciepientsData,
  key,
  handleSuccess,
}) => {
  const [isViewReciepient, setViewReciepient] = useState<boolean>(false);
  const handleGoBack = () => {
    key === 'single-payout' ? handleSetSteps('step1') : handleSetSteps('step4');
  };
  const paymentDetailsKeySwap: Record<string, any> = {
    accountName: 'account name',
    bankName: 'bank name',
    accountNumber: 'account number',
    saveBeneficiary: 'save as beneficiary',
    beneficiary: '',
  };
  const formatBoolean = (value: boolean) => {
    if (value) {
      return 'Yes';
    }
    return 'No';
  };

  const handleConfirmPayment = () => {
    key === 'single-payout' ? handleSetSteps('step3') : handleSuccess?.();
  };

  return (
    <div className="w-full flex flex-col gap-2">
      <span
        onClick={() => handleGoBack()}
        className="mt-2 flex gap-1 w-20 cursor-pointer text-blue items-center"
      >
        <i className="ri-arrow-left-line text-[20px]"></i>
        <span>Go Back</span>
      </span>
      <div className="w-full flex items-center justify-center font-bold text-[32px] border-b py-1">
        {`${numberFormat(paymentDetails?.amount, '₦ ')}`}
      </div>
      <div className="border-b">
        {Object.entries(paymentDetails).map(([key, value]) => {
          return (
            <>
              <div key={key} className="flex justify-between items-center py-1">
                <div className="flex items-center gap-1 text-gray-500">
                  <span>
                    {(() => {
                      switch (key) {
                        case 'reciepients':
                          return <i className="ri-group-line text-[20px]"></i>;
                        case 'accountName':
                          return <i className="ri-user-line text-[20px]"></i>;
                        case 'bankName':
                          return <i className="ri-bank-line text-[20px]"></i>;
                        case 'accountNumber':
                          return <i className="ri-archive-drawer-line text-[20px]"></i>;
                        case 'amount':
                          return <i className="ri-wallet-2-line text-[20px]"></i>;
                        case 'narration':
                          return <i className="ri-quote-text text-[20px]"></i>;
                        case 'saveBeneficiary':
                          return <i className="ri-hand-coin-line text-[20px]"></i>;
                        case 'charges':
                          return <i className="ri-funds-line text-[20px]"></i>;
                        default:
                          return <i className="ri-rest-time-line text-[20px]"></i>;
                      }
                    })()}
                  </span>
                  <span className="text-[16px]">
                    {startCase(capitalize(paymentDetailsKeySwap[key] ?? key))}
                  </span>
                </div>
                <div>
                  {key === 'reciepients' ? (
                    <span
                      className="text-blue font-semibold hover:underline cursor-pointer"
                      onClick={() => setViewReciepient(!isViewReciepient)}
                    >
                      {isViewReciepient ? `Hide Reciepients` : 'View Reciepients'}
                    </span>
                  ) : (
                    <span className="font-semibold">{`${
                      key === 'amount' || key === 'charges'
                        ? `${numberFormat(value, '₦ ')}`
                        : key === 'saveBeneficiary'
                          ? formatBoolean(value)
                          : ['beneficiary'].includes(key)
                            ? ''
                            : startCase(capitalize(value))
                    }`}</span>
                  )}
                </div>
              </div>
              <div>
                {key === 'reciepients' && isViewReciepient === true && (
                  <div className="w-full">
                    <ReciepientsTable
                      isEditable={false}
                      batchReciepientsData={batchReciepientsData ?? []}
                    />
                  </div>
                )}
              </div>
            </>
          );
        })}
      </div>
      <div className="py-2">
        {/* <div>Payment method</div> */}
        <div className="p-3 rounded-md flex bg-gray-100 dark:bg-zinc-800 justify-between items-center">
          <div className="flex gap-2 items-center">
            <span
              className="h-10 w-10 bg-cyan-50 dark:bg-[#1f1f1f] flex items-center justify-center"
              style={{ borderRadius: '50%' }}
            >
              <i className="ri-wallet-fill text-blue text-[20px]"></i>
            </span>
            <span className="text-gray-600 dark:text-gray-100 font-semibold">
              {`Balance (${
                balance?.withdrawableAmount
                  ? numberFormat(balance.withdrawableAmount / 100, '₦ ')
                  : '₦ 0.00'
              })`}
            </span>
          </div>
          {/* <div onClick={() => setModalElement('top-up-balance')} className="text-blue font-semibold cursor-pointer">{'Top-up'}</div> */}
          <span></span>
        </div>
      </div>

      <Button
        className="opacity-100 w-full flex justify-center items-center hover:opacity-95 font-normal bg-blue text-white h-12"
        type="primary"
        disabled={false}
        loading={false}
        onClick={() => handleConfirmPayment()}
      >
        <div className="flex items-center gap-2 text-[18px] font-semibold">
          <span>Confirm Payment</span>
          <span>
            <i className="ri-arrow-drop-right-line text-[25px]"></i>
          </span>
        </div>
      </Button>
    </div>
  );
};

export default ConfirmPayout;
