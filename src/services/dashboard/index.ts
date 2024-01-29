import { api } from '../api';
import { dashboardAnalyticsUrl } from '@grc/_shared/constant';
import { dashboardAnalyticsTag } from '../tags';

export const dashboardApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    getDashboardAnalytics: builder.query({
      query: (params) => ({
        url: `${dashboardAnalyticsUrl}`,
        params,
      }),
      providesTags: [dashboardAnalyticsTag],
    }),
  }),
});

export const {
  useLazyGetDashboardAnalyticsQuery,
  endpoints: { getDashboardAnalytics },
} = dashboardApi;
