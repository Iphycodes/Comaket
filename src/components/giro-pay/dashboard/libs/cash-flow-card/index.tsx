'use client';
import { formatNumber, numberFormat } from '@grc/_shared/helpers';
import React from 'react';
import { ArrowLeftDownIcon, ArrowRightUpIcon } from '@grc/_shared/assets/svgs';
import { capitalize, startCase } from 'lodash';

type CashFlowCardProps = {
  type: string;
  amount: number;
  count: number;
};

export const CashFlowCard = ({ type, amount, count }: CashFlowCardProps) => {
  return (
    <div className="flex flex-col border shadow-sm hover:shadow-md  shadow-gray-100 rounded-xl p-5">
      <div className="flex justify-between items-center py-1">
        <span className="font-medium text-gray-500">{startCase(capitalize(type))}</span>
        <span>
          {type.toLowerCase() === 'income' ? <ArrowLeftDownIcon /> : <ArrowRightUpIcon />}
        </span>
      </div>
      <div className="font-semibold text-xl text-black">{numberFormat(amount / 100, '₦ ')}</div>
      <div className="font-semibold text-sm text-black py-2">
        {formatNumber(count, 1)} Transactions
      </div>
    </div>
  );
};
