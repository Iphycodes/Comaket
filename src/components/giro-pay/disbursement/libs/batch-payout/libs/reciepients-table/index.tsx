import { ReciepientsDataType } from '@grc/_shared/constant';
import { Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import React from 'react';

interface ReciepientsTableProps {
  batchReciepientsData: ReciepientsDataType[];
  isEditable: boolean;
}

const ReciepientsTable: React.FC<ReciepientsTableProps> = ({
  batchReciepientsData,
  isEditable,
}) => {
  const columns: ColumnsType<ReciepientsDataType> = [
    {
      title: (
        <span className="flex text-[12px] text-gray-500 items-center gap-1">
          <span>Reciepient</span>
        </span>
      ),
      ellipsis: {
        showTitle: true,
      },
      dataIndex: 'accountName',
      key: 'account-name',
    },
    {
      title: (
        <span className="flex text-[12px] text-gray-500 items-center gap-1">
          <span>Account Number</span>
        </span>
      ),
      ellipsis: {
        showTitle: true,
      },
      dataIndex: 'accountNumber',
      key: 'account-number',
    },
    {
      title: (
        <span className="flex text-[12px] text-gray-500 items-center gap-1">
          <span>Bank</span>
        </span>
      ),
      ellipsis: {
        showTitle: true,
      },
      dataIndex: 'bank',
      key: 'bank',
    },
    {
      title: (
        <span className="flex text-[12px] text-gray-500 items-center gap-1">
          <span>Amount</span>
        </span>
      ),
      width: `${isEditable ? '80px' : '100px'}`,
      ellipsis: {
        showTitle: true,
      },
      dataIndex: 'amount',
      key: 'amount',
      render: (text) => <span>{`\u20A6${text}`}</span>,
    },
    isEditable
      ? {
          width: '30px',
          key: 'edit',
          render: () => (
            <span>
              <i className="ri-pencil-line text-blue"></i>
            </span>
          ),
        }
      : { width: '0px', key: 'edit' },
    isEditable
      ? {
          width: '30px',
          key: 'delete',
          render: () => (
            <span>
              <i className="ri-close-line text-red-500"></i>
            </span>
          ),
        }
      : { width: '0px', key: 'edit' },
  ];

  return (
    <div className="w-full">
      <Table
        size="small"
        columns={columns}
        pagination={{ pageSize: 5, position: ['bottomLeft'] }}
        dataSource={batchReciepientsData}
        scroll={{ x: 0 }}
        className={'batch-reciepients-table'}
      />
    </div>
  );
};

export default ReciepientsTable;
