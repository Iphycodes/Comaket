import { Col, Row } from 'antd';
import React from 'react';
import SearchBar from './lib/search-bar';
import ItemPost from '../item-post';
import { mockMarketItems } from '@grc/_shared/constant';
import SidePanel from './lib/side-panel';
import FilterPanel from './lib/filter-panel';

interface MarketProps {
  // Add your prop types here
}

const Market: React.FC<MarketProps> = ({}) => {
  const onSearch = () => {
    console.log('searching.....');
  };
  return (
    <Row gutter={[20, 0]} className="w-full">
      <Col lg={14}>
        <div className="w-full">
          <div className="search-bar-container py-2 pt-4 border-b border-b-gray-100 bg-white sticky top-0 z-10 w-full">
            <SearchBar onSearch={onSearch} />
            <FilterPanel />
          </div>
          <div className="px-10">
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
      </Col>
      <Col lg={10}>
        {' '}
        <div className="w-full sticky top-0 px-5 pt-2">
          <SidePanel />
        </div>
      </Col>
    </Row>
  );
};

export default Market;
