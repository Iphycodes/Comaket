import { AppObject, WalletNamespace } from '@/_shared/namespace';
export namespace DashboardAnalyticsNamespace {
  export interface DashboardAnalytics extends AppObject {
    accruedFees: {
      countdown: number;
      totalAmount: number;
      count: number;
    };
    recentTransactions: WalletNamespace.Wallet[];
    incomeAndDisbursements: {
      value: number;
      totalAmount: number;
      label: string;
    }[];
    cashFlowBreakdown: {
      income: { month: string; totalAmount: number }[];
      disbursements: { month: string; totalAmount: number }[];
    };
    disbursementSummary: { label: string; value: number }[];
  }
}
