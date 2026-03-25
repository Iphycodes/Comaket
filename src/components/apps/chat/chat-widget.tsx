'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useSocket } from '@grc/providers/socket-provider';
import { useSelector } from 'react-redux';

const ChatWidget: React.FC = () => {
  const router = useRouter();
  const { totalUnread } = useSocket();
  const isAuthenticated = useSelector((state: any) => state.auth?.isAuthenticated);

  if (!isAuthenticated) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 hidden lg:block">
      {/* FAB Button */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => router.push('/chats')}
        className="relative w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg flex items-center justify-center transition-colors"
      >
        <MessageCircle size={22} />
        {totalUnread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 min-w-[20px] h-5 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] font-bold px-1.5 shadow-sm"
          >
            {totalUnread > 99 ? '99+' : totalUnread}
          </motion.span>
        )}
      </motion.button>
    </div>
  );
};

export default ChatWidget;
