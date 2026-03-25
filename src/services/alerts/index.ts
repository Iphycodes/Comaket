import { api } from '../api';
import { alertTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Alert {
  _id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  isRead: boolean;
  entityId?: string;
  entityType?: 'order' | 'listing' | 'store' | 'dispute' | 'review' | 'user';
  metadata?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

export interface AlertsResponse {
  data: Alert[];
  pagination: {
    page: number;
    perPage: number;
    total: number;
    totalPages: number;
  };
}

export interface GetAlertsParams {
  page?: number;
  perPage?: number;
  isRead?: string;
  type?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

const alertsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAlerts: builder.query<Record<string, any>, GetAlertsParams | void>({
      query: (params) => ({
        url: '/alerts',
        method: 'GET',
        params: params || {},
      }),
      providesTags: [alertTag],
    }),

    getUnreadAlertCount: builder.query<Record<string, any>, void>({
      query: () => ({
        url: '/alerts/unread-count',
        method: 'GET',
      }),
      providesTags: [alertTag],
    }),

    markAlertAsRead: builder.mutation<
      Record<string, any>,
      { id: string; options?: Record<string, any> }
    >({
      query: ({ id }) => ({
        url: `/alerts/${id}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: [alertTag],
    }),

    markAllAlertsAsRead: builder.mutation<
      { markedCount: number },
      { options?: Record<string, any> } | void
    >({
      query: () => ({
        url: '/alerts/read-all',
        method: 'PATCH',
      }),
      invalidatesTags: [alertTag],
    }),

    deleteAlert: builder.mutation<{ deleted: boolean }, string>({
      query: (alertId) => ({
        url: `/alerts/${alertId}`,
        method: 'DELETE',
      }),
      invalidatesTags: [alertTag],
    }),

    clearAllAlerts: builder.mutation<{ clearedCount: number }, void>({
      query: () => ({
        url: '/alerts/clear-all',
        method: 'DELETE',
      }),
      invalidatesTags: [alertTag],
    }),
  }),
});

export const {
  useGetAlertsQuery,
  useLazyGetAlertsQuery,
  useGetUnreadAlertCountQuery,
  useMarkAlertAsReadMutation,
  useMarkAllAlertsAsReadMutation,
  useDeleteAlertMutation,
  useClearAllAlertsMutation,
} = alertsApi;
