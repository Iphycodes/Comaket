import { convertCamelCaseToSentence, getDate, numberFormat, truncate } from '@grc/_shared/helpers';
import { Drawer, message } from 'antd';
import { capitalize, pick } from 'lodash';
import React, { Dispatch, Fragment, SetStateAction } from 'react';

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
    setOpen(false);
  };

  const onreferenceCopy = () => {
    message.success('Reference copied', 5);
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
      <div className="w-full p-5 mb-14 flex flex-col gap-3">
        {Object.entries(selectedRecord).map(([key, value], index) => {
          if (typeof value === 'object') {
            return (
              <Fragment key={`${key}-${value}-${index}`}>
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
                        <Fragment key={`${ky}-${val}-${index}`}>
                          <div className="mt-1">
                            <span className="text-[16px]">{capitalize(ky)}</span>
                          </div>
                          <div className="flex flex-col gap-2">
                            {Object.entries(value).map(([ky3, val3], index) => {
                              return (
                                <div
                                  key={`${ky3}-${val3}-${index}`}
                                  className="flex justify-between gap-5 items-center"
                                >
                                  <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                                    <span>
                                      <i className="ri-circle-fill text-[8px]"></i>
                                    </span>
                                    <span className="text-[16px]">
                                      {convertCamelCaseToSentence(ky3)}
                                    </span>
                                  </div>
                                  <>
                                    {ky3 === 'date' || ky3 === 'createdAt' ? (
                                      <span className="font-semibold">{getDate(`${value}`)}</span>
                                    ) : (
                                      <span className="font-semibold">
                                        {convertCamelCaseToSentence(`${val3}`)}
                                      </span>
                                    )}
                                  </>
                                </div>
                              );
                            })}
                          </div>
                        </Fragment>
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
                          {ky === 'date' || ky === 'createdAt' ? (
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
              </Fragment>
            );
          } else if (Array.isArray(value)) {
          } else {
            return (
              <div key={key} className="flex justify-between gap-5 items-center">
                <div className="flex items-center gap-1 text-gray-500 dark:text-gray-400">
                  <span>
                    <i className="ri-circle-fill text-[8px]"></i>
                  </span>
                  <span className="text-[16px]">
                    {key == 'createdAt' ? 'Date' : convertCamelCaseToSentence(key)}
                  </span>
                </div>
                <div className="flex text-right justify-end">
                  {key === 'date' || key === 'createdAt' ? (
                    <span className="font-semibold">{getDate(`${value}`)}</span>
                  ) : (
                    <>
                      {key === 'amount' || key === 'fee' ? (
                        <span className="font-semibold text-right">
                          {numberFormat(value / 100, '₦ ')}
                        </span>
                      ) : (
                        <>
                          {key === 'reference' || key === 'narration' ? (
                            <div>
                              {truncate(`${value}`, 15)}{' '}
                              <span>
                                <i
                                  className="ri-file-copy-line mb-1 text-[18px] hover:text-blue cursor-pointer"
                                  onClick={() =>
                                    navigator.clipboard.writeText(value).then(onreferenceCopy)
                                  }
                                ></i>
                              </span>
                            </div>
                          ) : (
                            <span className="font-semibold text-right">
                              {convertCamelCaseToSentence(`${value}`)}
                            </span>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          }
        })}
      </div>
    </Drawer>
  );
};

export default DisbursementDrawer;
