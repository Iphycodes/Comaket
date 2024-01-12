import { MenuProps } from 'antd';
import { DashboardOutlined, RiseOutlined, SettingOutlined, BookOutlined } from '@ant-design/icons';
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
      <Link href={`/giro-debit/${to}`} className="hover:text-black hover:font-bold">
        {label}
      </Link>
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
    'Navigation',
    'grp',
    null,
    undefined,
    [
      getItem(
        'Dashboard',
        '1',
        <DashboardOutlined
          style={{ fontSize: '15px', fontWeight: 'bolder' }}
          className="menu-icon"
        />,
        '/dashboard'
      ),
      getItem('Transactions', '2', <RiseOutlined style={{ fontSize: '14px' }} />, '/transactions'),
      getItem('Settings', '3', <SettingOutlined style={{ fontSize: '15px' }} />, '/settings'),

      getItem('Accounts', '4', <BookOutlined style={{ fontSize: '15px' }} />, '/accounts'),
    ],
    'group'
  ),
];
