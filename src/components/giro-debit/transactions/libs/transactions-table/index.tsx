'use client';

import { Table, Tag } from 'antd';
import React from 'react';
import { TransactionsDataType, transactionsData } from './libs/transactions-data';
import { ColumnsType } from 'antd/lib/table';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
// import {} from 'remixicon';
import { RiExpandUpDownFill } from 'react-icons/ri';

const TransactionsTable = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  const columns: ColumnsType<TransactionsDataType> = [
    {
      title: (
        <span className="flex text-[12px] font-bold text-gray-500 items-center gap-1">
          <span>Date</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      dataIndex: 'date',
      key: 'name',
    },
    {
      title: (
        <span className="flex text-[12px] font-bold text-gray-500 items-center gap-1">
          <span>Type</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      dataIndex: 'type',
      key: 'age',
      render: (text) => <span className="font-bold text-black">{text}</span>,
    },
    {
      title: (
        <span className="flex text-[12px] font-bold text-gray-500 items-center gap-1">
          <span>Session ID</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      dataIndex: 'sessionId',
      key: 'age',
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: (
        <span className="flex text-[12px] font-bold text-gray-500 items-center gap-1">
          <span>Reciepient</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      dataIndex: 'reciepient',
      key: 'agency',
      ellipsis: {
        showTitle: true,
      },
      render: (text) => <span className="font-bold text-black">{text}</span>,
    },
    {
      title: (
        <span className="flex text-[12px] font-bold text-gray-500 items-center gap-1">
          <span>Reciepient Status</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      dataIndex: 'reciepientAccountStatus',
      key: 'agency',
      ellipsis: {
        showTitle: true,
      },
      render: (text) => {
        return (
          <div className="w-full">
            {text === 'approved' && (
              <Tag className="mx-auto" color="success">
                Approved
              </Tag>
            )}
            {text === 'unapproved' && <Tag color="error">Unapproved</Tag>}
          </div>
        );
      },
    },
    {
      title: (
        <span className="flex text-[12px] font-bold text-gray-500 items-center gap-1">
          <span>Reciepient Bank</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      dataIndex: 'reciepientBank',
      key: 'agency',
      ellipsis: {
        showTitle: true,
      },
      render: (text) => <span className="font-bold text-black">{text}</span>,
    },
    {
      title: (
        <span className="flex text-[12px] font-bold text-gray-500 items-center gap-1">
          <span>Amount</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      dataIndex: 'amount',
      key: 'agency',
      ellipsis: {
        showTitle: true,
      },
    },
  ];
  return (
    <Table
      columns={columns}
      pagination={{ pageSize: 10, position: ['bottomCenter'] }}
      dataSource={transactionsData}
      scroll={{ y: 350, x: isMobile ? true : 0 }}
      className={'transaction-table'}
    />
  );
};

export default TransactionsTable;
