'use client';

import { Drawer } from 'antd';
import { TransactionsDataType } from '../transactions-table/libs/transactions-data';

interface AdvancedTransactionProps {
  open: boolean;
  onClose: () => void;
  selectedRecord: TransactionsDataType;
}

const AdvancedTransactionDrawer = ({ open, onClose, selectedRecord }: AdvancedTransactionProps) => {
  return (
    <Drawer
      closeIcon={false}
      className="advanced-transaction-drawer p-0"
      onClose={onClose}
      open={open}
    >
      <div className="w-full sticky top-0 z-10 bg-blue text-white flex p-5 justify-between items-center gap-3">
        <span className="text-lg">Transaction Details</span>
        <span onClick={onClose}>
          <i className="ri-close-fill cursor-pointer text-[22px]"></i>
        </span>
      </div>
      <div className="w-full p-5 flex flex-col gap-3">
        {Object.entries(selectedRecord).map(([key, value]) => {
          return (
            <div key={key} className="flex justify-between items-center">
              <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                <span>
                  {(() => {
                    switch (key) {
                      case 'type':
                        return <i className="ri-exchange-funds-line text-[20px]"></i>;
                      case 'reciepient':
                        return <i className="ri-user-line text-[20px]"></i>;
                      case 'sessionId':
                        return <i className="ri-timeline-view text-[20px]"></i>;
                      case 'date':
                        return <i className="ri-calendar-schedule-line text-[20px]"></i>;
                      case 'key':
                        return <i className="ri-key-2-fill text-[20px]"></i>;
                      case 'reciepientBank':
                        return <i className="ri-bank-line text-[20px]"></i>;
                      case 'reciepientAccountStatus':
                        return <i className="ri-bard-line text-[20px]"></i>;
                      case 'amount':
                        return <i className="ri-wallet-2-line text-[20px]"></i>;
                      case 'time':
                        return <i className="ri-time-line text-[20px]"></i>;
                      default:
                        return <i className="ri-rest-time-line text-[20px]"></i>;
                    }
                  })()}
                </span>
                <span className="text-[16px]">{key}</span>
              </div>
              <span className="font-semibold">{value}</span>
            </div>
          );
        })}
      </div>
    </Drawer>
  );
};

export default AdvancedTransactionDrawer;
