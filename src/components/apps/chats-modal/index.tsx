'use client';

import { Modal } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

interface Props {
  // Add your prop types here
  isChatsModalOpen: boolean;
  setIsChatsModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedKey: Dispatch<SetStateAction<string>>;
}

const ChatsModal: React.FC<Props> = (props) => {
  const { isChatsModalOpen, setIsChatsModalOpen, setSelectedKey } = props;

  const handleCancel = () => {
    setIsChatsModalOpen(false);
    setSelectedKey('');
  };

  return (
    <Modal
      width={'600px'}
      className=" min-h-16"
      title={``}
      open={isChatsModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      Chats Modal
    </Modal>
  );
};

export default ChatsModal;
