import { MenuProps, Space } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

export const items: MenuProps['items'] = [
  {
    key: '1',
    label: (
      <Space className="p-1" size={10}>
        <UserOutlined />
        <span>My Profile</span>
      </Space>
    ),
  },
  {
    key: '2',
    onClick: () => {
      console.log('logout');
    },
    label: (
      <Space className="p-1" size={10}>
        <LogoutOutlined />
        <span>Logout</span>
      </Space>
    ),
  },
];
