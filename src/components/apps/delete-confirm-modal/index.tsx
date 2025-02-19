import React, { useState, useEffect } from 'react';
import { Modal, Input, Typography, Alert } from 'antd';

const { Text } = Typography;

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (itemId: any) => void;
  itemData: Record<string, any>;
}

const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  itemData,
}) => {
  const [confirmationInput, setConfirmationInput] = useState('');
  const [isConfirmEnabled, setIsConfirmEnabled] = useState(false);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (!isOpen) {
      setConfirmationInput('');
      setIsConfirmEnabled(false);
    }
  }, [isOpen]);

  // Check if input matches the item ID
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setConfirmationInput(value);
    setIsConfirmEnabled(value.toString() === itemData?.id?.toString());
  };

  const handleCancel = () => {
    setConfirmationInput('');
    setIsConfirmEnabled(false);
    onClose();
  };

  const handleConfirm = () => {
    if (isConfirmEnabled) {
      onConfirm(itemData?.id);
      handleCancel();
    }
  };

  return (
    <Modal
      title={<Text className="text-xl">Confirm Delete</Text>}
      open={isOpen}
      onCancel={handleCancel}
      width={500}
      footer={[
        <button
          key="cancel"
          onClick={handleCancel}
          className="px-6 py-2 text-gray-600 hover:bg-gray-100 rounded-md transition-colors"
        >
          Cancel
        </button>,
        <button
          key="delete"
          onClick={handleConfirm}
          disabled={!isConfirmEnabled}
          className={`px-6 py-2 rounded-md transition-colors ml-2 ${
            isConfirmEnabled
              ? 'bg-red-500 hover:bg-red-600 text-white'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Delete
        </button>,
      ]}
    >
      <div className="space-y-4">
        <Alert
          type="warning"
          message="Warning"
          description={
            <Text>
              You are about to delete <strong>{itemData.itemName}</strong>
              <br />
              Product ID: <strong>{itemData.id}</strong>
            </Text>
          }
          showIcon
        />

        <div className="space-y-2">
          <Text>
            To confirm deletion, please enter the product ID: <strong>{itemData.id}</strong>
          </Text>
          <Input
            placeholder="Enter product ID to confirm"
            value={confirmationInput}
            onChange={handleInputChange}
            status={confirmationInput && !isConfirmEnabled ? 'error' : ''}
          />
          {confirmationInput && !isConfirmEnabled && (
            <Text className="text-red-500 text-sm">
              Product ID doesn't match. Please check and try again.
            </Text>
          )}
        </div>
      </div>
    </Modal>
  );
};

export default DeleteConfirmModal;
