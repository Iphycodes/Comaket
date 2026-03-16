'use client';

import React, { useState } from 'react';
import { Input, Modal, Switch, message } from 'antd';
import { Shield, Bell, Trash2, Lock, Eye, EyeOff, AlertTriangle, ChevronRight } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useUsers } from '@grc/hooks/useUser';
import {
  useChangePasswordMutation,
  useDeleteAccountMutation,
  useUpdateNotificationPreferencesMutation,
} from '@grc/services/users';
import { useAuth } from '@grc/hooks/useAuth';

const SettingsPage = () => {
  const router = useRouter();
  const { logout } = useAuth();
  const { userProfile } = useUsers({ fetchProfile: true });

  // Password change
  const [showPasswordSection, setShowPasswordSection] = useState(false);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // const [showCurrentPw, setShowCurrentPw] = useState(false);
  // const [showNewPw, setShowNewPw] = useState(false);
  const [changePassword, { isLoading: changingPassword }] = useChangePasswordMutation();

  // Delete account
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deleteAccount, { isLoading: deletingAccount }] = useDeleteAccountMutation();

  // Notification prefs
  const [updateNotifications] = useUpdateNotificationPreferencesMutation();

  const notificationPrefs = userProfile?.notificationPreferences || {
    emailNotifications: true,
    pushNotifications: true,
    orderUpdates: true,
    promotions: false,
  };

  const isGoogleAuth = userProfile?.authProvider === 'google';

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      message.error('Please fill in all password fields');
      return;
    }
    if (newPassword.length < 6) {
      message.error('New password must be at least 6 characters');
      return;
    }
    if (newPassword !== confirmPassword) {
      message.error('Passwords do not match');
      return;
    }
    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      message.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setShowPasswordSection(false);
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to change password');
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      message.error('Please type DELETE to confirm');
      return;
    }
    if (!isGoogleAuth && !deletePassword) {
      message.error('Please enter your password');
      return;
    }
    try {
      await deleteAccount({ password: deletePassword }).unwrap();
      message.success('Account deleted successfully');
      await logout();
      setShowDeleteModal(false);
      router.push('/');
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to delete account');
    }
  };

  const handleToggleNotification = async (key: string, value: boolean) => {
    try {
      await updateNotifications({ [key]: value }).unwrap();
    } catch {
      message.error('Failed to update notification preferences');
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500 dark:text-neutral-400">Please sign in to access settings.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
      <h1 className="text-xl font-bold mb-1 dark:text-white">Settings</h1>
      <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-6">
        Manage your account preferences and security
      </p>

      {/* Security Section */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Shield size={16} className="text-blue" />
          <h2 className="text-sm font-semibold dark:text-white">Security</h2>
        </div>
        <div className="bg-white dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 overflow-hidden">
          {/* Change Password */}
          <button
            onClick={() => setShowPasswordSection(!showPasswordSection)}
            disabled={isGoogleAuth}
            className="w-full flex items-center justify-between p-4 hover:bg-neutral-50 dark:hover:bg-neutral-700/30 transition-colors disabled:opacity-50"
          >
            <div className="flex items-center gap-3">
              <Lock size={18} className="text-neutral-500" />
              <div className="text-left">
                <p className="text-sm font-medium dark:text-white">Change Password</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  {isGoogleAuth ? 'Not available for Google accounts' : 'Update your password'}
                </p>
              </div>
            </div>
            <ChevronRight
              size={16}
              className={`text-neutral-400 transition-transform ${
                showPasswordSection ? 'rotate-90' : ''
              }`}
            />
          </button>

          {showPasswordSection && !isGoogleAuth && (
            <div className="px-4 pb-4 space-y-3 border-t border-neutral-100 dark:border-neutral-700/40 pt-3">
              <div className="relative">
                <Input.Password
                  placeholder="Current password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  iconRender={(visible) => (visible ? <Eye size={14} /> : <EyeOff size={14} />)}
                  className="!bg-neutral-50 dark:!bg-neutral-700/40"
                />
              </div>
              <Input.Password
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                iconRender={(visible) => (visible ? <Eye size={14} /> : <EyeOff size={14} />)}
                className="!bg-neutral-50 dark:!bg-neutral-700/40"
              />
              <Input.Password
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                iconRender={(visible) => (visible ? <Eye size={14} /> : <EyeOff size={14} />)}
                className="!bg-neutral-50 dark:!bg-neutral-700/40"
              />
              <button
                onClick={handleChangePassword}
                disabled={changingPassword}
                className="w-full py-2 bg-blue text-white text-sm font-medium rounded-lg hover:bg-blue/90 transition-colors disabled:opacity-50"
              >
                {changingPassword ? 'Updating...' : 'Update Password'}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Notifications Section */}
      <section className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={16} className="text-blue" />
          <h2 className="text-sm font-semibold dark:text-white">Notifications</h2>
        </div>
        <div className="bg-white dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 divide-y divide-neutral-100 dark:divide-neutral-700/40">
          {[
            {
              key: 'emailNotifications',
              label: 'Email Notifications',
              desc: 'Receive updates via email',
            },
            {
              key: 'pushNotifications',
              label: 'Push Notifications',
              desc: 'Browser push notifications',
            },
            {
              key: 'orderUpdates',
              label: 'Order Updates',
              desc: 'Get notified about order status changes',
            },
            {
              key: 'promotions',
              label: 'Promotions',
              desc: 'Receive promotional offers and deals',
            },
          ].map((item) => (
            <div key={item.key} className="flex items-center justify-between p-4">
              <div>
                <p className="text-sm font-medium dark:text-white">{item.label}</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">{item.desc}</p>
              </div>
              <Switch
                size="small"
                checked={notificationPrefs[item.key]}
                onChange={(checked) => handleToggleNotification(item.key, checked)}
              />
            </div>
          ))}
        </div>
      </section>

      {/* Danger Zone */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <AlertTriangle size={16} className="text-red-500" />
          <h2 className="text-sm font-semibold text-red-500">Danger Zone</h2>
        </div>
        <div className="bg-white dark:bg-neutral-800/60 rounded-xl border border-red-200 dark:border-red-800/40 overflow-hidden">
          <button
            onClick={() => setShowDeleteModal(true)}
            className="w-full flex items-center justify-between p-4 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors"
          >
            <div className="flex items-center gap-3">
              <Trash2 size={18} className="text-red-500" />
              <div className="text-left">
                <p className="text-sm font-medium text-red-600 dark:text-red-400">Delete Account</p>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Permanently delete your account and all data
                </p>
              </div>
            </div>
            <ChevronRight size={16} className="text-red-400" />
          </button>
        </div>
      </section>

      {/* Delete Account Modal */}
      <Modal
        open={showDeleteModal}
        onCancel={() => {
          setShowDeleteModal(false);
          setDeletePassword('');
          setDeleteConfirmText('');
        }}
        footer={null}
        centered
        className="dark-modal"
      >
        <div className="py-2">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <AlertTriangle size={20} className="text-red-500" />
            </div>
            <div>
              <h3 className="text-lg font-bold dark:text-white">Delete Account</h3>
              <p className="text-xs text-neutral-500">This action cannot be undone</p>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-4 text-sm text-red-700 dark:text-red-300">
            This will permanently delete your account, orders, listings, stores, and all associated
            data. This action is irreversible.
          </div>

          {!isGoogleAuth && (
            <div className="mb-3">
              <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
                Enter your password
              </label>
              <Input.Password
                value={deletePassword}
                onChange={(e) => setDeletePassword(e.target.value)}
                placeholder="Your password"
                iconRender={(visible) => (visible ? <Eye size={14} /> : <EyeOff size={14} />)}
              />
            </div>
          )}

          <div className="mb-4">
            <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
              Type <span className="font-bold text-red-500">DELETE</span> to confirm
            </label>
            <Input
              value={deleteConfirmText}
              onChange={(e) => setDeleteConfirmText(e.target.value)}
              placeholder="DELETE"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={() => setShowDeleteModal(false)}
              className="flex-1 py-2 text-sm font-medium rounded-lg border border-neutral-200 dark:border-neutral-700 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors dark:text-white"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteAccount}
              disabled={deletingAccount || deleteConfirmText !== 'DELETE'}
              className="flex-1 py-2 text-sm font-medium rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors disabled:opacity-50"
            >
              {deletingAccount ? 'Deleting...' : 'Delete Account'}
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default SettingsPage;
