import { Tooltip } from 'antd';
import React, { ReactNode } from 'react';
import { TooltipPlacement } from 'antd/es/tooltip';

type CustomToolTipProps = {
  children: ReactNode;
  title: string;
  placement?: TooltipPlacement;
  className?: string;
};
const CustomToolTip = ({
  children,
  title,
  placement = 'bottom',
  className,
}: CustomToolTipProps) => {
  return (
    <Tooltip
      placement={placement}
      // overlayStyle={{ minWidth: '400px' }}
      overlayInnerStyle={{
        color: '#00000080',
        textAlign: 'left',
        fontSize: '14px',
        padding: '10px 15px',
        fontWeight: 400,
      }}
      overlayClassName=""
      className={` ${className}`}
      color={'#ffffff'}
      title={title}
      arrow={{ pointAtCenter: true }}
    >
      {children}
    </Tooltip>
  );
};
export default CustomToolTip;
