import React from 'react';
import PopularVendorAccount from './lib/popular-vendor-account';

interface Props {
  // Add your prop types here
}

const PopularVendors: React.FC<Props> = ({}) => {
  const mockPopularVendors = [
    {
      profilePicUrl: '/assets/imgs/mandate-logo.png',
      userName: 'perfume_plug',
      category: 'Fashion and Beauty',
    },
    {
      profilePicUrl: '/assets/imgs/debit-logo.png',
      businessName: 'Odogwu laptops',
      userName: 'Odg_nigeria',
      category: 'Tech and Accessories',
    },
    {
      profilePicUrl: '/assets/imgs/sneakers.jpg',
      businessName: 'SNEAKER HEAD',
      userName: 'queenie_ng',
      category: 'Clothing',
    },
  ];
  return (
    <div className="flex flex-col gap-3">
      <span className="text-gray-500 font-semibold text-[16px]">Popular Vendors</span>
      <div>
        {mockPopularVendors.map((mockPopularVendors, idx) => {
          return <PopularVendorAccount key={idx} vendorProfile={mockPopularVendors} />;
        })}
      </div>
    </div>
  );
};

export default PopularVendors;
