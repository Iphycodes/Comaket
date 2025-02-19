import { mockMarketItemType } from '../namespace';
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

export enum Currencies {
  NGN = 'NGN',
  USD = 'USD',
  CAD = 'CAD',
  GBP = 'GBP',
}

export const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY as string;
export const appName = 'Comarket';
export const dateFormat = 'DD-MM-YYYY';

export enum COLOR_LIST_ALPHA {
  A = '#3E82FF',
  B = '#C1EAFD',
  C = '#F56A00',
  D = '#7265E6',
  E = '#FFBF00',
  F = '#00A2AE',
  G = '#9C9C9D',
  H = '#F3D19B',
  I = '#CA99BC',
  J = '#BAB8F5',
  K = '#7B68ED',
  L = '#1F77B4',
  M = '#DABC8B',
  N = '#4CAF50',
  O = '#FFC107',
  P = '#FF5722',
  Q = '#FF7F0E',
  R = '#FF9800',
  S = '#4B0082',
  T = '#9E9E9E',
  U = '#FFEB3B',
  V = '#607D8B',
  W = '#2196F3',
  X = '#009688',
  Y = '#8C564B',
  Z = '#2CA02C',
}

export const mockComments = [
  {
    id: 1,
    user: { name: 'John Doe', avatar: '/assets/imgs/avatar.jpg' },
    text: 'Is this still available?',
    timestamp: '2h ago',
  },
  {
    id: 2,
    user: { name: 'Jane Smith', avatar: '/assets/imgs/avatar.jpg' },
    text: "What's the last price?",
    timestamp: '5h ago',
  },
  {
    id: 3,
    user: { name: 'Mike Johnson', avatar: '/assets/imgs/avatar.jpg' },
    text: 'Can you deliver to Kaduna?',
    timestamp: '1d ago',
  },
  {
    id: 3,
    user: { name: 'Mike Johnson', avatar: '/assets/imgs/avatar.jpg' },
    text: 'Can you deliver to Kaduna?',
    timestamp: '1d ago',
  },
  {
    id: 3,
    user: { name: 'Mike Johnson', avatar: '/assets/imgs/avatar.jpg' },
    text: 'Can you deliver to Kaduna?',
    timestamp: '1d ago',
  },
  {
    id: 3,
    user: { name: 'Mike Johnson', avatar: '/assets/imgs/avatar.jpg' },
    text: 'Can you deliver to Kaduna?',
    timestamp: '1d ago',
  },
  {
    id: 3,
    user: { name: 'Mike Johnson', avatar: '/assets/imgs/avatar.jpg' },
    text: 'Can you deliver to Kaduna?',
    timestamp: '1d ago',
  },
  {
    id: 3,
    user: { name: 'Mike Johnson', avatar: '/assets/imgs/avatar.jpg' },
    text: 'Can you deliver to Kaduna?',
    timestamp: '1d ago',
  },
  {
    id: 3,
    user: { name: 'Mike Johnson', avatar: '/assets/imgs/avatar.jpg' },
    text: 'Can you deliver to Kaduna?',
    timestamp: '1d ago',
  },
  {
    id: 3,
    user: { name: 'Mike Johnson', avatar: '/assets/imgs/avatar.jpg' },
    text: 'Can you deliver to Kaduna?',
    timestamp: '1d ago',
  },
];

export const mockMarketItems: Partial<mockMarketItemType>[] = [
  {
    id: 0,
    postUserProfile: {
      profilePicUrl: '/assets/imgs/debit-logo.png',
      userName: 'odogwu_1',
      businessName: 'Odogwu Laptops',
    },
    postAccountType: 'vendor',
    sponsored: true,
    sold: false,
    postImgUrls: [
      '/assets/imgs/macbook.jpg',
      '/assets/imgs/sneakers.jpg',
      '/assets/imgs/macbook.jpg',
      '/assets/imgs/sneakers.jpg',
      '/assets/imgs/macbook.jpg',
    ],
    askingPrice: {
      price: 5000000,
      negotiable: true,
    },
    fee: 50000,
    condition: 'Fairly Used',
    itemName: 'Hp EliteBook 840 g5',
    description: `Processor: Core i5
        HDD: 500gb
        RAM: 16gb
        Keyboard Light
        2gb Dedicated Graphics
        10th generation`,
    likes: [
      {
        userDpImageUrl: '',
        userName: 'samuel_ng',
      },
      {
        userDpImageUrl: '',
        userName: 'kings',
      },
      {
        userDpImageUrl: '',
        userName: 'queenex20',
      },
    ],
    bookMarks: [
      {
        userDpImageUrl: '',
        userName: 'samuel_ng',
      },
      {
        userDpImageUrl: '',
        userName: 'kings',
      },
      {
        userDpImageUrl: '',
        userName: 'queenex20',
      },
    ],
    comments: [
      {
        userDpImageUrl: '',
        userName: 'samuel_ng',
        message: 'This is very beautiful, I love it',
        date: '12 march 2023',
      },
      {
        userDpImageUrl: '',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
    ],
    status: 'approved',
    live: true,
    feePaymentStatus: 'processed',
  },
  {
    id: 1,
    postUserProfile: {
      profilePicUrl: '/assets/imgs/sneakers.jpg',
      userName: 'gunji_the_sneaker_king',
    },
    postAccountType: 'vendor',
    sponsored: false,
    sold: true,
    postImgUrls: ['/assets/imgs/sneakers.jpg'],
    askingPrice: {
      price: 1400000,
      negotiable: false,
    },
    fee: 14000,
    condition: 'Brand New',
    itemName: 'Airforce Sneaker Jumong',
    description: `Strong and Durable
        Size: UK 42 - 45
        Color: White
        Weight: 3kg
        `,
    likes: [
      {
        userDpImageUrl: '',
        userName: 'samuel_ng',
      },
      {
        userDpImageUrl: '',
        userName: 'kings',
      },
      {
        userDpImageUrl: '',
        userName: 'queenex20',
      },
    ],
    bookMarks: [],
    comments: [
      {
        userDpImageUrl: '',
        userName: 'samuel_ng',
        message: 'This is very beautiful, I love it',
        date: '12 march 2023',
      },
      {
        userDpImageUrl: '',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
    ],
    status: 'pending',
    live: false,
    feePaymentStatus: 'awaiting payment',
  },
  {
    id: 2,
    postUserProfile: {
      profilePicUrl: '/assets/imgs/woman-face.jpg',
      userName: 'emmnauella_ng',
    },
    postAccountType: 'vendor',
    sponsored: false,
    sold: true,
    postImgUrls: ['/assets/imgs/cooking-gas.jpg'],
    askingPrice: {
      price: 500000,
      negotiable: true,
    },
    fee: 5000,
    condition: 'Fairly Used',
    itemName: '5kg Cooking Gas',
    description: `Weight: 5kg.. I used this gas for just 2 months so it's almost like a new one
        `,
    likes: [
      {
        userDpImageUrl: '',
        userName: 'samuel_ng',
      },
      {
        userDpImageUrl: '',
        userName: 'kings',
      },
      {
        userDpImageUrl: '',
        userName: 'queenex20',
      },
      {
        userDpImageUrl: '',
        userName: 'queenex20',
      },
    ],
    bookMarks: [],
    comments: [
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'samuel_ng',
        message: 'This is very beautiful, I love it',
        date: '12 march 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptop',
        date: '5 August 2023',
      },
      {
        userDpImageUrl: '/assets/imgs/woman-face.jpg',
        userName: 'kings',
        message:
          'I love this laptop, I used it sometime last year and I must confess that it is so so powerful. Everything works fine with this laptop. You cant even ave issues with the laptopsssssssss',
        date: '5 August 2023',
      },
    ],
    status: 'rejected',
    live: false,
    feePaymentStatus: 'awaiting approval',
  },
];

export interface Vendor {
  id: string;
  name: string;
  avatar: string;
  description: string;
  address: string;
  categories: string[];
  rating: number;
  totalLikes: number;
  joinedDate: string;
}

// const categories = [
//   'Electronics',
//   'Fashion',
//   'Home & Garden',
//   'Beauty',
//   'Sports',
//   'Books',
//   'Food',
//   'Toys',
//   'Art & Crafts',
//   'Jewelry',
// ];

export const mockVendors: Vendor[] = [
  {
    id: '1',
    name: 'TechHub Electronics',
    avatar: '/assets/imgs/avatar.jpg',
    description:
      'Leading provider of premium electronics and gadgets. Specializing in smartphones, laptops, and gaming accessories with expert customer service and competitive prices.',
    address: 'Silicon Valley, CA',
    categories: ['Electronics', 'Gaming'],
    rating: 4.8,
    totalLikes: 1547,
    joinedDate: 'January 2023',
  },
  {
    id: '2',
    name: 'Fashion Forward',
    avatar: '/assets/imgs/woman-face.jpg',
    description:
      'Trendsetting fashion boutique offering curated collections of contemporary clothing, accessories, and footwear for the style-conscious individual.',
    address: 'New York, NY',
    categories: ['Fashion', 'Jewelry'],
    rating: 4.6,
    totalLikes: 2341,
    joinedDate: 'March 2023',
  },
  {
    id: '3',
    name: 'Green Thumb Garden Center',
    avatar: '/assets/imgs/avatar.jpg',
    description:
      'Your one-stop shop for all gardening needs. From plants and seeds to tools and decor, we help make your garden dreams come true.',
    address: 'Portland, OR',
    categories: ['Home & Garden', 'Art & Crafts'],
    rating: 4.9,
    totalLikes: 987,
    joinedDate: 'April 2023',
  },
  {
    id: '4',
    name: 'Glow Beauty Co.',
    avatar: '/assets/imgs/woman-face.jpg',
    description:
      'Premium beauty and skincare products for all skin types. Featuring organic, cruelty-free brands and personalized beauty consultations.',
    address: 'Los Angeles, CA',
    categories: ['Beauty', 'Health'],
    rating: 4.7,
    totalLikes: 3102,
    joinedDate: 'February 2023',
  },
  {
    id: '5',
    name: 'Sports Supreme',
    avatar: '/assets/imgs/avatar.jpg',
    description:
      'Quality sporting goods and equipment for athletes of all levels. Expert advice and top brands for every sport.',
    address: 'Chicago, IL',
    categories: ['Sports', 'Fashion'],
    rating: 4.5,
    totalLikes: 1232,
    joinedDate: 'May 2023',
  },
  {
    id: '6',
    name: 'Book Haven',
    avatar: '/assets/imgs/avatar.jpg',
    description:
      "Curated collection of books across all genres. From bestsellers to rare finds, we're passionate about connecting readers with their next favorite book.",
    address: 'Seattle, WA',
    categories: ['Books', 'Art & Crafts'],
    rating: 4.9,
    totalLikes: 2765,
    joinedDate: 'June 2023',
  },
  {
    id: '7',
    name: 'Gadget Galaxy',
    avatar: '/assets/imgs/avatar.jpg',
    description:
      'Innovative tech gadgets and accessories. Stay ahead of the curve with our selection of cutting-edge technology products.',
    address: 'Austin, TX',
    categories: ['Electronics', 'Gaming'],
    rating: 4.4,
    totalLikes: 892,
    joinedDate: 'July 2023',
  },
  {
    id: '8',
    name: 'Artisan Crafts',
    avatar: '/assets/imgs/avatar.jpg',
    description:
      'Handcrafted items made with love. Supporting local artisans and bringing unique, handmade creations to your home.',
    address: 'Denver, CO',
    categories: ['Art & Crafts', 'Home & Garden'],
    rating: 4.8,
    totalLikes: 1543,
    joinedDate: 'August 2023',
  },
  {
    id: '9',
    name: 'Jewelry Gems',
    avatar: '/assets/imgs/woman-face.jpg',
    description:
      'Fine jewelry and custom designs. Specializing in engagement rings, precious stones, and unique pieces for every occasion.',
    address: 'Miami, FL',
    categories: ['Jewelry', 'Fashion'],
    rating: 4.7,
    totalLikes: 2198,
    joinedDate: 'September 2023',
  },
  {
    id: '10',
    name: 'Home Essentials',
    avatar: '/assets/imgs/avatar.jpg',
    description:
      'Everything you need to make your house a home. Quality furniture, decor, and household items at competitive prices.',
    address: 'Boston, MA',
    categories: ['Home & Garden', 'Art & Crafts'],
    rating: 4.6,
    totalLikes: 1876,
    joinedDate: 'October 2023',
  },
];
