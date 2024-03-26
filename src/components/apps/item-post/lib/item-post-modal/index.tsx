import { numberFormat } from '@grc/_shared/helpers';
import { Badge, Col, Input, Row, Space } from 'antd';
import Image from 'next/image';
import React from 'react';
import { ItemPostHeader } from '..';

interface Props {
  // Add your prop types here
  postImgurls: string[];
  askingPrice: Record<string, any>;
  condition: 'Brand New' | 'Fairly Used';
  postUserProfile: Record<string, any>;
  sponsored: boolean;
  comments: Record<string, any>[];
}

const ItemPostModal: React.FC<Props> = (props) => {
  const { postImgurls, askingPrice, condition, postUserProfile, sponsored, comments } = props;
  return (
    <div className="w-full h-full">
      <Row className="w-full">
        <Col md={14} className="bg-blue h-full sticky top-0">
          <div className="w-full relative">
            <Image
              src={postImgurls?.[0] ?? ''}
              alt="item-pic"
              width={900}
              height={100}
              style={{ width: '100%', maxHeight: '700px' }}
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
        </Col>
        <Col md={10} className="min-h-[700px] relative">
          <div className="px-3 min-h-[580px] relative">
            <div className="sticky bg-white top-0 border-b border-b-gray-300 mb-4">
              <ItemPostHeader postUserProfile={postUserProfile} sponsored={sponsored} />
            </div>
            <div className="">
              {comments.map((comment, idx) => {
                return (
                  <div key={idx} className="flex gap-3 mb-4">
                    <Image
                      src={comment?.userDpImageUrl ?? ''}
                      alt="commentor-dp"
                      width={30}
                      height={30}
                      style={{ width: '30px', height: '30px' }}
                      className="rounded-[50%]"
                    />
                    <div>
                      <span className="font-semibold">{comment?.userName ?? 'commentor'} </span>
                      {comment?.message}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="sticky px-3 py-1 w-full border-t border-t-gray-200 bg-white bottom-0">
            <div className="w-full flex justify-between items-center">
              <Space size={10} className="flex items-center">
                <i className="ri-heart-line text-[28px]"></i>
                <i className="ri-chat-1-line text-[28px]"></i>
                <i className="ri-pushpin-line text-[28px]"></i>
              </Space>
              <Space size={10} className="flex items-center">
                <i className="ri-message-2-line text-[28px]"></i>
              </Space>
            </div>{' '}
            <div className="mb-1 text-[14px] font-light">125 Recommended</div>
            <div className="flex justify-between border-t border-t-gray-200 items-center gap-2">
              <Input placeholder="Add a comment" className="h-12 border-none" />
              <span className="text-blue font-semibold cursor-pointer">Post</span>
            </div>
            {/* </Form.Item> */}
            {/* </Form> */}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default ItemPostModal;
