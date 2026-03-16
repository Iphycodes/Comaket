import { api } from '../api';
import { disputeTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface Dispute {
  _id: string;
  userId: string;
  orderId?: string;
  type:
    | 'order_issue'
    | 'payment_issue'
    | 'product_quality'
    | 'delivery_issue'
    | 'seller_dispute'
    | 'other';
  subject: string;
  description: string;
  status: 'open' | 'under_review' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high';
  resolution?: string;
  attachments?: string[];
  messages?: { sender: string; message: string; createdAt: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateDisputePayload {
  type: Dispute['type'];
  subject: string;
  description: string;
  orderId?: string;
  attachments?: string[];
}

export interface AddDisputeMessagePayload {
  message: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// RTK QUERY ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

export const disputesApi = api?.injectEndpoints({
  endpoints: (builder) => ({
    // Create a dispute
    createDispute: builder.mutation<Record<string, any>, CreateDisputePayload>({
      query: (payload) => ({
        url: `/disputes`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [disputeTag],
    }),

    // Get my disputes
    getMyDisputes: builder.query<Record<string, any>, Record<string, any> | void>({
      query: (params) => ({
        url: `/disputes/me`,
        method: 'GET',
        params: params || {},
      }),
      providesTags: [disputeTag],
    }),

    // Get single dispute
    getDispute: builder.query<Record<string, any>, string>({
      query: (id) => ({
        url: `/disputes/${id}`,
        method: 'GET',
      }),
      providesTags: [disputeTag],
    }),

    // Add message to dispute
    addDisputeMessage: builder.mutation<
      Record<string, any>,
      { id: string; payload: AddDisputeMessagePayload }
    >({
      query: ({ id, payload }) => ({
        url: `/disputes/${id}/messages`,
        method: 'POST',
        body: payload,
      }),
      invalidatesTags: [disputeTag],
    }),
  }),
});

export const {
  useCreateDisputeMutation,
  useGetMyDisputesQuery,
  useLazyGetMyDisputesQuery,
  useGetDisputeQuery,
  useLazyGetDisputeQuery,
  useAddDisputeMessageMutation,
} = disputesApi;
