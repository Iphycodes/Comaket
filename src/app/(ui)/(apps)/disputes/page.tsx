'use client';

import React, { useState } from 'react';
import { Input, Select, Modal, Tag, Empty, message, Spin } from 'antd';
import {
  Plus,
  MessageCircle,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  ChevronLeft,
  FileText,
  X,
} from 'lucide-react';
import { useUsers } from '@grc/hooks/useUser';
import {
  useCreateDisputeMutation,
  useGetMyDisputesQuery,
  useLazyGetDisputeQuery,
  useAddDisputeMessageMutation,
} from '@grc/services/disputes';
import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';

const disputeTypes = [
  { value: 'order_issue', label: 'Order Issue' },
  { value: 'payment_issue', label: 'Payment Issue' },
  { value: 'product_quality', label: 'Product Quality' },
  { value: 'delivery_issue', label: 'Delivery Issue' },
  { value: 'seller_dispute', label: 'Seller Dispute' },
  { value: 'other', label: 'Other' },
];

const statusConfig: Record<string, { color: string; icon: React.ReactNode; label: string }> = {
  open: {
    color: 'blue',
    icon: <AlertCircle size={14} />,
    label: 'Open',
  },
  under_review: {
    color: 'orange',
    icon: <Clock size={14} />,
    label: 'Under Review',
  },
  resolved: {
    color: 'green',
    icon: <CheckCircle size={14} />,
    label: 'Resolved',
  },
  closed: {
    color: 'default',
    icon: <CheckCircle size={14} />,
    label: 'Closed',
  },
};

const DisputesPage = () => {
  const { userProfile } = useUsers({ fetchProfile: true });
  const isMobile = useMediaQuery(mediaSize.mobile);

  // List view
  const [statusFilter, setStatusFilter] = useState<string | undefined>(undefined);
  const { data: disputesData, isLoading } = useGetMyDisputesQuery(
    statusFilter ? { status: statusFilter } : {}
  );
  const disputes = disputesData?.data || [];

  // Create dispute
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    type: '' as string,
    subject: '',
    description: '',
    orderId: '',
  });
  const [createDispute, { isLoading: creating }] = useCreateDisputeMutation();

  // Detail view
  const [selectedDispute, setSelectedDispute] = useState<any>(null);
  const [triggerGetDispute] = useLazyGetDisputeQuery();
  const [newMessage, setNewMessage] = useState('');
  const [addMessage, { isLoading: sendingMessage }] = useAddDisputeMessageMutation();

  const handleCreate = async () => {
    if (!createForm.type || !createForm.subject || !createForm.description) {
      message.error('Please fill in all required fields');
      return;
    }
    try {
      const payload: any = {
        type: createForm.type,
        subject: createForm.subject,
        description: createForm.description,
      };
      if (createForm.orderId) payload.orderId = createForm.orderId;
      await createDispute(payload).unwrap();
      message.success('Dispute submitted successfully');
      setShowCreateModal(false);
      setCreateForm({ type: '', subject: '', description: '', orderId: '' });
    } catch (err: any) {
      message.error(err?.data?.message || 'Failed to submit dispute');
    }
  };

  const handleViewDispute = async (id: string) => {
    try {
      const res = await triggerGetDispute(id).unwrap();
      setSelectedDispute(res?.data);
    } catch {
      message.error('Failed to load dispute details');
    }
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedDispute) return;
    try {
      const res = await addMessage({
        id: selectedDispute._id,
        payload: { message: newMessage },
      }).unwrap();
      setSelectedDispute(res?.data);
      setNewMessage('');
    } catch {
      message.error('Failed to send message');
    }
  };

  if (!userProfile) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-neutral-500 dark:text-neutral-400">Please sign in to access disputes.</p>
      </div>
    );
  }

  // Detail View
  if (selectedDispute) {
    const status = statusConfig[selectedDispute.status] || statusConfig.open;
    return (
      <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
        <button
          onClick={() => setSelectedDispute(null)}
          className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 mb-4"
        >
          <ChevronLeft size={16} />
          Back to disputes
        </button>

        <div className="bg-white dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 p-4 mb-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h2 className="text-lg font-bold dark:text-white">{selectedDispute.subject}</h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                {disputeTypes.find((t) => t.value === selectedDispute.type)?.label} &middot;{' '}
                {new Date(selectedDispute.createdAt).toLocaleDateString()}
              </p>
            </div>
            <Tag color={status.color} className="flex items-center gap-1">
              {status.icon} {status.label}
            </Tag>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400">
            {selectedDispute.description}
          </p>
          {selectedDispute.resolution && (
            <div className="mt-3 p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs font-medium text-green-700 dark:text-green-400 mb-1">
                Resolution
              </p>
              <p className="text-sm text-green-800 dark:text-green-300">
                {selectedDispute.resolution}
              </p>
            </div>
          )}
        </div>

        {/* Messages */}
        <div className="bg-white dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 overflow-hidden">
          <div className="p-4 border-b border-neutral-100 dark:border-neutral-700/40">
            <h3 className="text-sm font-semibold dark:text-white flex items-center gap-2">
              <MessageCircle size={14} /> Messages
            </h3>
          </div>

          <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
            {selectedDispute.messages?.length > 0 ? (
              selectedDispute.messages.map((msg: any, i: number) => {
                const isMe = msg.sender === userProfile._id || msg.sender?._id === userProfile._id;
                return (
                  <div key={i} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                    <div
                      className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                        isMe
                          ? 'bg-blue text-white'
                          : 'bg-neutral-100 dark:bg-neutral-700/40 dark:text-neutral-200'
                      }`}
                    >
                      <p>{msg.message}</p>
                      <p
                        className={`text-[10px] mt-1 ${
                          isMe ? 'text-blue-100' : 'text-neutral-400'
                        }`}
                      >
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-center text-sm text-neutral-400 py-4">No messages yet</p>
            )}
          </div>

          {/* Message input */}
          {selectedDispute.status !== 'closed' && selectedDispute.status !== 'resolved' && (
            <div className="p-3 border-t border-neutral-100 dark:border-neutral-700/40 flex gap-2">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onPressEnter={handleSendMessage}
                className="flex-1 !bg-neutral-50 dark:!bg-neutral-700/40"
              />
              <button
                onClick={handleSendMessage}
                disabled={sendingMessage || !newMessage.trim()}
                className="w-9 h-9 flex items-center justify-center bg-blue text-white rounded-lg hover:bg-blue/90 transition-colors disabled:opacity-50 flex-shrink-0"
              >
                <Send size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // List View
  return (
    <div className="max-w-2xl mx-auto px-4 py-6 pb-28">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-xl font-bold dark:text-white">Disputes</h1>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            Report issues and track resolutions
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-3 py-2 bg-blue text-white text-sm font-medium rounded-lg hover:bg-blue/90 transition-colors"
        >
          <Plus size={16} />
          New Dispute
        </button>
      </div>

      {/* Filter */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {[
          { value: undefined, label: 'All' },
          { value: 'open', label: 'Open' },
          { value: 'under_review', label: 'Under Review' },
          { value: 'resolved', label: 'Resolved' },
          { value: 'closed', label: 'Closed' },
        ].map((item) => (
          <button
            key={item.label}
            onClick={() => setStatusFilter(item.value)}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
              statusFilter === item.value
                ? 'bg-blue text-white border-blue'
                : 'bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-400 border-neutral-200 dark:border-neutral-700'
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Disputes List */}
      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Spin />
        </div>
      ) : disputes.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Empty
            image={<FileText size={48} className="text-neutral-300 dark:text-neutral-600" />}
            description={
              <span className="text-neutral-500 dark:text-neutral-400">No disputes found</span>
            }
          />
        </div>
      ) : (
        <div className="space-y-2">
          {disputes.map((dispute: any) => {
            const status = statusConfig[dispute.status] || statusConfig.open;
            return (
              <button
                key={dispute._id}
                onClick={() => handleViewDispute(dispute._id)}
                className="w-full text-left bg-white dark:bg-neutral-800/60 rounded-xl border border-neutral-200 dark:border-neutral-700/60 p-4 hover:border-blue/30 transition-colors"
              >
                <div className="flex items-start justify-between mb-1.5">
                  <h3 className="text-sm font-semibold dark:text-white line-clamp-1">
                    {dispute.subject}
                  </h3>
                  <Tag color={status.color} className="flex-shrink-0 flex items-center gap-1 ml-2">
                    {status.icon} {status.label}
                  </Tag>
                </div>
                <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-2 mb-2">
                  {dispute.description}
                </p>
                <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                  <span>{disputeTypes.find((t) => t.value === dispute.type)?.label}</span>
                  <span>{new Date(dispute.createdAt).toLocaleDateString()}</span>
                  {dispute.messages?.length > 0 && (
                    <span className="flex items-center gap-0.5">
                      <MessageCircle size={10} /> {dispute.messages.length}
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      )}

      {/* Create Dispute — Full-page on mobile, modal on desktop */}
      {isMobile && showCreateModal ? (
        <div className="fixed inset-0 z-[1100] bg-white dark:bg-neutral-900 overflow-y-auto">
          <div className="sticky top-0 z-10 flex items-center justify-between px-4 h-12 bg-white dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-700/60">
            <h2 className="text-base font-bold dark:text-white">Submit a Dispute</h2>
            <button
              onClick={() => setShowCreateModal(false)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 dark:hover:bg-neutral-800"
            >
              <X size={18} className="text-neutral-500 dark:text-neutral-400" />
            </button>
          </div>
          <div className="px-4 py-5 space-y-4 pb-28">
            <CreateDisputeForm
              createForm={createForm}
              setCreateForm={setCreateForm}
              handleCreate={handleCreate}
              creating={creating}
            />
          </div>
        </div>
      ) : (
        <Modal
          open={showCreateModal}
          onCancel={() => setShowCreateModal(false)}
          footer={null}
          centered
          title={<span className="dark:text-white">Submit a Dispute</span>}
          className="dark-modal"
        >
          <div className="space-y-3 mt-4">
            <CreateDisputeForm
              createForm={createForm}
              setCreateForm={setCreateForm}
              handleCreate={handleCreate}
              creating={creating}
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

const CreateDisputeForm = ({
  createForm,
  setCreateForm,
  handleCreate,
  creating,
}: {
  createForm: { type: string; subject: string; description: string; orderId: string };
  setCreateForm: React.Dispatch<
    React.SetStateAction<{ type: string; subject: string; description: string; orderId: string }>
  >;
  handleCreate: () => void;
  creating: boolean;
}) => (
  <>
    <div>
      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
        Type <span className="text-red-500">*</span>
      </label>
      <Select
        placeholder="Select dispute type"
        value={createForm.type || undefined}
        onChange={(val) => setCreateForm((p) => ({ ...p, type: val }))}
        options={disputeTypes}
        className="w-full !h-11"
      />
    </div>
    <div>
      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
        Subject <span className="text-red-500">*</span>
      </label>
      <Input
        placeholder="Brief summary of the issue"
        value={createForm.subject}
        onChange={(e) => setCreateForm((p) => ({ ...p, subject: e.target.value }))}
        className="!h-11"
      />
    </div>
    <div>
      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
        Order ID <span className="text-neutral-400">(optional)</span>
      </label>
      <Input
        placeholder="Related order ID if applicable"
        value={createForm.orderId}
        onChange={(e) => setCreateForm((p) => ({ ...p, orderId: e.target.value }))}
        className="!h-11"
      />
    </div>
    <div>
      <label className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mb-1 block">
        Description <span className="text-red-500">*</span>
      </label>
      <Input.TextArea
        rows={5}
        placeholder="Describe the issue in detail..."
        value={createForm.description}
        onChange={(e) => setCreateForm((p) => ({ ...p, description: e.target.value }))}
        className="!min-h-[120px]"
      />
    </div>
    <button
      onClick={handleCreate}
      disabled={creating}
      className="w-full py-3 bg-blue text-white text-sm font-medium rounded-lg hover:bg-blue/90 transition-colors disabled:opacity-50"
    >
      {creating ? 'Submitting...' : 'Submit Dispute'}
    </button>
  </>
);

export default DisputesPage;
