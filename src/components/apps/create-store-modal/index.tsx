'use client';

import { Modal } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

interface Props {
  // Add your prop types here
  isCreateStoreModalOpen: boolean;
  setIsCreateStoreModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedKey: Dispatch<SetStateAction<string>>;
}

const CreateStoreModal: React.FC<Props> = (props) => {
  const { isCreateStoreModalOpen, setIsCreateStoreModalOpen, setSelectedKey } = props;

  const handleCancel = () => {
    setIsCreateStoreModalOpen(false);
    setSelectedKey('');
  };
  return (
    <Modal
      width={'600px'}
      className=" min-h-16"
      title={``}
      open={isCreateStoreModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      Create Store Modal
    </Modal>
  );
};

export default CreateStoreModal;
