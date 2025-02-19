import React from 'react';
import { Table, Button, Space, Tag, Image, Tooltip } from 'antd';
import { motion } from 'framer-motion';
import { Edit2, Trash2, Eye, Heart, MessageCircle, Bookmark } from 'lucide-react';
import type { ColumnsType } from 'antd/es/table';
import { mockMarketItemType } from '@grc/_shared/namespace';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { capitalize, startCase } from 'lodash';

interface MarketTableProps {
  items: Partial<mockMarketItemType>[];
  onEdit: (item: Partial<mockMarketItemType>) => void;
  onDelete: (item: Partial<mockMarketItemType>) => void;
  onView: (item: Partial<mockMarketItemType>) => void;
  isLoading: boolean;
}

const MarketItemsTable: React.FC<MarketTableProps> = ({
  items,
  onEdit,
  onDelete,
  onView,
  isLoading,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'success';
      case 'pending':
        return 'warning';
      case 'rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'processed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'awaiting payment':
        return 'processing';
      default:
        return 'default';
    }
  };

  const columns: ColumnsType<Partial<mockMarketItemType>> = [
    {
      title: '',
      key: 'sponsored',
      width: '30px',
      render: (_, record: Partial<mockMarketItemType>) => (
        <Space>
          {record.sponsored && (
            <i className="ri-sparkling-fill text-[24px] text-yellow-600" color="red"></i>
          )}
        </Space>
      ),
    },
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
      ...(isMobile ? { width: '220px' } : {}),
      render: (text: string, record: Partial<mockMarketItemType>) => (
        <div className="flex items-center gap-3 !min-w-[200px]">
          {record.postImgUrls?.[0] && (
            <Image
              src={record.postImgUrls[0]}
              alt={text}
              width={48}
              height={48}
              className="rounded-md object-cover"
              preview={false}
            />
          )}
          <div>
            <div className="font-medium">{text}</div>
            <div className="text-sm text-gray-500">
              {(record?.description ?? '').length > 50
                ? `${(record.description ?? '').substring(0, 50)}...`
                : record.description}
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      render: (condition: string) => (
        <Tag className="rounded-3xl" color={condition === 'Brand New' ? 'green' : 'blue'}>
          {condition}
        </Tag>
      ),
    },
    {
      title: 'Price',
      dataIndex: ['askingPrice', 'price'],
      key: 'price',
      render: (price: number) => (
        <span className="font-medium">₦{(price / 100).toLocaleString()}</span>
      ),
    },
    {
      title: 'Negotiability',
      key: 'negotiability',
      render: (_, record: Partial<mockMarketItemType>) => (
        <Space>
          {record.askingPrice?.negotiable && (
            <Tag className="rounded-3xl" color="purple">
              Negotiable
            </Tag>
          )}
        </Space>
      ),
    },
    // {
    //   title: 'Seller',
    //   dataIndex: ['postUserProfile', 'businessName'],
    //   key: 'seller',
    //   render: (businessName: string, record: Partial<mockMarketItemType>) => (
    //     <div className="flex items-center gap-2">
    //       {record.postUserProfile?.profilePicUrl && (
    //         <Image
    //           src={record.postUserProfile.profilePicUrl}
    //           alt={businessName}
    //           width={24}
    //           height={24}
    //           className="rounded-full"
    //           preview={false}
    //         />
    //       )}
    //       <span>{businessName || record.postUserProfile?.userName || 'Unknown Seller'}</span>
    //     </div>
    //   ),
    // },
    {
      title: 'Engt.',
      key: 'engagement',
      render: (_, record: Partial<mockMarketItemType>) => (
        <div className="">
          <div className="flex flex-col">
            <span className="flex items-center gap-1">
              <Heart size={14} className="text-red-500" />
              <span className="text-sm">{record.likes?.length ?? 0}</span>
            </span>
            <span className="flex items-center gap-1">
              <MessageCircle size={14} className="text-blue-500" />
              <span className="text-sm">{record.comments?.length ?? 0}</span>
            </span>
            <div className="flex items-center gap-1">
              <Bookmark size={14} className="text-purple-500" />
              <span className="text-sm">{record.bookMarks?.length ?? 0}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag className="rounded-3xl" color={getStatusColor(status)}>
          {status?.charAt(0).toUpperCase() + status?.slice(1).toLowerCase() || 'Pending'}
        </Tag>
      ),
    },
    {
      title: 'Fee Payment',
      dataIndex: 'feePaymentStatus',
      key: 'status',
      render: (paymentStatus: string) => (
        <>
          {paymentStatus === 'awaiting payment' ? (
            <Button className="!bg-blue text-white !h-8">Make Payment</Button>
          ) : (
            <Tag className="rounded-3xl" color={getPaymentStatusColor(paymentStatus)}>
              {startCase(capitalize(paymentStatus)) || 'Awaiting Appoval'}
            </Tag>
          )}
        </>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right', // Add this line
      width: isMobile ? 150 : 150, // Add a fixed width
      onCell: () => ({
        onClick: (e) => {
          e.stopPropagation();
        },
      }),
      render: (_, record: Partial<mockMarketItemType>) => (
        <Space size="small">
          <Tooltip title="View Details">
            <Button
              type="text"
              icon={<Eye size={16} />}
              onClick={() => onView(record)}
              className="text-blue-600 hover:text-blue-700"
            />
          </Tooltip>
          <Tooltip title="Edit Item">
            <Button
              type="text"
              icon={<Edit2 size={16} />}
              onClick={() => onEdit(record)}
              className="text-green-600 hover:text-green-700"
            />
          </Tooltip>
          <Tooltip title="Delete Item">
            <Button
              type="text"
              icon={<Trash2 size={16} />}
              onClick={() => onDelete(record)}
              className="text-red-600 hover:text-red-700"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`overflow-hidden ${isMobile ? 'max-w-[100vw]' : ''}`}
    >
      <div className="overflow-x-auto">
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={items}
          rowKey={(record) => record?.id ?? ''}
          className="bg-white dark:bg-gray-800 rounded-lg shadow-sm"
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          scroll={{ x: isMobile ? 1200 : true }}
          onRow={(record) => ({
            onClick: () => onView(record),
            className: 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors',
          })}
        />
      </div>
    </motion.div>
  );
};

export default MarketItemsTable;
