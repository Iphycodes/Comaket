'use client';

import React, { useState } from 'react';
import { Tabs, Tooltip, Input, Modal, message as antMessage } from 'antd';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  MapPin,
  Mail,
  Phone,
  Edit3,
  ShoppingBag,
  Bookmark,
  ClipboardList,
  X,
  ChevronRight,
  Truck,
  RotateCcw,
  CheckCircle,
  XCircle,
  Timer,
  Package,
  Save,
  Camera,
  Sparkles,
  ArrowRight,
  Shield,
  TrendingUp,
  Store,
  Heart,
  Settings,
} from 'lucide-react';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { mockMarketItems, Currencies } from '@grc/_shared/constant';
import { numberFormat } from '@grc/_shared/helpers';
import SavedItems from '../saved';
import { useRouter } from 'next/navigation';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES & MOCK DATA
// ═══════════════════════════════════════════════════════════════════════════

interface BasicUserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  profilePicUrl: string;
  address: string;
  city: string;
  state: string;
  country: string;
  joinedDate: string;
  bio: string;
}

const mockBasicUser: BasicUserProfile = {
  firstName: 'Emmanuel',
  lastName: 'Okafor',
  email: 'emmanuel.okafor@gmail.com',
  phoneNumber: '2348012345678',
  profilePicUrl:
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop',
  address: '12 Ahmadu Bello Way',
  city: 'Kaduna',
  state: 'Kaduna',
  country: 'Nigeria',
  joinedDate: '2023-06-15T00:00:00Z',
  bio: 'Tech enthusiast and gadget lover based in Kaduna.',
};

type OrderStatus = 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'returned';

interface OrderItem {
  id: string;
  itemName: string;
  image: string;
  price: number;
  quantity: number;
  condition: string;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
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
];

// ═══════════════════════════════════════════════════════════════════════════
// HELPER COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

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

// ─── Mobile Overlay ───────────────────────────────────────────────────────

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
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-800 flex-shrink-0">
            <button
              onClick={onClose}
              className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              <ArrowLeft size={18} />
              <span className="font-medium">{title || 'Back'}</span>
            </button>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center"
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

      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Payment</span>
          <span className="font-medium text-gray-900 dark:text-white">{order.paymentMethod}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-500">Address</span>
          <span className="font-medium text-gray-900 dark:text-white text-right max-w-[60%]">
            {order.deliveryAddress}
          </span>
        </div>
        {order.trackingNumber && (
          <div className="flex justify-between text-sm">
            <span className="text-gray-500">Tracking</span>
            <span className="font-medium text-blue">{order.trackingNumber}</span>
          </div>
        )}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
          <div className="flex justify-between">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">Total</span>
            <span className="font-bold text-lg bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
              {numberFormat(order.totalAmount / 100, Currencies.NGN)}
            </span>
          </div>
        </div>
      </div>

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

// ─── Edit Profile Form ────────────────────────────────────────────────────

interface EditProfileFormProps {
  profile: BasicUserProfile;
  onSave: (updated: Partial<BasicUserProfile>) => void;
  onCancel: () => void;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({ profile, onSave, onCancel }) => {
  const [firstName, setFirstName] = useState(profile.firstName);
  const [lastName, setLastName] = useState(profile.lastName);
  const [email, setEmail] = useState(profile.email);
  const [phoneNumber, setPhoneNumber] = useState(profile.phoneNumber);
  const [address, setAddress] = useState(profile.address);
  const [city, setCity] = useState(profile.city);
  const [state, setState] = useState(profile.state);
  const [bio, setBio] = useState(profile.bio);

  const handleSave = () => {
    onSave({ firstName, lastName, email, phoneNumber, address, city, state, bio });
  };

  return (
    <div className="p-5 space-y-5 pb-16">
      <div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">Edit Profile</h2>
        <p className="text-sm text-gray-400">Update your personal details</p>
      </div>

      {/* Profile pic placeholder */}
      <div className="flex justify-center">
        <div className="relative">
          <img
            src={profile.profilePicUrl}
            alt="Profile"
            className="w-24 h-24 rounded-full object-cover border-4 border-gray-100 dark:border-gray-700"
          />
          <button className="absolute bottom-0 right-0 w-8 h-8 bg-blue rounded-full flex items-center justify-center shadow-md border-2 border-white dark:border-gray-900">
            <Camera size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Name row */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
            First Name
          </label>
          <Input
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="!rounded-lg h-11"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
            Last Name
          </label>
          <Input
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="!rounded-lg h-11"
          />
        </div>
      </div>

      {/* Bio */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
          Bio
        </label>
        <Input.TextArea
          value={bio}
          onChange={(e) => setBio(e.target.value)}
          placeholder="Tell us about yourself..."
          rows={3}
          maxLength={200}
          showCount
          className="!rounded-lg resize-none"
        />
      </div>

      {/* Email */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
          Email
        </label>
        <Input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          prefix={<Mail size={14} className="text-gray-400" />}
          className="!rounded-lg h-11"
        />
      </div>

      {/* Phone */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
          Phone Number
        </label>
        <Input
          value={phoneNumber}
          onChange={(e) => setPhoneNumber(e.target.value)}
          prefix={<Phone size={14} className="text-gray-400" />}
          className="!rounded-lg h-11"
        />
      </div>

      {/* Address */}
      <div>
        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
          Address
        </label>
        <Input
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          prefix={<MapPin size={14} className="text-gray-400" />}
          className="!rounded-lg h-11"
        />
      </div>

      {/* City & State */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
            City
          </label>
          <Input
            value={city}
            onChange={(e) => setCity(e.target.value)}
            className="!rounded-lg h-11"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5 block">
            State
          </label>
          <Input
            value={state}
            onChange={(e) => setState(e.target.value)}
            className="!rounded-lg h-11"
          />
        </div>
      </div>

      {/* Actions */}
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
          Save
        </button>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// SWITCH TO CREATOR CTA
// ═══════════════════════════════════════════════════════════════════════════

const SwitchToCreatorCTA: React.FC<{ isMobile: boolean }> = ({ isMobile }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const { push } = useRouter();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className={`${isMobile ? 'mx-4' : ''} mb-6`}
      >
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-indigo-500 via-blue to-cyan-500 p-[1px]">
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-5 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue/5 to-indigo-500/5 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-cyan-500/5 to-blue/5 rounded-full translate-y-1/2 -translate-x-1/2" />

            <div className="relative">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue to-indigo-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue/20">
                  <Store size={22} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-base font-bold text-gray-900 dark:text-white">
                    Become a Creator
                  </h3>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 leading-relaxed">
                    Start selling your products and showcase your handmade creations to thousands of
                    buyers.
                  </p>
                </div>
              </div>

              {/* Benefits */}
              <div className="grid grid-cols-3 gap-3 mt-4">
                {[
                  { icon: <TrendingUp size={16} />, label: 'Sell Products' },
                  { icon: <Sparkles size={16} />, label: 'Showcase Work' },
                  { icon: <Shield size={16} />, label: 'Get Verified' },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1.5 py-3 px-2 bg-gray-50 dark:bg-gray-800/50 rounded-xl"
                  >
                    <span className="text-blue">{item.icon}</span>
                    <span className="text-[11px] font-medium text-gray-600 dark:text-gray-400 text-center">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowConfirm(true)}
                className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-blue to-indigo-500 hover:from-blue hover:to-indigo-600 text-white text-sm font-semibold shadow-md shadow-blue/20 hover:shadow-lg transition-all flex items-center justify-center gap-2"
              >
                Switch to Creator Account
                <ArrowRight size={16} />
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <Modal
        open={showConfirm}
        onCancel={() => setShowConfirm(false)}
        footer={null}
        width={420}
        className="[&_.ant-modal-content]:!rounded-2xl"
        zIndex={20000}
      >
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue to-indigo-500 flex items-center justify-center mx-auto mb-4 shadow-lg shadow-blue/20">
            <Store size={28} className="text-white" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
            Ready to become a Creator?
          </h3>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed max-w-[300px] mx-auto">
            You&apos;ll unlock the ability to list products, showcase featured works, receive
            reviews, and build your store.
          </p>

          <div className="space-y-3 mt-6 text-left bg-gray-50 dark:bg-gray-800/50 rounded-xl p-4">
            {[
              'Create your store with a custom name & branding',
              'List products for sale with multiple images',
              'Showcase featured handmade works',
              'Receive and manage buyer reviews',
              'Access seller analytics and insights',
            ].map((item, i) => (
              <div key={i} className="flex items-start gap-2.5">
                <CheckCircle size={16} className="text-emerald-500 flex-shrink-0 mt-0.5" />
                <span className="text-sm text-gray-600 dark:text-gray-300">{item}</span>
              </div>
            ))}
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setShowConfirm(false)}
              className="flex-1 py-3 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl border border-gray-200 dark:border-gray-700 transition-colors"
            >
              Not Now
            </button>
            <button
              onClick={() => {
                push('/creator/setup');
                setShowConfirm(false);
                antMessage.success("You'll be redirected to set up your creator store.");
              }}
              className="flex-1 py-3 text-sm font-semibold rounded-xl bg-gradient-to-r from-blue to-indigo-500 text-white shadow-md hover:shadow-lg transition-all"
            >
              Let&apos;s Go!
            </button>
          </div>
        </div>
      </Modal>
    </>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// MAIN BASIC PROFILE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const BasicProfile: React.FC = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);

  const [profile, setProfile] = useState<BasicUserProfile>(mockBasicUser);
  const [orders] = useState<Order[]>(mockOrders);

  // Edit
  const [isEditOpen, setIsEditOpen] = useState(false);

  // Order detail
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isOrderDetailOpen, setIsOrderDetailOpen] = useState(false);

  // ── Handlers ──────────────────────────────────────────────────────────

  const handleSaveProfile = (updated: Partial<BasicUserProfile>) => {
    setProfile((prev) => ({ ...prev, ...updated }));
    setIsEditOpen(false);
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

  // ── Quick Stats ─────────────────────────────────────────────────────

  // const activeOrders = orders.filter(
  //   (o) => o.status === 'pending' || o.status === 'processing' || o.status === 'shipped'
  // ).length;
  // const deliveredOrders = orders.filter((o) => o.status === 'delivered').length;
  // const totalSpent = orders
  //   .filter((o) => o.status === 'delivered')
  //   .reduce((s, o) => s + o.totalAmount, 0);

  // ── Orders Tab ────────────────────────────────────────────────────────

  const renderOrdersTab = () => {
    if (orders.length === 0) {
      return (
        <div className="text-center py-16 bg-gray-50 dark:bg-gray-800/30 rounded-2xl">
          <ShoppingBag size={36} className="mx-auto text-gray-200 dark:text-gray-700 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">No orders yet</p>
          <p className="text-xs text-gray-400 mt-1">Your purchases will appear here.</p>
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
              className="bg-white dark:bg-gray-800/60 rounded-xl border border-gray-100 dark:border-gray-700/50 p-4 cursor-pointer hover:shadow-md transition-all group"
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
                    className="text-gray-300 group-hover:text-gray-500 transition-colors"
                  />
                </div>
              </div>

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

  // ════════════════════════════════════════════════════════════════════════
  // RENDER
  // ════════════════════════════════════════════════════════════════════════

  return (
    <div
      className={`dark:bg-gray-900/50 min-h-screen ${
        isMobile ? 'max-w-[100vw] mb-14 pt-8' : 'px-[20%]'
      }`}
    >
      <div className={`w-full ${!isMobile ? 'mx-auto px-4' : ''}`}>
        {/* ── Profile Card ───────────────────────────────────────────── */}
        <div className={`${isMobile ? 'px-4' : ''} mt-10`}>
          <div className="bg-white dark:bg-gray-800/60 rounded-2xl border border-gray-100 dark:border-gray-700/50 overflow-hidden py-4">
            {/* Gradient header strip */}
            {/* <div className="h-24 bg-gradient-to-r from-blue via-indigo-500 to-purple-500 relative">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSIyMCIgY3k9IjIwIiByPSIxIiBmaWxsPSJyZ2JhKDI1NSwyNTUsMjU1LDAuMSkiLz48L3N2Zz4=')] opacity-50" />
            </div> */}

            <div className="px-5 pb-5">
              {/* Avatar */}
              <div className="flex items-end justify-between">
                <div className="relative">
                  <img
                    src={profile.profilePicUrl}
                    alt={`${profile.firstName} ${profile.lastName}`}
                    className="w-24 h-24 rounded-full object-cover border-4 border-white dark:border-gray-800 shadow-lg"
                  />
                  <div className="absolute bottom-1 right-1 w-5 h-5 bg-emerald-500 rounded-full border-2 border-white dark:border-gray-800" />
                </div>
                <div className="flex gap-2 pb-1">
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="flex items-center gap-1.5 px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-xl text-sm font-semibold hover:bg-gray-100 dark:hover:bg-gray-600 transition-all"
                  >
                    <Edit3 size={14} />
                    Edit
                  </button>
                  <Tooltip title="Settings">
                    <button className="w-9 h-9 flex items-center justify-center bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-600 transition-all">
                      <Settings size={16} className="text-gray-500" />
                    </button>
                  </Tooltip>
                </div>
              </div>

              {/* Info */}
              <div className="mt-3">
                <div className="flex items-center gap-1">
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    {profile.firstName} {profile.lastName}
                  </h1>
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-gray-100 dark:bg-gray-700/50 text-gray-500 dark:text-gray-400 rounded-full text-[11px] font-semibold mt-1">
                    <ShoppingBag size={11} />
                    Member
                  </span>{' '}
                </div>

                {/* {profile.bio && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{profile.bio}</p>
                )} */}
                <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-gray-500">
                  {/* <span className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-gray-400" />
                    {profile.city}, {profile.state}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Calendar size={13} className="text-gray-400" />
                    Joined {formatJoinDate(profile.joinedDate)}
                  </span> */}
                  <span className="flex items-center gap-1.5">
                    <Mail size={13} className="text-gray-400" />
                    {profile.email}
                  </span>
                </div>
              </div>

              {/* Quick Stats */}
              {/* <div className="grid grid-cols-3 gap-3 mt-4">
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">{activeOrders}</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Active</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold text-gray-900 dark:text-white">
                    {deliveredOrders}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Delivered</p>
                </div>
                <div className="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-3 text-center">
                  <p className="text-lg font-bold bg-gradient-to-r from-orange-500 to-rose-500 bg-clip-text text-transparent">
                    {numberFormat(totalSpent / 100, Currencies.NGN)}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Total Spent</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>

        {/* ── Creator CTA ─────────────────────────────────────────────── */}
        <div className="mt-5">
          <SwitchToCreatorCTA isMobile={isMobile} />
        </div>

        {/* ── Tabs ──────────────────────────────────────────────────────── */}
        <div className={`mt-2 ${isMobile ? 'px-0' : ''} pb-10`}>
          <Tabs
            defaultActiveKey="orders"
            className={`[&_.ant-tabs-nav]:!mb-4 [&_.ant-tabs-tab]:!text-sm [&_.ant-tabs-tab]:!font-medium [&_.ant-tabs-tab-active]:!font-semibold [&_.ant-tabs-ink-bar]:!bg-blue [&_.ant-tabs-nav]:!px-4 ${
              isMobile
                ? '[&_.ant-tabs-nav-list]:!w-full [&_.ant-tabs-nav-list]:!justify-around [&_.ant-tabs-nav]:!sticky [&_.ant-tabs-nav]:!z-20 [&_.ant-tabs-nav]:!top-[30px] [&_.ant-tabs-nav]:!bg-white [&_.ant-tabs-nav]:dark:!bg-gray-900'
                : ''
            }`}
            items={[
              {
                key: 'orders',
                label: (
                  <span className="flex items-center gap-1.5">
                    {isMobile ? (
                      <Tooltip title={`Orders (${orders.length})`}>
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
                        <span>Saved</span>
                      </>
                    )}
                  </span>
                ),
                children: <SavedItems />,
              },
              {
                key: 'wishlist',
                label: (
                  <span className="flex items-center gap-1.5">
                    {isMobile ? (
                      <Tooltip title="Wishlist">
                        <Heart size={20} />
                      </Tooltip>
                    ) : (
                      <>
                        <Heart size={15} />
                        <span>Wishlist</span>
                      </>
                    )}
                  </span>
                ),
                children: (
                  <div className={`text-center py-16 ${isMobile ? 'px-4' : ''}`}>
                    <div className="w-16 h-16 rounded-full bg-pink-50 dark:bg-pink-900/20 flex items-center justify-center mx-auto mb-3">
                      <Heart size={28} className="text-pink-300 dark:text-pink-700" />
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                      Your wishlist is empty
                    </p>
                    <p className="text-xs text-gray-400 mt-1">Items you love will show up here</p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* EDIT PROFILE                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      {isMobile ? (
        <MobileOverlay
          open={isEditOpen}
          onClose={() => setIsEditOpen(false)}
          title="Edit Profile"
          zIndex={200}
        >
          <EditProfileForm
            profile={profile}
            onSave={handleSaveProfile}
            onCancel={() => setIsEditOpen(false)}
          />
        </MobileOverlay>
      ) : (
        <Modal
          open={isEditOpen}
          onCancel={() => setIsEditOpen(false)}
          footer={null}
          width={560}
          className="[&_.ant-modal-content]:!rounded-2xl [&_.ant-modal-content]:!overflow-hidden"
        >
          <div className="max-h-[80vh] overflow-y-auto">
            <EditProfileForm
              profile={profile}
              onSave={handleSaveProfile}
              onCancel={() => setIsEditOpen(false)}
            />
          </div>
        </Modal>
      )}

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* ORDER DETAIL                                                     */}
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

export default BasicProfile;
