'use client';

import { useEffect, useCallback, useRef, RefObject } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_KEY_PREFIX = 'scroll_pos_';

/**
 * Saves scroll position before navigation and restores it when returning.
 * @param dataReady - pass true once the page content has loaded (e.g. listings populated)
 * @param scrollContainerRef - optional ref to a scrollable container (defaults to window)
 */
export function useScrollRestore(
  dataReady: boolean,
  scrollContainerRef?: RefObject<HTMLDivElement | null>
) {
  const pathname = usePathname();
  const restoredRef = useRef(false);

  // Restore scroll position once data is ready
  useEffect(() => {
    if (!dataReady || restoredRef.current) return;

    const key = SCROLL_KEY_PREFIX + pathname;
    const saved = sessionStorage.getItem(key);

    if (saved) {
      const y = parseInt(saved, 10);
      requestAnimationFrame(() => {
        if (scrollContainerRef?.current) {
          scrollContainerRef.current.scrollTop = y;
        } else {
          window.scrollTo(0, y);
        }
      });
      sessionStorage.removeItem(key);
    }

    restoredRef.current = true;
  }, [dataReady, pathname, scrollContainerRef]);

  // Save current scroll position before navigating away
  const saveScrollPosition = useCallback(() => {
    const key = SCROLL_KEY_PREFIX + pathname;
    const scrollY = scrollContainerRef?.current
      ? scrollContainerRef.current.scrollTop
      : window.scrollY;
    sessionStorage.setItem(key, String(scrollY));
  }, [pathname, scrollContainerRef]);

  return { saveScrollPosition };
}
