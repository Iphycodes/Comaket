'use client';

import { Button, Drawer } from 'antd';
import { capitalize, pick } from 'lodash';
import { TransactionReceipt } from '@grc/_shared/components/transaction-receipt';
import { omit } from 'lodash';
import { getDate } from '@grc/_shared/helpers';

interface AdvancedTransactionProps {
  open: boolean;
  onClose: () => void;
  selectedRecord: Record<string, any>;
}

const AdvancedTransactionDrawer = ({ open, onClose, selectedRecord }: AdvancedTransactionProps) => {
  function convertCamelCaseToSentence(camelCaseText: string) {
    const sentence = camelCaseText.replace(/([a-z])([A-Z])/g, '$1 $2');

    return sentence.charAt(0).toUpperCase() + sentence.slice(1);
  }

  return (
    <Drawer
      closeIcon={false}
      className="advanced-transaction-drawer p-0 min-h-screen relative"
      onClose={onClose}
      open={open}
      width={500}
    >
      <div className="w-full sticky top-0 z-10 bg-blue text-white flex p-5 justify-between items-center gap-3">
        <span className="text-lg">Transaction Details</span>
        <span onClick={onClose}>
          <i className="ri-close-fill cursor-pointer text-[22px]"></i>
        </span>
      </div>
      <div className="w-full p-5 mb-14 flex flex-col gap-3">
        {Object.entries(selectedRecord).map(([key, value]) => {
          if (typeof value === 'object') {
            return (
              <>
                <div className="mt-4">
                  <span className="text-[18px]">{capitalize(key).toUpperCase()}</span>
                </div>
                <hr />
                <div className="flex flex-col gap-2">
                  {Object.entries(
                    key === 'beneficiary'
                      ? pick(value, ['accountNumber', 'accountName', 'bankName'])
                      : key === 'source'
                        ? pick(value, ['accountNumber', 'accountName', 'bankName'])
                        : {}
                  ).map(([ky, val]) => {
                    if (typeof val === 'object') {
                      return (
                        <>
                          <div className="mt-1">
                            <span className="text-[16px]">{capitalize(ky)}</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            {Object.entries(value).map(([ky3, val3]) => {
                              return (
                                <div key={ky3} className="flex justify-between gap-5 items-center">
                                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <span>
                                      <i className="ri-circle-fill text-[8px]"></i>
                                    </span>
                                    <span className="text-[16px]">
                                      {convertCamelCaseToSentence(ky3)}
                                    </span>
                                  </div>
                                  <span className="font-semibold">
                                    {convertCamelCaseToSentence(`${val3}`)}
                                  </span>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      );
                    } else {
                      return (
                        <div key={ky} className="flex justify-between gap-5 items-center">
                          <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                            <span>
                              <i className="ri-circle-fill text-[8px]"></i>
                            </span>
                            <span className="text-[16px]">{convertCamelCaseToSentence(ky)}</span>
                          </div>
                          {ky === 'date' ? (
                            <span className="font-semibold">{getDate(`${val}`)}</span>
                          ) : (
                            <span className="font-semibold">
                              {convertCamelCaseToSentence(`${val}`)}
                            </span>
                          )}
                        </div>
                      );
                    }
                  })}
                </div>
              </>
            );
          } else if (Array.isArray(value)) {
          } else {
            return (
              <div key={key} className="flex justify-between gap-5 items-center">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span>
                    <i className="ri-circle-fill text-[8px]"></i>
                  </span>
                  <span className="text-[16px]">{convertCamelCaseToSentence(key)}</span>
                </div>
                <div className="flex text-right justify-end">
                  {key === 'date' ? (
                    <span className="font-semibold">{getDate(`${value}`)}</span>
                  ) : (
                    <span className="font-semibold text-right">
                      {convertCamelCaseToSentence(`${value}`)}
                    </span>
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>
      <div className="w-full absolute bottom-0 px-3">
        <Button
          className="opacity-100 flex w-full items-center justify-center bg-blue hover:opacity-95 font-semibold mt-2 text-white h-14"
          type="primary"
          disabled={false}
          loading={false}
          onClick={() =>
            TransactionReceipt({
              successData: {
                ...omit(selectedRecord, ['source', 'beneficiary']),
                accountName:
                  selectedRecord?.entry === 'debit'
                    ? selectedRecord?.beneficiary?.accountName
                    : selectedRecord?.source?.accountName,
                accountNumber:
                  selectedRecord?.entry === 'debit'
                    ? selectedRecord?.beneficiary?.accountNumber
                    : selectedRecord?.source?.accountNumber,
                bankName:
                  selectedRecord?.entry === 'debit'
                    ? selectedRecord?.beneficiary?.bankName
                    : selectedRecord?.source?.bankName,
                entry: selectedRecord?.entry,
              },
              // setLoading,
            })
          }
        >
          <div className="flex items-center mx-auto gap-2 justify-center">
            <i className="ri-download-line text-[18px]"></i>
            <span>Download Reciept</span>
          </div>
        </Button>
      </div>
    </Drawer>
  );
};

export default AdvancedTransactionDrawer;
