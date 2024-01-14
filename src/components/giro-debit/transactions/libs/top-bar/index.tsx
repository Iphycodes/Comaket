'use client';
import { Space } from 'antd';
import { GrTransaction } from 'react-icons/gr';
import { FaRegCalendarAlt, FaSearch } from 'react-icons/fa';

const TopBar = () => {
  return (
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
  );
};

export default TopBar;
