'use client';

import { Button } from 'antd';

const TableFooter = () => {
  return (
    <div className="footer flex justify-end items-center">
      <Button
        className="opacity-100 bg-blue hover:opacity-95 font-semibold mt-3 text-white h-10"
        type="primary"
        disabled={false}
        loading={false}
        htmlType="submit"
      >
        <div className="flex items-center gap-2 justify-center">
          {/* <DownloadOutlined className="text-[18px]" /> */}
          <span>Download Reciept</span>
        </div>
      </Button>
    </div>
  );
};

export default TableFooter;
