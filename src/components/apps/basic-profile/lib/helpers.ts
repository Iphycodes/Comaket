import { Currencies } from '@grc/_shared/constant';
import { numberFormat } from '@grc/_shared/helpers';
import { UpdateUserProfilePayload } from '@grc/services/users';
import { MarketItem, Pagination } from '@grc/_shared/namespace';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'completed'
  | 'cancelled'
  | 'returned';

export interface PaginationInfo {
  total: number;
  page: number;
  perPage: number;
  totalPages: number;
}

export interface LocationOption {
  name: string;
  iso2?: string;
}

export interface BasicProfileProps {
  // User profile
  userProfile?: any;
  updateUserProfile?: (data: UpdateUserProfilePayload) => Promise<any>;
  isUpdatingProfile?: boolean;
  onProfileUpdated?: () => void;
  // Location data for edit form
  states?: LocationOption[];
  cities?: LocationOption[];
  loadingStates?: boolean;
  loadingCities?: boolean;
  onStateChange?: (state: string) => void;
  onCityChange?: (city: string) => void;
  // Orders
  orders?: any[];
  ordersPagination?: Pagination;
  isLoadingOrders?: boolean;
  isFetchingOrders?: boolean;
  onLoadMoreOrders?: (page: number) => void;
  onFetchOrderDetail?: (orderId: string) => Promise<any>;
  orderDetail?: any;
  isLoadingOrderDetail?: boolean;
  // Saved products (MarketItem-compatible for SavedItems component)
  savedItems?: MarketItem[];
  savedPagination?: Pagination;
  savedCount?: number;
  isLoadingSaved?: boolean;
  isFetchingSaved?: boolean;
  onRemoveSaved?: (listingId: string) => Promise<any>;
  isRemovingSaved?: boolean;
  onLoadMoreSaved?: (page: number) => void;
  onRefetchOrders?:
    | ((params: { search?: string; status?: string; page?: number; perPage?: number }) => void)
    | undefined;
}

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

export const formatPrice = (amount?: number, currency?: string): string => {
  if (!amount) return '₦0';
  return numberFormat(amount / 100, currency === 'NGN' ? Currencies.NGN : Currencies.NGN);
};

export const formatCondition = (condition?: string): string => {
  if (!condition) return '';
  return condition.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
};
