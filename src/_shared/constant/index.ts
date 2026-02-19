export const POST = 'POST';
export const PUT = 'PUT';
export const PATCH = 'PATCH';
export const DELETE = 'DELETE';
export const GET = 'GET';

/** url **/
export const registerUrl = 'auth/sign-up';
export const accountUrl = 'accounts';
export const constantUrl = 'constants';
export const loginUrl = 'auth/sign-in';
export const verifyEmailUrl = 'auth/verify-email';
export const sendVerificationUrl = 'auth/send-verification';
export const forgotPasswordUrl = 'auth/password-reset';
export const resetPasswordUrl = 'auth/reset-password';
export const verifyUserUrl = 'auth/verify-user';
export const projectUrl = 'project';
export const licenceUrl = 'licenses';
export const employeeUrl = 'employee';
export const permissionUrl = 'permissions';
export const logsUrl = 'faceproof_logs';
export const verifyPaymentsUrl = 'verify_paystack_transaction';
export const paymentsUrl = 'initialize_paystack_transaction';
export const walletUrl = 'wallet';
export const virtualAcctUrl = 'virtual-accounts';
export const bankAccountsUrl = 'bank-accounts';
export const appUrl = 'accounts';
export const userUrl = 'users/me';
export const bankUrl = 'bank-accounts';
export const changePasswordUrl = 'auth/change-password';
export const businessProfileUrl = 'businesses';
export const accountSettingUrl = 'accounts';
export const mailTransactionUrl = 'transactions/summary/email';
export const transactionAnalyticsUrl = 'analytics/transactions';
export const transactionsUrl = 'transactions';
export const dashboardAnalyticsUrl = 'analytics/dashboard';
export const disbursementAnalyticsUrl = 'analytics/disbursements';

/**Token**/

export const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY as string;
export const appName = 'Comarket';
export const dateFormat = 'DD-MM-YYYY';

// export enum COLOR_LIST_ALPHA {
//   A = '#3E82FF',
//   B = '#C1EAFD',
//   C = '#F56A00',
//   D = '#7265E6',
//   E = '#FFBF00',
//   F = '#00A2AE',
//   G = '#9C9C9D',
//   H = '#F3D19B',
//   I = '#CA99BC',
//   J = '#BAB8F5',
//   K = '#7B68ED',
//   L = '#1F77B4',
//   M = '#DABC8B',
//   N = '#4CAF50',
//   O = '#FFC107',
//   P = '#FF5722',
//   Q = '#FF7F0E',
//   R = '#FF9800',
//   S = '#4B0082',
//   T = '#9E9E9E',
//   U = '#FFEB3B',
//   V = '#607D8B',
//   W = '#2196F3',
//   X = '#009688',
//   Y = '#8C564B',
//   Z = '#2CA02C',
// }

import { MarketItem } from '@grc/_shared/namespace';
import { SellItemType } from '../namespace/sell-item';
import { Vendor } from '../namespace/vendor';

export enum Currencies {
  NGN = 'NGN',
  USD = 'USD',
  GBP = 'GBP',
}

export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
export const WS_URL = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';

export const COLOR_LIST_ALPHA = [
  '#FF6B6B',
  '#4ECDC4',
  '#45B7D1',
  '#96CEB4',
  '#FFEAA7',
  '#DDA0DD',
  '#98D8C8',
  '#F7DC6F',
  '#BB8FCE',
  '#85C1E9',
];

/**
 * Mock market items simulating data from the backend.
 * - `isBuyable: true`  → consignment or direct-purchase items (Buy Now / Add to Cart shown)
 * - `isBuyable: false` → self-listed items (only WhatsApp shown)
 * - `media` array supports both images and videos
 */
export const mockMarketItems: MarketItem[] = [
  {
    id: 'prod_001',
    itemName: 'MacBook Pro 16" M3 Max — 36GB / 1TB',
    description:
      'Barely used MacBook Pro 16-inch with M3 Max chip, 36GB unified memory and 1TB SSD. Comes with original box, charger, and AppleCare+ until 2026. Battery cycle count under 50. Perfect for developers, designers, and creative professionals.',
    media: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800', type: 'image' },
      { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800', type: 'image' },
      {
        url: 'https://videos.pexels.com/video-files/856116/856116-sd_640_360_30fps.mp4',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
      },
    ],
    askingPrice: { price: 285000000, negotiable: true },
    condition: 'Fairly Used',
    availability: true,
    quantity: 1,
    category: 'Laptops',
    productTags: ['Apple', 'MacBook Pro', 'M3 Max', 'Laptop'],
    postUserProfile: {
      userName: 'techguru_ng',
      businessName: 'TechGuru Electronics',
      profilePicUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
      phoneNumber: '2348012345678',
      location: 'Lagos, Nigeria',
      isVerified: true,
      id: 'v1',
    },
    sponsored: true,
    comments: [
      { id: 'c1', user: 'buyer_joe', text: 'Is the price negotiable?', createdAt: '2025-12-10' },
      { id: 'c2', user: 'techguru_ng', text: 'Yes, send me a DM.', createdAt: '2025-12-10' },
    ],
    isBuyable: true,
    listingType: 'consignment',
    createdAt: '2025-12-01',
  },
  {
    id: 'prod_002',
    itemName: 'iPhone 15 Pro Max 256GB — Natural Titanium',
    description:
      'Brand new, sealed iPhone 15 Pro Max in Natural Titanium. 256GB storage. Purchased directly from Apple USA. Comes with full Apple warranty. IMEI clean and verified.',
    media: [
      { url: 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800', type: 'image' },
      { url: 'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800', type: 'image' },
    ],
    askingPrice: { price: 195000000, negotiable: false },
    condition: 'Brand New',
    availability: true,
    quantity: 5,
    category: 'Phones',
    productTags: ['Apple', 'iPhone 15 Pro Max', 'Smartphone'],
    postUserProfile: {
      userName: 'comaket_store',
      businessName: 'Comaket Official',
      profilePicUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
      phoneNumber: '2349011223344',
      location: 'Abuja, Nigeria',
      isVerified: true,
      id: 'v2',
    },
    sponsored: false,
    comments: [
      {
        id: 'c3',
        user: 'phonelover',
        text: 'Do you have the blue version?',
        createdAt: '2025-12-15',
      },
    ],
    isBuyable: true,
    listingType: 'direct-purchase',
    createdAt: '2025-12-14',
  },
  {
    id: 'prod_003',
    itemName: 'Samsung 65" QLED 4K Smart TV — QN65Q80C',
    description:
      "UK-used Samsung 65-inch QLED 4K Smart TV. Excellent condition, no dead pixels. Neural Quantum Processor 4K with Dolby Atmos. Comes with remote and wall-mount bracket. Selling because I'm relocating.",
    media: [
      { url: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800', type: 'image' },
      {
        url: 'https://videos.pexels.com/video-files/856029/856029-sd_640_360_30fps.mp4',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800',
      },
    ],
    askingPrice: { price: 45000000, negotiable: true },
    condition: 'Uk Used',
    availability: true,
    quantity: 1,
    category: 'Electronics',
    productTags: ['Samsung', 'TV', 'QLED', '4K', 'Smart TV'],
    postUserProfile: {
      userName: 'relocation_sale',
      businessName: 'Ahmed Clearance',
      profilePicUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
      phoneNumber: '2348033445566',
      location: 'Kaduna, Nigeria',
      isVerified: false,
      id: 'v3',
    },
    sponsored: false,
    comments: [],
    isBuyable: false,
    listingType: 'self-listing',
    createdAt: '2025-12-20',
  },
  {
    id: 'prod_004',
    itemName: 'Sony WH-1000XM5 Wireless Headphones',
    description:
      'Brand new Sony WH-1000XM5 noise-cancelling headphones. Industry-leading ANC, 30-hour battery life, multipoint Bluetooth. Sealed in box with receipt.',
    media: [
      { url: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800', type: 'image' },
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800', type: 'image' },
    ],
    askingPrice: { price: 28500000, negotiable: false },
    condition: 'Brand New',
    availability: true,
    quantity: 8,
    category: 'Audio',
    productTags: ['Sony', 'Headphones', 'Noise Cancelling', 'Wireless'],
    postUserProfile: {
      userName: 'comaket_store',
      businessName: 'Comaket Official',
      profilePicUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
      phoneNumber: '2349011223344',
      location: 'Abuja, Nigeria',
      isVerified: true,
      id: 'v4',
    },
    sponsored: true,
    comments: [{ id: 'c4', user: 'audiophile_ng', text: 'Great price!', createdAt: '2025-12-22' }],
    isBuyable: true,
    listingType: 'direct-purchase',
    createdAt: '2025-12-21',
  },
  {
    id: 'prod_005',
    itemName: 'PlayStation 5 Slim Digital Edition',
    description:
      'Selling my PS5 Slim Digital Edition. Used for 3 months, in excellent condition. Comes with one DualSense controller and original packaging. Reason for selling: switching to PC gaming.',
    media: [
      { url: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800', type: 'image' },
      {
        url: 'https://videos.pexels.com/video-files/854669/854669-sd_640_360_25fps.mp4',
        type: 'video',
        thumbnail: 'https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800',
      },
    ],
    askingPrice: { price: 42000000, negotiable: true },
    condition: 'Fairly Used',
    availability: true,
    quantity: 1,
    category: 'Gaming',
    productTags: ['PlayStation', 'PS5', 'Gaming Console', 'Sony'],
    postUserProfile: {
      userName: 'gamer_exit',
      businessName: '',
      profilePicUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200',
      phoneNumber: '2347065778899',
      location: 'Port Harcourt, Nigeria',
      isVerified: false,
      id: 'v5',
    },
    sponsored: false,
    comments: [
      { id: 'c5', user: 'ps_fan', text: 'Does it come with any games?', createdAt: '2025-12-25' },
      {
        id: 'c6',
        user: 'gamer_exit',
        text: 'No games, just the console and controller.',
        createdAt: '2025-12-25',
      },
    ],
    isBuyable: false,
    listingType: 'self-listing',
    createdAt: '2025-12-24',
  },
  {
    id: 'prod_006',
    itemName: 'Dell XPS 15 9530 — i7 / 32GB / 512GB',
    description:
      'UK-used Dell XPS 15 in great condition. Intel i7-13700H, 32GB RAM, 512GB NVMe SSD, 15.6" OLED 3.5K display. Battery health at 92%. Ideal for work and content creation.',
    media: [
      { url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?w=800', type: 'image' },
      { url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800', type: 'image' },
    ],
    askingPrice: { price: 115000000, negotiable: true },
    condition: 'Uk Used',
    availability: true,
    quantity: 2,
    category: 'Laptops',
    productTags: ['Dell', 'XPS 15', 'Laptop', 'OLED'],
    postUserProfile: {
      userName: 'laptop_plug',
      businessName: 'LaptopPlug NG',
      profilePicUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
      phoneNumber: '2348098765432',
      location: 'Ibadan, Nigeria',
      isVerified: true,
    },
    sponsored: false,
    comments: [],
    isBuyable: true,
    listingType: 'consignment',
    createdAt: '2025-12-26',
  },
];

export const mockVendors: Vendor[] = [
  {
    id: 'v1',
    name: 'Emeka Okafor',
    businessName: 'TechGuru Electronics',
    profilePicUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200',
    description:
      'Premium electronics and gadgets at the best prices in Lagos. We specialize in brand new and UK-used laptops, phones, and accessories. Every product comes with a minimum 30-day warranty and free setup support.',
    tagline: 'Your trusted tech partner since 2024',
    location: 'Lagos, Nigeria',
    rating: 4.8,
    reviewCount: 234,
    productCount: 45,
    joinedDate: '2024-03-15',
    isVerified: true,
    phoneNumber: '2348012345678',
    email: 'emeka@techguru.ng',
    categories: ['Laptops', 'Phones', 'Accessories'],
    badges: ['Top Seller', 'Fast Shipper'],
    operatingHours: 'Mon–Sat, 9AM–7PM',
    acceptedPayments: ['Bank Transfer', 'Paystack', 'Cash on Delivery'],
    followerCount: 40,
    socialLinks: {
      instagram: 'techguru_ng',
      twitter: 'techguru_ng',
      whatsapp: '2348012345678',
    },
    stats: {
      totalSales: 312,
      responseRate: 98,
      avgResponseTime: '< 30 min',
      repeatCustomerRate: 42,
    },
    reviews: [
      {
        id: 'r1',
        buyerName: 'Adaeze N.',
        buyerAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100',
        rating: 5,
        comment:
          'Excellent service! The laptop was exactly as described and arrived well-packaged. Emeka even helped me set it up remotely.',
        date: '2026-01-28',
        productName: 'MacBook Pro 16" M3',
      },
      {
        id: 'r2',
        buyerName: 'Tunde A.',
        rating: 5,
        comment: 'Fast delivery and genuine product. Will definitely buy again.',
        date: '2026-01-15',
        productName: 'iPhone 15 Pro Max',
      },
      {
        id: 'r3',
        buyerName: 'Chioma E.',
        buyerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100',
        rating: 4,
        comment: 'Good product, slight delay in shipping but vendor communicated well throughout.',
        date: '2025-12-20',
        productName: 'AirPods Pro 2',
      },
    ],
  },
  {
    id: 'v2',
    name: 'Comaket Official',
    businessName: 'Comaket Store',
    profilePicUrl: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200',
    description:
      'The official Comaket storefront. Every product is quality-verified, comes with guaranteed returns, and ships within 24 hours. We handle consignment and direct-purchase items with full buyer protection.',
    tagline: 'Quality verified. Buyer protected.',
    location: 'Abuja, Nigeria',
    rating: 4.9,
    reviewCount: 512,
    productCount: 120,
    joinedDate: '2024-01-01',
    isVerified: true,
    isSuperVerified: true,
    phoneNumber: '2349011223344',
    email: 'store@comaket.com',
    categories: ['Phones', 'Audio', 'Laptops', 'Accessories', 'Gaming'],
    badges: ['Official Store', 'Top Seller', 'Buyer Protection'],
    operatingHours: 'Mon–Sun, 8AM–9PM',
    acceptedPayments: ['Bank Transfer', 'Paystack', 'Cash on Delivery', 'Installments'],
    followerCount: 140000,
    socialLinks: {
      instagram: 'comaket_official',
      twitter: 'comaket_ng',
      whatsapp: '2349011223344',
      website: 'https://comaket.com',
    },
    stats: {
      totalSales: 1847,
      responseRate: 100,
      avgResponseTime: '< 15 min',
      repeatCustomerRate: 61,
    },
    reviews: [
      {
        id: 'r4',
        buyerName: 'Kunle O.',
        buyerAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100',
        rating: 5,
        comment:
          'Seamless experience from purchase to delivery. The buyer protection gave me confidence to buy a high-value item.',
        date: '2026-02-01',
        productName: 'Samsung Galaxy S24 Ultra',
      },
      {
        id: 'r5',
        buyerName: 'Amaka D.',
        rating: 5,
        comment: 'Fastest delivery I have ever experienced on any platform. Impressed!',
        date: '2026-01-22',
        productName: 'Sony WH-1000XM5',
      },
    ],
  },
  {
    id: 'v3',
    name: 'Ahmed Ibrahim',
    businessName: 'Ahmed Clearance',
    profilePicUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=1200',
    description:
      'Relocating soon — selling quality used electronics at clearance prices. Everything must go! All items tested and in working condition.',
    tagline: 'Clearance deals — everything must go',
    location: 'Kaduna, Nigeria',
    rating: 4.2,
    reviewCount: 18,
    productCount: 6,
    joinedDate: '2025-11-01',
    isVerified: false,
    phoneNumber: '2348033445566',
    categories: ['Electronics', 'Home'],
    badges: [],
    operatingHours: 'Mon–Fri, 10AM–5PM',
    acceptedPayments: ['Bank Transfer', 'Cash'],
    followerCount: 1000000,
    socialLinks: {
      whatsapp: '2348033445566',
    },
    stats: {
      totalSales: 14,
      responseRate: 85,
      avgResponseTime: '< 2 hours',
      repeatCustomerRate: 22,
    },
    reviews: [
      {
        id: 'r6',
        buyerName: 'Ibrahim M.',
        rating: 4,
        comment: 'Decent price for the condition. Honest seller.',
        date: '2025-12-18',
        productName: 'Dell Monitor 27"',
      },
    ],
  },
  {
    id: 'v4',
    name: 'Daniel Eze',
    businessName: 'LaptopPlug NG',
    profilePicUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=1200',
    description:
      'Your trusted source for UK-used and brand new laptops in Nigeria. Specializing in business-grade machines from Lenovo, Dell, and HP. Bulk discounts available for corporate buyers.',
    tagline: 'Premium laptops, honest pricing',
    location: 'Ibadan, Nigeria',
    rating: 4.6,
    reviewCount: 156,
    productCount: 78,
    joinedDate: '2024-06-20',
    isVerified: true,
    phoneNumber: '2348098765432',
    email: 'daniel@laptopplug.ng',
    categories: ['Laptops', 'Accessories'],
    badges: ['Trusted Vendor', 'Bulk Friendly'],
    operatingHours: 'Mon–Sat, 8AM–6PM',
    acceptedPayments: ['Bank Transfer', 'Paystack', 'Cash'],
    followerCount: 40,
    socialLinks: {
      instagram: 'laptopplug_ng',
      whatsapp: '2348098765432',
      website: 'https://laptopplug.ng',
    },
    stats: {
      totalSales: 523,
      responseRate: 94,
      avgResponseTime: '< 1 hour',
      repeatCustomerRate: 55,
    },
    reviews: [
      {
        id: 'r7',
        buyerName: 'Precious I.',
        buyerAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100',
        rating: 5,
        comment:
          'Got a ThinkPad for my office. Clean machine, battery was as good as described. Daniel is very professional.',
        date: '2026-01-10',
        productName: 'Lenovo ThinkPad T480',
      },
      {
        id: 'r8',
        buyerName: 'Segun B.',
        rating: 4,
        comment:
          'Great laptop. Small scratch on the lid that was not in the photos but functionality is perfect.',
        date: '2025-12-28',
        productName: 'HP EliteBook 840',
      },
      {
        id: 'r9',
        buyerName: 'Yusuf K.',
        rating: 5,
        comment:
          'Bought 5 laptops for our startup. Daniel gave us a good deal and delivered to our office.',
        date: '2025-11-15',
        productName: 'Dell Latitude 5520 (x5)',
      },
    ],
  },
  {
    id: 'v5',
    name: 'Grace Afolabi',
    businessName: 'PhoneQueen Gadgets',
    profilePicUrl: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=1200',
    description:
      'Specializing in brand new and pre-owned smartphones. All phones come unlocked, factory-reset, and with accessories. We also offer screen protector installation and phone setup at no extra cost.',
    tagline: 'Phones done right',
    location: 'Port Harcourt, Nigeria',
    rating: 4.7,
    reviewCount: 89,
    productCount: 34,
    joinedDate: '2024-09-10',
    isVerified: true,
    phoneNumber: '2348055667788',
    email: 'grace@phonequeen.ng',
    categories: ['Phones', 'Accessories'],
    badges: ['Fast Shipper'],
    operatingHours: 'Mon–Sat, 9AM–6PM',
    acceptedPayments: ['Bank Transfer', 'Paystack', 'Cash on Delivery'],
    followerCount: 18,
    socialLinks: {
      instagram: 'phonequeen_gadgets',
      whatsapp: '2348055667788',
    },
    stats: {
      totalSales: 198,
      responseRate: 96,
      avgResponseTime: '< 45 min',
      repeatCustomerRate: 38,
    },
    reviews: [
      {
        id: 'r10',
        buyerName: 'Ngozi U.',
        rating: 5,
        comment:
          'Grace is amazing! She helped me pick the right phone for my budget and even installed everything for me.',
        date: '2026-02-05',
        productName: 'Samsung Galaxy A55',
      },
    ],
  },
  {
    id: 'v6',
    name: 'Olawale Thompson',
    businessName: 'AudioVibe NG',
    profilePicUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    coverImageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=1200',
    description:
      'Everything audio — headphones, speakers, studio monitors, and DJ equipment. We carry brands like JBL, Sony, Marshall, and Audio-Technica. Test before you buy at our Lagos showroom.',
    tagline: 'Sound that moves you',
    location: 'Lagos, Nigeria',
    rating: 4.5,
    reviewCount: 67,
    productCount: 52,
    joinedDate: '2024-08-01',
    isVerified: true,
    phoneNumber: '2348077889900',
    email: 'wale@audiovibe.ng',
    categories: ['Audio', 'Accessories'],
    badges: ['Showroom Available'],
    operatingHours: 'Mon–Sat, 10AM–8PM',
    acceptedPayments: ['Bank Transfer', 'Paystack', 'Cash'],
    followerCount: 4000,
    socialLinks: {
      instagram: 'audiovibe_ng',
      twitter: 'audiovibe_ng',
      whatsapp: '2348077889900',
      website: 'https://audiovibe.ng',
    },
    stats: {
      totalSales: 245,
      responseRate: 91,
      avgResponseTime: '< 1 hour',
      repeatCustomerRate: 48,
    },
    reviews: [
      {
        id: 'r11',
        buyerName: 'Femi O.',
        buyerAvatar: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=100',
        rating: 5,
        comment:
          'Visited the showroom and tested the headphones before buying. Great experience and fair price.',
        date: '2026-01-20',
        productName: 'Sony WH-1000XM5',
      },
    ],
  },
];

export const mockComments = [
  { id: 'c1', user: 'buyer_joe', text: 'Is the price negotiable?', createdAt: '2025-12-10' },
  { id: 'c2', user: 'techguru_ng', text: 'Yes, send me a DM.', createdAt: '2025-12-10' },
  { id: 'c3', user: 'phonelover', text: 'Do you have the blue version?', createdAt: '2025-12-15' },
  { id: 'c4', user: 'audiophile_ng', text: 'Great price!', createdAt: '2025-12-22' },
  { id: 'c5', user: 'ps_fan', text: 'Does it come with any games?', createdAt: '2025-12-25' },
  {
    id: 'c6',
    user: 'gamer_exit',
    text: 'No games, just the console and controller.',
    createdAt: '2025-12-25',
  },
];

export const mockSellItems: SellItemType[] = [
  // ──────────────────────────────────────────────
  // SELF-LISTING items
  // ──────────────────────────────────────────────
  {
    id: 'sell_001',
    itemName: 'iPhone 15 Pro Max 256GB',
    description:
      'Brand new iPhone 15 Pro Max, Natural Titanium. Sealed box, purchased from Apple Store. Comes with full warranty and receipt.',
    condition: 'Brand New',
    location: 'Abuja',
    postImgUrls: [
      'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=800',
      'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800',
    ],
    askingPrice: { price: 185000000, negotiable: true },
    sellingModel: 'self-listing',
    status: 'in-review',
    listingFee: 9250000,
    feePaymentStatus: 'pending',
    createdAt: '2026-02-10T09:00:00Z',
    updatedAt: '2026-02-10T09:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },
  {
    id: 'sell_002',
    itemName: 'Samsung Galaxy S24 Ultra',
    description:
      'Uk Used Samsung Galaxy S24 Ultra, 512GB Titanium Black. Battery health 96%, minor hairline scratch on back glass. All accessories included.',
    condition: 'Uk Used',
    location: 'Kaduna',
    postImgUrls: ['https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=800'],
    askingPrice: { price: 95000000, negotiable: true },
    sellingModel: 'self-listing',
    status: 'awaiting-fee',
    listingFee: 4750000,
    feePaymentStatus: 'awaiting-payment',
    createdAt: '2026-02-06T14:30:00Z',
    updatedAt: '2026-02-08T10:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },
  {
    id: 'sell_003',
    itemName: 'MacBook Pro M3 14-inch',
    description:
      'Brand new MacBook Pro 14" with M3 chip, 16GB RAM, 512GB SSD. Space Black. Sealed in box with Apple warranty.',
    condition: 'Brand New',
    location: 'Abuja',
    postImgUrls: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=800',
    ],
    askingPrice: { price: 320000000, negotiable: false },
    sellingModel: 'self-listing',
    status: 'live',
    listingFee: 16000000,
    feePaymentStatus: 'processed',
    createdAt: '2026-01-20T08:00:00Z',
    updatedAt: '2026-01-25T12:00:00Z',
    sponsored: true,
    live: true,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [{}, {}, {}],
    comments: [{}, {}],
    bookMarks: [{}],
  },
  {
    id: 'sell_004',
    itemName: 'Bose QuietComfort Ultra',
    description:
      'Fairly used Bose QC Ultra headphones. Excellent noise cancelling. Minor wear on headband padding. Includes case and charging cable.',
    condition: 'Fairly Used',
    location: 'Kano',
    postImgUrls: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    askingPrice: { price: 25000000, negotiable: true },
    sellingModel: 'self-listing',
    status: 'rejected',
    rejectionReason:
      'Product images are blurry and do not clearly show the item condition. Please resubmit with clearer photos showing all angles of the product.',
    listingFee: 1250000,
    feePaymentStatus: 'pending',
    createdAt: '2026-02-09T16:00:00Z',
    updatedAt: '2026-02-11T09:30:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },

  // ──────────────────────────────────────────────
  // CONSIGNMENT items
  // ──────────────────────────────────────────────
  {
    id: 'sell_005',
    itemName: 'PlayStation 5 Slim Digital Edition',
    description:
      'Uk Used PS5 Slim Digital Edition. Comes with 2 DualSense controllers, charging dock, and 3 digital games. Perfect working condition.',
    condition: 'Uk Used',
    location: 'Abuja',
    postImgUrls: ['https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=800'],
    askingPrice: { price: 45000000, negotiable: false },
    sellingModel: 'consignment',
    status: 'in-review',
    consignmentCommission: 10,
    createdAt: '2026-02-12T11:00:00Z',
    updatedAt: '2026-02-12T11:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },
  {
    id: 'sell_006',
    itemName: 'DJI Mini 4 Pro Drone',
    description:
      'Brand new DJI Mini 4 Pro with Fly More Combo. Never opened, sealed. Includes extra batteries, propellers, and carrying case.',
    condition: 'Brand New',
    location: 'Kaduna',
    postImgUrls: ['https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800'],
    askingPrice: { price: 78000000, negotiable: true },
    sellingModel: 'consignment',
    status: 'awaiting-product',
    consignmentCommission: 10,
    createdAt: '2026-02-01T10:00:00Z',
    updatedAt: '2026-02-05T15:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },
  {
    id: 'sell_007',
    itemName: 'Canon EOS R6 Mark II + RF 24-105mm',
    description:
      'Fairly used Canon EOS R6 II with RF 24-105mm f/4L IS USM lens. Low shutter count (~8k). Includes camera bag, extra battery, and 128GB SD card.',
    condition: 'Fairly Used',
    location: 'Abuja',
    postImgUrls: [
      'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800',
      'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800',
    ],
    askingPrice: { price: 155000000, negotiable: true },
    sellingModel: 'consignment',
    status: 'live',
    consignmentCommission: 10,
    createdAt: '2026-01-15T07:00:00Z',
    updatedAt: '2026-01-22T13:00:00Z',
    sponsored: true,
    live: true,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [{}, {}, {}, {}],
    comments: [{}, {}, {}],
    bookMarks: [{}, {}],
  },
  {
    id: 'sell_008',
    itemName: 'Nintendo Switch OLED',
    description:
      'Uk Used Nintendo Switch OLED White. Comes with Pro Controller, dock, and 5 physical game cartridges.',
    condition: 'Uk Used',
    location: 'Kano',
    postImgUrls: ['https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=800'],
    askingPrice: { price: 28000000, negotiable: false },
    sellingModel: 'consignment',
    status: 'rejected',
    rejectionReason:
      'The product does not meet our quality standards for consignment. The screen has visible burn-in damage that was not disclosed in the description.',
    consignmentCommission: 10,
    createdAt: '2026-02-07T13:00:00Z',
    updatedAt: '2026-02-09T16:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },
  {
    id: 'sell_009',
    itemName: 'Apple Watch Ultra 2',
    description:
      'Brand new Apple Watch Ultra 2, Titanium with Orange Alpine Loop. Sealed with Apple warranty. Perfect gift.',
    condition: 'Brand New',
    location: 'Abuja',
    postImgUrls: ['https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=800'],
    askingPrice: { price: 65000000, negotiable: false },
    sellingModel: 'consignment',
    status: 'sold',
    consignmentCommission: 10,
    createdAt: '2025-12-20T09:00:00Z',
    updatedAt: '2026-01-10T11:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [{}, {}],
    comments: [{}],
    bookMarks: [{}, {}, {}],
  },

  // ──────────────────────────────────────────────
  // DIRECT SALE items
  // ──────────────────────────────────────────────
  {
    id: 'sell_010',
    itemName: 'iPad Pro M4 13-inch 256GB',
    description:
      'Fairly used iPad Pro M4, Space Black, WiFi + Cellular. Includes Apple Pencil Pro and Magic Keyboard. Minor dent on corner.',
    condition: 'Fairly Used',
    location: 'Abuja',
    postImgUrls: ['https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800'],
    askingPrice: { price: 120000000, negotiable: true },
    sellingModel: 'direct-sale',
    status: 'in-review',
    createdAt: '2026-02-13T08:00:00Z',
    updatedAt: '2026-02-13T08:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },
  {
    id: 'sell_011',
    itemName: 'Sony WH-1000XM5 Headphones',
    description:
      'Uk Used Sony XM5, Silver. Excellent condition, comes with original case, cable, and airplane adapter. Battery holds 25+ hours.',
    condition: 'Uk Used',
    location: 'Kaduna',
    postImgUrls: ['https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=800'],
    askingPrice: { price: 22000000, negotiable: true },
    sellingModel: 'direct-sale',
    status: 'price-offered',
    platformBid: 18000000,
    createdAt: '2026-02-08T10:00:00Z',
    updatedAt: '2026-02-10T14:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },
  {
    id: 'sell_012',
    itemName: 'Google Pixel 8 Pro 256GB',
    description:
      'Fairly used Pixel 8 Pro, Obsidian. Excellent camera, clean IMEI. Comes with original charger and clear case.',
    condition: 'Fairly Used',
    location: 'Abuja',
    postImgUrls: ['https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800'],
    askingPrice: { price: 48000000, negotiable: true },
    sellingModel: 'direct-sale',
    status: 'counter-offer',
    platformBid: 38000000,
    counterOffer: 44000000,
    createdAt: '2026-02-04T12:00:00Z',
    updatedAt: '2026-02-07T09:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },
  {
    id: 'sell_013',
    itemName: 'AirPods Max Silver',
    description:
      'Brand new AirPods Max, Silver with white headband. Factory sealed. International warranty included.',
    condition: 'Brand New',
    location: 'Kano',
    postImgUrls: ['https://images.unsplash.com/photo-1625245488600-f03fef636a3c?w=800'],
    askingPrice: { price: 42000000, negotiable: false },
    sellingModel: 'direct-sale',
    status: 'rejected',
    rejectionReason:
      'We are currently not purchasing this product category. Our direct buy program is focused on smartphones and laptops at this time.',
    createdAt: '2026-02-05T15:00:00Z',
    updatedAt: '2026-02-06T11:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },
  {
    id: 'sell_014',
    itemName: 'Dell XPS 15 9530',
    description:
      'Uk Used Dell XPS 15 with i7-13700H, 32GB RAM, 1TB SSD, OLED display. Excellent condition, barely used for 6 months.',
    condition: 'Uk Used',
    location: 'Abuja',
    postImgUrls: ['https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?w=800'],
    askingPrice: { price: 95000000, negotiable: true },
    sellingModel: 'direct-sale',
    status: 'sold',
    platformBid: 82000000,
    createdAt: '2026-01-10T07:00:00Z',
    updatedAt: '2026-01-18T16:00:00Z',
    sponsored: false,
    live: false,
    postUserProfile: { businessName: 'TechHub NG', userName: 'techhub', profilePicUrl: '' },
    likes: [],
    comments: [],
    bookMarks: [],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CREATOR INDUSTRIES — Physical product creation categories
// ═══════════════════════════════════════════════════════════════════════════

export interface CreatorIndustry {
  id: string;
  label: string;
  description: string;
  icon: string; // Remix icon class
  color: string; // Tailwind gradient from
}

export const CREATOR_INDUSTRIES: CreatorIndustry[] = [
  {
    id: 'fashion',
    label: 'Fashion & Apparel',
    description: 'Clothing, shoes, bags, and wearable accessories',
    icon: 'ri-t-shirt-2-line',
    color: 'from-green-500 to-green-500',
  },
  {
    id: 'jewelry',
    label: 'Jewelry & Accessories',
    description: 'Rings, necklaces, bracelets, earrings, and body jewelry',
    icon: 'ri-vip-diamond-line',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'art',
    label: 'Art & Illustration',
    description: 'Paintings, prints, sculptures, and mixed media artwork',
    icon: 'ri-palette-line',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'fragrance',
    label: 'Fragrance & Perfumery',
    description: 'Perfumes, colognes, essential oils, and scented products',
    icon: 'ri-flask-line',
    color: 'from-green-500 to-teal-600',
  },
  {
    id: 'skincare',
    label: 'Skincare & Beauty',
    description: 'Soaps, creams, serums, makeup, and beauty products',
    icon: 'ri-heart-pulse-line',
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 'haircare',
    label: 'Hair & Hair Accessories',
    description: 'Wigs, extensions, hair products, and styling accessories',
    icon: 'ri-scissors-2-line',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'leather',
    label: 'Leather & Crafted Goods',
    description: 'Wallets, belts, bags, and handcrafted leather items',
    icon: 'ri-briefcase-4-line',
    color: 'from-green-500 to-green-500',
  },
  {
    id: 'woodwork',
    label: 'Woodwork & Carpentry',
    description: 'Furniture, carvings, decor, and custom wood pieces',
    icon: 'ri-hammer-line',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'ceramics',
    label: 'Ceramics & Pottery',
    description: 'Vases, bowls, mugs, tiles, and sculptural ceramics',
    icon: 'ri-goblet-line',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'textiles',
    label: 'Textiles & Fabrics',
    description: 'Ankara, adire, kente, custom prints, and woven fabrics',
    icon: 'ri-layout-masonry-line',
    color: 'from-emerald-500 to-green-500',
  },
  {
    id: 'food',
    label: 'Food & Beverages',
    description: 'Baked goods, snacks, sauces, drinks, and packaged foods',
    icon: 'ri-cake-3-line',
    color: 'from-orange-500 to-orange-500',
  },
  {
    id: 'candles',
    label: 'Candles & Home Scents',
    description: 'Scented candles, diffusers, incense, and wax melts',
    icon: 'ri-fire-line',
    color: 'from-green-500 to-green-500',
  },
  {
    id: 'home-decor',
    label: 'Home Decor & Interiors',
    description: 'Wall art, planters, pillows, rugs, and decorative items',
    icon: 'ri-home-smile-2-line',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'stationery',
    label: 'Stationery & Paper Crafts',
    description: 'Journals, cards, prints, packaging, and paper goods',
    icon: 'ri-book-open-line',
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 'toys',
    label: 'Toys & Kids Products',
    description: "Plush toys, puzzles, baby items, and children's crafts",
    icon: 'ri-bear-smile-line',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'metalwork',
    label: 'Metalwork & Smithing',
    description: 'Iron works, brass items, knives, and metal sculptures',
    icon: 'ri-tools-line',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'beadwork',
    label: 'Beadwork & Weaving',
    description: 'Bead jewelry, baskets, mats, and woven accessories',
    icon: 'ri-rainbow-line',
    color: 'from-green-500 to-green-500',
  },
  {
    id: 'photography',
    label: 'Photography & Prints',
    description: 'Photo prints, frames, albums, and visual art products',
    icon: 'ri-camera-lens-line',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'fitness',
    label: 'Fitness & Wellness',
    description: 'Workout gear, supplements, yoga mats, and wellness tools',
    icon: 'ri-boxing-line',
    color: 'from-rose-500 to-pink-500',
  },
  {
    id: 'tech-accessories',
    label: 'Tech & Gadget Accessories',
    description: 'Phone cases, cable organizers, stands, and custom tech gear',
    icon: 'ri-smartphone-line',
    color: 'from-orange-500 to-amber-500',
  },
  {
    id: 'pet-products',
    label: 'Pet Products',
    description: 'Collars, beds, treats, toys, and pet accessories',
    icon: 'ri-empathize-line',
    color: 'from-green-500 to-teal-600',
  },
  {
    id: 'automotive',
    label: 'Automotive Accessories',
    description: 'Custom car parts, seat covers, air fresheners, and mods',
    icon: 'ri-steering-2-line',
    color: 'from-indigo-500 to-purple-500',
  },
  {
    id: 'musical',
    label: 'Musical Instruments & Gear',
    description: 'Handmade drums, guitars, shakers, and instrument accessories',
    icon: 'ri-music-2-line',
    color: 'from-green-500 to-green-500',
  },
  {
    id: 'other',
    label: 'Other',
    description: "Something unique that doesn't fit the categories above",
    icon: 'ri-sparkling-2-line',
    color: 'from-indigo-500 to-purple-500',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CREATOR PLANS
// ═══════════════════════════════════════════════════════════════════════════

export interface CreatorPlan {
  id: string;
  name: string;
  price: number; // monthly in naira, 0 = free
  priceLabel: string;
  description: string;
  badge?: string;
  features: string[];
  limits: string[];
  highlighted: boolean;
}

export const CREATOR_PLANS: CreatorPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    price: 0,
    priceLabel: 'Free',
    description: 'Get started and test the waters — no commitments.',
    features: [
      'Up to 10 product listings',
      'Basic store profile',
      'WhatsApp integration',
      'Access to marketplace',
      'Standard support',
    ],
    limits: ['5% transaction fee', 'No featured works', 'No analytics'],
    highlighted: false,
  },
  {
    id: 'pro',
    name: 'Pro',
    price: 300000, // ₦3,000 in kobo
    priceLabel: '₦3,000/mo',
    description: 'For serious creators ready to grow their brand.',
    badge: 'Most Popular',
    features: [
      'Unlimited product listings',
      'Featured Works showcase',
      'Seller analytics & insights',
      'Verified badge eligibility',
      'Priority in search results',
      'Custom store branding',
      'Priority support',
    ],
    limits: ['3% transaction fee'],
    highlighted: true,
  },
  {
    id: 'business',
    name: 'Business',
    price: 800000, // ₦8,000 in kobo
    priceLabel: '₦8,000/mo',
    description: 'For established brands and high-volume sellers.',
    badge: 'Best Value',
    features: [
      'Everything in Pro',
      'Multiple store support',
      'Bulk listing tools',
      'Dedicated account manager',
      'API access',
      'Custom domain support',
      'Super Verified badge',
      'Featured homepage placement',
    ],
    limits: ['1.5% transaction fee'],
    highlighted: false,
  },
];
