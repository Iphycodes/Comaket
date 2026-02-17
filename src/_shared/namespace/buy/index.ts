import { CartItem } from '../cart';

const BUY_NOW_KEY = 'comaket_buy_now_item';

export const setBuyNowItem = (item: CartItem): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.setItem(BUY_NOW_KEY, JSON.stringify(item));
  }
};

export const getBuyNowItem = (): CartItem | null => {
  if (typeof window === 'undefined') return null;
  const stored = sessionStorage.getItem(BUY_NOW_KEY);
  return stored ? JSON.parse(stored) : null;
};

export const clearBuyNowItem = (): void => {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(BUY_NOW_KEY);
  }
};
