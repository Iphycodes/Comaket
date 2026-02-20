'use client';
import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useAppDispatch } from '@grc/redux/store';
import { logout } from '@grc/redux/slices/auth';
import { AuthDataType } from '@grc/_shared/namespace/auth';
import { AccountNamespace } from '@grc/_shared/namespace/account';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { mockMarketItems } from '@grc/_shared/constant';
import { CartItem } from '@grc/_shared/namespace/cart';
import { MarketItem } from '@grc/_shared/namespace';
import { getFirstImageUrl } from '@grc/components/apps/media-renderer';

type AppProviderPropType = {
  children: ReactNode;
};

interface AppContextPropType {
  handleLogOut: () => void;
  authData: AuthDataType | null;
  currentAccount: AccountNamespace.Account | null;
  isLiveMode: boolean;
  accounts: Array<AccountNamespace.Account | null>;
  toggleSider: boolean;
  setToggleSider: Dispatch<SetStateAction<boolean>>;
  toggleLeftDrawer: boolean;
  setToggleLeftDrawer: Dispatch<SetStateAction<boolean>>;
  toggleFindVendorDrawer: boolean;
  setToggleFindVendorDrawer: Dispatch<SetStateAction<boolean>>;
  toggleProfileDrawer: boolean;
  setToggleProfileDrawer: Dispatch<SetStateAction<boolean>>;
  toggleNotificationsDrawer: boolean;
  setToggleNotificationsDrawer: Dispatch<SetStateAction<boolean>>;
  isCreateStoreModalOpen: boolean;
  setIsCreateStoreModalOpen: Dispatch<SetStateAction<boolean>>;
  isSellItemModalOpen: boolean;
  setIsSellItemModalOpen: Dispatch<SetStateAction<boolean>>;
  isChatsModalOpen: boolean;
  setIsChatsModalOpen: Dispatch<SetStateAction<boolean>>;
  // Auth modal
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: Dispatch<SetStateAction<boolean>>;
  handleLogin: (data: { email: string; password: string }) => void;
  handleSignup: (data: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
  }) => void;
  payoutDetails: Record<string, any>;
  setPayoutdetails: Dispatch<SetStateAction<Record<string, any>>>;
  selectedDashboardTransaction: Record<string, any>;
  setSelectedDashboardTransaction: Dispatch<SetStateAction<Record<string, any>>>;
  // Shop / Market
  shopItems: MarketItem[];
  setShopItems: Dispatch<SetStateAction<MarketItem[]>>;
  // Cart
  cartItems: CartItem[];
  addToCart: (id: string | number) => void;
  removeFromCart: (id: string | number) => void;
  updateCartQuantity: (id: string | number, quantity: number) => void;
  clearCart: () => void;
  isInCart: (id: string | number) => boolean;
  cartCount: number;
  getCartTotal: () => number;
  getCartCount: () => number;
}

export const AppContext = createContext<AppContextPropType>({
  handleLogOut: () => {},
  authData: null,
  currentAccount: null,
  isLiveMode: false,
  accounts: [],
  toggleSider: false,
  setToggleSider: () => {},
  toggleLeftDrawer: false,
  setToggleLeftDrawer: () => {},
  toggleFindVendorDrawer: true,
  setToggleFindVendorDrawer: () => {},
  toggleProfileDrawer: true,
  setToggleProfileDrawer: () => {},
  toggleNotificationsDrawer: true,
  setToggleNotificationsDrawer: () => {},
  isCreateStoreModalOpen: false,
  setIsCreateStoreModalOpen: () => {},
  isSellItemModalOpen: false,
  setIsSellItemModalOpen: () => {},
  isChatsModalOpen: false,
  setIsChatsModalOpen: () => {},
  // Auth modal
  isAuthModalOpen: false,
  setIsAuthModalOpen: () => {},
  handleLogin: () => {},
  handleSignup: () => {},
  payoutDetails: {},
  setPayoutdetails: () => {},
  selectedDashboardTransaction: {},
  setSelectedDashboardTransaction: () => {},
  shopItems: [],
  setShopItems: () => {},
  cartItems: [],
  addToCart: () => {},
  removeFromCart: () => {},
  updateCartQuantity: () => {},
  clearCart: () => {},
  isInCart: () => false,
  cartCount: 0,
  getCartTotal: () => 0,
  getCartCount: () => 0,
});

const CART_STORAGE_KEY = 'comaket_cart';

const loadCartFromStorage = (): CartItem[] => {
  if (typeof window === 'undefined') return [];
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const saveCartToStorage = (items: CartItem[]) => {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Error saving cart:', err);
  }
};

export const AppProvider = (props: AppProviderPropType) => {
  const { children } = props;
  const isMobile = useMediaQuery(mediaSize.mobile);
  const dispatch = useAppDispatch();
  const handleLogOut = () => dispatch(logout());

  // UI toggles
  const [toggleSider, setToggleSider] = useState(false);
  const [toggleLeftDrawer, setToggleLeftDrawer] = useState(true);
  const [toggleFindVendorDrawer, setToggleFindVendorDrawer] = useState(true);
  const [toggleProfileDrawer, setToggleProfileDrawer] = useState(true);
  const [toggleNotificationsDrawer, setToggleNotificationsDrawer] = useState(true);
  const [payoutDetails, setPayoutdetails] = useState({});
  const [selectedDashboardTransaction, setSelectedDashboardTransaction] = useState({});
  const [isCreateStoreModalOpen, setIsCreateStoreModalOpen] = useState(false);
  const [isSellItemModalOpen, setIsSellItemModalOpen] = useState(false);
  const [isChatsModalOpen, setIsChatsModalOpen] = useState(false);

  // Auth modal
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Shop items — initialised with mock data, will be replaced by API
  const [shopItems, setShopItems] = useState<MarketItem[]>(mockMarketItems);

  // Cart state — persisted in localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  useEffect(() => {
    setCartItems(loadCartFromStorage());
  }, []);

  useEffect(() => {
    saveCartToStorage(cartItems);
    window.dispatchEvent(new Event('cartChanged'));
  }, [cartItems]);

  useEffect(() => {
    isMobile && setToggleSider(true);
  }, [isMobile]);

  // ── Auth handlers ─────────────────────────────────────────────────────

  const handleLogin = useCallback((data: { email: string; password: string }) => {
    // ── TODO: Replace with real API call ───────────────────────────
    // const res = await fetch('/api/auth/login', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(data),
    // });
    // const result = await res.json();
    // if (result.success) {
    //   setAuthData(result.authData);
    //   setIsAuthModalOpen(false);
    // }
    // ──────────────────────────────────────────────────────────────
    console.log('Login payload:', data);
    setIsAuthModalOpen(false);
  }, []);

  const handleSignup = useCallback(
    (data: { firstName: string; lastName: string; email: string; password: string }) => {
      // ── TODO: Replace with real API call ───────────────────────────
      // const res = await fetch('/api/auth/signup', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(data),
      // });
      // const result = await res.json();
      // if (result.success) {
      //   setAuthData(result.authData);
      //   setIsAuthModalOpen(false);
      // }
      // ──────────────────────────────────────────────────────────────
      console.log('Signup payload:', data);
      setIsAuthModalOpen(false);
    },
    []
  );

  // ── Cart helpers ──────────────────────────────────────────────────────

  const addToCart = (id: string | number) => {
    setCartItems((prev) => {
      const existing = prev.find((item) => item.id === id);
      if (existing) {
        if (existing.quantity >= existing.maxQuantity) return prev;
        return prev.map((item) =>
          item.id === id ? { ...item, quantity: item.quantity + 1 } : item
        );
      }

      const shopItem = shopItems.find((si) => si.id === id);
      if (!shopItem) return prev;

      const newCartItem: CartItem = {
        id: shopItem.id,
        itemName: shopItem.itemName,
        description: shopItem.description,
        price: shopItem.askingPrice?.price || 0,
        quantity: 1,
        maxQuantity: shopItem.quantity ?? 1,
        image: getFirstImageUrl(shopItem.media || []),
        condition: shopItem.condition,
        negotiable: shopItem.askingPrice?.negotiable || false,
        sellerName:
          shopItem.postUserProfile?.businessName || shopItem.postUserProfile?.userName || '',
      };
      return [...prev, newCartItem];
    });
  };

  const removeFromCart = (id: string | number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateCartQuantity = (id: string | number, quantity: number) => {
    if (quantity < 1) {
      removeFromCart(id);
      return;
    }
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const clampedQty = Math.max(1, Math.min(quantity, item.maxQuantity));
        return { ...item, quantity: clampedQty };
      })
    );
  };

  const clearCart = () => setCartItems([]);

  const isInCart = (id: string | number): boolean => cartItems.some((item) => item.id === id);

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getCartTotal = useCallback(
    () => cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0),
    [cartItems]
  );

  const getCartCount = useCallback(
    () => cartItems.reduce((count, item) => count + item.quantity, 0),
    [cartItems]
  );

  // ── Context value ─────────────────────────────────────────────────────

  const values: AppContextPropType = {
    handleLogOut,
    authData: null,
    currentAccount: null,
    isLiveMode: false,
    accounts: [],
    setToggleSider,
    toggleSider,
    payoutDetails,
    setPayoutdetails,
    selectedDashboardTransaction,
    setSelectedDashboardTransaction,
    setToggleLeftDrawer,
    toggleLeftDrawer,
    toggleFindVendorDrawer,
    setToggleFindVendorDrawer,
    toggleNotificationsDrawer,
    setToggleNotificationsDrawer,
    isCreateStoreModalOpen,
    setIsCreateStoreModalOpen,
    toggleProfileDrawer,
    setToggleProfileDrawer,
    isSellItemModalOpen,
    setIsSellItemModalOpen,
    isChatsModalOpen,
    setIsChatsModalOpen,
    // Auth modal
    isAuthModalOpen,
    setIsAuthModalOpen,
    handleLogin,
    handleSignup,
    shopItems,
    setShopItems,
    cartItems,
    addToCart,
    removeFromCart,
    updateCartQuantity,
    clearCart,
    isInCart,
    cartCount,
    getCartTotal,
    getCartCount,
  };

  return <AppContext.Provider value={values}>{children}</AppContext.Provider>;
};
