import React from 'react';
import { Modal } from 'antd';
import ItemDetail from '../item-detail';
import { ListingType, MediaItem } from '@grc/_shared/namespace';

interface ItemDetailModalProps {
  open: boolean;
  onClose: () => void;
  item: {
    id: string | number;
    description: string;
    productTags: string[];
    sponsored: boolean;
    postUserProfile: Record<string, any>;
    media: MediaItem[];
    askingPrice: Record<string, any>;
    condition: string;
    comments: Record<string, any>[];
    itemName: string;
    quantity?: number;
    isBuyable: boolean;
    listingType: ListingType;
    status?: 'pending' | 'approved' | 'rejected';
    feePaymentStatus?:
      | 'pending'
      | 'processed'
      | 'awaiting payment'
      | 'awaiting approval'
      | undefined;
    platformFee?: number;
    live?: boolean;
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
      className="item-detail-modal relative !p-0"
    >
      <ItemDetail item={item} onClose={onClose} isSellerView={isSellerView} />
    </Modal>
  );
};

export default ItemDetailModal;
