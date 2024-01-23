import { Drawer, Form, Input, DatePicker, Select, Button } from 'antd';

const { RangePicker } = DatePicker;

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
}

const onFinish = (values: any) => {
  console.log(values);
};

const FilterDrawer = ({ open, onClose }: FilterDrawerProps) => {
  return (
    <Drawer closeIcon={false} className="filter-drawer p-0" onClose={onClose} open={open}>
      <div className="w-full sticky top-0 z-10 bg-blue text-white flex p-5 justify-between items-center gap-3">
        <span className="text-lg">Filter Transaction Log</span>
        <span onClick={onClose}>
          <i className="ri-close-fill cursor-pointer text-[22px]"></i>
        </span>
      </div>
      <div className="w-full p-5 flex flex-col gap-3">
        <Form
          name="filter-form"
          initialValues={{ remember: false }}
          onFinish={onFinish}
          autoComplete="off"
          className="w-full"
        >
          <Form.Item className="w-full" name="date" rules={[{ required: false }]}>
            <span className="font-semibold text-muted-foreground">Date Range:</span>
            <RangePicker size="large" className="w-80 rounded-lg" />
          </Form.Item>
          <Form.Item className="w-full" name="sessionId" rules={[{ required: false }]}>
            <span className="font-semibold text-muted-foreground">Session Id:</span>
            <Input size="large" className="w-80 rounded-lg" />
          </Form.Item>
          <Form.Item className="w-full" name="min-amount" rules={[{ required: false }]}>
            <span className="font-semibold text-muted-foreground">{'Minimum Amount \u20A6:'}</span>
            <Input size="large" className="w-80 rounded-lg" />
          </Form.Item>
          <Form.Item className="w-full" name="max-amount" rules={[{ required: false }]}>
            <span className="font-semibold text-muted-foreground">{'Maximum Amount \u20A6:'}</span>
            <Input size="large" className="w-80 rounded-lg" />
          </Form.Item>
          <Form.Item className="w-full" name="type" rules={[{ required: false }]}>
            <span className="font-semibold text-muted-foreground">Type:</span>
            <Select size="large" className="w-80 rounded-lg" />
          </Form.Item>
          <Form.Item className="w-full" name="status" rules={[{ required: false }]}>
            <span className="font-semibold text-muted-foreground">Status:</span>
            <Select size="large" className="w-80 rounded-lg" />
          </Form.Item>
          <Form.Item className="w-full" name="reciepientAccount" rules={[{ required: false }]}>
            <span className="font-semibold text-muted-foreground">Reciepient Account</span>
            <Input size="large" className="w-80 rounded-lg" />
          </Form.Item>
          <Form.Item className="w-full" name="reciepientBank" rules={[{ required: false }]}>
            <span className="font-semibold text-muted-foreground">Reciepient Bank</span>
            <Input size="large" className="w-80 rounded-lg" />
          </Form.Item>
          <Form.Item className="w-full" name="name" rules={[{ required: false }]}>
            <span className="font-semibold text-muted-foreground">Name</span>
            <Input size="large" className="w-80 rounded-lg" />
          </Form.Item>
          <Button
            className="opacity-100 hover:opacity-70 mt-3 bg-blue text-white h-12 rounded-lg font-bold px-8"
            type="primary"
            disabled={false}
            block={true}
            loading={false}
            htmlType="submit"
          >
            <span>Search</span>
            <i className="ri-search-line ml-2"></i>
          </Button>
        </Form>
      </div>
    </Drawer>
  );
};

export default FilterDrawer;
