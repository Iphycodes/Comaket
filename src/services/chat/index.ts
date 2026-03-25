import { api } from '../api';
import { chatTag } from '../tags';

// ═══════════════════════════════════════════════════════════════════════════
// TYPES
// ═══════════════════════════════════════════════════════════════════════════

export interface ChatParticipant {
  _id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  profileImageUrl?: string;
}

export interface ProductContext {
  listingId: string;
  itemName: string;
  price: number;
  image?: string;
}

export interface ProductCard {
  listingId: string;
  itemName: string;
  price: number;
  image?: string;
  storeName?: string;
}

export interface ChatMessage {
  _id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'product_card';
  productCard?: ProductCard | null;
  readBy: string[];
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ChatConversation {
  _id: string;
  participants: ChatParticipant[];
  unreadCounts: Record<string, number>;
  lastMessage: {
    content: string;
    senderId: string;
    type: string;
    createdAt: string;
  } | null;
  productContext?: ProductContext | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateConversationPayload {
  participantId: string;
  productContext?: ProductContext;
  initialMessage?: string;
  participantType?: 'creator' | 'store';
}

export interface SendMessagePayload {
  conversationId: string;
  content: string;
  type?: 'text' | 'image' | 'product_card';
  productCard?: ProductCard;
  attachments?: string[];
}

export interface ConversationListParams {
  page?: number;
  perPage?: number;
}

export interface MessageListParams {
  conversationId: string;
  page?: number;
  perPage?: number;
  before?: string;
}

// ═══════════════════════════════════════════════════════════════════════════
// ENDPOINTS
// ═══════════════════════════════════════════════════════════════════════════

const chatApi = api.injectEndpoints({
  endpoints: (builder) => ({
    // ─── Conversations ─────────────────────────────────────────
    getConversations: builder.query<Record<string, any>, ConversationListParams | void>({
      query: (params) => ({
        url: '/chat/conversations',
        method: 'GET',
        params: params || {},
      }),
      providesTags: [chatTag],
    }),

    getConversation: builder.query<Record<string, any>, string>({
      query: (id) => ({
        url: `/chat/conversations/${id}`,
        method: 'GET',
      }),
      providesTags: [chatTag],
    }),

    createConversation: builder.mutation<
      Record<string, any>,
      CreateConversationPayload & { options?: Record<string, any> }
    >({
      query: ({ options: _options, ...body }) => ({
        url: '/chat/conversations',
        method: 'POST',
        body,
      }),
      invalidatesTags: [chatTag],
    }),

    // ─── Messages ──────────────────────────────────────────────
    getMessages: builder.query<Record<string, any>, MessageListParams>({
      query: ({ conversationId, ...params }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: 'GET',
        params,
      }),
      providesTags: (_result, _error, { conversationId }) => [
        { type: chatTag, id: `messages-${conversationId}` },
      ],
    }),

    sendMessageRest: builder.mutation<
      Record<string, any>,
      SendMessagePayload & { options?: Record<string, any> }
    >({
      query: ({ conversationId, options: _options, ...body }) => ({
        url: `/chat/conversations/${conversationId}/messages`,
        method: 'POST',
        body,
      }),
      invalidatesTags: (_result, _error, { conversationId }) => [
        chatTag,
        { type: chatTag, id: `messages-${conversationId}` },
      ],
    }),

    // ─── Read Receipts ─────────────────────────────────────────
    markConversationRead: builder.mutation<
      Record<string, any>,
      { conversationId: string; options?: Record<string, any> }
    >({
      query: ({ conversationId }) => ({
        url: `/chat/conversations/${conversationId}/read`,
        method: 'PATCH',
      }),
      invalidatesTags: [chatTag],
    }),

    getChatUnreadCount: builder.query<Record<string, any>, void>({
      query: () => ({
        url: '/chat/unread-count',
        method: 'GET',
      }),
      providesTags: [chatTag],
    }),

    // ─── Search ────────────────────────────────────────────────
    searchChats: builder.query<Record<string, any>, string>({
      query: (q) => ({
        url: '/chat/search',
        method: 'GET',
        params: { q },
      }),
    }),
  }),
});

export const {
  useGetConversationsQuery,
  useLazyGetConversationsQuery,
  useGetConversationQuery,
  useLazyGetConversationQuery,
  useCreateConversationMutation,
  useGetMessagesQuery,
  useLazyGetMessagesQuery,
  useSendMessageRestMutation,
  useMarkConversationReadMutation,
  useGetChatUnreadCountQuery,
  useLazyGetChatUnreadCountQuery,
  useSearchChatsQuery,
  useLazySearchChatsQuery,
} = chatApi;

export { chatApi };
