'use client';

import { Skeleton, Table, Tag, Tooltip } from 'antd';
import React, { Dispatch, SetStateAction, useEffect } from 'react';
import { TransactionsDataType } from './libs/transactions-data';
import { ColumnsType } from 'antd/lib/table';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import TableFooter from './libs/table-footer';
import { isEmpty } from 'lodash';
import { numberFormat } from '@grc/_shared/helpers';
import { Pagination } from '@grc/_shared/namespace';

interface TransactionTableProps {
  handleRowClick: (record: any) => void;
  setTransactionDrawerOpen: () => void;
  setSelectedRecord: Dispatch<SetStateAction<TransactionsDataType>>;
  transactionsData?: Record<string, any>[];
  filter: { filterData: Record<string, any> };
  isLoadingTransactions: boolean;
  isTransactionFetching?: boolean;
  handleSendMail: () => void;
  pagination: Pagination;
}

const TransactionsTable = (props: TransactionTableProps) => {
  const {
    handleRowClick,
    setTransactionDrawerOpen,
    setSelectedRecord,
    transactionsData,
    filter,
    isLoadingTransactions,
    handleSendMail,
    pagination,
    isTransactionFetching,
  } = props;
  const isMobile = useMediaQuery(mediaSize.mobile);

  const handleAdvancedViewClick = (record: TransactionsDataType) => {
    setTransactionDrawerOpen();

    setSelectedRecord(record);
  };

  const columns: ColumnsType<any> = [
    {
      dataIndex: 'entry',
      key: 'entry',
      width: 40,
      render: (text) => (
        <span>
          {text === 'debit' && <i className="ri-arrow-left-up-line text-red-600"></i>}
          {text === 'credit' && <i className="ri-arrow-right-down-line text-green-500"></i>}
        </span>
      ),
    },
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
      render: (text) => {
        const originalDate = new Date(text);

        const day = originalDate.getDate().toString().padStart(2, '0');
        const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
        const year = originalDate.getFullYear().toString().slice(2);
        const hours = originalDate.getHours() % 12 || 12; // Convert 24-hour format to 12-hour format
        const minutes = originalDate.getMinutes().toString().padStart(2, '0');
        const period = originalDate.getHours() < 12 ? 'am' : 'pm';

        // Create the formatted date string
        const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}${period}`;
        return <span>{`${formattedDate}`}</span>;
      },
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Type</span>
        </span>
      ),
      dataIndex: 'transactionType',
      key: 'transactionType',
      width: '150px',
      render: (text) => <span>{text}</span>,
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Reference</span>
        </span>
      ),
      dataIndex: 'reference',
      key: 'reference',
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
      dataIndex: 'beneficiary',
      key: 'reciepient',
      ellipsis: {
        showTitle: true,
      },
      render: (text) => <span>{text?.accountName ?? ''}</span>,
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Reciepient Bank</span>
        </span>
      ),
      dataIndex: 'beneficiary',
      key: 'reciepientBank',
      ellipsis: {
        showTitle: true,
      },
      render: (text) => <span>{text?.bankName}</span>,
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
      width: '150px',
      render: (value) => <span>{numberFormat(value / 100, '₦ ')}</span>,
    },
    {
      title: (
        <span className="flex text-[14px] font-semibold text-gray-500 items-center gap-1">
          <span>Status</span>
        </span>
      ),
      dataIndex: 'status',
      key: 'status',
      ellipsis: {
        showTitle: true,
      },
      render: (text) => {
        return (
          <div className="w-full">
            {text === 'successful' && (
              <Tag className="mx-auto" color="success">
                successful
              </Tag>
            )}
            {text === 'failed' && <Tag color="error">Failed</Tag>}
          </div>
        );
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

  useEffect(() => {
    console.log('tansacccccccccccccccccccccc');
  }, [isLoadingTransactions]);

  const rowClick = (record: any) => ({
    onClick: () => handleRowClick(record),
  });
  return (
    <div className="shadow-sm border dark:border-gray-500 rounded-lg">
      <Skeleton active loading={isLoadingTransactions} paragraph={{ rows: 8 }}>
        <Table
          size="large"
          columns={columns}
          pagination={pagination}
          dataSource={transactionsData}
          scroll={{ x: isMobile ? true : 0 }}
          className={'transaction-table dark:bg-zinc-800 rounded-lg'}
          onRow={rowClick}
          footer={() =>
            !isEmpty(filter?.filterData) ? <TableFooter handleSendMail={handleSendMail} /> : null
          }
          loading={isLoadingTransactions || isTransactionFetching}
        />
      </Skeleton>
    </div>
  );
};

export default TransactionsTable;
