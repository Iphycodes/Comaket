'use client';

import { Table, Tag } from 'antd';
import React from 'react';
import { TransactionsDataType, transactionsData } from './libs/transactions-data';
import { ColumnsType } from 'antd/lib/table';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { RiExpandUpDownFill, RiCircleFill } from 'react-icons/ri';

interface TransactionTableProps {
  handleRowClick: (record: any) => void;
}

const TransactionsTable = (props: TransactionTableProps) => {
  const { handleRowClick } = props;
  const isMobile = useMediaQuery(mediaSize.mobile);

  const columns: ColumnsType<TransactionsDataType> = [
    {
      title: null,
      dataIndex: '',
      key: 'bullet',
      render: () => <RiCircleFill color="green" size={10} />,
      width: 30,
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Date</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      ellipsis: {
        showTitle: true,
      },
      dataIndex: 'date',
      key: 'name',
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Type</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      dataIndex: 'type',
      key: 'age',
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
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
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Reciepient</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      dataIndex: 'reciepient',
      key: 'agency',
      ellipsis: {
        showTitle: true,
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
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
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Reciepient Bank</span>
          <RiExpandUpDownFill size={15} />
        </span>
      ),
      dataIndex: 'reciepientBank',
      key: 'agency',
      ellipsis: {
        showTitle: true,
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
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

  const rowProps = (record: any) => ({
    onClick: () => handleRowClick(record),
  });
  return (
    <>
      <Table
        size="large"
        columns={columns}
        pagination={{ pageSize: 10, position: ['bottomCenter'] }}
        dataSource={transactionsData}
        scroll={{ y: 350, x: isMobile ? true : 0 }}
        className={'transaction-table'}
        onRow={rowProps}
      />
    </>
  );
};

export default TransactionsTable;
