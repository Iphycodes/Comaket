import React from 'react';
import { Modal } from 'antd';
// import {
//   Heart,
//   MessageCircle,
//   Bookmark,
//   Share2,
//   ChevronLeft,
//   ChevronRight,
//   MapPin,
//   Store,
//   Clock,
// } from 'lucide-react';
import ItemDetail from '../item-detail';

interface ItemDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: {
    description: string;
    sponsored: boolean;
    postUserProfile: Record<string, any>;
    postImgurls: string[];
    askingPrice: Record<string, any>;
    condition: string;
    comments: Record<string, any>[];
    itemName: string;
    status: 'pending' | 'approved' | 'rejected';
    feePaymentStatus?:
      | 'pending'
      | 'processed'
      | 'awaiting payment'
      | 'awaiting approval'
      | undefined;
    platformFee: number;
    live: boolean;
  };
  isSellerView?: boolean;
}

const ItemDetailModal: React.FC<ItemDetailModalProps> = ({ open, onClose, item, isSellerView }) => {
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1200}
      className="item-detail-modal relative"
      closeIcon={null}
    >
      <ItemDetail item={item} onClose={onClose} isSellerView={isSellerView} />
    </Modal>
  );
};

export default ItemDetailModal;
