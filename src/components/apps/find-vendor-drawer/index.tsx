import React, { useRef, useState } from 'react';
import { Input, InputRef, Layout } from 'antd';
import VendorAccount from './lib/vendorAccount';

const { Sider } = Layout;
interface LeftDrawerProps {
  toggleFindVendorDrawer: boolean;
}

const FindVendorDrawer: React.FC<LeftDrawerProps> = ({ toggleFindVendorDrawer }) => {
  const inputRef = useRef<InputRef>(null);
  const [isIconVisible, setIsIconVisible] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const handleFocus = () => {
    setIsIconVisible(false);
  };

  const handleBlur = () => {
    if (inputRef?.current) {
      if (inputRef?.current?.input) {
        if (inputRef.current && !inputRef?.current?.input.contains(document.activeElement)) {
          setIsIconVisible(true);
        }
      }
    }
  };

  const handleClearInput = () => {
    setIsIconVisible(false);
    if (inputRef.current) {
      inputRef.current.focus(); // Focus back on the input after clearing
    }
    setInputValue(''); // Clear the input value when the suffix icon is clicked
  };
  const mockVendors = [
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
    {
      profilePicUrl: '/assets/imgs/sneakers.jpg',
      businessName: 'SNEAKER HEAD',
      userName: 'queenie_ng',
      category: 'Clothing',
    },
    {
      profilePicUrl: '/assets/imgs/sneakers.jpg',
      businessName: 'SNEAKER HEAD',
      userName: 'queenie_ng',
      category: 'Clothing',
    },
  ];
  return (
    <Sider
      collapsed={toggleFindVendorDrawer}
      collapsedWidth={0}
      className="dash-sider rounded-r-2xl border-r border-r-gray-200 rounded-br-3xl p-0 text-lg shadow-2xl shadow-gray-400"
      width={400}
      style={{
        overflow: 'auto',
        position: 'fixed',
        padding: '0',
        height: '100vh',
        scrollbarWidth: 'thin',
        // scrollbarColor: 'black',
        left: 80,
        top: 0,
        bottom: 0,
        zIndex: 10,
      }}
    >
      <div className="pb-2 sticky top-0 bg-white z-50">
        <div className="px-5 py-3 border-b border-b-gray-300">
          <div className="my-6 mb-10">
            <h1 className="text-[24px] font-semibold">Find Vendor</h1>
          </div>
          <div className="py-4">
            <Input
              ref={inputRef}
              onFocus={handleFocus}
              onBlur={handleBlur}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              prefix={isIconVisible && <i className="ri-search-line text-gray-400"></i>}
              suffix={
                <i
                  className="ri-close-circle-fill cursor-pointer text-gray-400"
                  onClick={handleClearInput}
                ></i>
              }
              placeholder="Search Vendor"
              className="h-10 text-[16px] bg-gray-100 find-vendor-input"
            />
          </div>
        </div>
      </div>
      <div className="overflow-y-scroll">
        <div className="px-5 py-3 flex items-center justify-between">
          <span className="font-semibold text-[14px]">Recent</span>
          <span className="font-semibold text-[14px] text-blue cursor-pointer">Clear All</span>
        </div>
        <div className="px-5">
          {mockVendors.map((mockVendor, idx) => {
            return <VendorAccount key={idx} vendorProfile={mockVendor} />;
          })}
        </div>
      </div>
    </Sider>
  );
};

export default FindVendorDrawer;
