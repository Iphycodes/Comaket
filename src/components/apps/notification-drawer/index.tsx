// types.ts
export interface NotificationItemProps {
  id: string;
  type: 'listing' | 'payment' | 'social' | 'promo' | 'wallet' | 'rejected' | 'likes';
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  imageUrl?: string;
}

// NotificationItem.tsx
import React, { useContext } from 'react';
import { Badge } from 'antd';
import { formatDistanceToNow } from 'date-fns';
import { useState, useMemo } from 'react';
import { Layout, Tabs, Button, message } from 'antd';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AppContext } from '@grc/app-context';
const { Sider } = Layout;

interface NotificationItemComponentProps extends NotificationItemProps {
  onMarkAsRead: (id: string) => void;
}

const NotificationItem: React.FC<NotificationItemComponentProps> = ({
  id,
  type,
  title,
  message,
  timestamp,
  read,
  imageUrl,
  onMarkAsRead,
}) => {
  const getIconClass = () => {
    switch (type) {
      case 'listing':
        return 'ri-store-2-line';
      case 'payment':
        return 'ri-secure-payment-line';
      case 'social':
        return 'ri-chat-1-line';
      case 'promo':
        return 'ri-gift-line';
      case 'wallet':
        return 'ri-wallet-3-line';
      case 'rejected':
        return 'ri-close-circle-line';
      case 'likes':
        return 'ri-heart-line';
      default:
        return 'ri-notification-2-line';
    }
  };

  const getColorClass = () => {
    switch (type) {
      case 'listing':
        return 'bg-indigo-50 text-blue';
      case 'payment':
        return 'bg-green-50 text-green-600';
      case 'social':
        return 'bg-purple-50 text-purple-600';
      case 'promo':
        return 'bg-yellow-50 text-yellow-600';
      case 'wallet':
        return 'bg-indigo-50 text-indigo-600';
      case 'rejected':
        return 'bg-red-50 text-red-600';
      case 'likes':
        return 'bg-pink-50 text-pink-600';
      default:
        return 'bg-gray-50 text-gray-600';
    }
  };

  return (
    <div
      className={`p-4 hover:bg-gray-50 cursor-pointer border-b border-gray-100 transition-colors ${
        !read ? 'bg-gray-50' : ''
      }`}
      onClick={() => !read && onMarkAsRead(id)}
    >
      <div className="flex items-start gap-3">
        <div className={`p-2 rounded-full ${getColorClass()}`}>
          <i className={`${getIconClass()} text-lg`}></i>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h4 className="font-medium text-sm text-gray-900 line-clamp-1">{title}</h4>
            <span className="text-xs text-gray-500 whitespace-nowrap">
              {formatDistanceToNow(timestamp, { addSuffix: true })}
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1 line-clamp-2">{message}</p>
          {imageUrl && (
            <div className="mt-2">
              <img src={imageUrl} alt="" className="h-12 w-12 object-cover rounded-md" />
            </div>
          )}
        </div>
        {!read && <Badge status="processing" className="mt-2" />}
      </div>
    </div>
  );
};

// NotificationsDrawer.tsx

// interface NotificationsDrawerProps {
//   toggleNoticationDrawer: boolean;
//   setToggleNotificationsDrawer: (value: boolean) => void;
// }

const NotificationsDrawer = (
  {
    // toggleNoticationDrawer,
    // setToggleNotificationsDrawer,
  }
) => {
  const isMobile = useMediaQuery(mediaSize.mobile);
  const [activeTab, setActiveTab] = useState<string>('all');
  const { toggleNotificationsDrawer, setToggleNotificationsDrawer } = useContext(AppContext);
  const [notifications, setNotifications] = useState<NotificationItemProps[]>([
    {
      id: '1',
      type: 'listing',
      title: 'Product Listing Approved',
      message: 'Your Nike Air Max listing has been approved and is now live in the marketplace.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      imageUrl: '/path/to/product-image.jpg',
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₦45,000 has been processed for your listed item.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
    },
    {
      id: '3',
      type: 'rejected',
      title: 'Listing Rejected',
      message:
        'Your iPhone 14 listing was rejected. Reason: Insufficient product details provided.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
    },
    {
      id: '4',
      type: 'likes',
      title: 'New Likes on Your Product',
      message: 'Your Samsung TV listing received 5 new likes since your last visit.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false,
    },
    {
      id: '5',
      type: 'social',
      title: 'New Comment',
      message: 'John Doe commented on your iPhone 13 listing: "Is this still available?"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: false,
    },
    {
      id: '6',
      type: 'promo',
      title: 'Weekend Sale!',
      message: 'List your items this weekend and get 50% off on listing fees!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
    {
      id: '7',
      type: 'wallet',
      title: 'Withdrawal Successful',
      message: 'Your withdrawal of ₦150,000 has been processed successfully.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      read: true,
    },
    {
      id: '8',
      type: 'listing',
      title: 'Product Listing Approved',
      message: 'Your Nike Air Max listing has been approved and is now live in the marketplace.',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      read: false,
      imageUrl: '/path/to/product-image.jpg',
    },
    {
      id: '9',
      type: 'payment',
      title: 'Payment Received',
      message: 'Payment of ₦45,000 has been processed for your listed item.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2),
      read: true,
    },
    {
      id: '10',
      type: 'rejected',
      title: 'Listing Rejected',
      message:
        'Your iPhone 14 listing was rejected. Reason: Insufficient product details provided.',
      timestamp: new Date(Date.now() - 1000 * 60 * 45),
      read: false,
    },
    {
      id: '11',
      type: 'likes',
      title: 'New Likes on Your Product',
      message: 'Your Samsung TV listing received 5 new likes since your last visit.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60),
      read: false,
    },
    {
      id: '12',
      type: 'social',
      title: 'New Comment',
      message: 'John Doe commented on your iPhone 13 listing: "Is this still available?"',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 3),
      read: false,
    },
    {
      id: '13',
      type: 'promo',
      title: 'Weekend Sale!',
      message: 'List your items this weekend and get 50% off on listing fees!',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24),
      read: true,
    },
    {
      id: '14',
      type: 'wallet',
      title: 'Withdrawal Successful',
      message: 'Your withdrawal of ₦150,000 has been processed successfully.',
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      read: true,
    },
  ]);

  const filteredNotifications = useMemo(() => {
    return activeTab === 'all'
      ? notifications
      : notifications.filter((notification) => !notification.read);
  }, [notifications, activeTab]);

  const handleMarkAsRead = (id: string) => {
    // In real implementation, make API call here
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
  };

  const handleMarkAllAsRead = () => {
    // In real implementation, make API call here
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) => ({ ...notification, read: true }))
    );
    message.success('All notifications marked as read');
  };

  const unreadCount = useMemo(
    () => notifications.filter((notification) => !notification.read).length,
    [notifications]
  );

  return (
    <Sider
      collapsed={toggleNotificationsDrawer}
      collapsedWidth={0}
      className="dash-sider z-200 rounded-r-2xl border-r border-r-gray-200 rounded-br-3xl p-0 text-lg shadow-2xl shadow-gray-400"
      width={isMobile ? '90vw' : 400}
      style={{
        overflow: 'hidden',
        position: 'fixed',
        padding: '0',
        height: '100vh',
        top: 0,
        bottom: 0,
        zIndex: 10,
        ...(isMobile ? { right: -5 } : { left: 80 }),
      }}
    >
      <div className="flex flex-col h-full">
        <div className="sticky top-0 bg-white z-10 border-b border-gray-200">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setToggleNotificationsDrawer(true)}
                className="text-gray-600 hover:text-gray-900 p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <i className="ri-close-line text-xl"></i>
              </button>
              <h2 className="text-xl font-semibold">Notifications</h2>
            </div>{' '}
            <Button
              type="text"
              className="text-gray-600 hover:text-gray-900 space-x-2"
              onClick={handleMarkAllAsRead}
              disabled={unreadCount === 0}
            >
              <i className="ri-check-double-line"></i>
              Mark all as read
            </Button>
          </div>
          <Tabs
            activeKey={activeTab}
            onChange={setActiveTab}
            items={[
              {
                label: 'All',
                key: 'all',
                children: null,
              },
              {
                label: `Unread (${unreadCount})`,
                key: 'unread',
                children: null,
              },
            ]}
            className="px-4"
          />
        </div>

        <div className="overflow-y-auto flex-1" style={{ scrollbarWidth: 'thin' }}>
          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (
              <NotificationItem
                key={notification.id}
                {...notification}
                onMarkAsRead={handleMarkAsRead}
              />
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-full p-8 text-center text-gray-500">
              <i className="ri-notification-off-line text-4xl mb-2"></i>
              <p>No notifications yet</p>
            </div>
          )}
        </div>
      </div>
    </Sider>
  );
};

export default NotificationsDrawer;
