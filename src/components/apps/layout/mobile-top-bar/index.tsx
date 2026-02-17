'use client';

import React, { Dispatch, SetStateAction } from 'react';
import { Dropdown } from 'antd';
import type { MenuProps } from 'antd';
import { useRouter } from 'next/navigation';
import { Store, ChevronDown, MoreVertical, Settings, ShieldAlert, Plus } from 'lucide-react';
import { mockUserVendorStores } from '@grc/app/nav';
import SideNavAuthButton from '@grc/components/apps/layout/side-nav/lib/side-nav-auth-button';

interface MobileTopBarProps {
  setIsCreateStoreModalOpen: Dispatch<SetStateAction<boolean>>;
}

const MobileTopBar: React.FC<MobileTopBarProps> = ({ setIsCreateStoreModalOpen }) => {
  const router = useRouter();

  // ── My Stores dropdown items ────────────────────────────────────────

  const storeMenuItems: MenuProps['items'] = [
    ...mockUserVendorStores.map((store) => ({
      key: `my-store-${store.id}`,
      label: <span className="text-sm text-gray-700 dark:text-gray-200">{store.name}</span>,
      onClick: () => router.push(`/my-store/${store.id}`),
    })),
    { type: 'divider' as const },
    {
      key: 'create-store',
      label: (
        <span className="flex items-center gap-2 text-sm font-semibold text-blue">
          <Plus size={14} />
          Create New Store
        </span>
      ),
      onClick: () => setIsCreateStoreModalOpen(true),
    },
  ];

  // ── More dropdown items ─────────────────────────────────────────────

  const moreMenuItems: MenuProps['items'] = [
    {
      key: 'settings',
      label: <span className="text-sm">Settings</span>,
      icon: <Settings size={16} className="text-gray-500" />,
      onClick: () => router.push('/settings'),
    },
    {
      key: 'disputes',
      label: <span className="text-sm">Disputes</span>,
      icon: <ShieldAlert size={16} className="text-gray-500" />,
      onClick: () => router.push('/disputes'),
    },
    // { type: 'divider' as const },
    {
      key: 'auth',
      label: <SideNavAuthButton />,
    },
  ];

  // ── Render ──────────────────────────────────────────────────────────

  return (
    <div className="fixed w-full top-0 z-[1000] bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700/60">
      <div className="flex items-center justify-end gap-1 px-3 h-8">
        {/* Left: My Stores dropdown */}
        <Dropdown menu={{ items: storeMenuItems }} trigger={['click']} placement="bottomLeft">
          <button className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-sm font-semibold text-gray-800 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <Store size={16} className="text-purple-500" />
            <span>My Stores</span>
            <ChevronDown size={14} className="text-gray-400" />
          </button>
        </Dropdown>

        {/* Right: More dropdown */}
        <Dropdown menu={{ items: moreMenuItems }} trigger={['click']} placement="bottomRight">
          <button className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <MoreVertical size={18} className="text-gray-600 dark:text-gray-300" />
          </button>
        </Dropdown>
      </div>
    </div>
  );
};

export default MobileTopBar;
