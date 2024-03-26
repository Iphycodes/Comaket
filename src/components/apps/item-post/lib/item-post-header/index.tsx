'use client';

import { Popover, Space } from 'antd';
import Image from 'next/image';
import React, { useCallback } from 'react';

interface Props {
  // Add your prop types here
  postUserProfile: Record<string, any>;
  sponsored: boolean;
}

const ItemPostHeader: React.FC<Props> = ({ postUserProfile, sponsored }) => {
  const handleMenuClick = (key: string) => {
    console.log(key);
  };

  const getContent = useCallback(() => {
    return (
      <div className="drop-down-content w-60">
        <div
          className="cursor-pointer border-b text-center rounded-sm px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-400"
          onClick={() => handleMenuClick('chat')}
        >
          <Space className="p-1" size={15}>
            <span>Chat</span>
          </Space>
        </div>
        <div
          className="cursor-pointer border-b text-center rounded-sm px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-400"
          onClick={() => handleMenuClick('visit-store')}
        >
          <Space className="p-1" size={15}>
            <span>Visit Store</span>
          </Space>
        </div>
        <div
          className="cursor-pointer border-b text-center rounded-sm px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-400"
          onClick={() => handleMenuClick('add-to-saved')}
        >
          <Space className="p-1" size={15}>
            <span>Add to Saved</span>
          </Space>
        </div>
        <div
          className="cursor-pointer border-b text-center rounded-sm px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-400"
          onClick={() => handleMenuClick('share')}
        >
          <Space className="p-1" size={15}>
            <span>Share to...</span>
          </Space>
        </div>
        <div
          className="cursor-pointer border-b text-center rounded-sm px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-400"
          onClick={() => handleMenuClick('copy-link')}
        >
          <Space className="p-1" size={15}>
            <span>Copy Link</span>
          </Space>
        </div>
        <div
          className="cursor-pointer text-center rounded-sm px-3 py-2 hover:bg-gray-100 dark:hover:bg-zinc-400"
          onClick={() => handleMenuClick('cancel')}
        >
          <Space className="p-1" size={15}>
            <span>Cancel</span>
          </Space>
        </div>
      </div>
    );
  }, []);

  return (
    <div className="w-full py-3 flex justify-between items-center">
      <section className="flex gap-2 items-center">
        <Image
          src={postUserProfile?.profilePicUrl ?? ''}
          alt="seller-dp"
          width={40}
          height={40}
          style={{ width: '40px', height: '40px' }}
          className="rounded-[50%]"
        />
        <div className="flex flex-col gap-0 justify-center">
          <span className="font-semibold text-[16px]" style={{ lineHeight: '12px' }}>
            {postUserProfile?.businessName ?? postUserProfile?.userName ?? `Business`}{' '}
            <span>
              <i className="ri-arrow-drop-right-fill"></i>
            </span>
            <span className=" text-gray-500 text-[14px]">{`2d`}</span>
          </span>
          {sponsored && <span className="post-status text-[14px] font-light">Sponsored</span>}
        </div>
      </section>
      <section>
        <Popover
          content={getContent()}
          placement={'bottomRight'}
          overlayClassName="dropdown-popover"
          trigger={'click'}
          showArrow={false}
          arrow={false}
          overlayStyle={{ zIndex: 500, marginTop: '510px' }}
        >
          <span className="cursor-pointer">
            <i className="ri-more-fill text-[20px]"></i>
          </span>
        </Popover>
      </section>
    </div>
  );
};

export default ItemPostHeader;
