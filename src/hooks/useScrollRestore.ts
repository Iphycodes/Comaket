'use client';

import { useEffect, useCallback, useRef } from 'react';
import { usePathname } from 'next/navigation';

const SCROLL_KEY_PREFIX = 'scroll_pos_';

/**
 * Saves scroll position before navigation and restores it when returning.
 * @param dataReady - pass true once the page content has loaded (e.g. listings populated)
 */
export function useScrollRestore(dataReady: boolean) {
  const pathname = usePathname();
  const restoredRef = useRef(false);

  // Restore scroll position once data is ready
  useEffect(() => {
    if (!dataReady || restoredRef.current) return;

    const key = SCROLL_KEY_PREFIX + pathname;
    const saved = sessionStorage.getItem(key);

    if (saved) {
      const y = parseInt(saved, 10);
      // Use requestAnimationFrame to ensure DOM has painted
      requestAnimationFrame(() => {
        window.scrollTo(0, y);
      });
      sessionStorage.removeItem(key);
    }

    restoredRef.current = true;
  }, [dataReady, pathname]);

  // Save current scroll position before navigating away
  const saveScrollPosition = useCallback(() => {
    const key = SCROLL_KEY_PREFIX + pathname;
    sessionStorage.setItem(key, String(window.scrollY));
  }, [pathname]);

  return { saveScrollPosition };
}
