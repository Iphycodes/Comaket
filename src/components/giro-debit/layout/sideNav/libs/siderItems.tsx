import { MenuProps, Select } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { RiDashboardLine } from 'react-icons/ri';
import { GrTransaction } from 'react-icons/gr';
import { PiMoney } from 'react-icons/pi';
import { RiListSettingsLine } from 'react-icons/ri';

import Link from 'next/link';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  to?: string,
  children?: MenuItem[],
  type?: 'group'
): MenuItem {
  const menuIcon = <span>{icon}</span>;
  const menuLabel = (
    <div className="flex items-center justify-between">
      <Link href={`/giro-debit/${to}`}>{label}</Link>
    </div>
  );
  return {
    key,
    icon: menuIcon,
    children,
    label: menuLabel,
    className: 'menu-item-con',
    type,
  } as MenuItem;
}

export const siderItems: MenuItem[] = [
  getItem(
    <Select placeholder={'Business'} style={{}} className="w-[200px]" />,
    '5',
    null,
    undefined,
    [
      getItem(
        <span className="font-thin">Add Business</span>,
        '4',
        <PlusOutlined size={20} />,
        '/settings'
      ),
    ],
    'group'
  ),
  getItem(
    'Navigation',
    'grp',
    null,
    undefined,
    [
      getItem('Dashboard', '1', <RiDashboardLine size={20} className="menu-icon" />, '/dashboard'),
      getItem('Transactions', '2', <GrTransaction size={20} />, '/transactions'),
      getItem('Disbursement', '3', <PiMoney size={20} />, '/disbursement'),
      getItem('Settings', '4', <RiListSettingsLine size={20} />, '/settings'),
    ],
    'group'
  ),
];
