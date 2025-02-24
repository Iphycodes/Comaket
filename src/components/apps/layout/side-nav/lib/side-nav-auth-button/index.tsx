import { AuthModal } from '@grc/components/apps/auth-modal';
import { LogOut } from 'lucide-react';
import React, { useState } from 'react';

interface SideNavAuthButtonProps {}

const SideNavAuthButton = ({}: SideNavAuthButtonProps) => {
  const [isAuthenticated] = useState<boolean>(true);

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

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
          className="flex items-center gap-4 py-1 text-blue"
        >
          <LogOut size={16} />
          Sign In
        </span>
        <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      </>
    );
  }

  return (
    <span
      onClick={() => console.log('logout')}
      className="flex items-center gap-3 py-1 text-red-500"
    >
      <LogOut size={16} />
      Logout
    </span>
  );
};

export default SideNavAuthButton;
