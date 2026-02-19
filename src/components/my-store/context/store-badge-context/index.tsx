'use client';

import { createContext, useContext } from 'react';
import { NavBadgeCounts } from '../../layout/store-sidebar';

interface StoreBadgeContextType {
  badgeCounts: NavBadgeCounts;
  clearBadge: (key: keyof NavBadgeCounts) => void;
}

export const StoreBadgeContext = createContext<StoreBadgeContextType>({
  badgeCounts: {},
  clearBadge: () => {},
});

export const useStoreBadge = () => useContext(StoreBadgeContext);
