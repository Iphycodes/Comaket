import { mediaSize, useMediaQuery } from '@grc/_shared/components/responsiveness';
import { AuthModal } from '@grc/components/apps/auth-modal';
import { LogOut } from 'lucide-react';
import React, { useState } from 'react';

interface SideNavAuthButtonProps {}

const SideNavAuthButton = ({}: SideNavAuthButtonProps) => {
  const [isAuthenticated] = useState<boolean>(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const isMobile = useMediaQuery(mediaSize.mobile);

  if (isAuthenticated) {
    return (
      //   <Button
      //     type="primary"
      //     className="flex px-8 items-center justify-center bg-blue !h-10 gap-3"
      //   >
      //     <LogIn size={16} />
      //     Sign In
      //   </Button>
      <>
        <span
          onClick={() => setIsAuthModalOpen(true)}
          className={`flex items-center gap-2 px-3 rounded-md py-1 ${
            isMobile ? 'text-sm' : ''
          } bg-indigo-100 text-blue`}
        >
          <LogOut size={isMobile ? 16 : 16} />
          Sign In
        </span>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <span
      onClick={() => console.log('logout')}
      className={`flex items-center gap-2 py-1 ${isMobile ? 'text-sm' : ''} text-red-500`}
    >
      <LogOut size={isMobile ? 16 : 16} />
      Logout
    </span>
  );
};

export default SideNavAuthButton;
