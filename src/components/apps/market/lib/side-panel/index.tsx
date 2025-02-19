import React from 'react';
import ComingSoon from './lib/coming-soon';

interface Props {
  // Add your prop types here
}

const SidePanel: React.FC<Props> = ({}) => {
  // const userProfile = {
  //   profilePicUrl: '/assets/imgs/woman-face.jpg',
  //   userName: 'queenie_ng',
  //   name: 'Queen Esther',
  // };
  return (
    <div>
      {/* <SidePanelUserAccount userProfile={userProfile} />
      <PopularVendors /> */}
      <ComingSoon header={<div className="text-[28px] font-bold">Vendor Store</div>} />
    </div>
  );
};

export default SidePanel;
