import React from 'react';
import moment from 'moment';
import { TransactionReceipt } from '@grc/_shared/components/transaction-receipt';
import { numberFormat, truncate } from '@grc/_shared/helpers';
import { Button, message } from 'antd';
import { startCase, lowerCase, omit, isEmpty } from 'lodash';
import { DownloadOutlined } from '@ant-design/icons';
import { useTheme } from 'next-themes';
import { CopyIcon, CopyIconLight } from '@grc/_shared/assets/svgs';
interface PayoutSuccessProps {
  payoutSuccessData: Record<string, any>;
}

const PayoutSuccess: React.FC<PayoutSuccessProps> = ({ payoutSuccessData }) => {
  const { amount, accountName, accountNumber, bankCode, beneficiary, createdAt, reference } =
    payoutSuccessData?.data ?? {};
  const { theme } = useTheme();

  const onCopy: (text: string) => void = (text: string) =>
    !isEmpty(text) && message.success({ content: 'Transaction reference copied.' });

  return (
    <div className="flex flex-col items-center justify-center py-10">
      {/* Your component content here */}
      {/* <i
        className="ri-checkbox-circle-fill text-[30px] p-0 m-0  text-green-500"
        style={{ lineHeight: '30px' }}
      ></i>
      <div className="text-lg font-bold text-muted-foreground mb-4">Money Sent</div> */}
      <section className="text-center">
        <div className=" pb-1">
          <h5 className="text-[15px] text-muted-foreground">Amount Sent</h5>
          <span className="text-[17px] font-bold">{numberFormat(amount / 100, '₦ ')}</span>
        </div>
        <div className=" pb-1">
          <h5 className="text-[15px] text-muted-foreground">Recipient Details</h5>
          <span className="text-[17px] font-bold">
            {startCase(lowerCase(accountName))} | {accountNumber} |{' '}
            {beneficiary?.bankCode || bankCode}{' '}
          </span>
        </div>
        <div className=" pb-1">
          <h5 className="text-[15px] text-muted-foreground">Transaction Time</h5>
          <span className="text-[17px] font-bold">
            {moment(createdAt).format('MMM DD, YYYY hh:mm A')}
          </span>
        </div>
        <div className=" pb-1">
          <h5 className="text-[15px] text-muted-foreground">Transaction Reference</h5>
          <span className="text-[17px] font-bold">
            <span className="flex items-center justify-center ">
              {truncate(reference, 20)}{' '}
              <span
                className={'cursor-pointer ml-1'}
                onClick={() => {
                  navigator.clipboard.writeText(reference).then(() => onCopy(reference));
                }}
              >
                {theme === 'light' ? (
                  <CopyIcon className="scale-75" />
                ) : (
                  <CopyIconLight className="scale-75" />
                )}
              </span>
            </span>{' '}
          </span>
        </div>
      </section>
      <Button
        className="opacity-100 mt-5 flex justify-center text-center items-center hover:opacity-95 font-normal bg-blue text-white h-12 px-6"
        type="primary"
        disabled={false}
        loading={false}
        onClick={() =>
          TransactionReceipt({
            successData: {
              ...omit(payoutSuccessData?.data, ['source', 'beneficiary']),
              accountName: accountName,
              accountNumber: accountNumber,
              bankName:
                payoutSuccessData?.data?.entry === 'debit'
                  ? payoutSuccessData?.data?.beneficiary?.bankName
                  : payoutSuccessData?.data?.source?.bankName,
              entry: payoutSuccessData?.data?.entry,
            },
          })
        }
      >
        <div className="flex items-center gap-2 justify-center">
          <DownloadOutlined className="text-[18px]" />
          <span>Download Receipt</span>
        </div>
      </Button>
    </div>
  );
};

export default PayoutSuccess;
