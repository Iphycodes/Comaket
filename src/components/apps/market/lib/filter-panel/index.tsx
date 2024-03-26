import { Popover, Select, Space } from 'antd';
import React, { useCallback, useState } from 'react';
import { Checkbox } from 'antd';
import type { CheckboxValueType } from 'antd/lib/checkbox/Group';
import { CheckboxChangeEvent } from 'antd/lib/checkbox';

const CheckboxGroup = Checkbox.Group;
const plainOptions = ['New', 'Used', 'Foreign Used'];
const defaultCheckedList: CheckboxValueType[] = ['New', 'Used', 'Foreign Used'];

interface FilterPanelProps {
  // Add your prop types here
}

const FilterPanel: React.FC<FilterPanelProps> = ({}) => {
  const [isLocationContentOpen, setIsLocationContentOpen] = useState<boolean>(false);
  const [isFilterContentOpen, setIsFilterContentOpen] = useState<boolean>(false);
  const [checkedList, setCheckedList] = useState<CheckboxValueType[]>(defaultCheckedList);

  const getContent = useCallback(() => {
    const checkAll = plainOptions.length === checkedList.length;
    // const indeterminate = checkedList.length > 0 && checkedList.length < plainOptions.length;

    const onChange = (list: CheckboxValueType[]) => {
      setCheckedList(list);
      console.log('list::::::::::::::::::', list);
    };

    const onCheckAllChange = (e: CheckboxChangeEvent) => {
      setCheckedList(e.target.checked ? plainOptions : []);
    };

    const handleSubmitFilter = () => {
      setIsFilterContentOpen(false);
    };

    return (
      <div className="drop-down-content text-[16px]">
        <div className="cursor-pointer border-b rounded-sm px-3 py-2">
          <Space className="p-1" size={15}>
            <span className="font-semibold">Sort By:</span>
            <Select
              defaultValue="newest"
              style={{ width: 120 }}
              options={[
                { value: 'newest', label: 'Newest' },
                { value: 'oldest', label: 'Oldest' },
                { value: 'popluarity', label: 'Popularity' },
              ]}
            />
          </Space>
        </div>{' '}
        <div className="cursor-pointer border-b rounded-sm px-3 py-2">
          <Space className="p-1" size={15}>
            <span className="font-semibold">Condition:</span>
            <Space>
              <Checkbox onChange={onCheckAllChange} checked={checkAll}>
                All
              </Checkbox>
              <CheckboxGroup options={plainOptions} onChange={onChange} value={checkedList} />
            </Space>
          </Space>
        </div>{' '}
        <div className="cursor-pointer border-b rounded-sm px-3 py-2">
          <Space className="p-1" size={15}>
            <span className="font-semibold">Price Range:</span>
            <Space size={10}></Space>
          </Space>
        </div>{' '}
        <div className="cursor-pointer flex justify-end rounded-sm px-3 py-2">
          <span
            onClick={handleSubmitFilter}
            className="font-semibold text-blue hover:underline text-[14px] cursor-pointer"
          >
            Apply
          </span>
        </div>{' '}
      </div>
    );
  }, []);

  const getLocationContent = useCallback(() => {
    const mockLocations = [
      { value: 'kaduna', label: 'Kaduna' },
      { value: 'lagos', label: 'Lagos' },
      { value: 'abuja', label: 'Abuja' },
      { value: 'kogi', label: 'Kogi' },
      { value: 'Portharcourt', label: 'Portharcourt' },
    ];

    const handleSetLocation = () => {
      setIsLocationContentOpen(false);
    };

    return (
      <div className="px-4 py-4 text-[16px]">
        <Space size={10} className="mb-4">
          <span className="font-semibold">Select Location:</span>
          <Select
            mode="multiple"
            size="large"
            allowClear
            style={{ width: '300px' }}
            placeholder="Please select"
            defaultValue={['Nigeria']}
            options={mockLocations}
          />
        </Space>
        <div className="flex justify-end">
          <span
            onClick={handleSetLocation}
            className="font-semibold text-blue hover:underline text-[14px] cursor-pointer"
          >
            Apply
          </span>
        </div>
      </div>
    );
  }, []);

  return (
    <div className="flex items-center w-full justify-between py-2 border-b">
      <Popover
        content={getLocationContent()}
        placement={'bottomLeft'}
        overlayClassName="dropdown-popover rounded-0"
        open={isLocationContentOpen}
        trigger={'click'}
        showArrow={false}
        overlayStyle={{ zIndex: 500, borderRadius: 0 }}
      >
        <section
          onClick={() => setIsLocationContentOpen(!isLocationContentOpen)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <span className="flex items-center w-8 h-8 justify-center border border-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-400 rounded-md cursor-pointer">
            <i className="ri-map-pin-2-line text-[20px] text-gray-700"></i>
          </span>
          <span>Kaduna State, Zaria ...</span>
        </section>
      </Popover>
      <section>
        <Popover
          content={getContent()}
          placement={'bottomRight'}
          overlayClassName="dropdown-popover rounded-0"
          open={isFilterContentOpen}
          trigger={'click'}
          showArrow={false}
          overlayStyle={{ zIndex: 500, borderRadius: 0 }}
        >
          <span
            onClick={() => setIsFilterContentOpen(!isFilterContentOpen)}
            className="flex gap-4 items-center justify-center border border-gray-300 hover:bg-gray-100 dark:hover:bg-zinc-400 rounded-md px-3 cursor-pointer"
          >
            <span>Filter</span>
            <i className="ri-equalizer-fill text-[20px] text-gray-700"></i>{' '}
          </span>
        </Popover>
      </section>
    </div>
  );
};

export default FilterPanel;
