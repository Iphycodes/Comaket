'use client';
import React, { ReactNode } from 'react';
import { capitalize, startCase } from 'lodash';
import { Button } from 'antd';

type QuickActionBtnProps = {
  title: string;
  icon: ReactNode;
  handleClick: () => void;
};

export const QuickActionBtn = ({ icon, title, handleClick }: QuickActionBtnProps) => {
  return (
    <Button
      type="primary"
      ghost
      className="p-2 border flex gap-1 items-center justify-center"
      onClick={handleClick}
    >
      {icon} {startCase(capitalize(title))}
    </Button>
  );
};
