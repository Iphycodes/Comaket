'use client';

import { Card, Table, Tag, Tooltip } from 'antd';
import React from 'react';
import { TransactionsDataType, transactionsData } from './libs/transactions-data';
import { ColumnsType } from 'antd/lib/table';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

interface TransactionTableProps {
  handleRowClick: (record: any) => void;
}

const TransactionsTable = (props: TransactionTableProps) => {
  const { handleRowClick } = props;
  const isMobile = useMediaQuery(mediaSize.mobile);

  const columns: ColumnsType<TransactionsDataType> = [
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Date</span>
        </span>
      ),
      ellipsis: {
        showTitle: true,
      },
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Type</span>
        </span>
      ),
      dataIndex: 'type',
      key: 'type',
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Session ID</span>
        </span>
      ),
      dataIndex: 'sessionId',
      key: 'sessionId',
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Reciepient</span>
        </span>
      ),
      dataIndex: 'reciepient',
      key: 'reciepient',
      ellipsis: {
        showTitle: true,
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Reciepient Status</span>
        </span>
      ),
      dataIndex: 'reciepientAccountStatus',
      key: 'reciepientAccountStatus',
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
        </span>
      ),
      dataIndex: 'reciepientBank',
      key: 'reciepientBank',
      ellipsis: {
        showTitle: true,
      },
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Amount</span>
        </span>
      ),
      dataIndex: 'amount',
      key: 'amount',
      ellipsis: {
        showTitle: true,
      },
    },
    {
      dataIndex: '',
      key: 'view',
      width: 40,
      render: () => (
        <span>
          <Tooltip title="view">
            <i className="ri-eye-line font-bold hover:text-green-500" color="red"></i>
          </Tooltip>
        </span>
      ),
    },
  ];

  const rowProps = (record: any) => ({
    onClick: () => handleRowClick(record),
  });
  return (
    <Card className="shadow-sm">
      <Table
        size="large"
        columns={columns}
        pagination={{ pageSize: 10, position: ['bottomLeft'] }}
        dataSource={transactionsData}
        scroll={{ y: 350, x: isMobile ? true : 0 }}
        className={'transaction-table'}
        onRow={rowProps}
      />
    </Card>
  );
};

export default TransactionsTable;
