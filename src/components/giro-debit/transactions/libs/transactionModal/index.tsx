'use client';

import { capitalize } from 'lodash';
import { TransactionsDataType } from '../transactions-table/libs/transactions-data';
import { Button, Modal, Space, Tag } from 'antd';
import { GrTransaction } from 'react-icons/gr';
import { DownloadOutlined } from '@ant-design/icons';

interface TransactionModalProps {
  transactionItem: TransactionsDataType;
  isModalOpen: boolean;
  handleCancel: () => void;
}

const TransactionModal = (props: TransactionModalProps) => {
  const { transactionItem, isModalOpen, handleCancel } = props;

  return (
    <Modal title={``} open={isModalOpen} onCancel={handleCancel} footer={null}>
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
              {capitalize(transactionItem?.type) ?? ''}
            </span>
          </Space>
          <span className="text-[24px] font-bold">{capitalize(transactionItem?.amount) ?? ''}</span>
        </div>
        <div className="flex relative items-center justify-center">
          <span
            style={{ zIndex: 2 }}
            className="p-1 text-[12px] text-gray-500 bg-white px-3 font-semibold flex justify-center items-center border-2 rounded-3xl"
          >
            {transactionItem?.date ?? ''}
          </span>
          <hr className="w-full absolute border" style={{ zIndex: 1 }} />
        </div>

        <div className="flex justify-between items-center">
          <span className="text-[16px] text-gray-500">Reciepient:</span>
          <span className="font-semibold">{transactionItem?.reciepient?.toUpperCase() ?? ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px] text-gray-500">Reciepient Status:</span>
          <span>
            {transactionItem?.reciepientAccountStatus === 'approved' && (
              <Tag className="mx-auto text-[14px] px-2" color="success">
                Approved
              </Tag>
            )}
            {transactionItem?.reciepientAccountStatus === 'unapproved' && (
              <Tag color="error">Unapproved</Tag>
            )}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px] text-gray-500">Reciepient Bank:</span>
          <span className="font-semibold">{capitalize(transactionItem?.reciepientBank) ?? ''}</span>
        </div>
        <hr className="w-full my-4 border" />
        <div className="flex justify-between items-center">
          <span className="text-[16px] text-gray-500">Session Id:</span>
          <span className="font-semibold">{capitalize(transactionItem?.sessionId) ?? ''}</span>
        </div>
        <Button
          className="opacity-100 bg-blue hover:opacity-95 font-semibold mt-3 text-white h-10"
          type="primary"
          disabled={false}
          loading={false}
          htmlType="submit"
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
