import { StyledLink, StyleErrorPage } from './not-found.style';
import { mediaSize, useMediaQuery } from '@grc/components/_shared/responsiveness';

export default function NotFound() {
  const isMobile = useMediaQuery(mediaSize.mobile);

  return (
    <StyleErrorPage isMobile={isMobile}>
      <div>
        404 <span>🥹</span>
      </div>
      <div>This is not the page you are looking for</div>
      <div>it appears the page you are looking for does not exist</div>
      <StyledLink href="/client/dashboard">Go back home</StyledLink>
    </StyleErrorPage>
  );
}
