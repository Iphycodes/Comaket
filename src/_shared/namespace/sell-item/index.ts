// ─── Selling Model Types ─────────────────────────────────────────────────────
// These map to the 3 ways users can sell on Comaket

export type SellingModel = 'self-listing' | 'consignment' | 'direct-sale';

// ─── Status Types ────────────────────────────────────────────────────────────
// Each selling model follows a different status flow

export type SellItemStatus =
  | 'in-review' // All models: initial state after submission
  | 'approved' // All models: passed review (transitional for self-listing/consignment)
  | 'rejected' // All models: failed review or rejected at any stage
  | 'awaiting-fee' // Self-listing only: approved, waiting for listing fee payment
  | 'awaiting-product' // Consignment only: approved, waiting to receive the physical product
  | 'price-offered' // Direct-sale only: platform has made a bid
  | 'counter-offer' // Direct-sale only: seller sent a counter-offer
  | 'live' // Self-listing & Consignment: item is listed and visible on marketplace
  | 'sold' // All models: item has been sold
  | 'delisted'; // All models: item removed from marketplace

// ─── Fee / Commission Config ─────────────────────────────────────────────────
// These are DEFAULTS only — actual values come from the platform settings API.
// Components should use useGetPlatformSettingsQuery() from @grc/services/payments.

export const DEFAULT_LISTING_FEE_PERCENT = 5;
export const DEFAULT_LISTING_FEE_CAP_KOBO = 500000; // ₦5,000
export const DEFAULT_CONSIGNMENT_COMMISSION_PERCENT = 15;
export const DEFAULT_CONSIGNMENT_COMMISSION_CAP_KOBO = 2000000; // ₦20,000

// ─── Helper to calculate listing fee (use with API-sourced values) ───────────
export const calculateListingFee = (
  priceKobo: number,
  feePercent = DEFAULT_LISTING_FEE_PERCENT,
  capKobo = DEFAULT_LISTING_FEE_CAP_KOBO
): number => {
  const fee = Math.round((priceKobo * feePercent) / 100);
  return capKobo > 0 ? Math.min(fee, capKobo) : fee;
};

/** Returns { platformCut, sellerCut } in kobo (use with API-sourced values) */
export const calculateConsignmentCut = (
  priceKobo: number,
  commissionPercent = DEFAULT_CONSIGNMENT_COMMISSION_PERCENT,
  capKobo = DEFAULT_CONSIGNMENT_COMMISSION_CAP_KOBO
) => {
  const base = capKobo > 0 ? Math.min(priceKobo, capKobo) : priceKobo;
  const platformCut = Math.round((base * commissionPercent) / 100);
  const sellerCut = priceKobo - platformCut;
  return { platformCut, sellerCut };
};

// ─── Status flow helpers ─────────────────────────────────────────────────────

export const getStatusLabel = (status: SellItemStatus): string => {
  const labels: Record<SellItemStatus, string> = {
    'in-review': 'In Review',
    approved: 'Approved',
    rejected: 'Rejected',
    'awaiting-fee': 'Awaiting Fee',
    'awaiting-product': 'Awaiting Product',
    'price-offered': 'Price Offered',
    'counter-offer': 'Counter Offer',
    live: 'Live',
    sold: 'Sold',
    delisted: 'Delisted',
  };
  return labels[status] || status;
};

export const getStatusColor = (status: SellItemStatus): string => {
  const colors: Record<SellItemStatus, string> = {
    'in-review': '#6366f1', // indigo
    approved: '#10b981', // emerald
    rejected: '#ef4444', // red
    'awaiting-fee': '#f59e0b', // amber
    'awaiting-product': '#8b5cf6', // violet
    'price-offered': '#3b82f6', // blue
    'counter-offer': '#f97316', // orange
    live: '#22c55e', // green
    sold: '#06b6d4', // cyan
    delisted: '#6b7280', // neutral
  };
  return colors[status] || '#6b7280';
};

export const getSellingModelLabel = (model: SellingModel): string => {
  const labels: Record<SellingModel, string> = {
    'self-listing': 'Self Listing',
    consignment: 'Consignment',
    'direct-sale': 'Direct Sale',
  };
  return labels[model] || model;
};

export const getSellingModelIcon = (model: SellingModel): string => {
  const icons: Record<SellingModel, string> = {
    'self-listing': 'ri-store-2-line',
    consignment: 'ri-handshake-line',
    'direct-sale': 'ri-exchange-dollar-line',
  };
  return icons[model] || 'ri-store-line';
};

// ─── Extended mock item type ─────────────────────────────────────────────────

export interface SellItemType {
  id: string | number;
  itemName: string;
  description: string;
  condition: string;
  location: {
    country: string;
    state: string;
    city: string;
  };
  postImgUrls: string[];
  askingPrice: {
    price: number; // in kobo
    negotiable: boolean;
  };
  sellingModel: SellingModel;
  status: SellItemStatus;
  rejectionReason?: string;
  // Self-listing specific
  listingFee?: number; // in kobo
  feePaymentStatus?: 'pending' | 'awaiting-payment' | 'processed';
  // Direct-sale specific
  platformBid?: number; // in kobo — the price platform is offering
  counterOffer?: number; // in kobo — seller's counter
  // Consignment specific
  consignmentCommission?: number; // percentage
  // Meta
  createdAt: string;
  updatedAt: string;
  sponsored: boolean;
  live: boolean;
  postUserProfile: {
    businessName?: string;
    userName?: string;
    profilePicUrl?: string;
  };
  // Engagement
  likes: any[];
  comments: any[];
  bookMarks: any[];
}
