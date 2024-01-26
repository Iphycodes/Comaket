import { Preloader, Audio } from 'react-preloader-icon';
import React, { FC } from 'react';
import { LoaderProps } from 'react-preloader-icon/Preloader';

export const AppLoader = (props: {
  size?: number;
  style?: Record<string, any>;
  use?: FC<LoaderProps>;
  theme?: string;
}) => {
  const { size = 80, style, use, theme } = props;
  return (
    <Preloader
      use={use || Audio}
      size={size}
      strokeWidth={8}
      strokeColor={theme === 'light' ? '#1e88e5' : 'rgba(31, 41, 55, 1)'}
      style={{
        position: 'absolute',
        top: '30vh',
        left: '50vw',
        zIndex: 10,
        ...style,
      }}
    />
  );
};
