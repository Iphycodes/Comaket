import { numberFormat } from '@grc/_shared/helpers';
import { Badge, Space } from 'antd';
import Image from 'next/image';
import React from 'react';

interface Props {
  // Add your prop types here
  postImgUrls: string[];
  askingPrice: Record<string, any>;
  condition: 'Brand New' | 'Fairly Used';
}

const ItemPostBody: React.FC<Props> = ({ postImgUrls, askingPrice, condition }) => {
  return (
    <>
      <div className="w-full relative">
        <Image
          src={postImgUrls?.[0] ?? ''}
          alt="item-pic"
          width={900}
          height={100}
          style={{ width: '100%', maxHeight: '600px' }}
        />
        <div className="absolute flex flex-col bottom-2 right-0">
          <span className="font-bold text-[28px] bg-orange-500 text-white px-3 rounded-sm">
            {`${numberFormat(askingPrice?.price / 100 ?? 0, '₦ ')}`}
            <span className="text-[20px] font-semibold">
              {askingPrice?.negotiable && ` (Negotiable)`}
            </span>
          </span>
        </div>
        <Badge
          className="used-status-badge absolute top-3 right-3 text-[16px]"
          // style={{ fontSize: '16px' }}
          count={condition}
          color={condition === 'Brand New' ? 'green' : 'cyan'}
        />
      </div>
      <div className="w-full flex justify-between items-center pt-1">
        <Space size={10} className="flex items-center">
          <i className="ri-thumb-up-line text-[28px]"></i>
          <i className="ri-chat-1-line text-[28px]"></i>
          <i className="ri-pushpin-line text-[28px]"></i>
        </Space>
        <Space size={10} className="flex items-center">
          <i className="ri-message-2-line text-[28px]"></i>
        </Space>
      </div>
      <div className="m-0 mb-1 text-[14px] text-gray-500">125 Recommended</div>
    </>
  );
};

export default ItemPostBody;
