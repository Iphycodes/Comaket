import { Drawer, Form, Input, DatePicker, Select, Button } from 'antd';
import dayjs from 'dayjs';
import { identity, omit, pickBy } from 'lodash';
import { Dispatch, SetStateAction } from 'react';
import { useForm } from 'antd/lib/form/Form';

const { RangePicker } = DatePicker;

interface FilterDrawerProps {
  open: boolean;
  onClose: () => void;
  setAdvancedFilter: Dispatch<SetStateAction<{ filterData: Record<string, any> }>> | any;
  advancedFilter: { filterData: Record<string, any> };
}

const FilterDrawer = (props: FilterDrawerProps) => {
  const { open, onClose, setAdvancedFilter } = props;
  const format = 'YYYY-MM-DD';

  const [form] = useForm();

  const handleSubmitFilter = (values: Record<string, any>) => {
    const startDate = dayjs(values?.date?.[0])
      .startOf('day')
      .format(format);
    const endDate = dayjs(values?.date?.[1])
      .endOf('day')
      .format(format);

    const filterWithDate = {
      ...omit(values, ['date']),
      ...values,
      date: values?.date ? JSON.stringify({ startDate, endDate }) : undefined,
    };
    const filterData = pickBy(filterWithDate, identity);
    setAdvancedFilter({ filterData: filterData });
    onClose();
  };

  const statusOptions = [
    {
      label: 'failed',
      value: 'failed',
    },
    {
      label: 'successful',
      value: 'successful',
    },
  ];

  // const currencyOptions = [
  //   {
  //     label: 'NGN',
  //     value: 'NGN',
  //   },
  //   {
  //     label: 'USD',
  //     value: 'USD',
  //   },
  // ];

  const entryOptions = [
    {
      label: 'credit',
      value: 'credit',
    },
    {
      label: 'debit',
      value: 'debit',
    },
  ];

  return (
    <Drawer closeIcon={false} className="filter-drawer p-0" onClose={onClose} open={open}>
      <>
        <div className="w-full sticky top-0 z-10 bg-blue text-white flex p-5 justify-between items-center gap-3">
          <span className="text-lg">Filter Transaction Log</span>
          <span onClick={onClose}>
            <i className="ri-close-fill cursor-pointer text-[22px]"></i>
          </span>
        </div>
        <div className="w-full p-5 flex flex-col gap-3">
          <Form
            form={form}
            name="filter-form"
            initialValues={{ remember: false }}
            onFinish={(values) => handleSubmitFilter(values)}
            autoComplete="off"
            className="w-full"
          >
            <span className="font-semibold text-muted-foreground">Date Range:</span>
            <Form.Item className="w-full" name="date" rules={[{ required: false }]}>
              <RangePicker size="large" className="w-full rounded-lg" />
            </Form.Item>

            <span className="font-semibold text-muted-foreground">Reference:</span>
            <Form.Item className="w-full" name="reference">
              <Input size="large" className="w-full rounded-lg" />
            </Form.Item>

            {/* <span className="font-semibold text-muted-foreground">{'Minimum Amount \u20A6:'}</span>
            <Form.Item className="w-full" name="min-amount" rules={[{ required: false }]}>
              <Input size="large" className="w-80 rounded-lg" />
            </Form.Item>

            <span className="font-semibold text-muted-foreground">{'Maximum Amount \u20A6:'}</span>
            <Form.Item className="w-full" name="max-amount" rules={[{ required: false }]}>
              <Input size="large" className="w-80 rounded-lg" />
            </Form.Item> */}

            <span className="font-semibold text-muted-foreground">Status:</span>
            <Form.Item className="w-full" name="status" rules={[{ required: false }]}>
              <Select
                mode="multiple"
                size="large"
                className="w-full rounded-lg"
                options={statusOptions}
              />
            </Form.Item>

            {/* <span className="font-semibold text-muted-foreground">Currency:</span>
            <Form.Item className="w-full" name="currency" rules={[{ required: false }]}>
              <Select
                mode="multiple"
                size="large"
                className="w-full rounded-lg"
                options={currencyOptions}
              />
            </Form.Item> */}

            <span className="font-semibold text-muted-foreground">Entry Mode:</span>
            <Form.Item className="w-full" name="entry" rules={[{ required: false }]}>
              <Select size="large" className="w-full rounded-lg" options={entryOptions} />
            </Form.Item>

            <span className="font-semibold text-muted-foreground">Reciepient Account</span>
            <Form.Item
              className="w-full"
              name="beneficiary.accountNumber"
              rules={[{ required: false, pattern: /^\d{10,}$/, message: 'Input account number' }]}
            >
              <Input size="large" className="w-full rounded-lg" />
            </Form.Item>

            <span className="font-semibold text-muted-foreground">Reciepient Bank</span>
            <Form.Item className="w-full" name="beneficiary.bankName" rules={[{ required: false }]}>
              <Input size="large" className="w-full rounded-lg" />
            </Form.Item>

            <span className="font-semibold text-muted-foreground">Name</span>
            <Form.Item className="w-full" name="beneficiary" rules={[{ required: false }]}>
              <Input size="large" className="w-full rounded-lg" />
            </Form.Item>
            <Button
              className="opacity-100 w-full hover:opacity-70 mt-3 bg-blue text-white h-12 rounded-lg font-bold px-8"
              type="primary"
              disabled={false}
              block={true}
              loading={false}
              htmlType="submit"
            >
              <span>Search</span>
              <i className="ri-search-line ml-2"></i>
            </Button>
            <Button
              className="opacity-100 hover:opacity-70 mt-3 bg-red-400 text-white h-12 rounded-lg font-bold px-8"
              type="primary"
              disabled={false}
              block={true}
              loading={false}
              onClick={() => {
                form.resetFields();
                setAdvancedFilter({});
              }}
            >
              <span>Clear Fields</span>
              <i className="ri-format-clear ml-2"></i>
            </Button>
          </Form>
        </div>
      </>
    </Drawer>
  );
};

export default FilterDrawer;
