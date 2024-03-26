import { Preloader, TailSpin } from 'react-preloader-icon';
import React, { FC } from 'react';
import { LoaderProps } from 'react-preloader-icon/Preloader';

export const AppLoader = (props: {
  size?: number;
  style?: Record<string, any>;
  use?: FC<LoaderProps>;
  theme?: string;
}) => {
  const { size = 80, style, use } = props;
  return (
    <Preloader
      use={use || TailSpin}
      size={size}
      strokeWidth={8}
      strokeColor={'#F0AD4E'}
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
