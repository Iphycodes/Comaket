import Cookie from 'js-cookie';
import { AUTH_TOKEN_KEY, COLOR_LIST_ALPHA } from '@grc/_shared/constant';
import { MenuProps } from 'antd';
import { get, capitalize, isEmpty } from 'lodash';

export const truncateText = (text: string) => {
  return text.split('\n').slice(0, 2).join('\n') + '...';
};

export const numberFormat = (value: number | bigint, currency?: string) => {
  const formatter = new Intl.NumberFormat();
  return currency ? currency + formatter.format(value) : formatter.format(value);
};

export const transactionBal = (transBalances: Record<string, any>) => {
  return Object.values(transBalances)?.reduce((acc, curr) => acc + curr?.availableAmount, 0);
};

export const truncate = (text: string, length = 8) => {
  return text.length <= length ? text : text.slice(0, length).concat('...');
};

const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
export const isValidPassword = (password: string) => {
  return passwordRegex.test(password);
};

type AppCookieProp = {
  cookie?: string | null;
  allowDelete?: boolean;
};

/**handle token inside cookie, so it is available for both client and server rendering**/
export const AppCookie = ({ cookie = null, allowDelete = false }: AppCookieProp) => {
  if (cookie && !allowDelete) {
    Cookie.set(AUTH_TOKEN_KEY, cookie);
  } else {
    Cookie.remove(AUTH_TOKEN_KEY);
  }
  return;
};

export type MenuItem = Required<MenuProps>['items'][number];

export type NavItem = {
  label: string;
  key: string;
  destination: string;
  icon: React.ReactNode;
  items?: NavItem[];
};

export const getItem = (menuItem: NavItem): MenuItem => {
  return {
    key: menuItem.key,
    icon: menuItem.icon,
    items: menuItem.items,
    label: menuItem.label,
  } as MenuItem;
};

export const formatNumber = (num: number, precision: number = 2): string | number => {
  const map = [
    { suffix: 'T', threshold: 1e12 },
    { suffix: 'B', threshold: 1e9 },
    { suffix: 'M', threshold: 1e6 },
    { suffix: 'K', threshold: 1e3 },
    { suffix: '', threshold: 1 },
  ];

  const found = map.find((x) => Math.abs(num) >= x.threshold);

  if (found) {
    if (num < 1000) {
      const formatted = (num / found.threshold).toFixed(0) + found.suffix;
      return formatted;
    }
    const formatted = (num / found.threshold).toFixed(precision) + found.suffix;
    return formatted;
  }

  return num;
};
export const calculateTotal = (data: any) => {
  return data.reduce((total: number, value: number) => total + value, 0);
};

export const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'successful':
      return 'green-500';
    case 'pending':
      return 'yellow-500';
    case 'processing':
      return 'blue';
    case 'total':
      return 'slate-900';
    case 'failed':
      return 'red-500';
    default:
      return 'slate-900';
  }
};
export enum GET_COLOR {
  successful = 'green-500',
  pending = 'yellow-500',
  processing = 'blue',
  total = 'slate-900',
  failed = 'red-500',
}

export const getRandomColorByString = (name: string) => {
  name = name?.toUpperCase();
  return get(COLOR_LIST_ALPHA, getFirstCharacter(name) ?? 'A') ?? '#7B68ED';
};

export const getFirstCharacter = (name: string) => {
  return capitalize(name?.charAt(0));
};

export const getDate = (datestring: string) => {
  const originalDate = new Date(datestring);

  const day = originalDate.getDate().toString().padStart(2, '0');
  const month = (originalDate.getMonth() + 1).toString().padStart(2, '0');
  const year = originalDate.getFullYear().toString().slice(2);
  const hours = originalDate.getHours() % 12 || 12; // Convert 24-hour format to 12-hour format
  const minutes = originalDate.getMinutes().toString().padStart(2, '0');
  const period = originalDate.getHours() < 12 ? 'am' : 'pm';

  // Create the formatted date string
  const formattedDate = `${day}-${month}-${year} ${hours}:${minutes}${period}`;
  return formattedDate;
};

export const generateChartData = (cashFlowBreakdown: {
  income: { month: string; totalAmount: number }[];
  disbursements: { month: string; totalAmount: number }[];
}) => {
  const labels = (cashFlowBreakdown.income ?? []).map((entry) => entry.month);
  const incomeData = (cashFlowBreakdown.income ?? []).map((entry) => entry.totalAmount / 100);
  const disbursementsData = (cashFlowBreakdown.disbursements ?? []).map(
    (entry) => entry.totalAmount / 100
  );

  const chartData = {
    labels,
    datasets: [
      {
        label: 'Income',
        data: incomeData,
        fill: false,
        backgroundColor: 'rgba(30, 136, 229, 0.2)',
        borderColor: 'rgba(30, 136, 229, 1)',
        borderWidth: 2,
      },
      {
        label: 'Disbursements',
        data: disbursementsData,
        fill: false,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        borderWidth: 2,
      },
    ],
  };

  const emptyLineChartData = {
    labels: ['No Data Available'],
    datasets: [
      {
        label: 'No Data Available',
        data: [0],
        fill: false,
        borderColor: 'gray',
        borderWidth: 2,
        pointRadius: 0,
      },
    ],
  };
  if (isEmpty(incomeData) && isEmpty(disbursementsData)) {
    return emptyLineChartData;
  }

  return chartData;
};

export const generateDisbursementData = (
  data: { label: string; value: number }[] | Record<string, any>[]
) => {
  const transformedLabel: Record<string, any> = {
    totalSuccessfulDisbursements: 'Successful Disbursements',
    totalProcessingDisbursements: 'Processing Disbursements',
    totalFailedDisbursements: 'Failed Disbursements',
    totalSuccessfulTransactions: 'Successful Disbursements',
    totalProcessingTransactions: 'Processing Disbursements',
    totalFailedTransactions: 'Failed Disbursements',
  };
  const labels = data.map(({ label }) => transformedLabel[label]);
  const disBursementData = data.map(({ value }) => value);

  const emptyDoughnutChartData = {
    labels: ['No Data Available'],
    datasets: [
      {
        data: [1],
        backgroundColor: ['gray'],
      },
    ],
  };

  const formattedData = {
    labels,
    datasets: [
      {
        backgroundColor: ['#2FDE00', '#C9DE00', '#B21F00'],
        hoverBackgroundColor: ['#175000', '#4B5000', '#501800'],
        data: disBursementData,
      },
    ],
  };
  if (
    (formattedData.datasets &&
      formattedData.datasets[0].data[0] === 0 &&
      formattedData.datasets[0].data[1] === 0 &&
      formattedData.datasets[0].data[2] === 0) ||
    isEmpty(disBursementData)
  ) {
    return emptyDoughnutChartData;
  }

  return formattedData;
};

export const camelCaseToSentence = (camelCaseString: string) => {
  const words = camelCaseString.split(/(?=[A-Z])/);
  const capitalizedWords = words.map((word) => word.charAt(0).toUpperCase() + word.slice(1));
  const sentence = capitalizedWords.join(' ');
  return sentence;
};

export const convertCamelCaseToSentence = (camelCaseText: string) => {
  const sentence = camelCaseText.replace(/([a-z])([A-Z])/g, '$1 $2');

  return sentence.charAt(0).toUpperCase() + sentence.slice(1);
};
