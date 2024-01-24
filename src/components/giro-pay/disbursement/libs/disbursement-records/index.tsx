'use client';

import { BatchDisbursement, mockDisbursementRecord } from '@grc/_shared/constant';
import { Card, Space } from 'antd';

const DisbursementHistory = () => {
  const getBatchClassName = (record: BatchDisbursement) => {
    let pendingFlag = 0;
    let className = '';

    for (let i = 0; i < record.recipients.length; i++) {
      const { status } = record.recipients[i];

      if (status === 'successful') {
        if (pendingFlag === 0) {
          className = 'text-green-700';
        }
      } else if (status === 'pending') {
        pendingFlag = 1;
        className = 'text-yellow-600';
      } else {
        className = 'text-red-500';
        break; // Break out of the loop when condition is met
      }
    }

    return className;
  };

  return (
    <Card className="w-full recent-disburseent-card shadow-sm shadow-gray-100">
      <div className="py-2 border-b-2 font-bold">Recent Disbursements</div>
      <div className="flex flex-col">
        {mockDisbursementRecord.map((record, idx) => {
          const acctName =
            record.type === 'single'
              ? `${record.recipient}`
              : record.recipients
                ? `${record.recipients[0].recipient || ''}`
                : 'account Name';
          const acctNumber =
            record.type === 'single'
              ? `${record.recipientAccount}`
              : record.recipients
                ? `${record.recipients[0].recipientAccount || ''}`
                : '0000';
          const amount =
            record.type === 'single'
              ? `${record.amount}`
              : record.recipients
                ? `${record.recipients[0].amount || ''}`
                : '0000';
          return (
            <div
              key={idx}
              className="flex py-2 border-b last-of-type:border-b-0 items-center text-[14px] text-gray-800 justify-between"
            >
              <Space size={5}>
                {record.type === 'single' && <i className="ri-user-line text-[24px]"></i>}
                {record.type === 'Batch' && <i className="ri-group-line text-[24px]"></i>}
                <div className="flex flex-col gap-0">
                  <span className="font-semibold">{acctName}</span>
                  <span className="text-[12px] text-gray-600">{acctNumber}</span>
                  {record.type === 'Batch' && (
                    <div className="font-semibold text-[10px] text-blue">{`+${record.recipients.length} others`}</div>
                  )}
                  {}
                </div>
              </Space>
              <div
                className={`font-semibold ${
                  record.type === 'single'
                    ? record.status === 'successful'
                      ? 'text-green-700'
                      : record.status === 'pending'
                        ? 'text-yellow-400'
                        : 'text-red-500'
                    : record.type === 'Batch'
                      ? getBatchClassName(record)
                      : ''
                } `}
              >
                {amount}
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center mt-5 w-full hover:text-blue text-black underline underline-offset-2 cursor-pointer">
        view disbursement history
      </div>
    </Card>
  );
};

export default DisbursementHistory;
