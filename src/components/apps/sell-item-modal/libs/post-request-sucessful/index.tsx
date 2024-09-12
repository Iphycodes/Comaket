import { Button } from 'antd';
import Image from 'next/image';
import React from 'react';

const PostRequestSuccessful = () => {
  const handleTrackItemStatus = () => {};
  return (
    <div className="w-full">
      <div
        className="min-h-[460px] max-h-[460px] w-full flex items-center"
        style={
          {
            //   overflowY: 'scroll',
            //   scrollbarWidth: 'thin',
            // scrollbarColor: 'black',
            // scrollbarGutter: 'auto',
          }
        }
      >
        <div className="w-full">
          <div className="flex justify-center text-[28px] font-bold text-center mb-5">
            Sell Item Request sent successfully
          </div>
          <div className="w-full flex justify-center mb-8">
            <Image
              src={'/assets/imgs/post-item-succesful-green-and-black.png'}
              alt="upload-image"
              width={150}
              height={200}
              style={{ width: '200px', height: '200px' }}
              className="rounded-md"
            />
          </div>
          <div className="w-full flex justify-center mb-5">
            <span className="w-[500px] text-center">
              Your request to sell <strong>{`${'Nike Shoe'}`}</strong> with id -{' '}
              <strong>{`${'22309230321'}`}</strong> has been sent successfully... <br />
              This Item will be posted to the market place as soon as all verifications and Fee
              Payment is made. Wish you the best of deals
            </span>
          </div>
          <div className="mt-2 w-full flex gap-4 items-center justify-center">
            <Button
              className="opacity-100 hover:opacity-70 mt-1.5 bg-neutral-900 text-white h-12 rounded-md px-6"
              type="primary"
              block={false}
              onClick={() => handleTrackItemStatus()}
            >
              Close
            </Button>
            <Button
              className="opacity-100 hover:opacity-70 mt-1.5 bg-neutral-900 text-white h-12 rounded-md px-6"
              type="primary"
              block={false}
              onClick={() => handleTrackItemStatus()}
            >
              Track Item Status
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostRequestSuccessful;
