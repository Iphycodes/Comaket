import { WalletNamespace } from '@grc/_shared/namespace/wallet';
import { Col, Row, Space, message } from 'antd';
import { upperCase } from 'lodash';
import { useTheme } from 'next-themes';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface TopUpBalanceProps {
  wallet: WalletNamespace.Wallet | null;
}

const TopUpBalance = ({ wallet }: TopUpBalanceProps) => {
  const [textInput, setTextInput] = useState('');
  const { theme } = useTheme();

  useEffect(() => {
    if (wallet?.accountNumber) setTextInput(wallet?.accountNumber);
  }, [wallet?.accountNumber]);

  const onCopy: () => void = () =>
    textInput && message.success({ content: 'Account Number Copied' });

  // const onCopyAll: () => void = () =>
  //   acctDetails && message.success({ content: 'Account Details Copied' });

  return (
    <div className="flex flex-col justify-start">
      <div className="flex items-center border-b-2 pb-3">
        <Space size={5}>
          <span
            className="text-[16px] flex justify-center items-center h-12 w-12 bg-blue"
            style={{ borderRadius: '50%' }}
          >
            <i className="ri-corner-right-up-line text-[28px] text-white"></i>{' '}
          </span>
          <span className="font-bold text-[20px]">Top Up Balance</span>
        </Space>
      </div>
      <div className="py-4 text-muted-foreground font-semibold">
        Transfer Funds to the account below to Top Up your Balance. Please use the Reference Id for
        transaction remark.
      </div>
      <div className="flex flex-col gap-2 py-3 border-y-2">
        <Row className="flex items-center">
          <Col span={8}>
            <span className="text-muted-foreground font-semibold">Account Number: </span>
          </Col>
          <Col className="flex gap-1 items-start" span={16}>
            <span className=" text-lg font-semibold">{wallet?.accountNumber}</span>
            <i
              className="ri-file-copy-line mb-1 text-[20px] hover:text-blue cursor-pointer"
              onClick={() => navigator.clipboard.writeText(textInput).then(onCopy)}
            ></i>
          </Col>
        </Row>
        <Row className="flex items-center">
          <Col span={8}>
            <span className=" text-muted-foreground font-semibold">Bank: </span>
          </Col>
          <Col span={16}>
            <span className="text-base font-semibold">{wallet?.bankName?.toUpperCase()}</span>
          </Col>
        </Row>
        <Row className="flex items-center">
          <Col span={8}>
            <span className=" text-muted-foreground font-semibold">Account Name: </span>
          </Col>
          <Col span={16}>
            <span className="text-base font-semibold">{upperCase(wallet?.accountName)}</span>
          </Col>
        </Row>
        {/* <Row className="flex items-center">
          <Col span={8}>
            <span className=" text-muted-foreground font-semibold">Reference ID: </span>
          </Col>
          <Col span={16} className="">
            <Space size={4}>
              <span className="text-lg font-semibold">43kgn3ro938jrhew3ju2i432l</span>
              <i className="ri-file-copy-line mb-1 text-[14px]"></i>
            </Space>
          </Col>
        </Row> */}
        {/* <span className="text-[12px]" style={{ bottom: '-15px' }}>
          <i className="ri-information-2-line"></i> Please use this reference id for your
          transaction remark
        </span> */}
      </div>
      <div className="flex items-center py-3 justify-end">
        <Image
          src={`/assets/svgs/${theme === 'light' ? 'giro-logo' : 'giro-logo-white'}.svg`}
          alt="debit-logo"
          width={80}
          height={40}
          style={{}}
        />
      </div>
    </div>
  );
};

export default TopUpBalance;
