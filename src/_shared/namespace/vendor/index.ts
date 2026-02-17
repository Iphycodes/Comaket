import { MarketItem } from '@grc/_shared/namespace';

// ─── Vendor Types ─────────────────────────────────────────────────────────────

export interface VendorSocialLinks {
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  website?: string;
}

export interface VendorStats {
  totalSales: number;
  responseRate: number; // 0–100
  avgResponseTime: string; // e.g. "< 1 hour"
  repeatCustomerRate: number; // 0–100
}

export interface VendorReview {
  id: string;
  buyerName: string;
  buyerAvatar?: string;
  rating: number;
  comment: string;
  date: string;
  productName?: string;
}

export interface Vendor {
  id: string;
  name: string;
  userName?: string;
  businessName: string;
  profilePicUrl: string;
  coverImageUrl?: string;
  description: string;
  tagline?: string;
  location: string;
  rating: number;
  reviewCount: number;
  productCount: number;
  joinedDate: string;
  isVerified: boolean;
  isSuperVerified?: boolean;
  phoneNumber: string;
  email?: string;
  categories: string[];
  socialLinks?: VendorSocialLinks;
  stats?: VendorStats;
  reviews?: VendorReview[];
  products?: MarketItem[];
  badges?: string[]; // e.g. "Top Seller", "Fast Shipper", "Trusted Vendor"
  operatingHours?: string; // e.g. "Mon–Sat, 9AM–6PM"
  acceptedPayments?: string[]; // e.g. ["Bank Transfer", "Paystack", "Cash"]
  followerCount?: number;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

export const getVendorInitials = (name: string): string =>
  name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

export const formatJoinDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMonths = Math.floor(diffMs / (1000 * 60 * 60 * 24 * 30));

  if (diffMonths < 1) return 'This month';
  if (diffMonths < 12) return `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;

  const years = Math.floor(diffMonths / 12);
  const remainingMonths = diffMonths % 12;
  if (remainingMonths === 0) return `${years} year${years > 1 ? 's' : ''} ago`;
  return `${years}y ${remainingMonths}mo ago`;
};

export const getRatingLabel = (rating: number): string => {
  if (rating >= 4.8) return 'Exceptional';
  if (rating >= 4.5) return 'Excellent';
  if (rating >= 4.0) return 'Very Good';
  if (rating >= 3.5) return 'Good';
  return 'Average';
};
