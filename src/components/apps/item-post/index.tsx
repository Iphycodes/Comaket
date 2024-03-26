import React, { useState } from 'react';
import { ItemPostHeader } from './lib';

import ItemPostBody from './lib/item-post-body';
import ItemPostFooter from './lib/item-post-footer';
import { Modal } from 'antd';
import ItemPostModal from './lib/item-post-modal';

interface ItemPostProps {
  // Add your prop types here
  description: string;
  sponsored: boolean;
  postUserProfile: Record<string, any>;
  postImgurls: string[];
  askingPrice: Record<string, any>;
  condition: 'Brand New' | 'Fairly Used';
  comments: Record<string, any>[];
  itemName: string;
}

const ItemPost: React.FC<ItemPostProps> = (props) => {
  const {
    description,
    sponsored,
    postUserProfile,
    postImgurls,
    askingPrice,
    condition,
    comments,
    itemName,
  } = props;
  const [seeFullDescription, setSeeFullDescription] = useState(false);
  const [isItemPostModalOpen, setIsItemPostModalOpen] = useState<boolean>(false);

  return (
    <div className="item-post-container w-full">
      <ItemPostHeader postUserProfile={postUserProfile} sponsored={sponsored} />
      <ItemPostBody postImgUrls={postImgurls} askingPrice={askingPrice} condition={condition} />
      <ItemPostFooter
        seeFullDescription={seeFullDescription}
        setSeeFullDescription={setSeeFullDescription}
        comments={comments}
        itemName={itemName}
        description={description}
        setIsItemPostModalOpen={setIsItemPostModalOpen}
      />
      <Modal
        className="item-post-modal overflow-y-scroll min-w-[1000px] max-h-[700px]"
        title={``}
        open={isItemPostModalOpen}
        onCancel={() => {
          setIsItemPostModalOpen(false);
        }}
        style={{ padding: 0 }}
        footer={null}
        closeIcon={true}
      >
        <ItemPostModal
          postImgurls={postImgurls}
          askingPrice={askingPrice}
          condition={condition}
          postUserProfile={postUserProfile}
          sponsored={sponsored}
          comments={comments}
        />
      </Modal>
    </div>
  );
};

export default ItemPost;
