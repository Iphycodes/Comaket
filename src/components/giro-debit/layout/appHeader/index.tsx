'use client';
import React, { ReactElement } from 'react';
import { Layout } from 'antd';
const { Header } = Layout;
// import { MenuFoldOutlined } from '@ant-design/icons';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

export interface AppHeaderProps {
  items?: ReactElement[];
}

export const AppHeader = (props: AppHeaderProps) => {
  const {} = props;
  const isMobile = useMediaQuery(mediaSize.mobile);
  //   const isTablet = useMediaQuery(mediaSize.tablet);

  return (
    <Header
      className="layout-header"
      style={{
        position: 'sticky',
        top: 0,
        height: 'auto',
        display: 'flex',
        alignItems: 'center',
        padding: `${isMobile ? '10px' : '5px 20px'}`,
        backgroundColor: '#ffffff',
      }}
    >
      <div className="flex justify-between items-center min-w-full bg-white px-3">
        <div>1</div>
        <div>2</div>
      </div>
    </Header>
  );
};
