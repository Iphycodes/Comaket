'use client';

import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useSelector } from 'react-redux';

interface SocketContextValue {
  socket: Socket | null;
  isConnected: boolean;
  onlineUsers: Set<string>;
  totalUnread: number;
  setTotalUnread: React.Dispatch<React.SetStateAction<number>>;
  sendMessage: (data: {
    conversationId: string;
    content: string;
    type?: string;
    productCard?: any;
    attachments?: string[];
  }) => void;
  joinConversation: (conversationId: string) => void;
  leaveConversation: (conversationId: string) => void;
  emitTyping: (conversationId: string) => void;
  emitStopTyping: (conversationId: string) => void;
  markRead: (conversationId: string) => void;
  checkOnlineStatus: (userIds: string[]) => void;
}

const SocketContext = createContext<SocketContextValue>({
  socket: null,
  isConnected: false,
  onlineUsers: new Set(),
  totalUnread: 0,
  setTotalUnread: () => {},
  sendMessage: () => {},
  joinConversation: () => {},
  leaveConversation: () => {},
  emitTyping: () => {},
  emitStopTyping: () => {},
  markRead: () => {},
  checkOnlineStatus: () => {},
});

export const useSocket = () => useContext(SocketContext);

interface SocketProviderProps {
  children: React.ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState<Set<string>>(new Set());
  const [totalUnread, setTotalUnread] = useState(0);

  const authState = useSelector((state: any) => state.auth);
  const token = authState?.sessionToken;
  const isAuthenticated = authState?.isAuthenticated;

  // Derive the socket URL from the API base URL
  const baseUrl = process.env.NEXT_PUBLIC_APP_BASE_URL || 'http://localhost:5000/api/v1';
  // Socket connects to the root, not the /api/v1 path
  const socketUrl = baseUrl.replace(/\/api\/v1$/, '');

  useEffect(() => {
    if (!isAuthenticated || !token) {
      // Disconnect if not authenticated
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setIsConnected(false);
      }
      return;
    }

    // Connect to Socket.IO
    const socket = io(`${socketUrl}/chat`, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: Infinity,
      reconnectionDelay: 2000,
      reconnectionDelayMax: 10000,
      autoConnect: true,
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      setIsConnected(true);
    });

    socket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Online/offline tracking
    socket.on('userOnline', ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
    });

    socket.on('userOffline', ({ userId }: { userId: string }) => {
      setOnlineUsers((prev) => {
        const next = new Set(prev);
        next.delete(userId);
        return next;
      });
    });

    // Unread count updates from server (authoritative — always trust this value)
    socket.on('unreadCountUpdate', ({ totalUnread: count }: { totalUnread: number }) => {
      if (typeof count === 'number') setTotalUnread(count);
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
      setIsConnected(false);
    };
  }, [isAuthenticated, token, socketUrl]);

  const sendMessage = useCallback(
    (data: {
      conversationId: string;
      content: string;
      type?: string;
      productCard?: any;
      attachments?: string[];
    }) => {
      socketRef.current?.emit('sendMessage', data);
    },
    []
  );

  const joinConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('joinConversation', { conversationId });
  }, []);

  const leaveConversation = useCallback((conversationId: string) => {
    socketRef.current?.emit('leaveConversation', { conversationId });
  }, []);

  const emitTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit('typing', { conversationId });
  }, []);

  const emitStopTyping = useCallback((conversationId: string) => {
    socketRef.current?.emit('stopTyping', { conversationId });
  }, []);

  const checkOnlineStatus = useCallback((userIds: string[]) => {
    socketRef.current?.emit('getOnlineUsers', { userIds }, (response: any) => {
      if (response?.onlineUsers) {
        setOnlineUsers((prev) => {
          const next = new Set(prev);
          for (const id of response.onlineUsers) next.add(id);
          return next;
        });
      }
    });
  }, []);

  const markRead = useCallback((conversationId: string) => {
    socketRef.current?.emit('markRead', { conversationId });
  }, []);

  return (
    <SocketContext.Provider
      value={{
        socket: socketRef.current,
        isConnected,
        onlineUsers,
        totalUnread,
        setTotalUnread,
        sendMessage,
        joinConversation,
        leaveConversation,
        emitTyping,
        emitStopTyping,
        markRead,
        checkOnlineStatus,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
