import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { Dropdown, Button } from 'antd';
import { isEmpty } from 'lodash';
import { Store, User, LogOut, ChevronDown } from 'lucide-react';

const UserDropdown = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  // Popular vendors data
  const popularVendors = [
    { name: 'Tech Hub Store', id: '1' },
    { name: 'Fashion Gallery', id: '2' },
    { name: 'Home Essentials', id: '3' },
  ];

  const items = [
    {
      key: 'popular-vendors',
      type: 'group',
      label: 'Popular Vendors',
      children: popularVendors.map((vendor) => ({
        key: vendor.id,
        label: (
          <a href={`/vendor/${vendor.id}`} className="flex items-center gap-2 py-1">
            <span
              className="h-6 w-6 rounded-full flex items-center justify-center text-xs"
              style={{
                backgroundColor: getRandomColorByString(vendor.name),
                color: 'white',
              }}
            >
              {getFirstCharacter(vendor.name)}
            </span>
            <span>{vendor.name}</span>
          </a>
        ),
      })),
    },
    {
      key: 'divider-1',
      type: 'divider',
    },
    {
      key: 'create-store',
      label: (
        <Button
          type="primary"
          className="w-full flex items-center justify-center bg-blue !h-10 gap-2"
        >
          <Store size={16} />
          Create Store
        </Button>
      ),
    },
    {
      key: 'divider-2',
      type: 'divider',
    },
    {
      key: 'profile',
      label: (
        <a href="/profile" className="flex items-center gap-2 py-1">
          <User size={16} />
          Profile
        </a>
      ),
    },
    {
      key: 'logout',
      label: (
        <span
          onClick={() => console.log('logout')}
          className="flex items-center gap-2 py-1 text-red-500"
        >
          <LogOut size={16} />
          Logout
        </span>
      ),
    },
  ];

  return (
    <Dropdown menu={{ items }} trigger={['click']} placement="bottomRight" overlayClassName="w-64">
      <div className="flex items-center gap-1 cursor-pointer">
        {isMobile && (
          <span
            className="flex items-center justify-center h-6 w-6 rounded-[50%]"
            style={{
              backgroundColor: getRandomColorByString('Ifeanyi'),
            }}
          >
            {isEmpty('') && getFirstCharacter('Ifeanyi')}
          </span>
        )}
        <ChevronDown size={16} className="text-gray-600" />
      </div>
    </Dropdown>
  );
};

export default UserDropdown;
