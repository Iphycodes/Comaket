'use client';

import React, { useState } from 'react';
import { Tabs, Tooltip, Input, Select, message as antMessage, Modal } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Star,
  Package,
  Clock,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Users,
  Award,
  Calendar,
  CreditCard,
  ExternalLink,
  Edit3,
  ShoppingBag,
  Bookmark,
  ClipboardList,
  X,
  Eye,
  EyeOff,
  ChevronRight,
  Truck,
  RotateCcw,
  CheckCircle,
  XCircle,
  Timer,
  Save,
  Sparkles,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { mockMarketItems, Currencies } from '@grc/_shared/constant';
import { numberFormat } from '@grc/_shared/helpers';
import { formatJoinDate, getRatingLabel, VendorReview } from '@grc/_shared/namespace/vendor';
import SellItem from '../sell-item';
import SavedItems from '../saved';
import FeaturedWorks from '../featured-works';

const { TextArea } = Input;

// ═══════════════════════════════════════════════════════════════════════════
// MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

interface UserProfile {
  name: string;
  businessName: string;
  profilePicUrl: string;
  coverImageUrl: string;
  tagline: string;
  description: string;
  location: string;
  joinedDate: string;
  isVerified: boolean;
  isSuperVerified: boolean;
  followerCount: number;
  productCount: number;
  rating: number;
  categories: string[];
  operatingHours: string;
  acceptedPayments: string[];
  phoneNumber: string;
  whatsappNumber: string;
  email: string;
  socialLinks: {
    instagram?: string;
    twitter?: string;
    website?: string;
  };
  badges: string[];
  // Visibility settings for public profile
  showPhone: boolean;
  showWhatsApp: boolean;
  showEmail: boolean;
  showWebsite: boolean;
}

const mockUserProfile: UserProfile = {
  name: 'Emmanuel Okafor',
  businessName: 'EmTech Store',
  profilePicUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  coverImageUrl: 'https://images.unsplash.com/photo-1557683316-973673baf926?w=1200&h=400&fit=crop',
  tagline: 'Quality gadgets at the best prices',
  description:
    'EmTech Store is your trusted source for premium electronics and gadgets in Nigeria. We specialize in brand new and UK-used phones, laptops, and accessories. With years of experience in the tech market, we guarantee authenticity and competitive pricing on every item.',
  location: 'Kaduna, Nigeria',
  joinedDate: '2023-06-15T00:00:00Z',
  isVerified: true,
  isSuperVerified: false,
  followerCount: 342,
  productCount: 28,
  rating: 4.6,
  categories: ['Electronics', 'Phones', 'Laptops', 'Accessories'],
  operatingHours: 'Mon–Sat, 9:00 AM – 7:00 PM',
  acceptedPayments: ['Bank Transfer', 'Card Payment', 'Cash on Delivery'],
  phoneNumber: '2348012345678',
  whatsappNumber: '2348012345678',
  email: 'emtech.store@gmail.com',
  socialLinks: {
    instagram: 'emtechstore',
    twitter: 'emtechstore',
    website: 'https://emtechstore.com',
  },
  badges: ['Top Seller', 'Fast Responder'],
  showPhone: true,
  showWhatsApp: true,
  showEmail: true,
  showWebsite: true,
};

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

interface OrderItem {
  id: string;
  itemName: string;
  image: string;
  price: number; // kobo
  quantity: number;
  condition: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number; // kobo
  paymentMethod: string;
  deliveryAddress: string;
  trackingNumber?: string;
  estimatedDelivery?: string;
  notes?: string;
}

const mockOrders: Order[] = [
  {
    id: 'ord-1',
    orderNumber: 'CMK-2025-0847',
    date: '2025-02-10T14:30:00Z',
    items: [
      {
        id: 'oi-1',
        itemName: 'iPhone 15 Pro Max 256GB',
        image: mockMarketItems[0]?.media?.[0]?.url || '',
        price: 95000000,
        quantity: 1,
        condition: 'Brand New',
      },
    ],
    status: 'delivered',
    totalAmount: 95000000,
    paymentMethod: 'Card Payment',
    deliveryAddress: '12 Ahmadu Bello Way, Kaduna',
    trackingNumber: 'NGP-2025-847291',
    estimatedDelivery: '2025-02-14',
  },
  {
    id: 'ord-2',
    orderNumber: 'CMK-2025-0903',
    date: '2025-02-12T09:15:00Z',
    items: [
      {
        id: 'oi-2',
        itemName: 'MacBook Air M2 13"',
        image: mockMarketItems[1]?.media?.[0]?.url || '',
        price: 72000000,
        quantity: 1,
        condition: 'Uk Used',
      },
      {
        id: 'oi-3',
        itemName: 'USB-C Hub Adapter',
        image: mockMarketItems[2]?.media?.[0]?.url || '',
        price: 1500000,
        quantity: 2,
        condition: 'Brand New',
      },
    ],
    status: 'shipped',
    totalAmount: 75000000,
    paymentMethod: 'Bank Transfer',
    deliveryAddress: '12 Ahmadu Bello Way, Kaduna',
    trackingNumber: 'NGP-2025-903142',
    estimatedDelivery: '2025-02-16',
  },
  {
    id: 'ord-3',
    orderNumber: 'CMK-2025-0956',
    date: '2025-02-14T16:45:00Z',
    items: [
      {
        id: 'oi-4',
        itemName: 'Samsung Galaxy S24 Ultra',
        image: mockMarketItems[3]?.media?.[0]?.url || '',
        price: 85000000,
        quantity: 1,
        condition: 'Brand New',
      },
    ],
    status: 'processing',
    totalAmount: 85000000,
    paymentMethod: 'Card Payment',
    deliveryAddress: '12 Ahmadu Bello Way, Kaduna',
  },
  {
    id: 'ord-4',
    orderNumber: 'CMK-2025-0712',
    date: '2025-01-28T11:00:00Z',
    items: [
      {
        id: 'oi-5',
        itemName: 'AirPods Pro 2nd Gen',
        image: mockMarketItems[4]?.media?.[0]?.url || '',
        price: 18000000,
        quantity: 1,
        condition: 'Brand New',
      },
    ],
    status: 'cancelled',
    totalAmount: 18000000,
    paymentMethod: 'Card Payment',
    deliveryAddress: '12 Ahmadu Bello Way, Kaduna',
    notes: 'Cancelled by buyer — found a better deal',
  },
  {
    id: 'ord-5',
    orderNumber: 'CMK-2025-0621',
    date: '2025-01-20T08:30:00Z',
    items: [
      {
        id: 'oi-6',
        itemName: 'JBL Charge 5 Speaker',
        image: mockMarketItems[5]?.media?.[0]?.url || '',
        price: 12000000,
        quantity: 1,
        condition: 'Uk Used',
      },
    ],
    status: 'returned',
    totalAmount: 12000000,
    paymentMethod: 'Bank Transfer',
    deliveryAddress: '12 Ahmadu Bello Way, Kaduna',
    notes: 'Returned — item did not match description',
  },
  {
    id: 'ord-6',
    orderNumber: 'CMK-2025-1001',
    date: '2025-02-15T10:00:00Z',
    items: [
      {
        id: 'oi-7',
        itemName: 'Sony WH-1000XM5 Headphones',
        image: mockMarketItems[0]?.media?.[0]?.url || '',
        price: 32000000,
        quantity: 1,
        condition: 'Brand New',
      },
    ],
    status: 'pending',
    totalAmount: 32000000,
    paymentMethod: 'Cash on Delivery',
    deliveryAddress: '12 Ahmadu Bello Way, Kaduna',
  },
];

const mockReviews: VendorReview[] = [
  {
    id: 'r1',
    buyerName: 'Ada Nwosu',
    buyerAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
    rating: 5,
    comment:
      'Excellent seller! The phone arrived in perfect condition and exactly as described. Fast delivery too.',
    date: '2025-02-08T10:00:00Z',
    productName: 'iPhone 15 Pro Max',
  },
  {
    id: 'r2',
    buyerName: 'Chidi Eze',
    rating: 4,
    comment:
      'Good product quality. Delivery took a bit longer than expected but the item was great.',
    date: '2025-01-25T14:30:00Z',
    productName: 'MacBook Air M2',
  },
  {
    id: 'r3',
    buyerName: 'Fatima Bello',
    buyerAvatar:
      'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop',
    rating: 5,
    comment:
      'One of the best vendors on the platform. Very responsive and honest about product condition.',
    date: '2025-01-18T09:15:00Z',
  },
  {
    id: 'r4',
    buyerName: 'Obinna Obi',
    rating: 4,
    comment: 'Solid experience. Would buy from this store again. Packaging was very secure.',
    date: '2025-01-10T16:00:00Z',
    productName: 'Galaxy S24 Ultra',
  },
  {
    id: 'r5',
    buyerName: 'Hauwa Suleiman',
    rating: 3,
    comment:
      'Product was okay but had minor scratches not mentioned in the listing. Seller offered partial refund though.',
    date: '2024-12-28T11:00:00Z',
    productName: 'AirPods Pro',
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// ─── Star Rating ──────────────────────────────────────────────────────────

const StarRating: React.FC<{ rating: number; size?: number }> = ({ rating, size = 14 }) => {
  const fullStars = Math.floor(rating);
  const hasHalf = rating - fullStars >= 0.3;

  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: 5 }).map((_, i) => (
        <Star
          key={i}
          size={size}
          className={
            i < fullStars
              ? 'text-amber-400 fill-amber-400'
              : i === fullStars && hasHalf
                ? 'text-amber-400 fill-amber-400/50'
                : 'text-gray-200 dark:text-gray-700'
          }
        />
      ))}
    </div>
  );
};

// ─── Verified Badge ───────────────────────────────────────────────────────

const VerifiedBadge: React.FC<{ isSuper?: boolean }> = ({ isSuper = false }) => (
  <i
    className={`ri-verified-badge-fill ${
      isSuper ? 'text-[#D4A017]' : 'text-[#1D9BF0]'
    } text-[20px]`}
  />
);

// ─── Rating Breakdown ─────────────────────────────────────────────────────

const RatingBreakdown: React.FC<{ reviews: VendorReview[] }> = ({ reviews }) => {
  const counts = [5, 4, 3, 2, 1].map((star) => ({
    star,
    count: reviews.filter((r) => Math.floor(r.rating) === star).length,
  }));
  const total = reviews.length;

  return (
    <div className="space-y-1.5">
      {counts.map(({ star, count }) => (
        <div key={star} className="flex items-center gap-2.5">
          <span className="text-xs text-gray-500 w-3 text-right">{star}</span>
          <Star size={11} className="text-amber-400 fill-amber-400" />
          <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-amber-400 rounded-full transition-all duration-500"
              style={{ width: total > 0 ? `${(count / total) * 100}%` : '0%' }}
            />
          </div>
          <span className="text-[11px] text-gray-400 w-6 text-right">{count}</span>
        </div>
      ))}
    </div>
  );
};

// ─── Review Card ──────────────────────────────────────────────────────────

const ReviewCard: React.FC<{ review: VendorReview; index: number }> = ({ review, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay: index * 0.05 }}
    className="bg-white dark:bg-gray-800/60 rounded-xl p-4 border border-gray-100 dark:border-gray-700/50"
  >
    <div className="flex items-start gap-3">
      {review.buyerAvatar ? (
        <img
          src={review.buyerAvatar}
          alt={review.buyerName}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0"
        />
      ) : (
        <div className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center flex-shrink-0">
          <span className="text-xs font-bold text-gray-500 dark:text-gray-400">
            {review.buyerName.charAt(0)}
          </span>
        </div>
      )}

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-semibold text-gray-900 dark:text-white">
            {review.buyerName}
          </span>
          <span className="text-[11px] text-gray-400 flex-shrink-0">
            {new Date(review.date).toLocaleDateString('en-NG', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
        </div>

        <div className="flex items-center gap-2 mt-0.5">
          <StarRating rating={review.rating} size={12} />
          {review.productName && (
            <>
              <span className="text-gray-300 dark:text-gray-600">·</span>
              <span className="text-[11px] text-gray-400 truncate">{review.productName}</span>
            </>
          )}
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 leading-relaxed">
          {review.comment}
        </p>
      </div>
    </div>
  </motion.div>
);

// ─── Order Status Helpers ─────────────────────────────────────────────────

const orderStatusConfig: Record<
  OrderStatus,
  { label: string; color: string; bg: string; icon: React.ReactNode }
> = {
  pending: {
    label: 'Pending',
    color: 'text-amber-600 dark:text-amber-400',
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    icon: <Timer size={14} />,
  },
  processing: {
    label: 'Processing',
    color: 'text-blue dark:text-blue',
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    icon: <Package size={14} />,
  },
  shipped: {
    label: 'Shipped',
    color: 'text-indigo-600 dark:text-indigo-400',
    bg: 'bg-indigo-50 dark:bg-indigo-900/20',
    icon: <Truck size={14} />,
  },
  delivered: {
    label: 'Delivered',
    color: 'text-emerald-600 dark:text-emerald-400',
    bg: 'bg-emerald-50 dark:bg-emerald-900/20',
    icon: <CheckCircle size={14} />,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'text-red-600 dark:text-red-400',
    bg: 'bg-red-50 dark:bg-red-900/20',
    icon: <XCircle size={14} />,
  },
  returned: {
    label: 'Returned',
    color: 'text-gray-600 dark:text-gray-400',
    bg: 'bg-gray-100 dark:bg-gray-800',
    icon: <RotateCcw size={14} />,
  },
};

// ─── Mobile Full-Screen Overlay ───────────────────────────────────────────

interface MobileOverlayProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  zIndex?: number;
  children: React.ReactNode;
}

const MobileOverlay: React.FC<MobileOverlayProps> = ({
  open,
  onClose,
  title,
  zIndex = 200,
  children,
}) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ type: 'spring', damping: 28, stiffness: 300 }}
          className={`fixed inset-0 bg-white dark:bg-gray-900 flex flex-col overflow-hidden ${
            isMobile ? 'pt-10' : ''
          }`}
          style={{ zIndex }}
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0 bg-white dark:bg-gray-900">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">{title || 'Back'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={16} className="text-gray-500" />
            </button>
          </div>
          <div className="flex-1 overflow-y-auto">{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// ─── Order Detail View ────────────────────────────────────────────────────

const OrderDetailView: React.FC<{ order: Order }> = ({ order }) => {
  const cfg = orderStatusConfig[order.status];

  return (
    <div className="p-5 space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{order.orderNumber}</h2>
          <p className="text-xs text-gray-400 mt-0.5">
            {new Date(order.date).toLocaleDateString('en-NG', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.color} ${cfg.bg}`}
        >
          {cfg.icon}
          {cfg.label}
        </span>
      </div>

      {/* Items */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl overflow-hidden">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            Items ({order.items.length})
          </h3>
        </div>
        <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
          {order.items.map((item) => (
            <div key={item.id} className="flex items-center gap-3 p-4">
              <div className="w-14 h-14 rounded-lg bg-gray-200 dark:bg-gray-700 overflow-hidden flex-shrink-0">
                {item.image && (
                  <img
                    src={item.image}
                    alt={item.itemName}
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-gray-900 dark:text-white truncate">
                  {item.itemName}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs text-gray-400">{item.condition}</span>
                  <span className="text-gray-300 dark:text-gray-600">·</span>
                  <span className="text-xs text-gray-400">Qty: {item.quantity}</span>
                </div>
              </div>
              <span className="text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">
                {numberFormat(item.price / 100, Currencies.NGN)}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment Method</span>
          <span className="font-medium text-gray-900 dark:text-white">{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Delivery Address</span>
          <span className="font-medium text-gray-900 dark:text-white text-right max-w-[60%]">
            {order.deliveryAddress}
          </span>
        </div>
        {order.trackingNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tracking Number</span>
            <span className="font-medium text-blue">{order.trackingNumber}</span>
          </div>
        )}
        {order.estimatedDelivery && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Est. Delivery</span>
            <span className="font-medium text-gray-900 dark:text-white">
              {new Date(order.estimatedDelivery).toLocaleDateString('en-NG', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between text-sm">
            <span className="text-gray-900 dark:text-white font-semibold">Total</span>
            <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              {numberFormat(order.totalAmount / 100, Currencies.NGN)}
            </span>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-amber-50 dark:bg-amber-900/10 rounded-xl p-4 border border-amber-100 dark:border-amber-800/30">
          <p className="text-sm text-amber-700 dark:text-amber-300">
            <strong>Note:</strong> {order.notes}
          </p>
        </div>
      )}
    </div>
  );
};

// ─── Edit About Form ──────────────────────────────────────────────────────

interface EditAboutFormProps {
  profile: UserProfile;
  onSave: (updated: Partial<UserProfile>) => void;
  onCancel: () => void;
}

const categoryOptions = [
  'Electronics',
  'Phones',
  'Laptops',
  'Accessories',
  'Fashion',
  'Clothing',
  'Shoes',
  'Bags',
  'Home & Garden',
  'Appliances',
  'Gaming',
  'Auto Parts',
  'Beauty',
  'Health',
  'Books',
  'Sports',
  'Kids & Baby',
  'Food & Drinks',
];

const paymentOptions = [
  'Bank Transfer',
  'Card Payment',
  'Cash on Delivery',
  'USSD',
  'Mobile Money',
];

const EditAboutForm: React.FC<EditAboutFormProps> = ({ profile, onSave, onCancel }) => {
  const [description, setDescription] = useState(profile.description);
  const [tagline, setTagline] = useState(profile.tagline);
  const [categories, setCategories] = useState<string[]>(profile.categories);
  const [operatingHours, setOperatingHours] = useState(profile.operatingHours);
  const [acceptedPayments, setAcceptedPayments] = useState<string[]>(profile.acceptedPayments);
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber);
  const [whatsappNumber, setWhatsappNumber] = useState(profile.whatsappNumber);
  const [email, setEmail] = useState(profile.email);
  const [instagram, setInstagram] = useState(profile.socialLinks?.instagram || '');
  const [twitter, setTwitter] = useState(profile.socialLinks?.twitter || '');
  const [website, setWebsite] = useState(profile.socialLinks?.website || '');
  const [showPhone, setShowPhone] = useState(profile.showPhone);
  const [showWhatsApp, setShowWhatsApp] = useState(profile.showWhatsApp);
  const [showEmail, setShowEmail] = useState(profile.showEmail);
  const [showWebsite, setShowWebsite] = useState(profile.showWebsite);

  const handleSave = () => {
    onSave({
      description,
      tagline,
      categories,
      operatingHours,
      acceptedPayments,
      phoneNumber,
      whatsappNumber,
      email,
      socialLinks: { instagram, twitter, website },
      showPhone,
      showWhatsApp,
      showEmail,
      showWebsite,
    });
  };

  const VisibilityToggle: React.FC<{
    visible: boolean;
    onToggle: () => void;
    label: string;
  }> = ({ visible, onToggle }) => (
    <button
      type="button"
      onClick={onToggle}
      className={`flex items-center gap-1 px-2 py-1 rounded-md text-[11px] font-medium transition-colors ${
        visible
          ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400'
          : 'bg-gray-100 dark:bg-gray-700 text-gray-400'
      }`}
    >
      {visible ? <Eye size={11} /> : <EyeOff size={11} />}
      {visible ? 'Visible' : 'Hidden'}
    </button>
  );

  return (
    <div className="p-5 space-y-6 pb-16">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Edit Profile Info</h2>
        <p className="text-sm text-gray-400">Update your profile details visible to buyers</p>
      </div>

      {/* Tagline */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
          Tagline
        </label>
        <Input
          value={tagline}
          onChange={(e) => setTagline(e.target.value)}
          placeholder="A short tagline for your store"
          maxLength={80}
          showCount
          className="!rounded-lg h-11"
        />
      </div>

      {/* Description */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
          Description
        </label>
        <TextArea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Tell buyers about your store..."
          rows={4}
          maxLength={500}
          showCount
          className="!rounded-lg resize-none"
        />
      </div>

      {/* Categories */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
          Categories
        </label>
        <Select
          mode="multiple"
          value={categories}
          onChange={setCategories}
          placeholder="Select categories"
          className="w-full [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!min-h-[44px]"
          options={categoryOptions.map((c) => ({ label: c, value: c }))}
          maxTagCount={6}
        />
        <p className="text-[11px] text-gray-400 mt-1">Up to 6 categories</p>
      </div>

      {/* Operating Hours */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
          Operating Hours
        </label>
        <Input
          value={operatingHours}
          onChange={(e) => setOperatingHours(e.target.value)}
          placeholder="e.g. Mon–Sat, 9:00 AM – 7:00 PM"
          className="!rounded-lg h-11"
        />
      </div>

      {/* Accepted Payments */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
          Accepted Payments
        </label>
        <Select
          mode="multiple"
          value={acceptedPayments}
          onChange={setAcceptedPayments}
          placeholder="Select payment methods"
          className="w-full [&_.ant-select-selector]:!rounded-lg [&_.ant-select-selector]:!min-h-[44px]"
          options={paymentOptions.map((p) => ({ label: p, value: p }))}
        />
      </div>

      {/* Divider — Contact & Socials */}
      <div className="border-t border-gray-200 dark:border-gray-700 pt-5">
        <h3 className="text-sm font-bold text-gray-900 dark:text-white mb-4">
          Contact & Social Links
        </h3>
        <p className="text-xs text-gray-400 mb-4">
          Toggle visibility to control what buyers see on your public profile
        </p>

        {/* Phone */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Phone</label>
              <VisibilityToggle
                visible={showPhone}
                onToggle={() => setShowPhone(!showPhone)}
                label="phone"
              />
            </div>
            <Input
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              placeholder="e.g. 2348012345678"
              prefix={<Phone size={14} className="text-gray-400" />}
              className="!rounded-lg h-11"
            />
          </div>

          {/* WhatsApp */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                WhatsApp
              </label>
              <VisibilityToggle
                visible={showWhatsApp}
                onToggle={() => setShowWhatsApp(!showWhatsApp)}
                label="whatsapp"
              />
            </div>
            <Input
              value={whatsappNumber}
              onChange={(e) => setWhatsappNumber(e.target.value)}
              placeholder="e.g. 2348012345678"
              prefix={<MessageCircle size={14} className="text-gray-400" />}
              className="!rounded-lg h-11"
            />
          </div>

          {/* Email */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">Email</label>
              <VisibilityToggle
                visible={showEmail}
                onToggle={() => setShowEmail(!showEmail)}
                label="email"
              />
            </div>
            <Input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="email@example.com"
              prefix={<Mail size={14} className="text-gray-400" />}
              className="!rounded-lg h-11"
            />
          </div>

          {/* Website */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Website
              </label>
              <VisibilityToggle
                visible={showWebsite}
                onToggle={() => setShowWebsite(!showWebsite)}
                label="website"
              />
            </div>
            <Input
              value={website}
              onChange={(e) => setWebsite(e.target.value)}
              placeholder="https://yoursite.com"
              prefix={<Globe size={14} className="text-gray-400" />}
              className="!rounded-lg h-11"
            />
          </div>

          {/* Instagram */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
              Instagram
            </label>
            <Input
              value={instagram}
              onChange={(e) => setInstagram(e.target.value)}
              placeholder="username (without @)"
              prefix={<span className="text-gray-400 text-sm">@</span>}
              className="!rounded-lg h-11"
            />
          </div>

          {/* Twitter / X */}
          <div>
            <label className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1.5 block">
              Twitter / X
            </label>
            <Input
              value={twitter}
              onChange={(e) => setTwitter(e.target.value)}
              placeholder="username (without @)"
              prefix={<span className="text-gray-400 text-sm">@</span>}
              className="!rounded-lg h-11"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-2 pb-6">
        <button
          onClick={onCancel}
          className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors border border-gray-200 dark:border-gray-700"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="flex-1 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white shadow-md shadow-blue/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
        >
          <Save size={16} />
          Save Changes
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN PROFILE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const Profile = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  // Profile state
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [reviews] = useState<VendorReview[]>(mockReviews);
  const [orders] = useState<Order[]>(mockOrders);

  // Edit about
  const [isEditAboutOpen, setIsEditAboutOpen] = useState(false);

  // Order detail
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  // Computed rating
  const computedRating =
    reviews.length > 0
      ? Math.round((reviews.reduce((s, r) => s + r.rating, 0) / reviews.length) * 10) / 10
      : profile.rating;

  // ── Handlers ────────────────────────────────────────────────────────

  const handleSaveAbout = (updated: Partial<UserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    setIsEditAboutOpen(false);
    antMessage.success('Profile updated!');
  };

  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsOrderDetailOpen(true);
  };

  const handleCloseOrderDetail = () => {
    setIsOrderDetailOpen(false);
    setSelectedOrder(null);
  };

  // ── Orders Tab Content ──────────────────────────────────────────────

  const renderOrdersTab = () => {
    if (orders.length === 0) {
      return (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
          <ShoppingBag size={36} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet</p>
          <p className="text-xs text-gray-400 mt-1">
            When you purchase items, your orders will appear here.
          </p>
        </div>
      );
    }

    return (
      <div className="space-y-3">
        {orders.map((order) => {
          const cfg = orderStatusConfig[order.status];
          return (
            <motion.div
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => handleViewOrder(order)}
              className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 cursor-pointer hover:shadow-md hover:border-gray-200 dark:hover:border-gray-600 transition-all group"
            >
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="text-sm font-bold text-gray-900 dark:text-white">
                    {order.orderNumber}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">
                    {new Date(order.date).toLocaleDateString('en-NG', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${cfg.color} ${cfg.bg}`}
                  >
                    {cfg.icon}
                    {cfg.label}
                  </span>
                  <ChevronRight
                    size={16}
                    className="text-gray-300 dark:text-gray-600 group-hover:text-gray-500 transition-colors"
                  />
                </div>
              </div>

              {/* Items preview */}
              <div className="flex items-center gap-2">
                <div className="flex -space-x-2">
                  {order.items.slice(0, 3).map((item, idx) => (
                    <div
                      key={item.id}
                      className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 overflow-hidden"
                      style={{ zIndex: 3 - idx }}
                    >
                      {item.image && (
                        <img src={item.image} alt="" className="w-full h-full object-cover" />
                      )}
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <div className="w-10 h-10 rounded-lg bg-gray-100 dark:bg-gray-700 border-2 border-white dark:border-gray-800 flex items-center justify-center text-[10px] font-bold text-gray-500">
                      +{order.items.length - 3}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs text-gray-500 truncate">
                    {order.items.map((i) => i.itemName).join(', ')}
                  </p>
                </div>
                <span className="text-sm font-bold text-gray-900 dark:text-white flex-shrink-0">
                  {numberFormat(order.totalAmount / 100, Currencies.NGN)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    );
  };

  // ── Reviews Tab Content ─────────────────────────────────────────────

  const renderReviewsTab = () => {
    if (reviews.length === 0) {
      return (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
          <Star size={36} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No reviews yet</p>
          <p className="text-xs text-gray-400 mt-1">
            Reviews from buyers will appear here once you start selling.
          </p>
        </div>
      );
    }

    return (
      <div className={`${isMobile ? '' : 'grid grid-cols-3 gap-6'}`}>
        <div className="col-span-1 mb-6 sm:mb-0">
          <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50 sticky top-4">
            <div className="text-center mb-4">
              <p className="text-4xl font-bold text-gray-900 dark:text-white">{computedRating}</p>
              <StarRating rating={computedRating} size={16} />
              <p className="text-xs text-gray-400 mt-1.5">
                {getRatingLabel(computedRating)} · {reviews.length} review
                {reviews.length !== 1 ? 's' : ''}
              </p>
            </div>
            <RatingBreakdown reviews={reviews} />
          </div>
        </div>
        <div className="col-span-2 space-y-3">
          {reviews.map((review, i) => (
            <ReviewCard key={review.id} review={review} index={i} />
          ))}
        </div>
      </div>
    );
  };

  // ── About Tab Content ───────────────────────────────────────────────

  const renderAboutTab = () => (
    <div className="space-y-5">
      {/* Edit button */}
      <div className="flex justify-end">
        <button
          onClick={() => setIsEditAboutOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all"
        >
          <Edit3 size={14} />
          Edit Info
        </button>
      </div>

      {/* Description */}
      <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          About {profile.businessName}
        </h3>
        {profile.description ? (
          <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            {profile.description}
          </p>
        ) : (
          <p className="text-sm text-gray-400 italic">No description yet — tap Edit to add one.</p>
        )}
      </div>

      {/* Categories */}
      <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Categories
        </h3>
        {profile.categories.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {profile.categories.map((cat) => (
              <span
                key={cat}
                className="px-3 py-1.5 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm font-medium text-gray-600 dark:text-gray-300"
              >
                {cat}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-400 italic">No categories added yet.</p>
        )}
      </div>

      {/* Operating Hours & Payments */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Operating Hours
          </h3>
          {profile.operatingHours ? (
            <div className="flex items-center gap-2">
              <Clock size={16} className="text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {profile.operatingHours}
              </span>
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">Not set</p>
          )}
        </div>

        <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Accepted Payments
          </h3>
          {profile.acceptedPayments.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {profile.acceptedPayments.map((pm) => (
                <span
                  key={pm}
                  className="flex items-center gap-1 px-2.5 py-1 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-xs font-medium text-gray-600 dark:text-gray-300"
                >
                  <CreditCard size={12} className="text-gray-400" />
                  {pm}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-400 italic">No payment methods added.</p>
          )}
        </div>
      </div>

      {/* Contact Info (what's visible on public profile) */}
      <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
          Public Contact Info
        </h3>
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {profile.phoneNumber || 'Not set'}
              </span>
            </div>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                profile.showPhone
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
              }`}
            >
              {profile.showPhone ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                WhatsApp: {profile.whatsappNumber || 'Not set'}
              </span>
            </div>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                profile.showWhatsApp
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
              }`}
            >
              {profile.showWhatsApp ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Mail size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {profile.email || 'Not set'}
              </span>
            </div>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                profile.showEmail
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
              }`}
            >
              {profile.showEmail ? 'Visible' : 'Hidden'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Globe size={14} className="text-gray-400" />
              <span className="text-sm text-gray-700 dark:text-gray-300">
                {profile.socialLinks?.website || 'Not set'}
              </span>
            </div>
            <span
              className={`text-[11px] font-medium px-2 py-0.5 rounded-full ${
                profile.showWebsite
                  ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/20 dark:text-emerald-400'
                  : 'bg-gray-100 text-gray-400 dark:bg-gray-700'
              }`}
            >
              {profile.showWebsite ? 'Visible' : 'Hidden'}
            </span>
          </div>
        </div>
      </div>

      {/* Social Links */}
      {(profile.socialLinks?.instagram || profile.socialLinks?.twitter) && (
        <div className="bg-white dark:bg-gray-800/60 rounded-xl p-5 border border-gray-100 dark:border-gray-700/50">
          <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">
            Social Links
          </h3>
          <div className="flex flex-wrap gap-3">
            {profile.socialLinks.instagram && (
              <a
                href={`https://instagram.com/${profile.socialLinks.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg text-sm font-medium text-purple-700 dark:text-purple-300 hover:shadow-sm transition-all"
              >
                <i className="ri-instagram-line text-base" />@{profile.socialLinks.instagram}
              </a>
            )}
            {profile.socialLinks.twitter && (
              <a
                href={`https://x.com/${profile.socialLinks.twitter}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-gray-50 dark:bg-gray-700/50 rounded-lg text-sm font-medium text-gray-700 dark:text-gray-300 hover:shadow-sm transition-all"
              >
                <i className="ri-twitter-x-line text-base" />@{profile.socialLinks.twitter}
              </a>
            )}
            {profile.socialLinks.website && profile.showWebsite && (
              <a
                href={profile.socialLinks.website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-3 py-2 bg-indigo-50 dark:bg-blue-900/20 rounded-lg text-sm font-medium text-blue dark:text-blue hover:shadow-sm transition-all"
              >
                <Globe size={14} />
                {profile.socialLinks.website.replace('https://', '')}
                <ExternalLink size={12} />
              </a>
            )}
          </div>
        </div>
      )}
    </div>
  );

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════

  return (
    <div
      className={`dark:bg-gray-900/50 min-h-screen ${isMobile ? 'max-w-[100vw] mb-14 pt-8' : ''}`}
    >
      <div className={`w-full ${!isMobile ? 'mx-auto px-4' : ''}`}>
        {/* ── Cover Image ────────────────────────────────────────────── */}
        <div className="relative h-44 sm:h-56 bg-gradient-to-br from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900 overflow-hidden sm:rounded-b-2xl">
          {profile.coverImageUrl && (
            <img
              src={profile.coverImageUrl}
              alt=""
              className="w-full h-full object-cover opacity-70 dark:opacity-40"
            />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />

          {profile.badges && profile.badges.length > 0 && (
            <div className="absolute bottom-4 right-4 flex gap-1.5 flex-wrap justify-end">
              {profile.badges.map((badge) => (
                <span
                  key={badge}
                  className="flex items-center gap-1 px-2.5 py-1 bg-white/90 dark:bg-gray-900/80 backdrop-blur-sm rounded-full text-[11px] font-semibold text-gray-700 dark:text-gray-300 shadow-sm"
                >
                  <Award size={11} className="text-amber-500" />
                  {badge}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* ── Profile Header ─────────────────────────────────────────── */}
        <div className={`${isMobile ? 'px-4' : ''} -mt-24 relative z-10`}>
          <div className="flex items-end justify-between gap-4">
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 border-white dark:border-gray-900 overflow-hidden shadow-lg bg-gray-200 dark:bg-gray-700 flex-shrink-0">
              <img
                src={profile.profilePicUrl}
                alt={profile.businessName}
                className="w-full h-full object-cover"
              />
            </div>
            {/* Edit Profile Button (instead of Follow) */}
            <div className="pb-2">
              <button
                onClick={() => setIsEditAboutOpen(true)}
                className={`flex items-center rounded-xl text-sm font-semibold bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all ${
                  isMobile ? 'text-sm gap-1 px-3 py-1.5' : 'gap-2 px-5 py-2.5'
                }`}
              >
                <Edit3 size={16} />
                Edit Profile
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4 mt-3 flex-wrap">
            <div className="flex-1 min-w-0 pb-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
                  {profile.businessName}
                </h1>
                {profile.isVerified && (
                  <Tooltip title={profile.isSuperVerified ? 'Super Verified' : 'Verified'}>
                    <VerifiedBadge isSuper={profile.isSuperVerified} />
                  </Tooltip>
                )}
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                {profile.name}
                {profile.tagline && (
                  <>
                    <span className="mx-1.5 text-gray-300 dark:text-gray-600">·</span>
                    <span className="italic">{profile.tagline}</span>
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center gap-4 mt-1 text-sm text-gray-500">
            <span>
              <strong className="text-gray-900 dark:text-white">
                {profile.followerCount.toLocaleString()}
              </strong>{' '}
              followers
            </span>
            <span>
              <strong className="text-gray-900 dark:text-white">{profile.productCount}</strong>{' '}
              products
            </span>
            <span>
              <strong className="text-gray-900 dark:text-white">{reviews.length}</strong> reviews
            </span>
          </div>

          {/* Location & Meta */}
          <div className="mt-3">
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <MapPin size={14} className="text-gray-400" />
              {profile.location}
            </span>
            <span className="flex items-center gap-1.5 text-sm text-gray-500">
              <Calendar size={14} className="text-gray-400" />
              Joined {formatJoinDate(profile.joinedDate)}
            </span>
            {profile.operatingHours && (
              <span className="flex items-center gap-1.5 text-sm text-gray-500">
                <Clock size={14} className="text-gray-400" />
                {profile.operatingHours}
              </span>
            )}
          </div>

          {/* Rating */}
          <div className="flex items-center gap-3 mt-4">
            <div className="flex items-center gap-1.5 bg-amber-50 dark:bg-amber-900/20 px-3 py-1.5 rounded-full">
              <Star size={15} className="text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-amber-700 dark:text-amber-300">
                {computedRating}
              </span>
              <span className="text-xs text-amber-600/70 dark:text-amber-400/60">
                {getRatingLabel(computedRating)}
              </span>
            </div>
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div className={`mt-6 ${isMobile ? 'px-0' : ''} pb-10`}>
          <Tabs
            defaultActiveKey="products"
            className={`[&_.ant-tabs-nav]:!mb-4 [&_.ant-tabs-tab]:!text-sm [&_.ant-tabs-tab]:!font-medium [&_.ant-tabs-tab-active]:!font-semibold [&_.ant-tabs-ink-bar]:!bg-blue [&_.ant-tabs-nav]:!px-4 ${
              isMobile
                ? '[&_.ant-tabs-nav-list]:!w-full [&_.ant-tabs-nav-list]:!justify-around [&_.ant-tabs-nav]:!sticky [&_.ant-tabs-nav]:!z-[100] [&_.ant-tabs-nav]:!top-[30px] [&_.ant-tabs-nav]:!bg-white [&_.ant-tabs-nav]:dark:!bg-gray-900'
                : ''
            }`}
            items={[
              // ─── Products Tab ────────────────────────────────────
              {
                key: 'featured',
                label: (
                  <span className="flex items-center gap-1.5">
                    {isMobile ? (
                      <Tooltip title="Featured Works">
                        <Sparkles size={20} />
                      </Tooltip>
                    ) : (
                      <>
                        <Sparkles size={15} />
                        <span>Featured Works</span>
                      </>
                    )}
                  </span>
                ),
                children: <FeaturedWorks />,
              },
              {
                key: 'products',
                label: (
                  <span className="flex items-center gap-1.5">
                    {isMobile ? (
                      <Tooltip title="My Products">
                        <Package size={20} />
                      </Tooltip>
                    ) : (
                      <>
                        <Package size={15} />
                        <span>My Products</span>
                      </>
                    )}
                  </span>
                ),
                children: <SellItem />,
              },

              // ─── Orders Tab ─────────────────────────────────────
              {
                key: 'orders',
                label: (
                  <span className="flex items-center gap-1.5">
                    {isMobile ? (
                      <Tooltip title={`My Orders (${orders.length})`}>
                        <ClipboardList size={20} />
                      </Tooltip>
                    ) : (
                      <>
                        <ClipboardList size={15} />
                        <span>My Orders ({orders.length})</span>
                      </>
                    )}
                  </span>
                ),
                children: <div className={isMobile ? 'px-4' : ''}>{renderOrdersTab()}</div>,
              },

              // ─── Saved Tab ──────────────────────────────────────
              {
                key: 'saved',
                label: (
                  <span className="flex items-center gap-1.5">
                    {isMobile ? (
                      <Tooltip title="Saved">
                        <Bookmark size={20} />
                      </Tooltip>
                    ) : (
                      <>
                        <Bookmark size={15} />
                        <span>Saved ({orders.length})</span>
                      </>
                    )}
                  </span>
                ),
                children: <SavedItems />,
              },

              // ─── Reviews Tab ────────────────────────────────────
              {
                key: 'reviews',
                label: (
                  <span className="flex items-center gap-1.5">
                    {isMobile ? (
                      <Tooltip title={`Reviews (${reviews.length})`}>
                        <Star size={20} />
                      </Tooltip>
                    ) : (
                      <>
                        <Star size={15} />
                        <span>Reviews ({reviews.length})</span>
                      </>
                    )}
                  </span>
                ),
                children: <div className={isMobile ? 'px-4' : ''}>{renderReviewsTab()}</div>,
              },

              // ─── About Tab ──────────────────────────────────────
              {
                key: 'about',
                label: (
                  <span className="flex items-center gap-1.5">
                    {isMobile ? (
                      <Tooltip title="About">
                        <Users size={20} />
                      </Tooltip>
                    ) : (
                      <>
                        <Users size={15} />
                        <span>About</span>
                      </>
                    )}
                  </span>
                ),
                children: <div className={isMobile ? 'px-4' : ''}>{renderAboutTab()}</div>,
              },
            ]}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* EDIT ABOUT — mobile: full-screen overlay, desktop: modal         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isMobile ? (
        <MobileOverlay
          open={isEditAboutOpen}
          onClose={() => setIsEditAboutOpen(false)}
          title="Edit Profile"
          zIndex={200}
        >
          <EditAboutForm
            profile={profile}
            onSave={handleSaveAbout}
            onCancel={() => setIsEditAboutOpen(false)}
          />
        </MobileOverlay>
      ) : (
        <Modal
          open={isEditAboutOpen}
          onCancel={() => setIsEditAboutOpen(false)}
          footer={null}
          width={640}
          className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden"
        >
          <div className="max-h-[80vh] overflow-y-auto">
            <EditAboutForm
              profile={profile}
              onSave={handleSaveAbout}
              onCancel={() => setIsEditAboutOpen(false)}
            />
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ORDER DETAIL — mobile: full-screen overlay, desktop: modal       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {selectedOrder && (
        <>
          {isMobile ? (
            <MobileOverlay
              open={isOrderDetailOpen}
              onClose={handleCloseOrderDetail}
              title="Order Details"
              zIndex={200}
            >
              <OrderDetailView order={selectedOrder} />
            </MobileOverlay>
          ) : (
            <Modal
              open={isOrderDetailOpen}
              onCancel={handleCloseOrderDetail}
              footer={null}
              width={560}
              className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden"
            >
              <OrderDetailView order={selectedOrder} />
            </Modal>
          )}
        </>
      )}
    </div>
  );
};

export default Profile;
