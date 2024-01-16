'use client';

import { Card, Table, Tag, Tooltip } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';
import { TransactionsDataType, transactionsData } from './libs/transactions-data';
import { ColumnsType } from 'antd/lib/table';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import TableFooter from './libs/table-footer';

interface TransactionTableProps {
  handleRowClick: (record: any) => void;
  setTransactionDrawerOpen: () => void;
  setSelectedRecord: Dispatch<SetStateAction<TransactionsDataType>>;
}

const TransactionsTable = (props: TransactionTableProps) => {
  const { handleRowClick, setTransactionDrawerOpen, setSelectedRecord } = props;
  const isMobile = useMediaQuery(mediaSize.mobile);

  const handleAdvancedViewClick = (record: TransactionsDataType) => {
    setTransactionDrawerOpen();

    setSelectedRecord(record);
  };

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
      onCell: () => ({
        onClick: (event) => {
          event.stopPropagation();
        },
      }),
      render: (_: any, record: TransactionsDataType) => (
        <span>
          <Tooltip title="view">
            <i
              className="ri-eye-line cursor-pointer font-bold hover:text-blue"
              color="red"
              onClick={() => handleAdvancedViewClick(record)}
            ></i>
          </Tooltip>
        </span>
      ),
    },
  ];

  const rowClick = (record: any) => ({
    onClick: () => handleRowClick(record),
  });
  return (
    <Card className="shadow-sm">
      <Table
        size="large"
        columns={columns}
        pagination={{ pageSize: 8, position: ['bottomLeft'] }}
        dataSource={transactionsData}
        scroll={{ x: isMobile ? true : 0 }}
        className={'transaction-table'}
        onRow={rowClick}
        footer={() => <TableFooter />}
      />
    </Card>
  );
};

export default TransactionsTable;
