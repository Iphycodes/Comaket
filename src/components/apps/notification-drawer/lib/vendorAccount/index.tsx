'use client';
import Image from 'next/image';
import React from 'react';

interface Props {
  // Add your prop types here
  notificationData: Record<string, any>;
}

const NotificationComponent: React.FC<Props> = ({ notificationData }) => {
  return (
    <div
      style={{ lineHeight: '24px' }}
      className="w-full hover:bg-gray-100 cursor-pointer gap-6 py-2 flex justify-between items-center"
    >
      <section className="flex gap-3 items-center">
        <Image
          src={notificationData?.profilePicUrl ?? ''}
          alt="user-dp"
          width={50}
          height={50}
          style={{ width: '50px', height: '50px' }}
          className="rounded-[50%]"
        />
        <div className="flex flex-col gap-1 justify-center">
          <span>
            <span className="font-semibold text-[16px]" style={{ lineHeight: '12px' }}>
              {notificationData?.businessName ?? notificationData?.userName ?? `New Notication`}{' '}
            </span>
            <span className="text-[16px]">{notificationData?.label}</span>
          </span>

          <span className="post-status text-[14px] font-light">{notificationData?.date}</span>
        </div>
      </section>
      <section>
        <i className="ri-close-line text-[24px] opacity-60"></i>{' '}
      </section>
    </div>
  );
};

export default NotificationComponent;
