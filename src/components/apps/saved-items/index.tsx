import { mockMarketItems } from '@grc/_shared/constant';
import React from 'react';
import ItemPost from '../item-post';
import SearchBar from './lib/search-bar';

const SavedItems = () => {
  const onSearch = () => {
    console.log('....searching');
  };
  return (
    <div className="w-full">
      <div className="w-[550px] mx-auto">
        <div className="w-full mb-4">
          <SearchBar onSearch={onSearch} />
        </div>
        {mockMarketItems.map((mockMarketItem, idx) => {
          return (
            <ItemPost
              key={idx}
              postUserProfile={mockMarketItem?.postUserProfile ?? {}}
              sponsored={mockMarketItem?.sponsored ?? false}
              description={mockMarketItem?.description ?? ''}
              postImgurls={mockMarketItem?.postImgUrls ?? []}
              askingPrice={mockMarketItem?.askingPrice ?? {}}
              condition={mockMarketItem?.condition ?? 'Brand New'}
              itemName={mockMarketItem?.itemName ?? ''}
              comments={mockMarketItem?.comments ?? []}
            />
          );
        })}
      </div>
    </div>
  );
};

export default SavedItems;
