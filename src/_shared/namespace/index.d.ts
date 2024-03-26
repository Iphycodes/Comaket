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

interface commentsType {
  userDpImageUrl: string;
  userName: string;
  message: string;
  date: string;
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
  itemName: string;
  description: string;
  likes: likesType[];
  comments: commentsType[];
}
