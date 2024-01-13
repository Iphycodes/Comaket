import { MenuProps } from 'antd';
import { RiDashboardLine } from 'react-icons/ri';
import { GrTransaction } from 'react-icons/gr';
import { PiMoney } from 'react-icons/pi';
import { RiListSettingsLine } from 'react-icons/ri';
import { MdManageAccounts, MdAdd } from 'react-icons/md';

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
      {to ? <Link href={`/giro-debit/${to}`}>{label}</Link> : <span>{label}</span>}
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
    <span className="font-thin text-[14px]">Add Business</span>,
    'business_sub_1',
    <MdAdd size={15} />
  ),
  getItem(
    <span className="font-thin text-[14px]">Manage All Businesses</span>,
    'business_sub_2',
    <MdManageAccounts size={15} />
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
