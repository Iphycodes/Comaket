import React, { memo, useEffect, useState } from 'react';
import { Button, Card, message } from 'antd';
import { CopyIcon } from '@grc/_shared/assets/svgs';
import isEmpty from 'lodash/isEmpty';

const AcctDetails = ({
  account,
  // theme,
}: {
  // account: VirtualAccountNamespace.Account | null;
  account: Record<string, any> | null;
  theme?: string;
}) => {
  const [textInput, setTextInput] = useState('');

  useEffect(() => {
    if (account?.accountNumber) setTextInput(account?.accountNumber);
  }, [account?.accountNumber]);

  const onCopy: () => void = () =>
    textInput && message.success({ content: 'Account Number Copied' });

  const acctDetails = `Account Number: ${account?.accountNumber} \nAccount Name: ${account?.accountName} \nBank Name: ${account?.bankName}`;

  const onCopyAll: () => void = () =>
    acctDetails && message.success({ content: 'Account Details Copied' });

  return (
    <Card className="h-full text-center py-[20px] rounded-lg">
      <div>
        <div className="font-semibold text-xl">
          Top Up{' '}
          {!isEmpty(account) ? (
            <span className="text-2xl font-bold">{account?.accountName}</span>
          ) : (
            'Balance'
          )}
        </div>
        {!isEmpty(account) ? (
          <>
            <div className="text-center font-normal text-sm w-[70%] mx-auto my-[10px]">
              To add funds to your virtual account balance, transfer into the account details below:
            </div>
            <>
              <div className="bg-[#eaf5ff] w-[80%] relative mt-12 mb-5 ml-auto mr-auto text-lg font-normal py-3 px-8 rounded-2xl shadow-[0_6px_12px_#00000022] border-[0.5px] border-[#d9d9d9]">
                {textInput}
                <CopyIcon
                  className="absolute fill-[#111] cursor-pointer scale-75 right-5 top-3"
                  onClick={() => navigator.clipboard.writeText(textInput).then(onCopy)}
                />
              </div>
              <div className="text-base font-semibold">{account.accountName}</div>
              <div className="w-[80%] text-base mx-auto my-2">{account.bankName}</div>
            </>

            <Button
              type={'primary'}
              className="opacity-100 hover:opacity-70 mt-8 bg-blue text-white h-12 rounded-lg font-bold px-8"
              disabled={isEmpty(account)}
              onClick={() => navigator.clipboard.writeText(acctDetails).then(onCopyAll)}
            >
              Copy Account Details
            </Button>
          </>
        ) : (
          <div className="flex flex-col">
            <div className="p-2.5 mb-0">No Available Account.</div>
            <div className="">Create a virtual account first.</div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default memo(AcctDetails);
