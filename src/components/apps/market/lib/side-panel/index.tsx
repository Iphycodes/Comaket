import React from 'react';
import SidePanelUserAccount from './lib/side-panel-user-account';
import PopularVendors from './lib/popular-vendors';

interface Props {
  // Add your prop types here
}

const SidePanel: React.FC<Props> = ({}) => {
  const userProfile = {
    profilePicUrl: '/assets/imgs/woman-face.jpg',
    userName: 'queenie_ng',
    name: 'Queen Esther',
  };
  return (
    <div>
      <SidePanelUserAccount userProfile={userProfile} />
      <PopularVendors />
    </div>
  );
};

export default SidePanel;
