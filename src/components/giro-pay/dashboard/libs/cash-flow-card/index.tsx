'use client';
import { formatNumber, numberFormat } from '@grc/_shared/helpers';
import React from 'react';
import { ArrowLeftDownIcon, ArrowRightUpIcon, CoinIcon } from '@grc/_shared/assets/svgs';
import { capitalize, startCase } from 'lodash';

type CashFlowCardProps = {
  type: string;
  amount: number;
  count?: number;
};

export const CashFlowCard = ({ type, amount, count }: CashFlowCardProps) => {
  const handleCardIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'income':
        return <ArrowLeftDownIcon />;

      case 'disbursements':
        return <ArrowRightUpIcon />;

      default:
        return <CoinIcon />;
    }
  };
  return (
    <div className="dark:bg-zinc-800 flex flex-col border dark:border-gray-500 shadow-md hover:border-cyan-100 text-card-foreground rounded-xl p-5">
      <div className="flex justify-between items-center py-1">
        <h3 className="font-medium text-sm tracking-tight">{startCase(capitalize(type))}</h3>
        <span>{handleCardIcon(type)}</span>
      </div>
      <div className="font-bold text-2xl text-black dark:text-white">
        {numberFormat(amount / 100, '₦ ')}
      </div>
      <div className="text-sm text-muted-foreground py-2">
        {['income', 'disbursements'].includes(type) ? (
          <span>
            <span className="text-black dark:text-white font-semibold">
              {formatNumber(count ?? 0, 1)}
            </span>{' '}
            Transactions
          </span>
        ) : (
          <span>
            <span className="text-black dark:text-white font-semibold">{count} </span>Transactions
          </span>
        )}
      </div>
    </div>
  );
};
