import { Button } from 'antd';

interface TableFooterProps {
  // filter: {filterData: Record<string, any>}
  handleSendMail: () => void;
}

const TableFooter = ({ handleSendMail }: TableFooterProps) => {
  return (
    <div className="footer flex justify-end gap-5 items-center">
      <Button
        className="opacity-100 bg-blue hover:opacity-95 font-semibold h-10 px-6 text-white"
        type="primary"
        disabled={false}
        loading={false}
        onClick={() => handleSendMail()}
      >
        <div className="flex items-center gap-2 justify-center">
          <i className="ri-upload-2-line"></i>
          <span>Export to Email</span>
        </div>
      </Button>
    </div>
  );
};

export default TableFooter;
