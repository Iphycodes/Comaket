'use client';

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ArrowLeft,
  Search,
  Send,
  Paperclip,
  Check,
  CheckCheck,
  UserPlus,
  MessageCircle,
  Inbox,
  X,
} from 'lucide-react';
import { message as antMessage } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { numberFormat, getFirstCharacter, getRandomColorByString } from '@grc/_shared/helpers';
import { Currencies } from '@grc/_shared/constant';
import {
  useGetConversationsQuery,
  useGetConversationQuery,
  useGetMessagesQuery,
  useCreateConversationMutation,
  useSendMessageRestMutation,
  useMarkConversationReadMutation,
  ChatMessage,
} from '@grc/services/chat';
import { useSocket } from '@grc/providers/socket-provider';
import { useSelector } from 'react-redux';

// ═══════════════════════════════════════════════════════════════════════════
// HELPERS
// ═══════════════════════════════════════════════════════════════════════════

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' });
}

function formatMessageTime(dateStr: string): string {
  return new Date(dateStr).toLocaleTimeString('en-NG', { hour: '2-digit', minute: '2-digit' });
}

function getOtherParticipant(participants: any[], currentUserId: string) {
  return participants?.find((p: any) => (p._id || p) !== currentUserId) || participants?.[0];
}

function getOtherParticipantId(participants: any[], currentUserId: string): string {
  const other = participants?.find((p: any) => (p._id || p) !== currentUserId);
  return other?._id || other || '';
}

// Get display info from participantDetails map (denormalized on conversation)
function getDisplayInfo(
  conversation: any,
  currentUserId: string
): {
  displayName: string;
  avatar?: string;
  type?: string;
  entityId?: string;
  username?: string;
  isVerified?: boolean;
  isSuperVerified?: boolean;
} {
  const details = conversation?.participantDetails;
  if (details) {
    // participantDetails is a map: { userId: { displayName, avatar, type, entityId, username } }
    const otherUserId = getOtherParticipantId(conversation.participants, currentUserId);
    const info = details[otherUserId] || details?.get?.(otherUserId);
    if (info?.displayName) return info;
  }

  // Fallback to populated participant data
  const other = getOtherParticipant(conversation?.participants || [], currentUserId);
  return {
    displayName: other
      ? `${other.firstName || ''} ${other.lastName || ''}`.trim() || 'User'
      : 'User',
    avatar: other?.profileImageUrl || other?.avatar || undefined,
    type: 'user',
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// MESSAGE BUBBLE
// ═══════════════════════════════════════════════════════════════════════════
// VERIFIED BADGE
// ═══════════════════════════════════════════════════════════════════════════

const VerifiedBadge: React.FC<{
  isVerified?: boolean;
  isSuperVerified?: boolean;
  size?: number;
}> = ({ isVerified, isSuperVerified, size = 16 }) => {
  if (!isVerified && !isSuperVerified) return null;
  return (
    <i
      className={`ri-verified-badge-fill ${isSuperVerified ? 'text-[#E8A800]' : 'text-[#1D9BF0]'}`}
      style={{ fontSize: size }}
    />
  );
};

// ═══════════════════════════════════════════════════════════════════════════

const MessageBubble: React.FC<{
  message: ChatMessage;
  isMine: boolean;
  otherUserId: string;
}> = ({ message, isMine, otherUserId }) => {
  const isRead = message.readBy?.includes(otherUserId);

  return (
    <div className={`flex ${isMine ? 'justify-end' : 'justify-start'} mb-1`}>
      <div
        className={`max-w-[75%] rounded-2xl px-3.5 py-2 ${
          isMine
            ? 'bg-emerald-600 text-white rounded-br-md'
            : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 rounded-bl-md'
        }`}
      >
        {/* Product card embed */}
        {message.type === 'product_card' && message.productCard && (
          <div
            className={`mb-2 rounded-lg overflow-hidden cursor-pointer ${
              isMine ? 'bg-emerald-700/50' : 'bg-white dark:bg-neutral-700'
            }`}
          >
            {message.productCard.image && (
              <img
                src={message.productCard.image}
                alt={message.productCard.itemName}
                className="w-full h-32 object-cover"
              />
            )}
            <div className="p-2">
              <p
                className={`text-xs font-semibold truncate ${
                  isMine ? 'text-white' : 'text-neutral-900 dark:text-neutral-100'
                }`}
              >
                {message.productCard.itemName}
              </p>
              <p className={`text-xs ${isMine ? 'text-emerald-200' : 'text-neutral-500'}`}>
                {numberFormat((message.productCard.price || 0) / 100, Currencies.NGN)}
              </p>
            </div>
          </div>
        )}

        {/* Image attachments */}
        {message.attachments?.length > 0 && (
          <div className="mb-1.5">
            {message.attachments.map((url, i) => (
              <img
                key={i}
                src={url}
                alt=""
                className="rounded-lg max-w-full max-h-48 object-cover mb-1"
              />
            ))}
          </div>
        )}

        {/* Text content */}
        <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>

        {/* Time + read receipts */}
        <div
          className={`flex items-center gap-1 mt-0.5 ${isMine ? 'justify-end' : 'justify-start'}`}
        >
          <span className={`text-[10px] ${isMine ? 'text-emerald-200' : 'text-neutral-400'}`}>
            {formatMessageTime(message.createdAt)}
          </span>
          {isMine &&
            (isRead ? (
              <CheckCheck size={12} className="text-blue-300" />
            ) : (
              <Check size={12} className="text-emerald-300" />
            ))}
        </div>
      </div>
    </div>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// CONVERSATION LIST ITEM
// ═══════════════════════════════════════════════════════════════════════════

const ConversationItem: React.FC<{
  conversation: any;
  currentUserId: string;
  isActive: boolean;
  onClick: () => void;
  isOnline: boolean;
  isMarkedRead?: boolean;
  localUnread?: number;
}> = ({ conversation, currentUserId, isActive, onClick, isOnline, isMarkedRead, localUnread }) => {
  const info = getDisplayInfo(conversation, currentUserId);
  const name = info.displayName;
  const avatar = info.avatar || null;
  const serverUnread = conversation.unreadCounts?.[currentUserId] || 0;
  const unread = isActive || isMarkedRead ? 0 : Math.max(serverUnread, localUnread || 0);
  const lastMsg = conversation.lastMessage;

  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors ${
        isActive
          ? 'bg-blue-50 dark:bg-blue-900/20 border-l-2 border-blue'
          : 'hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
      }`}
    >
      {/* Avatar with online dot */}
      <div className="relative flex-shrink-0">
        {avatar ? (
          <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold"
            style={{ backgroundColor: getRandomColorByString(name) }}
          >
            {getFirstCharacter(name)}
          </div>
        )}
        {isOnline && (
          <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-400 border-2 border-white dark:border-neutral-900" />
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <span
            className={`text-sm truncate flex items-center gap-1 ${
              unread > 0
                ? 'font-bold text-neutral-900 dark:text-white'
                : 'font-medium text-neutral-700 dark:text-neutral-200'
            }`}
          >
            {name}
            <VerifiedBadge
              isVerified={info.isVerified}
              isSuperVerified={info.isSuperVerified}
              size={14}
            />
          </span>
          <span className="text-[10px] text-neutral-400 flex-shrink-0 ml-2">
            {lastMsg?.createdAt ? timeAgo(lastMsg.createdAt) : ''}
          </span>
        </div>
        {info.username && (
          <p className="text-[10px] text-neutral-400 truncate -mt-0.5">@{info.username}</p>
        )}
        <div className="flex items-center justify-between mt-0.5">
          <p
            className={`text-xs truncate ${
              unread > 0
                ? 'text-neutral-700 dark:text-neutral-300 font-medium'
                : 'text-neutral-500 dark:text-neutral-400'
            }`}
          >
            {lastMsg?.content ||
              (lastMsg?.type === 'product_card' ? '📦 Product shared' : 'Start a conversation')}
          </p>
          {unread > 0 && (
            <span className="ml-2 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-emerald-500 text-white text-[10px] font-bold px-1 flex-shrink-0">
              {unread > 99 ? '99+' : unread}
            </span>
          )}
        </div>
      </div>
    </button>
  );
};

// ═══════════════════════════════════════════════════════════════════════════
// TYPING INDICATOR
// ═══════════════════════════════════════════════════════════════════════════

const TypingIndicator: React.FC = () => (
  <div className="flex justify-start mb-1">
    <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl rounded-bl-md px-4 py-2.5 flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="w-1.5 h-1.5 rounded-full bg-neutral-400"
          animate={{ y: [0, -4, 0] }}
          transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
        />
      ))}
    </div>
  </div>
);

// ═══════════════════════════════════════════════════════════════════════════
// MAIN CHAT PAGE COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

const ChatPage: React.FC = () => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationIdParam = searchParams?.get('conversation');

  const authState = useSelector((state: any) => state.auth);
  const isAuthenticated = authState?.isAuthenticated;
  const currentUserId = authState?.authData?.user?._id || authState?.authData?._id;
  const sessionToken = authState?.sessionToken;
  const {
    socket,
    onlineUsers,
    sendMessage: socketSendMessage,
    joinConversation,
    leaveConversation,
    emitTyping,
    emitStopTyping,
    markRead,
    checkOnlineStatus,
  } = useSocket();

  // State
  const [activeConversationId, setActiveConversationId] = useState<string | null>(
    conversationIdParam || null
  );
  const [messageInput, setMessageInput] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<Set<string>>(new Set());
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [showNewChatSearch, setShowNewChatSearch] = useState(false);
  const [pendingAttachments, setPendingAttachments] = useState<
    {
      url: string;
      preview: string;
      isVideo: boolean;
    }[]
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newChatQuery, setNewChatQuery] = useState('');
  const [newChatResults, setNewChatResults] = useState<any[]>([]);
  const [searchingNewChat, setSearchingNewChat] = useState(false);
  const [readConversations, setReadConversations] = useState<Set<string>>(new Set());
  const [localUnreadCounts, setLocalUnreadCounts] = useState<Record<string, number>>({});

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messageInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const activeConversationRef = useRef<string | null>(activeConversationId);
  activeConversationRef.current = activeConversationId;

  // Queries
  const {
    data: conversationsData,
    isLoading: loadingConversations,
    refetch: refetchConversations,
  } = useGetConversationsQuery({ perPage: 50 }, { skip: !isAuthenticated, pollingInterval: 10000 });
  const {
    data: messagesData,
    isLoading: loadingMessages,
    refetch: refetchMessages,
  } = useGetMessagesQuery(
    { conversationId: activeConversationId!, perPage: 100 },
    { skip: !activeConversationId || !isAuthenticated, pollingInterval: 5000 }
  );

  // Mutations
  const [sendMessageRest] = useSendMessageRestMutation();
  const [markConversationRead] = useMarkConversationReadMutation();
  const [createConversation] = useCreateConversationMutation();

  const conversations: any[] = conversationsData?.data?.data || conversationsData?.data || [];
  const serverMessages: ChatMessage[] = messagesData?.data?.data || messagesData?.data || [];

  // Merge server messages with local optimistic messages
  const allMessages = useMemo(() => {
    const serverIds = new Set(serverMessages.map((m) => m._id));
    const uniqueLocal = localMessages.filter((m) => !serverIds.has(m._id));
    return [...serverMessages, ...uniqueLocal].sort(
      (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    );
  }, [serverMessages, localMessages]);

  // Check online status of all conversation participants
  useEffect(() => {
    if (conversations.length > 0 && socket) {
      const otherIds = conversations
        .map((c: any) => getOtherParticipantId(c.participants, currentUserId))
        .filter(Boolean);
      if (otherIds.length > 0) checkOnlineStatus(otherIds);
    }
  }, [conversations.length, socket, currentUserId, checkOnlineStatus]);

  // Fetch single conversation details (backup for when conversations list hasn't refreshed yet)
  const { data: singleConvData } = useGetConversationQuery(activeConversationId!, {
    skip: !activeConversationId,
  });
  const singleConversation = singleConvData?.data || null;

  const activeConversation =
    conversations.find((c: any) => c._id === activeConversationId) || singleConversation;
  const activeDisplayInfo = activeConversation
    ? getDisplayInfo(activeConversation, currentUserId)
    : null;
  const otherUserId = activeConversation
    ? getOtherParticipantId(activeConversation.participants, currentUserId)
    : '';

  // ─── Socket event listeners ───────────────────────────────────
  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = ({
      message: msg,
      conversationId,
    }: {
      message: ChatMessage;
      conversationId: string;
    }) => {
      const currentActive = activeConversationRef.current;
      if (conversationId === currentActive && msg.senderId !== currentUserId) {
        // Refetch messages from server for reliability
        refetchMessages();
        // Auto-mark as read since user is viewing this conversation
        markRead(conversationId);
        markConversationRead({ conversationId, options: { noSuccessMessage: true } }).then(() =>
          refetchConversations()
        );
        setReadConversations((prev) => new Set(prev).add(conversationId));
        // Auto-scroll
        setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 300);
      }
      // If this message is NOT for the active conversation, increment local unread and remove from readConversations
      if (conversationId !== currentActive && msg.senderId !== currentUserId) {
        setReadConversations((prev) => {
          const next = new Set(prev);
          next.delete(conversationId);
          return next;
        });
        setLocalUnreadCounts((prev) => ({
          ...prev,
          [conversationId]: (prev[conversationId] || 0) + 1,
        }));
      }
      // Refetch conversations list to update last message preview and unread counts
      setTimeout(() => refetchConversations(), 500);
    };

    const handleTyping = ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      if (conversationId === activeConversationRef.current && userId !== currentUserId) {
        setTypingUsers((prev) => new Set(prev).add(userId));
      }
    };

    const handleStopTyping = ({
      conversationId,
      userId,
    }: {
      conversationId: string;
      userId: string;
    }) => {
      if (conversationId === activeConversationRef.current) {
        setTypingUsers((prev) => {
          const next = new Set(prev);
          next.delete(userId);
          return next;
        });
      }
    };

    const handleMessageRead = ({
      conversationId,
      readBy: _readBy,
    }: {
      conversationId: string;
      readBy: string;
    }) => {
      if (conversationId === activeConversationRef.current) {
        // Refetch messages to update read receipts (double blue ticks)
        refetchMessages();
      }
    };

    // Backend tells us to mark as read because we're viewing the conversation
    const handleAutoMarkRead = ({ conversationId }: { conversationId: string }) => {
      if (conversationId === activeConversationRef.current) {
        markRead(conversationId);
        markConversationRead({ conversationId, options: { noSuccessMessage: true } }).then(() =>
          setTimeout(() => refetchConversations(), 300)
        );
        setReadConversations((prev) => new Set(prev).add(conversationId));
      }
    };

    socket.on('newMessage', handleNewMessage);
    socket.on('messageRead', handleMessageRead);
    socket.on('autoMarkRead', handleAutoMarkRead);
    socket.on('userTyping', handleTyping);
    socket.on('userStopTyping', handleStopTyping);

    return () => {
      socket.off('newMessage', handleNewMessage);
      socket.off('messageRead', handleMessageRead);
      socket.off('autoMarkRead', handleAutoMarkRead);
      socket.off('userTyping', handleTyping);
      socket.off('userStopTyping', handleStopTyping);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [socket, currentUserId]);

  // ─── Join/leave conversation rooms ────────────────────────────
  useEffect(() => {
    if (activeConversationId) {
      joinConversation(activeConversationId);
      markRead(activeConversationId);
      // Also call REST to clear unread count in cache
      markConversationRead({
        conversationId: activeConversationId,
        options: { noSuccessMessage: true },
      }).then(() => refetchConversations());
      setReadConversations((prev) => new Set(prev).add(activeConversationId));
      setLocalUnreadCounts((prev) => ({ ...prev, [activeConversationId]: 0 }));
      setLocalMessages([]);
      setTypingUsers(new Set());
    }
    return () => {
      if (activeConversationId) {
        leaveConversation(activeConversationId);
      }
    };
  }, [activeConversationId, joinConversation, leaveConversation, markRead, markConversationRead]);

  // ─── Auto-scroll on messages load ─────────────────────────────
  useEffect(() => {
    if (allMessages.length > 0) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 200);
    }
  }, [allMessages.length]);

  // ─── Set active conversation from URL param ───────────────────
  useEffect(() => {
    if (conversationIdParam) setActiveConversationId(conversationIdParam);
  }, [conversationIdParam]);

  // ─── Send message ─────────────────────────────────────────────
  const handleSend = useCallback(async () => {
    const text = messageInput.trim();
    const hasAttachments = pendingAttachments.length > 0;
    if ((!text && !hasAttachments) || !activeConversationId) return;

    const attachments = [...pendingAttachments];
    setMessageInput('');
    setPendingAttachments([]);
    emitStopTyping(activeConversationId);

    const msgContent = text || (attachments.some((a) => a.isVideo) ? '🎥 Video' : '📷 Photo');
    const msgType = hasAttachments ? 'image' : 'text';
    const msgAttachments = attachments.map((a) => a.url);

    // Optimistic local message
    const tempMsg: ChatMessage = {
      _id: `temp-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: currentUserId,
      content: msgContent,
      type: msgType,
      readBy: [currentUserId],
      attachments: msgAttachments,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setLocalMessages((prev) => [...prev, tempMsg]);

    // Always use REST to persist, socket delivers real-time
    try {
      await sendMessageRest({
        conversationId: activeConversationId,
        content: msgContent,
        type: msgType,
        attachments: msgAttachments,
        options: { noSuccessMessage: true },
      }).unwrap();
      // Remove optimistic message — server data will replace it via cache refetch
      setLocalMessages((prev) => prev.filter((m) => m._id !== tempMsg._id));
    } catch {
      antMessage.error('Failed to send message');
    }

    setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    messageInputRef.current?.focus();
  }, [
    messageInput,
    activeConversationId,
    currentUserId,
    socketSendMessage,
    sendMessageRest,
    emitStopTyping,
    pendingAttachments,
  ]);

  // ─── Typing indicator ─────────────────────────────────────────
  const handleInputChange = (value: string) => {
    setMessageInput(value);
    if (!activeConversationId) return;

    if (!isTyping) {
      setIsTyping(true);
      emitTyping(activeConversationId);
    }

    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
      emitStopTyping(activeConversationId);
    }, 2000);
  };

  // ─── New chat search (search creators/stores) ──────────────────
  useEffect(() => {
    if (!showNewChatSearch || newChatQuery.trim().length < 2) {
      setNewChatResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setSearchingNewChat(true);
      try {
        const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:5000/api/v1';
        const headers: Record<string, string> = sessionToken
          ? { Authorization: `Bearer ${sessionToken}` }
          : {};
        const q = encodeURIComponent(newChatQuery.trim());

        // Search both creators and stores in parallel
        const [creatorsRes, storesRes] = await Promise.all([
          fetch(`${baseUrl}/creators?search=${q}&perPage=10`, { headers }),
          fetch(`${baseUrl}/stores?search=${q}&perPage=10`, { headers }),
        ]);

        const creatorsData = await creatorsRes.json();
        const storesData = await storesRes.json();

        const rawCreators = creatorsData?.data?.data || creatorsData?.data || [];
        const rawStores = storesData?.data?.data || storesData?.data || [];

        const creators = rawCreators
          .filter((c: any) => {
            const uid = typeof c.userId === 'object' ? c.userId?._id : c.userId;
            return uid !== currentUserId && !c?.isAdminAccount;
          })
          .map((c: any) => {
            const user = typeof c.userId === 'object' ? c.userId : null;
            const fullName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() : '';
            return {
              ...c,
              _resultType: 'creator' as const,
              _displayName: fullName || c.businessName || c.username || 'Creator',
              _subtitle: c.username ? `@${c.username}` : '',
            };
          });

        // Build a userId→creator map for store owner lookup
        const creatorsByUserId = new Map<string, any>();
        for (const c of rawCreators) {
          const uid = typeof c.userId === 'object' ? c.userId?._id : c.userId;
          if (uid) creatorsByUserId.set(uid, c);
        }

        const stores = rawStores
          .filter((s: any) => {
            const uid = typeof s.userId === 'object' ? s.userId?._id : s.userId;
            return uid !== currentUserId;
          })
          .map((s: any) => {
            const storeUserId = typeof s.userId === 'object' ? s.userId?._id : s.userId;
            const ownerCreator = creatorsByUserId.get(storeUserId);
            const ownerUsername = ownerCreator?.username || null;
            return {
              ...s,
              _resultType: 'store' as const,
              _displayName: s.name || 'Store',
              _subtitle: ownerUsername ? `@${ownerUsername}` : '',
            };
          });

        setNewChatResults([...creators, ...stores]);
      } catch {
        setNewChatResults([]);
      }
      setSearchingNewChat(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [newChatQuery, showNewChatSearch, sessionToken, currentUserId]);

  const handleStartNewChat = async (item: any) => {
    // Extract the user ID — userId can be a string or a populated object
    const rawUserId = item.userId;
    const userId = typeof rawUserId === 'object' ? rawUserId?._id || rawUserId?.id : rawUserId;
    if (!userId || typeof userId !== 'string') {
      antMessage.error('Unable to start conversation');
      return;
    }
    try {
      const participantType = item._resultType === 'store' ? 'store' : 'creator';
      const result = await createConversation({
        participantId: userId,
        participantType,
        options: { noSuccessMessage: true },
      }).unwrap();
      const convId = result?.data?._id || result?._id;
      if (convId) {
        setActiveConversationId(convId);
        setShowNewChatSearch(false);
        setNewChatQuery('');
        setNewChatResults([]);
      }
    } catch {
      antMessage.error('Failed to start conversation');
    }
  };

  // ─── Filtered conversations ───────────────────────────────────
  const filteredConversations = searchQuery
    ? conversations.filter((c: any) => {
        const info = getDisplayInfo(c, currentUserId);
        return info.displayName.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : conversations;

  // ─── Conversation list panel ──────────────────────────────────
  const renderConversationList = () => (
    <div
      className={`flex flex-col ${
        isMobile ? 'h-full' : 'h-[calc(100vh-64px)]'
      } border-r border-neutral-200 dark:border-neutral-700/60 ${
        isMobile ? 'w-full' : 'w-[340px]'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-neutral-200 dark:border-neutral-700/60">
        <h2 className="text-lg font-bold text-neutral-900 dark:text-white">Chats</h2>
        <button
          onClick={() => setShowNewChatSearch(true)}
          className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          title="New conversation"
        >
          <UserPlus size={18} className="text-neutral-500" />
        </button>
      </div>

      {/* Search */}
      <div className="px-3 py-2">
        {showNewChatSearch ? (
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={newChatQuery}
              onChange={(e) => setNewChatQuery(e.target.value)}
              placeholder="Search creators or stores..."
              autoFocus
              className="w-full pl-9 pr-8 py-2 text-sm rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue dark:border-blue/50 outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
            />
            <button
              onClick={() => {
                setShowNewChatSearch(false);
                setNewChatQuery('');
                setNewChatResults([]);
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-0.5"
            >
              <X size={14} className="text-neutral-400" />
            </button>
          </div>
        ) : (
          <div className="relative">
            <Search
              size={14}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
            />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search chats"
              className="w-full pl-9 pr-3 py-2 text-sm rounded-lg bg-neutral-100 dark:bg-neutral-800 border-0 outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
            />
          </div>
        )}
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {/* New chat search results */}
        {showNewChatSearch ? (
          <div>
            {searchingNewChat ? (
              <div className="flex justify-center py-8">
                <div className="w-5 h-5 border-2 border-neutral-300 border-t-blue rounded-full animate-spin" />
              </div>
            ) : newChatResults.length > 0 ? (
              newChatResults.map((item: any) => {
                const isStore = item._resultType === 'store';
                const name = item._displayName || (isStore ? item.name : item.username) || 'User';
                const avatar = isStore ? item.logo : item.profileImageUrl;
                const subtitle = item._subtitle || '';

                return (
                  <button
                    key={item._id}
                    onClick={() => handleStartNewChat(item)}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full overflow-hidden flex-shrink-0">
                      {avatar ? (
                        <img src={avatar} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <div
                          className="w-full h-full flex items-center justify-center text-white text-sm font-bold"
                          style={{ backgroundColor: getRandomColorByString(name) }}
                        >
                          {getFirstCharacter(name)}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-neutral-900 dark:text-white truncate flex items-center gap-1">
                        {name}
                        <VerifiedBadge
                          isVerified={item.isVerified}
                          isSuperVerified={item.isSuperVerified}
                          size={14}
                        />
                      </p>
                      <p className="text-xs text-neutral-500 truncate">{subtitle}</p>
                    </div>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                        isStore
                          ? 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400'
                          : 'bg-blue-50 dark:bg-blue-900/20 text-blue dark:text-blue-400'
                      }`}
                    >
                      {isStore ? 'Store' : 'Creator'}
                    </span>
                  </button>
                );
              })
            ) : newChatQuery.trim().length >= 2 ? (
              <div className="text-center py-8">
                <p className="text-sm text-neutral-400">No creators found</p>
              </div>
            ) : (
              <div className="text-center py-8 px-6">
                <UserPlus
                  size={24}
                  className="text-neutral-300 dark:text-neutral-600 mx-auto mb-2"
                />
                <p className="text-sm text-neutral-400">
                  Type a name to search for creators or stores
                </p>
              </div>
            )}
          </div>
        ) : loadingConversations ? (
          <div className="space-y-1 p-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-3 p-3 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-700" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-neutral-200 dark:bg-neutral-700 rounded w-24" />
                  <div className="h-2.5 bg-neutral-200 dark:bg-neutral-700 rounded w-40" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center px-6">
            <Inbox size={32} className="text-neutral-300 dark:text-neutral-600 mb-3" />
            <p className="text-sm text-neutral-500 dark:text-neutral-400">No conversations yet</p>
            <p className="text-xs text-neutral-400 dark:text-neutral-500 mt-1">
              Message a seller from their product page
            </p>
          </div>
        ) : (
          filteredConversations.map((conv: any) => (
            <ConversationItem
              key={conv._id}
              conversation={conv}
              currentUserId={currentUserId}
              isActive={conv._id === activeConversationId}
              isOnline={onlineUsers.has(getOtherParticipantId(conv.participants, currentUserId))}
              isMarkedRead={readConversations.has(conv._id)}
              localUnread={localUnreadCounts[conv._id] || 0}
              onClick={() => setActiveConversationId(conv._id)}
            />
          ))
        )}
      </div>
    </div>
  );

  // ─── Message thread panel ─────────────────────────────────────
  const renderMessageThread = () => {
    if (!activeConversationId) {
      return (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageCircle
              size={48}
              className="text-neutral-200 dark:text-neutral-700 mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-neutral-600 dark:text-neutral-400">
              Select a message
            </h3>
            <p className="text-sm text-neutral-400 dark:text-neutral-500 mt-1">
              Choose from your existing conversations,
              <br />
              start a new one, or just keep swimming.
            </p>
          </div>
        </div>
      );
    }

    const isLoadingConversation =
      !activeDisplayInfo?.displayName || activeDisplayInfo?.displayName === 'User';
    const otherName =
      activeDisplayInfo?.displayName && activeDisplayInfo.displayName !== 'User'
        ? activeDisplayInfo.displayName
        : '';
    const otherAvatar = activeDisplayInfo?.avatar || null;
    const otherType = activeDisplayInfo?.type;
    const otherEntityId = activeDisplayInfo?.entityId;
    const otherUsername = activeDisplayInfo?.username;
    const isOtherOnline = onlineUsers.has(otherUserId);

    return (
      <div className={`flex-1 flex flex-col ${isMobile ? 'h-full' : 'h-[calc(100vh-64px)]'}`}>
        {/* Conversation header */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-neutral-200 dark:border-neutral-700/60 bg-white dark:bg-neutral-900 flex-shrink-0">
          <div className="flex items-center gap-3">
            {isMobile && (
              <button onClick={() => setActiveConversationId(null)} className="p-1 -ml-1">
                <ArrowLeft size={20} className="text-neutral-600 dark:text-neutral-400" />
              </button>
            )}
            <div className="relative">
              {otherAvatar ? (
                <img
                  src={otherAvatar}
                  alt={otherName}
                  className="w-9 h-9 rounded-full object-cover"
                />
              ) : (
                <div
                  className="w-9 h-9 rounded-full flex items-center justify-center text-white text-sm font-bold"
                  style={{ backgroundColor: getRandomColorByString(otherName) }}
                >
                  {getFirstCharacter(otherName)}
                </div>
              )}
              {isOtherOnline && (
                <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-white dark:border-neutral-900" />
              )}
            </div>
            <div>
              {isLoadingConversation && !otherName ? (
                <>
                  <div className="h-4 w-32 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse" />
                  <div className="h-3 w-20 bg-neutral-200 dark:bg-neutral-700 rounded animate-pulse mt-1" />
                </>
              ) : (
                <>
                  <h3 className="text-sm font-semibold text-neutral-900 dark:text-white flex items-center gap-1">
                    {otherName}
                    <VerifiedBadge
                      isVerified={activeDisplayInfo?.isVerified}
                      isSuperVerified={activeDisplayInfo?.isSuperVerified}
                      size={15}
                    />
                  </h3>
                  <p className="text-[11px] text-neutral-500">
                    {otherUsername ? `@${otherUsername} · ` : ''}
                    {isOtherOnline ? <span className="text-emerald-500">Online</span> : 'Offline'}
                  </p>
                </>
              )}
            </div>
          </div>
          {/* View Profile/Store button */}
          {(otherType === 'creator' || otherType === 'store') && (
            <button
              onClick={() => {
                if (otherType === 'store' && otherEntityId) {
                  router.push(`/stores/${otherEntityId}`);
                } else if (otherUsername) {
                  router.push(`/creators/${otherUsername}`);
                }
              }}
              className="text-xs font-semibold px-3 py-1.5 rounded-full border border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors"
            >
              {otherType === 'store' ? 'View Store' : 'View Creator'}
            </button>
          )}
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-3">
          {loadingMessages ? (
            <div className="flex items-center justify-center py-10">
              <div className="w-5 h-5 border-2 border-neutral-300 border-t-blue rounded-full animate-spin" />
            </div>
          ) : allMessages.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm text-neutral-400">No messages yet. Say hi!</p>
            </div>
          ) : (
            <>
              {allMessages.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  message={msg}
                  isMine={msg.senderId === currentUserId}
                  otherUserId={otherUserId}
                />
              ))}
              {typingUsers.size > 0 && <TypingIndicator />}
              <div ref={messagesEndRef} />
            </>
          )}
        </div>

        {/* Input — pinned to bottom */}
        <div className="border-t border-neutral-200 dark:border-neutral-700/60 bg-white dark:bg-neutral-900 flex-shrink-0 px-3 py-2.5">
          {/* Attachment previews */}
          {pendingAttachments.length > 0 && (
            <div className="mb-2 flex gap-2 flex-wrap">
              {pendingAttachments.map((att, i) => (
                <div key={i} className="relative inline-block">
                  {att.isVideo ? (
                    <video src={att.preview} className="h-20 w-20 rounded-lg object-cover" />
                  ) : (
                    <img
                      src={att.preview}
                      alt="Attachment"
                      className="h-20 w-20 rounded-lg object-cover"
                    />
                  )}
                  <button
                    onClick={() => {
                      URL.revokeObjectURL(att.preview);
                      setPendingAttachments((prev) => prev.filter((_, idx) => idx !== i));
                    }}
                    className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center shadow-sm"
                  >
                    <X size={10} />
                  </button>
                </div>
              ))}
            </div>
          )}
          {isUploading && (
            <div className="mb-2 flex items-center gap-2 text-xs text-neutral-400">
              <div className="w-4 h-4 border-2 border-neutral-300 border-t-blue rounded-full animate-spin" />
              Uploading...
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              multiple
              onChange={async (e) => {
                const files = Array.from(e.target.files || []);
                if (files.length === 0) return;
                setIsUploading(true);
                const baseUrl =
                  process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:5000/api/v1';
                for (const file of files) {
                  const localPreview = URL.createObjectURL(file);
                  const isVideo = file.type.startsWith('video');
                  try {
                    const formData = new FormData();
                    formData.append('file', file);
                    const res = await fetch(`${baseUrl}/media/upload-general`, {
                      method: 'POST',
                      headers: sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {},
                      body: formData,
                    });
                    const data = await res.json();
                    const url = data?.data?.url || data?.url;
                    if (url) {
                      setPendingAttachments((prev) => [
                        ...prev,
                        { url, preview: localPreview, isVideo },
                      ]);
                    } else {
                      antMessage.error('Upload failed');
                      URL.revokeObjectURL(localPreview);
                    }
                  } catch {
                    antMessage.error('Failed to upload file');
                    URL.revokeObjectURL(localPreview);
                  }
                }
                setIsUploading(false);
                messageInputRef.current?.focus();
                e.target.value = '';
              }}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors text-neutral-400"
            >
              <Paperclip size={18} />
            </button>
            <input
              ref={messageInputRef}
              type="text"
              value={messageInput}
              onChange={(e) => handleInputChange(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSend()}
              placeholder="Start a new message"
              className="flex-1 px-3 py-2 text-sm rounded-full bg-neutral-100 dark:bg-neutral-800 border-0 outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400"
            />
            <button
              onClick={handleSend}
              disabled={!messageInput.trim() && pendingAttachments.length === 0}
              className={`p-2 rounded-full transition-colors ${
                messageInput.trim() || pendingAttachments.length > 0
                  ? 'bg-emerald-500 text-white hover:bg-emerald-600'
                  : 'text-neutral-300 dark:text-neutral-600'
              }`}
            >
              <Send size={16} />
            </button>
          </div>
        </div>
      </div>
    );
  };

  // ─── Render ───────────────────────────────────────────────────

  // Unauthenticated state
  if (!isAuthenticated) {
    return (
      <div
        className={`flex flex-col items-center justify-center text-center ${
          isMobile ? 'pt-20 pb-28 px-6' : 'py-20'
        }`}
      >
        <div className="w-20 h-20 rounded-full bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center mb-5">
          <MessageCircle size={36} className="text-neutral-400" />
        </div>
        <h2 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 mb-2">
          Sign in to chat
        </h2>
        <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6 max-w-sm">
          Message sellers directly, negotiate prices, and track your conversations — all in one
          place.
        </p>
        <button
          onClick={() => router.push('/profile')}
          className="px-6 py-2.5 bg-[#25D366] hover:bg-[#20BD5A] text-white rounded-lg text-sm font-medium transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="fixed inset-0 top-10 bottom-12 z-10 bg-white dark:bg-neutral-900 flex flex-col">
        <AnimatePresence mode="wait">
          {activeConversationId ? (
            <motion.div
              key="thread"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="flex-1 flex flex-col h-full"
            >
              {renderMessageThread()}
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', duration: 0.2 }}
              className="h-full"
            >
              {renderConversationList()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Desktop: side-by-side
  return (
    <div className="flex h-[calc(100vh-64px)] dark:!border-neutral-700 !bg-neutral-50 dark:!bg-neutral-950 ">
      {renderConversationList()}
      {renderMessageThread()}
    </div>
  );
};

export default ChatPage;
