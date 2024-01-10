'use client';
import { usePathname } from 'next/navigation';
import { StyledLink, StyleErrorPage } from './not-found.style';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { useMemo } from 'react';

export default function NotFound() {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const pathname = usePathname();

  const isAuthPath = useMemo(() => {
    return pathname && pathname.includes('auth');
  }, [pathname]);

  return (
    <StyleErrorPage isMobile={isMobile}>
      <div>
        404 <span>🥹</span>
      </div>
      <div>This is not the page you are looking for</div>
      <div>it appears the page you are looking for does not exist</div>
      <StyledLink href={`${isAuthPath ? '/auth/login' : '/client/dashboard'}`}>
        Go back home
      </StyledLink>
    </StyleErrorPage>
  );
}
