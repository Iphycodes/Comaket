import { isEmpty } from 'lodash';

const conditionDisplayMap: Record<string, string> = {
  brand_new: 'Brand New',
  fairly_used: 'Fairly Used',
  used: 'Used',
  refurbished: 'Refurbished',
};

export const transformListing = (listing: any) => {
  const creator =
    listing.creatorId && typeof listing.creatorId === 'object' ? listing.creatorId : null;
  const store = listing.storeId && typeof listing.storeId === 'object' ? listing.storeId : null;
  const user = listing.userId && typeof listing.userId === 'object' ? listing.userId : null;

  return {
    id: listing._id || listing.id,
    itemName: listing.itemName || '',
    description: listing.description || '',
    condition: conditionDisplayMap[listing.condition] || listing.condition || 'Brand New',
    category: listing.category || '',
    media: (listing.media || []).map((m: any) => ({
      url: m.url,
      type: m.type || 'image',
      thumbnail: m.thumbnail,
      _id: m._id || m.id,
      id: m._id || m.id,
    })),
    askingPrice: {
      price: listing.effectivePrice?.amount || listing.askingPrice?.amount || 0,
      currency: listing.effectivePrice?.currency || listing.askingPrice?.currency || 'NGN',
      negotiable: listing.askingPrice?.negotiable || false,
    },
    quantity: listing.quantity ?? 0,
    availability: (listing.quantity ?? 0) > 0,
    sponsored: false,
    isBuyable: listing.isBuyable ?? false,
    listingType: listing.type || 'self-listing',
    productTags: listing.tags || [],
    comments: [],
    views: listing.views || 0,
    likes: listing.likes || 0,
    totalSales: listing.totalSales || 0,
    postUserProfile: {
      isStore: !isEmpty(store),
      displayName: !isEmpty(store)
        ? store?.name || 'Store'
        : !isEmpty(user)
          ? `${user?.firstName || ''} ${user?.lastName || ''}`.trim() || 'Seller'
          : 'Kraft Official',
      userName: creator?.username || null,
      profilePicUrl: !isEmpty(store)
        ? store?.logo || null
        : creator?.profileImageUrl ?? listing?.userId?.avatar ?? null,
      id: !isEmpty(store) ? store?._id || null : creator?._id || null,
      isVerified: !isEmpty(store) ? store?.isVerified ?? false : creator?.isVerified ?? false,
      isSuperVerified: !isEmpty(store)
        ? store?.isSuperVerified ?? false
        : creator?.isSuperVerified ?? false,
      phoneNumber:
        listing?.whatsappNumber ||
        (!isEmpty(store) ? store?.whatsappNumber ?? store?.phoneNumber ?? null : null) ||
        creator?.whatsappNumber ||
        listing?.phoneNumber ||
        null,
      location: !isEmpty(store)
        ? [store?.location?.city, store?.location?.state].filter(Boolean).join(', ') || 'Nigeria'
        : !isEmpty(creator)
          ? [creator?.location?.city, creator?.location?.state].filter(Boolean).join(', ') ||
            'Nigeria'
          : 'Nigeria',
    },
    ownerId: user?._id || (typeof listing.userId === 'string' ? listing.userId : null),
    formerPrice: listing.formerPrice || null, // Original price before discount (kobo)
    discountPercent: listing.discountPercent || null, // e.g. 25 = 25% off
    discountPrice: listing.discountPrice || null, // Discounted price (kobo)
    _raw: listing,
  };
};

export interface MarketFilters {
  category?: string;
  subCategory?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}
