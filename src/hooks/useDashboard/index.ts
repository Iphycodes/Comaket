import { selectDashboardAnalyticsData } from '@grc/redux/selectors/dashboard-analytics';
import { useAppSelector } from '@grc/redux/store';
import { useLazyGetDashboardAnalyticsQuery } from '@grc/services/dashboard';
import { useEffect } from 'react';

interface useDashboardProps {
  key?: string;
  filter?: Record<string, any>;
  callDashboardAnalytics: boolean;
}

interface useDashboardReturnProps {
  dashboardAnalyticsData: Record<any, string> | any;
  getDashboardAnalyticsResponse: Record<string, any>;
}

export const useDashboard = ({
  callDashboardAnalytics,
}: useDashboardProps): useDashboardReturnProps => {
  const [triggerDashboardAnalytics, getDashboardAnalyticsResponse] =
    useLazyGetDashboardAnalyticsQuery();
  const { wallet } = useAppSelector((state) => state.auth);
  const walletId = wallet?.id;

  const params = {
    filter: JSON.stringify({ virtualAccount: walletId }),
  };

  const dashboardAnalyticsData = useAppSelector((state) =>
    selectDashboardAnalyticsData(state, params)
  );

  useEffect(() => {
    if (callDashboardAnalytics) triggerDashboardAnalytics(params);
  }, [callDashboardAnalytics, walletId]);

  return {
    dashboardAnalyticsData,
    getDashboardAnalyticsResponse,
  };
};
