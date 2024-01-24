import { FC, ReactNode } from 'react';
import { Rings } from 'react-preloader-icon';
import { LoaderProps } from 'react-preloader-icon/Preloader';
import { AppLoader } from '../app-loader';
import { motion } from 'framer-motion';
import styled from 'styled-components';

interface WithLoaderProps {
  loading: boolean | undefined;
  mobileResponsive: boolean;
  use?: FC<LoaderProps>;
  children: ReactNode | ReactNode[];
  theme?: string;
}

const variants = (loading: boolean | undefined) => ({
  hidden: { opacity: 0, scale: 0 },
  enter: { opacity: loading ? 0.5 : 1, scale: 1 },
  exit: { opacity: 0, scale: 0 },
});

export const WithLoaderRender = (props: WithLoaderProps) => {
  const { loading, mobileResponsive, children, use, theme } = props;
  return (
    <>
      {loading && (
        <AppLoader
          use={use || Rings}
          theme={theme}
          style={{ left: mobileResponsive ? '38vw' : '38vw' }}
        />
      )}
      <StyledAppContent
        $mobileResponsive={mobileResponsive}
        $loading={loading}
        initial="hidden"
        animate="enter"
        exit="exit"
        variants={mobileResponsive ? {} : variants(loading)}
        transition={{ type: 'spring', bounce: 0.2 }}
      >
        {children}
      </StyledAppContent>
    </>
  );
};

const StyledAppContent = styled(motion.div)<{
  $mobileResponsive: boolean;
  $loading: boolean | undefined;
}>`
  width: 100%;
  overflow: hidden auto;
  min-height: 100%;
  pointer-events: ${(props) => props.$loading && 'none'};
`;
