import { Vendor } from './vendor';

export interface AppObject {
  _id: string;
  __v: number;
  id: string;
  publicId: string;
  createdAt?: string;
  updatedAt?: string;
  active?: boolean;
}

export interface Meta {
  statusCode: number;
  success: boolean;
  pagination: {
    totalCount: number;
    perPage: number;
    current: number;
    currentPage: string;
  };
}

export interface Pagination {
  total: number;
  pageSize: number;
  current: number;
  onChange: (page: number, pageSize: number) => void;
  showSizeChanger?: boolean;
  showTotal: (total: number, range: [number, number]) => ReactNode;
}

export interface TriggeredResponse {
  isLoading?: boolean;
  isFetching?: boolean;
  isSuccess?: boolean;
  isError?: boolean;
  data?: boolean;
}

export interface OptionType {
  noErrMessage?: boolean;
  noSuccessMessage?: boolean;
  errMessage?: string;
  successMessage?: string;
}

export interface QueryArgs {
  page?: number;
  limit?: number;
  population?: Array<string> | string;
  user?: string;
  vendor?: string;
  year?: number;
  status?: string;
  id?: string | number | null;
  filter?: string;
  amount?: number;
  searcH?: string | number;
}

export interface ApiRequest {
  id?: string;
  ids?: string[];
  options?: Option;
}

export interface Mobile {
  phoneNumber: string;
  isoCode: string;
  _id: string;
}

interface likesType {
  userDpImageUrl: string;
  userName: string;
}

interface bookMarksType {
  userDpImageUrl: string;
  userName: string;
}

interface commentsType {
  id: string | number;
  user: {
    name: string;
    avatar: string;
  };
  text: string;
  timestamp: string;
}

export enum statusEnum {
  pending = 'pending',
  approved = 'approved',
  rejected = 'rejected',
}

export interface mockMarketItemType {
  postUserProfile: {
    profilePicUrl: string;
    userName: string;
    businessName?: string;
  };
  postAccountType: string;
  sponsored: boolean;
  sold: boolean;
  postImgUrls: string[];
  askingPrice: {
    price: number;
    negotiable: boolean;
  };
  condition: 'Brand New' | 'Fairly Used';
  location: string;
  itemName: string;
  description: string;
  likes: likesType[];
  comments: commentsType[];
  bookMarks: bookMarksType[];
  status: 'pending' | 'approved' | 'rejected';
  id: string | number;
  fee: number;
  live: boolean;
  feePaymentStatus: 'processed' | 'pending' | 'awaiting payment' | 'awaiting approval';
}

export type ListingType = 'self-listing' | 'consignment' | 'direct-purchase';

export interface MediaItem {
  url: string;
  type: 'image' | 'video';
  thumbnail?: string; // optional poster/thumbnail for videos
}

export interface SellerProfile {
  userName: string;
  businessName: string;
  profilePicUrl: string;
  phoneNumber: string;
  location?: string;
  isVerified?: boolean;
}

export interface AskingPrice {
  price: number;
  negotiable: boolean;
}

export interface MarketItem {
  id: string | number;
  itemName: string;
  description: string;
  media: MediaItem[];
  askingPrice: AskingPrice;
  condition: 'Brand New' | 'Fairly Used' | 'Uk Used';
  availability: boolean;
  quantity: number;
  category?: string;
  productTags: string[];
  postUserProfile: Partial<Vendor>;
  sponsored: boolean;
  comments: Record<string, any>[];
  isBuyable: boolean;
  listingType: ListingType;
  createdAt?: string;
}

export interface QueryArgs {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  sort?: string;
}

export interface ApiRequest<T = any> {
  data?: T;
  params?: QueryArgs;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T = any> {
  data: T[];
  pagination: Pagination;
}
