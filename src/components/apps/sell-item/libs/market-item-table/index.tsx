'use client';

import React from 'react';
import { Table, Button, Space, Tooltip, Tag, message } from 'antd';
import { motion } from 'framer-motion';
import {
  Edit2,
  Trash2,
  Eye,
  CreditCard,
  Package,
  ThumbsUp,
  ThumbsDown,
  ArrowLeftRight,
  AlertTriangle,
} from 'lucide-react';
import { usePaystackPayment } from 'react-paystack';
import type { ColumnsType } from 'antd/es/table';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import {
  SellItemType,
  SellItemStatus,
  SellingModel,
  getStatusLabel,
  getStatusColor,
  getSellingModelLabel,
} from '@grc/_shared/namespace/sell-item';

interface Props {
  items: SellItemType[];
  onView: (item: SellItemType) => void;
  onEdit: (item: SellItemType) => void;
  onDelete: (item: SellItemType) => void;
  onPayFee: (item: SellItemType) => void;
  onAcceptOffer: (item: SellItemType) => void;
  onRejectOffer: (item: SellItemType) => void;
  onCounterOffer: (item: SellItemType) => void;
  isLoading: boolean;
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

const StatusBadge: React.FC<{ status: SellItemStatus; rejectionReason?: string }> = ({
  status,
  rejectionReason,
}) => {
  const color = getStatusColor(status);
  const label = getStatusLabel(status);

  return (
    <Tooltip title={status === 'rejected' && rejectionReason ? `Reason: ${rejectionReason}` : ''}>
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: `${color}15`,
          color: color,
          border: `1px solid ${color}30`,
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
        {label}
        {status === 'rejected' && <AlertTriangle size={11} className="ml-0.5" />}
      </span>
    </Tooltip>
  );
};

// ─── Selling Model Badge ──────────────────────────────────────────────────────

const ModelBadge: React.FC<{ model: SellingModel }> = ({ model }) => {
  const configs: Record<SellingModel, { bg: string; text: string; icon: string }> = {
    'self-listing': {
      bg: 'bg-indigo-50 dark:bg-blue-900/20',
      text: 'text-blue dark:text-blue',
      icon: 'ri-store-2-line',
    },
    consignment: {
      bg: 'bg-violet-50 dark:bg-violet-900/20',
      text: 'text-violet-700 dark:text-violet-300',
      icon: 'ri-handshake-line',
    },
    'direct-sale': {
      bg: 'bg-emerald-50 dark:bg-emerald-900/20',
      text: 'text-emerald-700 dark:text-emerald-300',
      icon: 'ri-exchange-dollar-line',
    },
  };
  const c = configs[model];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium ${c.bg} ${c.text}`}
    >
      <i className={`${c.icon} text-[12px]`} />
      {getSellingModelLabel(model)}
    </span>
  );
};

// ─── Pay Fee Table Button (Paystack) ──────────────────────────────────────────

const PayFeeTableButton: React.FC<{
  item: SellItemType;
  onSuccess: () => void;
}> = ({ item, onSuccess }) => {
  const feeKobo = item.listingFee || 0;

  const config = {
    reference: `CMK-FEE-${item.id}-${Date.now()}`,
    email: 'ifeanyiemmanuel585@gmail.com', // Populated from user context / auth in production
    amount: feeKobo,
    publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || '',
    metadata: {
      custom_fields: [
        {
          display_name: 'Payment Type',
          variable_name: 'payment_type',
          value: 'listing_fee',
        },
        {
          display_name: 'Item ID',
          variable_name: 'item_id',
          value: String(item.id),
        },
        {
          display_name: 'Item Name',
          variable_name: 'item_name',
          value: item.itemName,
        },
      ],
    },
  };

  const initializePayment = usePaystackPayment(config);

  const handlePay = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click from firing
    if (!config.publicKey) {
      message.error('Payment configuration missing. Please try again later.');
      return;
    }
    initializePayment({
      onSuccess: (reference: any) => {
        console.log('Listing fee payment successful:', reference);
        message.success('Payment successful! Your item is now live.');
        onSuccess();
      },
      onClose: () => {
        message.info('Payment cancelled. You can pay anytime to go live.');
      },
    });
  };

  return (
    <Tooltip title="Pay Listing Fee">
      <Button
        type="primary"
        size="small"
        icon={<CreditCard size={14} />}
        onClick={handlePay}
        className="!bg-blue !border-blue !text-white !h-7 !text-xs !rounded-lg"
      >
        Pay Fee
      </Button>
    </Tooltip>
  );
};

// ─── Action Buttons (status-aware) ────────────────────────────────────────────

const ActionButtons: React.FC<{
  item: SellItemType;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPayFee: () => void;
  onAcceptOffer: () => void;
  onRejectOffer: () => void;
  onCounterOffer: () => void;
}> = ({
  item,
  onView,
  onEdit,
  onDelete,
  onPayFee,
  onAcceptOffer,
  onRejectOffer,
  onCounterOffer,
}) => {
  const { status, sellingModel } = item;

  return (
    <Space size="small" className="flex flex-wrap gap-1">
      <Tooltip title="View Details">
        <Button type="text" icon={<Eye size={15} />} onClick={onView} className="text-blue" />
      </Tooltip>

      {/* Pay Fee — self-listing, awaiting-fee only */}
      {sellingModel === 'self-listing' && status === 'awaiting-fee' && (
        <PayFeeTableButton item={item} onSuccess={onPayFee} />
      )}

      {/* Accept/Reject/Counter — direct-sale, price-offered */}
      {sellingModel === 'direct-sale' &&
        (status === 'price-offered' || status === 'counter-offer') && (
          <>
            {status === 'price-offered' && (
              <>
                <Tooltip title="Accept Offer">
                  <Button
                    type="text"
                    icon={<ThumbsUp size={15} />}
                    onClick={onAcceptOffer}
                    className="!text-emerald-600 hover:!text-emerald-700"
                  />
                </Tooltip>
                <Tooltip title="Counter Offer">
                  <Button
                    type="text"
                    icon={<ArrowLeftRight size={15} />}
                    onClick={onCounterOffer}
                    className="!text-orange-600 hover:!text-orange-700"
                  />
                </Tooltip>
                <Tooltip title="Decline Offer">
                  <Button
                    type="text"
                    icon={<ThumbsDown size={15} />}
                    onClick={onRejectOffer}
                    className="!text-red-500 hover:!text-red-600"
                  />
                </Tooltip>
              </>
            )}
          </>
        )}

      {/* Edit — only when in-review or rejected (can resubmit) */}
      {(status === 'in-review' || status === 'rejected') && (
        <Tooltip title="Edit">
          <Button
            type="text"
            icon={<Edit2 size={15} />}
            onClick={onEdit}
            className="!text-green-600"
          />
        </Tooltip>
      )}

      {/* Delete — only when in-review or rejected */}
      {(status === 'in-review' || status === 'rejected') && (
        <Tooltip title="Delete">
          <Button
            type="text"
            icon={<Trash2 size={15} />}
            onClick={onDelete}
            className="!text-red-500"
          />
        </Tooltip>
      )}
    </Space>
  );
};

// ─── Mobile Card Component ────────────────────────────────────────────────────

const MobileItemCard: React.FC<{
  item: SellItemType;
  onView: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onPayFee: () => void;
  onAcceptOffer: () => void;
  onRejectOffer: () => void;
  onCounterOffer: () => void;
}> = (props) => {
  const { item, onView } = props;

  return (
    <motion.div
      whileTap={{ scale: 0.98 }}
      className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden shadow-sm"
    >
      <div className="flex gap-3 p-3" onClick={onView}>
        {/* Thumbnail */}
        {item.postImgUrls?.[0] && (
          <div className="w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
            <img
              src={item.postImgUrls[0]}
              alt={item.itemName}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-sm text-gray-900 dark:text-white truncate">
              {item.itemName}
            </h3>
            {item.sponsored && (
              <i className="ri-sparkling-fill text-yellow-500 text-lg flex-shrink-0" />
            )}
          </div>

          <p className="text-lg font-bold text-gray-900 dark:text-white mt-0.5">
            ₦{((item.askingPrice?.price || 0) / 100).toLocaleString()}
          </p>

          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <ModelBadge model={item.sellingModel} />
            <StatusBadge status={item.status} rejectionReason={item.rejectionReason} />
          </div>
        </div>
      </div>

      {/* Rejection reason banner */}
      {item.status === 'rejected' && item.rejectionReason && (
        <div className="mx-3 mb-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
          <p className="text-xs text-red-700 dark:text-red-300 flex items-start gap-1.5">
            <AlertTriangle size={12} className="flex-shrink-0 mt-0.5" />
            <span>{item.rejectionReason}</span>
          </p>
        </div>
      )}

      {/* Price offered banner */}
      {item.status === 'price-offered' && item.platformBid && (
        <div className="mx-3 mb-2 px-3 py-2 bg-indigo-50 dark:bg-blue-900/20 rounded-lg border border-indigo-200 dark:border-blue">
          <p className="text-xs text-blue dark:text-blue">
            <span className="font-semibold">Our offer:</span> ₦
            {(item.platformBid / 100).toLocaleString()}
          </p>
        </div>
      )}

      {/* Counter offer banner */}
      {item.status === 'counter-offer' && item.counterOffer && (
        <div className="mx-3 mb-2 px-3 py-2 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
          <p className="text-xs text-orange-700 dark:text-orange-300">
            <span className="font-semibold">Your counter:</span> ₦
            {(item.counterOffer / 100).toLocaleString()}{' '}
            <span className="text-gray-400">
              (They offered ₦{((item.platformBid || 0) / 100).toLocaleString()})
            </span>
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="px-3 pb-3 flex justify-end">
        <ActionButtons {...props} item={item} />
      </div>
    </motion.div>
  );
};

// ─── Main Table/List Component ────────────────────────────────────────────────

const MarketItemsTable: React.FC<Props> = ({
  items,
  onView,
  onEdit,
  onDelete,
  onPayFee,
  onAcceptOffer,
  onRejectOffer,
  onCounterOffer,
  isLoading,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  // ── Mobile: Card list ────────────────────────────────────────────────
  if (isMobile) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
        {isLoading
          ? Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl h-28 animate-pulse" />
            ))
          : items.map((item) => (
              <MobileItemCard
                key={item.id}
                item={item}
                onView={() => onView(item)}
                onEdit={() => onEdit(item)}
                onDelete={() => onDelete(item)}
                onPayFee={() => onPayFee(item)}
                onAcceptOffer={() => onAcceptOffer(item)}
                onRejectOffer={() => onRejectOffer(item)}
                onCounterOffer={() => onCounterOffer(item)}
              />
            ))}
        {!isLoading && items.length === 0 && (
          <div className="text-center py-16">
            <Package size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 dark:text-gray-400 font-medium">No products yet</p>
            <p className="text-xs text-gray-400 mt-1">Start selling by adding your first product</p>
          </div>
        )}
      </motion.div>
    );
  }

  // ── Desktop: Ant Table ───────────────────────────────────────────────
  const columns: ColumnsType<SellItemType> = [
    // {
    //   title: '',
    //   key: 'sponsored',
    //   width: 30,
    //   render: (_, record) =>
    //     record.sponsored ? <i className="ri-sparkling-fill text-xl text-yellow-500" /> : null,
    // },
    {
      title: 'Item',
      dataIndex: 'itemName',
      key: 'itemName',
      render: (text: string, record) => (
        <div className="flex items-center gap-3 min-w-[200px]">
          {record.postImgUrls?.[0] && (
            <div className="w-12 h-12 rounded-lg overflow-hidden flex-shrink-0 bg-gray-100">
              <img src={record.postImgUrls[0]} alt={text} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="min-w-0">
            <div className="font-semibold text-sm truncate max-w-[200px]">{text}</div>
            <div className="text-xs text-gray-400 truncate max-w-[200px]">{record.description}</div>
          </div>
        </div>
      ),
    },
    {
      title: 'Sell Type',
      key: 'sellingModel',
      width: 130,
      render: (_, record) => <ModelBadge model={record.sellingModel} />,
    },
    {
      title: 'Price',
      key: 'price',
      width: 120,
      sorter: (a, b) => (a.askingPrice?.price || 0) - (b.askingPrice?.price || 0),
      render: (_, record) => (
        <div>
          <span className="font-semibold text-sm">
            ₦{((record.askingPrice?.price || 0) / 100).toLocaleString()}
          </span>
          {record.askingPrice?.negotiable && (
            <Tag color="purple" className="!rounded-full !text-[10px] !px-1.5 ml-1">
              Neg.
            </Tag>
          )}
        </div>
      ),
    },
    {
      title: 'Condition',
      dataIndex: 'condition',
      key: 'condition',
      width: 110,
      render: (condition: string) => (
        <Tag
          className="!rounded-full"
          color={condition === 'Brand New' ? 'green' : condition === 'Uk Used' ? 'blue' : 'gold'}
        >
          {condition}
        </Tag>
      ),
    },
    {
      title: 'Status',
      key: 'status',
      width: 150,
      render: (_, record) => (
        <StatusBadge status={record.status} rejectionReason={record.rejectionReason} />
      ),
    },
    // {
    //   title: 'Engagement',
    //   key: 'engagement',
    //   width: 100,
    //   render: (_, record) => (
    //     <div className="flex flex-col gap-0.5 text-xs">
    //       <span className="flex items-center gap-1">
    //         <Heart size={12} className="text-red-400" /> {record.likes?.length ?? 0}
    //       </span>
    //       <span className="flex items-center gap-1">
    //         <MessageCircle size={12} className="text-blue" /> {record.comments?.length ?? 0}
    //       </span>
    //       <span className="flex items-center gap-1">
    //         <Bookmark size={12} className="text-purple-400" /> {record.bookMarks?.length ?? 0}
    //       </span>
    //     </div>
    //   ),
    // },
    {
      title: 'Actions',
      key: 'actions',
      fixed: 'right',
      width: 200,
      onCell: () => ({ onClick: (e: any) => e.stopPropagation() }),
      render: (_, record) => (
        <ActionButtons
          item={record}
          onView={() => onView(record)}
          onEdit={() => onEdit(record)}
          onDelete={() => onDelete(record)}
          onPayFee={() => onPayFee(record)}
          onAcceptOffer={() => onAcceptOffer(record)}
          onRejectOffer={() => onRejectOffer(record)}
          onCounterOffer={() => onCounterOffer(record)}
        />
      ),
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Table
        loading={isLoading}
        columns={columns}
        dataSource={items}
        rowKey={(record) => String(record.id)}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-sm [&_.ant-table-thead_th]:!bg-gray-50 [&_.ant-table-thead_th]:!text-xs [&_.ant-table-thead_th]:!font-semibold [&_.ant-table-thead_th]:!text-gray-500 [&_.ant-table-thead_th]:!uppercase [&_.ant-table-thead_th]:!tracking-wider"
        pagination={{
          pageSize: 7,
          showSizeChanger: true,
          showTotal: (total) => `${total} products`,
          className: '!mt-4',
        }}
        scroll={{ x: 1100, y: 600 }}
        onRow={(record) => ({
          onClick: () => onView(record),
          className:
            'cursor-pointer hover:bg-gray-50/80 dark:hover:bg-gray-700/50 transition-colors',
        })}
      />
    </motion.div>
  );
};

export default MarketItemsTable;
