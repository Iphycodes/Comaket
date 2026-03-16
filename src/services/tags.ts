/**
 * RTK Query Cache Tags
 * =====================
 * Tags are used for automatic cache invalidation.
 * When a mutation invalidates a tag, all queries providing
 * that tag automatically refetch.
 */

export const accountTag = 'Account' as const;
export const userTag = 'User' as const;
export const creatorTag = 'Creator' as const;
export const storeTag = 'Store' as const;
export const listingTag = 'Listing' as const;
export const orderTag = 'Order' as const;
export const categoryTag = 'Category' as const;
export const reviewTag = 'Review' as const;
export const adminTag = 'Admin' as const;
export const cartTag = 'Cart' as const;
export const savedProductTag = 'SavedProduct' as const;
export const shippingAddressTag = 'ShippingAddress' as const;
export const deliveryZoneTag = 'DeliveryZone' as const;
export const disputeTag = 'Dispute' as const;

export default [
  accountTag,
  userTag,
  creatorTag,
  storeTag,
  listingTag,
  orderTag,
  categoryTag,
  reviewTag,
  adminTag,
  cartTag,
  savedProductTag,
  shippingAddressTag,
  deliveryZoneTag,
  disputeTag,
];
