'use client';
import React, { Dispatch, SetStateAction } from 'react';
import { Avatar, Col, Row, Space } from 'antd';
import { VirtualAccountNamespace } from '@grc/_shared/namespace/wallet';
import { getFirstCharacter, getRandomColorByString, numberFormat } from '@grc/_shared/helpers';
import { capitalize, startCase } from 'lodash';

type VirtualAccountProps = {
  virtualAccount: Partial<VirtualAccountNamespace.Account>;
  active: boolean;
  setActiveVAccount: Dispatch<SetStateAction<any>>;
};

export const VirtualAccount = ({
  virtualAccount,
  active = false,
  setActiveVAccount,
}: VirtualAccountProps) => {
  const { accountName, amount, accountNumber, id } = virtualAccount;
  return (
    <div
      onClick={() => setActiveVAccount(id)}
      className={`w-full flex flex-col items-center justify-center border-b ${
        active ? 'border border-green-500' : ''
      } p-1 rounded-xl cursor-pointer hover:opacity-60`}
    >
      <Row gutter={[16, 16]} className="w-full">
        <Col md={12} xs={12}>
          <Space size="middle">
            <div>
              {' '}
              <Avatar
                style={{
                  backgroundColor: getRandomColorByString(accountName!),
                  verticalAlign: 'middle',
                }}
                size="large"
              >
                {getFirstCharacter(accountName!)}
              </Avatar>
            </div>
            <div>
              <div className="flex flex-col items-center justify-center">
                <span className="w-full text-left">{accountNumber}</span>
                <div className="w-full py-1 text-sm font-semibold text-left">
                  {startCase(capitalize(accountName))}
                </div>
              </div>
              <span className="w-full text-left font-medium text-gray-500">Account Name</span>
            </div>
          </Space>
        </Col>
        <Col md={12} xs={12}>
          <div className="flex flex-col lg:items-end justify-between h-full md:items-end sm: items-end">
            <span></span>
            <span className="w-full lg:text-right md:text-right font-semibold py-1">
              {numberFormat(amount! / 100, '₦ ')}
            </span>
            <span className="w-full lg:text-right md:text-right font-medium text-gray-500">
              Account Balance
            </span>
          </div>
        </Col>
      </Row>
    </div>
  );
};
