'use client';
import React, { ReactElement, useCallback } from 'react';
import { Layout, Space, Switch, Avatar, Popover } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { CaretDownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { RiMoonFill } from 'react-icons/ri';
import { HiOutlineLightBulb } from 'react-icons/hi';
import { useContext } from 'react';
import { AppContext } from '@grc/app-context';
import { useRouter } from 'next/navigation';
import { getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import * as _ from 'lodash';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';

const { Header } = Layout;

export interface AppHeaderProps {
  items?: ReactElement[];
}

export const AppHeader = (props: AppHeaderProps) => {
  const {} = props;
  const isMobile = useMediaQuery(mediaSize.mobile);
  const pathname = usePathname();
  const pathUrl = pathname?.split('/');
  const theme = 'light';
  const currentPath = `${pathUrl?.[3]}`.toUpperCase() ?? '';
  const { currentAccount } = useContext(AppContext);

  const router = useRouter();
  const { handleLogOut } = useContext(AppContext);

  const handleMenuClick = (key: string) => {
    if (key === 'logout') {
      handleLogOut();
      router.push('/login');
    } else {
      // this will route to the profile page when it is created
      console.log('profile route');
    }
  };

  const getContent = useCallback(() => {
    return (
      <div>
        <div
          className="cursor-pointer rounded-sm px-3 py-1 hover:bg-gray-100"
          onClick={() => handleMenuClick('')}
        >
          <Space className="p-1" size={15}>
            <UserOutlined />
            <span>My Profile</span>
          </Space>
        </div>
        <div
          className="cursor-pointer rounded-sm px-3 py-1 hover:bg-gray-100"
          onClick={() => handleMenuClick('logout')}
        >
          <Space className="p-1" size={15}>
            <LogoutOutlined />
            <span>Logout</span>
          </Space>
        </div>
      </div>
    );
  }, []);

  return (
    <Header
      className="layout-header shadow-sm"
      style={{
        position: 'sticky',
        top: 0,
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        padding: `${isMobile ? '10px' : '0 40px'}`,
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #F3F3F3',
        zIndex: 100,
      }}
    >
      <div className="flex justify-between items-center min-w-full bg-white">
        {(pathUrl ?? [])?.length <= 2 ? (
          <Image src={'/assets/svgs/giro-logo.svg'} alt="giro-logo" width={120} height={50} />
        ) : (
          <div className="font-bold text-3">{`${currentPath}`}</div>
        )}
        <div className="flex items-center gap-10">
          <div className="flex gap-2 items-center">
            <Switch className="live-mode-switch" style={{ color: 'green' }} size="small" />
            <span className="font-bold">Live mode</span>
          </div>
          {/* <Link className="hover:text-black hover:font-semibold" href={'/'}> */}
          <Link className="underline" href={'/'}>
            API Documentation
          </Link>
          <Link className="underline" href={'/'}>
            For Developers
          </Link>

          <span className="cursor-pointer">
            {theme === 'light' ? <RiMoonFill size={20} /> : <HiOutlineLightBulb size={20} />}
          </span>

          <Popover
            content={getContent()}
            placement={'bottomLeft'}
            overlayClassName="dropdown-popover"
            trigger={'click'}
            showArrow={false}
            arrow={false}
            overlayStyle={{ zIndex: 10 }}
          >
            <div className="cursor-pointer flex items-center gap-2">
              <Avatar
                style={{
                  backgroundColor: getRandomColorByString(currentAccount?.name ?? ''),
                  verticalAlign: 'middle',
                }}
              >
                {_.isEmpty('') && getFirstCharacter(currentAccount?.name ?? '')}
              </Avatar>
              <span className="font-bold">{currentAccount?.name}</span>
              <CaretDownOutlined size={10} />
            </div>
          </Popover>
        </div>
      </div>
    </Header>
  );
};
