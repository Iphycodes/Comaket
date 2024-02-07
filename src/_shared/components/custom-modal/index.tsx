import { ReactNode } from 'react';
import { Modal } from 'antd';
import { CloseIcon } from '@grc/_shared/assets/svgs';

interface CustomModalProps {
  component: ReactNode;
  setOpenModal: () => void;
  openModal: boolean;
  mask?: boolean;
}

const CustomModal = (props: CustomModalProps) => {
  const { component, openModal, setOpenModal, mask = true } = props;
  return (
    <Modal
      mask={mask}
      open={openModal}
      footer={null}
      width={520}
      styles={{ body: { paddingTop: 45, paddingLeft: 24, paddingRight: 24, paddingBottom: 24 } }}
      className=""
      closeIcon={false}
      onCancel={setOpenModal}
    >
      <div className="relative">
        <CloseIcon
          className="absolute cursor-pointer"
          style={{ top: '-45px', right: '-25px' }}
          onClick={setOpenModal}
        />
      </div>
      {component}
    </Modal>
  );
};

export default CustomModal;
