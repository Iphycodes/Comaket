'use client';

import React, { Suspense } from 'react';
import ChatPage from '@grc/components/apps/chat';

const ChatsPageWrapper = () => {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center h-[50vh]">
          <div className="w-6 h-6 border-2 border-neutral-300 border-t-blue rounded-full animate-spin" />
        </div>
      }
    >
      <ChatPage />
    </Suspense>
  );
};

export default ChatsPageWrapper;
