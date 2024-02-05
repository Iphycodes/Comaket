// import { BatchDisbursement, DisbursementRecord } from '@grc/_shared/constant';
import { numberFormat } from '@grc/_shared/helpers';
import { List, Space, Tag } from 'antd';
import { isEmpty } from 'lodash';
import moment from 'moment';
import Link from 'next/link';
import React, { Dispatch, SetStateAction } from 'react';

interface RecentDisbursementsProps {
  // Add your prop types here
  setSelectedRecord: Dispatch<SetStateAction<Record<string, any>>>;
  setOpen: Dispatch<SetStateAction<boolean>>;
  recentDisbursementData: Record<string, any>[];
}

const RecentDisbursements: React.FC<RecentDisbursementsProps> = ({
  setOpen,
  setSelectedRecord,
  recentDisbursementData,
}) => {
  const handleItemClick = (item: Record<string, any>) => {
    setSelectedRecord(item);
    setOpen(true);
  };

  const getBatch = (record: Record<string, any>) => {
    let pendingFlag = 0;
    let color = '';
    let statusFlag = '';

    let successfulPayouts = 0;
    let pendingPayouts = 0;
    let failedPayouts = 0;

    record?.recipients.map((recipient: any) => {
      recipient?.status === 'successful'
        ? (successfulPayouts += 1)
        : recipient?.status === 'pending'
          ? (pendingPayouts += 1)
          : recipient?.status === 'failed'
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
    <div className="w-full border shadow-sm p-5 dark:bg-zinc-800 rounded-xl dark:border-gray-500 h-full">
      <List
        className="overflow-y-auto"
        header={<div className="font-semibold">Recent Disbursements</div>}
        footer={
          !isEmpty(recentDisbursementData) && (
            <div className="text-center mt-5">
              <Link prefetch className="text-blue" href={'/apps/giro-pay/transactions'}>
                See all &rarr;
              </Link>
            </div>
          )
        }
        dataSource={recentDisbursementData}
        loading={false}
        locale={{
          emptyText: (
            <div className="text-gray-500 dark:text-gray-500 w-full min-h-full flex text-left items-start gap-2 mt-5 px-10 pl-0 flex-col">
              <div>No Disbursements Records Available</div>
              <div>
                Disbursement insight will be shown here once you create a virtual account and
                commence pay-ins and pay-outs
              </div>
            </div>
          ),
        }}
        renderItem={(item: Record<string, any>, index) => {
          const acctName =
            typeof item?.beneficiary === 'object'
              ? `${item?.beneficiary?.accountName}`
              : Array.isArray(item?.beneficiary)
                ? `${item?.recipients[0].recipient || ''}`
                : 'account Name';

          // const amount =
          //   item?.type === 'single'
          //     ? item?.amount
          //     : item?.recipients
          //       ? item?.recipients[0].amount || 0
          //       : 0;

          return (
            <List.Item
              onClick={() => handleItemClick(item)}
              className="px-0 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-900"
              key={index}
            >
              <div className="w-full flex justify-between items-center text-left p-2">
                <List.Item.Meta
                  description={
                    <Space size={5}>
                      {typeof item?.beneficiary === 'object' && (
                        <i className="ri-user-line text-[24px]"></i>
                      )}
                      {Array.isArray(item?.beneficiary) && (
                        <i className="ri-group-line text-[24px]"></i>
                      )}
                      <div className="flex flex-col gap-0">
                        <span className="font-semibold text-black dark:text-gray-100">
                          {acctName}
                        </span>
                        <span className="text-[12px] text-gray-500">
                          {moment(item?.date ?? '').format('MMM DD, YYYY hh:mm A')}
                        </span>
                        <Space className="font-semibold text-[10px] flex items-center gap-1 text-blue">
                          <span>
                            {typeof item?.beneficiary === 'object' ? 'Single' : 'Batch'} Payout
                          </span>
                          {Array.isArray(item?.beneficiary) && (
                            <div>{`(${item?.beneficiary.length} reciepients)`}</div>
                          )}
                        </Space>
                      </div>
                    </Space>
                  }
                />
                <div className="flex flex-col items-end">
                  <div className="font-semibold m-0">{numberFormat(item?.amount / 100, '₦')}</div>
                  {typeof item?.beneficiary && (
                    <Tag
                      className="text-center m-0"
                      color={
                        item?.status === 'successful'
                          ? 'success'
                          : item?.status === 'processing'
                            ? 'processing'
                            : 'error'
                      }
                    >
                      {item?.status}
                    </Tag>
                  )}
                  {Array.isArray(item?.beneficiary) && (
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
    </div>
  );
};

export default RecentDisbursements;
