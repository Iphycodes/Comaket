'use client';

import { capitalize } from 'lodash';
import { TransactionsDataType } from '../transactions-table/libs/transactions-data';
import { Modal } from 'antd';

interface TransactionModalProps {
  transactionItem: TransactionsDataType;
  isModalOpen: boolean;
  handleCancel: () => void;
}

const TransactionModal = (props: TransactionModalProps) => {
  const { transactionItem, isModalOpen, handleCancel } = props;

  return (
    <Modal title={``} open={isModalOpen} onCancel={handleCancel} footer={null}>
      <div className="w-full mt-10 flex flex-col gap-2">
        <div className="flex justify-between items-center">
          <span className="text-[16px]">Date:</span>
          <span>{transactionItem?.date ?? ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px]">Transaction Type:</span>
          <span>{capitalize(transactionItem?.type) ?? ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px]">Session Id:</span>
          <span>{capitalize(transactionItem?.sessionId) ?? ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px]">Reciepient:</span>
          <span>{capitalize(transactionItem?.reciepient) ?? ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px]">Reciepient Status:</span>
          <span>{capitalize(transactionItem?.reciepientAccountStatus) ?? ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px]">Reciepient Bank:</span>
          <span>{capitalize(transactionItem?.reciepientBank) ?? ''}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[16px]">Amount:</span>
          <span>{capitalize(transactionItem?.amount) ?? ''}</span>
        </div>
      </div>
    </Modal>
  );
};

export default TransactionModal;
