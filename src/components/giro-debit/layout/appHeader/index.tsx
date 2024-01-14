'use client';
import React, { ReactElement } from 'react';
import { Dropdown, Layout, Space, Switch } from 'antd';
const { Header } = Layout;
// import { MenuFoldOutlined } from '@ant-design/icons';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import { CaretDownOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { items } from './libs/dropdown-items';
import { RiMoonFill } from 'react-icons/ri';
import { HiOutlineLightBulb } from 'react-icons/hi';

export interface AppHeaderProps {
  items?: ReactElement[];
}

export const AppHeader = (props: AppHeaderProps) => {
  const {} = props;
  const isMobile = useMediaQuery(mediaSize.mobile);
  const pathname = usePathname();
  const pathUrl = pathname?.split('/');
  const currentPath = `${pathUrl?.[2]}`.toUpperCase() ?? '';
  const isSplashScreen = pathUrl?.[1] === 'splash';
  const theme = 'light';

  //   const isTablet = useMediaQuery(mediaSize.tablet);

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
      }}
    >
      <div className="flex justify-between items-center min-w-full bg-white">
        {isSplashScreen ? (
          <Image src={'/assets/svgs/giro-logo.svg'} alt="giro-logo" width={120} height={50} />
        ) : (
          <div className="font-bold text-3">{`${currentPath}`}</div>
        )}
        <div className="flex items-center gap-10">
          <div className="flex gap-2 items-center">
            <Switch className="live-mode-switch" style={{ color: 'green' }} size="small" />
            <span className="font-bold">Live mode</span>
          </div>
          <Link className="hover:text-black hover:font-semibold" href={'/'}>
            API Documentation
          </Link>
          <Link className="hover:text-black hover:font-semibold" href={'/'}>
            For Developers
          </Link>

          <span className="cursor-pointer">
            {theme === 'light' ? <RiMoonFill size={20} /> : <HiOutlineLightBulb size={20} />}
          </span>

          <Dropdown menu={{ items }} className="header-drop-down">
            <Space className="cursor-pointer" size={5}>
              <Image
                src={'/assets/svgs/user-circle.svg'}
                alt="woman-face"
                width={60}
                height={60}
                style={{ borderRadius: '50%', height: '30px', width: '30px' }}
              />
              <span className="font-bold">{'Username'}</span>
              <CaretDownOutlined size={10} />
            </Space>
          </Dropdown>
        </div>
      </div>
    </Header>
  );
};
