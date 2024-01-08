import { useEffect, useState } from 'react';

interface ResponsivenessType {
  children: any;
  className?: string;
  style?: Record<string, any>;
}

export function useMediaQuery(query: string) {
  const [matches, setMatches] = useState<boolean>(false);

  useEffect(() => {
    const media = window.matchMedia(query);
    if (media.matches !== matches) {
      setMatches(media.matches);
    }
    const listener = () => {
      setMatches(media.matches);
    };
    media.addListener(listener);
    return () => media.removeListener(listener);
  }, [matches, query]);

  return matches;
}

export const mediaSize: Record<string, string> = {
  desktop: '(min-width: 992px)',
  mobile: '(max-width: 991px)' /**mobile width is 767px but we're using 991px**/,
  tablet: '(max-width: 991px)',
};

export const Desktop = ({ children, className, style }: ResponsivenessType) => {
  const isDesktop = useMediaQuery(mediaSize.desktop);
  return isDesktop ? (
    <div className={className} style={style} data-testid={'desktop'}>
      {children}
    </div>
  ) : null;
};

export const Mobile = ({ children, className, style }: ResponsivenessType) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  return isMobile ? (
    <div className={className} style={style} data-testid={'mobile'}>
      {children}
    </div>
  ) : null;
};

export const Tablet = ({ children, className, style }: ResponsivenessType) => {
  const isTablet = useMediaQuery(mediaSize.tablet);
  return isTablet ? (
    <div className={className} style={style} data-testid={'tablet'}>
      {children}
    </div>
  ) : null;
};
