'use client';
import { Select, Space } from 'antd';
import { Wallet as WalletIcon } from '@grc/_shared/assets/svgs';
import TransactionsTable from './libs/transactions-table';
import { GrTransaction } from 'react-icons/gr';
import { FaRegCalendarAlt, FaSearch } from 'react-icons/fa';

const Transactions = () => {
  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex w-full justify-between items-center font-semibold">
        <div className="flex flex-col gap-2">
          <Space size={5}>
            <WalletIcon />
            <span>Giro Balance :</span>
          </Space>
          <div className="text-4xl font-bold">&#x20A6;2,500,000.00</div>
          <div className="font-thin">Total Balance from all accounts</div>
        </div>
        <div className="flex flex-col">
          <Select
            size="large"
            className="w-[400px] font-normal virtual-account-select"
            placeholder="Select a virtual account"
          />
        </div>
      </div>
      <div className="w-full">
        <div className="w-full flex justify-between px-3 items-center">
          <div className="flex items-center">
            <Space className="text-[13px] font-bold cursor-pointer" size={5}>
              <GrTransaction size={10} />
              Make a Payment
            </Space>
          </div>
          <div className="flex items-center gap-5">
            <Space className="text-[13px] font-bold cursor-pointer" size={2}>
              <FaSearch size={12} />
              Search
            </Space>
            <Space className="text-[13px] font-bold cursor-pointer" size={2}>
              <FaRegCalendarAlt size={15} />
              12th Jan, 24
            </Space>
          </div>
        </div>
        <TransactionsTable />
      </div>
    </div>
  );
};

export default Transactions;
