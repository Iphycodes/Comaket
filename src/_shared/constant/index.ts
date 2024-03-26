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

export const mockMarketItems: Partial<mockMarketItemType[]> = [
  {
    postUserProfile: {
      profilePicUrl: '/assets/imgs/debit-logo.png',
      userName: 'odogwu_1',
      businessName: 'Odogwu Laptops',
    },
    postAccountType: 'vendor',
    sponsored: true,
    sold: false,
    postImgUrls: ['/assets/imgs/macbook.jpg'],
    askingPrice: {
      price: 5000000,
      negotiable: true,
    },
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
  },
  {
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
  },
  {
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
  },
];
