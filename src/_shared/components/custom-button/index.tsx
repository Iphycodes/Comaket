import { Button } from 'antd';
import React, { memo, ReactElement, ReactNodeArray } from 'react';
import { motion } from 'framer-motion';

type CustomBtnProps = {
  type: 'primary' | 'link' | 'default';
  children: string | number | ReactElement | ReactNodeArray;
  className?: string;
  htmlType?: 'submit';
  onClick?: any;
  loading?: boolean;
  block?: boolean;
  padding?: string;
  mobileResponsive?: boolean;
  disabled?: boolean;
  height?: string | number;
  style?: React.CSSProperties;
  backgroundColor?: string;
  border?: string;
};

const CustomBtn = (props: CustomBtnProps) => {
  const {
    type,
    children,
    className,
    htmlType,
    onClick,
    loading,
    block,
    style,
    padding = '0 50px',
    mobileResponsive = false,
    height = 50,
    disabled = false,
    backgroundColor,
    border,
    ...otherProps
  } = props;

  return (
    <motion.div whileTap={{ scale: 0.99 }}>
      <Button
        style={{
          ...style,
          height: mobileResponsive ? 28 : height,
          padding: mobileResponsive ? '0 16px' : padding,
          border: border ? border : 'none',
          lineHeight: 0,
          background: type === 'link' ? '#ffff' : backgroundColor || 'var(--accent)',
        }}
        className={className}
        type={type}
        htmlType={htmlType}
        data-testid={'custom_btn'}
        onClick={onClick}
        loading={loading}
        block={block}
        disabled={disabled}
        {...otherProps}
      >
        <span className={`font-semibold ${mobileResponsive ? 'text-[10px]' : 'text-sm'}`}>
          {children}
        </span>
      </Button>
    </motion.div>
  );
};
export default memo(CustomBtn);
