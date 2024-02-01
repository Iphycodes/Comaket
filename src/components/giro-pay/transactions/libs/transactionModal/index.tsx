'use client';

import { capitalize } from 'lodash';
import { Button, Modal, Space, Tag } from 'antd';
import { GrTransaction } from 'react-icons/gr';
import { DownloadOutlined } from '@ant-design/icons';
import { TransactionReceipt } from '@grc/_shared/components/transaction-receipt';
import { omit } from 'lodash';

interface TransactionModalProps {
  transactionItem: Record<string, any>;
  isModalOpen: boolean;
  handleCancel: () => void;
}

const TransactionModal = (props: TransactionModalProps) => {
  const { transactionItem, isModalOpen, handleCancel } = props;

  const getDate = (datestring: string) => {
    const originalDate = new Date(datestring);

    const day = originalDate.getDate().toString().padStart(2, '0');
    const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
    const year = originalDate.getFullYear().toString().slice(2);
    const hours = originalDate.getHours() % 12 || 12; // Convert 24-hour format to 12-hour format
    const minutes = originalDate.getMinutes().toString().padStart(2, '0');
    const period = originalDate.getHours() < 12 ? 'am' : 'pm';

    // Create the formatted date string
    const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}${period}`;
    return formattedDate;
  };

  return (
    <Modal width={'600px'} title={``} open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className="w-full mt-8 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <Space size={5}>
            <span
              className="text-[16px] flex justify-center items-center h-10 w-10 bg-blue"
              style={{ borderRadius: '50%' }}
            >
              <GrTransaction color="#ffffff" />
            </span>
            <span className="font-semibold text-[16px]">
              {capitalize(transactionItem?.transactionType) ?? ''}
            </span>
          </Space>
          <span className="text-[24px] font-bold">
            {`${transactionItem?.currency === 'NGN' && '\u20A6'}${transactionItem?.amount}` ?? ''}
          </span>
        </div>
        <div className="flex relative items-center justify-center">
          <span
            style={{ zIndex: 2 }}
            className="p-1 text-[12px] text-gray-500 bg-white px-3 font-semibold flex justify-center items-center border-2 rounded-3xl"
          >
            {getDate(transactionItem?.date ?? '') ?? ''}
          </span>
          <hr className="w-full absolute border" style={{ zIndex: 1 }} />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[16px] text-gray-500">Entry Type:</span>
          <span className="font-semibold">{capitalize(transactionItem?.entry) ?? ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px] text-gray-500">Reciepient:</span>
          <span className="font-semibold">{transactionItem?.beneficiary?.accountName ?? ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px] text-gray-500">Reciepient Account:</span>
          <span className="font-semibold">{transactionItem?.beneficiary?.accountNumber ?? ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px] text-gray-500">Reciepient Bank:</span>
          <span className="font-semibold">
            {capitalize(transactionItem?.beneficiary?.bankName ?? '') ?? ''}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px] text-gray-500">Transaction Status:</span>
          <span>
            {transactionItem?.status === 'successful' && (
              <Tag className="mx-auto text-[14px] px-2" color="success">
                Successful
              </Tag>
            )}
            {transactionItem?.status === 'failed' && <Tag color="error">Failed</Tag>}
          </span>
        </div>

        <hr className="w-full my-4 border" />
        <div className="flex justify-between items-center">
          <span className="text-[16px] text-gray-500">Reference:</span>
          <span className="font-semibold">{transactionItem?.reference ?? ''}</span>
        </div>
        <Button
          className="opacity-100 bg-blue hover:opacity-95 font-semibold mt-3 text-white h-12"
          type="primary"
          disabled={false}
          loading={false}
          onClick={() =>
            TransactionReceipt({
              successData: {
                ...omit(transactionItem, ['source', 'beneficiary']),
                accountName:
                  transactionItem?.entry === 'debit'
                    ? transactionItem?.beneficiary?.accountName
                    : transactionItem?.source?.accountName,
                accountNumber:
                  transactionItem?.entry === 'debit'
                    ? transactionItem?.beneficiary?.accountNumber
                    : transactionItem?.source?.accountNumber,
                bankName:
                  transactionItem?.entry === 'debit'
                    ? transactionItem?.beneficiary?.bankName
                    : transactionItem?.source?.bankName,
                entry: transactionItem?.entry,
              },
              // setLoading,
            })
          }
        >
          <div className="flex items-center gap-2 justify-center">
            <DownloadOutlined className="text-[18px]" />
            <span>Download Reciept</span>
          </div>
        </Button>
      </div>
    </Modal>
  );
};

export default TransactionModal;
