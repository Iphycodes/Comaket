'use client';

import { Modal } from 'antd';
import React, { Dispatch, SetStateAction } from 'react';

interface Props {
  // Add your prop types here
  isSellItemModalOpen: boolean;
  setIsSellItemModalOpen: Dispatch<SetStateAction<boolean>>;
  setSelectedKey: Dispatch<SetStateAction<string>>;
}

const SellItemModal: React.FC<Props> = (props) => {
  const { isSellItemModalOpen, setIsSellItemModalOpen, setSelectedKey } = props;

  const handleCancel = () => {
    setIsSellItemModalOpen(false);
    setSelectedKey('');
  };

  return (
    <Modal
      width={'600px'}
      className=" min-h-16"
      title={``}
      open={isSellItemModalOpen}
      onCancel={handleCancel}
      footer={null}
    >
      Sell Item Modal
    </Modal>
  );
};

export default SellItemModal;
