import { Button } from 'antd';

const TableFooter = () => {
  return (
    <div className="footer flex justify-end items-center">
      <Button
        className="opacity-100 bg-blue hover:opacity-95 font-semibold text-white h-10"
        type="primary"
        disabled={false}
        loading={false}
        htmlType="submit"
        style={{ padding: '20px' }}
      >
        <div className="flex items-center gap-2 justify-center">
          <i className="ri-upload-2-line"></i>
          <span>Export</span>
        </div>
      </Button>
    </div>
  );
};

export default TableFooter;
