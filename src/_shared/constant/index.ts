import moment from 'moment';
import { faker } from '@faker-js/faker';

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
/**Token**/

export const AUTH_TOKEN_KEY = process.env.NEXT_PUBLIC_TOKEN_STORAGE_KEY as string;
export const appName = 'Giro';
export const dateFormat = 'DD-MM-YYYY';

export const scrollOption: ScrollIntoViewOptions = {
  inline: 'center',
  block: 'nearest',
  behavior: 'smooth',
};

export const status = [
  { label: 'All', value: '' },
  { label: 'Success', value: 'successful' },
  { label: 'Failed', value: 'failed' },
];

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

export const walletBalance = (data: Array<Record<string, any>>) => {
  return data?.reduce((curr, acc) => {
    return curr + acc.amount;
  }, 0);
};

export const statsReducer = (data: Array<Record<string, any>>) => {
  return data?.reduce((acc, stat) => {
    return {
      ...acc,
      [stat.status]: stat.no_of_requests,
    };
  }, {});
};

export const billingReducer = (data: Array<Record<string, any>>) => {
  return data?.reduce((acc, stat) => {
    return {
      ...acc,
      [stat.status === 0 ? 'pending' : stat.status === 1 ? 'paid' : 0]: {
        no_of_invoices: stat?.no_of_invoices,
        total_cost: stat?.total_cost,
      },
    };
  }, {});
};

export const countries = [
  {
    label: 'Nigeria',
    value: 'nigeria',
  },
  {
    label: 'Ghana',
    value: 'ghana',
  },
  {
    label: 'Kenya',
    value: 'kenya',
  },
  {
    label: 'South Africa',
    value: 'south-africa',
  },
];

export const categories = [
  {
    label: 'Fintech',
    value: 'fintech',
  },
  {
    label: 'Ecommerce',
    value: 'ecommerce',
  },
];

export const businessStatus = [
  {
    label: 'Disabled',
    value: 'disabled',
  },
  {
    label: 'Blocked',
    value: 'blocked',
  },
  {
    label: 'Active',
    value: 'active',
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Inactive',
    value: 'inactive',
  },
  {
    label: 'Rejected',
    value: 'rejected',
  },
];
export const gender = [
  {
    label: 'Male',
    value: 'male',
  },
  {
    label: 'Female',
    value: 'female',
  },
];

export const business_category = [
  {
    label: 'Small and Medium Scale Business',
    value: 'small_medium',
  },
  {
    label: 'Fintech and Loans Provider',
    value: 'fintech_loan',
  },
  {
    label: 'Online Store',
    value: 'online_store',
  },
  {
    label: 'Fashion and Apparel',
    value: 'fashion_apparel',
  },
  {
    label: 'Confectionary / Restaurant',
    value: 'confectionary_restaurant',
  },
  {
    label: 'Event Management',
    value: 'event_management',
  },
];

export const IdentityType = [
  {
    label: 'BVN',
    value: 'bvn',
  },
];

export const transactionData = [
  {
    entry: 'debit',
    id: '00001',
    createdAt: '12/06/23',
    time: '00:34:12',
    amount: 45023400,
    currency: 'NGN',
    recipient: 'john doe',
    status: 'successful',
  },
  {
    entry: 'debit',
    id: '00002',
    createdAt: '12/06/23',
    time: '00:34:12',
    amount: 45023400,
    currency: 'NGN',
    recipient: 'john doe',
    status: 'processing',
  },
  {
    entry: 'credit',
    id: '00003',
    createdAt: '12/06/23',
    time: '00:34:12',
    amount: 45023400,
    currency: 'NGN',
    recipient: 'sinzu money',
    status: 'successful',
  },
  // {
  //   entry: 'credit',
  //   id: '00004',
  //   createdAt: '12/06/23',
  //   time: '00:34:12',
  //   amount: 45023400,
  //   currency: 'NGN',
  //   recipient: 'sinzu money',
  //   status: 'successful',
  // },
  {
    entry: 'debit',
    id: '00005',
    createdAt: '12/06/23',
    time: '00:34:12',
    amount: 45023400,
    currency: 'NGN',
    recipient: 'john doe',
    status: 'failed',
  },
  {
    entry: 'credit',
    id: '00003',
    createdAt: '12/06/23',
    time: '00:34:12',
    amount: 45023400,
    currency: 'NGN',
    recipient: 'sinzu money',
    status: 'successful',
  },
];

export const statisticsFilter = [
  { label: 'all', value: 'all' },
  { label: 'week', value: 'week' },
  { label: 'month', value: 'month' },
  { label: 'quarter', value: 'quarter' },
  { label: 'year', value: 'year' },
];

export const statCardProps = [
  {
    title: 'Total',
    value: 10034000,
  },
  {
    title: 'Pending',
    value: 3,
  },
  {
    title: 'Processing',
    value: 1,
  },
  {
    title: 'Successful',
    value: 401030,
  },
  {
    title: 'Failed',
    value: 2,
  },
];

export const mockTransactionAnalyticsData = {
  labels: [
    'Pending Transactions',
    'Processing Transactions',
    'Successful Transactions',
    'Failed Transactions',
  ],
  datasets: [
    {
      backgroundColor: ['#B21F00', '#C9DE00', '#2FDE00', '#00A6B4', '#6800B4'],
      hoverBackgroundColor: ['#501800', '#4B5000', '#175000', '#003350', '#35014F'],
      data: [300, 50, 430, 223],
    },
  ],
};

const labels = Array.from({ length: 9 }, (_, index) =>
  moment().subtract(index, 'months').format('MMMM')
);
export const mockTransactionAnalyticsData2 = {
  labels: labels,
  datasets: [
    {
      label: 'My First Dataset',
      data: [65, 59, 80, 81, 56, 55, 40],
      backgroundColor: 'rgba(30, 136, 229, 1)',
      borderColor: 'rgba(30, 136, 229, 0.2)',
      borderWidth: 2,
      // barThickness: 70,
    },
  ],
};

export const comparativeAnalysisData = {
  labels,
  datasets: [
    {
      label: 'Dataset 1',
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(255, 99, 132, 0.5)',
    },
    {
      label: 'Dataset 2',
      data: labels.map(() => faker.number.int({ min: 0, max: 1000 })),
      backgroundColor: 'rgba(53, 162, 235, 0.5)',
    },
  ],
};

export const smoothLineChartData = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: '',
      data: [50, 60, 55, 73, 65, 90, 75],
      fill: true,
      backgroundColor: 'rgba(30, 136, 229, 0.2)',
      borderColor: 'rgba(30, 136, 229, 1)',
      borderWidth: 2,
    },
  ],
};

export const CashFlowAnalytics = [
  { type: 'income', amount: 9000000, count: 60200 },
  { type: 'disbursements', amount: 7500000, count: 40 },
];
// export const MockVirtualAccounts = [];
export const MockVirtualAccounts: any = [
  { id: '001', accountName: 'The 30th Concept', accountNumber: '004002001', amount: 3300000000 },
  { id: '002', accountName: 'Jay Doe Biz', accountNumber: '004002003', amount: 52000000 },
];
