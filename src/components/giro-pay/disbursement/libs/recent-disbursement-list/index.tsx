import {
  BatchDisbursement,
  DisbursementRecord,
  mockDisbursementRecord,
} from '@grc/_shared/constant';
import { numberFormat } from '@grc/_shared/helpers';
import { Card, List, Space, Tag } from 'antd';
import moment from 'moment';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';

interface RecentDisbursementsProps {
  // Add your prop types here
  setSelectedRecord: Dispatch<SetStateAction<Record<string, any>>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const RecentDisbursements: React.FC<RecentDisbursementsProps> = ({
  setOpen,
  setSelectedRecord,
}) => {
  const handleItemClick = (item: Record<string, any>) => {
    setSelectedRecord(item);
    setOpen(true);
  };

  const getBatch = (record: BatchDisbursement) => {
    let pendingFlag = 0;
    let color = '';
    let statusFlag = '';

    let successfulPayouts = 0;
    let pendingPayouts = 0;
    let failedPayouts = 0;

    record?.recipients.map(({ status }) => {
      status === 'successful'
        ? (successfulPayouts += 1)
        : status === 'pending'
          ? (pendingPayouts += 1)
          : status === 'failed'
            ? (failedPayouts += 1)
            : console.log('');
    });

    for (let i = 0; i < record.recipients.length; i++) {
      const { status } = record.recipients[i];

      if (status === 'successful') {
        if (pendingFlag === 0) {
          color = 'success';
          statusFlag = 'successful';
        }
      } else if (status === 'pending') {
        pendingFlag = 1;
        color = 'warning';
        statusFlag = 'pending';
      } else {
        color = 'error';
        statusFlag = 'failed';
        break; // Break out of the loop when condition is met
      }
    }

    return {
      color: color,
      statusFlag: statusFlag,
      successfulPayouts,
      pendingPayouts,
      failedPayouts,
    };
  };
  return (
    <Card className="w-full border shadow-sm hover:shadow-md shadow-gray-100 h-full">
      <List
        className="overflow-y-auto"
        header={<div className="font-semibold">Recent Disbursements</div>}
        footer={
          mockDisbursementRecord && (
            <div className="text-center mt-5">
              <Link prefetch className="text-blue" href={'/apps/giro-debit/transactions'}>
                See all &rarr;
              </Link>
            </div>
          )
        }
        dataSource={mockDisbursementRecord}
        loading={false}
        locale={{
          emptyText: (
            <div className="text-gray-500 text-justify">
              <div>No Disbursements Record Available</div>
              <div>
                Disbursement insight will be shown here once you create a virtual account and
                commence pay-ins and pay-outs
              </div>
            </div>
          ),
        }}
        renderItem={(item: DisbursementRecord, index) => {
          const acctName =
            item.type === 'single'
              ? `${item?.recipient}`
              : item?.recipients
                ? `${item?.recipients[0].recipient || ''}`
                : 'account Name';

          const amount =
            item?.type === 'single'
              ? item?.amount
              : item?.recipients
                ? item?.recipients[0].amount || 0
                : 0;

          return (
            <List.Item
              onClick={() => handleItemClick(item)}
              className="px-0 cursor-pointer"
              key={index}
            >
              <div className="w-full flex justify-between items-center text-left p-2">
                <List.Item.Meta
                  //   title={startCase(capitalize(item?.recipient))}
                  description={
                    <Space size={5}>
                      {item?.type === 'single' && <i className="ri-user-line text-[24px]"></i>}
                      {item?.type === 'Batch' && <i className="ri-group-line text-[24px]"></i>}
                      <div className="flex text-black flex-col gap-0">
                        <span className="font-semibold text-black">{acctName}</span>
                        <span className="text-[12px] text-gray-600">
                          {moment(item?.date ?? '').format('MMM DD, YYYY hh:mm A')}
                        </span>
                        <Space className="font-semibold text-[10px] flex items-center gap-1 text-blue">
                          <span>{item?.type} Payout</span>
                          {item?.type === 'Batch' && (
                            <div>{`(${item?.recipients.length} reciepients)`}</div>
                          )}
                        </Space>
                      </div>
                    </Space>
                  }
                />
                <div className="flex flex-col items-end">
                  <div className="font-semibold m-0">{numberFormat(amount / 100, '₦')}</div>
                  {item.type === 'single' && (
                    <Tag
                      className="text-center m-0"
                      color={
                        item?.type === 'single'
                          ? item?.status === 'successful'
                            ? 'success'
                            : item?.status === 'pending'
                              ? 'processing'
                              : 'error'
                          : 'default'
                      }
                    >
                      {item?.type === 'single' ? item?.status : getBatch(item)?.statusFlag}
                    </Tag>
                  )}
                  {item.type === 'Batch' && (
                    <Space size={8} className="flex items-center">
                      <div className="flex gap-0 font-semibold items-center">
                        <i className="ri-check-line text-green-500"></i>{' '}
                        <span className="text-[12px]">{getBatch(item)?.successfulPayouts}</span>
                      </div>
                      <div className="flex gap-0 font-semibold items-center">
                        <i className="ri-arrow-left-right-fill text-orange-400"></i>{' '}
                        <span className="text-[12px]">{getBatch(item)?.pendingPayouts}</span>
                      </div>
                      <div className="flex gap-0 font-semibold items-center">
                        <i className="ri-close-line text-red-500"></i>
                        <span className="text-[12px]">{getBatch(item)?.failedPayouts}</span>
                      </div>
                    </Space>
                  )}
                </div>
              </div>
            </List.Item>
          );
        }}
      />
    </Card>
  );
};

export default RecentDisbursements;
