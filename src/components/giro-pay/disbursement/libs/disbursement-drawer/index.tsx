import { Drawer } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

interface DisbursementDrawerProps {
  selectedRecord: Record<string, any>;
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}

const DisbursementDrawer: React.FC<DisbursementDrawerProps> = ({
  selectedRecord,
  open,
  setOpen,
}: DisbursementDrawerProps) => {
  const onClose = () => {
    console.log('');
    setOpen(false);
  };

  return (
    <Drawer
      closeIcon={false}
      className="advanced-transaction-drawer p-0"
      onClose={onClose}
      open={open}
    >
      <div className="w-full sticky top-0 z-10 bg-blue text-white flex p-5 justify-between items-center gap-3">
        <span className="text-lg">Disbursement Details</span>
        <span onClick={onClose}>
          <i className="ri-close-fill cursor-pointer text-[22px]"></i>
        </span>
      </div>
      <div className="w-full p-5 flex flex-col gap-3">
        {Object.entries(selectedRecord).map(([key, value]) => {
          // typeof value === 'object' ?
          if (Array.isArray(value)) {
            return (
              <div key={key} className="flex flex-col gap-2 w-full">
                <div className="">
                  <div className="flex items-center gap-1 text-gray-500">
                    <i className="ri-group-line text-[20px]"></i>
                    <span>{key}</span>
                  </div>
                </div>
                <div className="flex flex-col w-full gap-2">
                  {value.map((item, idx) => {
                    if (typeof item === 'object') {
                      return (
                        <div key={key} className="border-b-2 py-3">
                          {Object.entries(item).map(([key, value]) => {
                            return (
                              <div key={idx} className="flex justify-between items-center">
                                <span>{key}</span>
                                <span className="font-semibold">{`${value}`}</span>
                              </div>
                            );
                          })}
                        </div>
                      );
                    }
                    // If item is not an object, you may want to handle it differently or skip it
                  })}
                </div>
              </div>
            );
          }
          if (Array.isArray(value) === false) {
            return (
              <div key={key} className="flex justify-between items-center">
                <div className="flex items-center gap-1 text-gray-500">
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
                <span className="font-semibold">{`${value}`}</span>
              </div>
            );
          }
        })}
      </div>
    </Drawer>
  );
};

export default DisbursementDrawer;
