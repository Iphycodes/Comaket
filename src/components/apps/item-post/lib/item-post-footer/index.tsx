import { truncateText } from '@grc/_shared/helpers';
import React, { Dispatch, SetStateAction } from 'react';

interface ItemPostFooterProps {
  seeFullDescription: boolean;
  setSeeFullDescription: Dispatch<SetStateAction<boolean>>;
  setIsItemPostModalOpen: Dispatch<SetStateAction<boolean>>;
  description: string;
  itemName: string;
  comments: Record<string, any>[];
}

const ItemPostFooter: React.FC<ItemPostFooterProps> = (props) => {
  const {
    seeFullDescription,
    setSeeFullDescription,
    description,
    itemName,
    comments,
    setIsItemPostModalOpen,
  } = props;
  return (
    <>
      <div className="w-full flex flex-col py-1 gap-1 mb-1">
        <span className="font-semibold text-[22px]">{itemName ?? `Product`}</span>
        <div className="flex items-center gap-1 font-semibold">
          <i className="ri-map-pin-2-line text-[20px] text-gray-700"></i>
          <span>Kaduna State, Zaria ...</span>
        </div>
        <span id="desc-span" className="whitespace-pre-line">
          {seeFullDescription ? description : truncateText(description)}{' '}
          <span
            onClick={() => setSeeFullDescription(!seeFullDescription)}
            className="text-gray-400 font-semibold cursor-pointer"
          >
            {seeFullDescription ? '\n see less' : `more`}
          </span>
        </span>
      </div>
      {comments.length > 0 && (
        <div className="w-full flex flex-col gap-1 mb-5">
          <span
            onClick={() => setIsItemPostModalOpen(true)}
            className="cursor-pointer text-gray-500"
          >
            {`View All ${comments.length ?? 0} comments`}
          </span>
        </div>
      )}
      <div className="w-full">
        <hr />
      </div>
    </>
  );
};

export default ItemPostFooter;
