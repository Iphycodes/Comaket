'use client';

import { Table } from 'antd';
import React from 'react';
import { TransactionsDataType, transactionsData } from './libs/transactions-data';
import { ColumnsType } from 'antd/lib/table';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { CaretUpOutlined, CaretDownOutlined } from '@ant-design/icons';

const TransactionsTable = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  const columns: ColumnsType<TransactionsDataType> = [
    {
      title: (
        <span className="flex items-center gap-1">
          Date{' '}
          <span className="flex flex-col items-center justify-center gap-0 text-[7px]">
            <CaretUpOutlined />
            <CaretDownOutlined />
          </span>
        </span>
      ),
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Function',
      dataIndex: 'function',
      key: 'age',
    },
    {
      title: 'NIN',
      dataIndex: 'NIN',
      key: 'age',
    },
    {
      title: 'Offence',
      dataIndex: 'offence',
      key: 'address',
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: 'Agency',
      dataIndex: 'agency',
      key: 'agency',
      ellipsis: {
        showTitle: true,
      },
    },
    {
      title: 'Action',
      key: 'action',
      //   fixed: 'right',
      render: () => {
        return <span style={{ color: 'red' }}>Delete</span>;
      },
    },
  ];
  return (
    <Table
      columns={columns}
      pagination={{ pageSize: 8, position: ['bottomCenter'] }}
      dataSource={transactionsData}
      scroll={{ y: 500, x: isMobile ? true : 0 }}
      className={'blacklist-table'}
    />
  );
};

export default TransactionsTable;
