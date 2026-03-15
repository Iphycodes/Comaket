import { useContext, useEffect } from 'react';
import {
  useLazyGetCartQuery,
  useLazyGetCartCountQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useValidateCartMutation,
  useCheckoutCartMutation,
  useAddToCartMutation,
  CheckoutCartPayload,
} from '@grc/services/cart';
import { useAuth } from '../useAuth';
import { AppContext } from '@grc/app-context';

interface UseCartProps {
  fetchCart?: boolean;
  fetchCount?: boolean;
}

export const useCart = ({ fetchCart = false, fetchCount = false }: UseCartProps = {}) => {
  // API hooks
  const [addToCart, addToCartResponse] = useAddToCartMutation();
  const [triggerGetCart, getCartResponse] = useLazyGetCartQuery();
  const [triggerGetCount, getCountResponse] = useLazyGetCartCountQuery();
  const [updateCartItem, updateCartItemResponse] = useUpdateCartItemMutation();
  const [removeCartItem, removeCartItemResponse] = useRemoveCartItemMutation();
  const [clearCart, clearCartResponse] = useClearCartMutation();
  const [validateCart, validateCartResponse] = useValidateCartMutation();
  const [checkoutCart, checkoutCartResponse] = useCheckoutCartMutation();
  const { isAuthenticated } = useAuth();
  const { setIsAuthModalOpen } = useContext(AppContext);

  // Fetch on mount if requested
  useEffect(() => {
    if (fetchCart && isAuthenticated) {
      triggerGetCart();
    }
  }, [fetchCart]);

  useEffect(() => {
    if (fetchCount && isAuthenticated) {
      triggerGetCount();
    }
  }, [fetchCount]);

  // ── Handler functions ───────────────────────────────────────────────

  const handleAddToCart = async (listingId: string, quantity = 1) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const result = await addToCart({
        payload: { listingId, quantity },
        options: { successMessage: 'Added to cart' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetCart = async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await triggerGetCart().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleGetCount = async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await triggerGetCount().unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleUpdateQuantity = async (listingId: string, quantity: number) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await updateCartItem({
        listingId,
        payload: { quantity },
        options: { noSuccessMessage: true },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleRemoveItem = async (listingId: string) => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const result = await removeCartItem({
        listingId,
        options: { successMessage: 'Item removed from cart' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleClearCart = async () => {
    if (!isAuthenticated) {
      setIsAuthModalOpen(true);
      return;
    }
    try {
      const result = await clearCart({
        options: { successMessage: 'Cart cleared' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleValidateCart = async () => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await validateCart({
        options: { noSuccessMessage: true },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  const handleCheckout = async (data: CheckoutCartPayload) => {
    if (!isAuthenticated) {
      return;
    }
    try {
      const result = await checkoutCart({
        payload: data,
        options: { successMessage: 'Order initialized. Redirecting to payment...' },
      }).unwrap();
      return result;
    } catch (error) {
      throw error;
    }
  };

  // ── Helpers ─────────────────────────────────────────────────────────

  /** Check if a listing is currently in the cart */
  const isInCart = (listingId: string): boolean => {
    if (!isAuthenticated) {
      return false;
    }
    const items = getCartResponse?.data?.data?.items || [];
    return items.some((item: any) => item.listingId === listingId);
  };

  // ── Return ──────────────────────────────────────────────────────────

  return {
    // Handler functions
    addToCart: handleAddToCart,
    getCart: handleGetCart,
    getCartCount: handleGetCount,
    updateQuantity: handleUpdateQuantity,
    removeItem: handleRemoveItem,
    clearCart: handleClearCart,
    validateCart: handleValidateCart,
    checkout: handleCheckout,

    // Helpers
    isInCart,

    // Data
    cart: getCartResponse?.data?.data,
    cartItems: getCartResponse?.data?.data?.items || [],
    cartItemCount: getCartResponse?.data?.data?.itemCount ?? 0,
    cartSubtotal: getCartResponse?.data?.data?.subtotal || 0,
    cartCurrency: getCartResponse?.data?.data?.currency || 'NGN',
    validation: validateCartResponse?.data?.data,

    // Loading states
    isAddingToCart: addToCartResponse.isLoading,
    isLoadingCart: getCartResponse.isLoading,
    isFetchingCart: getCartResponse.isFetching,
    isLoadingCount: getCountResponse.isLoading,
    isUpdatingItem: updateCartItemResponse.isLoading,
    isRemovingItem: removeCartItemResponse.isLoading,
    isClearingCart: clearCartResponse.isLoading,
    isValidating: validateCartResponse.isLoading,
    isCheckingOut: checkoutCartResponse.isLoading,

    // Success states
    isAddToCartSuccess: addToCartResponse.isSuccess,
    isUpdateItemSuccess: updateCartItemResponse.isSuccess,
    isRemoveItemSuccess: removeCartItemResponse.isSuccess,
    isClearCartSuccess: clearCartResponse.isSuccess,
    isValidateSuccess: validateCartResponse.isSuccess,
    isCheckoutSuccess: checkoutCartResponse.isSuccess,

    // Error states
    addToCartError: addToCartResponse.error,
    cartError: getCartResponse.error,
    countError: getCountResponse.error,
    updateItemError: updateCartItemResponse.error,
    removeItemError: removeCartItemResponse.error,
    clearCartError: clearCartResponse.error,
    validateError: validateCartResponse.error,
    checkoutError: checkoutCartResponse.error,

    // Response states
    addToCartResponse,
    getCartResponse,
    getCountResponse,
    updateCartItemResponse,
    removeCartItemResponse,
    clearCartResponse,
    validateCartResponse,
    checkoutCartResponse,

    // Actions
    refetchCart: () => isAuthenticated && triggerGetCart(),
    refetchCount: () => isAuthenticated && triggerGetCount(),
  };
};
